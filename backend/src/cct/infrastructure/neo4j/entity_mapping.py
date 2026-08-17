"""Loss-aware mapping between validated entities and Neo4j node properties."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, time
from decimal import Decimal
from typing import Final

from cct.resource_management.contracts import EntityKind, ValidatedEntity
from cct.resource_management.registry import EntityTypeRegistry


LABELS: Final = {kind: kind.value for kind in EntityKind}
STRUCTURAL_KEYS: Final = {"entityId", "entityKind", "type", "schemaVersion", "decimalPropertyKeys"}


class UnsupportedNeo4jProperty(TypeError):
    """Raised instead of silently serializing a value Neo4j cannot store."""


@dataclass(frozen=True, slots=True)
class NodeRecord:
    label: str
    properties: dict[str, object]


class Neo4jEntityMapper:
    def __init__(self, registry: EntityTypeRegistry) -> None:
        self._registry = registry

    def to_node(self, entity: ValidatedEntity) -> NodeRecord:
        flexible = entity.properties.model_dump(mode="python", by_alias=True, exclude_none=True)
        collisions = STRUCTURAL_KEYS.intersection(flexible)
        if collisions:
            raise UnsupportedNeo4jProperty(f"property collision: {sorted(collisions)}")
        decimal_keys: list[str] = []
        encoded: dict[str, object] = {}
        for key, value in flexible.items():
            if isinstance(value, Decimal):
                encoded[key] = format(value, "f")
                decimal_keys.append(key)
            else:
                encoded[key] = self._require_property_value(key, value)
        structural: dict[str, object] = {
            "entityId": entity.entity_id,
            "entityKind": entity.entity_kind.value,
            "schemaVersion": entity.schema_version,
        }
        if entity.type is not None:
            structural["type"] = entity.type
        if decimal_keys:
            structural["decimalPropertyKeys"] = sorted(decimal_keys)
        return NodeRecord(LABELS[entity.entity_kind], {**structural, **encoded})

    def from_node(self, record: NodeRecord) -> ValidatedEntity:
        expected_label = str(record.properties.get("entityKind"))
        if record.label != expected_label or record.label not in LABELS.values():
            raise ValueError(f"label/entityKind mismatch: {record.label}/{expected_label}")
        structural = {key: record.properties[key] for key in STRUCTURAL_KEYS if key in record.properties}
        flexible = {
            key: self._to_native(value)
            for key, value in record.properties.items()
            if key not in STRUCTURAL_KEYS
        }
        decimal_keys = structural.pop("decimalPropertyKeys", [])
        if not isinstance(decimal_keys, list) or not all(isinstance(key, str) for key in decimal_keys):
            raise ValueError("decimalPropertyKeys must be a homogeneous string list")
        for key in decimal_keys:
            if key not in flexible or not isinstance(flexible[key], str):
                raise ValueError(f"encoded decimal property is missing or not a string: {key}")
            flexible[key] = Decimal(flexible[key])
        return self._registry.restore(structural=structural, properties=flexible)

    @staticmethod
    def _to_native(value: object) -> object:
        """Convert Neo4j driver temporal wrapper types back to stdlib types."""
        if isinstance(value, list):
            return [Neo4jEntityMapper._to_native(item) for item in value]
        to_native = getattr(value, "to_native", None)
        return to_native() if callable(to_native) else value

    @staticmethod
    def _require_property_value(key: str, value: object) -> object:
        scalar = (bool, int, float, str, date, time, datetime)
        if isinstance(value, scalar):
            return value
        if isinstance(value, (list, tuple)):
            if not value:
                return []
            if any(item is None or not isinstance(item, scalar) for item in value):
                raise UnsupportedNeo4jProperty(f"unsupported list value for {key}")
            if len({type(item) for item in value}) != 1:
                raise UnsupportedNeo4jProperty(f"heterogeneous list value for {key}")
            return list(value)
        raise UnsupportedNeo4jProperty(f"unsupported Neo4j property {key}: {type(value).__name__}")

