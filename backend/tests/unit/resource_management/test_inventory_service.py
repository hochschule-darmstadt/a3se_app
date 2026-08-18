"""Unit tests for Inventory application operations, against a fake repository."""

from __future__ import annotations

from datetime import date, time
from decimal import Decimal
import unittest

from support.fake_entity_repository import FakeEntityRepository

from cct.resource_management.errors import DuplicateEntityError, EntityNotFoundError
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
            type="product/flight",
            properties={
                "flightNumber": "500",
                "departureLocationCode": "FRA",
                "arrivalLocationCode": "GIG",
                "scheduledDepartureLocalTime": time(10, 30),
                "scheduledArrivalLocalTime": time(18, 45),
            },
        )

    def test_create_stock_item_requires_existing_product(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.create_stock_item(
                self.repository,
                entity_id="I21-STOCK-01",
                type="stock/flight/seat",
                properties=stock_properties(),
                product_id="MISSING",
                product_repository=self.product_repository,
            )

    def test_create_stock_item_succeeds_and_links_product(self) -> None:
        entity = service.create_stock_item(
            self.repository,
            entity_id="I21-STOCK-01",
            type="stock/flight/seat",
            properties=stock_properties(),
            product_id="I21-FLIGHT",
            product_repository=self.product_repository,
        )
        self.assertEqual(Decimal("500.00"), entity.properties.unit_price_amount)
        self.assertIn(
            ("StockItem", "I21-STOCK-01", "REPRESENTS_PRODUCT", "TouristicProductItem", "I21-FLIGHT"),
            [(fk.value, fi, rel.value, tk.value, ti) for (fk, fi, rel, tk, ti) in self.repository.relationship_calls],
        )

    def test_create_stock_item_rejects_duplicate(self) -> None:
        service.create_stock_item(
            self.repository,
            entity_id="I21-STOCK-01",
            type="stock/flight/seat",
            properties=stock_properties(),
            product_id="I21-FLIGHT",
            product_repository=self.product_repository,
        )
        with self.assertRaises(DuplicateEntityError):
            service.create_stock_item(
                self.repository,
                entity_id="I21-STOCK-01",
                type="stock/flight/seat",
                properties=stock_properties(),
                product_id="I21-FLIGHT",
                product_repository=self.product_repository,
            )

    def test_get_stock_item_raises_not_found(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.get_stock_item(self.repository, "MISSING")

    def test_update_stock_item_replaces_properties(self) -> None:
        service.create_stock_item(
            self.repository,
            entity_id="I21-STOCK-01",
            type="stock/flight/seat",
            properties=stock_properties(),
            product_id="I21-FLIGHT",
            product_repository=self.product_repository,
        )
        updated = service.update_stock_item(
            self.repository,
            "I21-STOCK-01",
            type="stock/flight/seat",
            properties=stock_properties(unitPriceAmount=Decimal("600.00")),
        )
        self.assertEqual(Decimal("600.00"), updated.properties.unit_price_amount)

    def test_create_stock_item_accepts_every_new_family_type(self) -> None:
        # Issue #12: ten stock/* identifiers added for the mobility/water/
        # experience/protection/accommodation families the scenarios allocate
        # order positions against; all reuse the common StockProperties shape.
        for stock_type in (
            "stock/accommodation/room-category",
            "stock/mobility/transfer",
            "stock/mobility/rail",
            "stock/mobility/coach",
            "stock/mobility/vehicle-rental",
            "stock/water/day-boat",
            "stock/water/cruise",
            "stock/experience/guided-tour",
            "stock/experience/activity",
            "stock/protection/travel",
        ):
            with self.subTest(stock_type=stock_type):
                entity_id = f"I12-STOCK-{stock_type.split('/')[-1]}"
                entity = service.create_stock_item(
                    self.repository,
                    entity_id=entity_id,
                    type=stock_type,
                    properties=stock_properties(),
                    product_id="I21-FLIGHT",
                    product_repository=self.product_repository,
                )
                self.assertEqual(stock_type, entity.type)

    def test_delete_stock_item_removes_entity(self) -> None:
        service.create_stock_item(
            self.repository,
            entity_id="I21-STOCK-01",
            type="stock/flight/seat",
            properties=stock_properties(),
            product_id="I21-FLIGHT",
            product_repository=self.product_repository,
        )
        service.delete_stock_item(self.repository, "I21-STOCK-01")
        with self.assertRaises(EntityNotFoundError):
            service.get_stock_item(self.repository, "I21-STOCK-01")


if __name__ == "__main__":
    unittest.main()
