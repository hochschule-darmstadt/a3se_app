"""Shared boundary contracts for module-owned flexible entities."""

from __future__ import annotations

from collections.abc import Mapping
from datetime import date, datetime, time
from decimal import Decimal
from enum import StrEnum
from types import MappingProxyType
from typing import TypeAlias

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


ScalarProperty: TypeAlias = bool | int | float | str | Decimal | date | time | datetime
PropertyValue: TypeAlias = ScalarProperty | tuple[ScalarProperty, ...]
RESERVED_PROPERTY_NAMES = frozenset(
    {"entityId", "entityKind", "type", "properties", "schemaVersion", "decimalPropertyKeys"}
)


class EntityKind(StrEnum):
    PERSON = "Person"
    PERSON_ROLE = "PersonRole"
    ORGANISATION = "Organisation"
    ORGA_ROLE = "OrgaRole"
    TOURISTIC_PRODUCT_ITEM = "TouristicProductItem"
    STOCK_ITEM = "StockItem"
    ORDER_ITEM = "OrderItem"


class StrictProperties(BaseModel):
    """Immutable base for one terminology-governed property contract."""

    model_config = ConfigDict(
        strict=True,
        extra="forbid",
        frozen=True,
        populate_by_name=False,
        serialize_by_alias=True,
    )


class FlexibleEntity(BaseModel):
    """Untrusted boundary representation before type-specific validation."""

    model_config = ConfigDict(strict=True, extra="forbid", frozen=True)

    entity_id: str = Field(alias="entityId", min_length=1, max_length=100)
    entity_kind: EntityKind = Field(alias="entityKind")
    type: str | None = None
    properties: Mapping[str, object]
    schema_version: int = Field(default=1, alias="schemaVersion", ge=1)

    @field_validator("entity_kind", mode="before")
    @classmethod
    def parse_governed_entity_kind(cls, value: object) -> EntityKind:
        if isinstance(value, EntityKind):
            return value
        if type(value) is str:
            return EntityKind(value)
        raise ValueError("entityKind must be an exact governed string")

    @model_validator(mode="after")
    def reject_reserved_property_collisions(self) -> "FlexibleEntity":
        collisions = RESERVED_PROPERTY_NAMES.intersection(self.properties)
        if collisions:
            names = ", ".join(sorted(collisions))
            raise ValueError(f"reserved structural names cannot be flexible properties: {names}")
        object.__setattr__(self, "properties", MappingProxyType(dict(self.properties)))
        return self


class ValidatedEntity(BaseModel):
    """Immutable entity paired with its selected strict property model."""

    model_config = ConfigDict(arbitrary_types_allowed=True, frozen=True)

    entity_id: str
    entity_kind: EntityKind
    type: str | None
    properties: StrictProperties
    schema_version: int
