"""StockItem resource endpoints.

Independently root-addressable at /stock-items/{stockItemId}; every stock
item must represent a product (REPRESENTS_PRODUCT), validated via Touristic
Product Management's own service before the edge is written.
"""

from __future__ import annotations

from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict, Field

from cct.resource_management.contracts import ValidatedEntity
from cct.resource_management.inventory import service
from cct.resource_management.inventory.models import StockProperties
from cct.resource_management.pagination import PageRequest, decode_cursor, encode_cursor
from cct.resource_management.repository_ports import EntityRepositoryPort

from .dependencies import Actor, get_current_actor, get_product_repository, get_stock_repository
from .schemas import ErrorResponse, Page, PageParams, transport_properties_model

router = APIRouter(prefix="/stock-items", tags=["stock-items"])

STOCK_ITEM_TYPES = (
    "stock/flight/seat",
    "stock/hotel/room",
    "stock/accommodation/room-category",
    "stock/mobility/transfer",
    "stock/mobility/rail",
    "stock/mobility/coach",
    "stock/mobility/vehicle-rental",
    "stock/water/day-boat",
    "stock/water/cruise",
    "stock/experience/guided-tour",
    "stock/experience/activity",
    "stock/protection/travel",
)

# StockProperties has date/Decimal fields; strict=True domain contracts
# (DR-0012) can never accept the ISO-8601/decimal-as-string JSON wire
# representation, so requests use a lenient transport sibling (see schemas.py).
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

    @classmethod
    def from_domain(cls, entity: ValidatedEntity) -> "StockItemResponse":
        return cls(
            entityId=entity.entity_id, type=entity.type, schemaVersion=entity.schema_version, properties=entity.properties
        )


RepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_stock_repository)]
ProductRepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_product_repository)]
ActorDependency = Annotated[Actor, Depends(get_current_actor)]


@router.post(
    "",
    response_model=StockItemResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="createStockItem",
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def create_stock_item(
    request: StockItemCreateRequest,
    repository: RepositoryDependency,
    product_repository: ProductRepositoryDependency,
    actor: ActorDependency,
) -> StockItemResponse:
    entity = service.create_stock_item(
        repository,
        entity_id=request.entity_id,
        type=request.type,
        properties=request.properties.model_dump(by_alias=True),
        product_id=request.product_id,
        product_repository=product_repository,
    )
    return StockItemResponse.from_domain(entity)


@router.get(
    "/{stock_item_id}",
    response_model=StockItemResponse,
    operation_id="getStockItem",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def get_stock_item(stock_item_id: str, repository: RepositoryDependency) -> StockItemResponse:
    return StockItemResponse.from_domain(service.get_stock_item(repository, stock_item_id))


@router.get(
    "",
    response_model=Page[StockItemResponse],
    operation_id="listStockItems",
    responses={422: {"model": ErrorResponse}},
)
def list_stock_items(repository: RepositoryDependency, params: Annotated[PageParams, Query()]) -> Page[StockItemResponse]:
    after = decode_cursor(params.cursor) if params.cursor else None
    result = service.list_stock_items(repository, page=PageRequest(limit=params.limit, after=after))
    next_cursor = encode_cursor(result.next_cursor) if result.next_cursor else None
    return Page[StockItemResponse](
        items=[StockItemResponse.from_domain(entity) for entity in result.items], next_cursor=next_cursor
    )


@router.put(
    "/{stock_item_id}",
    response_model=StockItemResponse,
    operation_id="updateStockItem",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def update_stock_item(
    stock_item_id: str, request: StockItemUpdateRequest, repository: RepositoryDependency, actor: ActorDependency
) -> StockItemResponse:
    entity = service.update_stock_item(
        repository, stock_item_id, type=request.type, properties=request.properties.model_dump(by_alias=True)
    )
    return StockItemResponse.from_domain(entity)


@router.delete(
    "/{stock_item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="deleteStockItem",
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def delete_stock_item(stock_item_id: str, repository: RepositoryDependency, actor: ActorDependency) -> None:
    service.delete_stock_item(repository, stock_item_id)
