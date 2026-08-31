"""Pydantic validators for the seed source JSON files (sources/*.json).

This layer validates only the SHAPE of the seed-authoring input (types,
structure, obviously-malformed strings) so a mistake in the JSON fails fast
with a seed-specific error message. The property VALUES themselves
(roomTypeCode, flightNumber, ...) are authoritatively
validated a second time when the orchestrator calls the real module
service.py functions, through the registry's StrictProperties contracts --
per implementation.md, "the registry and entity contracts are the
authoritative input for issue #12; seed data must not recreate property
rules." This module never re-implements that validation.
"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

SEED_SCHEMA_VERSION = 1


class SeedModel(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)


class PersonRoleSeed(SeedModel):
    entity_id: str = Field(alias="entityId", min_length=1)
    type: str = Field(min_length=1)
    properties: dict[str, object] = Field(default_factory=dict)


class PersonSeed(SeedModel):
    entity_id: str = Field(alias="entityId", min_length=1)
    properties: dict[str, object]
    roles: list[PersonRoleSeed] = Field(min_length=1)
    source_scenario: str = Field(alias="sourceScenario")


class PersonsFile(SeedModel):
    schema_version: int = Field(alias="schemaVersion")
    persons: list[PersonSeed]


class OrgaRoleSeed(SeedModel):
    entity_id: str = Field(alias="entityId", min_length=1)
    type: str = Field(min_length=1)
    properties: dict[str, object] = Field(default_factory=dict)


class OrganisationSeed(SeedModel):
    entity_id: str = Field(alias="entityId", min_length=1)
    properties: dict[str, object]
    role: OrgaRoleSeed
    reserve: bool


class OrganisationsFile(SeedModel):
    schema_version: int = Field(alias="schemaVersion")
    organisations: list[OrganisationSeed]


class ProductSeed(SeedModel):
    entity_id: str = Field(alias="entityId", min_length=1)
    type: str = Field(min_length=1)
    properties: dict[str, object]
    supplier_role_id: str | None = Field(default=None, alias="supplierRoleId", min_length=1)
    parent_product_id: str | None = Field(default=None, alias="parentProductId")
    reserve: bool


class ProductsFile(SeedModel):
    schema_version: int = Field(alias="schemaVersion")
    products: list[ProductSeed]


class OrderPositionSeed(SeedModel):
    entity_id: str = Field(alias="entityId", min_length=1)
    product_id: str = Field(alias="productId", min_length=1)
    service_date: str = Field(alias="serviceDate", pattern=r"^\d{4}-\d{2}-\d{2}$")
    traveller_person_role_ids: list[str] = Field(alias="travellerPersonRoleIds", min_length=1)


class OrderSeed(SeedModel):
    entity_id: str = Field(alias="entityId", min_length=1)
    properties: dict[str, object]
    customer_person_role_id: str = Field(alias="customerPersonRoleId", min_length=1)
    positions: list[OrderPositionSeed] = Field(min_length=1)
    source_scenario: str = Field(alias="sourceScenario")


class OrdersFile(SeedModel):
    schema_version: int = Field(alias="schemaVersion")
    orders: list[OrderSeed]

