"""Inventory public application operations.

The only entry point other layers use to read or write StockItem entities.
`repository` must already be scoped to this module's EntityKinds (a
ScopedEntityRepository built once by the composition script).

`create_stock_item` additionally needs Touristic Product Management's
repository to validate the represented product, via that module's own
`service.get_product` -- a plain cross-module call, not a bespoke Protocol.
"""

from __future__ import annotations

from cct.resource_management.contracts import EntityKind, ValidatedEntity
from cct.resource_management.errors import DuplicateEntityError, EntityNotFoundError
from cct.resource_management.pagination import PageRequest, PageResult
from cct.resource_management.relationship_types import RelationshipType
from cct.resource_management.repository_ports import EntityRepositoryPort
from cct.resource_management.touristic_product_management import service as product_service


def create_stock_item(
    repository: EntityRepositoryPort,
    *,
    entity_id: str,
    type: str,
    properties: dict[str, object],
    product_id: str,
    product_repository: EntityRepositoryPort,
) -> ValidatedEntity:
    product_service.get_product(product_repository, product_id)  # raises EntityNotFoundError if missing
    if repository.get(EntityKind.STOCK_ITEM, entity_id) is not None:
        raise DuplicateEntityError(EntityKind.STOCK_ITEM, entity_id)
    stock_item = repository.save(
        {"entityId": entity_id, "entityKind": "StockItem", "type": type, "properties": properties}
    )
    repository.create_relationship(
        from_kind=EntityKind.STOCK_ITEM,
        from_id=entity_id,
        relationship=RelationshipType.REPRESENTS_PRODUCT,
        to_kind=EntityKind.TOURISTIC_PRODUCT_ITEM,
        to_id=product_id,
    )
    return stock_item


def get_stock_item(repository: EntityRepositoryPort, entity_id: str) -> ValidatedEntity:
    entity = repository.get(EntityKind.STOCK_ITEM, entity_id)
    if entity is None:
        raise EntityNotFoundError(EntityKind.STOCK_ITEM, entity_id)
    return entity


def list_stock_items(
    repository: EntityRepositoryPort, *, type_filter: str | None = None, page: PageRequest = PageRequest()
) -> PageResult[ValidatedEntity]:
    return repository.list(EntityKind.STOCK_ITEM, type_filter=type_filter, page=page)


def update_stock_item(
    repository: EntityRepositoryPort, entity_id: str, *, type: str, properties: dict[str, object]
) -> ValidatedEntity:
    if repository.get(EntityKind.STOCK_ITEM, entity_id) is None:
        raise EntityNotFoundError(EntityKind.STOCK_ITEM, entity_id)
    return repository.save(
        {"entityId": entity_id, "entityKind": "StockItem", "type": type, "properties": properties}
    )


def delete_stock_item(repository: EntityRepositoryPort, entity_id: str) -> None:
    repository.delete(EntityKind.STOCK_ITEM, entity_id)
