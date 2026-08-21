"""Unit tests for seed.orchestrator against a fake repository.

Neo4j-specific behavior (`ensure_schema`, `reset_seed_data`, both plain
Cypher against a real driver) is proven by the real-Neo4j integration test
instead; these tests exercise the orchestration logic itself: dependency
ordering, idempotent reruns, and validate-before-mutate.
"""

from __future__ import annotations

import json
import tempfile
import unittest
from datetime import date
from pathlib import Path

from support.fake_entity_repository import FakeEntityRepository

from seed import loader
from seed.orchestrator import SeedRepositories, run_seed

from .test_loader import _minimal_files


class OrchestratorTest(unittest.TestCase):
    def setUp(self) -> None:
        shared = FakeEntityRepository()
        self.repos = SeedRepositories(person=shared, partner=shared, product=shared, stock=shared, order=shared)
        self._tmp = tempfile.TemporaryDirectory()
        tmp_path = Path(self._tmp.name)
        for name, content in _minimal_files().items():
            (tmp_path / name).write_text(json.dumps(content), encoding="utf-8")
        self._original_sources_dir = loader.SOURCES_DIR
        loader.SOURCES_DIR = tmp_path

    def tearDown(self) -> None:
        loader.SOURCES_DIR = self._original_sources_dir
        self._tmp.cleanup()

    def test_run_seed_creates_every_entity_family(self) -> None:
        summary = run_seed(self.repos, stock_calendar_start=date(2027, 4, 6), stock_calendar_end=date(2027, 4, 6))
        self.assertEqual(1, summary.created.get("Person"))
        self.assertEqual(2, summary.created.get("PersonRole"))
        self.assertEqual(1, summary.created.get("Organisation"))
        self.assertEqual(1, summary.created.get("OrgaRole"))
        self.assertEqual(2, summary.created.get("TouristicProductItem"))
        self.assertEqual(1, summary.created.get("OrderItem (header)"))
        self.assertEqual(1, summary.created.get("OrderItem (position)"))
        self.assertGreaterEqual(summary.created.get("StockItem (calendar)", 0), 1)

    def test_rerun_is_idempotent(self) -> None:
        run_seed(self.repos, stock_calendar_start=date(2027, 4, 6), stock_calendar_end=date(2027, 4, 6))
        second = run_seed(self.repos, stock_calendar_start=date(2027, 4, 6), stock_calendar_end=date(2027, 4, 6))
        self.assertEqual({}, {k: v for k, v in second.created.items() if v != 0})
        self.assertEqual(1, second.already_present.get("Person"))
        self.assertEqual(1, second.already_present.get("OrderItem (header)"))

    def test_malformed_source_raises_before_any_write(self) -> None:
        malformed = json.loads((Path(loader.SOURCES_DIR) / "orders.json").read_text(encoding="utf-8"))
        malformed["orders"][0]["customerPersonRoleId"] = "MISSING-ROLE"
        (Path(loader.SOURCES_DIR) / "orders.json").write_text(json.dumps(malformed), encoding="utf-8")

        with self.assertRaises(loader.SeedValidationError):
            run_seed(self.repos)

        # Nothing was written: not even the persons/organisations/products
        # that would otherwise load without error, because loader validation
        # runs -- and raises -- before run_seed's first write.
        from cct.resource_management.contracts import EntityKind

        self.assertIsNone(self.repos.person.get(EntityKind.PERSON, "PER-001"))


if __name__ == "__main__":
    unittest.main()
