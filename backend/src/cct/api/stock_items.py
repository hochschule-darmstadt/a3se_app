"""Inventory resource endpoints and the VIEW-S-007 read projection."""

from __future__ import annotations

from datetime import date
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict, Field

from cct.resource_management.contracts import EntityKind, ValidatedEntity
from cct.resource_management.errors import InvalidEntityGraphError
from cct.resource_management.inventory import service
from cct.resource_management.inventory.models import StockProperties
from cct.resource_management.pagination import PageRequest, decode_cursor, encode_cursor
from cct.resource_management.partner_management import service as partner_service
from cct.resource_management.relationship_types import RelationshipType
from cct.resource_management.repository_ports import EntityRepositoryPort
from cct.resource_management.touristic_product_management import service as product_service

from . import display_names
from .dependencies import Actor, get_current_actor, get_partner_repository, get_product_repository, get_stock_repository
from .schemas import ErrorResponse, Page, PageParams, transport_properties_model

router = APIRouter(prefix="/stock-items", tags=["stock-items"])
STOCK_ITEM_TYPES = (
    "stock/airline/flight/seat", "stock/accommodation/room-type/room", "stock/mobility/transfer", "stock/mobility/rail",
    "stock/mobility/coach", "stock/mobility/vehicle-rental", "stock/water-transport/day-boat", "stock/water-transport/cruise",
    "stock/experience/guided-tour", "stock/experience/activity", "stock/protection/travel",
)
StockPropertiesTransport = transport_properties_model(StockProperties)


class StockItemCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    entity_id: str = Field(alias="entityId", min_length=1, max_length=100)
    product_id: str = Field(alias="productId", min_length=1, max_length=100)
    type: Literal[STOCK_ITEM_TYPES]
    properties: StockPropertiesTransport


class StockItemUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    type: Literal[STOCK_ITEM_TYPES]
    properties: StockPropertiesTransport


class StockItemResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)
    entity_id: str = Field(alias="entityId")
    entity_kind: Literal["StockItem"] = Field(alias="entityKind", default="StockItem")
    type: str
    schema_version: int = Field(alias="schemaVersion")
    properties: StockProperties
    product_id: str = Field(alias="productId")
    product_type: str = Field(alias="productType")
    product_display_name: str = Field(alias="productDisplayName")
    product_display_name_chain: list[str] = Field(alias="productDisplayNameChain")
    product_ancestors: list["StockHierarchyLink"] = Field(alias="productAncestors")
    supplier_role: "StockHierarchyLink | None" = Field(alias="supplierRole")
    supplier_organisation_id: str | None = Field(alias="supplierOrganisationId")
    supplier_display_name: str | None = Field(alias="supplierDisplayName")
    available_quantity: int = Field(alias="availableQuantity")
    availability_state: Literal["available", "held", "allocated", "shortfall", "withdrawn", "expired"] = Field(alias="availabilityState")

    @classmethod
    def from_domain(cls, entity: ValidatedEntity, stock_repository: EntityRepositoryPort, product_repository: EntityRepositoryPort, partner_repository: EntityRepositoryPort) -> "StockItemResponse":
        products = stock_repository.list_related(from_kind=EntityKind.STOCK_ITEM, from_id=entity.entity_id, relationship=RelationshipType.REPRESENTS_PRODUCT, to_kind=EntityKind.TOURISTIC_PRODUCT_ITEM)
        if len(products) != 1:
            raise InvalidEntityGraphError(entity.entity_id, "stock item must represent exactly one product")
        product = products[0]
        product_projection = display_names.product(product, product_repository, partner_repository)
        ancestors = product_service.get_ancestors(product_repository, product.entity_id)
        supplier_role = next(
            (role for candidate in (product, *reversed(ancestors)) if (role := product_service.get_supplier(product_repository, candidate.entity_id)) is not None),
            None,
        )
        supplier = partner_service.get_organisation_for_role(partner_repository, supplier_role.entity_id) if supplier_role else None
        properties = entity.properties
        available = properties.capacity_quantity - properties.held_quantity - properties.allocated_quantity
        lifecycle = properties.inventory_status_code.removeprefix("inventory/")
        if lifecycle != "active": state = lifecycle
        elif available < 0 or properties.capacity_quantity == 0: state = "shortfall"
        elif properties.held_quantity > 0: state = "held"
        elif available == 0 and properties.allocated_quantity > 0: state = "allocated"
        else: state = "available"
        return cls(entityId=entity.entity_id, type=entity.type, schemaVersion=entity.schema_version, properties=properties,
                   productId=product.entity_id, productType=product.type, productDisplayName=product_projection.display_name,
                   productDisplayNameChain=list(product_projection.display_name_chain),
                   productAncestors=[StockHierarchyLink(entityId=ancestor.entity_id, displayNameChain=list(display_names.product(ancestor, product_repository, partner_repository).display_name_chain)) for ancestor in ancestors],
                   supplierRole=StockHierarchyLink(entityId=supplier_role.entity_id, displayNameChain=list(display_names.orga_role(supplier_role, supplier).display_name_chain)) if supplier_role and supplier else None,
                   supplierOrganisationId=supplier.entity_id if supplier else None,
                   supplierDisplayName=display_names.organisation(supplier).display_name if supplier else None,
                   availableQuantity=available, availabilityState=state)


class StockHierarchyLink(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)
    entity_id: str = Field(alias="entityId")
    display_name_chain: list[str] = Field(alias="displayNameChain")


RepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_stock_repository)]
ProductRepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_product_repository)]
PartnerRepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_partner_repository)]
ActorDependency = Annotated[Actor, Depends(get_current_actor)]


class StockPageParams(PageParams):
    model_config = ConfigDict(populate_by_name=True)
    search: str | None = Field(default=None, max_length=200)
    service_date_from: date | None = Field(default=None, alias="serviceDateFrom")
    service_date_to: date | None = Field(default=None, alias="serviceDateTo")
    availability_state: Literal["available", "held", "allocated", "shortfall", "withdrawn", "expired"] | None = Field(default=None, alias="availabilityState")
    product_type: str | None = Field(default=None, alias="productType", max_length=100)


def _response(entity, repository, product_repository, partner_repository) -> StockItemResponse:
    return StockItemResponse.from_domain(entity, repository, product_repository, partner_repository)


@router.post("", response_model=StockItemResponse, status_code=status.HTTP_201_CREATED, operation_id="createStockItem", responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}})
def create_stock_item(request: StockItemCreateRequest, repository: RepositoryDependency, product_repository: ProductRepositoryDependency, partner_repository: PartnerRepositoryDependency, actor: ActorDependency) -> StockItemResponse:
    entity = service.create_stock_item(repository, entity_id=request.entity_id, type=request.type, properties=request.properties.model_dump(by_alias=True), product_id=request.product_id, product_repository=product_repository)
    return _response(entity, repository, product_repository, partner_repository)


@router.get("/{stock_item_id}", response_model=StockItemResponse, operation_id="getStockItem", responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}})
def get_stock_item(stock_item_id: str, repository: RepositoryDependency, product_repository: ProductRepositoryDependency, partner_repository: PartnerRepositoryDependency) -> StockItemResponse:
    return _response(service.get_stock_item(repository, stock_item_id), repository, product_repository, partner_repository)


@router.get("", response_model=Page[StockItemResponse], operation_id="listStockItems", responses={422: {"model": ErrorResponse}})
def list_stock_items(repository: RepositoryDependency, product_repository: ProductRepositoryDependency, partner_repository: PartnerRepositoryDependency, params: Annotated[StockPageParams, Query()]) -> Page[StockItemResponse]:
    after = decode_cursor(params.cursor) if params.cursor else None
    if params.service_date_from and params.service_date_to and params.service_date_from > params.service_date_to:
        raise ValueError("serviceDateFrom must not be after serviceDateTo")
    result = service.list_stock_items(
        repository,
        search=params.search.strip() if params.search and params.search.strip() else None,
        service_date_from=params.service_date_from,
        service_date_to=params.service_date_to,
        availability_state=params.availability_state,
        product_type=params.product_type,
        page=PageRequest(limit=params.limit, after=after),
    )
    next_cursor = encode_cursor(result.next_cursor) if result.next_cursor else None
    return Page[StockItemResponse](items=[_response(entity, repository, product_repository, partner_repository) for entity in result.items], next_cursor=next_cursor)


@router.put("/{stock_item_id}", response_model=StockItemResponse, operation_id="updateStockItem", responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}})
def update_stock_item(stock_item_id: str, request: StockItemUpdateRequest, repository: RepositoryDependency, product_repository: ProductRepositoryDependency, partner_repository: PartnerRepositoryDependency, actor: ActorDependency) -> StockItemResponse:
    entity = service.update_stock_item(repository, stock_item_id, type=request.type, properties=request.properties.model_dump(by_alias=True))
    return _response(entity, repository, product_repository, partner_repository)


@router.delete("/{stock_item_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="withdrawStockItem", responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}})
def withdraw_stock_item(stock_item_id: str, repository: RepositoryDependency, actor: ActorDependency) -> None:
    entity = service.get_stock_item(repository, stock_item_id)
    properties = entity.properties.model_dump(by_alias=True)
    properties["inventoryStatusCode"] = "inventory/withdrawn"
    service.update_stock_item(repository, stock_item_id, type=entity.type or "", properties=properties)
