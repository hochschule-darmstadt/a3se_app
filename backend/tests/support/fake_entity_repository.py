"""In-memory EntityRepositoryPort double shared by service and API tests.

Validates through the real registry (so tests exercise genuine contract
behavior) and mirrors Neo4jEntityRepository's direction-sensitive delete
protection (see relationship_types.OWNERSHIP_RELATIONSHIP_TYPES) rather than
re-implementing a simplified, possibly-diverging rule.
"""

from __future__ import annotations

from cct.resource_management.contracts import EntityKind
from cct.resource_management.default_registry import create_entity_registry
from cct.resource_management.errors import DependentEntityExistsError, EntityNotFoundError
from cct.resource_management.pagination import PageRequest, PageResult
from cct.resource_management.relationship_types import OWNERSHIP_RELATIONSHIP_TYPES, RelationshipType


class FakeEntityRepository:
    def __init__(self) -> None:
        self._registry = create_entity_registry()
        self._entities: dict[tuple[EntityKind, str], object] = {}
        self.relationship_calls: list[tuple] = []

    def get(self, entity_kind, entity_id):
        return self._entities.get((entity_kind, entity_id))

    def list(self, entity_kind, *, type_filter=None, page=PageRequest()):
        items = [
            entity
            for (kind, _), entity in self._entities.items()
            if kind == entity_kind and (type_filter is None or entity.type == type_filter)
        ]
        items.sort(key=lambda entity: entity.entity_id)
        if page.after is not None:
            items = [entity for entity in items if entity.entity_id > page.after]
        page_items = items[: page.limit]
        next_cursor = page_items[-1].entity_id if len(items) > page.limit else None
        return PageResult(items=tuple(page_items), next_cursor=next_cursor)

    def save(self, candidate):
        entity = self._registry.validate(candidate)
        self._entities[(entity.entity_kind, entity.entity_id)] = entity
        return entity

    def delete(self, entity_kind, entity_id):
        key = (entity_kind, entity_id)
        if key not in self._entities:
            raise EntityNotFoundError(entity_kind, entity_id)
        dependents = [
            (relationship, 1)
            for (from_kind, from_id, relationship, to_kind, to_id) in self.relationship_calls
            if (from_kind, from_id) == key and relationship in OWNERSHIP_RELATIONSHIP_TYPES
        ] + [
            (relationship, 1)
            for (from_kind, from_id, relationship, to_kind, to_id) in self.relationship_calls
            if (to_kind, to_id) == key and relationship not in OWNERSHIP_RELATIONSHIP_TYPES
        ]
        if dependents:
            raise DependentEntityExistsError(entity_id, tuple(dependents))
        del self._entities[key]
        self.relationship_calls = [
            call for call in self.relationship_calls if (call[0], call[1]) != key and (call[3], call[4]) != key
        ]

    def create_relationship(self, *, from_kind, from_id, relationship, to_kind, to_id):
        if (from_kind, from_id) not in self._entities:
            raise EntityNotFoundError(from_kind, from_id)
        if (to_kind, to_id) not in self._entities:
            raise EntityNotFoundError(to_kind, to_id)
        self.relationship_calls.append((from_kind, from_id, relationship, to_kind, to_id))

    def list_related(self, *, from_kind, from_id, relationship, to_kind):
        return tuple(
            self._entities[(to_kind, to_id)]
            for (fk, fi, rel, tk, to_id) in self.relationship_calls
            if fk == from_kind and fi == from_id and rel == relationship and tk == to_kind
        )

    def get_component_tree(self, product_id):
        root = self._entities.get((EntityKind.TOURISTIC_PRODUCT_ITEM, product_id))
        if root is None:
            raise EntityNotFoundError(EntityKind.TOURISTIC_PRODUCT_ITEM, product_id)
        parent_by_child = {
            to_id: from_id
            for (from_kind, from_id, relationship, to_kind, to_id) in self.relationship_calls
            if from_kind == EntityKind.TOURISTIC_PRODUCT_ITEM
            and to_kind == EntityKind.TOURISTIC_PRODUCT_ITEM
            and relationship == RelationshipType.CONTAINS
        }
        descendants: list[str] = []
        frontier = [product_id]
        while frontier:
            current = frontier.pop()
            children = [child for child, parent in parent_by_child.items() if parent == current]
            descendants.extend(children)
            frontier.extend(children)
        tree = [(root, None)]
        for child_id in descendants:
            tree.append((self._entities[(EntityKind.TOURISTIC_PRODUCT_ITEM, child_id)], parent_by_child[child_id]))
        return tuple(tree)

    def get_order_detail(self, order_id):
        if (EntityKind.ORDER_ITEM, order_id) not in self._entities:
            raise EntityNotFoundError(EntityKind.ORDER_ITEM, order_id)
        position_ids = [
            to_id
            for (from_kind, from_id, relationship, to_kind, to_id) in self.relationship_calls
            if from_kind == EntityKind.ORDER_ITEM
            and from_id == order_id
            and to_kind == EntityKind.ORDER_ITEM
            and relationship == RelationshipType.CONTAINS
        ]

        def related_id(position_id: str, relationship: "RelationshipType", to_kind) -> str | None:
            for (from_kind, from_id, rel, tk, to_id) in self.relationship_calls:
                if from_kind == EntityKind.ORDER_ITEM and from_id == position_id and rel == relationship and tk == to_kind:
                    return to_id
            return None

        details = []
        for position_id in position_ids:
            stock_id = related_id(position_id, RelationshipType.ALLOCATES_STOCK, EntityKind.STOCK_ITEM)
            product_id = None
            supplier_id = None
            if stock_id is not None:
                product_id = next(
                    (
                        to_id
                        for (fk, fi, rel, tk, to_id) in self.relationship_calls
                        if fk == EntityKind.STOCK_ITEM
                        and fi == stock_id
                        and rel == RelationshipType.REPRESENTS_PRODUCT
                        and tk == EntityKind.TOURISTIC_PRODUCT_ITEM
                    ),
                    None,
                )
                if product_id is not None:
                    supplier_role_id = next(
                        (
                            to_id
                            for (fk, fi, rel, tk, to_id) in self.relationship_calls
                            if fk == EntityKind.TOURISTIC_PRODUCT_ITEM
                            and fi == product_id
                            and rel == RelationshipType.SUPPLIED_BY
                            and tk == EntityKind.ORGA_ROLE
                        ),
                        None,
                    )
                    if supplier_role_id is not None:
                        supplier_id = next(
                            (
                                fi
                                for (fk, fi, rel, tk, to_id) in self.relationship_calls
                                if fk == EntityKind.ORGANISATION
                                and rel == RelationshipType.HAS_ROLE
                                and tk == EntityKind.ORGA_ROLE
                                and to_id == supplier_role_id
                            ),
                            None,
                        )
            traveller_role_id = related_id(position_id, RelationshipType.ASSIGNED_TRAVELLER, EntityKind.PERSON_ROLE)
            traveller_id = None
            if traveller_role_id is not None:
                traveller_id = next(
                    (
                        fi
                        for (fk, fi, rel, tk, to_id) in self.relationship_calls
                        if fk == EntityKind.PERSON
                        and rel == RelationshipType.HAS_ROLE
                        and tk == EntityKind.PERSON_ROLE
                        and to_id == traveller_role_id
                    ),
                    None,
                )
            details.append(
                {
                    "positionId": position_id,
                    "stockItemId": stock_id,
                    "productId": product_id,
                    "supplierOrganisationId": supplier_id,
                    "travellerPersonId": traveller_id,
                }
            )
        return tuple(details)
