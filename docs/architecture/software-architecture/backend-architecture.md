# Backend Architecture

- Status: accepted
- Owner: Architecture/Implementation
- Last reviewed: 2026-08-31

This document is the authoritative backend architecture for `backend/src/cct`.
It specifies conventions currently realized and conventions that future
backend extensions must follow. It complements the
technology-neutral [modular software architecture](software-architecture.md),
the package mapping and dependency rules in [project
structure](project-structure.md), and the technology rationale in
[DR-0010](../../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md).
It documents implementation guidance and does not introduce a new architecture
choice. A future extension may challenge this guidance only with code, test,
and architecture evidence and, where the choice is consequential, a decision
record.

## Runtime and module boundaries

The installable `cct` package is a FastAPI modular monolith. `cct.api` is the
HTTP adapter; resource-management and core-process packages contain application
behavior; `cct.infrastructure.neo4j` contains the Neo4j adapter. The
composition script `backend/scripts/serve.py` is the deliberate wiring point
between API and infrastructure. Directory and namespace ownership remain
defined once in [project-structure.md](project-structure.md), rather than
being repeated here.

The static architecture tests enforce the realized boundaries: resource
modules do not import API, core-process, or infrastructure code; core-process
modules do not import API or infrastructure; API does not import
infrastructure; Neo4j driver imports stay in the Neo4j adapter; and internal
module dependencies remain acyclic. A module does not import another module's
repository or persistence implementation.

## Module-internal layering

An implemented resource module exposes application operations through its
`service.py`. Its `models.py` owns terminology-specific strict property
contracts where needed. Repository access is expressed through the shared
`EntityRepositoryPort` protocol, while `ScopedEntityRepository` restricts a
module to its owned `EntityKind` values. This gives unit-testable services a
stable port without importing Neo4j or FastAPI.

The service validates references and business-level graph conditions, calls
other modules only through their public service functions when an implemented
use case requires it, and delegates persistence to the repository port. A
cross-module read is narrow and consumer-shaped; it does not expose a generic
CRUD or database-session escape hatch. The broader cross-module graph-access
rule and ownership examples are authoritative in
[project-structure.md](project-structure.md).

The Neo4j repository validates a flexible candidate through the controlled
entity-type registry, maps it to a Neo4j node, and performs the write using a
driver-managed write transaction. Reads map database records back to
`ValidatedEntity`. Recursive product reads have the defensive
`PRODUCT_COMPONENT_MAX_DEPTH` bound; this is a protection against unbounded
traversal, not a declared business nesting limit.

## FastAPI adapter conventions

`cct.api` has one flat router module per resource family. Routers define HTTP
paths, transport models, status codes, OpenAPI operation IDs, dependency
injection, and conversion between transport and domain shapes. They call the
owning service and do not implement persistence or business rules.

Request models are explicit Pydantic models with forbidden extra fields and
aliases matching the JSON contract. Strict domain property models are paired
with lenient transport siblings only where JSON must carry values such as ISO
dates, times, or decimals; the owning service/repository validates the
converted domain shape again. List endpoints use the shared bounded keyset
page (`limit` plus opaque cursor) and return a typed `{items, nextCursor}`
envelope.

The app factory registers exception handlers and routers without requiring a
live database, so OpenAPI export and isolated API tests can run without
runtime composition. Dependencies obtain module-scoped repositories from
`request.app.state.dependencies`. The `Actor` dependency is currently a
trusted PoC placeholder from [DR-0013](../../governance/decisions/0013-shared-resource-crud-api-and-openapi-contract.md),
not production authorization.

## Errors and result shapes

Services return validated entities, page results, bounded relationship
collections, or explicitly shaped projections. They raise typed domain errors
such as `EntityNotFoundError`, `DuplicateEntityError`,
`InvalidReferenceError`, `InvalidEntityGraphError`, and
`DependentEntityExistsError`; they do not return ad-hoc HTTP responses.

The API error handler maps validation, not-found, conflict, and unexpected or
infrastructure outcomes to the stable `ErrorResponse` fields `type`, `title`,
and `detail`. Tracebacks, driver messages, and other internals are not exposed
to callers. The frontend's `ApiError` normalization intentionally mirrors
these categories.

Relationship and display-name endpoints return bounded projections assembled
from current graph state. Computed display names and chains are not persisted;
their ownership and transport shape are defined by
[DR-0019](../../governance/decisions/0019-compute-resource-display-projections.md).

## Testing conventions

Backend tests are separate from production packages and mirror the source
boundaries. Unit tests cover service rules, repository scoping, pagination,
flexible-entity validation, mapping, and error behavior. API tests use
FastAPI's test client with dependency overrides to verify transport and
OpenAPI contracts. Architecture tests parse imports and verify layer direction,
Neo4j/ FastAPI confinement, acyclicity, scoped package documentation, and
repository access boundaries. Neo4j integration tests are opt-in and exercise
the real adapter and seeded data when a database is available.

`npm run backend:check` compiles the source and tests and runs the backend unit,
architecture, and API test discovery. Integration tests are not implied by
that command; their runtime prerequisites and limitations are documented in
the integration test README and the applicable decision records.

## Extension rules and issue traceability

The logical module boundaries from #7 remain independent of processes and
containers; #8's Docker localhost topology does not imply production hosting
or one container per module. Every entity has one owning Resources or Core
Business module as established by #9. Cross-module reads are named, bounded,
consumer-shaped projections; they never grant raw Neo4j or generic CRUD access.

The flexible entity boundary is:

```text
untrusted mapping -> FlexibleEntity -> EntityTypeRegistry[(entityKind, type)]
-> module-owned StrictProperties -> immutable ValidatedEntity
```

Structural fields and reserved-property rules belong to the shared contracts;
type-specific required/optional keys, datatypes, coded values, and
cross-property validation belong to the owning `models.py`. Updates rebuild and
revalidate the complete entity. Seed generators consume this catalog and must
not create a second validation system (#12, #18, #20).

The API remains a shared, capability-oriented FastAPI adapter. Routers expose
explicit transport models, operation IDs, success/error schemas, bounded
relationship reads, and the `items`/`nextCursor` keyset page. They do not expose
labels, Cypher, raw graph traversal, or internal repositories. API/domain
contract changes regenerate and validate OpenAPI and the TypeScript client in
the same change (#21).

Errors remain typed in services and are mapped centrally to `ErrorResponse`
(`type`, `title`, `detail`). Validation occurs before writes; relationship
targets are checked by their owning service; integrity-protecting deletes
return conflicts or withdraw inventory rather than leaving dangling history.
Computed display names/chains are read-only projections, never persisted
properties (#50).

For future inventory and order work, `capacityQuantity` is purchased capacity
and `remainingCapacity` is the mutable non-negative source of truth;
`available` is derived. Allocation must be party-size aware, atomic,
idempotent, and rollback-safe. Stock references flight or room-type products,
not individual seats/rooms or nested flights (#56). Staff-created root IDs use
the explicit per-family prefix registry and six-digit counter; order positions
use a per-order `-P##` sequence. Counters are allocated in the same write
transaction, are not reused after deletion, and are not reset on normal
startup once the proposed policy is accepted (#57, [DR-0021](../../governance/decisions/0021-transaction-safe-prefixed-identifiers.md)).

Seed data remains deterministic and synthetic. Incompatible catalog changes
use fresh reseeding rather than an invented in-place migration. Standard
vocabulary mappings, extensions, deprecated terms, and validation examples
remain authoritative in the terminology catalog.

New resource behavior needs unit, API-contract, architecture, and—where claims
depend on database behavior—real Neo4j integration evidence. Concurrency,
rollback, indexes, backup, and operational claims cannot be discharged by
fakes alone.

| Issues | Conventions carried forward |
|---|---|
| #7, #8, #9 | Acyclic modules, deployment separation, one owning module per entity, and logical/physical boundary |
| #12, #18 | Deterministic synthetic seed data and one authoritative terminology catalog |
| #19, #20 | `src` layout, test boundaries, validated flexible entities, direct Neo4j properties, recursive mapping |
| #21 | FastAPI CRUD boundary, OpenAPI/client contract, bounded reads, errors, pagination, scoping, and transactions |
| #28–#33 | Backend capabilities supporting Staff MVP resources, inventory, and travel orders |
| #50, #56, #57 | Computed projections, traveller-based capacity, and transaction-safe prefixed identifiers |

## Continuous realignment

This architecture must be reconciled when module layering, service
or repository conventions, API adapters, error mappings, or test boundaries
change. The change workflow requires implementation, tests, and this document
(plus any affected architecture or decision link) to be realigned in the same
coherent change. An incidental one-off should not be promoted to a convention
without evidence of intentional reuse.

## Authority and limitations

The current implementation and its tests are the source for the realized
claims above. Accepted requirements, decisions, and the technology-neutral
architecture remain authoritative for intent and rationale. This document
does not claim that untested residual risks are closed: transactional stock
reservation under concurrency, backup/recovery and operational Neo4j evidence,
representative performance, least privilege, agent-facing tooling, and CI
automation remain open as recorded in [DR-0016](../../governance/decisions/0016-poc-technology-confirmation-with-residual-risk.md).
