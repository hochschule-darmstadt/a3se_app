# Operator Scripts

Runnable scripts, not part of the installable `cct` import namespace and
therefore outside every architecture test's static import scan. This is
deliberate, not a loophole: `serve.py` is the one place in the repository
allowed to import both `cct.api` and `cct.infrastructure` -- the composition
root that wires a real Neo4j-backed repository into FastAPI (DR-0013). No
`cct` package may do this itself (`cct.api` cannot import `cct.infrastructure`
at all, and `cct.resource_management` modules depend only on
`EntityRepositoryPort`).

- `serve.py`: runs the API locally against a real Neo4j instance. Requires
  `CCT_NEO4J_PASSWORD`; `CCT_NEO4J_URI`/`CCT_NEO4J_USER`/`CCT_NEO4J_DATABASE`
  default to the same localhost/Community values used elsewhere.
- `export_openapi.py`: writes the FastAPI OpenAPI document to
  `frontend/packages/api-client/generated/openapi.json` with no live
  database (`create_app()` takes no required arguments; OpenAPI generation
  never executes a route or a dependency). Run via `npm run api-client:generate`.
- `seed_data.py` (issue #12): loads the deterministic `docs/test/test-scenarios`
  seed data through the same module `service.py` functions the API uses,
  never a raw Neo4j write. Requires `CCT_NEO4J_PASSWORD`; `--reset` deletes
  only known seed-ID-prefixed entities first. Composition logic lives in the
  `seed/` package next to this file (its own README has the full layout);
  this script is only the CLI entry point, kept alongside `serve.py` for the
  same reason -- outside `cct`, free to import `cct.infrastructure` directly.
