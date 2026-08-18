"""Single source of truth for the accepted Neo4j relationship vocabulary."""

from __future__ import annotations

from enum import StrEnum


class RelationshipType(StrEnum):
    """Accepted edge types from DR-0012 and entity-model/implementation.md."""

    HAS_ROLE = "HAS_ROLE"
    CONTAINS = "CONTAINS"
    SUPPLIED_BY = "SUPPLIED_BY"
    REPRESENTS_PRODUCT = "REPRESENTS_PRODUCT"
    ALLOCATES_STOCK = "ALLOCATES_STOCK"
    CUSTOMER = "CUSTOMER"
    ASSIGNED_TRAVELLER = "ASSIGNED_TRAVELLER"


OWNERSHIP_RELATIONSHIP_TYPES = frozenset({RelationshipType.HAS_ROLE, RelationshipType.CONTAINS})
"""Edges where the source owns/nests the target (e.g. Person->PersonRole, header->position).

Delete protection is direction-sensitive for these: an outgoing ownership edge
blocks deleting the owner (its children must be removed first, one at a time —
no cascade), but an incoming ownership edge never blocks deleting the owned
item itself (that is exactly how a nested item is removed). Every other
relationship is a plain reference: it blocks deleting the node it points to
(incoming), never the node it points from (outgoing), since removing a
reference cannot orphan anything on the referencing side.
"""
