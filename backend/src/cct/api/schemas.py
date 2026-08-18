"""Shared transport schemas reused across every resource router."""

from __future__ import annotations

from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


def transport_properties_model(strict_model: type[BaseModel]) -> type[BaseModel]:
    """A JSON-transport-friendly sibling of a strict=True domain properties model.

    Domain property contracts are strict (DR-0012) so Python callers never get
    silent type coercion. JSON has no native date/time/decimal type, so a
    strict model can never accept the ISO-8601/decimal strings that are the
    only possible wire representation of those fields. Every request still
    re-validates against the real strict contract a second time inside the
    owning module's service (repository.save -> registry.validate), so
    relaxing strictness only here does not weaken domain validation -- it
    only lets JSON reach it at all. Patterns, lengths, and literal values
    (everything except bare type coercion) remain fully enforced.
    """
    return type(
        f"{strict_model.__name__}Transport",
        (strict_model,),
        {"model_config": ConfigDict(strict=False, extra="forbid", populate_by_name=True, serialize_by_alias=True)},
    )

DEFAULT_PAGE_LIMIT = 20
MIN_PAGE_LIMIT = 1
MAX_PAGE_LIMIT = 100


class ErrorResponse(BaseModel):
    """Consistent error contract distinguishing validation/business/conflict/infrastructure outcomes."""

    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    type: str = Field(description="Stable machine-readable error category, e.g. 'not_found'.")
    title: str = Field(description="Short human-readable summary.")
    detail: str = Field(description="Specific explanation for this occurrence.")


class PageParams(BaseModel):
    """Bounded keyset pagination query parameters."""

    limit: int = Field(default=DEFAULT_PAGE_LIMIT, ge=MIN_PAGE_LIMIT, le=MAX_PAGE_LIMIT)
    cursor: str | None = Field(default=None, description="Opaque cursor from a previous page's nextCursor.")


class Page(BaseModel, Generic[T]):
    """Generic page envelope; items are the resource-specific response model."""

    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    items: list[T]
    next_cursor: str | None = Field(default=None, alias="nextCursor")
