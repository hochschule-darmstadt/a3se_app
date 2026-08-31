# DR-0014: Deterministic seed data representation, generation, and Compose seeding

- Status: accepted
- Owner: Implementation/Architecture
- Date: 2026-08-18
- Supersedes: none

## Context

Issue #12 turns the accepted `docs/test/test-scenarios/{test-scenarios.md,
catalogs.md}` specification (TS-001..TS-015, their supplier/product
catalogs) into deterministic, terminology-compliant seed data loaded
through the module `service.py` functions DR-0012/DR-0013 already built --
never a raw Neo4j write. It also required a recorded comparison of seed
representations, a full 2027 dated stock calendar for every room category
and flight type, and Docker Compose integration for a
one-shot seeding entry point.

Repo research on 2026-08-18 confirmed several open gaps this decision
resolves together: no seed-representation decision, seed code, or
`docker-compose.yml`/Dockerfile existed anywhere yet; `terminology.md` had
no image/URL/licence/attribution/alt-text terms at all and only two
`stock/*` type identifiers (`stock/flight/seat`, `stock/hotel/room`) --
not enough to cover the mobility/water/experience/protection families the
scenarios' orders allocate against; and the actual Pydantic contracts
(`RoomCategoryProperties.room_type_code`, `default_registry.py`) were
narrower than the terminology this issue needed to add, requiring the same
kind of contract-widening DR-0013 already did once for `orderStatusCode`.

## Options considered

| Concern | Option | Result |
|---|---|---|
| Seed representation | Plain CSV catalogs | Rejected: poor fit for recursive product trees and order header/position/reference shapes -- would force a second relational model the project explicitly warns against |
| Seed representation | Hand-authored Python literals as the source of fact | Rejected: 35 persons/127 products/15 orders as Python literals are harder to diff-review against `catalogs.md`/`test-scenarios.md`'s own tables than JSON |
| Seed representation | Reviewable JSON catalogs (static facts) + deterministic Python generation (recursive/dated volume) | Accepted: matches the issue's own suggested hybrid; JSON's nested-object/array shape maps directly onto recursive products and order positions; Python (DR-0010) generates the ~23k-item 2027 calendar no one should hand-author |
| 2027 quantity determinism | Seeded `random` (e.g. `random.seed(42)`) | Rejected: "deterministic" and "no uncontrolled random values" are stated as distinct, both-required properties; a PRNG is reproducible but is still what the exclusion names |
| 2027 quantity determinism | Fixed arithmetic formula over `(day-of-year, product ordinal)` | Accepted: byte-identical across runs and platforms by construction, no seed state to manage; documented in `inventory.py`'s module docstring |
| Entity ID scheme | A second UUID/surrogate-key mapping layer between catalog IDs and Neo4j `entityId` | Rejected: catalog IDs (`PER-001`, `FLT-01`, ...) are already stable and unique per `catalogs.md`; a second mapping registry would duplicate that without benefit |
| Entity ID scheme | Reuse catalog IDs directly as `entityId`; invent `ORD-nnn`/`STK-<productId>-<date>-U<n>` only where the catalog has none | Accepted: human-diffable, traceable to the source table by inspection |
| Missing `stock/*` type identifiers | Invent new family-specific StockItem properties per product family | Rejected: `terminology.md`'s own limitations section calls detailed product-family properties "deliberately unresolved until business rules are specified" -- inventing them here would be scope creep unrelated to seeding |
| Missing `stock/*` type identifiers | Add the ten missing type identifiers, all reusing the existing common `StockProperties` shape | Accepted: resolves only what blocks seeding (a type identifier to select), not the unresolved property question |
| Cruise cabin modelling | New `product/water/cabin` type, parallel to room categories | Rejected: adds a second "room-like" contract for one scenario detail |
| Cruise cabin modelling | Nest a `product/accommodation/room-category` (`roomTypeCode = room/cabin`) under the cruise product via `CONTAINS` | Accepted (documented, not built in this pass -- see Consequences): reuses the existing recursive-composition and room-category machinery instead of adding a parallel one |
| Seed script location | New top-level package under `backend/src/cct` | Rejected: would need its own architecture-test exemption and blurs the already-accepted "only `serve.py` composition-root" boundary (DR-0013) |
| Seed script location | `backend/scripts/seed/` (package) + `backend/scripts/seed_data.py` (CLI), outside `cct`, following `serve.py`'s exact precedent | Accepted |
| Docker Compose scope | Wait for issue #8/a future packaging issue to add `docker-compose.yml` | Rejected for this pass: the user explicitly asked to stand up a first Compose file now rather than defer |
| Docker Compose scope | Add `web`'s containerization too, completing DEP-001's three-unit topology | Rejected: no frontend Dockerfile/build story exists yet; adding one is out of issue #12's scope and would be scope creep into #22/#8 |
| Docker Compose scope | `backend/Dockerfile` + `docker-compose.yml` for `neo4j`/`api`/`seed`/`seed-reset` only, `web` explicitly deferred | Accepted |
| Seed service in Compose | A dependency of the default `docker compose up` | Rejected: would make ordinary startup mutate/duplicate data, violating "normal startup shall not destructively reset or duplicate retained data" |
| Seed service in Compose | Compose `profiles: [seed]`, invoked explicitly (`--profile seed run seed` / `run seed-reset`) | Accepted |

## Decision

### Seed representation and package layout

`backend/scripts/seed/sources/{persons,organisations,products,orders}.json`
are the authoritative, reviewable seed facts, each transcribed directly
from a `catalogs.md`/`test-scenarios.md` table (`schemaVersion: 1`).
`schema.py` validates their shape with Pydantic (`extra="forbid"`, so a
typo'd key fails loudly); `loader.py` additionally rejects duplicate IDs
(checked per `EntityKind`'s own namespace, matching the one-uniqueness-
constraint-per-label Neo4j schema) and dangling references between files,
all before any Neo4j write. `inventory.py` is pure, I/O-free Python that
generates the 2027 `StockItem` calendar and the mobility/water/experience/
protection families' ad hoc single-date stock. `orchestrator.py` is the
composition root -- builds a real Neo4j driver and one
`ScopedEntityRepository` per module exactly like `serve.py`, then loads in
dependency order (persons/roles -> organisations/roles -> products,
parents before children, then supplier assignment -> the stock calendar ->
orders), catching `DuplicateEntityError` per call for idempotent reruns.
`backend/scripts/seed_data.py` is the thin CLI (`--reset`), reading the
same `CCT_NEO4J_*` env vars `serve.py` uses.

### Deterministic 2027 calendar

For every non-reserve, top-level `product/flight` and
`product/accommodation/room-category` catalog product (30 total: the 15
used `FLT-*`/`ACC-*` products; `FLT-01`'s three recursive leg children are
excluded -- the calendar covers whole catalog products, not every
sub-component a recursive product happens to contain), `inventory.py`
generates one `StockItem` per sellable unit per day from 2027-01-01 through
2027-12-31: `daily_quantity(product, day) = 0` when
`(day_of_year + ordinal) % 11 == 0`, else `10` when
`(day_of_year + ordinal) % 30 == 0`, else `1 + ((day_of_year*7 +
ordinal*13) % 3)` (range 1-3) -- `ordinal` a stable per-product integer
from the catalog ID's numeric suffix. This keeps the deterministic range
formally 0-10 inclusive (a periodic subset of dates reaches the documented
ceiling; the rest sit low) while keeping the resulting dataset's real size
(~23,000 `StockItem`s) tractable to load. Any `(productId, date)` pair a
seeded order actually allocates against is exempted from the zero rule
(forced to at least 1) so orders never reference stock the calendar itself
left empty. Mobility/water/experience/protection products are not part of
this mandatory calendar (only room categories and flight types are, per
the issue's own "Inventory for 2027" section); they receive exactly one ad
hoc `StockItem` per date a seeded order position needs.

### Terminology additions consumed by this seed data

`terminology.md` TERM-002 gained ten `stock/*` type identifiers
(`stock/accommodation/room-category`, four `stock/mobility/*`, two
`stock/water/*`, two `stock/experience/*`, `stock/protection/travel`), all
reusing the existing common `StockProperties` shape. TERM-004's
`roomTypeCode` widened from the single permitted value `room/double` to
eight (`room/single`, `room/double`, `room/twin`, `room/triple`,
`room/family`, `room/adjoining`, `room/suite`, `room/cabin`), grounded in
`test-scenarios.md`'s own occupancy text and `catalogs.md`'s reserve-entry
names.

### Contract widening this seed data required

The terminology additions above were not yet reflected in the actual
Pydantic contracts DR-0012 built, so this issue widened them the same way
DR-0013 widened `OrderStatusCode`:
`touristic_product_management/models.py`'s `RoomCategoryProperties
.room_type_code` Literal now matches TERM-004's eight values;
`default_registry.py` maps the ten new
`stock/*` identifiers to `StockProperties`; `cct/api/stock_items.py`'s
`STOCK_ITEM_TYPES` tuple widened to match, so the CRUD API accepts the same
types the seed data writes.

### Entity IDs

Catalog IDs (`PER-001`, `SUP-AIR-01`, `SUP-AIR-01-ROLE`, `FLT-01`, ...) are
used directly as `entityId`. New ID families this issue introduces:
`ORD-nnn` (order header) / `ORD-nnn-Pn` (position); `STK-<productId>-
<date>-U<n>` (one unit of dated stock, human-diffable). Reset scoping
(`orchestrator.SEED_ID_PREFIXES`) is exactly the ten catalog/order/stock ID
prefixes above -- `reset_seed_data` deletes only nodes whose `entityId`
starts with one of them, in one transaction, never a bare `MATCH (n)
DETACH DELETE n`.

### FLT-01 recursive composition; other flights simplified

`FLT-01` (TS-001, BER-LIM-CUZ-LIM-BER) models its full four-leg itinerary
as one root `product/flight` plus three nested `product/flight` children
via `CONTAINS` (`FLT-01-L2..L4`), proving genuine multi-level recursive
composition end to end (asserted by
`test_seed_data_integration.py::test_flt01_recursive_legs_are_contained`).
Every other used `FLT-nn` models only its scenario's primary/outbound leg
with concrete IATA/time/flight-number data -- not every itinerary segment.
This is a deliberate scope simplification, not a claim of complete
itinerary modelling; recorded here and in `backend/scripts/seed/README.md`
rather than silently expanded to all fifteen flights, which would have
meant hand-deriving and verifying every connecting leg's schedule data for
comparatively little additional proof value once one genuine example
exists and is tested.

### Docker Compose

`backend/Dockerfile` (single-stage `python:3.13-slim`, `pip install -e .`
against the pinned `pyproject.toml` dependencies) backs three of
root `docker-compose.yml`'s four services: `api` (runs `serve.py`,
`CCT_API_HOST=0.0.0.0` so it is reachable across the Compose network --
`serve.py` was changed to read this env var, defaulting to the original
`127.0.0.1` for unchanged local-dev behaviour), `seed` (same image, `python
scripts/seed_data.py`), `seed-reset` (same image, `... --reset`). `neo4j`
uses the pinned `neo4j:2025.06.0-community` image already selected by
DR-0010/DR-0011. `seed`/`seed-reset` sit under Compose's `seed` profile,
excluded from the default `docker compose up`, so ordinary startup never
mutates or duplicates retained data -- an operator opts in explicitly.
`web` is intentionally not containerized here (see "Options considered").
`deployment-architecture.md`'s previously-proposed `NEO4J_URI`/
`NEO4J_USERNAME`/`NEO4J_PASSWORD` env var names are corrected to the
`CCT_NEO4J_*` names the actual code already used before this doc's
Compose section was ever implemented, rather than renaming working,
already-tested code to match a doc that predated it.

## Consequences

### Positive

- The seed loader is the same composition-root pattern as `serve.py` and
  the same call-through-owning-module-service pattern DR-0013 established
  for cross-module writes -- no new architectural idiom, no new
  architecture-test exemption.
- Full-year, full-catalog algorithmic correctness (date boundaries, the
  0-10 range, guaranteed zero/non-zero coverage per product, determinism)
  is proven by fast, I/O-free unit tests (`backend/tests/unit/seed/`)
  against the whole 2027 x 30-product matrix, independent of how long a
  real Neo4j load takes.
- `docker compose up` now produces a running `api` backed by a healthy
  `neo4j`, and `--profile seed run seed`/`run seed-reset` give the PoC
  (issue #13) its "one documented command sequence" for sample data,
  non-destructively by default.

### Negative and risks

- The full real-Neo4j load (`test_seed_data_integration.py`, or
  `seed_data.py` itself) takes on the order of several minutes (~23k
  `StockItem` writes, each `create_stock_item` several sequential
  round-trips) -- an accepted, documented operational cost, not a claim of
  seeding performance at any larger scale (explicitly excluded by the
  issue: "load-scale benchmarking datasets" is not a goal here).
- No cross-entity transactional rollback exists if a write fails partway
  through a run: `loader.py` validates every source fully before the first
  write, so a malformed *source file* fails before any mutation, but an
  unexpected mid-run infrastructure error (e.g. a dropped connection) can
  still leave a partial load behind. Idempotent reruns recover from this
  (already-written entities are skipped, not duplicated) but this is
  recovery-by-rerun, not atomicity.
- Inherited from DR-0013, not solved here: nothing prevents a second order
  position from allocating a `StockItem` another position already
  allocates -- the issue's own "cannot allocate ... already reserved
  stock" acceptance wording describes a concurrency-control mechanism
  `resource_management.order_management.service.allocate_stock` does not
  implement. This seed data's integration test therefore proves only the
  "cannot allocate a nonexistent `StockItem`" half of that sentence
  (`test_allocate_stock_rejects_a_nonexistent_stock_item`); double-
  allocation rejection remains explicit future requirements/implementation
  work.
- Fourteen of the fifteen used `FLT-nn` products model only their primary
  leg (see "FLT-01 recursive composition" above) -- itinerary detail for
  connecting/return legs on those flights is not represented.
- The cruise-cabin-as-nested-room-category design is recorded as a
  decision here but not built in this pass: `WTR-02`'s seed data is a flat
  `product/water/cruise` product, not yet composed with nested
  `room/cabin`-typed children. `room/cabin` exists in `terminology.md` and
  is exercised by the reserve entry `ACC-29` ("Forest Cabin") instead.
- `GET /health/live`/`GET /health/ready` remain unimplemented (proposed
  only in `deployment-architecture.md`); Compose health-gates `api`/
  `seed`/`seed-reset` on `neo4j`'s own health check, not a real API
  readiness probe.
- Reserve `Organisation`/`TouristicProductItem` entries' airline
  designators (the ten `SUP-AIR-11..20` reserves) follow the same
  synthetic `<digit>Q`/`<digit>X` pattern as the scenario-used `0Q`/`1Q`
  but, unlike those two, were not individually re-verified against IATA's
  current-assignment search (`docs/test/test-scenarios/source-
  verification.md`'s process) -- acceptable because reserve entries are,
  per `catalogs.md`, "discovery fixtures, not sellable inventory," never
  displayed as bookable, but recorded rather than silently assumed
  equivalent.

## Validation evidence and limitations

231 backend unit/API tests pass (197 pre-existing + 34 new: seed package
coverage plus the widened-`roomTypeCode`/new-`stock/*`-
type contract tests in `resource_management`). A fake-repository dry run
of the full committed seed data (`run_seed` against
`support.FakeEntityRepository`) completes in ~0.25s, creating exactly 35
`Person`, 50 `PersonRole`, 67 `Organisation`, 67 `OrgaRole`, 130
`TouristicProductItem`, 15 `OrderItem` headers, 67 positions, 22,924
calendar `StockItem`s, and 37 ad hoc `StockItem`s, and reruns idempotently
(zero created, everything already-present on the second call).
`test_seed_data_integration.py` (opt-in, `CCT_NEO4J_TEST_URI`) proves the
same counts against a real Neo4j 2025.06.0 Community container, plus
idempotent rerun, reset-and-reload, the full `HAS_ROLE`/`CONTAINS`/
`SUPPLIED_BY`/`REPRESENTS_PRODUCT`/`ALLOCATES_STOCK`/`CUSTOMER`/
`ASSIGNED_TRAVELLER` relationship chain for one order, `FLT-01`'s recursive
legs, that reserve products never receive stock, and that the same product
has both a queryably zero-availability date and a queryably available
date. `docker compose build`/`up`/`--profile seed run seed` were manually
smoke-tested locally (see the acceptance-evidence table in
`deployment-architecture.md`).

Explicit limitations, not claimed as solved here: the negative
consequences listed above (double-allocation, mid-run rollback, `FLT-*`
leg coverage, cruise cabins, health endpoints, reserve-designator
verification depth); no CI pipeline runs the integration test or
`docker compose` automatically (both are local/manual today, same
limitation DR-0013 already recorded for `api-client:validate`); and image
selection covers exactly the seven representative resource categories the
issue asks for (accommodation, flight, guided-tour/excursion, cruise,
transfer, rental vehicle, protection), not every one of the 130 seeded
products.

AI drafted this decision record, the seed package, the terminology/contract
widening it required, and the Docker Compose files, then critically
reviewed its own first draft: rejected a `product/flight/journey` container
type for multi-leg itineraries in favour of self-similar `product/flight`
recursion (no new type needed); rejected re-deriving and verifying every
connecting leg for all fifteen used flights once one genuine recursive
example existed and was tested; rejected a project-controlled `licence/`
namespace in favour of reusing external SPDX identifiers; and caught (via
a fake-repository dry run before any real Neo4j write) that
`FlightProperties`' time fields and the mandatory-calendar filter needed
explicit handling that a first pass omitted. Independent Requirements/
Architecture/Test/Security/Operations review, per this project's lifecycle
model, remains outstanding, matching every other DR and terminology change
in this repository to date.

## References

- [Entity-model terminology](../../architecture/entity-model/terminology.md)
- [Entity-model implementation](../../architecture/entity-model/implementation.md)
- [Test scenarios](../../test/test-scenarios/test-scenarios.md)
- [Reusable test-data catalogs](../../test/test-scenarios/catalogs.md)
- [Localhost deployment architecture](../../operations/deployment-architecture/deployment-architecture.md)
- [Seed package README](../../../backend/scripts/seed/README.md)
- [DR-0010: Python-centred modular technology stack](0010-adopt-python-centered-modular-technology-stack.md)
- [DR-0011: Use Docker for localhost deployment](0011-use-docker-for-localhost-deployment.md)
- [DR-0012: Validated property registry and direct Neo4j properties](0012-use-validated-property-registry-and-direct-neo4j-properties.md)
- [DR-0013: Shared resource CRUD API and OpenAPI contract](0013-shared-resource-crud-api-and-openapi-contract.md)
