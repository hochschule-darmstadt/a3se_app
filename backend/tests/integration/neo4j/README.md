# Neo4j integration tests

Tests in this directory verify Neo4j adapters against a disposable controlled
database. They are skipped unless all required connection settings are
explicitly supplied:

```text
CCT_NEO4J_TEST_URI=bolt://localhost:7687
CCT_NEO4J_TEST_USER=neo4j
CCT_NEO4J_TEST_PASSWORD=<test-only password>
```

The issue #20 suite creates Community-compatible constraints and indexes,
round-trips a typed entity, exercises indexed lookup, and traverses recursive
and heterogeneous relationships. It deletes only nodes whose synthetic
`entityId` begins with `I20-`; never point it at production data.

The issue #21 suite (`test_resource_crud_integration.py`) drives the FastAPI
app (`cct.api.app.create_app()`) through `fastapi.testclient.TestClient`
against real, module-scoped `ScopedEntityRepository` instances wired directly
in `setUpClass` (not via `backend/scripts/serve.py`): the full Order -> Stock
-> Product -> Supplier -> Organisation and traveller -> Person flow reused
from TS-002 (Emil Brandt, Condorleaf Air, flight FRA-GIG), recursive product
component reads, keyset pagination, and direction-sensitive delete-conflict
protection (a role blocks its person's deletion; deleting the role first,
then the person, succeeds). It deletes only nodes whose synthetic `entityId`
begins with `I21-`.

The issue #12 suite (`test_seed_data_integration.py`) loads the real,
committed `backend/scripts/seed/sources/*.json` through
`seed.orchestrator.run_seed` -- the same code path `python
backend/scripts/seed_data.py` runs -- including the full ~23k-item 2027
stock calendar, so it takes several minutes (opt-in only, per the gating
above; it never runs as part of `npm run backend:check`). It proves exact
per-kind creation counts, idempotent rerun, reset-and-reload, the full
relationship-vocabulary chain (`HAS_ROLE`/`CONTAINS`/`SUPPLIED_BY`/
`REPRESENTS_PRODUCT`/`ALLOCATES_STOCK`/`CUSTOMER`/`ASSIGNED_TRAVELLER`) for
one order end to end, `FLT-01`'s recursive leg composition, that reserve
catalog entries never receive stock, and that the same product has both a
queryably zero-availability date and a queryably available date. It clears the
complete disposable graph before loading.
