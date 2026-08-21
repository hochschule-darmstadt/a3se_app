"""Validated Neo4j write/read prototype for flexible entities."""

from __future__ import annotations

from datetime import date
from typing import Final, Protocol

from cct.resource_management.contracts import EntityKind, FlexibleEntity, ValidatedEntity
from cct.resource_management.errors import DependentEntityExistsError, EntityNotFoundError, InvalidEntityGraphError
from cct.resource_management.pagination import PageRequest, PageResult
from cct.resource_management.registry import EntityTypeRegistry
from cct.resource_management.relationship_types import OWNERSHIP_RELATIONSHIP_TYPES, RelationshipType

from .entity_mapping import LABELS, Neo4jEntityMapper, NodeRecord


class Transaction(Protocol):
    def run(self, query: str, **parameters: object): ...


class Session(Protocol):
    def __enter__(self) -> "Session": ...
    def __exit__(self, *args: object) -> None: ...
    def execute_write(self, callback, *args: object): ...
    def execute_read(self, callback, *args: object): ...


class Driver(Protocol):
    def session(self, *, database: str) -> Session: ...


PRODUCT_COMPONENT_MAX_DEPTH: Final = 10
"""Defensive cap on recursive CONTAINS reads, not a claimed business limit on nesting."""


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

    def get(self, entity_kind: EntityKind, entity_id: str) -> ValidatedEntity | None:
        with self._driver.session(database=self._database) as session:
            record = session.execute_read(self._read_one, entity_kind, entity_id)
        if record is None:
            return None
        return self._mapper.from_node(NodeRecord(LABELS[entity_kind], dict(record["entity"])))

    def list(
        self, entity_kind: EntityKind, *, type_filter: str | None = None, page: PageRequest = PageRequest()
    ) -> PageResult[ValidatedEntity]:
        with self._driver.session(database=self._database) as session:
            records = session.execute_read(self._read_page, entity_kind, type_filter, page)
        entities = [
            self._mapper.from_node(NodeRecord(LABELS[entity_kind], dict(record["entity"])))
            for record in records
        ]
        has_more = len(entities) > page.limit
        if has_more:
            entities = entities[: page.limit]
        next_cursor = entities[-1].entity_id if has_more and entities else None
        return PageResult(items=tuple(entities), next_cursor=next_cursor)

    def delete(self, entity_kind: EntityKind, entity_id: str) -> None:
        with self._driver.session(database=self._database) as session:
            session.execute_write(self._delete_node, entity_kind, entity_id)

    def create_relationship(
        self,
        *,
        from_kind: EntityKind,
        from_id: str,
        relationship: RelationshipType,
        to_kind: EntityKind,
        to_id: str,
    ) -> None:
        with self._driver.session(database=self._database) as session:
            session.execute_write(self._create_relationship, from_kind, from_id, relationship, to_kind, to_id)

    def delete_relationship(
        self,
        *,
        from_kind: EntityKind,
        from_id: str,
        relationship: RelationshipType,
        to_kind: EntityKind,
        to_id: str,
    ) -> None:
        with self._driver.session(database=self._database) as session:
            session.execute_write(self._delete_relationship, from_kind, from_id, relationship, to_kind, to_id)

    def list_related(
        self,
        *,
        from_kind: EntityKind,
        from_id: str,
        relationship: RelationshipType,
        to_kind: EntityKind,
    ) -> tuple[ValidatedEntity, ...]:
        with self._driver.session(database=self._database) as session:
            records = session.execute_read(self._read_related, from_kind, from_id, relationship, to_kind)
        return tuple(
            self._mapper.from_node(NodeRecord(LABELS[to_kind], dict(record["related"])))
            for record in records
        )

    def get_component_tree(self, product_id: str) -> tuple[tuple[ValidatedEntity, str | None], ...]:
        """Return the recursive CONTAINS subtree as (node, parentId) pairs; parentId is None for the root."""
        with self._driver.session(database=self._database) as session:
            rows = session.execute_read(self._read_component_tree, product_id)
        if not rows:
            raise EntityNotFoundError(EntityKind.TOURISTIC_PRODUCT_ITEM, product_id)
        label = LABELS[EntityKind.TOURISTIC_PRODUCT_ITEM]
        return tuple(
            (self._mapper.from_node(NodeRecord(label, dict(row["node"]))), row["parentId"]) for row in rows
        )

    def get_ancestors(self, product_id: str) -> tuple[ValidatedEntity, ...]:
        """Return the CONTAINS parent chain root-first, excluding `product_id` itself; empty if it is already a root."""
        with self._driver.session(database=self._database) as session:
            exists = session.execute_read(self._read_one, EntityKind.TOURISTIC_PRODUCT_ITEM, product_id)
            if exists is None:
                raise EntityNotFoundError(EntityKind.TOURISTIC_PRODUCT_ITEM, product_id)
            rows = session.execute_read(self._read_ancestors, product_id)
        label = LABELS[EntityKind.TOURISTIC_PRODUCT_ITEM]
        return tuple(self._mapper.from_node(NodeRecord(label, dict(row["ancestor"]))) for row in rows)

    def get_product_parents(self, product_id: str) -> tuple[ValidatedEntity, ...]:
        with self._driver.session(database=self._database) as session:
            exists = session.execute_read(self._read_one, EntityKind.TOURISTIC_PRODUCT_ITEM, product_id)
            if exists is None:
                raise EntityNotFoundError(EntityKind.TOURISTIC_PRODUCT_ITEM, product_id)
            rows = session.execute_read(self._read_product_parents, product_id)
        label = LABELS[EntityKind.TOURISTIC_PRODUCT_ITEM]
        return tuple(self._mapper.from_node(NodeRecord(label, dict(row["parent"]))) for row in rows)

    def get_organisation_for_role(self, role_id: str) -> ValidatedEntity | None:
        with self._driver.session(database=self._database) as session:
            records = session.execute_read(self._read_organisation_for_role, role_id)
        if not records:
            return None
        if len(records) > 1:
            raise InvalidEntityGraphError(role_id, "organisation role has multiple owners")
        return self._mapper.from_node(NodeRecord(LABELS[EntityKind.ORGANISATION], dict(records[0]["organisation"])))

    def get_order_detail(self, order_id: str) -> tuple[dict[str, str | None], ...]:
        """Return each position's resolved bounded summary (ids only, never raw nodes)."""
        with self._driver.session(database=self._database) as session:
            rows = session.execute_read(self._read_order_detail, order_id)
        if rows is None:
            raise EntityNotFoundError(EntityKind.ORDER_ITEM, order_id)
        return tuple(
            {
                "positionId": row["positionId"],
                "stockItemId": row["stockItemId"],
                "productId": row["productId"],
                "supplierOrganisationId": row["supplierOrganisationId"],
                "travellerPersonId": row["travellerPersonId"],
            }
            for row in rows
            if row["positionId"] is not None
        )

    def list_stock_items(
        self,
        *,
        search: str | None,
        service_date_from: date | None,
        service_date_to: date | None,
        availability_state: str | None,
        product_type: str | None,
        page: PageRequest,
    ) -> PageResult[ValidatedEntity]:
        with self._driver.session(database=self._database) as session:
            records = session.execute_read(
                self._read_stock_page,
                search,
                service_date_from,
                service_date_to,
                availability_state,
                product_type,
                page,
            )
        entities = [
            self._mapper.from_node(NodeRecord(LABELS[EntityKind.STOCK_ITEM], dict(record["entity"])))
            for record in records
        ]
        has_more = len(entities) > page.limit
        if has_more:
            entities = entities[: page.limit]
        return PageResult(
            items=tuple(entities),
            next_cursor=entities[-1].entity_id if has_more and entities else None,
        )

    @staticmethod
    def _write_node(tx: Transaction, node: NodeRecord) -> None:
        # The label comes from the EntityKind allow-list, never caller input.
        query = f"MERGE (entity:{node.label} {{entityId: $entityId}}) SET entity = $properties"
        tx.run(query, entityId=node.properties["entityId"], properties=node.properties)

    @staticmethod
    def _read_one(tx: Transaction, entity_kind: EntityKind, entity_id: str):
        query = f"MATCH (entity:{LABELS[entity_kind]} {{entityId: $entityId}}) RETURN entity"
        return tx.run(query, entityId=entity_id).single(strict=False)

    @staticmethod
    def _read_page(tx: Transaction, entity_kind: EntityKind, type_filter: str | None, page: PageRequest):
        query = (
            f"MATCH (entity:{LABELS[entity_kind]}) "
            "WHERE ($type IS NULL OR entity.type = $type) "
            "AND ($after IS NULL OR entity.entityId > $after) "
            "RETURN entity ORDER BY entity.entityId LIMIT $limit"
        )
        return list(tx.run(query, type=type_filter, after=page.after, limit=page.limit + 1))

    @staticmethod
    def _delete_node(tx: Transaction, entity_kind: EntityKind, entity_id: str) -> None:
        label = LABELS[entity_kind]
        exists = tx.run(
            f"MATCH (entity:{label} {{entityId: $entityId}}) RETURN entity.entityId AS id", entityId=entity_id
        ).single(strict=False)
        if exists is None:
            raise EntityNotFoundError(entity_kind, entity_id)

        # Outgoing ownership edges (this node still owns children) block deletion;
        # incoming ownership edges (this node's own parent link) do not — deleting
        # a nested item is exactly how that edge goes away. Reference edges are the
        # mirror image: only an incoming one (something else points at this node)
        # blocks deletion, never an outgoing one. See relationship_types.py.
        outgoing_rows = list(
            tx.run(
                f"MATCH (entity:{label} {{entityId: $entityId}})-[relationship]->() "
                "RETURN type(relationship) AS relationshipType, count(relationship) AS count",
                entityId=entity_id,
            )
        )
        incoming_rows = list(
            tx.run(
                f"MATCH (entity:{label} {{entityId: $entityId}})<-[relationship]-() "
                "RETURN type(relationship) AS relationshipType, count(relationship) AS count",
                entityId=entity_id,
            )
        )
        dependents = tuple(
            (RelationshipType(row["relationshipType"]), row["count"])
            for row in outgoing_rows
            if RelationshipType(row["relationshipType"]) in OWNERSHIP_RELATIONSHIP_TYPES
        ) + tuple(
            (RelationshipType(row["relationshipType"]), row["count"])
            for row in incoming_rows
            if RelationshipType(row["relationshipType"]) not in OWNERSHIP_RELATIONSHIP_TYPES
        )
        if dependents:
            raise DependentEntityExistsError(entity_id, dependents)
        # DETACH DELETE: a permitted incoming ownership edge from this node's
        # parent may still exist and must be removed along with the node.
        tx.run(f"MATCH (entity:{label} {{entityId: $entityId}}) DETACH DELETE entity", entityId=entity_id)

    @staticmethod
    def _create_relationship(
        tx: Transaction,
        from_kind: EntityKind,
        from_id: str,
        relationship: RelationshipType,
        to_kind: EntityKind,
        to_id: str,
    ) -> None:
        # Labels and the relationship type come from allow-lists, never caller input.
        query = (
            f"MATCH (source:{LABELS[from_kind]} {{entityId: $fromId}}) "
            f"MATCH (target:{LABELS[to_kind]} {{entityId: $toId}}) "
            f"MERGE (source)-[:{relationship.value}]->(target) "
            "RETURN source.entityId AS fromId, target.entityId AS toId"
        )
        record = tx.run(query, fromId=from_id, toId=to_id).single(strict=False)
        if record is None:
            raise EntityNotFoundError(from_kind, from_id)

    @staticmethod
    def _delete_relationship(
        tx: Transaction,
        from_kind: EntityKind,
        from_id: str,
        relationship: RelationshipType,
        to_kind: EntityKind,
        to_id: str,
    ) -> None:
        query = (
            f"MATCH (source:{LABELS[from_kind]} {{entityId: $fromId}})"
            f"-[edge:{relationship.value}]->"
            f"(target:{LABELS[to_kind]} {{entityId: $toId}}) DELETE edge"
        )
        tx.run(query, fromId=from_id, toId=to_id).consume()

    @staticmethod
    def _read_related(
        tx: Transaction, from_kind: EntityKind, from_id: str, relationship: RelationshipType, to_kind: EntityKind
    ):
        query = (
            f"MATCH (source:{LABELS[from_kind]} {{entityId: $fromId}})"
            f"-[:{relationship.value}]->(related:{LABELS[to_kind]}) "
            "RETURN related"
        )
        return list(tx.run(query, fromId=from_id))

    @staticmethod
    def _read_component_tree(tx: Transaction, product_id: str):
        query = (
            "MATCH (root:TouristicProductItem {entityId: $productId}) "
            "OPTIONAL MATCH (root)-[:CONTAINS*1.."
            f"{PRODUCT_COMPONENT_MAX_DEPTH}]->(descendant:TouristicProductItem) "
            "WITH root, collect(DISTINCT descendant) AS descendants "
            "UNWIND ([root] + descendants) AS node "
            "OPTIONAL MATCH (parent:TouristicProductItem)-[:CONTAINS]->(node) "
            "RETURN DISTINCT node, parent.entityId AS parentId"
        )
        return list(tx.run(query, productId=product_id))

    @staticmethod
    def _read_ancestors(tx: Transaction, product_id: str):
        query = (
            "MATCH (node:TouristicProductItem {entityId: $productId}) "
            "OPTIONAL MATCH path = (ancestor:TouristicProductItem)-[:CONTAINS*1.."
            f"{PRODUCT_COMPONENT_MAX_DEPTH}]->(node) "
            "WITH ancestor, length(path) AS depth WHERE ancestor IS NOT NULL "
            "RETURN ancestor ORDER BY depth DESC"
        )
        return list(tx.run(query, productId=product_id))

    @staticmethod
    def _read_product_parents(tx: Transaction, product_id: str):
        query = (
            "MATCH (node:TouristicProductItem {entityId: $productId}) "
            "MATCH (parent:TouristicProductItem)-[:CONTAINS]->(node) "
            "RETURN parent ORDER BY parent.entityId"
        )
        return list(tx.run(query, productId=product_id))

    @staticmethod
    def _read_organisation_for_role(tx: Transaction, role_id: str):
        query = (
            "MATCH (organisation:Organisation)-[:HAS_ROLE]->(role:OrgaRole {entityId: $roleId}) "
            "RETURN organisation ORDER BY organisation.entityId"
        )
        return list(tx.run(query, roleId=role_id))

    @staticmethod
    def _read_order_detail(tx: Transaction, order_id: str):
        header = tx.run(
            "MATCH (header:OrderItem {entityId: $orderId}) RETURN header.entityId AS id", orderId=order_id
        ).single(strict=False)
        if header is None:
            return None
        return list(tx.run(ORDER_DETAIL_TRAVERSAL, orderId=order_id))

    @staticmethod
    def _read_stock_page(
        tx: Transaction,
        search: str | None,
        service_date_from: date | None,
        service_date_to: date | None,
        availability_state: str | None,
        product_type: str | None,
        page: PageRequest,
    ):
        return list(
            tx.run(
                STOCK_FILTER_TRAVERSAL,
                search=search.lower() if search else None,
                serviceDateFrom=service_date_from,
                serviceDateTo=service_date_to,
                availabilityState=availability_state,
                productType=product_type,
                after=page.after,
                limit=page.limit + 1,
            )
        )


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

ORDER_DETAIL_TRAVERSAL = """
MATCH (header:OrderItem {entityId: $orderId})
OPTIONAL MATCH (header)-[:CONTAINS]->(position:OrderItem)
OPTIONAL MATCH (position)-[:ALLOCATES_STOCK]->(stock:StockItem)
OPTIONAL MATCH (stock)-[:REPRESENTS_PRODUCT]->(product:TouristicProductItem)
OPTIONAL MATCH (supplierProduct:TouristicProductItem)-[:CONTAINS*0..10]->(product)
OPTIONAL MATCH (supplierProduct)-[:SUPPLIED_BY]->(:OrgaRole)<-[:HAS_ROLE]-(supplier:Organisation)
OPTIONAL MATCH (position)-[:ASSIGNED_TRAVELLER]->(:PersonRole)<-[:HAS_ROLE]-(traveller:Person)
RETURN position.entityId AS positionId, stock.entityId AS stockItemId,
       product.entityId AS productId, supplier.entityId AS supplierOrganisationId,
       traveller.entityId AS travellerPersonId
""".strip()

STOCK_FILTER_TRAVERSAL = """
MATCH (stock:StockItem)-[:REPRESENTS_PRODUCT]->(product:TouristicProductItem)
OPTIONAL MATCH (ancestor:TouristicProductItem)-[:CONTAINS*0..10]->(product)
WITH stock, product, collect(DISTINCT ancestor) + [product] AS chainNodes
OPTIONAL MATCH (supplierProduct:TouristicProductItem)-[:SUPPLIED_BY]->(supplierRole:OrgaRole)<-[:HAS_ROLE]-(supplier:Organisation)
WHERE supplierProduct IN chainNodes
WITH stock, product, chainNodes, collect(DISTINCT supplierRole) AS supplierRoles, collect(DISTINCT supplier) AS suppliers,
     coalesce(stock['capacityQuantity'], 1) - coalesce(stock['heldQuantity'], 0) - coalesce(stock['allocatedQuantity'], 0) AS available,
     CASE
       WHEN coalesce(stock['inventoryStatusCode'], 'inventory/active') <> 'inventory/active'
         THEN replace(stock['inventoryStatusCode'], 'inventory/', '')
       WHEN coalesce(stock['capacityQuantity'], 1) = 0 OR coalesce(stock['capacityQuantity'], 1) - coalesce(stock['heldQuantity'], 0) - coalesce(stock['allocatedQuantity'], 0) < 0
         THEN 'shortfall'
       WHEN coalesce(stock['heldQuantity'], 0) > 0 THEN 'held'
       WHEN coalesce(stock['capacityQuantity'], 1) - coalesce(stock['heldQuantity'], 0) - coalesce(stock['allocatedQuantity'], 0) = 0 AND coalesce(stock['allocatedQuantity'], 0) > 0
         THEN 'allocated'
       ELSE 'available'
     END AS state
WHERE ($after IS NULL OR stock.entityId > $after)
  AND ($serviceDateFrom IS NULL OR stock.serviceDate >= $serviceDateFrom)
  AND ($serviceDateTo IS NULL OR stock.serviceDate <= $serviceDateTo)
  AND ($availabilityState IS NULL OR state = $availabilityState)
  AND ($productType IS NULL OR product.type = $productType)
  AND ($search IS NULL
       OR any(node IN chainNodes + supplierRoles + suppliers
              WHERE any(key IN keys(node) WHERE toLower(toString(node[key])) CONTAINS $search)))
RETURN DISTINCT stock AS entity ORDER BY stock.entityId LIMIT $limit
""".strip()
