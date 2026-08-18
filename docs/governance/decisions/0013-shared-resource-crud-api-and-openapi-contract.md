# DR-0013: Shared resource CRUD API, aggregate boundaries, and generated TypeScript client

- Status: accepted
- Owner: Architecture/Implementation
- Date: 2026-08-18
- Supersedes: none

## Context

Issue #21 builds the FastAPI CRUD surface both Customer and Staff Interaction
share, over the flexible entity model and Neo4j mapping DR-0012 accepted for
issue #20. Several consequential questions had no prior answer: which objects
are aggregate roots versus nested items, who writes which relationship and
how a cross-module reference gets validated, what happens when a delete would
orphan a reference, how pagination is bounded, how the transport boundary
survives contact with `strict=True` domain contracts, and which tool
generates the TypeScript client `frontend/packages/api-client` has been
scaffolded for since issue #19.

FastAPI 0.141.1, uvicorn 0.52.3, and httpx 0.28.1 (test-only) were evaluated
on 2026-08-18 against the current PyPI registry: MIT/BSD-3-Clause/BSD-3-Clause
respectively, no licence fee, satisfying NFR-003.

A first implementation draft introduced a new top-level `cct.bootstrap`
package and a `Protocol`-per-cross-module-dependency ("ports") pattern to
route runtime wiring and cross-module reads around
`cct.api`'s existing, already-accepted inability to import
`cct.infrastructure` (`backend/tests/architecture/test_dependencies.py`,
from issue #19). Review found this over-engineered relative to what the
codebase's own conventions already permit and correspondingly simplified the
design below; see "Rejected alternatives."

## Options considered

| Concern | Option | Result |
|---|---|---|
| Nested-item deletion | Block delete on any relationship touching the node, either direction | Rejected: deadlocks a nested item against its own parent (a role can never be deleted while its owning Person exists, and the Person can't be deleted while the role exists) |
| Nested-item deletion | Direction-sensitive: outgoing ownership edges block the owner, incoming reference edges block the referenced node | Accepted: no cascade, no deadlock, one uniform rule from the relationship vocabulary's own ownership/reference split |
| Runtime composition | New top-level `cct.bootstrap` package, `ScopedEntityRepository` injected via `Protocol` ports per cross-module dependency | Rejected as first drafted: adds a package and multiple interfaces to work around a constraint a much smaller change already satisfies |
| Runtime composition | `backend/scripts/serve.py` (outside `cct`, invisible to every architecture test) builds the real repositories; `create_app()` takes zero required arguments | Accepted: the one file in the repository allowed to see both `cct.api` and `cct.infrastructure`, with no new package |
| Cross-module reference validation | Bespoke `Protocol` port per relationship, wired by the composition root | Rejected as first drafted: more ceremony than five small pairwise dependencies need |
| Cross-module reference validation | Direct call to the owning module's own `service.py` function (e.g. `partner_management.service.get_orga_role`) | Accepted: the architecture test already permits it (only `_internal`/`persistence`/`repository`-named path segments are blocked cross-module); this is the concrete "provided interface" `project-structure.md` left unnamed |
| JSON transport for `strict=True` contracts | Reuse the domain `StrictProperties` subclass directly as the request field type | Rejected for `FlightProperties`/`StockProperties`: Pydantic strict mode rejects the ISO-8601/decimal-as-string values that are JSON's only possible wire representation of `time`/`date`/`Decimal`, so a strict field can never receive it over HTTP |
| JSON transport for `strict=True` contracts | A lenient transport sibling (`schemas.transport_properties_model`): same subclass, `strict=False`, still `extra="forbid"` so patterns/lengths/literals stay enforced | Accepted; every request still revalidates through the real strict contract a second time inside the owning module's service, so relaxing strictness only at this boundary does not weaken domain validation |
| TypeScript codegen | `openapi-generator` | Rejected: requires a JVM toolchain the repository doesn't otherwise have, for a types-only need |
| TypeScript codegen | `orval` | Rejected: generates an opinionated runtime SDK (React Query hooks, its own HTTP client) that risks becoming a de facto domain/state layer, contradicting `typescript.md`'s "transport types shall not become domain models by convenience" |
| TypeScript codegen | `openapi-typescript` (types only) + a fully hand-rolled generic fetch client | Rejected: reimplementing typed path/param/body inference by hand duplicates a small, solved problem with real correctness risk |
| TypeScript codegen | `openapi-typescript` (types only) + `openapi-fetch` (the same maintainers' ~6&nbsp;KB, zero-config, dependency-minimal typed fetch client) as the runtime under a small hand-authored facade | Accepted: no per-operation generated methods, no opinionated abstractions, matches the scaffold's own "generated client code and its small authored facade" |

## Decision

### Aggregate roots and nested items

| Resource family | Aggregate root | Nested item | Root path | Nested path |
|---|---|---|---|---|
| Person Management | `Person` | `PersonRole` | `/persons/{personId}` | `/persons/{personId}/roles/{roleId}` |
| Partner Management | `Organisation` | `OrgaRole` | `/organisations/{organisationId}` | `/organisations/{organisationId}/roles/{roleId}` |
| Touristic Product Management | `TouristicProductItem` | recursive `TouristicProductItem` via `CONTAINS` | `/products/{productId}` | read as a full tree at `/products/{productId}/components` |
| Inventory | `StockItem` | none (independently root-addressable) | `/stock-items/{stockItemId}` | -- |
| Order Management | `OrderItem` (`order/header`) | `OrderItem` (`order/position`) | `/orders/{orderId}` | `/orders/{orderId}/positions/{positionId}` |

`CONTAINS` composition under Touristic Product Management is genuinely
recursive to an arbitrary practical depth -- a package containing a flight,
accommodation, and excursion, where the excursion itself contains insurance,
is a real expected shape, not just the flight-with-seats/
room-category-with-rooms simple cases already proven in #20. `GET
/products/{productId}/components` returns the full subtree via a
variable-length `[:CONTAINS*1..PRODUCT_COMPONENT_MAX_DEPTH]` Cypher pattern
(`entity_repository.py`; current value 10) -- a defensive cap against
pathological/cyclic data, not a claimed business limit on package nesting
(Neo4j requires the bound to be a literal integer in the pattern, not a
parameter).

`GET /orders/{orderId}/detail` returns the header plus each position's
resolved bounded summary (`stockItemId`, `productId`,
`supplierOrganisationId`, `travellerPersonId` -- ids only, never a raw node or
graph payload), implementing the traversal originally sketched but unused in
#20 as `ORDER_FULFILMENT_TRAVERSAL`, renamed `ORDER_DETAIL_TRAVERSAL` since
"fulfilment" is not a term this project's glossary or terminology use and was
introduced ungrounded in an earlier planning draft.

### Relationship write ownership

Same-module edges (`HAS_ROLE`, `CONTAINS`) need no cross-module validation.
Cross-module edges validate the far side by calling the owning module's own
`service.py` function directly before writing:

| Relationship | Writer | Validated via |
|---|---|---|
| `SUPPLIED_BY` (Product → OrgaRole) | Touristic Product Management | `partner_management.service.get_orga_role` |
| `REPRESENTS_PRODUCT` (StockItem → Product) | Inventory | `touristic_product_management.service.get_product` |
| `ALLOCATES_STOCK` (position → StockItem) | Order Management | `inventory.service.get_stock_item` |
| `CUSTOMER` / `ASSIGNED_TRAVELLER` (header/position → PersonRole) | Order Management | `person_management.service.get_person_role` |

### Delete policy

No cascade anywhere. A relationship blocks deletion of node N if, and only
if, either: (a) it is **outgoing** from N and is an ownership-type edge
(`HAS_ROLE`, `CONTAINS` -- N still owns a child, which must be deleted first,
one at a time), or (b) it is **incoming** to N and is a reference-type edge
(`SUPPLIED_BY`, `REPRESENTS_PRODUCT`, `ALLOCATES_STOCK`, `CUSTOMER`,
`ASSIGNED_TRAVELLER` -- something else depends on N). An incoming ownership
edge (N's own link from its parent) never blocks deleting N -- that is
exactly how a nested item is removed -- and an outgoing reference edge never
blocks deleting N, since removing N's own reference cannot orphan anything on
the referencing side. `RelationshipType.OWNERSHIP_RELATIONSHIP_TYPES`
(`relationship_types.py`) is the single source of truth for this
classification; `Neo4jEntityRepository._delete_node` checks both directions
in the same managed transaction and uses `DETACH DELETE` (a permitted
incoming ownership edge may still be present and must be removed with the
node). Violations return HTTP 409 with the blocking `{relationshipType,
count}` pairs.

### Pagination

Keyset, ordered by the already-uniquely-constrained `entityId`; `limit`
bounded `[1, 100]`, default 20; opaque base64 cursor
(`pagination.encode_cursor`/`decode_cursor`), encoded/decoded only at the
`cct.api` boundary -- `PageRequest.after`/`PageResult.next_cursor` carry the
raw `entityId` through the repository/service layers. Nested collections
(roles under a Person/Organisation, positions under an Order) are bounded by
their owner and returned as a plain list, deliberately not paginated.

### Module-write enforcement

`ScopedEntityRepository` (`repository_ports.py`) wraps the shared repository,
allow-listing the `EntityKind`s one module's `service.py` may read, write, or
delete, raising `PermissionError` otherwise. One instance per module is built
in `backend/scripts/serve.py` and injected; this is the concrete,
unit-tested (`test_repository_scoping.py`) answer to "modules do not write
another module's owned entities," since the underlying repository's
`save`/`delete` are entity-kind-agnostic and the static import-graph test
alone cannot prove it.

### Runtime wiring

`cct/api/app.py` exposes `create_app() -> FastAPI` with zero required
arguments; route dependencies (`cct/api/dependencies.py`) read services from
`request.app.state.dependencies` (a plain `ApiDependencies` dataclass,
unset by default). `backend/scripts/serve.py` -- outside the `cct` package
and therefore outside every architecture test's import scan -- builds the
real Neo4j driver, registry, one `ScopedEntityRepository` per module, sets
`app.state.dependencies`, and runs uvicorn; it is the only file in the
repository allowed to import both `cct.api` and `cct.infrastructure`.
`backend/scripts/export_openapi.py` calls `create_app()` with no dependencies
at all -- FastAPI's `.openapi()` only introspects route signatures, it never
executes `Depends(...)`, so schema export needs no live database. Tests call
`create_app()` and use `app.dependency_overrides` per `fastapi.md`'s
explicit-override rule.

### Error contract

`cct/api/schemas.ErrorResponse` (`type`, `title`, `detail`) is the one shape
every error response uses. `cct/api/errors.py` registers handlers mapping:
`EntityNotFoundError` → 404, `DuplicateEntityError` → 409,
`DependentEntityExistsError` → 409, `InvalidReferenceError` → 422,
`RequestValidationError` (FastAPI's own, overriding its default
`HTTPValidationError` shape) and the domain `pydantic.ValidationError` and
plain `ValueError` → 422, `PermissionError` (a `ScopedEntityRepository`
wiring bug, never caller-triggerable) → 500, and any other `Exception` → 500,
none leaking tracebacks or driver messages.

### Request/response shape

Polymorphic families (`PersonRole`, `OrgaRole`, `TouristicProductItem`,
`StockItem`) use `Literal["type/value"]`-discriminated Pydantic unions built
from the module's existing `StrictProperties` subclasses -- implementing
DR-0012's own stated consequence ("static discriminated unions remain useful
inside a bounded API contract") and satisfying `openapi.md`'s ban on generic
graph-node/property-bag CRUD. Where one properties class serves multiple
terminology types with identical shape (`EmptySupplierRoleProperties` across
six supplier types, `RoomCategoryProperties` across two), the discriminator
`Literal` lists all matching type values rather than duplicating the variant
class. `FlightProperties` and `StockProperties` (the only two contracts with
`date`/`time`/`Decimal` fields) use the lenient transport sibling described
above for request bodies; every other contract is reused directly, since
JSON's string/number/bool/null types already coincide exactly with Python's
under strict mode. Response bodies always use the real strict contracts
(built from already-validated domain objects, not parsed JSON, so no
coercion question arises).

### Authorization placeholder

`cct/api/dependencies.get_current_actor` (returning a fixed `Actor(id="system")`)
is a dependency of every mutating route. No authentication/authorization
mechanism is selected anywhere in the project yet (FR-006 governs only the
Customer web journey, not internal API access); this placeholder is
explicitly non-production and exists only so route signatures do not need to
change when a real mechanism is selected, and so the API does not silently
claim every caller may perform every operation.

### Terminology change

`terminology.md` TERM-005 `orderStatusCode` was pinned to the single literal
`order/paid` since #20. Widened to `order/reserved`, `order/paid`,
`order/fulfilled`, `order/cancelled`, grounded in the glossary's existing
"Reservation" and "tour operator cycle" narrative (payment, document
issuance, settlement) rather than invented ad hoc; `OrderHeaderProperties`
matches. Transition ordering/guards remain unresolved -- any code may
currently follow any other through `PUT /orders/{orderId}` -- and are
explicit future requirements work, not claimed here.

## Consequences

- Every cross-module reference write is preceded by a same-process read
  through the referenced module's own service, inside the same request; no
  network hop, no unrestricted repository access, no bespoke interface per
  pairing.
- The five `resource_management` submodules retain zero import edges between
  each other's `models.py`/`registry` composition; only `service.py` files
  cross-import one another's `service.py`, and only where a relationship
  genuinely spans modules.
- `backend/scripts/` is invisible to the architecture test suite by
  construction (it scans only `backend/src/cct`), so its exemption is a
  documented, deliberate design point, not an accidental gap -- both
  `backend/scripts/README.md` and `cct/api/README.md` say so.
- A future DB swap (PostgreSQL+AGE remains the named fallback comparator in
  `technology.md`) touches `cct.infrastructure.neo4j` and
  `backend/scripts/serve.py` only; no route handler or service function
  references Neo4j.
- `openapi-fetch` is now a small runtime dependency of
  `frontend/packages/api-client` (not merely a devDependency like
  `openapi-typescript`) -- a deliberate, minimal exception to "types only,"
  justified by how much fragile hand-written type inference it replaces.

## Validation evidence and limitations

192 backend tests pass, including: unit coverage for every module's
`service.py` against `tests/support/fake_entity_repository.FakeEntityRepository`
(create/get/list/update/delete, not-found, duplicate, invalid-reference,
delete-conflict, and the ownership/reference delete-direction split);
`ScopedEntityRepository` scoping; `Neo4jEntityRepository`'s new methods
against scripted Cypher-call fakes; one `test_<resource>_api.py` per router
via `fastapi.testclient.TestClient` with explicit `dependency_overrides`;
`test_openapi_contract.py` asserting operation-id uniqueness, domain tags,
consistent error-response schemas, and discriminated-union `oneOf` shapes
across the full 45-operation surface; and a real-Neo4j integration test
(`I21-` fixtures reusing TS-002's Emil Brandt / Condorleaf Air / FRA-GIG
data) proving the full Order → Stock → Product → Supplier → Organisation and
traveller → Person chain, keyset pagination, recursive product component
reads, and the delete-conflict/direction-sensitivity behaviour against a live
Neo4j 2025.06.0 Community container.

Explicit limitations, not claimed as solved here: no CI pipeline exists to
run `npm run api-client:validate` automatically (it is a local/manual
drift check today); concurrent stock allocation / double-booking races are
not addressed (each request is transactionally consistent, but no
reservation-hold or optimistic-concurrency mechanism exists -- out of scope
per the issue's exclusion of "complete business workflows"); the
authorization placeholder grants no real access control; order-status
transition rules are unconstrained; and AI-generated test candidates for
every service/router were reviewed against this record's own
aggregate/delete/reference rules before being kept, but no separate rejected
list is preserved beyond the corrections already folded into "Options
considered" above (the direction-insensitive delete rule and the
`cct.bootstrap`/ports draft).

## References

- [Flexible entity implementation](../../architecture/entity-model/implementation.md)
- [API architecture](../../architecture/api.md)
- [FastAPI implementation guide](../../implementation/fastapi.md)
- [OpenAPI implementation guide](../../implementation/openapi.md)
- [TypeScript implementation guide](../../implementation/typescript.md)
- [openapi-typescript](https://openapi-ts.dev/)
- [openapi-fetch](https://openapi-ts.dev/openapi-fetch/)
- [Neo4j variable-length paths](https://neo4j.com/docs/cypher-manual/current/patterns/variable-length-paths/)
