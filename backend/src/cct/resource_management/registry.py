"""Controlled registry selecting module-owned property contracts."""

from __future__ import annotations

from decimal import Decimal
from typing import TypeVar

from pydantic import BaseModel

from .contracts import EntityKind, FlexibleEntity, StrictProperties, ValidatedEntity

PropertyModel = TypeVar("PropertyModel", bound=StrictProperties)
RegistryKey = tuple[EntityKind, str | None]


class EntityTypeRegistry:
    """Deployment-time registry; untrusted callers cannot add contracts."""

    def __init__(self, contracts: dict[RegistryKey, type[StrictProperties]]) -> None:
        self._contracts = dict(contracts)

    def validate(self, entity: FlexibleEntity | dict[str, object]) -> ValidatedEntity:
        boundary = entity if isinstance(entity, FlexibleEntity) else FlexibleEntity.model_validate(entity)
        if boundary.schema_version != 1:
            raise ValueError(f"unsupported schemaVersion: {boundary.schema_version}")
        key = (boundary.entity_kind, boundary.type)
        try:
            contract = self._contracts[key]
        except KeyError as error:
            raise ValueError(f"unsupported entity contract: {key[0].value}/{key[1]}") from error
        properties = contract.model_validate(dict(boundary.properties))
        return ValidatedEntity(
            entity_id=boundary.entity_id,
            entity_kind=boundary.entity_kind,
            type=boundary.type,
            properties=properties,
            schema_version=boundary.schema_version,
        )

    def restore(self, *, structural: dict[str, object], properties: dict[str, object]) -> ValidatedEntity:
        key = (EntityKind(str(structural["entityKind"])), structural.get("type"))
        contract = self._contracts[key]
        restored = dict(properties)
        for field_name, field in contract.model_fields.items():
            alias = field.alias or field_name
            if field.annotation is Decimal and alias in restored and isinstance(restored[alias], str):
                restored[alias] = Decimal(restored[alias])
        return self.validate(
            {
                "entityId": structural["entityId"],
                "entityKind": structural["entityKind"],
                "type": structural.get("type"),
                "schemaVersion": structural["schemaVersion"],
                "properties": restored,
            }
        )

    def contract_for(self, entity: ValidatedEntity) -> type[BaseModel]:
        return self._contracts[(entity.entity_kind, entity.type)]
