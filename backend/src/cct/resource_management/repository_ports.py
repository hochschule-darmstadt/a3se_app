"""Repository abstraction resource_management modules depend on instead of infrastructure."""

from __future__ import annotations

from datetime import date
from typing import Protocol

from .contracts import EntityKind, FlexibleEntity, ValidatedEntity
from .pagination import PageRequest, PageResult
from .relationship_types import RelationshipType


class EntityRepositoryPort(Protocol):
    """Structural contract satisfied by the real Neo4j repository and by test fakes."""

    def get(self, entity_kind: EntityKind, entity_id: str) -> ValidatedEntity | None: ...

    def list(
        self, entity_kind: EntityKind, *, type_filter: str | None, page: PageRequest
    ) -> PageResult[ValidatedEntity]: ...

    def save(self, candidate: FlexibleEntity | dict[str, object]) -> ValidatedEntity: ...

    def delete(self, entity_kind: EntityKind, entity_id: str) -> None: ...

    def create_relationship(
        self,
        *,
        from_kind: EntityKind,
        from_id: str,
        relationship: RelationshipType,
        to_kind: EntityKind,
        to_id: str,
    ) -> None: ...

    def delete_relationship(
        self,
        *,
        from_kind: EntityKind,
        from_id: str,
        relationship: RelationshipType,
        to_kind: EntityKind,
        to_id: str,
    ) -> None: ...

    def list_related(
        self,
        *,
        from_kind: EntityKind,
        from_id: str,
        relationship: RelationshipType,
        to_kind: EntityKind,
    ) -> tuple[ValidatedEntity, ...]: ...

    def get_component_tree(self, product_id: str) -> tuple[tuple[ValidatedEntity, str | None], ...]: ...

    def get_ancestors(self, product_id: str) -> tuple[ValidatedEntity, ...]: ...

    def get_product_parents(self, product_id: str) -> tuple[ValidatedEntity, ...]: ...

    def get_order_detail(self, order_id: str) -> tuple[dict[str, str | None], ...]: ...

    def get_organisation_for_role(self, role_id: str) -> ValidatedEntity | None: ...

    def list_stock_items(
        self,
        *,
        search: str | None,
        service_date_from: date | None,
        service_date_to: date | None,
        availability_state: str | None,
        product_type: str | None,
        page: PageRequest,
    ) -> PageResult[ValidatedEntity]: ...


class ScopedEntityRepository:
    """Wraps an EntityRepositoryPort, allow-listing the EntityKinds one module may access.

    This is the concrete, unit-testable guarantee that a module's service
    cannot read, write, or delete another module's owned entities, since the
    architecture tests alone cannot prove it (save/delete are entity-kind
    agnostic on the underlying repository).
    """

    def __init__(self, repository: EntityRepositoryPort, *, allowed_kinds: frozenset[EntityKind]) -> None:
        self._repository = repository
        self._allowed_kinds = allowed_kinds

    def get(self, entity_kind: EntityKind, entity_id: str) -> ValidatedEntity | None:
        self._require_allowed(entity_kind)
        return self._repository.get(entity_kind, entity_id)

    def list(
        self, entity_kind: EntityKind, *, type_filter: str | None = None, page: PageRequest = PageRequest()
    ) -> PageResult[ValidatedEntity]:
        self._require_allowed(entity_kind)
        return self._repository.list(entity_kind, type_filter=type_filter, page=page)

    def save(self, candidate: FlexibleEntity | dict[str, object]) -> ValidatedEntity:
        self._require_allowed(self._entity_kind_of(candidate))
        return self._repository.save(candidate)

    def delete(self, entity_kind: EntityKind, entity_id: str) -> None:
        self._require_allowed(entity_kind)
        self._repository.delete(entity_kind, entity_id)

    def create_relationship(
        self,
        *,
        from_kind: EntityKind,
        from_id: str,
        relationship: RelationshipType,
        to_kind: EntityKind,
        to_id: str,
    ) -> None:
        self._require_allowed(from_kind)
        self._repository.create_relationship(
            from_kind=from_kind, from_id=from_id, relationship=relationship, to_kind=to_kind, to_id=to_id
        )

    def delete_relationship(
        self,
        *,
        from_kind: EntityKind,
        from_id: str,
        relationship: RelationshipType,
        to_kind: EntityKind,
        to_id: str,
    ) -> None:
        self._require_allowed(from_kind)
        self._repository.delete_relationship(
            from_kind=from_kind, from_id=from_id, relationship=relationship, to_kind=to_kind, to_id=to_id
        )

    def list_related(
        self,
        *,
        from_kind: EntityKind,
        from_id: str,
        relationship: RelationshipType,
        to_kind: EntityKind,
    ) -> tuple[ValidatedEntity, ...]:
        self._require_allowed(from_kind)
        return self._repository.list_related(
            from_kind=from_kind, from_id=from_id, relationship=relationship, to_kind=to_kind
        )

    def get_component_tree(self, product_id: str) -> tuple[tuple[ValidatedEntity, str | None], ...]:
        self._require_allowed(EntityKind.TOURISTIC_PRODUCT_ITEM)
        return self._repository.get_component_tree(product_id)

    def get_ancestors(self, product_id: str) -> tuple[ValidatedEntity, ...]:
        self._require_allowed(EntityKind.TOURISTIC_PRODUCT_ITEM)
        return self._repository.get_ancestors(product_id)

    def get_product_parents(self, product_id: str) -> tuple[ValidatedEntity, ...]:
        self._require_allowed(EntityKind.TOURISTIC_PRODUCT_ITEM)
        return self._repository.get_product_parents(product_id)

    def get_order_detail(self, order_id: str) -> tuple[dict[str, str | None], ...]:
        self._require_allowed(EntityKind.ORDER_ITEM)
        return self._repository.get_order_detail(order_id)

    def get_organisation_for_role(self, role_id: str) -> ValidatedEntity | None:
        self._require_allowed(EntityKind.ORGA_ROLE)
        return self._repository.get_organisation_for_role(role_id)

    def list_stock_items(
        self,
        *,
        search: str | None,
        service_date_from: date | None,
        service_date_to: date | None,
        availability_state: str | None,
        product_type: str | None,
        page: PageRequest,
    ) -> PageResult[ValidatedEntity]:
        self._require_allowed(EntityKind.STOCK_ITEM)
        return self._repository.list_stock_items(
            search=search,
            service_date_from=service_date_from,
            service_date_to=service_date_to,
            availability_state=availability_state,
            product_type=product_type,
            page=page,
        )

    def _require_allowed(self, entity_kind: EntityKind) -> None:
        if entity_kind not in self._allowed_kinds:
            raise PermissionError(f"module is not permitted to access entity kind {entity_kind.value}")

    @staticmethod
    def _entity_kind_of(candidate: FlexibleEntity | dict[str, object]) -> EntityKind:
        if isinstance(candidate, FlexibleEntity):
            return candidate.entity_kind
        value = candidate["entityKind"]
        return value if isinstance(value, EntityKind) else EntityKind(str(value))
