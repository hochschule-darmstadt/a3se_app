"""Unit tests for seed.schema's structural validation."""

from __future__ import annotations

import unittest

import pydantic
from seed import schema


class PersonsFileTest(unittest.TestCase):
    def test_valid_person_parses(self) -> None:
        parsed = schema.PersonsFile.model_validate(
            {
                "schemaVersion": 1,
                "persons": [
                    {
                        "entityId": "PER-001",
                        "properties": {"givenName": "Ada", "familyName": "Kern"},
                        "roles": [{"entityId": "PER-001-TRAVELLER", "type": "person/traveller"}],
                        "sourceScenario": "TS-001",
                    }
                ],
            }
        )
        self.assertEqual(1, len(parsed.persons))

    def test_unknown_field_is_rejected(self) -> None:
        with self.assertRaises(pydantic.ValidationError):
            schema.PersonsFile.model_validate(
                {
                    "schemaVersion": 1,
                    "persons": [
                        {
                            "entityId": "PER-001",
                            "properties": {"givenName": "Ada", "familyName": "Kern"},
                            "roles": [],
                            "sourceScenario": "TS-001",
                            "unexpectedField": "value",
                        }
                    ],
                }
            )

    def test_person_requires_at_least_one_role(self) -> None:
        with self.assertRaises(pydantic.ValidationError):
            schema.PersonsFile.model_validate(
                {
                    "schemaVersion": 1,
                    "persons": [
                        {
                            "entityId": "PER-001",
                            "properties": {"givenName": "Ada", "familyName": "Kern"},
                            "roles": [],
                            "sourceScenario": "TS-001",
                        }
                    ],
                }
            )


class OrderPositionSeedTest(unittest.TestCase):
    def test_service_date_must_be_iso_format(self) -> None:
        with self.assertRaises(pydantic.ValidationError):
            schema.OrderPositionSeed.model_validate(
                {
                    "entityId": "ORD-001-P1",
                    "productId": "FLT-01",
                    "serviceDate": "06/04/2027",
                    "travellerPersonRoleIds": ["PER-001-TRAVELLER"],
                }
            )

    def test_position_requires_at_least_one_traveller(self) -> None:
        with self.assertRaises(pydantic.ValidationError):
            schema.OrderPositionSeed.model_validate(
                {
                    "entityId": "ORD-001-P1",
                    "productId": "FLT-01",
                    "serviceDate": "2027-04-06",
                    "travellerPersonRoleIds": [],
                }
            )


if __name__ == "__main__":
    unittest.main()
