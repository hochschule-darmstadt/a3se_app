"""Person and PersonRole resource endpoints.

Person is the aggregate root (/persons/{personId}); PersonRole is nested
under its owning Person (/persons/{personId}/roles/{roleId}) per DR-0013.
"""

from __future__ import annotations

from typing import Annotated, Literal, Union

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict, Field

from cct.resource_management.contracts import ValidatedEntity
from cct.resource_management.pagination import PageRequest, decode_cursor, encode_cursor
from cct.resource_management.person_management import service
from cct.resource_management.person_management.models import (
    CustomerRoleProperties,
    PersonProperties,
    TravellerRoleProperties,
)
from cct.resource_management.repository_ports import EntityRepositoryPort

from .dependencies import Actor, get_current_actor, get_person_repository
from . import display_names
from .schemas import ErrorResponse, Page, PageParams

router = APIRouter(prefix="/persons", tags=["persons"])


class PersonCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    entity_id: str = Field(alias="entityId", min_length=1, max_length=100)
    properties: PersonProperties


class PersonUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    properties: PersonProperties


class PersonResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    entity_id: str = Field(alias="entityId")
    entity_kind: Literal["Person"] = Field(alias="entityKind", default="Person")
    schema_version: int = Field(alias="schemaVersion")
    properties: PersonProperties
    display_name: str = Field(alias="displayName")
    display_name_chain: list[str] = Field(alias="displayNameChain")

    @classmethod
    def from_domain(cls, entity: ValidatedEntity) -> "PersonResponse":
        projection = display_names.person(entity)
        return cls(
            entityId=entity.entity_id,
            schemaVersion=entity.schema_version,
            properties=entity.properties,
            displayName=projection.display_name,
            displayNameChain=list(projection.display_name_chain),
        )


class CustomerRoleRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    type: Literal["person/customer"] = "person/customer"
    properties: CustomerRoleProperties


class TravellerRoleRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    type: Literal["person/traveller"] = "person/traveller"
    properties: TravellerRoleProperties


PersonRoleVariant = Annotated[Union[CustomerRoleRequest, TravellerRoleRequest], Field(discriminator="type")]


class PersonRoleCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    entity_id: str = Field(alias="entityId", min_length=1, max_length=100)
    role: PersonRoleVariant


class PersonRoleUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    role: PersonRoleVariant


class PersonRoleResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    entity_id: str = Field(alias="entityId")
    entity_kind: Literal["PersonRole"] = Field(alias="entityKind", default="PersonRole")
    type: str
    schema_version: int = Field(alias="schemaVersion")
    properties: CustomerRoleProperties | TravellerRoleProperties
    display_name: str = Field(alias="displayName")
    display_name_chain: list[str] = Field(alias="displayNameChain")

    @classmethod
    def from_domain(cls, entity: ValidatedEntity, owner: ValidatedEntity) -> "PersonRoleResponse":
        projection = display_names.person_role(entity, owner)
        return cls(
            entityId=entity.entity_id,
            type=entity.type,
            schemaVersion=entity.schema_version,
            properties=entity.properties,
            displayName=projection.display_name,
            displayNameChain=list(projection.display_name_chain),
        )


RepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_person_repository)]
ActorDependency = Annotated[Actor, Depends(get_current_actor)]


@router.post(
    "",
    response_model=PersonResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="createPerson",
    responses={409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def create_person(request: PersonCreateRequest, repository: RepositoryDependency, actor: ActorDependency) -> PersonResponse:
    entity = service.create_person(
        repository, entity_id=request.entity_id, properties=request.properties.model_dump(by_alias=True)
    )
    return PersonResponse.from_domain(entity)


@router.get(
    "/{person_id}",
    response_model=PersonResponse,
    operation_id="getPerson",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def get_person(person_id: str, repository: RepositoryDependency) -> PersonResponse:
    return PersonResponse.from_domain(service.get_person(repository, person_id))


@router.get(
    "", response_model=Page[PersonResponse], operation_id="listPersons", responses={422: {"model": ErrorResponse}}
)
def list_persons(repository: RepositoryDependency, params: Annotated[PageParams, Query()]) -> Page[PersonResponse]:
    after = decode_cursor(params.cursor) if params.cursor else None
    result = service.list_persons(repository, page=PageRequest(limit=params.limit, after=after))
    next_cursor = encode_cursor(result.next_cursor) if result.next_cursor else None
    return Page[PersonResponse](
        items=[PersonResponse.from_domain(entity) for entity in result.items], next_cursor=next_cursor
    )


@router.put(
    "/{person_id}",
    response_model=PersonResponse,
    operation_id="updatePerson",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def update_person(
    person_id: str, request: PersonUpdateRequest, repository: RepositoryDependency, actor: ActorDependency
) -> PersonResponse:
    entity = service.update_person(repository, person_id, properties=request.properties.model_dump(by_alias=True))
    return PersonResponse.from_domain(entity)


@router.delete(
    "/{person_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="deletePerson",
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def delete_person(person_id: str, repository: RepositoryDependency, actor: ActorDependency) -> None:
    service.delete_person(repository, person_id)


@router.post(
    "/{person_id}/roles",
    response_model=PersonRoleResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="createPersonRole",
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def create_person_role(
    person_id: str, request: PersonRoleCreateRequest, repository: RepositoryDependency, actor: ActorDependency
) -> PersonRoleResponse:
    entity = service.create_person_role(
        repository,
        entity_id=request.entity_id,
        person_id=person_id,
        type=request.role.type,
        properties=request.role.properties.model_dump(by_alias=True),
    )
    owner = service.get_person(repository, person_id)
    return PersonRoleResponse.from_domain(entity, owner)


@router.get(
    "/{person_id}/roles",
    response_model=list[PersonRoleResponse],
    operation_id="listPersonRoles",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def list_person_roles(person_id: str, repository: RepositoryDependency) -> list[PersonRoleResponse]:
    roles = service.list_person_roles(repository, person_id)
    owner = service.get_person(repository, person_id)
    return [PersonRoleResponse.from_domain(role, owner) for role in roles]


@router.get(
    "/{person_id}/roles/{role_id}",
    response_model=PersonRoleResponse,
    operation_id="getPersonRole",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def get_person_role(person_id: str, role_id: str, repository: RepositoryDependency) -> PersonRoleResponse:
    owner = service.get_person(repository, person_id)
    roles = service.list_person_roles(repository, person_id)
    role = next((candidate for candidate in roles if candidate.entity_id == role_id), None)
    if role is None:
        from cct.resource_management.errors import InvalidEntityGraphError

        raise InvalidEntityGraphError(role_id, f"role is not owned by Person {person_id}")
    return PersonRoleResponse.from_domain(role, owner)


@router.put(
    "/{person_id}/roles/{role_id}",
    response_model=PersonRoleResponse,
    operation_id="updatePersonRole",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def update_person_role(
    person_id: str,
    role_id: str,
    request: PersonRoleUpdateRequest,
    repository: RepositoryDependency,
    actor: ActorDependency,
) -> PersonRoleResponse:
    entity = service.update_person_role(
        repository, role_id, type=request.role.type, properties=request.role.properties.model_dump(by_alias=True)
    )
    owner = service.get_person(repository, person_id)
    return PersonRoleResponse.from_domain(entity, owner)


@router.delete(
    "/{person_id}/roles/{role_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="deletePersonRole",
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def delete_person_role(person_id: str, role_id: str, repository: RepositoryDependency, actor: ActorDependency) -> None:
    service.delete_person_role(repository, role_id)
