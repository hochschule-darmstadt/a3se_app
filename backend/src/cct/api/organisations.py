"""Organisation and OrgaRole resource endpoints.

Organisation is the aggregate root (/organisations/{organisationId});
OrgaRole is nested under its owning Organisation
(/organisations/{organisationId}/roles/{roleId}) per DR-0013.
"""

from __future__ import annotations

from typing import Annotated, Literal, Union

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict, Field

from cct.resource_management.contracts import ValidatedEntity
from cct.resource_management.pagination import PageRequest, decode_cursor, encode_cursor
from cct.resource_management.partner_management import service
from cct.resource_management.partner_management.models import AirlineRoleProperties, EmptySupplierRoleProperties, OrganisationProperties
from cct.resource_management.repository_ports import EntityRepositoryPort

from .dependencies import Actor, get_current_actor, get_partner_repository
from .schemas import ErrorResponse, Page, PageParams

router = APIRouter(prefix="/organisations", tags=["organisations"])

EMPTY_SUPPLIER_ROLE_TYPES = (
    "partner/supplier/hotel",
    "partner/supplier/accommodation",
    "partner/supplier/mobility",
    "partner/supplier/water-transport",
    "partner/supplier/experience",
    "partner/supplier/protection",
)


class OrganisationCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    entity_id: str = Field(alias="entityId", min_length=1, max_length=100)
    properties: OrganisationProperties


class OrganisationUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    properties: OrganisationProperties


class OrganisationResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    entity_id: str = Field(alias="entityId")
    entity_kind: Literal["Organisation"] = Field(alias="entityKind", default="Organisation")
    schema_version: int = Field(alias="schemaVersion")
    properties: OrganisationProperties

    @classmethod
    def from_domain(cls, entity: ValidatedEntity) -> "OrganisationResponse":
        return cls(entityId=entity.entity_id, schemaVersion=entity.schema_version, properties=entity.properties)


class AirlineRoleRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    type: Literal["partner/supplier/airline"] = "partner/supplier/airline"
    properties: AirlineRoleProperties


class EmptySupplierRoleRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    type: Literal[EMPTY_SUPPLIER_ROLE_TYPES]
    properties: EmptySupplierRoleProperties = EmptySupplierRoleProperties()


OrgaRoleVariant = Annotated[Union[AirlineRoleRequest, EmptySupplierRoleRequest], Field(discriminator="type")]


class OrgaRoleCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    entity_id: str = Field(alias="entityId", min_length=1, max_length=100)
    role: OrgaRoleVariant


class OrgaRoleUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    role: OrgaRoleVariant


class OrgaRoleResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    entity_id: str = Field(alias="entityId")
    entity_kind: Literal["OrgaRole"] = Field(alias="entityKind", default="OrgaRole")
    type: str
    schema_version: int = Field(alias="schemaVersion")
    properties: AirlineRoleProperties | EmptySupplierRoleProperties

    @classmethod
    def from_domain(cls, entity: ValidatedEntity) -> "OrgaRoleResponse":
        return cls(
            entityId=entity.entity_id, type=entity.type, schemaVersion=entity.schema_version, properties=entity.properties
        )


RepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_partner_repository)]
ActorDependency = Annotated[Actor, Depends(get_current_actor)]


@router.post(
    "",
    response_model=OrganisationResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="createOrganisation",
    responses={409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def create_organisation(
    request: OrganisationCreateRequest, repository: RepositoryDependency, actor: ActorDependency
) -> OrganisationResponse:
    entity = service.create_organisation(
        repository, entity_id=request.entity_id, properties=request.properties.model_dump(by_alias=True)
    )
    return OrganisationResponse.from_domain(entity)


@router.get(
    "/{organisation_id}",
    response_model=OrganisationResponse,
    operation_id="getOrganisation",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def get_organisation(organisation_id: str, repository: RepositoryDependency) -> OrganisationResponse:
    return OrganisationResponse.from_domain(service.get_organisation(repository, organisation_id))


@router.get(
    "",
    response_model=Page[OrganisationResponse],
    operation_id="listOrganisations",
    responses={422: {"model": ErrorResponse}},
)
def list_organisations(
    repository: RepositoryDependency, params: Annotated[PageParams, Query()]
) -> Page[OrganisationResponse]:
    after = decode_cursor(params.cursor) if params.cursor else None
    result = service.list_organisations(repository, page=PageRequest(limit=params.limit, after=after))
    next_cursor = encode_cursor(result.next_cursor) if result.next_cursor else None
    return Page[OrganisationResponse](
        items=[OrganisationResponse.from_domain(entity) for entity in result.items], next_cursor=next_cursor
    )


@router.put(
    "/{organisation_id}",
    response_model=OrganisationResponse,
    operation_id="updateOrganisation",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def update_organisation(
    organisation_id: str, request: OrganisationUpdateRequest, repository: RepositoryDependency, actor: ActorDependency
) -> OrganisationResponse:
    entity = service.update_organisation(
        repository, organisation_id, properties=request.properties.model_dump(by_alias=True)
    )
    return OrganisationResponse.from_domain(entity)


@router.delete(
    "/{organisation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="deleteOrganisation",
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def delete_organisation(organisation_id: str, repository: RepositoryDependency, actor: ActorDependency) -> None:
    service.delete_organisation(repository, organisation_id)


@router.post(
    "/{organisation_id}/roles",
    response_model=OrgaRoleResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="createOrgaRole",
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def create_orga_role(
    organisation_id: str, request: OrgaRoleCreateRequest, repository: RepositoryDependency, actor: ActorDependency
) -> OrgaRoleResponse:
    entity = service.create_orga_role(
        repository,
        entity_id=request.entity_id,
        organisation_id=organisation_id,
        type=request.role.type,
        properties=request.role.properties.model_dump(by_alias=True),
    )
    return OrgaRoleResponse.from_domain(entity)


@router.get(
    "/{organisation_id}/roles",
    response_model=list[OrgaRoleResponse],
    operation_id="listOrgaRoles",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def list_orga_roles(organisation_id: str, repository: RepositoryDependency) -> list[OrgaRoleResponse]:
    roles = service.list_orga_roles(repository, organisation_id)
    return [OrgaRoleResponse.from_domain(role) for role in roles]


@router.get(
    "/{organisation_id}/roles/{role_id}",
    response_model=OrgaRoleResponse,
    operation_id="getOrgaRole",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def get_orga_role(organisation_id: str, role_id: str, repository: RepositoryDependency) -> OrgaRoleResponse:
    return OrgaRoleResponse.from_domain(service.get_orga_role(repository, role_id))


@router.put(
    "/{organisation_id}/roles/{role_id}",
    response_model=OrgaRoleResponse,
    operation_id="updateOrgaRole",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def update_orga_role(
    organisation_id: str,
    role_id: str,
    request: OrgaRoleUpdateRequest,
    repository: RepositoryDependency,
    actor: ActorDependency,
) -> OrgaRoleResponse:
    entity = service.update_orga_role(
        repository, role_id, type=request.role.type, properties=request.role.properties.model_dump(by_alias=True)
    )
    return OrgaRoleResponse.from_domain(entity)


@router.delete(
    "/{organisation_id}/roles/{role_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="deleteOrgaRole",
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def delete_orga_role(organisation_id: str, role_id: str, repository: RepositoryDependency, actor: ActorDependency) -> None:
    service.delete_orga_role(repository, role_id)
