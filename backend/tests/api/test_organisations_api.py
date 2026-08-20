"""API-contract tests for the Organisation/OrgaRole router, dependencies explicitly overridden."""

from __future__ import annotations

import unittest

from fastapi.testclient import TestClient
from support.fake_entity_repository import FakeEntityRepository

from cct.api.app import create_app
from cct.api.dependencies import get_current_actor, get_partner_repository


def organisation_payload(entity_id: str = "I21-ORG-01", **overrides: object) -> dict[str, object]:
    properties = {"name": "Condorleaf Air"}
    properties.update(overrides)
    return {"entityId": entity_id, "properties": properties}


class OrganisationsApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.repository = FakeEntityRepository()
        self.app = create_app()
        self.app.dependency_overrides[get_partner_repository] = lambda: self.repository
        self.app.dependency_overrides[get_current_actor] = lambda: None
        self.client = TestClient(self.app, raise_server_exceptions=False)

    def test_create_organisation_returns_201_and_body(self) -> None:
        response = self.client.post("/organisations", json=organisation_payload())
        self.assertEqual(201, response.status_code)
        self.assertEqual("Condorleaf Air", response.json()["properties"]["name"])

    def test_create_organisation_duplicate_returns_409(self) -> None:
        self.client.post("/organisations", json=organisation_payload())
        response = self.client.post("/organisations", json=organisation_payload())
        self.assertEqual(409, response.status_code)

    def test_get_organisation_returns_404_for_missing(self) -> None:
        response = self.client.get("/organisations/MISSING")
        self.assertEqual(404, response.status_code)

    def test_list_organisations_returns_page(self) -> None:
        self.client.post("/organisations", json=organisation_payload())
        response = self.client.get("/organisations")
        self.assertEqual(200, response.status_code)
        self.assertEqual(1, len(response.json()["items"]))

    def test_update_organisation_replaces_properties(self) -> None:
        self.client.post("/organisations", json=organisation_payload())
        response = self.client.put("/organisations/I21-ORG-01", json={"properties": {"name": "Renamed Air"}})
        self.assertEqual(200, response.status_code)
        self.assertEqual("Renamed Air", response.json()["properties"]["name"])

    def test_delete_organisation_returns_204(self) -> None:
        self.client.post("/organisations", json=organisation_payload())
        response = self.client.delete("/organisations/I21-ORG-01")
        self.assertEqual(204, response.status_code)

    def test_create_airline_role_success(self) -> None:
        self.client.post("/organisations", json=organisation_payload())
        response = self.client.post(
            "/organisations/I21-ORG-01/roles",
            json={
                "entityId": "I21-ROLE-01",
                "role": {"type": "partner/supplier/airline", "properties": {"airlineDesignator": "0Q"}},
            },
        )
        self.assertEqual(201, response.status_code)
        self.assertEqual("0Q", response.json()["properties"]["airlineDesignator"])

    def test_create_empty_supplier_role_variant_succeeds(self) -> None:
        self.client.post("/organisations", json=organisation_payload())
        response = self.client.post(
            "/organisations/I21-ORG-01/roles",
            json={"entityId": "I21-ROLE-02", "role": {"type": "partner/supplier/accommodation", "properties": {}}},
        )
        self.assertEqual(201, response.status_code)
        self.assertEqual("partner/supplier/accommodation", response.json()["type"])

    def test_create_role_missing_organisation_returns_404(self) -> None:
        response = self.client.post(
            "/organisations/MISSING/roles",
            json={
                "entityId": "I21-ROLE-01",
                "role": {"type": "partner/supplier/airline", "properties": {"airlineDesignator": "0Q"}},
            },
        )
        self.assertEqual(404, response.status_code)

    def test_create_role_unknown_type_returns_422(self) -> None:
        self.client.post("/organisations", json=organisation_payload())
        response = self.client.post(
            "/organisations/I21-ORG-01/roles",
            json={"entityId": "I21-ROLE-01", "role": {"type": "partner/supplier/unknown", "properties": {}}},
        )
        self.assertEqual(422, response.status_code)

    def test_get_organisation_for_role_returns_owner(self) -> None:
        self.client.post("/organisations", json=organisation_payload())
        self.client.post(
            "/organisations/I21-ORG-01/roles",
            json={"entityId": "I21-ROLE-01", "role": {"type": "partner/supplier/accommodation", "properties": {}}},
        )
        response = self.client.get("/organisations/roles/I21-ROLE-01/organisation")
        self.assertEqual(200, response.status_code)
        self.assertEqual("I21-ORG-01", response.json()["entityId"])

    def test_get_organisation_for_role_returns_404_for_missing_role(self) -> None:
        response = self.client.get("/organisations/roles/MISSING/organisation")
        self.assertEqual(404, response.status_code)

    def test_delete_organisation_blocked_while_role_exists_returns_409(self) -> None:
        self.client.post("/organisations", json=organisation_payload())
        self.client.post(
            "/organisations/I21-ORG-01/roles",
            json={
                "entityId": "I21-ROLE-01",
                "role": {"type": "partner/supplier/airline", "properties": {"airlineDesignator": "0Q"}},
            },
        )
        response = self.client.delete("/organisations/I21-ORG-01")
        self.assertEqual(409, response.status_code)


if __name__ == "__main__":
    unittest.main()
