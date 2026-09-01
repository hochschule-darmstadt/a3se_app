"""Read-only cross-view incoming-reference projections for Staff navigation."""

from __future__ import annotations

from typing import Annotated, Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict, Field

from cct.resource_management.contracts import EntityKind
from cct.resource_management.repository_ports import EntityRepositoryPort

from .dependencies import (
    get_order_repository,
    get_partner_repository,
    get_person_repository,
    get_product_repository,
    get_stock_repository,
)
from .schemas import ErrorResponse

router = APIRouter(prefix="/incoming-references", tags=["incoming-references"])

ReferenceKind = Literal["person-role", "orga-role", "organisation", "product", "stock-item"]


class IncomingReferenceResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    entity_id: str = Field(alias="entityId")
    counts: dict[str, int]


@router.get(
    "/{reference_kind}/{entity_id}",
    response_model=IncomingReferenceResponse,
    operation_id="getIncomingReferenceCounts",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def get_incoming_reference_counts(
    reference_kind: ReferenceKind,
    entity_id: str,
    person_repository: Annotated[EntityRepositoryPort, Depends(get_person_repository)],
    partner_repository: Annotated[EntityRepositoryPort, Depends(get_partner_repository)],
    product_repository: Annotated[EntityRepositoryPort, Depends(get_product_repository)],
    stock_repository: Annotated[EntityRepositoryPort, Depends(get_stock_repository)],
    order_repository: Annotated[EntityRepositoryPort, Depends(get_order_repository)],
) -> IncomingReferenceResponse:
    repositories: dict[ReferenceKind, tuple[EntityRepositoryPort, EntityKind]] = {
        "person-role": (person_repository, EntityKind.PERSON_ROLE),
        "orga-role": (partner_repository, EntityKind.ORGA_ROLE),
        "organisation": (partner_repository, EntityKind.ORGANISATION),
        "product": (product_repository, EntityKind.TOURISTIC_PRODUCT_ITEM),
        "stock-item": (stock_repository, EntityKind.STOCK_ITEM),
    }
    repository, entity_kind = repositories[reference_kind]
    return IncomingReferenceResponse(
        entityId=entity_id,
        counts=repository.incoming_reference_counts(entity_kind=entity_kind, entity_id=entity_id),
    )
