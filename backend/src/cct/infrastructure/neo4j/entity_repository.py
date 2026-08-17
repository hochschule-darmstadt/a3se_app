"""Validated Neo4j write/read prototype for flexible entities."""

from __future__ import annotations

from typing import Protocol

from cct.resource_management.contracts import FlexibleEntity, ValidatedEntity
from cct.resource_management.registry import EntityTypeRegistry

from .entity_mapping import Neo4jEntityMapper, NodeRecord


class Transaction(Protocol):
    def run(self, query: str, **parameters: object): ...


class Session(Protocol):
    def __enter__(self) -> "Session": ...
    def __exit__(self, *args: object) -> None: ...
    def execute_write(self, callback, *args: object): ...


class Driver(Protocol):
    def session(self, *, database: str) -> Session: ...


class Neo4jEntityRepository:
    """Normal write path validates before opening a database transaction."""

    def __init__(self, driver: Driver, database: str, registry: EntityTypeRegistry) -> None:
        self._driver = driver
        self._database = database
        self._registry = registry
        self._mapper = Neo4jEntityMapper(registry)

    def save(self, candidate: FlexibleEntity | dict[str, object]) -> ValidatedEntity:
        entity = self._registry.validate(candidate)
        node = self._mapper.to_node(entity)
        with self._driver.session(database=self._database) as session:
            session.execute_write(self._write_node, node)
        return entity

    @staticmethod
    def _write_node(tx: Transaction, node: NodeRecord) -> None:
        # The label comes from the EntityKind allow-list, never caller input.
        query = f"MERGE (entity:{node.label} {{entityId: $entityId}}) SET entity = $properties"
        tx.run(query, entityId=node.properties["entityId"], properties=node.properties)


COMMUNITY_SCHEMA = (
    "CREATE CONSTRAINT person_entity_id IF NOT EXISTS FOR (n:Person) REQUIRE n.entityId IS UNIQUE",
    "CREATE CONSTRAINT person_role_entity_id IF NOT EXISTS FOR (n:PersonRole) REQUIRE n.entityId IS UNIQUE",
    "CREATE CONSTRAINT organisation_entity_id IF NOT EXISTS FOR (n:Organisation) REQUIRE n.entityId IS UNIQUE",
    "CREATE CONSTRAINT orga_role_entity_id IF NOT EXISTS FOR (n:OrgaRole) REQUIRE n.entityId IS UNIQUE",
    "CREATE CONSTRAINT product_entity_id IF NOT EXISTS FOR (n:TouristicProductItem) REQUIRE n.entityId IS UNIQUE",
    "CREATE CONSTRAINT stock_entity_id IF NOT EXISTS FOR (n:StockItem) REQUIRE n.entityId IS UNIQUE",
    "CREATE CONSTRAINT order_entity_id IF NOT EXISTS FOR (n:OrderItem) REQUIRE n.entityId IS UNIQUE",
    "CREATE INDEX product_type IF NOT EXISTS FOR (n:TouristicProductItem) ON (n.type)",
    "CREATE INDEX flight_departure IF NOT EXISTS FOR (n:TouristicProductItem) ON (n.departureLocationCode)",
    "CREATE INDEX order_number IF NOT EXISTS FOR (n:OrderItem) ON (n.orderNumber)",
)

ORDER_FULFILMENT_TRAVERSAL = """
MATCH (order:OrderItem {entityId: $orderId})-[:CONTAINS]->(position:OrderItem)
MATCH (position)-[:ALLOCATES_STOCK]->(stock:StockItem)
MATCH (stock)-[:REPRESENTS_PRODUCT]->(product:TouristicProductItem)
MATCH (product)-[:SUPPLIED_BY]->(supplierRole:OrgaRole)<-[:HAS_ROLE]-(supplier:Organisation)
MATCH (position)-[:ASSIGNED_TRAVELLER]->(travellerRole:PersonRole)<-[:HAS_ROLE]-(traveller:Person)
RETURN order, position, stock, product, supplierRole, supplier, travellerRole, traveller
LIMIT $limit
""".strip()

