"""OrderItem resource endpoints.

The order header is the aggregate root (/orders/{orderId}); a position is
nested under its header (/orders/{orderId}/positions/{positionId}) and has no
properties of its own, only relationships. /orders/{orderId}/detail returns
the header plus each position's resolved bounded summary (stock/product/
supplier/traveller ids only), never a raw graph read.
"""

from __future__ import annotations

from datetime import date
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict, Field

from cct.resource_management.contracts import ValidatedEntity
from cct.resource_management.order_management import service
from cct.resource_management.order_management.models import OrderHeaderProperties, OrderPositionProperties
from cct.resource_management.pagination import PageRequest, decode_cursor, encode_cursor
from cct.resource_management.repository_ports import EntityRepositoryPort

from .dependencies import Actor, get_current_actor, get_order_repository, get_person_repository, get_stock_repository
from .schemas import ErrorResponse, Page, PageParams

router = APIRouter(prefix="/orders", tags=["orders"])


class OrderCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    properties: OrderHeaderProperties


class OrderUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    properties: OrderHeaderProperties


class OrderResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    entity_id: str = Field(alias="entityId")
    entity_kind: Literal["OrderItem"] = Field(alias="entityKind", default="OrderItem")
    type: Literal["order/header"] = "order/header"
    schema_version: int = Field(alias="schemaVersion")
    properties: OrderHeaderProperties

    @classmethod
    def from_domain(cls, entity: ValidatedEntity) -> "OrderResponse":
        return cls(entityId=entity.entity_id, schemaVersion=entity.schema_version, properties=entity.properties)


class OrderPositionCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    entity_id: str | None = Field(default=None, alias="entityId", min_length=1, max_length=100)


class OrderPositionResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    entity_id: str = Field(alias="entityId")
    entity_kind: Literal["OrderItem"] = Field(alias="entityKind", default="OrderItem")
    type: Literal["order/position"] = "order/position"
    schema_version: int = Field(alias="schemaVersion")
    properties: OrderPositionProperties

    @classmethod
    def from_domain(cls, entity: ValidatedEntity) -> "OrderPositionResponse":
        return cls(entityId=entity.entity_id, schemaVersion=entity.schema_version, properties=entity.properties)


class AllocateStockRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    stock_item_id: str = Field(alias="stockItemId", min_length=1, max_length=100)


class AssignTravellerRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    traveller_role_id: str = Field(alias="travellerRoleId", min_length=1, max_length=100)


class AssignCustomerRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    customer_role_id: str = Field(alias="customerRoleId", min_length=1, max_length=100)


class OrderPositionDetail(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    position_id: str = Field(alias="positionId")
    stock_item_id: str | None = Field(alias="stockItemId")
    product_id: str | None = Field(alias="productId")
    travellers: list["OrderTravellerDetail"]


class OrderTravellerDetail(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)
    role_id: str = Field(alias="roleId")
    person_id: str = Field(alias="personId")
    display_name: str = Field(alias="displayName")


class OrderDetailResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    order: OrderResponse
    customer_role_id: str | None = Field(alias="customerRoleId")
    customer_person_id: str | None = Field(alias="customerPersonId")
    customer_display_name: str | None = Field(alias="customerDisplayName")
    positions: list[OrderPositionDetail]


class OrderSummaryResponse(OrderResponse):
    customer_person_id: str | None = Field(alias="customerPersonId")
    customer_display_name: str | None = Field(alias="customerDisplayName")
    position_count: int = Field(alias="positionCount")
    unresolved_position_count: int = Field(alias="unresolvedPositionCount")
    service_date_from: date | None = Field(alias="serviceDateFrom")
    service_date_to: date | None = Field(alias="serviceDateTo")


class OrderPageParams(PageParams):
    search: str | None = None
    status: str | None = None
    product_type: str | None = Field(default=None, alias="productType")
    service_date_from: date | None = Field(default=None, alias="serviceDateFrom")
    service_date_to: date | None = Field(default=None, alias="serviceDateTo")
    unresolved_only: bool = Field(default=False, alias="unresolvedOnly")


RepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_order_repository)]
StockRepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_stock_repository)]
PersonRepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_person_repository)]
ActorDependency = Annotated[Actor, Depends(get_current_actor)]


@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="createOrder",
    responses={409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def create_order(request: OrderCreateRequest, repository: RepositoryDependency, actor: ActorDependency) -> OrderResponse:
    entity = service.create_order(
        repository, entity_id=request.entity_id, properties=request.properties.model_dump(by_alias=True)
    )
    return OrderResponse.from_domain(entity)


@router.get(
    "/{order_id}",
    response_model=OrderResponse,
    operation_id="getOrder",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def get_order(order_id: str, repository: RepositoryDependency) -> OrderResponse:
    return OrderResponse.from_domain(service.get_order(repository, order_id))


@router.get(
    "", response_model=Page[OrderSummaryResponse], operation_id="listOrders", responses={422: {"model": ErrorResponse}}
)
def list_orders(repository: RepositoryDependency, params: Annotated[OrderPageParams, Query()]) -> Page[OrderSummaryResponse]:
    after = decode_cursor(params.cursor) if params.cursor else None
    rows = service.list_order_summaries(repository, search=params.search, status=params.status,
        product_type=params.product_type, service_date_from=params.service_date_from,
        service_date_to=params.service_date_to, unresolved_only=params.unresolved_only,
        page=PageRequest(limit=params.limit, after=after))
    has_more = len(rows) > params.limit
    visible = rows[:params.limit]
    items = [OrderSummaryResponse(**OrderResponse.from_domain(entity).model_dump(by_alias=True), **summary) for entity, summary in visible]
    next_cursor = encode_cursor(visible[-1][0].entity_id) if has_more and visible else None
    return Page[OrderSummaryResponse](items=items, next_cursor=next_cursor)


@router.put(
    "/{order_id}",
    response_model=OrderResponse,
    operation_id="updateOrder",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def update_order(order_id: str, request: OrderUpdateRequest, repository: RepositoryDependency, actor: ActorDependency) -> OrderResponse:
    entity = service.update_order(repository, order_id, properties=request.properties.model_dump(by_alias=True))
    return OrderResponse.from_domain(entity)


@router.delete(
    "/{order_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="deleteOrder",
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def delete_order(order_id: str, repository: RepositoryDependency, actor: ActorDependency) -> None:
    service.delete_order(repository, order_id)


@router.put(
    "/{order_id}/customer",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="assignOrderCustomer",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def assign_customer(
    order_id: str,
    request: AssignCustomerRequest,
    repository: RepositoryDependency,
    person_repository: PersonRepositoryDependency,
    actor: ActorDependency,
) -> None:
    service.assign_customer(
        repository, order_id, customer_role_id=request.customer_role_id, person_repository=person_repository
    )


@router.get(
    "/{order_id}/detail",
    response_model=OrderDetailResponse,
    operation_id="getOrderDetail",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def get_order_detail(order_id: str, repository: RepositoryDependency) -> OrderDetailResponse:
    order = OrderResponse.from_domain(service.get_order(repository, order_id))
    detail = service.get_order_detail(repository, order_id)
    return OrderDetailResponse(order=order, **detail)


@router.post(
    "/{order_id}/positions",
    response_model=OrderPositionResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="createOrderPosition",
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def create_order_position(
    order_id: str, request: OrderPositionCreateRequest, repository: RepositoryDependency, actor: ActorDependency
) -> OrderPositionResponse:
    entity = service.create_order_position(repository, entity_id=request.entity_id, order_id=order_id)
    return OrderPositionResponse.from_domain(entity)


@router.get(
    "/{order_id}/positions",
    response_model=list[OrderPositionResponse],
    operation_id="listOrderPositions",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def list_order_positions(order_id: str, repository: RepositoryDependency) -> list[OrderPositionResponse]:
    positions = service.list_order_positions(repository, order_id)
    return [OrderPositionResponse.from_domain(position) for position in positions]


@router.get(
    "/{order_id}/positions/{position_id}",
    response_model=OrderPositionResponse,
    operation_id="getOrderPosition",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def get_order_position(order_id: str, position_id: str, repository: RepositoryDependency) -> OrderPositionResponse:
    return OrderPositionResponse.from_domain(service.get_order_position(repository, position_id))


@router.delete(
    "/{order_id}/positions/{position_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="deleteOrderPosition",
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def delete_order_position(order_id: str, position_id: str, repository: RepositoryDependency, actor: ActorDependency) -> None:
    service.delete_order_position(repository, position_id)


@router.put(
    "/{order_id}/positions/{position_id}/stock",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="allocateOrderPositionStock",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def allocate_stock(
    order_id: str,
    position_id: str,
    request: AllocateStockRequest,
    repository: RepositoryDependency,
    stock_repository: StockRepositoryDependency,
    actor: ActorDependency,
) -> None:
    service.allocate_stock(
        repository, position_id, stock_item_id=request.stock_item_id, stock_repository=stock_repository
    )


@router.delete(
    "/{order_id}/positions/{position_id}/stock/{stock_item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="releaseOrderPositionStock",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def release_stock(
    order_id: str,
    position_id: str,
    stock_item_id: str,
    repository: RepositoryDependency,
    stock_repository: StockRepositoryDependency,
    actor: ActorDependency,
) -> None:
    service.release_stock(repository, position_id, stock_item_id=stock_item_id, stock_repository=stock_repository)


@router.put(
    "/{order_id}/positions/{position_id}/traveller",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="assignOrderPositionTraveller",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def assign_traveller(
    order_id: str,
    position_id: str,
    request: AssignTravellerRequest,
    repository: RepositoryDependency,
    person_repository: PersonRepositoryDependency,
    actor: ActorDependency,
) -> None:
    service.assign_traveller(
        repository, position_id, traveller_role_id=request.traveller_role_id, person_repository=person_repository
    )
