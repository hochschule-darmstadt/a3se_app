"""Unit tests for Touristic Product Management application operations."""

from __future__ import annotations

from datetime import time
import unittest

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
            self.repository, entity_id="I21-FLIGHT", type="product/flight", properties=flight_properties()
        )
        self.assertEqual("500", entity.properties.flight_number)

    def test_create_product_rejects_duplicate(self) -> None:
        service.create_product(
            self.repository, entity_id="I21-FLIGHT", type="product/flight", properties=flight_properties()
        )
        with self.assertRaises(DuplicateEntityError):
            service.create_product(
                self.repository, entity_id="I21-FLIGHT", type="product/flight", properties=flight_properties()
            )

    def test_create_product_with_missing_parent_raises_not_found(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.create_product(
                self.repository,
                entity_id="I21-SEAT",
                type="product/flight/seat",
                properties={"seatNumber": "5A"},
                parent_product_id="MISSING",
            )

    def test_get_product_raises_not_found(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.get_product(self.repository, "MISSING")

    def test_update_product_requires_existing(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.update_product(
                self.repository, "MISSING", type="product/flight", properties=flight_properties()
            )

    def test_delete_product_removes_entity(self) -> None:
        service.create_product(
            self.repository, entity_id="I21-FLIGHT", type="product/flight", properties=flight_properties()
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
            type="product/flight",
            properties=flight_properties(),
            parent_product_id="I21-PKG",
        )
        service.create_product(
            self.repository,
            entity_id="I21-SEAT",
            type="product/flight/seat",
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
            self.repository, entity_id="I21-FLIGHT", type="product/flight", properties=flight_properties()
        )
        with self.assertRaises(EntityNotFoundError):
            service.set_supplier(
                self.repository, "I21-FLIGHT", supplier_role_id="MISSING", partner_repository=self.partner_repository
            )

    def test_set_supplier_writes_supplied_by_relationship(self) -> None:
        service.create_product(
            self.repository, entity_id="I21-FLIGHT", type="product/flight", properties=flight_properties()
        )
        partner_service.create_organisation(
            self.partner_repository, entity_id="I21-SUPPLIER", properties={"name": "Condorleaf Air"}
        )
        partner_service.create_orga_role(
            self.partner_repository,
            entity_id="I21-SUPPLIER-ROLE",
            organisation_id="I21-SUPPLIER",
            type="partner/supplier/airline",
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


if __name__ == "__main__":
    unittest.main()
