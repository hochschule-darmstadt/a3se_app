"""API-contract tests for the Person/PersonRole router, dependencies explicitly overridden."""

from __future__ import annotations

import unittest

from fastapi.testclient import TestClient
from support.fake_entity_repository import FakeEntityRepository

from cct.api.app import create_app
from cct.api.dependencies import get_current_actor, get_person_repository


def person_payload(entity_id: str = "I21-PER-01", **overrides: object) -> dict[str, object]:
    properties = {"givenName": "Emil", "familyName": "Brandt"}
    properties.update(overrides)
    return {"entityId": entity_id, "properties": properties}


class PersonsApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.repository = FakeEntityRepository()
        self.app = create_app()
        self.app.dependency_overrides[get_person_repository] = lambda: self.repository
        self.app.dependency_overrides[get_current_actor] = lambda: None
        # raise_server_exceptions=False: Starlette's ServerErrorMiddleware re-raises
        # after sending the response from a registered Exception handler (by
        # design, so an ASGI server can still log it); the default TestClient
        # would otherwise surface that re-raise to the test instead of the
        # response, which test_mutating_route_invokes_actor_dependency needs.
        self.client = TestClient(self.app, raise_server_exceptions=False)

    def test_create_person_returns_201_and_body(self) -> None:
        response = self.client.post("/persons", json=person_payload())
        self.assertEqual(201, response.status_code)
        body = response.json()
        self.assertEqual("I21-PER-01", body["entityId"])
        self.assertEqual("Emil", body["properties"]["givenName"])
        self.assertEqual("Emil Brandt", body["displayName"])
        self.assertEqual(["Emil Brandt"], body["displayNameChain"])

    def test_create_person_duplicate_returns_409(self) -> None:
        self.client.post("/persons", json=person_payload())
        response = self.client.post("/persons", json=person_payload())
        self.assertEqual(409, response.status_code)
        self.assertEqual("duplicate", response.json()["type"])

    def test_create_person_missing_required_field_returns_422(self) -> None:
        response = self.client.post(
            "/persons", json={"entityId": "I21-PER-01", "properties": {"givenName": "Emil"}}
        )
        self.assertEqual(422, response.status_code)
        self.assertEqual("validation_failed", response.json()["type"])

    def test_get_person_returns_404_for_missing(self) -> None:
        response = self.client.get("/persons/MISSING")
        self.assertEqual(404, response.status_code)
        self.assertEqual("not_found", response.json()["type"])

    def test_get_person_returns_200_for_existing(self) -> None:
        self.client.post("/persons", json=person_payload())
        response = self.client.get("/persons/I21-PER-01")
        self.assertEqual(200, response.status_code)
        self.assertEqual("I21-PER-01", response.json()["entityId"])

    def test_list_persons_returns_page_with_items(self) -> None:
        self.client.post("/persons", json=person_payload("I21-PER-01"))
        self.client.post("/persons", json=person_payload("I21-PER-02", givenName="Sarah"))
        response = self.client.get("/persons", params={"limit": 10})
        self.assertEqual(200, response.status_code)
        body = response.json()
        self.assertEqual(["I21-PER-01", "I21-PER-02"], [item["entityId"] for item in body["items"]])
        self.assertIsNone(body["nextCursor"])

    def test_list_persons_pagination_returns_cursor_when_more_remain(self) -> None:
        self.client.post("/persons", json=person_payload("I21-PER-01"))
        self.client.post("/persons", json=person_payload("I21-PER-02"))
        response = self.client.get("/persons", params={"limit": 1})
        body = response.json()
        self.assertEqual(1, len(body["items"]))
        self.assertIsNotNone(body["nextCursor"])
        next_response = self.client.get("/persons", params={"limit": 1, "cursor": body["nextCursor"]})
        self.assertEqual("I21-PER-02", next_response.json()["items"][0]["entityId"])

    def test_update_person_replaces_properties(self) -> None:
        self.client.post("/persons", json=person_payload())
        response = self.client.put(
            "/persons/I21-PER-01",
            json={"properties": {"givenName": "Emil", "familyName": "Novak"}},
        )
        self.assertEqual(200, response.status_code)
        self.assertEqual("Novak", response.json()["properties"]["familyName"])

    def test_update_person_missing_returns_404(self) -> None:
        response = self.client.put(
            "/persons/MISSING", json={"properties": {"givenName": "Emil", "familyName": "Brandt"}}
        )
        self.assertEqual(404, response.status_code)

    def test_delete_person_returns_204(self) -> None:
        self.client.post("/persons", json=person_payload())
        response = self.client.delete("/persons/I21-PER-01")
        self.assertEqual(204, response.status_code)
        self.assertEqual(404, self.client.get("/persons/I21-PER-01").status_code)

    def test_delete_person_missing_returns_404(self) -> None:
        response = self.client.delete("/persons/MISSING")
        self.assertEqual(404, response.status_code)

    def test_create_person_role_success_with_customer_type(self) -> None:
        self.client.post("/persons", json=person_payload())
        response = self.client.post(
            "/persons/I21-PER-01/roles",
            json={"entityId": "I21-ROLE-01", "role": {"type": "person/customer", "properties": {}}},
        )
        self.assertEqual(201, response.status_code)
        body = response.json()
        self.assertEqual("person/customer", body["type"])
        self.assertEqual("Customer", body["displayName"])
        self.assertEqual(["Emil Brandt", "Customer"], body["displayNameChain"])

    def test_create_person_role_missing_person_returns_404(self) -> None:
        response = self.client.post(
            "/persons/MISSING/roles",
            json={"entityId": "I21-ROLE-01", "role": {"type": "person/traveller", "properties": {}}},
        )
        self.assertEqual(404, response.status_code)

    def test_create_person_role_unknown_type_returns_422(self) -> None:
        self.client.post("/persons", json=person_payload())
        response = self.client.post(
            "/persons/I21-PER-01/roles",
            json={"entityId": "I21-ROLE-01", "role": {"type": "person/unknown", "properties": {}}},
        )
        self.assertEqual(422, response.status_code)

    def test_list_person_roles_returns_created_roles(self) -> None:
        self.client.post("/persons", json=person_payload())
        self.client.post(
            "/persons/I21-PER-01/roles",
            json={"entityId": "I21-ROLE-01", "role": {"type": "person/traveller", "properties": {}}},
        )
        response = self.client.get("/persons/I21-PER-01/roles")
        self.assertEqual(200, response.status_code)
        self.assertEqual(["I21-ROLE-01"], [role["entityId"] for role in response.json()])

    def test_delete_person_role_returns_204(self) -> None:
        self.client.post("/persons", json=person_payload())
        self.client.post(
            "/persons/I21-PER-01/roles",
            json={"entityId": "I21-ROLE-01", "role": {"type": "person/traveller", "properties": {}}},
        )
        response = self.client.delete("/persons/I21-PER-01/roles/I21-ROLE-01")
        self.assertEqual(204, response.status_code)

    def test_delete_person_blocked_while_role_exists_returns_409(self) -> None:
        self.client.post("/persons", json=person_payload())
        self.client.post(
            "/persons/I21-PER-01/roles",
            json={"entityId": "I21-ROLE-01", "role": {"type": "person/traveller", "properties": {}}},
        )
        response = self.client.delete("/persons/I21-PER-01")
        self.assertEqual(409, response.status_code)
        self.assertEqual("conflict", response.json()["type"])

    def test_mutating_route_invokes_actor_dependency(self) -> None:
        def failing_actor() -> None:
            raise RuntimeError("actor dependency invoked")

        self.app.dependency_overrides[get_current_actor] = failing_actor
        response = self.client.post("/persons", json=person_payload())
        self.assertEqual(500, response.status_code)

    def test_read_route_does_not_require_actor_dependency(self) -> None:
        def failing_actor() -> None:
            raise RuntimeError("actor dependency invoked")

        self.app.dependency_overrides[get_current_actor] = failing_actor
        response = self.client.get("/persons/MISSING")
        self.assertEqual(404, response.status_code)


if __name__ == "__main__":
    unittest.main()
