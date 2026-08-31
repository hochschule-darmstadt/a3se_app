"""The staff-facing identifier policy.

Generated identifiers are deliberately owned by the persistence adapter.  The
registry is kept here so prefixes cannot be inferred from mutable display data.
"""

from __future__ import annotations

from typing import Final

from .contracts import EntityKind

ID_WIDTH: Final = 6
MAX_ID_NUMBER: Final = 10**ID_WIDTH - 1

ENTITY_PREFIXES: Final = {
    EntityKind.PERSON: "PER",
    EntityKind.PERSON_ROLE: "ROLE",
    EntityKind.ORGANISATION: "ORG",
    EntityKind.ORGA_ROLE: "OROLE",
    EntityKind.TOURISTIC_PRODUCT_ITEM: "PRD",
    EntityKind.STOCK_ITEM: "STK",
    EntityKind.ORDER_ITEM: "ORD",
}


def format_entity_id(entity_kind: EntityKind, number: int) -> str:
    """Format one validated sequence value as a staff-facing identifier."""
    if not 1 <= number <= MAX_ID_NUMBER:
        raise ValueError(f"identifier sequence overflow for {entity_kind.value}")
    return f"{ENTITY_PREFIXES[entity_kind]}-{number:0{ID_WIDTH}d}"


def format_position_id(order_id: str, number: int) -> str:
    """Format a child order position without consuming the order sequence."""
    if not 1 <= number <= 99:
        raise ValueError("order position sequence overflow")
    return f"{order_id}-P{number:02d}"
