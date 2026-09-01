"""Order Management public application operations.

The only entry point other layers use to read or write OrderItem entities
(both `order/header` and `order/position`). `repository` must already be
scoped to this module's EntityKinds (a ScopedEntityRepository built once by
the composition script).

Allocating stock, assigning a customer, or assigning a traveller each
validate the cross-module reference via the owning module's own `service.py`
function -- Inventory's `get_stock_item` or Person Management's
`get_person_role` -- a plain cross-module call, not a bespoke Protocol.
"""

from __future__ import annotations

from cct.resource_management.contracts import EntityKind, ValidatedEntity
from cct.resource_management.errors import DuplicateEntityError, EntityNotFoundError
from cct.resource_management.inventory import service as inventory_service
from datetime import date
from cct.resource_management.pagination import PageRequest, PageResult
from cct.resource_management.person_management import service as person_service
from cct.resource_management.relationship_types import RelationshipType
from cct.resource_management.repository_ports import EntityRepositoryPort

ORDER_HEADER_TYPE = "order/header"
ORDER_POSITION_TYPE = "order/position"


def create_order(repository: EntityRepositoryPort, *, entity_id: str | None, properties: dict[str, object]) -> ValidatedEntity:
    if entity_id is None:
        return repository.create_generated(entity_kind=EntityKind.ORDER_ITEM, type=ORDER_HEADER_TYPE, properties=properties)
    if repository.get(EntityKind.ORDER_ITEM, entity_id) is not None:
        raise DuplicateEntityError(EntityKind.ORDER_ITEM, entity_id)
    return repository.save(
        {"entityId": entity_id, "entityKind": "OrderItem", "type": ORDER_HEADER_TYPE, "properties": properties}
    )


def get_order(repository: EntityRepositoryPort, entity_id: str) -> ValidatedEntity:
    entity = repository.get(EntityKind.ORDER_ITEM, entity_id)
    if entity is None or entity.type != ORDER_HEADER_TYPE:
        raise EntityNotFoundError(EntityKind.ORDER_ITEM, entity_id)
    return entity


def list_orders(
    repository: EntityRepositoryPort, *, page: PageRequest = PageRequest()
) -> PageResult[ValidatedEntity]:
    return repository.list(EntityKind.ORDER_ITEM, type_filter=ORDER_HEADER_TYPE, page=page)


def list_order_summaries(repository: EntityRepositoryPort, *, search: str | None = None,
    status: str | None = None, product_type: str | None = None,
    service_date_from: date | None = None, service_date_to: date | None = None,
    unresolved_only: bool = False, page: PageRequest = PageRequest(), customer_role_id: str | None = None, stock_item_id: str | None = None, traveller_role_id: str | None = None):
    kwargs = dict(search=search, status=status, product_type=product_type,
        service_date_from=service_date_from, service_date_to=service_date_to,
        unresolved_only=unresolved_only, page=page)
    if customer_role_id is not None: kwargs["customer_role_id"] = customer_role_id
    if stock_item_id is not None: kwargs["stock_item_id"] = stock_item_id
    if traveller_role_id is not None: kwargs["traveller_role_id"] = traveller_role_id
    return repository.list_orders(**kwargs)


def update_order(
    repository: EntityRepositoryPort, entity_id: str, *, properties: dict[str, object]
) -> ValidatedEntity:
    get_order(repository, entity_id)
    return repository.save(
        {"entityId": entity_id, "entityKind": "OrderItem", "type": ORDER_HEADER_TYPE, "properties": properties}
    )


def delete_order(repository: EntityRepositoryPort, entity_id: str) -> None:
    repository.delete(EntityKind.ORDER_ITEM, entity_id)


def create_order_position(
    repository: EntityRepositoryPort, *, entity_id: str | None, order_id: str
) -> ValidatedEntity:
    get_order(repository, order_id)
    if entity_id is not None and repository.get(EntityKind.ORDER_ITEM, entity_id) is not None:
        raise DuplicateEntityError(EntityKind.ORDER_ITEM, entity_id)
    position = repository.create_generated(entity_kind=EntityKind.ORDER_ITEM, type=ORDER_POSITION_TYPE, properties={}, parent_id=order_id) if entity_id is None else repository.save(
        {"entityId": entity_id, "entityKind": "OrderItem", "type": ORDER_POSITION_TYPE, "properties": {}}
    )
    repository.create_relationship(
        from_kind=EntityKind.ORDER_ITEM,
        from_id=order_id,
        relationship=RelationshipType.CONTAINS,
        to_kind=EntityKind.ORDER_ITEM,
        to_id=position.entity_id,
    )
    return position


def get_order_position(repository: EntityRepositoryPort, entity_id: str) -> ValidatedEntity:
    entity = repository.get(EntityKind.ORDER_ITEM, entity_id)
    if entity is None or entity.type != ORDER_POSITION_TYPE:
        raise EntityNotFoundError(EntityKind.ORDER_ITEM, entity_id)
    return entity


def list_order_positions(repository: EntityRepositoryPort, order_id: str) -> tuple[ValidatedEntity, ...]:
    get_order(repository, order_id)
    return repository.list_related(
        from_kind=EntityKind.ORDER_ITEM,
        from_id=order_id,
        relationship=RelationshipType.CONTAINS,
        to_kind=EntityKind.ORDER_ITEM,
    )


def delete_order_position(repository: EntityRepositoryPort, entity_id: str) -> None:
    repository.delete(EntityKind.ORDER_ITEM, entity_id)


def allocate_stock(
    repository: EntityRepositoryPort,
    position_id: str,
    *,
    stock_item_id: str,
    stock_repository: EntityRepositoryPort,
) -> None:
    get_order_position(repository, position_id)
    stock_item = inventory_service.get_stock_item(stock_repository, stock_item_id)
    existing = repository.list_related(
        from_kind=EntityKind.ORDER_ITEM,
        from_id=position_id,
        relationship=RelationshipType.ALLOCATES_STOCK,
        to_kind=EntityKind.STOCK_ITEM,
    )
    if any(item.entity_id == stock_item_id for item in existing):
        return
    if existing:
        raise ValueError(f"order position {position_id} already has allocated stock")
    properties = stock_item.properties.model_dump(by_alias=True)
    traveller_count = len(repository.list_related(from_kind=EntityKind.ORDER_ITEM, from_id=position_id, relationship=RelationshipType.ASSIGNED_TRAVELLER, to_kind=EntityKind.PERSON_ROLE))
    if properties["inventoryStatusCode"] != "inventory/active" or properties["remainingCapacity"] < traveller_count:
        raise ValueError(f"stock item {stock_item_id} has no active available capacity")
    repository.create_relationship(
        from_kind=EntityKind.ORDER_ITEM,
        from_id=position_id,
        relationship=RelationshipType.ALLOCATES_STOCK,
        to_kind=EntityKind.STOCK_ITEM,
        to_id=stock_item_id,
    )
    properties["remainingCapacity"] -= traveller_count
    inventory_service.update_stock_item(
        stock_repository, stock_item_id, type=stock_item.type or "", properties=properties
    )


def release_stock(
    repository: EntityRepositoryPort,
    position_id: str,
    *,
    stock_item_id: str,
    stock_repository: EntityRepositoryPort,
) -> None:
    get_order_position(repository, position_id)
    stock_item = inventory_service.get_stock_item(stock_repository, stock_item_id)
    existing = repository.list_related(
        from_kind=EntityKind.ORDER_ITEM,
        from_id=position_id,
        relationship=RelationshipType.ALLOCATES_STOCK,
        to_kind=EntityKind.STOCK_ITEM,
    )
    if not any(item.entity_id == stock_item_id for item in existing):
        return
    repository.delete_relationship(
        from_kind=EntityKind.ORDER_ITEM,
        from_id=position_id,
        relationship=RelationshipType.ALLOCATES_STOCK,
        to_kind=EntityKind.STOCK_ITEM,
        to_id=stock_item_id,
    )
    properties = stock_item.properties.model_dump(by_alias=True)
    allocated_travellers = len(repository.list_related(from_kind=EntityKind.ORDER_ITEM, from_id=position_id, relationship=RelationshipType.ASSIGNED_TRAVELLER, to_kind=EntityKind.PERSON_ROLE))
    properties["remainingCapacity"] += allocated_travellers
    inventory_service.update_stock_item(
        stock_repository, stock_item_id, type=stock_item.type or "", properties=properties
    )


def assign_traveller(
    repository: EntityRepositoryPort,
    position_id: str,
    *,
    traveller_role_id: str,
    person_repository: EntityRepositoryPort,
) -> None:
    get_order_position(repository, position_id)
    role = person_service.get_person_role(person_repository, traveller_role_id)
    if role.type != "person/traveller":
        raise ValueError(f"person role {traveller_role_id} is not a traveller role")
    repository.create_relationship(
        from_kind=EntityKind.ORDER_ITEM,
        from_id=position_id,
        relationship=RelationshipType.ASSIGNED_TRAVELLER,
        to_kind=EntityKind.PERSON_ROLE,
        to_id=traveller_role_id,
    )


def assign_customer(
    repository: EntityRepositoryPort,
    order_id: str,
    *,
    customer_role_id: str,
    person_repository: EntityRepositoryPort,
) -> None:
    get_order(repository, order_id)
    role = person_service.get_person_role(person_repository, customer_role_id)
    if role.type != "person/customer":
        raise ValueError(f"person role {customer_role_id} is not a customer role")
    repository.create_relationship(
        from_kind=EntityKind.ORDER_ITEM,
        from_id=order_id,
        relationship=RelationshipType.CUSTOMER,
        to_kind=EntityKind.PERSON_ROLE,
        to_id=customer_role_id,
    )


def get_order_detail(repository: EntityRepositoryPort, order_id: str) -> dict[str, object]:
    return repository.get_order_detail(order_id)
