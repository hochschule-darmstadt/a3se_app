"""Unit tests for Person Management application operations, against a fake repository."""

from __future__ import annotations

import unittest

from support.fake_entity_repository import FakeEntityRepository

from cct.resource_management.errors import DependentEntityExistsError, DuplicateEntityError, EntityNotFoundError
from cct.resource_management.pagination import PageRequest
from cct.resource_management.person_management import service


def person_properties(**overrides: object) -> dict[str, object]:
    properties = {"givenName": "Emil", "familyName": "Brandt"}
    properties.update(overrides)
    return properties


class PersonServiceTest(unittest.TestCase):
    def setUp(self) -> None:
        self.repository = FakeEntityRepository()

    def test_create_person_succeeds(self) -> None:
        entity = service.create_person(self.repository, entity_id="I21-PER-01", properties=person_properties())
        self.assertEqual("I21-PER-01", entity.entity_id)
        self.assertEqual("Emil", entity.properties.given_name)

    def test_create_person_rejects_duplicate(self) -> None:
        service.create_person(self.repository, entity_id="I21-PER-01", properties=person_properties())
        with self.assertRaises(DuplicateEntityError):
            service.create_person(self.repository, entity_id="I21-PER-01", properties=person_properties())

    def test_get_person_raises_not_found(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.get_person(self.repository, "MISSING")

    def test_list_persons_returns_created_people(self) -> None:
        service.create_person(self.repository, entity_id="I21-PER-01", properties=person_properties())
        service.create_person(self.repository, entity_id="I21-PER-02", properties=person_properties(givenName="Sarah"))
        page = service.list_persons(self.repository, page=PageRequest(limit=10))
        self.assertEqual(("I21-PER-01", "I21-PER-02"), tuple(entity.entity_id for entity in page.items))

    def test_update_person_requires_existing(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.update_person(self.repository, "MISSING", properties=person_properties())

    def test_update_person_replaces_properties(self) -> None:
        service.create_person(self.repository, entity_id="I21-PER-01", properties=person_properties())
        updated = service.update_person(
            self.repository, "I21-PER-01", properties=person_properties(familyName="Novak")
        )
        self.assertEqual("Novak", updated.properties.family_name)

    def test_delete_person_removes_entity(self) -> None:
        service.create_person(self.repository, entity_id="I21-PER-01", properties=person_properties())
        service.delete_person(self.repository, "I21-PER-01")
        with self.assertRaises(EntityNotFoundError):
            service.get_person(self.repository, "I21-PER-01")

    def test_delete_person_raises_not_found(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.delete_person(self.repository, "MISSING")

    def test_create_person_role_requires_existing_person(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.create_person_role(
                self.repository,
                entity_id="I21-ROLE-01",
                person_id="MISSING",
                type="person/traveller",
                properties={},
            )

    def test_create_person_role_rejects_duplicate_role_id(self) -> None:
        service.create_person(self.repository, entity_id="I21-PER-01", properties=person_properties())
        service.create_person_role(
            self.repository, entity_id="I21-ROLE-01", person_id="I21-PER-01", type="person/traveller", properties={}
        )
        with self.assertRaises(DuplicateEntityError):
            service.create_person_role(
                self.repository,
                entity_id="I21-ROLE-01",
                person_id="I21-PER-01",
                type="person/traveller",
                properties={},
            )

    def test_create_person_role_writes_has_role_relationship(self) -> None:
        service.create_person(self.repository, entity_id="I21-PER-01", properties=person_properties())
        service.create_person_role(
            self.repository, entity_id="I21-ROLE-01", person_id="I21-PER-01", type="person/traveller", properties={}
        )
        roles = service.list_person_roles(self.repository, "I21-PER-01")
        self.assertEqual(("I21-ROLE-01",), tuple(role.entity_id for role in roles))

    def test_get_person_role_raises_not_found(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.get_person_role(self.repository, "MISSING")

    def test_list_person_roles_requires_existing_person(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.list_person_roles(self.repository, "MISSING")

    def test_update_person_role_requires_existing(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.update_person_role(self.repository, "MISSING", type="person/traveller", properties={})

    def test_update_person_role_replaces_properties(self) -> None:
        service.create_person(self.repository, entity_id="I21-PER-01", properties=person_properties())
        service.create_person_role(
            self.repository,
            entity_id="I21-ROLE-01",
            person_id="I21-PER-01",
            type="person/customer",
            properties={},
        )
        updated = service.update_person_role(
            self.repository,
            "I21-ROLE-01",
            type="person/customer",
            properties={"paymentMethodCode": "payment/paypal"},
        )
        self.assertEqual("payment/paypal", updated.properties.payment_method_code)

    def test_delete_person_role_removes_entity(self) -> None:
        service.create_person(self.repository, entity_id="I21-PER-01", properties=person_properties())
        service.create_person_role(
            self.repository, entity_id="I21-ROLE-01", person_id="I21-PER-01", type="person/traveller", properties={}
        )
        service.delete_person_role(self.repository, "I21-ROLE-01")
        with self.assertRaises(EntityNotFoundError):
            service.get_person_role(self.repository, "I21-ROLE-01")

    def test_delete_person_blocked_while_role_dependent_exists(self) -> None:
        service.create_person(self.repository, entity_id="I21-PER-01", properties=person_properties())
        service.create_person_role(
            self.repository, entity_id="I21-ROLE-01", person_id="I21-PER-01", type="person/traveller", properties={}
        )
        with self.assertRaises(DependentEntityExistsError):
            service.delete_person(self.repository, "I21-PER-01")


if __name__ == "__main__":
    unittest.main()
