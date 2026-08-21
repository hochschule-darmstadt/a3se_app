"""Unit tests for Inventory application operations, against a fake repository."""

from __future__ import annotations

from datetime import date, time
from decimal import Decimal
import unittest

from support.fake_entity_repository import FakeEntityRepository

from cct.resource_management.errors import DuplicateEntityError, EntityNotFoundError, InvalidEntityGraphError
from cct.resource_management.inventory import service
from cct.resource_management.touristic_product_management import service as product_service


def stock_properties(**overrides: object) -> dict[str, object]:
    properties = {"serviceDate": date(2027, 1, 8), "unitPriceAmount": Decimal("500.00"), "currencyCode": "EUR"}
    properties.update(overrides)
    return properties


class StockItemServiceTest(unittest.TestCase):
    def setUp(self) -> None:
        # One shared store, mirroring the single Neo4j graph both scoped views wrap.
        shared = FakeEntityRepository()
        self.repository = shared
        self.product_repository = shared
        product_service.create_product(
            self.product_repository,
            entity_id="I21-FLIGHT",
            type="product/airline/flight",
            properties={
                "flightNumber": "500",
                "departureLocationCode": "FRA",
                "arrivalLocationCode": "GIG",
                "scheduledDepartureLocalTime": time(10, 30),
                "scheduledArrivalLocalTime": time(18, 45),
            },
        )
        product_service.create_product(
            self.product_repository,
            entity_id="I21-SEAT",
            type="product/airline/flight/seat",
            properties={"seatNumber": "1A"},
            parent_product_id="I21-FLIGHT",
        )

    def test_create_stock_item_rejects_non_leaf_product(self) -> None:
        with self.assertRaises(InvalidEntityGraphError):
            service.create_stock_item(
                self.repository, entity_id="I21-STOCK-PARENT", type="stock/airline/flight/seat",
                properties=stock_properties(), product_id="I21-FLIGHT", product_repository=self.product_repository,
            )

    def test_create_stock_item_requires_existing_product(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.create_stock_item(
                self.repository,
                entity_id="I21-STOCK-01",
                type="stock/airline/flight/seat",
                properties=stock_properties(),
                product_id="MISSING",
                product_repository=self.product_repository,
            )

    def test_create_stock_item_succeeds_and_links_product(self) -> None:
        entity = service.create_stock_item(
            self.repository,
            entity_id="I21-STOCK-01",
            type="stock/airline/flight/seat",
            properties=stock_properties(),
            product_id="I21-SEAT",
            product_repository=self.product_repository,
        )
        self.assertEqual(Decimal("500.00"), entity.properties.unit_price_amount)
        self.assertIn(
            ("StockItem", "I21-STOCK-01", "REPRESENTS_PRODUCT", "TouristicProductItem", "I21-SEAT"),
            [(fk.value, fi, rel.value, tk.value, ti) for (fk, fi, rel, tk, ti) in self.repository.relationship_calls],
        )

    def test_create_stock_item_rejects_duplicate(self) -> None:
        service.create_stock_item(
            self.repository,
            entity_id="I21-STOCK-01",
            type="stock/airline/flight/seat",
            properties=stock_properties(),
            product_id="I21-SEAT",
            product_repository=self.product_repository,
        )
        with self.assertRaises(DuplicateEntityError):
            service.create_stock_item(
                self.repository,
                entity_id="I21-STOCK-01",
                type="stock/airline/flight/seat",
                properties=stock_properties(),
            product_id="I21-SEAT",
                product_repository=self.product_repository,
            )

    def test_get_stock_item_raises_not_found(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.get_stock_item(self.repository, "MISSING")

    def test_update_stock_item_replaces_properties(self) -> None:
        service.create_stock_item(
            self.repository,
            entity_id="I21-STOCK-01",
            type="stock/airline/flight/seat",
            properties=stock_properties(),
            product_id="I21-SEAT",
            product_repository=self.product_repository,
        )
        updated = service.update_stock_item(
            self.repository,
            "I21-STOCK-01",
            type="stock/airline/flight/seat",
            properties=stock_properties(unitPriceAmount=Decimal("600.00")),
        )
        self.assertEqual(Decimal("600.00"), updated.properties.unit_price_amount)

    def test_create_stock_item_rejects_type_that_does_not_match_product(self) -> None:
        with self.assertRaises(InvalidEntityGraphError):
            service.create_stock_item(
                self.repository,
                entity_id="I21-STOCK-WRONG-TYPE",
                type="stock/mobility/transfer",
                properties=stock_properties(),
                product_id="I21-SEAT",
                product_repository=self.product_repository,
            )

    def test_delete_stock_item_removes_entity(self) -> None:
        service.create_stock_item(
            self.repository,
            entity_id="I21-STOCK-01",
            type="stock/airline/flight/seat",
            properties=stock_properties(),
            product_id="I21-SEAT",
            product_repository=self.product_repository,
        )
        service.delete_stock_item(self.repository, "I21-STOCK-01")
        with self.assertRaises(EntityNotFoundError):
            service.get_stock_item(self.repository, "I21-STOCK-01")


if __name__ == "__main__":
    unittest.main()
