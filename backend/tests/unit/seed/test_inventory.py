"""Unit tests for seed.inventory's deterministic 2027 calendar generator.

Pure computation, no Neo4j -- these tests exercise the full-year x every-
product matrix directly, which is impractical to prove by loading it into a
real database in an automated test run (see test_seed_data_integration.py's
own module docstring for that trade-off).
"""

from __future__ import annotations

import unittest
from datetime import date
from decimal import Decimal

from seed import inventory


class DailyQuantityTest(unittest.TestCase):
    def test_quantity_is_always_in_the_documented_range(self) -> None:
        day = inventory.START_2027
        while day <= inventory.END_2027:
            for product_id in ("FLT-01", "ACC-07"):
                quantity = inventory.daily_quantity(product_id, day, guaranteed=False)
                self.assertGreaterEqual(quantity, 0)
                self.assertLessEqual(quantity, 10)
            day += __import__("datetime").timedelta(days=1)

    def test_every_product_has_both_zero_and_nonzero_days_across_2027(self) -> None:
        for product_id in [f"FLT-{n:02d}" for n in range(1, 16)] + [f"ACC-{n:02d}" for n in range(1, 16)]:
            day = inventory.START_2027
            zero_days = 0
            nonzero_days = 0
            while day <= inventory.END_2027:
                if inventory.daily_quantity(product_id, day, guaranteed=False) == 0:
                    zero_days += 1
                else:
                    nonzero_days += 1
                day += __import__("datetime").timedelta(days=1)
            with self.subTest(product_id=product_id):
                self.assertGreater(zero_days, 0, "expected at least one zero-availability date")
                self.assertGreater(nonzero_days, 0, "expected at least one available date")

    def test_guaranteed_date_is_never_zero(self) -> None:
        # Find a date the un-guaranteed formula would zero out for FLT-01, then
        # confirm the guaranteed override forces at least 1.
        day = inventory.START_2027
        zero_day = None
        while day <= inventory.END_2027:
            if inventory.daily_quantity("FLT-01", day, guaranteed=False) == 0:
                zero_day = day
                break
            day += __import__("datetime").timedelta(days=1)
        self.assertIsNotNone(zero_day, "test setup assumption failed: no zero day found")
        self.assertEqual(0, inventory.daily_quantity("FLT-01", zero_day, guaranteed=False))
        self.assertGreaterEqual(inventory.daily_quantity("FLT-01", zero_day, guaranteed=True), 1)

    def test_quantity_is_deterministic_across_repeated_calls(self) -> None:
        results = {inventory.daily_quantity("ACC-03", date(2027, 6, 15), guaranteed=False) for _ in range(5)}
        self.assertEqual(1, len(results))


class GenerateStockSpecsTest(unittest.TestCase):
    def test_respects_date_boundaries(self) -> None:
        specs = inventory.generate_stock_specs(
            {inventory.FLIGHT_TYPE: ["FLT-01-SEAT-1"]}, set(), start=date(2027, 1, 1), end=date(2027, 1, 3)
        )
        dates = {spec.service_date for spec in specs}
        self.assertTrue(dates.issubset({date(2027, 1, 1), date(2027, 1, 2), date(2027, 1, 3)}))

    def test_generates_distinct_unit_ids_per_date(self) -> None:
        specs = inventory.generate_stock_specs(
            {inventory.FLIGHT_TYPE: ["FLT-01-SEAT-1"]},
            {("FLT-01-SEAT-1", date(2027, 1, 1))},
            start=date(2027, 1, 1),
            end=date(2027, 1, 1),
        )
        entity_ids = [spec.entity_id for spec in specs]
        self.assertEqual(len(entity_ids), len(set(entity_ids)))
        self.assertGreaterEqual(len(entity_ids), 1)

    def test_stock_type_matches_product_family(self) -> None:
        specs = inventory.generate_stock_specs(
            {inventory.FLIGHT_TYPE: ["FLT-01-SEAT-1"], inventory.ROOM_CATEGORY_TYPE: ["ACC-01-R1"]},
            {("FLT-01-SEAT-1", date(2027, 1, 1)), ("ACC-01-R1", date(2027, 1, 1))},
            start=date(2027, 1, 1),
            end=date(2027, 1, 1),
        )
        types_by_product = {spec.product_id: spec.type for spec in specs}
        self.assertEqual("stock/airline/flight/seat", types_by_product["FLT-01-SEAT-1"])
        self.assertEqual("stock/accommodation/room-type/room", types_by_product["ACC-01-R1"])

    def test_price_has_two_decimal_places(self) -> None:
        specs = inventory.generate_stock_specs(
            {inventory.FLIGHT_TYPE: ["FLT-01-SEAT-1"]},
            {("FLT-01-SEAT-1", date(2027, 1, 1))},
            start=date(2027, 1, 1),
            end=date(2027, 1, 1),
        )
        for spec in specs:
            self.assertEqual(spec.unit_price_amount, spec.unit_price_amount.quantize(Decimal("0.01")))


class AdHocStockSpecTest(unittest.TestCase):
    def test_builds_one_unit_for_a_mobility_product(self) -> None:
        spec = inventory.ad_hoc_stock_spec("MOB-01", "product/mobility/transfer", date(2027, 4, 6))
        self.assertEqual("stock/mobility/transfer", spec.type)
        self.assertEqual("STK-MOB-01-2027-04-06-U1", spec.entity_id)
        self.assertEqual(date(2027, 4, 6), spec.service_date)


if __name__ == "__main__":
    unittest.main()
