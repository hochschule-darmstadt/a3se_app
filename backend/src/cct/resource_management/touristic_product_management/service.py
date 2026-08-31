"""Touristic Product Management public application operations.

The only entry point other layers use to read or write TouristicProductItem
entities. `repository` must already be scoped to this module's EntityKinds (a
ScopedEntityRepository built once by the composition script).

`set_supplier` additionally needs Partner Management's repository to validate
the referenced OrgaRole, via Partner Management's own public `service.py`
function -- the "provided interface" project-structure.md leaves open, wired
here as a plain cross-module call rather than a bespoke Protocol per
relationship.
"""

from __future__ import annotations

from cct.resource_management.contracts import EntityKind, ValidatedEntity
from cct.resource_management.errors import DuplicateEntityError, EntityNotFoundError, InvalidEntityGraphError
from cct.resource_management.pagination import PageRequest, PageResult
from cct.resource_management.partner_management import service as partner_service
from cct.resource_management.relationship_types import RelationshipType
from cct.resource_management.repository_ports import EntityRepositoryPort

STRUCTURAL_CHILD_PARENT_TYPE: dict[str, str] = {}


def create_product(
    repository: EntityRepositoryPort,
    *,
    entity_id: str,
    type: str,
    properties: dict[str, object],
    parent_product_id: str | None = None,
) -> ValidatedEntity:
    parent = None
    if parent_product_id is not None:
        parent = repository.get(EntityKind.TOURISTIC_PRODUCT_ITEM, parent_product_id)
        if parent is None:
            raise EntityNotFoundError(EntityKind.TOURISTIC_PRODUCT_ITEM, parent_product_id)

    required_parent_type = STRUCTURAL_CHILD_PARENT_TYPE.get(type)
    if required_parent_type is not None:
        if parent_product_id is None:
            raise ValueError(f"{type} requires parentProductId, referencing an existing {required_parent_type}")
        if parent is not None and parent.type != required_parent_type:
            raise ValueError(
                f"parentProductId must reference a {required_parent_type} for type {type}, got {parent.type}"
            )

    if repository.get(EntityKind.TOURISTIC_PRODUCT_ITEM, entity_id) is not None:
        raise DuplicateEntityError(EntityKind.TOURISTIC_PRODUCT_ITEM, entity_id)
    product = repository.save(
        {"entityId": entity_id, "entityKind": "TouristicProductItem", "type": type, "properties": properties}
    )
    if parent_product_id is not None:
        repository.create_relationship(
            from_kind=EntityKind.TOURISTIC_PRODUCT_ITEM,
            from_id=parent_product_id,
            relationship=RelationshipType.CONTAINS,
            to_kind=EntityKind.TOURISTIC_PRODUCT_ITEM,
            to_id=entity_id,
        )
    return product


def get_product(repository: EntityRepositoryPort, entity_id: str) -> ValidatedEntity:
    entity = repository.get(EntityKind.TOURISTIC_PRODUCT_ITEM, entity_id)
    if entity is None:
        raise EntityNotFoundError(EntityKind.TOURISTIC_PRODUCT_ITEM, entity_id)
    return entity


def list_products(
    repository: EntityRepositoryPort, *, type_filter: str | None = None, page: PageRequest = PageRequest()
) -> PageResult[ValidatedEntity]:
    return repository.list(EntityKind.TOURISTIC_PRODUCT_ITEM, type_filter=type_filter, page=page)


def update_product(
    repository: EntityRepositoryPort, entity_id: str, *, type: str, properties: dict[str, object]
) -> ValidatedEntity:
    if repository.get(EntityKind.TOURISTIC_PRODUCT_ITEM, entity_id) is None:
        raise EntityNotFoundError(EntityKind.TOURISTIC_PRODUCT_ITEM, entity_id)
    return repository.save(
        {"entityId": entity_id, "entityKind": "TouristicProductItem", "type": type, "properties": properties}
    )


def delete_product(repository: EntityRepositoryPort, entity_id: str) -> None:
    repository.delete(EntityKind.TOURISTIC_PRODUCT_ITEM, entity_id)


def set_supplier(
    repository: EntityRepositoryPort,
    product_id: str,
    *,
    supplier_role_id: str,
    partner_repository: EntityRepositoryPort,
) -> None:
    if repository.get(EntityKind.TOURISTIC_PRODUCT_ITEM, product_id) is None:
        raise EntityNotFoundError(EntityKind.TOURISTIC_PRODUCT_ITEM, product_id)
    partner_service.get_orga_role(partner_repository, supplier_role_id)  # raises EntityNotFoundError if missing
    repository.create_relationship(
        from_kind=EntityKind.TOURISTIC_PRODUCT_ITEM,
        from_id=product_id,
        relationship=RelationshipType.SUPPLIED_BY,
        to_kind=EntityKind.ORGA_ROLE,
        to_id=supplier_role_id,
    )


def get_component_tree(repository: EntityRepositoryPort, product_id: str) -> tuple[tuple[ValidatedEntity, str | None], ...]:
    return repository.get_component_tree(product_id)


def get_ancestors(repository: EntityRepositoryPort, product_id: str) -> tuple[ValidatedEntity, ...]:
    """Root-first CONTAINS parent chain, excluding `product_id` itself; empty if it is already a root."""
    return repository.get_ancestors(product_id)


def get_supplier(repository: EntityRepositoryPort, product_id: str) -> ValidatedEntity | None:
    if repository.get(EntityKind.TOURISTIC_PRODUCT_ITEM, product_id) is None:
        raise EntityNotFoundError(EntityKind.TOURISTIC_PRODUCT_ITEM, product_id)
    roles = repository.list_related(
        from_kind=EntityKind.TOURISTIC_PRODUCT_ITEM,
        from_id=product_id,
        relationship=RelationshipType.SUPPLIED_BY,
        to_kind=EntityKind.ORGA_ROLE,
    )
    if len(roles) > 1:
        raise InvalidEntityGraphError(product_id, "product has multiple suppliers")
    return roles[0] if roles else None
