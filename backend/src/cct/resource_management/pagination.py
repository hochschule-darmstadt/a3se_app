"""Keyset pagination shared by every list operation, ordered by entityId."""

from __future__ import annotations

import base64
from dataclasses import dataclass
from typing import Generic, TypeVar

MIN_LIMIT = 1
MAX_LIMIT = 100
DEFAULT_LIMIT = 20

T = TypeVar("T")


@dataclass(frozen=True, slots=True)
class PageRequest:
    limit: int = DEFAULT_LIMIT
    after: str | None = None

    def __post_init__(self) -> None:
        if not MIN_LIMIT <= self.limit <= MAX_LIMIT:
            raise ValueError(f"limit must be between {MIN_LIMIT} and {MAX_LIMIT}: {self.limit}")


@dataclass(frozen=True, slots=True)
class PageResult(Generic[T]):
    items: tuple[T, ...]
    next_cursor: str | None


def encode_cursor(last_entity_id: str) -> str:
    return base64.urlsafe_b64encode(last_entity_id.encode("utf-8")).decode("ascii")


def decode_cursor(cursor: str) -> str:
    try:
        return base64.urlsafe_b64decode(cursor.encode("ascii")).decode("utf-8")
    except (ValueError, UnicodeDecodeError) as error:
        raise ValueError(f"invalid pagination cursor: {cursor}") from error
