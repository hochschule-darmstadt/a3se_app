# HTTP API Adapter

Shared FastAPI transport boundary. Both frontend applications consume capability-oriented operations from this API. Grouping is flat, one router module per resource family (`persons.py`, ...), not divided by frontend identity.

Handlers may depend on public Core Process or Resource Management interfaces. They shall not contain domain rules, import another module's internals, or use Neo4j directly (`cct.api` cannot import `cct.infrastructure` at all; the architecture test enforces this).

- `app.py`: `create_app()` factory, zero required arguments so `backend/scripts/export_openapi.py` can generate the OpenAPI document with no live database.
- `dependencies.py`: `Depends`-compatible providers reading module-scoped repositories from `request.app.state.dependencies`, plus the `get_current_actor` placeholder authorization dependency (DR-0013; not production access control) required on every mutating route.
- `errors.py`: maps domain errors (`cct.resource_management.errors`) and request-validation failures to one consistent `ErrorResponse` shape and status code, never leaking internals.
- `schemas.py`: the shared `ErrorResponse`/`PageParams`/`Page[T]` envelope reused by every router.
- One router module per resource family, wiring its own discriminated-union request/response schemas onto its owning module's `service.py`.

The actual composition of `cct.infrastructure`-backed repositories into `app.state.dependencies` happens only in `backend/scripts/serve.py`, outside this package.
