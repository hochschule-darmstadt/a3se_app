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
