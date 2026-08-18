"""Proves a module's ScopedEntityRepository cannot touch another module's entity kinds."""

from __future__ import annotations

import unittest

from cct.resource_management.contracts import EntityKind
from cct.resource_management.pagination import PageRequest, PageResult
from cct.resource_management.relationship_types import RelationshipType
from cct.resource_management.repository_ports import ScopedEntityRepository


class FakeEntityRepository:
    """In-memory stand-in for the Neo4j-backed repository, records every call."""

    def __init__(self) -> None:
        self.calls: list[tuple[str, tuple[object, ...]]] = []

    def get(self, entity_kind: EntityKind, entity_id: str):
        self.calls.append(("get", (entity_kind, entity_id)))
        return None

    def list(self, entity_kind: EntityKind, *, type_filter=None, page=PageRequest()):
        self.calls.append(("list", (entity_kind, type_filter, page)))
        return PageResult(items=(), next_cursor=None)

    def save(self, candidate):
        self.calls.append(("save", (candidate,)))
        return candidate

    def delete(self, entity_kind: EntityKind, entity_id: str) -> None:
        self.calls.append(("delete", (entity_kind, entity_id)))

    def create_relationship(self, *, from_kind, from_id, relationship, to_kind, to_id) -> None:
        self.calls.append(("create_relationship", (from_kind, from_id, relationship, to_kind, to_id)))

    def list_related(self, *, from_kind, from_id, relationship, to_kind):
        self.calls.append(("list_related", (from_kind, from_id, relationship, to_kind)))
        return ()

    def get_component_tree(self, product_id: str):
        self.calls.append(("get_component_tree", (product_id,)))
        return ()

    def get_order_detail(self, order_id: str):
        self.calls.append(("get_order_detail", (order_id,)))
        return ()


class ScopedEntityRepositoryTest(unittest.TestCase):
    def setUp(self) -> None:
        self.fake = FakeEntityRepository()
        self.person_repository = ScopedEntityRepository(
            self.fake, allowed_kinds=frozenset({EntityKind.PERSON, EntityKind.PERSON_ROLE})
        )

    def test_allowed_kind_get_is_delegated(self) -> None:
        self.person_repository.get(EntityKind.PERSON, "PER-01")
        self.assertEqual([("get", (EntityKind.PERSON, "PER-01"))], self.fake.calls)

    def test_out_of_scope_get_is_rejected(self) -> None:
        with self.assertRaises(PermissionError):
            self.person_repository.get(EntityKind.ORGANISATION, "ORG-01")
        self.assertEqual([], self.fake.calls)

    def test_out_of_scope_list_is_rejected(self) -> None:
        with self.assertRaises(PermissionError):
            self.person_repository.list(EntityKind.STOCK_ITEM)
        self.assertEqual([], self.fake.calls)

    def test_out_of_scope_save_is_rejected_by_declared_entity_kind(self) -> None:
        with self.assertRaises(PermissionError):
            self.person_repository.save({"entityKind": "Organisation", "entityId": "ORG-01"})
        self.assertEqual([], self.fake.calls)

    def test_allowed_save_is_delegated(self) -> None:
        candidate = {"entityKind": "Person", "entityId": "PER-01"}
        self.person_repository.save(candidate)
        self.assertEqual([("save", (candidate,))], self.fake.calls)

    def test_out_of_scope_delete_is_rejected(self) -> None:
        with self.assertRaises(PermissionError):
            self.person_repository.delete(EntityKind.ORDER_ITEM, "ORD-01")
        self.assertEqual([], self.fake.calls)

    def test_out_of_scope_relationship_write_is_rejected_by_from_kind(self) -> None:
        with self.assertRaises(PermissionError):
            self.person_repository.create_relationship(
                from_kind=EntityKind.ORDER_ITEM,
                from_id="ORD-01",
                relationship=RelationshipType.ALLOCATES_STOCK,
                to_kind=EntityKind.STOCK_ITEM,
                to_id="STK-01",
            )
        self.assertEqual([], self.fake.calls)

    def test_allowed_relationship_write_is_delegated(self) -> None:
        self.person_repository.create_relationship(
            from_kind=EntityKind.PERSON,
            from_id="PER-01",
            relationship=RelationshipType.HAS_ROLE,
            to_kind=EntityKind.PERSON_ROLE,
            to_id="ROLE-01",
        )
        self.assertEqual(
            [
                (
                    "create_relationship",
                    (EntityKind.PERSON, "PER-01", RelationshipType.HAS_ROLE, EntityKind.PERSON_ROLE, "ROLE-01"),
                )
            ],
            self.fake.calls,
        )

    def test_out_of_scope_component_tree_read_is_rejected(self) -> None:
        with self.assertRaises(PermissionError):
            self.person_repository.get_component_tree("PROD-01")
        self.assertEqual([], self.fake.calls)

    def test_out_of_scope_order_detail_read_is_rejected(self) -> None:
        with self.assertRaises(PermissionError):
            self.person_repository.get_order_detail("ORDER-01")
        self.assertEqual([], self.fake.calls)


if __name__ == "__main__":
    unittest.main()
