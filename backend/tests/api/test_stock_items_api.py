"""API-contract tests for the StockItem router."""

from __future__ import annotations

import unittest

from fastapi.testclient import TestClient
from support.fake_entity_repository import FakeEntityRepository

from cct.api.app import create_app
from cct.api.dependencies import get_current_actor, get_product_repository, get_stock_repository


def flight_payload(entity_id: str = "I21-FLIGHT") -> dict[str, object]:
    return {
        "entityId": entity_id,
        "product": {
            "type": "product/flight",
            "properties": {
                "flightNumber": "500",
                "departureLocationCode": "FRA",
                "arrivalLocationCode": "GIG",
                "scheduledDepartureLocalTime": "10:30:00",
                "scheduledArrivalLocalTime": "18:45:00",
            },
        },
    }


def stock_payload(entity_id: str = "I21-STOCK-01", product_id: str = "I21-FLIGHT", **overrides: object) -> dict[str, object]:
    properties = {"serviceDate": "2027-01-08", "unitPriceAmount": "500.00", "currencyCode": "EUR"}
    properties.update(overrides)
    return {"entityId": entity_id, "productId": product_id, "type": "stock/flight/seat", "properties": properties}


class StockItemsApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.repository = FakeEntityRepository()
        self.app = create_app()
        self.app.dependency_overrides[get_stock_repository] = lambda: self.repository
        self.app.dependency_overrides[get_product_repository] = lambda: self.repository
        self.app.dependency_overrides[get_current_actor] = lambda: None
        self.client = TestClient(self.app, raise_server_exceptions=False)
        self.client.post("/products", json=flight_payload())

    def test_create_stock_item_returns_201(self) -> None:
        response = self.client.post("/stock-items", json=stock_payload())
        self.assertEqual(201, response.status_code)
        self.assertEqual("500.00", response.json()["properties"]["unitPriceAmount"])

    def test_create_stock_item_requires_existing_product(self) -> None:
        response = self.client.post("/stock-items", json=stock_payload(product_id="MISSING"))
        self.assertEqual(404, response.status_code)

    def test_create_stock_item_duplicate_returns_409(self) -> None:
        self.client.post("/stock-items", json=stock_payload())
        response = self.client.post("/stock-items", json=stock_payload())
        self.assertEqual(409, response.status_code)

    def test_get_stock_item_returns_404_for_missing(self) -> None:
        response = self.client.get("/stock-items/MISSING")
        self.assertEqual(404, response.status_code)

    def test_list_stock_items_returns_page(self) -> None:
        self.client.post("/stock-items", json=stock_payload())
        response = self.client.get("/stock-items")
        self.assertEqual(200, response.status_code)
        self.assertEqual(1, len(response.json()["items"]))

    def test_update_stock_item_replaces_properties(self) -> None:
        self.client.post("/stock-items", json=stock_payload())
        response = self.client.put(
            "/stock-items/I21-STOCK-01",
            json={
                "type": "stock/flight/seat",
                "properties": {"serviceDate": "2027-01-08", "unitPriceAmount": "600.00", "currencyCode": "EUR"},
            },
        )
        self.assertEqual(200, response.status_code)
        self.assertEqual("600.00", response.json()["properties"]["unitPriceAmount"])

    def test_delete_stock_item_returns_204(self) -> None:
        self.client.post("/stock-items", json=stock_payload())
        response = self.client.delete("/stock-items/I21-STOCK-01")
        self.assertEqual(204, response.status_code)

    def test_negative_price_returns_422(self) -> None:
        response = self.client.post("/stock-items", json=stock_payload(unitPriceAmount="-1.00"))
        self.assertEqual(422, response.status_code)


if __name__ == "__main__":
    unittest.main()
