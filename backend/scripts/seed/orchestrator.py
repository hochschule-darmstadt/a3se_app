"""Composition root that loads the seed data into a real Neo4j instance.

Outside the `cct` package -- like `serve.py`, invisible to every
architecture test's static import scan (DR-0013) -- so it is free to import
`cct.infrastructure` directly. Unlike `serve.py` it never imports `cct.api`;
seeding only needs `cct.infrastructure` (the driver/schema) and
`cct.resource_management`'s module service functions, called exactly the
way the CRUD API itself calls them (`create_*` through a `ScopedEntityRepository`
per module) -- issue #12's "load through owning-module seed/application
interfaces rather than unrestricted cross-module database writes."

Load order (dependency order, matches `resource_management`'s own
cross-module call graph): persons/roles -> organisations/roles -> products
(parents before children, then supplier assignment) -> the 2027 flight/
room-category stock calendar -> orders (header, positions, stock
allocation, traveller/customer assignment). Every `create_*` call is wrapped
so a `DuplicateEntityError` on rerun is counted, not raised -- idempotent by
construction, since the services already provide that check.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, time

from neo4j import Driver

from cct.infrastructure.neo4j.entity_repository import COMMUNITY_SCHEMA, Neo4jEntityRepository
from cct.resource_management.contracts import EntityKind
from cct.resource_management.default_registry import create_entity_registry
from cct.resource_management.errors import DuplicateEntityError
from cct.resource_management.inventory import service as inventory_service
from cct.resource_management.order_management import service as order_service
from cct.resource_management.partner_management import service as partner_service
from cct.resource_management.person_management import service as person_service
from cct.resource_management.repository_ports import EntityRepositoryPort, ScopedEntityRepository
from cct.resource_management.touristic_product_management import service as product_service

from . import inventory
from .loader import SeedData, load_seed_data
from .schema import SEED_SCHEMA_VERSION

SEED_ID_PREFIXES = ("PER-", "SUP-", "FLT-", "ACC-", "MOB-", "WTR-", "EXP-", "OTH-", "ORD-", "STK-")

# JSON has no time/date literal; these product-property keys carry an
# ISO-8601 `hh:mm:ss` string in the source files and must become real
# `datetime.time` objects before FlightProperties (strict=True) will accept
# them -- the same string-vs-object gap DR-0013's API transport layer works
# around, but seed data calls the strict service directly, so it converts here.
TIME_PROPERTY_KEYS = frozenset({"scheduledDepartureLocalTime", "scheduledArrivalLocalTime"})


def _coerce_property_types(properties: dict[str, object]) -> dict[str, object]:
    coerced = dict(properties)
    for key in TIME_PROPERTY_KEYS:
        if key in coerced and isinstance(coerced[key], str):
            coerced[key] = time.fromisoformat(coerced[key])
    return coerced


@dataclass(frozen=True)
class SeedRepositories:
    person: EntityRepositoryPort
    partner: EntityRepositoryPort
    product: EntityRepositoryPort
    stock: EntityRepositoryPort
    order: EntityRepositoryPort


@dataclass
class SeedSummary:
    created: dict[str, int] = field(default_factory=dict)
    already_present: dict[str, int] = field(default_factory=dict)

    def record(self, kind: str, *, created: bool) -> None:
        bucket = self.created if created else self.already_present
        bucket[kind] = bucket.get(kind, 0) + 1

    def report(self) -> str:
        lines = [f"seed schema version {SEED_SCHEMA_VERSION}"]
        for kind in sorted(set(self.created) | set(self.already_present)):
            lines.append(
                f"  {kind}: created {self.created.get(kind, 0)}, already present {self.already_present.get(kind, 0)}"
            )
        return "\n".join(lines)


def build_repositories(driver: Driver, database: str) -> SeedRepositories:
    registry = create_entity_registry()
    repository = Neo4jEntityRepository(driver, database, registry)

    def scoped(*kinds: EntityKind) -> ScopedEntityRepository:
        return ScopedEntityRepository(repository, allowed_kinds=frozenset(kinds))

    return SeedRepositories(
        person=scoped(EntityKind.PERSON, EntityKind.PERSON_ROLE),
        partner=scoped(EntityKind.ORGANISATION, EntityKind.ORGA_ROLE),
        product=scoped(EntityKind.TOURISTIC_PRODUCT_ITEM),
        stock=scoped(EntityKind.STOCK_ITEM),
        order=scoped(EntityKind.ORDER_ITEM),
    )


def ensure_schema(driver: Driver, database: str) -> None:
    with driver.session(database=database) as session:
        for statement in COMMUNITY_SCHEMA:
            session.run(statement).consume()


def reset_seed_data(driver: Driver, database: str) -> None:
    """Delete only nodes whose entityId starts with a known seed prefix, in
    one transaction -- never a bare `MATCH (n) DETACH DELETE n`."""

    with driver.session(database=database) as session:
        session.run(
            "MATCH (n) WHERE any(prefix IN $prefixes WHERE n.entityId STARTS WITH prefix) "
            "DETACH DELETE n",
            prefixes=list(SEED_ID_PREFIXES),
        ).consume()


def _load_persons(repos: SeedRepositories, data: SeedData, summary: SeedSummary) -> None:
    for person in data.persons:
        try:
            person_service.create_person(repos.person, entity_id=person.entity_id, properties=person.properties)
            summary.record("Person", created=True)
        except DuplicateEntityError:
            summary.record("Person", created=False)
        for role in person.roles:
            try:
                person_service.create_person_role(
                    repos.person,
                    entity_id=role.entity_id,
                    person_id=person.entity_id,
                    type=role.type,
                    properties=role.properties,
                )
                summary.record("PersonRole", created=True)
            except DuplicateEntityError:
                summary.record("PersonRole", created=False)


def _load_organisations(repos: SeedRepositories, data: SeedData, summary: SeedSummary) -> None:
    for org in data.organisations:
        try:
            partner_service.create_organisation(repos.partner, entity_id=org.entity_id, properties=org.properties)
            summary.record("Organisation", created=True)
        except DuplicateEntityError:
            summary.record("Organisation", created=False)
        try:
            partner_service.create_orga_role(
                repos.partner,
                entity_id=org.role.entity_id,
                organisation_id=org.entity_id,
                type=org.role.type,
                properties=org.role.properties,
            )
            summary.record("OrgaRole", created=True)
        except DuplicateEntityError:
            summary.record("OrgaRole", created=False)


def _load_products(repos: SeedRepositories, data: SeedData, summary: SeedSummary) -> None:
    remaining = list(data.products)
    created_ids: set[str] = set()
    while remaining:
        progress = False
        next_remaining = []
        for product in remaining:
            if product.parent_product_id is not None and product.parent_product_id not in created_ids:
                next_remaining.append(product)
                continue
            properties = _coerce_property_types(product.properties)
            try:
                product_service.create_product(
                    repos.product,
                    entity_id=product.entity_id,
                    type=product.type,
                    properties=properties,
                    parent_product_id=product.parent_product_id,
                )
                summary.record("TouristicProductItem", created=True)
            except DuplicateEntityError:
                summary.record("TouristicProductItem", created=False)
            # create_relationship (SUPPLIED_BY here) is a Cypher MERGE, so it
            # is already idempotent on rerun and never raises
            # DuplicateEntityError -- no try/except needed. Supplier attaches
            # at the root of a catalogue tree only (stakeholder decision,
            # VIEW-S-003 tree-view follow-up); nested components (rooms,
            # seats, ...) inherit it via their ancestor chain instead of
            # each carrying their own supplierRoleId.
            if product.supplier_role_id is not None:
                product_service.set_supplier(
                    repos.product,
                    product.entity_id,
                    supplier_role_id=product.supplier_role_id,
                    partner_repository=repos.partner,
                )
            created_ids.add(product.entity_id)
            progress = True
        remaining = next_remaining
        if not progress and remaining:
            unresolved = [p.entity_id for p in remaining]
            raise RuntimeError(f"products with unresolved parentProductId: {unresolved}")


def _used_product_ids_by_type(data: SeedData) -> dict[str, list[str]]:
    """Lowest-level seat and room products used for dated stock."""

    products_by_id = {product.entity_id: product for product in data.products}
    by_type: dict[str, list[str]] = {}
    for product in data.products:
        if product.type not in {inventory.FLIGHT_TYPE, inventory.ROOM_CATEGORY_TYPE}:
            continue
        root = product
        while root.parent_product_id is not None:
            root = products_by_id[root.parent_product_id]
        if root.reserve:
            continue
        by_type.setdefault(product.type, []).append(product.entity_id)
    return by_type


def _guaranteed_dates(data: SeedData) -> set[tuple[str, date]]:
    guaranteed: set[tuple[str, date]] = set()
    for order in data.orders:
        for position in order.positions:
            guaranteed.add((position.product_id, date.fromisoformat(position.service_date)))
    return guaranteed


def _load_stock_calendar(
    repos: SeedRepositories, data: SeedData, summary: SeedSummary, *, start: date, end: date
) -> None:
    by_type = _used_product_ids_by_type(data)
    calendar_types = {inventory.FLIGHT_TYPE, inventory.ROOM_CATEGORY_TYPE}
    calendar_products = {t: ids for t, ids in by_type.items() if t in calendar_types}
    specs = inventory.generate_stock_specs(calendar_products, _guaranteed_dates(data), start=start, end=end)
    for spec in specs:
        try:
            inventory_service.create_stock_item(
                repos.stock,
                entity_id=spec.entity_id,
                type=spec.type,
                properties=spec.properties,
                product_id=spec.product_id,
                product_repository=repos.product,
            )
            summary.record("StockItem (calendar)", created=True)
        except DuplicateEntityError:
            summary.record("StockItem (calendar)", created=False)


def _load_orders(repos: SeedRepositories, data: SeedData, summary: SeedSummary) -> None:
    product_type_by_id = {p.entity_id: p.type for p in data.products}
    calendar_types = {inventory.FLIGHT_TYPE, inventory.ROOM_CATEGORY_TYPE}

    for order in data.orders:
        try:
            order_service.create_order(repos.order, entity_id=order.entity_id, properties=order.properties)
            summary.record("OrderItem (header)", created=True)
        except DuplicateEntityError:
            summary.record("OrderItem (header)", created=False)
        # CUSTOMER, like every create_relationship call below, is a Cypher
        # MERGE -- already idempotent, never raises DuplicateEntityError.
        order_service.assign_customer(
            repos.order,
            order.entity_id,
            customer_role_id=order.customer_person_role_id,
            person_repository=repos.person,
        )

        for position in order.positions:
            try:
                order_service.create_order_position(repos.order, entity_id=position.entity_id, order_id=order.entity_id)
                summary.record("OrderItem (position)", created=True)
            except DuplicateEntityError:
                summary.record("OrderItem (position)", created=False)

            product_type = product_type_by_id[position.product_id]
            service_date = date.fromisoformat(position.service_date)
            if product_type in calendar_types:
                stock_item_id = f"STK-{position.product_id}-{position.service_date}-U1"
            else:
                spec = inventory.ad_hoc_stock_spec(position.product_id, product_type, service_date)
                try:
                    inventory_service.create_stock_item(
                        repos.stock,
                        entity_id=spec.entity_id,
                        type=spec.type,
                        properties=spec.properties,
                        product_id=spec.product_id,
                        product_repository=repos.product,
                    )
                    summary.record("StockItem (ad hoc)", created=True)
                except DuplicateEntityError:
                    summary.record("StockItem (ad hoc)", created=False)
                stock_item_id = spec.entity_id

            order_service.allocate_stock(
                repos.order, position.entity_id, stock_item_id=stock_item_id, stock_repository=repos.stock
            )

            for traveller_role_id in position.traveller_person_role_ids:
                order_service.assign_traveller(
                    repos.order,
                    position.entity_id,
                    traveller_role_id=traveller_role_id,
                    person_repository=repos.person,
                )


def run_seed(
    repos: SeedRepositories,
    *,
    stock_calendar_start: date = inventory.START_2027,
    stock_calendar_end: date = inventory.END_2027,
) -> SeedSummary:
    """Validates every seed source, then loads it in dependency order.

    Raises before any write if a source is malformed, has a duplicate ID, or
    a dangling reference (loader.SeedValidationError) -- "validates
    configuration and all seed sources before mutation."
    """

    data = load_seed_data()
    summary = SeedSummary()
    _load_persons(repos, data, summary)
    _load_organisations(repos, data, summary)
    _load_products(repos, data, summary)
    _load_stock_calendar(repos, data, summary, start=stock_calendar_start, end=stock_calendar_end)
    _load_orders(repos, data, summary)
    return summary
