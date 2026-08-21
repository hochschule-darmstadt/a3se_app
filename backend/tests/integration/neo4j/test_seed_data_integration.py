"""Real-Neo4j evidence for the issue #12 seed data: the actual committed
`backend/scripts/seed/sources/*.json` loaded through `seed.orchestrator.run_seed`
end to end, exactly as `python backend/scripts/seed_data.py` would.

This loads the full deterministic 2027 calendar (~23k StockItems) -- unlike
`test_resource_crud_integration.py`'s small hand-built `I21-` fixture, this
test intentionally proves the real, full-size seed dataset, so it takes
several minutes against a local Neo4j Community container. It is gated the
same way every other real-Neo4j test in this repository is
(`CCT_NEO4J_TEST_URI` unset -> skipped), so it never slows down
`npm run backend:check`; only a developer who explicitly configures a test
Neo4j instance opts into the runtime cost.

Deletes only nodes whose `entityId` matches issue #12's seed-ID-prefix
allow-list (`orchestrator.SEED_ID_PREFIXES`); never point it at production
data.
"""

from __future__ import annotations

import os
import sys
import unittest
from datetime import date
from pathlib import Path

from neo4j import GraphDatabase

sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "scripts"))

from seed import inventory  # noqa: E402
from seed.orchestrator import (  # noqa: E402
    build_repositories,
    ensure_schema,
    reset_seed_data,
    run_seed,
)


@unittest.skipUnless(os.getenv("CCT_NEO4J_TEST_URI"), "CCT_NEO4J_TEST_URI not configured")
class SeedDataIntegrationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.driver = GraphDatabase.driver(
            os.environ["CCT_NEO4J_TEST_URI"],
            auth=(os.getenv("CCT_NEO4J_TEST_USER", "neo4j"), os.environ["CCT_NEO4J_TEST_PASSWORD"]),
        )
        cls.driver.verify_connectivity()
        ensure_schema(cls.driver, "neo4j")
        reset_seed_data(cls.driver, "neo4j")
        cls.repos = build_repositories(cls.driver, "neo4j")
        cls.first_summary = run_seed(cls.repos)

    @classmethod
    def tearDownClass(cls) -> None:
        reset_seed_data(cls.driver, "neo4j")
        cls.driver.close()

    def _run(self, query: str, **params: object) -> list[dict[str, object]]:
        with self.driver.session(database="neo4j") as session:
            return [record.data() for record in session.run(query, **params)]

    def test_full_seed_creates_every_expected_count(self) -> None:
        created = self.first_summary.created
        self.assertEqual(35, created.get("Person"))
        self.assertEqual(50, created.get("PersonRole"))
        self.assertEqual(67, created.get("Organisation"))
        self.assertEqual(67, created.get("OrgaRole"))
        self.assertEqual(130, created.get("TouristicProductItem"))
        self.assertEqual(15, created.get("OrderItem (header)"))
        self.assertEqual(67, created.get("OrderItem (position)"))
        self.assertEqual(37, created.get("StockItem (ad hoc)"))
        self.assertGreater(created.get("StockItem (calendar)", 0), 20000)

    def test_rerun_is_idempotent(self) -> None:
        second = run_seed(self.repos)
        self.assertEqual({}, {kind: count for kind, count in second.created.items() if count != 0})
        self.assertEqual(35, second.already_present.get("Person"))
        self.assertEqual(15, second.already_present.get("OrderItem (header)"))

    def test_reset_then_reload_recreates_every_family(self) -> None:
        reset_seed_data(self.driver, "neo4j")
        rows = self._run("MATCH (n) WHERE n.entityId STARTS WITH 'PER-' RETURN count(n) AS c")
        self.assertEqual(0, rows[0]["c"])
        summary = run_seed(self.repos)
        self.assertEqual(35, summary.created.get("Person"))
        self.assertEqual(15, summary.created.get("OrderItem (header)"))

    def test_flt01_recursive_legs_are_contained(self) -> None:
        rows = self._run(
            "MATCH (parent:TouristicProductItem {entityId: 'FLT-01'})"
            "-[:CONTAINS]->(leg:TouristicProductItem) RETURN leg.entityId AS id ORDER BY id"
        )
        self.assertEqual(["FLT-01-L2", "FLT-01-L3", "FLT-01-L4"], [row["id"] for row in rows])

    def test_relationship_vocabulary_is_present_across_the_full_chain(self) -> None:
        rows = self._run(
            "MATCH (order:OrderItem {entityId: 'ORD-001'})"
            "-[:CUSTOMER]->(customer:PersonRole),"
            "(order)-[:CONTAINS]->(position:OrderItem {entityId: 'ORD-001-P1'}),"
            "(position)-[:ALLOCATES_STOCK]->(stock:StockItem),"
            "(position)-[:ASSIGNED_TRAVELLER]->(traveller:PersonRole),"
            "(stock)-[:REPRESENTS_PRODUCT]->(product:TouristicProductItem {entityId: 'FLT-01-SEAT-1'}),"
            "(product)-[:SUPPLIED_BY]->(supplierRole:OrgaRole),"
            "(supplier:Organisation)-[:HAS_ROLE]->(supplierRole)"
            " RETURN customer.entityId AS customer, traveller.entityId AS traveller, supplier.entityId AS supplier"
        )
        self.assertEqual(1, len(rows))
        self.assertEqual("PER-001-CUSTOMER", rows[0]["customer"])
        self.assertEqual("PER-001-TRAVELLER", rows[0]["traveller"])
        self.assertEqual("SUP-AIR-01", rows[0]["supplier"])

    def test_reserve_products_have_no_stock(self) -> None:
        rows = self._run(
            "MATCH (product:TouristicProductItem {entityId: 'FLT-21'})"
            "<-[:REPRESENTS_PRODUCT]-(stock:StockItem) RETURN count(stock) AS c"
        )
        self.assertEqual(0, rows[0]["c"])

    def test_unavailable_and_available_dates_are_distinguishable_for_the_same_product(self) -> None:
        # FLT-01 is a scenario-used flight type; find one deterministic zero
        # date and one deterministic non-zero date within 2027 and confirm
        # Neo4j agrees -- proves "not available now" vs. "available at
        # another time" is a real, queryable distinction, not just an
        # in-memory claim (test_inventory.py already proves the formula
        # itself against every product for the full year).
        zero_date = None
        available_date = None
        day = inventory.START_2027
        while day <= inventory.END_2027 and (zero_date is None or available_date is None):
            quantity = inventory.daily_quantity("FLT-01", day, guaranteed=("FLT-01", day) == ("FLT-01", date(2027, 4, 6)))
            if quantity == 0 and zero_date is None:
                zero_date = day
            if quantity > 0 and available_date is None:
                available_date = day
            day = date.fromordinal(day.toordinal() + 1)

        zero_rows = self._run(
            "MATCH (s:StockItem) WHERE s.entityId STARTS WITH $prefix RETURN count(s) AS c",
            prefix=f"STK-FLT-01-{zero_date.isoformat()}",
        )
        available_rows = self._run(
            "MATCH (s:StockItem) WHERE s.entityId STARTS WITH $prefix RETURN count(s) AS c",
            prefix=f"STK-FLT-01-{available_date.isoformat()}",
        )
        self.assertEqual(0, zero_rows[0]["c"])
        self.assertGreater(available_rows[0]["c"], 0)

    def test_allocate_stock_rejects_a_nonexistent_stock_item(self) -> None:
        from cct.resource_management.errors import EntityNotFoundError
        from cct.resource_management.order_management import service as order_service

        with self.assertRaises(EntityNotFoundError):
            order_service.allocate_stock(
                self.repos.order, "ORD-001-P1", stock_item_id="STK-DOES-NOT-EXIST", stock_repository=self.repos.stock
            )


if __name__ == "__main__":
    unittest.main()
