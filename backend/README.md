# CCT Backend

The installable Python distribution uses the `src` layout and the import package `cct`, meaning Christopher Columbus Travel. Source is organised by accepted architecture module rather than global controller/service/model/repository folders.

- `api`: shared FastAPI transport adapter boundary; flat, one router module per resource family
- `core_processes`: Core Business Process modules
- `resource_management`: five independently owned Resources modules beneath one clearly named layer namespace
- `infrastructure`: technology adapters, including Neo4j

`backend/scripts/` holds operator scripts (`serve.py`, `export_openapi.py`)
that sit outside the `cct` import namespace; `serve.py` is the one place in
the repository allowed to wire `cct.infrastructure` into `cct.api` (DR-0013).
Any future agent-tool adapter will be introduced only when a concrete
implementation issue requires it.

Install the pinned project dependencies (and the `test` extra, needed for
`fastapi.testclient.TestClient`) with `python -m pip install -e
"./backend[test]"`. Issue #20 added the flexible-entity contracts and narrow
Neo4j mapping prototype; issue #21 adds the full CRUD API over all five
Resources modules (`backend/scripts/serve.py` runs it against a real Neo4j
instance). Seed generation remains deferred to issue #12. Run `npm run
backend:check` from the repository root for compilation, architecture tests,
and unit tests; see `backend/tests/integration/neo4j/README.md` for the
opt-in real-Neo4j suite.
