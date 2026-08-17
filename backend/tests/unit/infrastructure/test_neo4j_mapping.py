"""Unit evidence for the accepted direct-property Neo4j mapping."""

from __future__ import annotations

from datetime import date, time
from decimal import Decimal
import unittest

from pydantic import ValidationError

from cct.infrastructure.neo4j.entity_mapping import Neo4jEntityMapper, NodeRecord, UnsupportedNeo4jProperty
from cct.infrastructure.neo4j.entity_repository import (
    COMMUNITY_SCHEMA,
    ORDER_FULFILMENT_TRAVERSAL,
    Neo4jEntityRepository,
)
from cct.resource_management.default_registry import create_entity_registry


class RecordingTransaction:
    def __init__(self) -> None:
        self.calls: list[tuple[str, dict[str, object]]] = []

    def run(self, query: str, **parameters: object) -> None:
        self.calls.append((query, parameters))


class RecordingSession:
    def __init__(self) -> None:
        self.transaction = RecordingTransaction()
        self.write_count = 0

    def __enter__(self): return self
    def __exit__(self, *args: object) -> None: return None
    def execute_write(self, callback, *args: object):
        self.write_count += 1
        return callback(self.transaction, *args)


class RecordingDriver:
    def __init__(self) -> None:
        self.session_instance = RecordingSession()
        self.database: str | None = None

    def session(self, *, database: str) -> RecordingSession:
        self.database = database
        return self.session_instance


class Neo4jMappingTest(unittest.TestCase):
    def setUp(self) -> None:
        self.registry = create_entity_registry()
        self.mapper = Neo4jEntityMapper(self.registry)

    def test_valid_entity_round_trips_without_semantic_loss(self) -> None:
        entity = self.registry.validate(
            {"entityId": "STOCK-001", "entityKind": "StockItem", "type": "stock/flight/seat",
             "properties": {"serviceDate": date(2027, 1, 8), "unitPriceAmount": Decimal("500.00"),
                            "currencyCode": "EUR"}}
        )
        node = self.mapper.to_node(entity)
        self.assertEqual("500.00", node.properties["unitPriceAmount"])
        self.assertEqual(["unitPriceAmount"], node.properties["decimalPropertyKeys"])
        self.assertEqual(entity, self.mapper.from_node(node))

    def test_direct_properties_remain_queryable_and_indexes_are_declared(self) -> None:
        entity = self.registry.validate(
            {"entityId": "FLT-02", "entityKind": "TouristicProductItem", "type": "product/flight",
             "properties": {"flightNumber": "500", "departureLocationCode": "FRA",
                            "arrivalLocationCode": "GIG", "scheduledDepartureLocalTime": time(10, 30),
                            "scheduledArrivalLocalTime": time(18, 45)}}
        )
        node = self.mapper.to_node(entity)
        self.assertEqual("FRA", node.properties["departureLocationCode"])
        self.assertTrue(any("departureLocationCode" in statement for statement in COMMUNITY_SCHEMA))

    def test_nested_and_heterogeneous_values_fail_explicitly(self) -> None:
        self.assertEqual([1, 2], self.mapper._require_property_value("homogeneous", [1, 2]))
        with self.assertRaises(UnsupportedNeo4jProperty):
            self.mapper._require_property_value("nested", {"a": 1})
        with self.assertRaises(UnsupportedNeo4jProperty):
            self.mapper._require_property_value("mixed", [1, "two"])
        with self.assertRaises(UnsupportedNeo4jProperty):
            self.mapper._require_property_value("nullable", [1, None])

    def test_optional_null_is_omitted_but_missing_required_value_is_invalid(self) -> None:
        entity = self.registry.validate(
            {"entityId": "FLT-02", "entityKind": "TouristicProductItem", "type": "product/flight",
             "properties": {"flightNumber": "500", "departureLocationCode": "FRA",
                            "arrivalLocationCode": "GIG", "scheduledDepartureLocalTime": time(10, 30),
                            "scheduledArrivalLocalTime": time(18, 45), "aircraftTypeDesignator": None}}
        )
        self.assertNotIn("aircraftTypeDesignator", self.mapper.to_node(entity).properties)

    def test_corrupt_decimal_marker_fails_round_trip(self) -> None:
        with self.assertRaisesRegex(ValueError, "encoded decimal"):
            self.mapper.from_node(NodeRecord("StockItem", {
                "entityId": "STOCK-001", "entityKind": "StockItem", "type": "stock/flight/seat",
                "schemaVersion": 1, "serviceDate": date(2027, 1, 8), "unitPriceAmount": 500.0,
                "currencyCode": "EUR", "decimalPropertyKeys": ["unitPriceAmount"],
            }))

    def test_repository_rejects_invalid_write_before_transaction(self) -> None:
        driver = RecordingDriver()
        repository = Neo4jEntityRepository(driver, "neo4j", self.registry)
        with self.assertRaises(ValidationError):
            repository.save(
                {"entityId": "FLT-X", "entityKind": "TouristicProductItem", "type": "product/flight",
                 "properties": {"flightNumber": 500}}
            )
        self.assertEqual(0, driver.session_instance.write_count)

    def test_repository_uses_managed_parameterised_write(self) -> None:
        driver = RecordingDriver()
        repository = Neo4jEntityRepository(driver, "neo4j", self.registry)
        repository.save(
            {"entityId": "ORDER-001", "entityKind": "OrderItem", "type": "order/header",
             "properties": {"orderNumber": "5766", "orderStatusCode": "order/paid"}}
        )
        query, parameters = driver.session_instance.transaction.calls[0]
        self.assertIn("$properties", query)
        self.assertNotIn("5766", query)
        self.assertEqual("neo4j", driver.database)
        self.assertEqual("5766", parameters["properties"]["orderNumber"])

    def test_recursive_structure_and_bounded_heterogeneous_path_are_explicit(self) -> None:
        self.assertIn("(order:OrderItem", ORDER_FULFILMENT_TRAVERSAL)
        self.assertIn("[:CONTAINS]", ORDER_FULFILMENT_TRAVERSAL)
        self.assertIn("[:REPRESENTS_PRODUCT]", ORDER_FULFILMENT_TRAVERSAL)
        self.assertIn("[:SUPPLIED_BY]", ORDER_FULFILMENT_TRAVERSAL)
        self.assertIn("[:ASSIGNED_TRAVELLER]", ORDER_FULFILMENT_TRAVERSAL)
        self.assertIn("LIMIT $limit", ORDER_FULFILMENT_TRAVERSAL)
