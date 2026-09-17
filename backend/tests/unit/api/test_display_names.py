"""Acceptance evidence for FR-010–FR-013 display projections."""

from __future__ import annotations

import unittest
from datetime import time

from support.fake_entity_repository import FakeEntityRepository

from cct.api import display_names
from cct.resource_management.contracts import EntityKind
from cct.resource_management.errors import InvalidEntityGraphError
from cct.resource_management.relationship_types import RelationshipType


class DisplayNamesTest(unittest.TestCase):
    def setUp(self):
        self.repository = FakeEntityRepository()

    def save(self, entity_id, entity_kind, properties, type=None):
        candidate = {"entityId": entity_id, "entityKind": entity_kind, "properties": properties}
        if type is not None:
            candidate["type"] = type
        return self.repository.save(candidate)

    def relate(self, from_kind, from_id, relationship, to_kind, to_id):
        self.repository.create_relationship(
            from_kind=from_kind,
            from_id=from_id,
            relationship=relationship,
            to_kind=to_kind,
            to_id=to_id,
        )

    def test_person_and_role_chain(self):
        owner = self.save("PER-1", "Person", {"givenName": "Ada", "familyName": "Lovelace"})
        role = self.save("ROLE-1", "PersonRole", {}, "person/traveller")
        self.assertEqual("Ada Lovelace", display_names.person(owner).display_name)
        self.assertEqual(("Ada Lovelace", "Traveller"), display_names.person_role(role, owner).display_name_chain)

    def test_organisation_display_name_includes_locality_when_present(self):
        organisation = self.save("ORG-1", "Organisation", {"name": "Bramble House", "locality": "Rio de Janeiro, Brazil"})
        role = self.save("ROLE-1", "OrgaRole", {}, "organisation/accommodation")
        self.assertEqual("Bramble House Rio de Janeiro, Brazil", display_names.organisation(organisation).display_name)
        self.assertEqual(
            ("Bramble House Rio de Janeiro, Brazil", "Accommodation"),
            display_names.orga_role(role, organisation).display_name_chain,
        )

    def test_organisation_display_name_uses_name_when_locality_is_absent(self):
        organisation = self.save("ORG-1", "Organisation", {"name": "Condorleaf Air"})
        self.assertEqual("Condorleaf Air", display_names.organisation(organisation).display_name)

    def test_flight_component_chain_uses_supplier_and_middle_components(self):
        organisation = self.save("ORG-1", "Organisation", {"name": "Condorleaf Air"})
        role = self.save("ROLE-1", "OrgaRole", {"airlineDesignator": "CA"}, "organisation/airline")
        flight = self.save(
            "FLT-1",
            "TouristicProductItem",
            {
                "flightNumber": "CA501",
                "departureLocationCode": "BER",
                "arrivalLocationCode": "LIM",
                "scheduledDepartureLocalTime": time(8, 15),
                "scheduledArrivalLocalTime": time(18, 40),
            },
            "product/airline/flight",
        )
        lounge = self.save("ACT-1", "TouristicProductItem", {"name": "Lounge access"}, "product/experience/activity")
        self.relate(EntityKind.ORGANISATION, organisation.entity_id, RelationshipType.HAS_ROLE, EntityKind.ORGA_ROLE, role.entity_id)
        self.relate(EntityKind.TOURISTIC_PRODUCT_ITEM, flight.entity_id, RelationshipType.SUPPLIED_BY, EntityKind.ORGA_ROLE, role.entity_id)
        self.relate(EntityKind.TOURISTIC_PRODUCT_ITEM, flight.entity_id, RelationshipType.CONTAINS, EntityKind.TOURISTIC_PRODUCT_ITEM, lounge.entity_id)

        projection = display_names.product(lounge, self.repository, self.repository)
        self.assertEqual("Lounge access", projection.display_name)
        self.assertEqual(("Condorleaf Air", "Airline", "CA501 BER–LIM", "Lounge access"), projection.display_name_chain)

    def test_all_room_type_codes_have_explicit_labels(self):
        for code, expected in display_names.ROOM_TYPE_LABELS.items():
            with self.subTest(code=code):
                room_type = self.save(
                    f"ROOM-{code}",
                    "TouristicProductItem",
                    {"roomTypeCode": code},
                    "product/accommodation/room-type",
                )
                self.assertEqual(expected, display_names.product(room_type, self.repository, self.repository).display_name)

    def test_nested_flight_uses_its_own_airline_designator(self):
        root_owner = self.save("ORG-1", "Organisation", {"name": "Condorleaf Air"})
        root_role = self.save("ROLE-1", "OrgaRole", {"airlineDesignator": "CA"}, "organisation/airline")
        nested_owner = self.save("ORG-2", "Organisation", {"name": "Andes Connect"})
        nested_role = self.save("ROLE-2", "OrgaRole", {"airlineDesignator": "AC"}, "organisation/airline")
        root = self.save("FLT-1", "TouristicProductItem", {"flightNumber": "CA501", "departureLocationCode": "BER", "arrivalLocationCode": "LIM", "scheduledDepartureLocalTime": time(8, 15), "scheduledArrivalLocalTime": time(18, 40)}, "product/airline/flight")
        nested = self.save("FLT-2", "TouristicProductItem", {"flightNumber": "AC600", "departureLocationCode": "LIM", "arrivalLocationCode": "CUZ", "scheduledDepartureLocalTime": time(7, 20), "scheduledArrivalLocalTime": time(8, 55)}, "product/airline/flight")
        for owner, role in ((root_owner, root_role), (nested_owner, nested_role)):
            self.relate(EntityKind.ORGANISATION, owner.entity_id, RelationshipType.HAS_ROLE, EntityKind.ORGA_ROLE, role.entity_id)
        self.relate(EntityKind.TOURISTIC_PRODUCT_ITEM, root.entity_id, RelationshipType.SUPPLIED_BY, EntityKind.ORGA_ROLE, root_role.entity_id)
        self.relate(EntityKind.TOURISTIC_PRODUCT_ITEM, nested.entity_id, RelationshipType.SUPPLIED_BY, EntityKind.ORGA_ROLE, nested_role.entity_id)
        self.relate(EntityKind.TOURISTIC_PRODUCT_ITEM, root.entity_id, RelationshipType.CONTAINS, EntityKind.TOURISTIC_PRODUCT_ITEM, nested.entity_id)

        projection = display_names.product(nested, self.repository, self.repository)
        self.assertEqual(("Condorleaf Air", "Airline", "CA501 BER–LIM", "AC600 LIM–CUZ"), projection.display_name_chain)

    def test_source_name_change_is_visible_without_derived_storage(self):
        transfer = self.save("TR-1", "TouristicProductItem", {"name": "Old name"}, "product/mobility/transfer")
        self.assertEqual("Old name", display_names.product(transfer, self.repository, self.repository).display_name)
        transfer = self.save("TR-1", "TouristicProductItem", {"name": "New name"}, "product/mobility/transfer")
        projection = display_names.product(transfer, self.repository, self.repository)
        self.assertEqual("New name", projection.display_name)
        self.assertNotIn("displayName", transfer.properties.model_dump(by_alias=True))
        self.assertNotIn("displayNameChain", transfer.properties.model_dump(by_alias=True))

    def test_missing_flight_supplier_is_explicit_invalid_graph(self):
        flight = self.save(
            "FLT-1",
            "TouristicProductItem",
            {
                "flightNumber": "CA501",
                "departureLocationCode": "BER",
                "arrivalLocationCode": "LIM",
                "scheduledDepartureLocalTime": time(8, 15),
                "scheduledArrivalLocalTime": time(18, 40),
            },
            "product/airline/flight",
        )
        with self.assertRaisesRegex(InvalidEntityGraphError, "supplying airline"):
            display_names.product(flight, self.repository, self.repository)

    def test_multiple_parents_are_explicit_invalid_graph(self):
        first = self.save("P-1", "TouristicProductItem", {"name": "First"}, "product/mobility/transfer")
        second = self.save("P-2", "TouristicProductItem", {"name": "Second"}, "product/mobility/transfer")
        child = self.save("C-1", "TouristicProductItem", {"name": "Child"}, "product/experience/activity")
        for parent in (first, second):
            self.relate(EntityKind.TOURISTIC_PRODUCT_ITEM, parent.entity_id, RelationshipType.CONTAINS, EntityKind.TOURISTIC_PRODUCT_ITEM, child.entity_id)
        with self.assertRaisesRegex(InvalidEntityGraphError, "multiple CONTAINS parents"):
            display_names.product(child, self.repository, self.repository)


if __name__ == "__main__":
    unittest.main()
