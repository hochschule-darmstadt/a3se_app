"""Customer-facing product-level catalogue search."""

from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, ConfigDict, Field

from cct.api import display_names
from cct.resource_management.contracts import EntityKind
from cct.resource_management.pagination import decode_cursor, encode_cursor
from cct.resource_management.repository_ports import EntityRepositoryPort

from .dependencies import get_partner_repository, get_product_repository, get_stock_repository
from .schemas import ErrorResponse, Page, PageParams

router = APIRouter(prefix="/catalogue-search", tags=["catalogue-search"])

StockRepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_stock_repository)]
ProductRepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_product_repository)]
PartnerRepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_partner_repository)]


class CatalogueSearchParams(PageParams):
    search: str = Field(min_length=1, max_length=200)
    product_type: str | None = Field(default=None, alias="productType")
    service_date_from: date | None = Field(default=None, alias="serviceDateFrom")
    service_date_to: date | None = Field(default=None, alias="serviceDateTo")
    travellers: int = Field(default=1, ge=1, le=20)


class CatalogueSearchResult(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    product_id: str = Field(alias="productId")
    product_type: str = Field(alias="productType")
    product_display_name: str = Field(alias="productDisplayName")
    product_display_name_chain: list[str] = Field(alias="productDisplayNameChain")
    available_dates: list[date] = Field(alias="availableDates")
    indicative_unit_price_amount: Decimal = Field(alias="indicativeUnitPriceAmount")
    currency_code: str = Field(alias="currencyCode")


def _all_matching_stock(
    repository: EntityRepositoryPort,
    *,
    search: str,
    service_date_from: date | None,
    service_date_to: date | None,
    product_type: str | None,
    min_travellers: int,
) -> list:
    return list(repository.list_catalogue_stock_matches(
        search=search,
        service_date_from=service_date_from,
        service_date_to=service_date_to,
        product_type=product_type,
        min_travellers=min_travellers,
    ))


@router.get("", response_model=Page[CatalogueSearchResult], operation_id="searchCatalogue", responses={422: {"model": ErrorResponse}})
def search_catalogue(
    params: Annotated[CatalogueSearchParams, Query()],
    stock_repository: StockRepositoryDependency,
    product_repository: ProductRepositoryDependency,
    partner_repository: PartnerRepositoryDependency,
) -> Page[CatalogueSearchResult]:
    if params.service_date_from and params.service_date_to and params.service_date_from > params.service_date_to:
        raise ValueError("serviceDateFrom must not be after serviceDateTo")

    grouped: dict[str, dict[str, object]] = {}
    for stock, product in _all_matching_stock(
        stock_repository,
        search=params.search.strip(),
        service_date_from=params.service_date_from,
        service_date_to=params.service_date_to,
        product_type=params.product_type,
        min_travellers=params.travellers,
    ):
        item = grouped.setdefault(product.entity_id, {"product": product, "stocks": []})
        item["stocks"].append(stock)

    results: list[CatalogueSearchResult] = []
    for item in grouped.values():
        product = item["product"]
        stocks = item["stocks"]
        projection = display_names.product(product, product_repository, partner_repository)
        cheapest = min(stocks, key=lambda stock: stock.properties.unit_price_amount)
        results.append(CatalogueSearchResult(
            productId=product.entity_id,
            productType=product.type or "",
            productDisplayName=projection.display_name,
            productDisplayNameChain=list(projection.display_name_chain),
            availableDates=sorted({stock.properties.service_date for stock in stocks}),
            indicativeUnitPriceAmount=cheapest.properties.unit_price_amount,
            currencyCode=cheapest.properties.currency_code,
        ))

    results.sort(key=lambda result: result.product_id)
    total_count = len(results)
    after = decode_cursor(params.cursor) if params.cursor else None
    if after:
        results = [result for result in results if result.product_id > after]
    page_items = results[: params.limit]
    next_cursor = encode_cursor(page_items[-1].product_id) if len(results) > params.limit else None
    return Page[CatalogueSearchResult](items=page_items, nextCursor=next_cursor, totalCount=total_count)
