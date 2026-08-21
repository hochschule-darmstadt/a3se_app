"""Reads and cross-validates the seed source JSON files.

Two validation passes happen before any Neo4j write:
1. schema.py's Pydantic models catch structurally malformed JSON.
2. This module catches duplicate IDs (within one EntityKind's own namespace,
   matching the one-uniqueness-constraint-per-label Neo4j schema from
   DR-0012) and dangling references between the source files.

Both run in `load_seed_data()`, called once by the orchestrator before it
writes anything -- "validates configuration and all seed sources before
mutation" (issue #12's entry-point requirement).
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

from . import schema

SOURCES_DIR = Path(__file__).parent / "sources"


class SeedValidationError(Exception):
    """Raised for a duplicate ID or dangling reference found before any write."""


@dataclass(frozen=True)
class SeedData:
    persons: tuple[schema.PersonSeed, ...]
    organisations: tuple[schema.OrganisationSeed, ...]
    products: tuple[schema.ProductSeed, ...]
    orders: tuple[schema.OrderSeed, ...]
    images: tuple[schema.ImageSeed, ...]


def _read_json(name: str) -> dict[str, object]:
    path = SOURCES_DIR / name
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def _require_unique(ids: list[str], *, kind: str) -> None:
    seen: set[str] = set()
    duplicates: set[str] = set()
    for entity_id in ids:
        if entity_id in seen:
            duplicates.add(entity_id)
        seen.add(entity_id)
    if duplicates:
        raise SeedValidationError(f"duplicate {kind} entityId(s): {sorted(duplicates)}")


def _require_known(references: set[str], known: set[str], *, description: str) -> None:
    dangling = references - known
    if dangling:
        raise SeedValidationError(f"dangling reference(s) in {description}: {sorted(dangling)}")


def load_seed_data() -> SeedData:
    persons_file = schema.PersonsFile.model_validate(_read_json("persons.json"))
    organisations_file = schema.OrganisationsFile.model_validate(_read_json("organisations.json"))
    products_file = schema.ProductsFile.model_validate(_read_json("products.json"))
    orders_file = schema.OrdersFile.model_validate(_read_json("orders.json"))
    images_file = schema.ImagesFile.model_validate(_read_json("images.json"))

    for source in (persons_file, organisations_file, products_file, orders_file, images_file):
        if source.schema_version != schema.SEED_SCHEMA_VERSION:
            raise SeedValidationError(
                f"unsupported seed source schemaVersion: {source.schema_version}"
                f" (expected {schema.SEED_SCHEMA_VERSION})"
            )

    _require_unique([p.entity_id for p in persons_file.persons], kind="Person")
    person_role_ids = [role.entity_id for p in persons_file.persons for role in p.roles]
    _require_unique(person_role_ids, kind="PersonRole")

    _require_unique([o.entity_id for o in organisations_file.organisations], kind="Organisation")
    _require_unique([o.role.entity_id for o in organisations_file.organisations], kind="OrgaRole")

    _require_unique([p.entity_id for p in products_file.products], kind="TouristicProductItem")

    order_item_ids = [o.entity_id for o in orders_file.orders]
    order_item_ids += [pos.entity_id for o in orders_file.orders for pos in o.positions]
    _require_unique(order_item_ids, kind="OrderItem")

    _require_unique([i.product_id for i in images_file.images], kind="image (one per productId)")

    known_product_ids = {p.entity_id for p in products_file.products}
    known_orga_role_ids = {o.role.entity_id for o in organisations_file.organisations}
    known_person_role_ids = set(person_role_ids)
    role_types = {role.entity_id: role.type for person in persons_file.persons for role in person.roles}

    _require_known(
        {p.supplier_role_id for p in products_file.products if p.supplier_role_id is not None},
        known_orga_role_ids,
        description="products.supplierRoleId",
    )
    invalid_customers = sorted(o.customer_person_role_id for o in orders_file.orders if role_types.get(o.customer_person_role_id) != "person/customer")
    if invalid_customers:
        raise SeedValidationError(f"orders.customerPersonRoleId must reference person/customer roles: {invalid_customers}")
    _require_known(
        {p.parent_product_id for p in products_file.products if p.parent_product_id is not None},
        known_product_ids,
        description="products.parentProductId",
    )
    _require_known(
        {o.customer_person_role_id for o in orders_file.orders},
        known_person_role_ids,
        description="orders.customerPersonRoleId",
    )
    position_product_ids = {pos.product_id for o in orders_file.orders for pos in o.positions}
    _require_known(position_product_ids, known_product_ids, description="orders.positions.productId")
    position_traveller_ids = {
        traveller_id for o in orders_file.orders for pos in o.positions for traveller_id in pos.traveller_person_role_ids
    }
    _require_known(
        position_traveller_ids, known_person_role_ids, description="orders.positions.travellerPersonRoleIds"
    )
    invalid_travellers = sorted(role_id for role_id in position_traveller_ids if role_types.get(role_id) != "person/traveller")
    if invalid_travellers:
        raise SeedValidationError(f"orders.positions.travellerPersonRoleIds must reference person/traveller roles: {invalid_travellers}")
    parent_ids = {p.parent_product_id for p in products_file.products if p.parent_product_id is not None}
    non_leaf_products = sorted(position_product_ids & parent_ids)
    if non_leaf_products:
        raise SeedValidationError(f"orders.positions.productId must reference leaf products: {non_leaf_products}")
    _require_known(
        {i.product_id for i in images_file.images}, known_product_ids, description="images.productId"
    )

    return SeedData(
        persons=tuple(persons_file.persons),
        organisations=tuple(organisations_file.organisations),
        products=tuple(products_file.products),
        orders=tuple(orders_file.orders),
        images=tuple(images_file.images),
    )
