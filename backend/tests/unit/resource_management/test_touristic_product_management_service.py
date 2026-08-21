"""Unit tests for Touristic Product Management application operations."""

from __future__ import annotations

from datetime import time
import unittest

import pydantic
from support.fake_entity_repository import FakeEntityRepository

from cct.resource_management.contracts import EntityKind
from cct.resource_management.errors import DuplicateEntityError, EntityNotFoundError
from cct.resource_management.partner_management import service as partner_service
from cct.resource_management.relationship_types import RelationshipType
from cct.resource_management.touristic_product_management import service


def flight_properties(**overrides: object) -> dict[str, object]:
    properties = {
        "flightNumber": "500",
        "departureLocationCode": "FRA",
        "arrivalLocationCode": "GIG",
        "scheduledDepartureLocalTime": time(10, 30),
        "scheduledArrivalLocalTime": time(18, 45),
    }
    properties.update(overrides)
    return properties


class ProductServiceTest(unittest.TestCase):
    def setUp(self) -> None:
        # One shared store: in production both ScopedEntityRepository views wrap
        # the same single Neo4j-backed repository/graph, not two separate ones.
        shared = FakeEntityRepository()
        self.repository = shared
        self.partner_repository = shared

    def test_create_product_succeeds(self) -> None:
        entity = service.create_product(
            self.repository, entity_id="I21-FLIGHT", type="product/airline/flight", properties=flight_properties()
        )
        self.assertEqual("500", entity.properties.flight_number)

    def test_create_product_rejects_duplicate(self) -> None:
        service.create_product(
            self.repository, entity_id="I21-FLIGHT", type="product/airline/flight", properties=flight_properties()
        )
        with self.assertRaises(DuplicateEntityError):
            service.create_product(
                self.repository, entity_id="I21-FLIGHT", type="product/airline/flight", properties=flight_properties()
            )

    def test_create_product_with_missing_parent_raises_not_found(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.create_product(
                self.repository,
                entity_id="I21-SEAT",
                type="product/airline/flight/seat",
                properties={"seatNumber": "5A"},
                parent_product_id="MISSING",
            )

    def test_get_product_raises_not_found(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.get_product(self.repository, "MISSING")

    def test_update_product_requires_existing(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.update_product(
                self.repository, "MISSING", type="product/airline/flight", properties=flight_properties()
            )

    def test_delete_product_removes_entity(self) -> None:
        service.create_product(
            self.repository, entity_id="I21-FLIGHT", type="product/airline/flight", properties=flight_properties()
        )
        service.delete_product(self.repository, "I21-FLIGHT")
        with self.assertRaises(EntityNotFoundError):
            service.get_product(self.repository, "I21-FLIGHT")

    def test_recursive_component_tree_is_created_and_retrieved(self) -> None:
        # Package -> flight -> seat: a real, multi-level recursive composition,
        # not just the single-hop flight-with-seats case.
        service.create_product(
            self.repository, entity_id="I21-PKG", type="product/mobility/transfer", properties={}
        )
        service.create_product(
            self.repository,
            entity_id="I21-FLIGHT",
            type="product/airline/flight",
            properties=flight_properties(),
            parent_product_id="I21-PKG",
        )
        service.create_product(
            self.repository,
            entity_id="I21-SEAT",
            type="product/airline/flight/seat",
            properties={"seatNumber": "5A"},
            parent_product_id="I21-FLIGHT",
        )
        tree = service.get_component_tree(self.repository, "I21-PKG")
        self.assertEqual(
            {"I21-PKG": None, "I21-FLIGHT": "I21-PKG", "I21-SEAT": "I21-FLIGHT"},
            {entity.entity_id: parent_id for entity, parent_id in tree},
        )

    def test_set_supplier_validates_reference_via_partner_service(self) -> None:
        service.create_product(
            self.repository, entity_id="I21-FLIGHT", type="product/airline/flight", properties=flight_properties()
        )
        with self.assertRaises(EntityNotFoundError):
            service.set_supplier(
                self.repository, "I21-FLIGHT", supplier_role_id="MISSING", partner_repository=self.partner_repository
            )

    def test_set_supplier_writes_supplied_by_relationship(self) -> None:
        service.create_product(
            self.repository, entity_id="I21-FLIGHT", type="product/airline/flight", properties=flight_properties()
        )
        partner_service.create_organisation(
            self.partner_repository, entity_id="I21-SUPPLIER", properties={"name": "Condorleaf Air"}
        )
        partner_service.create_orga_role(
            self.partner_repository,
            entity_id="I21-SUPPLIER-ROLE",
            organisation_id="I21-SUPPLIER",
            type="organisation/airline",
            properties={"airlineDesignator": "0Q"},
        )
        service.set_supplier(
            self.repository,
            "I21-FLIGHT",
            supplier_role_id="I21-SUPPLIER-ROLE",
            partner_repository=self.partner_repository,
        )
        self.assertIn(
            (EntityKind.TOURISTIC_PRODUCT_ITEM, "I21-FLIGHT", RelationshipType.SUPPLIED_BY, EntityKind.ORGA_ROLE, "I21-SUPPLIER-ROLE"),
            self.repository.relationship_calls,
        )

    def test_get_ancestors_returns_empty_tuple_for_a_root(self) -> None:
        service.create_product(
            self.repository, entity_id="I31-PKG", type="product/mobility/transfer", properties={}
        )
        self.assertEqual((), service.get_ancestors(self.repository, "I31-PKG"))

    def test_get_ancestors_returns_root_first_chain(self) -> None:
        service.create_product(
            self.repository, entity_id="I31-PKG", type="product/mobility/transfer", properties={}
        )
        service.create_product(
            self.repository,
            entity_id="I31-CAT",
            type="product/accommodation/room-type",
            properties={"roomTypeCode": "room/double"},
            parent_product_id="I31-PKG",
        )
        service.create_product(
            self.repository,
            entity_id="I31-ROOM",
            type="product/accommodation/room-type/room",
            properties={"roomNumber": "204"},
            parent_product_id="I31-CAT",
        )
        ancestors = service.get_ancestors(self.repository, "I31-ROOM")
        self.assertEqual(("I31-PKG", "I31-CAT"), tuple(entity.entity_id for entity in ancestors))

    def test_get_ancestors_requires_existing_product(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.get_ancestors(self.repository, "MISSING")

    def test_get_supplier_returns_none_when_unset(self) -> None:
        service.create_product(
            self.repository, entity_id="I31-FLIGHT", type="product/airline/flight", properties=flight_properties()
        )
        self.assertIsNone(service.get_supplier(self.repository, "I31-FLIGHT"))

    def test_get_supplier_requires_existing_product(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.get_supplier(self.repository, "MISSING")

    def test_get_supplier_returns_the_supplying_orga_role(self) -> None:
        service.create_product(
            self.repository, entity_id="I31-FLIGHT", type="product/airline/flight", properties=flight_properties()
        )
        partner_service.create_organisation(
            self.partner_repository, entity_id="I31-SUPPLIER", properties={"name": "Condorleaf Air"}
        )
        partner_service.create_orga_role(
            self.partner_repository,
            entity_id="I31-SUPPLIER-ROLE",
            organisation_id="I31-SUPPLIER",
            type="organisation/airline",
            properties={"airlineDesignator": "0Q"},
        )
        service.set_supplier(
            self.repository, "I31-FLIGHT", supplier_role_id="I31-SUPPLIER-ROLE", partner_repository=self.partner_repository
        )
        supplier = service.get_supplier(self.repository, "I31-FLIGHT")
        assert supplier is not None
        self.assertEqual("I31-SUPPLIER-ROLE", supplier.entity_id)

    def test_create_product_accepts_image_url(self) -> None:
        # TERM-010 (issue #12): image metadata reduced to imageUrl only.
        entity = service.create_product(
            self.repository,
            entity_id="I12-FLIGHT-IMG",
            type="product/airline/flight",
            properties=flight_properties(imageUrl="https://commons.wikimedia.org/example.jpg"),
        )
        self.assertEqual("https://commons.wikimedia.org/example.jpg", entity.properties.image_url)

    def test_create_product_rejects_non_https_image_url(self) -> None:
        with self.assertRaises(pydantic.ValidationError):
            service.create_product(
                self.repository,
                entity_id="I12-FLIGHT-INSECUREIMG",
                type="product/airline/flight",
                properties=flight_properties(imageUrl="http://example.com/example.jpg"),
            )

    def test_create_product_defaults_to_draft_lifecycle_status(self) -> None:
        entity = service.create_product(
            self.repository, entity_id="I31-FLIGHT", type="product/airline/flight", properties=flight_properties()
        )
        self.assertEqual("product/draft", entity.properties.lifecycle_status_code)

    def test_update_product_activates_via_status_change(self) -> None:
        service.create_product(
            self.repository, entity_id="I31-FLIGHT", type="product/airline/flight", properties=flight_properties()
        )
        activated = service.update_product(
            self.repository,
            "I31-FLIGHT",
            type="product/airline/flight",
            properties=flight_properties(lifecycleStatusCode="product/active"),
        )
        self.assertEqual("product/active", activated.properties.lifecycle_status_code)

    def test_update_product_retires_via_status_change(self) -> None:
        service.create_product(
            self.repository, entity_id="I31-FLIGHT", type="product/airline/flight", properties=flight_properties()
        )
        retired = service.update_product(
            self.repository,
            "I31-FLIGHT",
            type="product/airline/flight",
            properties=flight_properties(lifecycleStatusCode="product/retired"),
        )
        self.assertEqual("product/retired", retired.properties.lifecycle_status_code)

    def test_create_product_accepts_display_name(self) -> None:
        entity = service.create_product(
            self.repository,
            entity_id="I31-ROOM",
            type="product/accommodation/room-type",
            properties={"roomTypeCode": "room/double", "displayName": "Madeira walking week"},
        )
        self.assertEqual("Madeira walking week", entity.properties.display_name)

    def test_create_product_display_name_is_optional(self) -> None:
        entity = service.create_product(
            self.repository, entity_id="I31-TRANSFER", type="product/mobility/transfer", properties={}
        )
        self.assertIsNone(entity.properties.display_name)

    def test_create_product_accepts_widened_room_type_codes(self) -> None:
        for room_type in ("room/single", "room/family", "room/adjoining", "room/cabin"):
            with self.subTest(room_type=room_type):
                entity = service.create_product(
                    self.repository,
                    entity_id=f"I12-ROOM-{room_type.split('/')[1]}",
                    type="product/accommodation/room-type",
                    properties={"roomTypeCode": room_type},
                )
                self.assertEqual(room_type, entity.properties.room_type_code)


if __name__ == "__main__":
    unittest.main()
