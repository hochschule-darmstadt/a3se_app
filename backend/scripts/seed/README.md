# Seed Data (issue #12)

Deterministic, terminology-compliant seed data for `docs/test/test-scenarios/
{test-scenarios.md,catalogs.md}` (TS-001..TS-015 and their reusable
supplier/product catalogs), loaded through the same module `service.py`
functions the CRUD API itself calls -- never a raw Neo4j write. Run via
`python backend/scripts/seed_data.py` (see that file's docstring); this
directory holds only the seed package, not the entry point, so the
`backend/scripts/` composition-root exemption documented there applies here
too.

## Layout

- `sources/*.json`: the authoritative, reviewable seed facts --
  `persons.json`, `organisations.json`, `products.json`, `orders.json`,
  `images.json` -- each directly traceable to a `catalogs.md`/
  `test-scenarios.md` table. `schemaVersion` starts at 1; a breaking shape
  change bumps it and `schema.SEED_SCHEMA_VERSION` together.
- `schema.py`: Pydantic models validating the *shape* of the source files.
  Property *values* (`roomTypeCode`, `flightNumber`, ...) are validated a
  second, authoritative time by the real module contracts when the
  orchestrator calls `create_*` -- this layer only catches malformed
  authoring input early, per implementation.md's "seed data must not
  recreate property rules."
- `loader.py`: reads and cross-validates the source files (duplicate IDs
  within one EntityKind's namespace, dangling references between files)
  before any write.
- `inventory.py`: pure, deterministic 2027 `StockItem` generator for every
  used (non-reserve) room-category/flight-type product, plus one ad hoc
  StockItem per date a mobility/water/experience/protection order position
  actually needs (those families are not part of the mandatory 2027 daily
  calendar). No I/O -- exhaustively unit-tested without touching Neo4j.
- `images.py`: TERM-010 image-property lookup/merge helpers.
- `orchestrator.py`: the composition root -- builds the real Neo4j driver
  and one `ScopedEntityRepository` per module (mirrors `serve.py`), then
  loads persons/roles -> organisations/roles -> products (parents before
  children, then supplier assignment) -> the 2027 stock calendar -> orders,
  idempotently (`DuplicateEntityError` is counted, not raised).

## Deliberate scope limitations (recorded in DR-0014)

- Every `FLT-nn`/`ACC-nn` used catalog product models exactly the primary
  leg/room category described in `test-scenarios.md`; `FLT-01` additionally
  demonstrates genuine multi-level recursive composition (its full 4-leg
  itinerary as nested `CONTAINS` children) -- the other 14 flights model
  only their outbound leg, not every itinerary segment.
- Reserve catalog entries (`*-11..20`/`*-21..30`) are created as
  Organisations/Products only, per `catalogs.md`'s own rule -- they never
  receive `StockItem`s.
- The 2027 calendar's daily quantity is a documented deterministic formula
  (see `inventory.py`'s module docstring), not a claim that any particular
  distribution reflects real demand.
