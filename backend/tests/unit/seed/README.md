# Seed Package Unit Tests

Unit coverage for `backend/scripts/seed/` (issue #12), against
`support.FakeEntityRepository` and temporary source files -- never a real
Neo4j instance (see `backend/tests/integration/neo4j/test_seed_data_integration.py`
for that). `__init__.py` adds `backend/scripts` to `sys.path` once for this
package, since the seed code lives outside `backend/src`.

- `test_schema.py`: structural validation of the seed source JSON shapes.
- `test_loader.py`: duplicate-ID and dangling-reference detection across
  the source files, using a minimal hand-written dataset, not the real
  `sources/*.json`.
- `test_inventory.py`: the deterministic 2027 calendar generator -- date
  boundaries, the documented 0-10 range, guaranteed zero/non-zero coverage
  per product, determinism, and the mobility/water/experience/protection
  ad hoc single-date path.
- `test_images.py`: TERM-010 image lookup/merge helpers.
- `test_orchestrator.py`: dependency ordering, idempotent reruns, and
  validate-before-mutate, against a fake repository and the same minimal
  dataset `test_loader.py` uses.
