"""Neo4j Community integration evidence, enabled by explicit test settings."""

from __future__ import annotations

from datetime import date, time
from decimal import Decimal
import os
import unittest

from neo4j import GraphDatabase

from cct.infrastructure.neo4j.entity_mapping import Neo4jEntityMapper, NodeRecord
from cct.infrastructure.neo4j.entity_repository import COMMUNITY_SCHEMA, Neo4jEntityRepository
from cct.resource_management.default_registry import create_entity_registry


@unittest.skipUnless(os.getenv("CCT_NEO4J_TEST_URI"), "CCT_NEO4J_TEST_URI not configured")
class Neo4jEntityMappingIntegrationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.driver = GraphDatabase.driver(
            os.environ["CCT_NEO4J_TEST_URI"],
            auth=(os.getenv("CCT_NEO4J_TEST_USER", "neo4j"), os.environ["CCT_NEO4J_TEST_PASSWORD"]),
        )
        cls.driver.verify_connectivity()
        cls.registry = create_entity_registry()
        cls.mapper = Neo4jEntityMapper(cls.registry)
        with cls.driver.session(database="neo4j") as session:
            for statement in COMMUNITY_SCHEMA:
                session.run(statement).consume()

    @classmethod
    def tearDownClass(cls) -> None:
        with cls.driver.session(database="neo4j") as session:
            session.run("MATCH (n) WHERE n.entityId STARTS WITH 'I20-' DETACH DELETE n").consume()
        cls.driver.close()

    def test_round_trip_and_indexed_lookup(self) -> None:
        repository = Neo4jEntityRepository(self.driver, "neo4j", self.registry)
        entity = repository.save(
            {"entityId": "I20-FLIGHT", "entityKind": "TouristicProductItem", "type": "product/airline/flight",
             "properties": {"flightNumber": "500", "departureLocationCode": "FRA",
                            "arrivalLocationCode": "GIG", "scheduledDepartureLocalTime": time(10, 30),
                            "scheduledArrivalLocalTime": time(18, 45)}}
        )
        with self.driver.session(database="neo4j") as session:
            record = session.run(
                "MATCH (n:TouristicProductItem {departureLocationCode: $code}) RETURN n",
                code="FRA",
            ).single(strict=True)
            indexes = session.run(
                "SHOW INDEXES YIELD name WHERE name = 'flight_departure' RETURN name"
            ).single(strict=True)
        restored = self.mapper.from_node(NodeRecord("TouristicProductItem", dict(record["n"])))
        self.assertEqual(entity, restored)
        self.assertEqual("flight_departure", indexes["name"])

    def test_recursive_composition_and_heterogeneous_fulfilment_path(self) -> None:
        repository = Neo4jEntityRepository(self.driver, "neo4j", self.registry)
        fixtures = (
            {"entityId": "I20-FLIGHT", "entityKind": "TouristicProductItem", "type": "product/airline/flight",
             "properties": {"flightNumber": "500", "departureLocationCode": "FRA",
                            "arrivalLocationCode": "GIG", "scheduledDepartureLocalTime": time(10, 30),
                            "scheduledArrivalLocalTime": time(18, 45)}},
            {"entityId": "I20-ORDER", "entityKind": "OrderItem", "type": "order/header",
             "properties": {"orderNumber": "I20-5766", "orderStatusCode": "order/paid"}},
            {"entityId": "I20-POSITION", "entityKind": "OrderItem", "type": "order/position", "properties": {}},
            {"entityId": "I20-STOCK", "entityKind": "StockItem", "type": "stock/airline/flight/seat",
             "properties": {"serviceDate": date(2027, 1, 8), "unitPriceAmount": Decimal("500.00"),
                            "currencyCode": "EUR"}},
            {"entityId": "I20-SEAT", "entityKind": "TouristicProductItem", "type": "product/airline/flight/seat",
             "properties": {"seatNumber": "5A"}},
            {"entityId": "I20-SUPPLIER", "entityKind": "Organisation", "properties": {"name": "Condorleaf Air"}},
            {"entityId": "I20-SUPPLIER-ROLE", "entityKind": "OrgaRole", "type": "organisation/airline",
             "properties": {"airlineDesignator": "0Q"}},
            {"entityId": "I20-PERSON", "entityKind": "Person",
             "properties": {"givenName": "Emil", "familyName": "Brandt"}},
            {"entityId": "I20-TRAVELLER-ROLE", "entityKind": "PersonRole", "type": "person/traveller",
             "properties": {}},
        )
        for fixture in fixtures:
            repository.save(fixture)
        with self.driver.session(database="neo4j") as session:
            session.execute_write(self._create_graph)
            result = session.run(
                """
                MATCH (o:OrderItem {entityId: 'I20-ORDER'})-[:CONTAINS]->(p:OrderItem)
                      -[:ALLOCATES_STOCK]->(s:StockItem)-[:REPRESENTS_PRODUCT]->(product:TouristicProductItem)
                      -[:SUPPLIED_BY]->(:OrgaRole)<-[:HAS_ROLE]-(supplier:Organisation),
                      (p)-[:ASSIGNED_TRAVELLER]->(:PersonRole)<-[:HAS_ROLE]-(traveller:Person)
                MATCH (product)-[:CONTAINS]->(seat:TouristicProductItem)
                RETURN supplier.entityId AS supplier, traveller.entityId AS traveller,
                       product.entityId AS product, seat.entityId AS seat
                LIMIT 10
                """
            ).single(strict=True)
        self.assertEqual(
            {"supplier": "I20-SUPPLIER", "traveller": "I20-PERSON", "product": "I20-FLIGHT",
             "seat": "I20-SEAT"},
            dict(result),
        )

    @staticmethod
    def _create_graph(tx) -> None:
        tx.run(
            """
            MATCH (o:OrderItem {entityId: 'I20-ORDER'})
            MATCH (p:OrderItem {entityId: 'I20-POSITION'})
            MATCH (s:StockItem {entityId: 'I20-STOCK'})
            MATCH (product:TouristicProductItem {entityId: 'I20-FLIGHT'})
            MATCH (seat:TouristicProductItem {entityId: 'I20-SEAT'})
            MATCH (role:OrgaRole {entityId: 'I20-SUPPLIER-ROLE'})
            MATCH (supplier:Organisation {entityId: 'I20-SUPPLIER'})
            MATCH (travellerRole:PersonRole {entityId: 'I20-TRAVELLER-ROLE'})
            MATCH (traveller:Person {entityId: 'I20-PERSON'})
            MERGE (o)-[:CONTAINS]->(p)
            MERGE (p)-[:ALLOCATES_STOCK]->(s)
            MERGE (s)-[:REPRESENTS_PRODUCT]->(product)
            MERGE (product)-[:SUPPLIED_BY]->(role)
            MERGE (supplier)-[:HAS_ROLE]->(role)
            MERGE (p)-[:ASSIGNED_TRAVELLER]->(travellerRole)
            MERGE (traveller)-[:HAS_ROLE]->(travellerRole)
            MERGE (product)-[:CONTAINS]->(seat)
            """
        ).consume()
