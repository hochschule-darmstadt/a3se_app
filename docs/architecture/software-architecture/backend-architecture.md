# Backend Architecture

- Status: accepted
- Owner: Architecture/Implementation
- Last reviewed: 2026-08-31

This document is the authoritative backend architecture for `backend/src/cct`.
It specifies the conventions already realized and the conventions every future
backend extension shall follow. It is the implementation companion to the
technology-neutral [modular software architecture](software-architecture.md),
the package mapping in [project-structure.md](project-structure.md), and the
accepted technology profile in
[DR-0010](../../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md).

The rules below extend issues #7–#9, #12, #18–#21, #28–#33, #50, #56, and
#57, and DR-0010, DR-0012, DR-0013, DR-0014, DR-0017, DR-0019, DR-0020, and
DR-0021. The documents and issues contain rationale and evidence; this
document states the conventions future code must follow. It does not replace
requirements, the terminology catalog, API contract, deployment architecture,
or decision records, and does not silently close an open decision.

## 1. Architectural principles

1. The initial runtime is a FastAPI modular monolith, but module ownership and
   interfaces preserve later service extraction, including a separately
   scalable or isolated AI component.
2. A physical Neo4j graph shared by modules does not create shared ownership.
   Each module owns its entities, writes, invariants, terminology contracts,
   and public application operations.
3. FastAPI and Neo4j are adapters. Business modules do not depend on request
   objects, routing, driver sessions, Cypher, or infrastructure details.
4. Flexible data is not untyped data: every entity is validated by one trusted,
   module-owned, versioned contract before persistence.
5. Cross-module behavior uses explicit public operations or bounded projections,
   never generic CRUD, raw graph access, or direct internal repositories.
6. Transaction, authorization, audit, and integrity rules remain between any
   caller—including a future agent—and business state.

## 2. Technology and runtime boundary

DR-0010 selects Python for modules, FastAPI as the HTTP adapter, Pydantic for
boundary/domain contracts, Neo4j Community Edition for the proof of concept,
and Docker localhost as the initial deployment boundary. The selected profile
exists because Python supports shared business/agent logic and Neo4j naturally
represents recursive, heterogeneous, multi-hop graph data. It remains subject
to its recorded validation and revisit triggers; this document does not claim
production readiness.

The initial deployment maps Customer and Staff frontends, the Python API
modular monolith, and Neo4j to documented Docker units. Deployment health,
ports, volumes, startup ordering, recovery, and production hosting belong to
the deployment architecture. Do not infer a production server, HA, horizontal
scaling, disaster recovery, or one-container-per-module design from this
document.

## 2.1 Capability ownership for delivered views

The Staff views do not own backend data. They consume the following resource
capabilities through the shared API; future endpoints must preserve this
ownership:

| Delivered view / issue | Owning backend capability |
|---|---|
| Staff home, #28 | Composition of read summaries; it must not become a second persistence model |
| Customers and travellers, #29 | Person Management owns `Person`/`PersonRole`, role lifecycle and payment-category validation |
| Suppliers and partners, #30 | Partner Management owns `Organisation`/`OrgaRole` and supplier relationships |
| Touristic product catalogue, #31 | Touristic Product Management owns recursive `TouristicProductItem` composition and supplier assignment |
| Inventory, #32 | Inventory owns dated `StockItem` capacity, availability and represented-product validation |
| Travel orders, #33 | Order Management owns headers/positions, customer/traveller links, stock allocation and order status |

The API may compose a read projection across these owners, but no view or
router may write another module's entity or bypass its service validation.

`backend/scripts/serve.py` is the composition root allowed to wire
`cct.api` to `cct.infrastructure`. OpenAPI export must work through
`create_app()` without a live database. Configuration and operator scripts stay
outside the installable `cct` namespace.

## 3. Module ownership and dependency direction

The accepted logical layers are Interaction, Core Business Processes, and
Resources. The Python mapping is maintained in `project-structure.md`; the
important future-code rules are:

- Interaction may call Core Business Processes or Resources.
- Core Business Processes may call Resources.
- Resources must not call Interaction, Core Business Processes, or adapters.
- Calls within a layer must remain acyclic.
- `cct.api` invokes application capabilities and never imports infrastructure.
- Only `cct.infrastructure.neo4j` imports the Neo4j driver.
- A module never imports another module's internal repository or persistence
  implementation.

The five Resources modules remain separate even though they share the
`cct.resource_management` namespace: Person Management, Partner Management,
Touristic Product Management, Inventory, and Order Management. Core Process
packages are Season Planning, Procurement, Touristic Product Design, Sales,
and Customer Care. Supporting Accounting, Reporting, and Human Resources are
external/cross-cutting contracts until use-case evidence justifies operations.

Static architecture tests parse imports, reject upward dependencies and
cycles, confine FastAPI/Neo4j imports, and require package READMEs. A package
addition must preserve those checks and document its ownership.

## 4. Module-internal layering and ports

An implemented resource module uses this direction:

```text
API adapter -> owning service.py -> EntityRepositoryPort
                         -> public service operation of another owner (only when needed)
EntityRepositoryPort <- infrastructure/neo4j adapter
```

`service.py` is the public application-operation boundary. `models.py` owns
the module's terminology-specific strict property contracts. The shared
`EntityRepositoryPort` is a narrow structural protocol implemented by the
Neo4j adapter and test fakes. `ScopedEntityRepository` restricts a composed
module to its allowed `EntityKind` values, so a service cannot write another
module's entities.

Cross-module graph reads are owned by the consuming use case and return a
named, bounded projection. For example, Sales may request availability context
across product, stock, and traveller entities, while the Neo4j adapter performs
the traversal. The consumer receives the declared projection, not a driver
session, generic query API, or foreign module model. The first implemented
PoC may use a direct public service call where DR-0013 permits it; adding a new
port or composition mechanism requires evidence that the current boundary is
insufficient.

## 5. Flexible entity contract

Every entity follows this validation pipeline:

```text
untrusted mapping
  -> FlexibleEntity
  -> EntityTypeRegistry[(entityKind, type)]
  -> module-owned StrictProperties
  -> immutable ValidatedEntity
```

`FlexibleEntity` contains `entityId`, `entityKind`, optional terminology-
governed `type`, `schemaVersion`, and an explicit `properties` map. Reserved
structural names cannot be reintroduced as flexible properties. The registry
is assembled by trusted code, has no untrusted runtime registration or dynamic
class creation, and fails closed for unknown types and keys.

The owning model defines required/optional properties, strict datatypes,
formats, units, cardinality, controlled values, and cross-property rules.
Models are frozen. Updates rebuild and fully revalidate a new entity; they do
not mutate a partially validated object. Missing and null are distinct; absent
optional values are omitted from Neo4j. `schemaVersion` changes only through a
reviewed, repeatable contract migration with revalidation.

The terminology catalog is the authority for canonical British-English keys,
namespaced type identifiers, coded values, external vocabulary mappings,
stable TERM IDs, extensions, versions, and deprecations. Standard terms are
not copied into a second registry. Unknown, wrongly typed, reserved, invalid,
or cross-property-inconsistent values fail explicitly.

## 6. Neo4j representation and relationships

Persist each entity as a node with the singular PascalCase label matching its
`EntityKind`: `Person`, `PersonRole`, `Organisation`, `OrgaRole`,
`TouristicProductItem`, `StockItem`, or `OrderItem`. Persist structural fields
and validated supported properties directly, using parameterized Cypher. Do
not use a JSON property blob, unrestricted nested map, runtime labels, or
caller-supplied relationship types.

Supported temporal values remain temporal. Because Neo4j has no exact decimal
property type, money amounts use canonical base-ten strings and the structural
`decimalPropertyKeys` marker so round-trip validation restores `Decimal`. Maps,
nested lists, heterogeneous lists, null list elements, and unsupported objects
fail unless a reviewed lossless mapping is added.

Relationships are the graph representation of `HAS_ROLE`, `CONTAINS`,
`SUPPLIED_BY`, `REPRESENTS_PRODUCT`, `ALLOCATES_STOCK`, `CUSTOMER`, and
`ASSIGNED_TRAVELLER`. Entity references and recursive composition are never
embedded as property maps. Product component reads are recursive but carry the
defensive `PRODUCT_COMPONENT_MAX_DEPTH` bound; this is not a business nesting
limit.

Community Edition uniqueness constraints protect `entityId`, and selected
direct lookup properties may be indexed. Because property existence/type,
node-key, and relationship-key constraints are unavailable in Community
Edition, application validation, managed transactions, schema-versioned
integrity checks, and integration tests remain mandatory.

## 7. Product, inventory, and terminology evolution

Product and OrgaRole family names use matching family segments. Structural
product children are nested below their parent type where the `CONTAINS`
relationship requires it. Stock types use `stock/` plus the complete suffix of
the represented lowest-level product type (DR-0017 and DR-0020). Do not create
an alias or silently retain a deprecated family name.

The #56 capacity convention is traveller-based: accommodation stock represents
room-type/date capacity and flight stock represents flight/date capacity;
individual seat/room products and nested flights are not the target MVP model.
`capacityQuantity` is original purchased capacity. `remainingCapacity` is the
persisted non-negative source of truth; `available` is derived as
`remainingCapacity > 0`. There must not be competing `heldQuantity`,
`allocatedQuantity`, and traveller-capacity calculations without an accepted
meaning and transaction rule.

## 8. Service operations, aggregates, and transactions

Services return validated entities, page results, bounded relationship lists,
or named projections. They do not return HTTP responses or expose persistence.
The API's aggregate/nested rules are explicit: Persons/roles, Organisations/
roles, recursive Products, StockItems, and Order headers/positions have only
the nested operations justified by their ownership and relationships. Inventory
withdrawal preserves historical references; deleting a referenced entity is a
conflict rather than silent detachment.

Validation occurs before opening a write transaction where possible. A normal
Neo4j write uses a driver-managed transaction and parameterized queries. A
cross-module reference is resolved through the owning module before the write;
a failed reference or relationship must not leave a dangling partial result.

For future allocation/order implementation, party-size checks, atomic
decrement/increment, rollback, idempotent repeated release/allocation, and
concurrent no-oversell behavior are required. A boolean availability field
alone cannot answer a party-size query. These claims require real Neo4j
transaction/concurrency evidence, not only fakes.

## 9. FastAPI HTTP adapter

`cct.api` uses one flat router module per resource family. A router owns HTTP
paths, transport Pydantic models, aliases, status codes, OpenAPI operation IDs,
dependency injection, and domain/transport conversion. It calls the owning
service and contains no business rule, Cypher, or driver access.

Transport models reject extra fields and may be lenient only where JSON must
represent ISO date/time or decimal strings. The strict owning domain contract
is applied again after transport conversion. Successful responses expose
explicit resource/projection models; write requests cannot supply computed
display fields.

List endpoints use deterministic keyset pagination ordered by entity ID, with
`limit` bounded from 1 to 100 (default 20), opaque cursor, and `nextCursor`.
Filters execute before pagination. Nested role/position collections are
owner-bounded lists. Bounded graph reads expose only fixed projections such as
product components and order detail; clients cannot supply labels,
relationships, or arbitrary queries.

The shared error contract is `{type, title, detail}`. Domain errors map to
404 not found, 409 duplicate/dependent/graph conflict, 422 request/domain/
reference validation, and 500 wiring/unexpected infrastructure failure.
Handlers do not leak tracebacks, driver messages, or internal query details.
Every mutating route carries the `Actor` dependency, but the current Actor is
a trusted PoC placeholder and is not authorization.

## 10. Computed read projections

`displayName` and `displayNameChain` are computed from current validated
properties, types, and relationships. They are read-only response fields,
never flexible properties, persisted nodes, or writable request fields.
`displayNameChain` is root-to-entity and the selected entity's own display name
is last. The API owns the semantic computation and returns the projection;
frontend code only formats it.

A projection must identify its owner, required cross-module context, bounded
traversal, invalid-graph behavior, and response shape. It must not become a
hidden second source of truth or generic graph-query service. DR-0019 governs
the current display-name projection contract.

## 11. Identifiers

Entity IDs are immutable references and are never authorization secrets. The
accepted/current repository policy for generated root IDs is the explicit
prefix registry and database-backed counter described in entity-model
implementation. The proposed DR-0021/#57 policy further specifies six-digit
per-family IDs (`PER`, `ROLE`, `ORG`, `OROLE`, `PRD`, `STK`, `ORD`), per-order
`-P##` position IDs, no reuse after deletion, acceptable gaps, overflow
rollback, and no separate order-number concept. Because DR-0021 remains
proposed, extensions must not claim those final details are accepted until the
decision is accepted; they must still not infer IDs from mutable business data
or rely on ID secrecy.

## 12. Deterministic seed and schema evolution

Seed sources are synthetic, reviewable, deterministic catalogs. The seed
loader validates all source data through the public terminology/registry and
then restores entities and relationships in dependency order. It is
idempotent, preserves explicit compatible seeded IDs, and supports fresh
reset/reseed for incompatible catalog changes. It must not duplicate domain
validation or introduce seed-only terms.

The seed process is not a general migration engine: source validation happens
before writes, but an unexpected infrastructure failure may leave a partial
run and is recovered by an idempotent rerun. A schema or vocabulary change
requires explicit versioning, reviewed migration/reseed policy, and updated
API/UI/tests; historical codes must not be silently reinterpreted.

The accepted PoC seed profile from DR-0014 is concrete: it uses synthetic
Person, PersonRole, Organisation, OrgaRole, recursive product, order header /
position, and dated/priced StockItem catalogs; generates applicable 2027
inventory from 2027-01-01 through 2027-12-31; includes deterministic zero and
non-zero availability; and preserves the distinction between reusable product
definitions and dated sellable stock. Representative portal resources may use
open-licensed images only when source page, creator/credit, exact licence,
attribution, verification date, meaningful alt text, deterministic selection,
and an unavailable-image fallback are recorded. Public accessibility alone is
not licence evidence, and an image must not imply a real supplier or endorse a
synthetic product.

The seed package is not a performance benchmark, does not make a partial
infrastructure failure atomic, and does not prove concurrent allocation. Those
limitations remain explicit and require separate evidence.

## 13. Testing and operational evidence

Backend tests remain outside production packages and mirror source boundaries.
Use unit tests for service rules, strict validation, repository scoping,
pagination, mapping, IDs, and errors; API tests for transport/OpenAPI/error
contracts; architecture tests for imports/acyclicity; and opt-in Neo4j tests
for real mapping, relationships, indexes, transactions, seed data, rollback,
and concurrency.

`npm run backend:check` compiles and runs the normal test suites. It does not
claim to run real Neo4j integration, Docker, backup/restore, performance, or
CI evidence. DR-0016 leaves agent tools, concurrent stock reservation,
rollback, Community Edition backup/recovery/observability/least privilege,
representative NFR-001/NFR-002 load, responsive evidence, and CI automation as
residual risks. New code must not mark those risks closed without the required
evidence.

## 14. Rules for future extensions

Before adding a module, entity type, property, relationship, service operation,
API field, projection, seed record, or persistence query:

1. Identify its owner, stable terminology/requirement IDs, use case, and
   affected decision records.
2. Check this document, `project-structure.md`, the terminology catalog, the
   API architecture, and entity-model implementation before inventing a
   pattern.
3. Add validation to the owning model/registry and keep transport validation
   separate from domain validation.
4. Preserve module direction, scoped repositories, bounded projections,
   explicit transactions, central error mapping, and generated API contracts.
5. Add unit, API, architecture, and real database evidence proportionate to
   the claim; never use a fake to prove database concurrency or operations.
6. Update this document when a convention becomes reusable, and create or
   revise a decision record for a consequential technology, data, transaction,
   security, or ownership choice.

## 15. Continuous realignment

This architecture is reconciled in the same change whenever module layering,
entity contracts, terminology, Neo4j mapping, service/transaction behavior,
API shape, projections, identifiers, seed conventions, or test boundaries
change. The implementation and tests provide realization evidence; accepted
requirements and decision records remain authoritative for intent, rationale,
and unresolved risk.

## Decision record index

[DR-0010](../../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md)
selects Python/FastAPI/Pydantic/Neo4j, controlled agent tools, and a modular
monolith with explicit revisit triggers.
[DR-0012](../../governance/decisions/0012-use-validated-property-registry-and-direct-neo4j-properties.md)
defines the immutable validated registry, direct Neo4j properties, decimal
mapping, supported values, constraints, and Community Edition compensations.
[DR-0013](../../governance/decisions/0013-shared-resource-crud-api-and-openapi-contract.md)
defines aggregate boundaries, repository scoping, bounded reads, errors,
pagination, transactions, and OpenAPI/TypeScript generation.
[DR-0014](../../governance/decisions/0014-deterministic-seed-data-and-compose-seeding.md)
defines deterministic synthetic seed catalogs, 2027 inventory, image evidence,
Compose integration, reset/reseed, and seed limitations.
[DR-0017](../../governance/decisions/0017-align-orgarole-and-touristicproductitem-type-families.md)
defines family-segment and structural-child naming alignment.
[DR-0019](../../governance/decisions/0019-compute-resource-display-projections.md)
defines non-persisted display-name and chain projections.
[DR-0020](../../governance/decisions/0020-align-stockitem-types-with-product-leaves.md)
defines StockItem type suffix alignment with represented product leaves.
[DR-0021](../../governance/decisions/0021-transaction-safe-prefixed-identifiers.md)
is the proposed source for the final generated-ID counter/prefix contract and
must be accepted before its unresolved details become normative.
