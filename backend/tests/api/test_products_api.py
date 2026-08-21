"""API-contract tests for the TouristicProductItem router."""

from __future__ import annotations

import unittest

from fastapi.testclient import TestClient
from support.fake_entity_repository import FakeEntityRepository

from cct.api.app import create_app
from cct.api.dependencies import get_current_actor, get_partner_repository, get_product_repository
from cct.resource_management.contracts import EntityKind
from cct.resource_management.relationship_types import RelationshipType


def flight_payload(entity_id: str = "I21-FLIGHT", **overrides: object) -> dict[str, object]:
    properties = {
        "flightNumber": "500",
        "departureLocationCode": "FRA",
        "arrivalLocationCode": "GIG",
        "scheduledDepartureLocalTime": "10:30:00",
        "scheduledArrivalLocalTime": "18:45:00",
    }
    properties.update(overrides)
    return {"entityId": entity_id, "product": {"type": "product/airline/flight", "properties": properties}}


class ProductsApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.repository = FakeEntityRepository()
        self.app = create_app()
        self.app.dependency_overrides[get_product_repository] = lambda: self.repository
        self.app.dependency_overrides[get_partner_repository] = lambda: self.repository
        self.app.dependency_overrides[get_current_actor] = lambda: None
        self.client = TestClient(self.app, raise_server_exceptions=False)

    def link_airline_supplier(self, product_id: str, suffix: str = "") -> None:
        organisation_id = f"I21-SUPPLIER{suffix}"
        role_id = f"I21-SUPPLIER-ROLE{suffix}"
        self.repository.save(
            {"entityId": organisation_id, "entityKind": "Organisation", "properties": {"name": "Condorleaf Air"}}
        )
        self.repository.save(
            {
                "entityId": role_id,
                "entityKind": "OrgaRole",
                "type": "organisation/airline",
                "properties": {"airlineDesignator": "0Q"},
            }
        )
        self.repository.create_relationship(
            from_kind=EntityKind.ORGANISATION,
            from_id=organisation_id,
            relationship=RelationshipType.HAS_ROLE,
            to_kind=EntityKind.ORGA_ROLE,
            to_id=role_id,
        )
        response = self.client.put(f"/products/{product_id}/supplier", json={"supplierRoleId": role_id})
        self.assertEqual(204, response.status_code)

    def test_create_product_returns_201(self) -> None:
        response = self.client.post("/products", json=flight_payload())
        self.assertEqual(201, response.status_code)
        self.assertEqual("product/airline/flight", response.json()["type"])

    def test_create_product_duplicate_returns_409(self) -> None:
        self.client.post("/products", json=flight_payload())
        response = self.client.post("/products", json=flight_payload())
        self.assertEqual(409, response.status_code)

    def test_create_product_rejects_derived_display_fields(self) -> None:
        payload = flight_payload()
        payload["displayName"] = "client supplied"
        response = self.client.post("/products", json=payload)
        self.assertEqual(422, response.status_code)

        nested_payload = flight_payload("I21-FLIGHT-NESTED", displayName="client supplied")
        response = self.client.post("/products", json=nested_payload)
        self.assertEqual(422, response.status_code)

    def test_create_component_requires_existing_parent(self) -> None:
        response = self.client.post(
            "/products",
            json={
                "entityId": "I21-SEAT",
                "parentProductId": "MISSING",
                "product": {"type": "product/airline/flight/seat", "properties": {"seatNumber": "5A"}},
            },
        )
        self.assertEqual(404, response.status_code)

    def test_get_product_returns_404_for_missing(self) -> None:
        response = self.client.get("/products/MISSING")
        self.assertEqual(404, response.status_code)

    def test_list_products_filters_by_type(self) -> None:
        self.client.post("/products", json=flight_payload("I21-FLIGHT-1"))
        self.link_airline_supplier("I21-FLIGHT-1")
        self.client.post(
            "/products",
            json={
                "entityId": "I21-ROOM",
                "product": {"type": "product/accommodation/room-type", "properties": {"roomTypeCode": "room/double"}},
            },
        )
        response = self.client.get("/products", params={"type": "product/airline/flight"})
        self.assertEqual(200, response.status_code)
        self.assertEqual(["I21-FLIGHT-1"], [item["entityId"] for item in response.json()["items"]])
        self.assertEqual("0Q500 FRA–GIG", response.json()["items"][0]["displayName"])
        self.assertEqual(
            ["Condorleaf Air", "Airline", "0Q500 FRA–GIG"], response.json()["items"][0]["displayNameChain"]
        )

    def test_update_product_replaces_properties(self) -> None:
        self.client.post("/products", json=flight_payload())
        response = self.client.put(
            "/products/I21-FLIGHT",
            json={"product": {"type": "product/airline/flight", "properties": flight_payload()["product"]["properties"] | {"flightNumber": "600"}}},
        )
        self.assertEqual(200, response.status_code)
        self.assertEqual("600", response.json()["properties"]["flightNumber"])

    def test_delete_product_returns_204(self) -> None:
        self.client.post("/products", json=flight_payload())
        response = self.client.delete("/products/I21-FLIGHT")
        self.assertEqual(204, response.status_code)

    def test_recursive_component_tree_endpoint(self) -> None:
        self.client.post("/products", json=flight_payload("I21-PKG"))
        self.link_airline_supplier("I21-PKG")
        self.client.post(
            "/products",
            json={
                "entityId": "I21-FLIGHT-2",
                "parentProductId": "I21-PKG",
                "product": {"type": "product/airline/flight", "properties": flight_payload()["product"]["properties"]},
            },
        )
        self.link_airline_supplier("I21-FLIGHT-2", "-NESTED")
        self.client.post(
            "/products",
            json={
                "entityId": "I21-SEAT-1",
                "parentProductId": "I21-FLIGHT-2",
                "product": {"type": "product/airline/flight/seat", "properties": {"seatNumber": "5A"}},
            },
        )
        response = self.client.get("/products/I21-PKG/components")
        self.assertEqual(200, response.status_code)
        by_id = {item["entityId"]: item["parentProductId"] for item in response.json()}
        self.assertEqual({"I21-PKG": None, "I21-FLIGHT-2": "I21-PKG", "I21-SEAT-1": "I21-FLIGHT-2"}, by_id)
        seat = next(item for item in response.json() if item["entityId"] == "I21-SEAT-1")
        self.assertEqual("5A", seat["displayName"])
        self.assertEqual("5A", seat["displayNameChain"][-1])

    def test_get_flight_without_supplier_returns_invalid_graph(self) -> None:
        self.client.post("/products", json=flight_payload())
        response = self.client.get("/products/I21-FLIGHT")
        self.assertEqual(409, response.status_code)
        self.assertEqual("invalid_entity_graph", response.json()["type"])

    def test_set_supplier_requires_existing_role(self) -> None:
        self.client.post("/products", json=flight_payload())
        response = self.client.put("/products/I21-FLIGHT/supplier", json={"supplierRoleId": "MISSING"})
        self.assertEqual(404, response.status_code)

    def test_get_ancestors_returns_root_first_chain(self) -> None:
        self.client.post("/products", json=flight_payload("I21-PKG"))
        self.link_airline_supplier("I21-PKG")
        self.client.post(
            "/products",
            json={
                "entityId": "I21-CAT",
                "parentProductId": "I21-PKG",
                "product": {"type": "product/accommodation/room-type", "properties": {"roomTypeCode": "room/double"}},
            },
        )
        response = self.client.get("/products/I21-CAT/ancestors")
        self.assertEqual(200, response.status_code)
        self.assertEqual(["I21-PKG"], [item["entityId"] for item in response.json()])

    def test_get_ancestors_returns_empty_list_for_a_root(self) -> None:
        self.client.post("/products", json=flight_payload("I21-PKG"))
        response = self.client.get("/products/I21-PKG/ancestors")
        self.assertEqual(200, response.status_code)
        self.assertEqual([], response.json())

    def test_get_ancestors_returns_404_for_missing_product(self) -> None:
        response = self.client.get("/products/MISSING/ancestors")
        self.assertEqual(404, response.status_code)

    def test_get_supplier_returns_null_when_unset(self) -> None:
        self.client.post("/products", json=flight_payload())
        response = self.client.get("/products/I21-FLIGHT/supplier")
        self.assertEqual(200, response.status_code)
        self.assertIsNone(response.json())

    def test_get_supplier_returns_404_for_missing_product(self) -> None:
        response = self.client.get("/products/MISSING/supplier")
        self.assertEqual(404, response.status_code)

    def test_get_supplier_returns_the_supplying_role_after_set(self) -> None:
        self.client.post("/products", json=flight_payload())
        self.repository.save(
            {"entityId": "I21-SUPPLIER", "entityKind": "Organisation", "properties": {"name": "Condorleaf Air"}}
        )
        self.repository.save(
            {
                "entityId": "I21-SUPPLIER-ROLE",
                "entityKind": "OrgaRole",
                "type": "organisation/airline",
                "properties": {"airlineDesignator": "0Q"},
            }
        )
        self.repository.create_relationship(
            from_kind=EntityKind.ORGANISATION,
            from_id="I21-SUPPLIER",
            relationship=RelationshipType.HAS_ROLE,
            to_kind=EntityKind.ORGA_ROLE,
            to_id="I21-SUPPLIER-ROLE",
        )
        self.client.put("/products/I21-FLIGHT/supplier", json={"supplierRoleId": "I21-SUPPLIER-ROLE"})
        response = self.client.get("/products/I21-FLIGHT/supplier")
        self.assertEqual(200, response.status_code)
        self.assertEqual("I21-SUPPLIER-ROLE", response.json()["entityId"])

    def test_set_supplier_succeeds_with_existing_role(self) -> None:
        self.client.post("/products", json=flight_payload())
        self.repository.save(
            {"entityId": "I21-SUPPLIER", "entityKind": "Organisation", "properties": {"name": "Condorleaf Air"}}
        )
        self.repository.save(
            {
                "entityId": "I21-SUPPLIER-ROLE",
                "entityKind": "OrgaRole",
                "type": "organisation/airline",
                "properties": {"airlineDesignator": "0Q"},
            }
        )
        response = self.client.put("/products/I21-FLIGHT/supplier", json={"supplierRoleId": "I21-SUPPLIER-ROLE"})
        self.assertEqual(204, response.status_code)


if __name__ == "__main__":
    unittest.main()
