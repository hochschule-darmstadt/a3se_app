"""Unit evidence for the read/list/delete/relationship repository extensions."""

from __future__ import annotations

import unittest

from cct.infrastructure.neo4j.entity_repository import Neo4jEntityRepository
from cct.resource_management.contracts import EntityKind
from cct.resource_management.default_registry import create_entity_registry
from cct.resource_management.errors import DependentEntityExistsError, EntityNotFoundError
from cct.resource_management.pagination import PageRequest
from cct.resource_management.relationship_types import RelationshipType


def order_position_node(entity_id: str) -> dict[str, object]:
    return {"entityId": entity_id, "entityKind": "OrderItem", "type": "order/position", "schemaVersion": 1}


def transfer_product_node(entity_id: str) -> dict[str, object]:
    return {
        "entityId": entity_id,
        "entityKind": "TouristicProductItem",
        "type": "product/mobility/transfer",
        "schemaVersion": 1,
        "name": "Package",
    }


class FakeResult:
    def __init__(self, records: list[dict[str, object]]) -> None:
        self._records = records

    def single(self, *, strict: bool = True):
        if not self._records:
            if strict:
                raise ValueError("no records")
            return None
        return self._records[0]

    def __iter__(self):
        return iter(self._records)

    def consume(self):
        return None


class ScriptedTransaction:
    """Returns one pre-scripted result list per .run() call, in call order."""

    def __init__(self, scripted_results: list[list[dict[str, object]]]) -> None:
        self._scripted_results = list(scripted_results)
        self.calls: list[tuple[str, dict[str, object]]] = []

    def run(self, query: str, **parameters: object) -> FakeResult:
        self.calls.append((query, parameters))
        records = self._scripted_results.pop(0) if self._scripted_results else []
        return FakeResult(records)


class ScriptedSession:
    def __init__(self, transaction: ScriptedTransaction) -> None:
        self.transaction = transaction

    def __enter__(self) -> "ScriptedSession":
        return self

    def __exit__(self, *args: object) -> None:
        return None

    def execute_write(self, callback, *args: object):
        return callback(self.transaction, *args)

    def execute_read(self, callback, *args: object):
        return callback(self.transaction, *args)


class ScriptedDriver:
    def __init__(self, scripted_results: list[list[dict[str, object]]]) -> None:
        self.session_instance = ScriptedSession(ScriptedTransaction(scripted_results))

    def session(self, *, database: str) -> ScriptedSession:
        return self.session_instance


class Neo4jEntityRepositoryCrudTest(unittest.TestCase):
    def setUp(self) -> None:
        self.registry = create_entity_registry()

    def repository(self, scripted_results: list[list[dict[str, object]]]) -> tuple[Neo4jEntityRepository, ScriptedDriver]:
        driver = ScriptedDriver(scripted_results)
        return Neo4jEntityRepository(driver, "neo4j", self.registry), driver

    def test_get_returns_entity_when_found(self) -> None:
        repository, driver = self.repository([[{"entity": order_position_node("I21-POS-01")}]])
        entity = repository.get(EntityKind.ORDER_ITEM, "I21-POS-01")
        self.assertEqual("I21-POS-01", entity.entity_id)
        query, params = driver.session_instance.transaction.calls[0]
        self.assertIn("OrderItem", query)
        self.assertEqual("I21-POS-01", params["entityId"])

    def test_get_returns_none_when_not_found(self) -> None:
        repository, _ = self.repository([[]])
        self.assertIsNone(repository.get(EntityKind.ORDER_ITEM, "MISSING"))

    def test_list_returns_items_and_cursor_when_more_remain(self) -> None:
        records = [{"entity": order_position_node(f"I21-POS-{i:02d}")} for i in range(3)]
        repository, _ = self.repository([records])
        page = repository.list(EntityKind.ORDER_ITEM, page=PageRequest(limit=2))
        self.assertEqual(2, len(page.items))
        self.assertEqual("I21-POS-01", page.next_cursor)

    def test_list_returns_no_cursor_when_exhausted(self) -> None:
        records = [{"entity": order_position_node("I21-POS-00")}]
        repository, _ = self.repository([records])
        page = repository.list(EntityKind.ORDER_ITEM, page=PageRequest(limit=2))
        self.assertEqual(1, len(page.items))
        self.assertIsNone(page.next_cursor)

    def test_list_passes_type_filter_and_after_cursor_as_parameters(self) -> None:
        repository, driver = self.repository([[]])
        repository.list(EntityKind.ORDER_ITEM, type_filter="order/position", page=PageRequest(after="I21-POS-00"))
        _, params = driver.session_instance.transaction.calls[0]
        self.assertEqual("order/position", params["type"])
        self.assertEqual("I21-POS-00", params["after"])

    def test_delete_removes_entity_without_dependents(self) -> None:
        existence_row = [{"id": "I21-POS-01"}]
        repository, driver = self.repository([existence_row, [], [], []])
        repository.delete(EntityKind.ORDER_ITEM, "I21-POS-01")
        self.assertEqual(4, len(driver.session_instance.transaction.calls))
        delete_query, _ = driver.session_instance.transaction.calls[-1]
        self.assertIn("DETACH DELETE entity", delete_query)

    def test_delete_raises_when_incoming_reference_edge_exists(self) -> None:
        existence_row = [{"id": "I21-STOCK-01"}]
        incoming_rows = [{"relationshipType": "ALLOCATES_STOCK", "count": 1}]
        repository, driver = self.repository([existence_row, [], incoming_rows])
        with self.assertRaises(DependentEntityExistsError) as context:
            repository.delete(EntityKind.STOCK_ITEM, "I21-STOCK-01")
        self.assertEqual(((RelationshipType.ALLOCATES_STOCK, 1),), context.exception.dependents)
        self.assertEqual(3, len(driver.session_instance.transaction.calls))

    def test_delete_raises_when_outgoing_ownership_edge_exists(self) -> None:
        existence_row = [{"id": "I21-PER-01"}]
        outgoing_rows = [{"relationshipType": "HAS_ROLE", "count": 1}]
        repository, driver = self.repository([existence_row, outgoing_rows, []])
        with self.assertRaises(DependentEntityExistsError) as context:
            repository.delete(EntityKind.PERSON, "I21-PER-01")
        self.assertEqual(((RelationshipType.HAS_ROLE, 1),), context.exception.dependents)
        self.assertEqual(3, len(driver.session_instance.transaction.calls))

    def test_delete_ignores_incoming_ownership_edge_from_parent(self) -> None:
        # A PersonRole's own incoming HAS_ROLE edge from its owning Person must
        # not block deleting the role itself -- otherwise a nested item could
        # never be removed while its parent still exists.
        existence_row = [{"id": "I21-ROLE-01"}]
        incoming_rows = [{"relationshipType": "HAS_ROLE", "count": 1}]
        repository, driver = self.repository([existence_row, [], incoming_rows, []])
        repository.delete(EntityKind.PERSON_ROLE, "I21-ROLE-01")
        delete_query, _ = driver.session_instance.transaction.calls[-1]
        self.assertIn("DETACH DELETE entity", delete_query)

    def test_delete_ignores_outgoing_reference_edge(self) -> None:
        # A StockItem's own outgoing REPRESENTS_PRODUCT edge must not block
        # deleting the stock item -- nothing dangles on the product's side.
        existence_row = [{"id": "I21-STOCK-01"}]
        outgoing_rows = [{"relationshipType": "REPRESENTS_PRODUCT", "count": 1}]
        repository, driver = self.repository([existence_row, outgoing_rows, [], []])
        repository.delete(EntityKind.STOCK_ITEM, "I21-STOCK-01")
        delete_query, _ = driver.session_instance.transaction.calls[-1]
        self.assertIn("DETACH DELETE entity", delete_query)

    def test_delete_raises_not_found_when_entity_missing(self) -> None:
        repository, driver = self.repository([[]])
        with self.assertRaises(EntityNotFoundError):
            repository.delete(EntityKind.ORDER_ITEM, "MISSING")
        self.assertEqual(1, len(driver.session_instance.transaction.calls))

    def test_create_relationship_succeeds_and_uses_allowlisted_type(self) -> None:
        repository, driver = self.repository([[{"fromId": "I21-POS-01", "toId": "I21-STOCK-01"}]])
        repository.create_relationship(
            from_kind=EntityKind.ORDER_ITEM,
            from_id="I21-POS-01",
            relationship=RelationshipType.ALLOCATES_STOCK,
            to_kind=EntityKind.STOCK_ITEM,
            to_id="I21-STOCK-01",
        )
        query, params = driver.session_instance.transaction.calls[0]
        self.assertIn("ALLOCATES_STOCK", query)
        self.assertEqual("I21-POS-01", params["fromId"])
        self.assertEqual("I21-STOCK-01", params["toId"])

    def test_create_relationship_raises_not_found_when_endpoint_missing(self) -> None:
        repository, _ = self.repository([[]])
        with self.assertRaises(EntityNotFoundError):
            repository.create_relationship(
                from_kind=EntityKind.ORDER_ITEM,
                from_id="I21-POS-01",
                relationship=RelationshipType.ALLOCATES_STOCK,
                to_kind=EntityKind.STOCK_ITEM,
                to_id="MISSING",
            )

    def test_list_related_returns_mapped_entities(self) -> None:
        repository, driver = self.repository([[{"related": order_position_node("I21-POS-01")}]])
        related = repository.list_related(
            from_kind=EntityKind.ORDER_ITEM,
            from_id="I21-ORDER-01",
            relationship=RelationshipType.CONTAINS,
            to_kind=EntityKind.ORDER_ITEM,
        )
        self.assertEqual(("I21-POS-01",), tuple(entity.entity_id for entity in related))
        query, _ = driver.session_instance.transaction.calls[0]
        self.assertIn("[:CONTAINS]", query)

    def test_component_tree_returns_root_and_children_with_parent_ids(self) -> None:
        rows = [
            {"node": transfer_product_node("I21-PKG"), "parentId": None},
            {"node": transfer_product_node("I21-FLIGHT"), "parentId": "I21-PKG"},
        ]
        repository, _ = self.repository([rows])
        tree = repository.get_component_tree("I21-PKG")
        self.assertEqual(
            (("I21-PKG", None), ("I21-FLIGHT", "I21-PKG")),
            tuple((entity.entity_id, parent_id) for entity, parent_id in tree),
        )

    def test_component_tree_raises_not_found_for_missing_product(self) -> None:
        repository, _ = self.repository([[]])
        with self.assertRaises(EntityNotFoundError):
            repository.get_component_tree("MISSING")

    def test_order_detail_filters_out_positionless_row_and_raises_not_found_for_missing_header(self) -> None:
        header_found = [{"id": "I21-ORDER-01"}]
        detail_rows = [{"customerRoleId": None, "customerPersonId": None, "customerDisplayName": "", "positions": []}]
        repository, _ = self.repository([header_found, detail_rows])
        self.assertEqual({"customerRoleId": None, "customerPersonId": None, "customerDisplayName": "", "positions": []}, repository.get_order_detail("I21-ORDER-01"))

        repository_missing, _ = self.repository([[]])
        with self.assertRaises(EntityNotFoundError):
            repository_missing.get_order_detail("MISSING")

    def test_order_detail_returns_resolved_summary_for_positions(self) -> None:
        header_found = [{"id": "I21-ORDER-01"}]
        detail_rows = [{"customerRoleId": "I21-CUSTOMER-ROLE", "customerPersonId": "I21-CUSTOMER",
            "customerDisplayName": "Ada Kern", "positions": [{"positionId": "I21-POS-01",
            "stockItemId": "I21-STOCK-01", "productId": "I21-FLIGHT", "travellers": [
            {"roleId": "I21-TRAVELLER-ROLE", "personId": "I21-PERSON", "displayName": "Emil Brandt"}]}]}]
        repository, _ = self.repository([header_found, detail_rows])
        detail = repository.get_order_detail("I21-ORDER-01")
        self.assertEqual(
            detail_rows[0],
            detail,
        )


if __name__ == "__main__":
    unittest.main()
