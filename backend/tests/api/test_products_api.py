"""API-contract tests for the TouristicProductItem router."""

from __future__ import annotations

import unittest

from fastapi.testclient import TestClient
from support.fake_entity_repository import FakeEntityRepository

from cct.api.app import create_app
from cct.api.dependencies import get_current_actor, get_partner_repository, get_product_repository


def flight_payload(entity_id: str = "I21-FLIGHT", **overrides: object) -> dict[str, object]:
    properties = {
        "flightNumber": "500",
        "departureLocationCode": "FRA",
        "arrivalLocationCode": "GIG",
        "scheduledDepartureLocalTime": "10:30:00",
        "scheduledArrivalLocalTime": "18:45:00",
    }
    properties.update(overrides)
    return {"entityId": entity_id, "product": {"type": "product/flight", "properties": properties}}


class ProductsApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.repository = FakeEntityRepository()
        self.app = create_app()
        self.app.dependency_overrides[get_product_repository] = lambda: self.repository
        self.app.dependency_overrides[get_partner_repository] = lambda: self.repository
        self.app.dependency_overrides[get_current_actor] = lambda: None
        self.client = TestClient(self.app, raise_server_exceptions=False)

    def test_create_product_returns_201(self) -> None:
        response = self.client.post("/products", json=flight_payload())
        self.assertEqual(201, response.status_code)
        self.assertEqual("product/flight", response.json()["type"])

    def test_create_product_duplicate_returns_409(self) -> None:
        self.client.post("/products", json=flight_payload())
        response = self.client.post("/products", json=flight_payload())
        self.assertEqual(409, response.status_code)

    def test_create_component_requires_existing_parent(self) -> None:
        response = self.client.post(
            "/products",
            json={
                "entityId": "I21-SEAT",
                "parentProductId": "MISSING",
                "product": {"type": "product/flight/seat", "properties": {"seatNumber": "5A"}},
            },
        )
        self.assertEqual(404, response.status_code)

    def test_get_product_returns_404_for_missing(self) -> None:
        response = self.client.get("/products/MISSING")
        self.assertEqual(404, response.status_code)

    def test_list_products_filters_by_type(self) -> None:
        self.client.post("/products", json=flight_payload("I21-FLIGHT-1"))
        self.client.post(
            "/products",
            json={
                "entityId": "I21-ROOM",
                "product": {"type": "product/hotel/room-category", "properties": {"roomTypeCode": "room/double"}},
            },
        )
        response = self.client.get("/products", params={"type": "product/flight"})
        self.assertEqual(200, response.status_code)
        self.assertEqual(["I21-FLIGHT-1"], [item["entityId"] for item in response.json()["items"]])

    def test_update_product_replaces_properties(self) -> None:
        self.client.post("/products", json=flight_payload())
        response = self.client.put(
            "/products/I21-FLIGHT",
            json={"product": {"type": "product/flight", "properties": flight_payload()["product"]["properties"] | {"flightNumber": "600"}}},
        )
        self.assertEqual(200, response.status_code)
        self.assertEqual("600", response.json()["properties"]["flightNumber"])

    def test_delete_product_returns_204(self) -> None:
        self.client.post("/products", json=flight_payload())
        response = self.client.delete("/products/I21-FLIGHT")
        self.assertEqual(204, response.status_code)

    def test_recursive_component_tree_endpoint(self) -> None:
        self.client.post("/products", json=flight_payload("I21-PKG"))
        self.client.post(
            "/products",
            json={
                "entityId": "I21-FLIGHT-2",
                "parentProductId": "I21-PKG",
                "product": {"type": "product/flight", "properties": flight_payload()["product"]["properties"]},
            },
        )
        self.client.post(
            "/products",
            json={
                "entityId": "I21-SEAT-1",
                "parentProductId": "I21-FLIGHT-2",
                "product": {"type": "product/flight/seat", "properties": {"seatNumber": "5A"}},
            },
        )
        response = self.client.get("/products/I21-PKG/components")
        self.assertEqual(200, response.status_code)
        by_id = {item["entityId"]: item["parentProductId"] for item in response.json()}
        self.assertEqual({"I21-PKG": None, "I21-FLIGHT-2": "I21-PKG", "I21-SEAT-1": "I21-FLIGHT-2"}, by_id)

    def test_set_supplier_requires_existing_role(self) -> None:
        self.client.post("/products", json=flight_payload())
        response = self.client.put("/products/I21-FLIGHT/supplier", json={"supplierRoleId": "MISSING"})
        self.assertEqual(404, response.status_code)

    def test_set_supplier_succeeds_with_existing_role(self) -> None:
        self.client.post("/products", json=flight_payload())
        self.repository.save(
            {"entityId": "I21-SUPPLIER", "entityKind": "Organisation", "properties": {"name": "Condorleaf Air"}}
        )
        self.repository.save(
            {
                "entityId": "I21-SUPPLIER-ROLE",
                "entityKind": "OrgaRole",
                "type": "partner/supplier/airline",
                "properties": {"airlineDesignator": "0Q"},
            }
        )
        response = self.client.put("/products/I21-FLIGHT/supplier", json={"supplierRoleId": "I21-SUPPLIER-ROLE"})
        self.assertEqual(204, response.status_code)


if __name__ == "__main__":
    unittest.main()
