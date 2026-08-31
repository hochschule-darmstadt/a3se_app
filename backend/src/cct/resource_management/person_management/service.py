"""Person Management public application operations.

The only entry point other layers use to read or write Person/PersonRole
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


def create_person(
    repository: EntityRepositoryPort, *, entity_id: str | None, properties: dict[str, object]
) -> ValidatedEntity:
    if entity_id is None:
        return repository.create_generated(entity_kind=EntityKind.PERSON, type=None, properties=properties)
    if repository.get(EntityKind.PERSON, entity_id) is not None:
        raise DuplicateEntityError(EntityKind.PERSON, entity_id)
    return repository.save({"entityId": entity_id, "entityKind": "Person", "properties": properties})


def get_person(repository: EntityRepositoryPort, entity_id: str) -> ValidatedEntity:
    entity = repository.get(EntityKind.PERSON, entity_id)
    if entity is None:
        raise EntityNotFoundError(EntityKind.PERSON, entity_id)
    return entity


def list_persons(
    repository: EntityRepositoryPort, *, page: PageRequest = PageRequest()
) -> PageResult[ValidatedEntity]:
    return repository.list(EntityKind.PERSON, page=page)


def update_person(
    repository: EntityRepositoryPort, entity_id: str, *, properties: dict[str, object]
) -> ValidatedEntity:
    if repository.get(EntityKind.PERSON, entity_id) is None:
        raise EntityNotFoundError(EntityKind.PERSON, entity_id)
    return repository.save({"entityId": entity_id, "entityKind": "Person", "properties": properties})


def delete_person(repository: EntityRepositoryPort, entity_id: str) -> None:
    repository.delete(EntityKind.PERSON, entity_id)


def create_person_role(
    repository: EntityRepositoryPort,
    *,
    entity_id: str | None,
    person_id: str,
    type: str,
    properties: dict[str, object],
) -> ValidatedEntity:
    if repository.get(EntityKind.PERSON, person_id) is None:
        raise EntityNotFoundError(EntityKind.PERSON, person_id)
    if entity_id is not None and repository.get(EntityKind.PERSON_ROLE, entity_id) is not None:
        raise DuplicateEntityError(EntityKind.PERSON_ROLE, entity_id)
    role = repository.create_generated(entity_kind=EntityKind.PERSON_ROLE, type=type, properties=properties) if entity_id is None else repository.save(
        {"entityId": entity_id, "entityKind": "PersonRole", "type": type, "properties": properties}
    )
    repository.create_relationship(
        from_kind=EntityKind.PERSON,
        from_id=person_id,
        relationship=RelationshipType.HAS_ROLE,
        to_kind=EntityKind.PERSON_ROLE,
        to_id=role.entity_id,
    )
    return role


def get_person_role(repository: EntityRepositoryPort, entity_id: str) -> ValidatedEntity:
    entity = repository.get(EntityKind.PERSON_ROLE, entity_id)
    if entity is None:
        raise EntityNotFoundError(EntityKind.PERSON_ROLE, entity_id)
    return entity


def list_person_roles(repository: EntityRepositoryPort, person_id: str) -> tuple[ValidatedEntity, ...]:
    if repository.get(EntityKind.PERSON, person_id) is None:
        raise EntityNotFoundError(EntityKind.PERSON, person_id)
    return repository.list_related(
        from_kind=EntityKind.PERSON,
        from_id=person_id,
        relationship=RelationshipType.HAS_ROLE,
        to_kind=EntityKind.PERSON_ROLE,
    )


def update_person_role(
    repository: EntityRepositoryPort, entity_id: str, *, type: str, properties: dict[str, object]
) -> ValidatedEntity:
    if repository.get(EntityKind.PERSON_ROLE, entity_id) is None:
        raise EntityNotFoundError(EntityKind.PERSON_ROLE, entity_id)
    return repository.save(
        {"entityId": entity_id, "entityKind": "PersonRole", "type": type, "properties": properties}
    )


def delete_person_role(repository: EntityRepositoryPort, entity_id: str) -> None:
    repository.delete(EntityKind.PERSON_ROLE, entity_id)
