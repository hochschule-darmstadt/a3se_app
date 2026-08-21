"""API-contract tests for the OrderItem router, including the full cross-module chain."""

from __future__ import annotations

import unittest

from fastapi.testclient import TestClient
from support.fake_entity_repository import FakeEntityRepository

from cct.api.app import create_app
from cct.api.dependencies import (
    get_current_actor,
    get_order_repository,
    get_partner_repository,
    get_person_repository,
    get_product_repository,
    get_stock_repository,
)


class OrdersApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.repository = FakeEntityRepository()
        self.app = create_app()
        for dependency in (
            get_order_repository,
            get_partner_repository,
            get_person_repository,
            get_product_repository,
            get_stock_repository,
        ):
            self.app.dependency_overrides[dependency] = lambda: self.repository
        self.app.dependency_overrides[get_current_actor] = lambda: None
        self.client = TestClient(self.app, raise_server_exceptions=False)

    def test_create_order_returns_201(self) -> None:
        response = self.client.post(
            "/orders", json={"entityId": "I21-ORDER-01", "properties": {"orderNumber": "5766", "orderStatusCode": "order/reserved"}}
        )
        self.assertEqual(201, response.status_code)
        self.assertEqual("order/reserved", response.json()["properties"]["orderStatusCode"])

    def test_create_order_duplicate_returns_409(self) -> None:
        payload = {"entityId": "I21-ORDER-01", "properties": {"orderNumber": "5766", "orderStatusCode": "order/reserved"}}
        self.client.post("/orders", json=payload)
        response = self.client.post("/orders", json=payload)
        self.assertEqual(409, response.status_code)

    def test_update_order_transitions_status(self) -> None:
        self.client.post(
            "/orders", json={"entityId": "I21-ORDER-01", "properties": {"orderNumber": "5766", "orderStatusCode": "order/reserved"}}
        )
        response = self.client.put(
            "/orders/I21-ORDER-01", json={"properties": {"orderNumber": "5766", "orderStatusCode": "order/paid"}}
        )
        self.assertEqual(200, response.status_code)
        self.assertEqual("order/paid", response.json()["properties"]["orderStatusCode"])

    def test_invalid_status_code_returns_422(self) -> None:
        response = self.client.post(
            "/orders", json={"entityId": "I21-ORDER-01", "properties": {"orderNumber": "5766", "orderStatusCode": "order/unknown"}}
        )
        self.assertEqual(422, response.status_code)

    def test_get_order_returns_404_for_missing(self) -> None:
        response = self.client.get("/orders/MISSING")
        self.assertEqual(404, response.status_code)

    def test_delete_order_blocked_while_position_exists_returns_409(self) -> None:
        self.client.post(
            "/orders", json={"entityId": "I21-ORDER-01", "properties": {"orderNumber": "5766", "orderStatusCode": "order/reserved"}}
        )
        self.client.post("/orders/I21-ORDER-01/positions", json={"entityId": "I21-POS-01"})
        response = self.client.delete("/orders/I21-ORDER-01")
        self.assertEqual(409, response.status_code)

    def test_full_order_flow_resolves_detail(self) -> None:
        # Person + traveller role
        self.client.post("/persons", json={"entityId": "I21-PERSON", "properties": {"givenName": "Emil", "familyName": "Brandt"}})
        self.client.post(
            "/persons/I21-PERSON/roles",
            json={"entityId": "I21-TRAVELLER-ROLE", "role": {"type": "person/traveller", "properties": {}}},
        )
        self.client.post(
            "/persons/I21-PERSON/roles",
            json={"entityId": "I21-CUSTOMER-ROLE", "role": {"type": "person/customer", "properties": {}}},
        )
        # Organisation + supplier role
        self.client.post("/organisations", json={"entityId": "I21-SUPPLIER", "properties": {"name": "Condorleaf Air"}})
        self.client.post(
            "/organisations/I21-SUPPLIER/roles",
            json={
                "entityId": "I21-SUPPLIER-ROLE",
                "role": {"type": "organisation/airline", "properties": {"airlineDesignator": "0Q"}},
            },
        )
        # Product + supplier link
        self.client.post(
            "/products",
            json={
                "entityId": "I21-FLIGHT",
                "product": {
                    "type": "product/airline/flight",
                    "properties": {
                        "flightNumber": "500",
                        "departureLocationCode": "FRA",
                        "arrivalLocationCode": "GIG",
                        "scheduledDepartureLocalTime": "10:30:00",
                        "scheduledArrivalLocalTime": "18:45:00",
                    },
                },
            },
        )
        self.client.put("/products/I21-FLIGHT/supplier", json={"supplierRoleId": "I21-SUPPLIER-ROLE"})
        self.client.post(
            "/products",
            json={"entityId": "I21-SEAT", "parentProductId": "I21-FLIGHT", "product": {"type": "product/airline/flight/seat", "properties": {"seatNumber": "1A"}}},
        )
        # Stock
        self.client.post(
            "/stock-items",
            json={
                "entityId": "I21-STOCK",
                "productId": "I21-SEAT",
                "type": "stock/airline/flight/seat",
                "properties": {"serviceDate": "2027-01-08", "unitPriceAmount": "500.00", "currencyCode": "EUR"},
            },
        )
        # Order + position + allocation + traveller + customer
        self.client.post(
            "/orders", json={"entityId": "I21-ORDER-01", "properties": {"orderNumber": "5766", "orderStatusCode": "order/reserved"}}
        )
        self.client.post("/orders/I21-ORDER-01/positions", json={"entityId": "I21-POS-01"})
        allocate_response = self.client.put(
            "/orders/I21-ORDER-01/positions/I21-POS-01/stock", json={"stockItemId": "I21-STOCK"}
        )
        self.assertEqual(204, allocate_response.status_code)
        traveller_response = self.client.put(
            "/orders/I21-ORDER-01/positions/I21-POS-01/traveller", json={"travellerRoleId": "I21-TRAVELLER-ROLE"}
        )
        self.assertEqual(204, traveller_response.status_code)
        customer_response = self.client.put("/orders/I21-ORDER-01/customer", json={"customerRoleId": "I21-CUSTOMER-ROLE"})
        self.assertEqual(204, customer_response.status_code)

        detail_response = self.client.get("/orders/I21-ORDER-01/detail")
        self.assertEqual(200, detail_response.status_code)
        body = detail_response.json()
        self.assertEqual("I21-ORDER-01", body["order"]["entityId"])
        self.assertEqual(
            {"positionId": "I21-POS-01", "stockItemId": "I21-STOCK", "productId": "I21-SEAT",
             "travellers": [{"roleId": "I21-TRAVELLER-ROLE", "personId": "I21-PERSON", "displayName": "Emil Brandt"}]},
            body["positions"][0],
        )
        stock_after_allocation = self.client.get("/stock-items/I21-STOCK").json()
        self.assertEqual(1, stock_after_allocation["properties"]["allocatedQuantity"])
        self.assertEqual("allocated", stock_after_allocation["availabilityState"])

        release_response = self.client.delete(
            "/orders/I21-ORDER-01/positions/I21-POS-01/stock/I21-STOCK"
        )
        self.assertEqual(204, release_response.status_code)
        self.assertEqual(0, self.client.get("/stock-items/I21-STOCK").json()["properties"]["allocatedQuantity"])
        self.assertIsNone(self.client.get("/orders/I21-ORDER-01/detail").json()["positions"][0]["stockItemId"])

    def test_allocate_stock_requires_existing_stock_returns_404(self) -> None:
        self.client.post(
            "/orders", json={"entityId": "I21-ORDER-01", "properties": {"orderNumber": "5766", "orderStatusCode": "order/reserved"}}
        )
        self.client.post("/orders/I21-ORDER-01/positions", json={"entityId": "I21-POS-01"})
        response = self.client.put(
            "/orders/I21-ORDER-01/positions/I21-POS-01/stock", json={"stockItemId": "MISSING"}
        )
        self.assertEqual(404, response.status_code)


if __name__ == "__main__":
    unittest.main()
