# Shared API Client Boundary

This package is the only frontend package intended to expose backend HTTP contracts.

- `npm run api-client:generate` (repository root) exports the backend's OpenAPI document (`python backend/scripts/export_openapi.py`, no live database needed) and regenerates `src/generated/schema.ts` via `openapi-typescript`.
- `npm run api-client:validate` (repository root) regenerates and fails (`git diff --exit-code`) if the committed generated files drifted from the FastAPI contract -- the local stand-in for the CI check `docs/implementation/openapi.md` describes, until a CI pipeline exists to run it automatically.
- `createApiClient` (`src/client.ts`) is the small hand-authored facade: it wires an `ApiClientConfig` into `openapi-fetch`'s typed client factory over the generated `paths` type. There is no per-operation generated method surface -- callers invoke the path directly, e.g. `client.GET("/persons/{person_id}", { params: { path: { person_id } } })`.
