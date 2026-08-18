"""Unit tests for Partner Management application operations, against a fake repository."""

from __future__ import annotations

import unittest

from support.fake_entity_repository import FakeEntityRepository

from cct.resource_management.errors import DependentEntityExistsError, DuplicateEntityError, EntityNotFoundError
from cct.resource_management.pagination import PageRequest
from cct.resource_management.partner_management import service


def organisation_properties(**overrides: object) -> dict[str, object]:
    properties = {"name": "Condorleaf Air"}
    properties.update(overrides)
    return properties


class OrganisationServiceTest(unittest.TestCase):
    def setUp(self) -> None:
        self.repository = FakeEntityRepository()

    def test_create_organisation_succeeds(self) -> None:
        entity = service.create_organisation(
            self.repository, entity_id="I21-ORG-01", properties=organisation_properties()
        )
        self.assertEqual("Condorleaf Air", entity.properties.name)

    def test_create_organisation_rejects_duplicate(self) -> None:
        service.create_organisation(self.repository, entity_id="I21-ORG-01", properties=organisation_properties())
        with self.assertRaises(DuplicateEntityError):
            service.create_organisation(
                self.repository, entity_id="I21-ORG-01", properties=organisation_properties()
            )

    def test_get_organisation_raises_not_found(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.get_organisation(self.repository, "MISSING")

    def test_list_organisations_returns_created_organisations(self) -> None:
        service.create_organisation(self.repository, entity_id="I21-ORG-01", properties=organisation_properties())
        page = service.list_organisations(self.repository, page=PageRequest(limit=10))
        self.assertEqual(("I21-ORG-01",), tuple(entity.entity_id for entity in page.items))

    def test_update_organisation_requires_existing(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.update_organisation(self.repository, "MISSING", properties=organisation_properties())

    def test_update_organisation_replaces_properties(self) -> None:
        service.create_organisation(self.repository, entity_id="I21-ORG-01", properties=organisation_properties())
        updated = service.update_organisation(
            self.repository, "I21-ORG-01", properties=organisation_properties(name="Renamed Air")
        )
        self.assertEqual("Renamed Air", updated.properties.name)

    def test_delete_organisation_removes_entity(self) -> None:
        service.create_organisation(self.repository, entity_id="I21-ORG-01", properties=organisation_properties())
        service.delete_organisation(self.repository, "I21-ORG-01")
        with self.assertRaises(EntityNotFoundError):
            service.get_organisation(self.repository, "I21-ORG-01")

    def test_create_orga_role_requires_existing_organisation(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.create_orga_role(
                self.repository,
                entity_id="I21-ROLE-01",
                organisation_id="MISSING",
                type="partner/supplier/airline",
                properties={"airlineDesignator": "0Q"},
            )

    def test_create_orga_role_rejects_duplicate_role_id(self) -> None:
        service.create_organisation(self.repository, entity_id="I21-ORG-01", properties=organisation_properties())
        service.create_orga_role(
            self.repository,
            entity_id="I21-ROLE-01",
            organisation_id="I21-ORG-01",
            type="partner/supplier/airline",
            properties={"airlineDesignator": "0Q"},
        )
        with self.assertRaises(DuplicateEntityError):
            service.create_orga_role(
                self.repository,
                entity_id="I21-ROLE-01",
                organisation_id="I21-ORG-01",
                type="partner/supplier/airline",
                properties={"airlineDesignator": "0Q"},
            )

    def test_create_orga_role_writes_has_role_relationship(self) -> None:
        service.create_organisation(self.repository, entity_id="I21-ORG-01", properties=organisation_properties())
        service.create_orga_role(
            self.repository,
            entity_id="I21-ROLE-01",
            organisation_id="I21-ORG-01",
            type="partner/supplier/airline",
            properties={"airlineDesignator": "0Q"},
        )
        roles = service.list_orga_roles(self.repository, "I21-ORG-01")
        self.assertEqual(("I21-ROLE-01",), tuple(role.entity_id for role in roles))

    def test_get_orga_role_raises_not_found(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.get_orga_role(self.repository, "MISSING")

    def test_list_orga_roles_requires_existing_organisation(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.list_orga_roles(self.repository, "MISSING")

    def test_update_orga_role_requires_existing(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.update_orga_role(
                self.repository, "MISSING", type="partner/supplier/airline", properties={"airlineDesignator": "0Q"}
            )

    def test_update_orga_role_replaces_properties(self) -> None:
        service.create_organisation(self.repository, entity_id="I21-ORG-01", properties=organisation_properties())
        service.create_orga_role(
            self.repository,
            entity_id="I21-ROLE-01",
            organisation_id="I21-ORG-01",
            type="partner/supplier/airline",
            properties={"airlineDesignator": "0Q"},
        )
        updated = service.update_orga_role(
            self.repository, "I21-ROLE-01", type="partner/supplier/airline", properties={"airlineDesignator": "LH"}
        )
        self.assertEqual("LH", updated.properties.airline_designator)

    def test_delete_orga_role_removes_entity(self) -> None:
        service.create_organisation(self.repository, entity_id="I21-ORG-01", properties=organisation_properties())
        service.create_orga_role(
            self.repository,
            entity_id="I21-ROLE-01",
            organisation_id="I21-ORG-01",
            type="partner/supplier/airline",
            properties={"airlineDesignator": "0Q"},
        )
        service.delete_orga_role(self.repository, "I21-ROLE-01")
        with self.assertRaises(EntityNotFoundError):
            service.get_orga_role(self.repository, "I21-ROLE-01")

    def test_delete_organisation_blocked_while_role_dependent_exists(self) -> None:
        service.create_organisation(self.repository, entity_id="I21-ORG-01", properties=organisation_properties())
        service.create_orga_role(
            self.repository,
            entity_id="I21-ROLE-01",
            organisation_id="I21-ORG-01",
            type="partner/supplier/airline",
            properties={"airlineDesignator": "0Q"},
        )
        with self.assertRaises(DependentEntityExistsError):
            service.delete_organisation(self.repository, "I21-ORG-01")


if __name__ == "__main__":
    unittest.main()
