"""Unit tests for seed.loader's duplicate/dangling-reference checks.

Uses a minimal, self-contained set of source files written to a temporary
directory (seed.loader.SOURCES_DIR patched for the duration of each test)
rather than the real backend/scripts/seed/sources/ -- these tests are about
the loader's validation logic, not the seed content itself.
"""

from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from seed import loader


def _minimal_files() -> dict[str, dict[str, object]]:
    return {
        "persons.json": {
            "schemaVersion": 1,
            "persons": [
                {
                    "entityId": "PER-001",
                    "properties": {"givenName": "Ada", "familyName": "Kern"},
                    "roles": [
                        {"entityId": "PER-001-TRAVELLER", "type": "person/traveller"},
                        {"entityId": "PER-001-CUSTOMER", "type": "person/customer"},
                    ],
                    "sourceScenario": "TS-001",
                }
            ],
        },
        "organisations.json": {
            "schemaVersion": 1,
            "organisations": [
                {
                    "entityId": "SUP-AIR-01",
                    "properties": {"name": "Condorleaf Air"},
                    "role": {
                        "entityId": "SUP-AIR-01-ROLE",
                        "type": "organisation/airline",
                        "properties": {"airlineDesignator": "0Q"},
                    },
                    "reserve": False,
                }
            ],
        },
        "products.json": {
            "schemaVersion": 1,
            "products": [
                {
                    "entityId": "FLT-01",
                    "type": "product/airline/flight",
                    "properties": {
                        "flightNumber": "CA501",
                        "departureLocationCode": "BER",
                        "arrivalLocationCode": "LIM",
                        "scheduledDepartureLocalTime": "08:15:00",
                        "scheduledArrivalLocalTime": "18:40:00",
                    },
                    "supplierRoleId": "SUP-AIR-01-ROLE",
                    "parentProductId": None,
                    "reserve": False,
                },
                {
                    "entityId": "FLT-01-SEAT-1",
                    "type": "product/airline/flight/seat",
                    "properties": {"seatNumber": "1A"},
                    "supplierRoleId": None,
                    "parentProductId": "FLT-01",
                    "reserve": False,
                }
            ],
        },
        "orders.json": {
            "schemaVersion": 1,
            "orders": [
                {
                    "entityId": "ORD-001",
                    "properties": {"orderNumber": "6001", "orderStatusCode": "order/reserved"},
                    "customerPersonRoleId": "PER-001-CUSTOMER",
                    "positions": [
                        {
                            "entityId": "ORD-001-P1",
                            "productId": "FLT-01-SEAT-1",
                            "serviceDate": "2027-04-06",
                            "travellerPersonRoleIds": ["PER-001-TRAVELLER"],
                        }
                    ],
                    "sourceScenario": "TS-001",
                }
            ],
        },
    }


class LoaderTest(unittest.TestCase):
    def _write_and_load(self, files: dict[str, dict[str, object]]) -> loader.SeedData:
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            for name, content in files.items():
                (tmp_path / name).write_text(json.dumps(content), encoding="utf-8")
            original = loader.SOURCES_DIR
            loader.SOURCES_DIR = tmp_path
            try:
                return loader.load_seed_data()
            finally:
                loader.SOURCES_DIR = original

    def test_minimal_valid_set_loads(self) -> None:
        data = self._write_and_load(_minimal_files())
        self.assertEqual(1, len(data.persons))
        self.assertEqual(1, len(data.orders))

    def test_duplicate_person_id_is_rejected(self) -> None:
        files = _minimal_files()
        files["persons.json"]["persons"].append(files["persons.json"]["persons"][0])
        with self.assertRaises(loader.SeedValidationError):
            self._write_and_load(files)

    def test_duplicate_person_role_id_is_rejected(self) -> None:
        files = _minimal_files()
        files["persons.json"]["persons"][0]["roles"][1]["entityId"] = "PER-001-TRAVELLER"  # collides with role 0
        with self.assertRaises(loader.SeedValidationError):
            self._write_and_load(files)

    def test_dangling_supplier_role_reference_is_rejected(self) -> None:
        files = _minimal_files()
        files["products.json"]["products"][0]["supplierRoleId"] = "MISSING-ROLE"
        with self.assertRaises(loader.SeedValidationError):
            self._write_and_load(files)

    def test_dangling_parent_product_reference_is_rejected(self) -> None:
        files = _minimal_files()
        files["products.json"]["products"][0]["parentProductId"] = "MISSING-PRODUCT"
        with self.assertRaises(loader.SeedValidationError):
            self._write_and_load(files)

    def test_dangling_order_customer_reference_is_rejected(self) -> None:
        files = _minimal_files()
        files["orders.json"]["orders"][0]["customerPersonRoleId"] = "MISSING-ROLE"
        with self.assertRaises(loader.SeedValidationError):
            self._write_and_load(files)

    def test_dangling_position_product_reference_is_rejected(self) -> None:
        files = _minimal_files()
        files["orders.json"]["orders"][0]["positions"][0]["productId"] = "MISSING-PRODUCT"
        with self.assertRaises(loader.SeedValidationError):
            self._write_and_load(files)

    def test_dangling_position_traveller_reference_is_rejected(self) -> None:
        files = _minimal_files()
        files["orders.json"]["orders"][0]["positions"][0]["travellerPersonRoleIds"] = ["MISSING-ROLE"]
        with self.assertRaises(loader.SeedValidationError):
            self._write_and_load(files)

    def test_unsupported_schema_version_is_rejected(self) -> None:
        files = _minimal_files()
        files["persons.json"]["schemaVersion"] = 2
        with self.assertRaises(loader.SeedValidationError):
            self._write_and_load(files)

if __name__ == "__main__":
    unittest.main()
