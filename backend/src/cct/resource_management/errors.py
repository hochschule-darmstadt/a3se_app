"""Typed domain errors mapped to HTTP responses by the API layer."""

from __future__ import annotations

from .contracts import EntityKind
from .relationship_types import RelationshipType


class EntityNotFoundError(LookupError):
    """Raised when a referenced entity does not exist."""

    def __init__(self, entity_kind: EntityKind, entity_id: str) -> None:
        super().__init__(f"{entity_kind.value} not found: {entity_id}")
        self.entity_kind = entity_kind
        self.entity_id = entity_id


class DuplicateEntityError(ValueError):
    """Raised when an entityId already exists for its entity kind."""

    def __init__(self, entity_kind: EntityKind, entity_id: str) -> None:
        super().__init__(f"{entity_kind.value} already exists: {entity_id}")
        self.entity_kind = entity_kind
        self.entity_id = entity_id


class InvalidReferenceError(ValueError):
    """Raised when a cross-entity reference does not resolve to the expected kind."""

    def __init__(self, field: str, reference_id: str, expected_kind: EntityKind) -> None:
        super().__init__(
            f"{field} does not reference an existing {expected_kind.value}: {reference_id}"
        )
        self.field = field
        self.reference_id = reference_id
        self.expected_kind = expected_kind


class InvalidEntityGraphError(ValueError):
    """Raised when persisted relationships cannot produce a canonical read projection."""

    def __init__(self, entity_id: str, detail: str) -> None:
        super().__init__(f"invalid graph for {entity_id}: {detail}")
        self.entity_id = entity_id
        self.detail = detail


class DependentEntityExistsError(ValueError):
    """Raised when delete is blocked by an existing dependent relationship."""

    def __init__(self, entity_id: str, dependents: tuple[tuple[RelationshipType, int], ...]) -> None:
        detail = ", ".join(f"{relationship_type.value}:{count}" for relationship_type, count in dependents)
        super().__init__(f"cannot delete {entity_id}: dependent relationships exist ({detail})")
        self.entity_id = entity_id
        self.dependents = dependents
