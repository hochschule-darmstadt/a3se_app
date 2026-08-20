"""TouristicProductItem resource endpoints.

Independently root-addressable at /products/{productId}; CONTAINS composition
is genuinely recursive (a package containing a flight, accommodation, and
excursion, where the excursion itself contains insurance, is a real expected
shape), created via an optional parentProductId and read as a full component
tree at /products/{productId}/components, capped at
PRODUCT_COMPONENT_MAX_DEPTH as a defensive bound, not a business limit.
"""

from __future__ import annotations

from typing import Annotated, Literal, Union

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict, Field

from cct.resource_management.contracts import ValidatedEntity
from cct.resource_management.pagination import PageRequest, decode_cursor, encode_cursor
from cct.resource_management.repository_ports import EntityRepositoryPort
from cct.resource_management.touristic_product_management import service
from cct.resource_management.touristic_product_management.models import (
    EmptyProductProperties,
    FlightProperties,
    RoomCategoryProperties,
    RoomProperties,
    SeatProperties,
)

from .dependencies import Actor, get_current_actor, get_partner_repository, get_product_repository
from .organisations import OrgaRoleResponse
from .schemas import ErrorResponse, Page, PageParams, transport_properties_model

router = APIRouter(prefix="/products", tags=["products"])

# FlightProperties has time fields; strict=True domain contracts (DR-0012) can
# never accept the ISO-8601 strings that are JSON's only wire representation
# of a time, so requests use a lenient transport sibling (see schemas.py).
FlightPropertiesTransport = transport_properties_model(FlightProperties)

EMPTY_PRODUCT_TYPES = (
    "product/mobility/transfer",
    "product/mobility/rail",
    "product/mobility/coach",
    "product/mobility/vehicle-rental",
    "product/water/day-boat",
    "product/water/cruise",
    "product/experience/guided-tour",
    "product/experience/activity",
    "product/protection/travel",
)
ROOM_CATEGORY_TYPES = ("product/hotel/room-category", "product/accommodation/room-category")


class FlightRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    type: Literal["product/flight"] = "product/flight"
    properties: FlightPropertiesTransport


class SeatRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    type: Literal["product/flight/seat"] = "product/flight/seat"
    properties: SeatProperties


class RoomCategoryRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    type: Literal[ROOM_CATEGORY_TYPES]
    properties: RoomCategoryProperties


class RoomRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    type: Literal["product/hotel/room"] = "product/hotel/room"
    properties: RoomProperties


class EmptyProductRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    type: Literal[EMPTY_PRODUCT_TYPES]
    properties: EmptyProductProperties = EmptyProductProperties()


ProductVariant = Annotated[
    Union[FlightRequest, SeatRequest, RoomCategoryRequest, RoomRequest, EmptyProductRequest],
    Field(discriminator="type"),
]
ProductPropertiesUnion = (
    FlightProperties | SeatProperties | RoomCategoryProperties | RoomProperties | EmptyProductProperties
)


class ProductCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    entity_id: str = Field(alias="entityId", min_length=1, max_length=100)
    parent_product_id: str | None = Field(default=None, alias="parentProductId")
    product: ProductVariant


class ProductUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    product: ProductVariant


class ProductResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    entity_id: str = Field(alias="entityId")
    entity_kind: Literal["TouristicProductItem"] = Field(alias="entityKind", default="TouristicProductItem")
    type: str
    schema_version: int = Field(alias="schemaVersion")
    properties: ProductPropertiesUnion

    @classmethod
    def from_domain(cls, entity: ValidatedEntity) -> "ProductResponse":
        return cls(
            entityId=entity.entity_id, type=entity.type, schemaVersion=entity.schema_version, properties=entity.properties
        )


class ProductComponentResponse(ProductResponse):
    parent_product_id: str | None = Field(default=None, alias="parentProductId")

    @classmethod
    def from_component(cls, entity: ValidatedEntity, parent_product_id: str | None) -> "ProductComponentResponse":
        return cls(
            entityId=entity.entity_id,
            type=entity.type,
            schemaVersion=entity.schema_version,
            properties=entity.properties,
            parentProductId=parent_product_id,
        )


class SetSupplierRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    supplier_role_id: str = Field(alias="supplierRoleId", min_length=1, max_length=100)


RepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_product_repository)]
PartnerRepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_partner_repository)]
ActorDependency = Annotated[Actor, Depends(get_current_actor)]


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="createProduct",
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def create_product(request: ProductCreateRequest, repository: RepositoryDependency, actor: ActorDependency) -> ProductResponse:
    entity = service.create_product(
        repository,
        entity_id=request.entity_id,
        type=request.product.type,
        properties=request.product.properties.model_dump(by_alias=True),
        parent_product_id=request.parent_product_id,
    )
    return ProductResponse.from_domain(entity)


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    operation_id="getProduct",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def get_product(product_id: str, repository: RepositoryDependency) -> ProductResponse:
    return ProductResponse.from_domain(service.get_product(repository, product_id))


class ProductPageParams(PageParams):
    """PageParams plus an optional exact-type filter.

    FastAPI's "Pydantic model as query parameters" expansion only reliably
    applies with a single such model per route -- combining it with a second,
    separately declared Query() parameter falls back to treating the whole
    model as one opaque query value. Folding the filter into the page-params
    model itself sidesteps that.
    """

    type: str | None = Field(default=None, description="Filter by exact terminology type, e.g. product/flight")


@router.get(
    "", response_model=Page[ProductResponse], operation_id="listProducts", responses={422: {"model": ErrorResponse}}
)
def list_products(
    repository: RepositoryDependency, params: Annotated[ProductPageParams, Query()]
) -> Page[ProductResponse]:
    after = decode_cursor(params.cursor) if params.cursor else None
    result = service.list_products(
        repository, type_filter=params.type, page=PageRequest(limit=params.limit, after=after)
    )
    next_cursor = encode_cursor(result.next_cursor) if result.next_cursor else None
    return Page[ProductResponse](
        items=[ProductResponse.from_domain(entity) for entity in result.items], next_cursor=next_cursor
    )


@router.put(
    "/{product_id}",
    response_model=ProductResponse,
    operation_id="updateProduct",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def update_product(
    product_id: str, request: ProductUpdateRequest, repository: RepositoryDependency, actor: ActorDependency
) -> ProductResponse:
    entity = service.update_product(
        repository, product_id, type=request.product.type, properties=request.product.properties.model_dump(by_alias=True)
    )
    return ProductResponse.from_domain(entity)


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="deleteProduct",
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def delete_product(product_id: str, repository: RepositoryDependency, actor: ActorDependency) -> None:
    service.delete_product(repository, product_id)


@router.get(
    "/{product_id}/components",
    response_model=list[ProductComponentResponse],
    operation_id="getProductComponentTree",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def get_product_components(product_id: str, repository: RepositoryDependency) -> list[ProductComponentResponse]:
    tree = service.get_component_tree(repository, product_id)
    return [ProductComponentResponse.from_component(entity, parent_id) for entity, parent_id in tree]


@router.put(
    "/{product_id}/supplier",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="setProductSupplier",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def set_product_supplier(
    product_id: str,
    request: SetSupplierRequest,
    repository: RepositoryDependency,
    partner_repository: PartnerRepositoryDependency,
    actor: ActorDependency,
) -> None:
    service.set_supplier(
        repository, product_id, supplier_role_id=request.supplier_role_id, partner_repository=partner_repository
    )


@router.get(
    "/{product_id}/supplier",
    response_model=OrgaRoleResponse | None,
    operation_id="getProductSupplier",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def get_product_supplier(product_id: str, repository: RepositoryDependency) -> OrgaRoleResponse | None:
    role = service.get_supplier(repository, product_id)
    return OrgaRoleResponse.from_domain(role) if role is not None else None
