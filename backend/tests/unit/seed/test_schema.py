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


class ImageSeedTest(unittest.TestCase):
    def _valid_payload(self, **overrides: object) -> dict[str, object]:
        payload = {
            "productId": "ACC-01",
            "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Example_Hotel_Room.jpg",
            "imageSourcePageUrl": "https://commons.wikimedia.org/wiki/File:Example_Hotel_Room.jpg",
            "imageCreatorCredit": "Example Creator",
            "imageLicenceCode": "CC-BY-SA-4.0",
            "imageLicenceVersion": "4.0",
            "imageAttributionText": "Example Creator, CC BY-SA 4.0, via Wikimedia Commons",
            "imageAltText": "A bright double hotel room with a large window.",
            "imageVerifiedDate": "2026-08-18",
        }
        payload.update(overrides)
        return payload

    def test_valid_image_parses(self) -> None:
        schema.ImageSeed.model_validate(self._valid_payload())

    def test_non_https_url_is_rejected(self) -> None:
        with self.assertRaises(pydantic.ValidationError):
            schema.ImageSeed.model_validate(self._valid_payload(imageUrl="http://example.com/room.jpg"))

    def test_alt_text_derived_from_filename_is_rejected(self) -> None:
        with self.assertRaises(pydantic.ValidationError):
            schema.ImageSeed.model_validate(self._valid_payload(imageAltText="Example Hotel Room"))

    def test_alt_text_describing_content_is_accepted(self) -> None:
        schema.ImageSeed.model_validate(self._valid_payload(imageAltText="A bright double room with a large window."))


if __name__ == "__main__":
    unittest.main()
