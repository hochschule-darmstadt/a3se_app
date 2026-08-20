"""Partner Management public application operations.

The only entry point other layers use to read or write Organisation/OrgaRole
entities. `repository` must already be scoped to this module's EntityKinds
(a ScopedEntityRepository built once by the composition script); these
functions do not re-scope it themselves.
"""

from __future__ import annotations

from cct.resource_management.contracts import EntityKind, ValidatedEntity
from cct.resource_management.errors import DuplicateEntityError, EntityNotFoundError
from cct.resource_management.pagination import PageRequest, PageResult
from cct.resource_management.relationship_types import RelationshipType
from cct.resource_management.repository_ports import EntityRepositoryPort


def create_organisation(
    repository: EntityRepositoryPort, *, entity_id: str, properties: dict[str, object]
) -> ValidatedEntity:
    if repository.get(EntityKind.ORGANISATION, entity_id) is not None:
        raise DuplicateEntityError(EntityKind.ORGANISATION, entity_id)
    return repository.save({"entityId": entity_id, "entityKind": "Organisation", "properties": properties})


def get_organisation(repository: EntityRepositoryPort, entity_id: str) -> ValidatedEntity:
    entity = repository.get(EntityKind.ORGANISATION, entity_id)
    if entity is None:
        raise EntityNotFoundError(EntityKind.ORGANISATION, entity_id)
    return entity


def list_organisations(
    repository: EntityRepositoryPort, *, page: PageRequest = PageRequest()
) -> PageResult[ValidatedEntity]:
    return repository.list(EntityKind.ORGANISATION, page=page)


def update_organisation(
    repository: EntityRepositoryPort, entity_id: str, *, properties: dict[str, object]
) -> ValidatedEntity:
    if repository.get(EntityKind.ORGANISATION, entity_id) is None:
        raise EntityNotFoundError(EntityKind.ORGANISATION, entity_id)
    return repository.save({"entityId": entity_id, "entityKind": "Organisation", "properties": properties})


def delete_organisation(repository: EntityRepositoryPort, entity_id: str) -> None:
    repository.delete(EntityKind.ORGANISATION, entity_id)


def create_orga_role(
    repository: EntityRepositoryPort,
    *,
    entity_id: str,
    organisation_id: str,
    type: str,
    properties: dict[str, object],
) -> ValidatedEntity:
    if repository.get(EntityKind.ORGANISATION, organisation_id) is None:
        raise EntityNotFoundError(EntityKind.ORGANISATION, organisation_id)
    if repository.get(EntityKind.ORGA_ROLE, entity_id) is not None:
        raise DuplicateEntityError(EntityKind.ORGA_ROLE, entity_id)
    role = repository.save(
        {"entityId": entity_id, "entityKind": "OrgaRole", "type": type, "properties": properties}
    )
    repository.create_relationship(
        from_kind=EntityKind.ORGANISATION,
        from_id=organisation_id,
        relationship=RelationshipType.HAS_ROLE,
        to_kind=EntityKind.ORGA_ROLE,
        to_id=entity_id,
    )
    return role


def get_orga_role(repository: EntityRepositoryPort, entity_id: str) -> ValidatedEntity:
    entity = repository.get(EntityKind.ORGA_ROLE, entity_id)
    if entity is None:
        raise EntityNotFoundError(EntityKind.ORGA_ROLE, entity_id)
    return entity


def list_orga_roles(repository: EntityRepositoryPort, organisation_id: str) -> tuple[ValidatedEntity, ...]:
    if repository.get(EntityKind.ORGANISATION, organisation_id) is None:
        raise EntityNotFoundError(EntityKind.ORGANISATION, organisation_id)
    return repository.list_related(
        from_kind=EntityKind.ORGANISATION,
        from_id=organisation_id,
        relationship=RelationshipType.HAS_ROLE,
        to_kind=EntityKind.ORGA_ROLE,
    )


def update_orga_role(
    repository: EntityRepositoryPort, entity_id: str, *, type: str, properties: dict[str, object]
) -> ValidatedEntity:
    if repository.get(EntityKind.ORGA_ROLE, entity_id) is None:
        raise EntityNotFoundError(EntityKind.ORGA_ROLE, entity_id)
    return repository.save(
        {"entityId": entity_id, "entityKind": "OrgaRole", "type": type, "properties": properties}
    )


def delete_orga_role(repository: EntityRepositoryPort, entity_id: str) -> None:
    repository.delete(EntityKind.ORGA_ROLE, entity_id)


def get_organisation_for_role(repository: EntityRepositoryPort, role_id: str) -> ValidatedEntity:
    if repository.get(EntityKind.ORGA_ROLE, role_id) is None:
        raise EntityNotFoundError(EntityKind.ORGA_ROLE, role_id)
    organisation = repository.get_organisation_for_role(role_id)
    if organisation is None:
        raise EntityNotFoundError(EntityKind.ORGANISATION, role_id)
    return organisation
