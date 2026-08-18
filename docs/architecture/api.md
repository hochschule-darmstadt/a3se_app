# API Architecture

- Status: accepted
- Owner: Architecture
- Last reviewed: 2026-08-18

This view is the HTTP contract realization of the [logical entity
model](entity-model/entity-model.md) and its [flexible entity
implementation](entity-model/implementation.md), consumed by both Customer
and Staff Interaction through the shared `cct.api` FastAPI adapter
(`backend/src/cct/api/`). It does not restate the entity model, the Python/
Neo4j representation, or the terminology catalog; it only adds what is
specific to being an HTTP contract. The consequential choices behind it,
including the aggregate/nested-item table, delete policy, and TypeScript
codegen selection, are recorded in
[DR-0013](../governance/decisions/0013-shared-resource-crud-api-and-openapi-contract.md).

## Operation catalogue

| Resource family | Root resource | Nested resource | Cross-module writes |
|---|---|---|---|
| Person Management | `/persons` | `/persons/{personId}/roles` | -- |
| Partner Management | `/organisations` | `/organisations/{organisationId}/roles` | -- |
| Touristic Product Management | `/products` (recursive `CONTAINS`, read at `/products/{productId}/components`) | -- | `PUT /products/{productId}/supplier` validates via Partner Management |
| Inventory | `/stock-items` (requires `productId` at creation) | -- | validates the product via Touristic Product Management at creation |
| Order Management | `/orders` | `/orders/{orderId}/positions`; bounded read at `/orders/{orderId}/detail` | `PUT .../stock` validates via Inventory; `PUT .../traveller` and `PUT /orders/{orderId}/customer` validate via Person Management |

Every root and nested resource supports create/read/update/delete except
`OrderItem` positions, which have no properties of their own (only
relationships) and so support create/read/delete/list without update.

## Error contract

One shared shape (`type`, `title`, `detail`) for every non-2xx response,
distinguishing outcomes by HTTP status rather than by parsing free text:

| Status | Meaning | Domain source |
|---|---|---|
| 404 | Referenced resource does not exist | `EntityNotFoundError` |
| 409 | Duplicate `entityId` on create | `DuplicateEntityError` |
| 409 | Delete blocked by a dependent relationship | `DependentEntityExistsError` |
| 422 | Request shape, domain contract, or reference validation failed | FastAPI `RequestValidationError`, domain `pydantic.ValidationError`, `InvalidReferenceError`, or a plain `ValueError` |
| 500 | Wiring bug or unexpected failure | `PermissionError` (a `ScopedEntityRepository` misconfiguration) or any other exception |

No handler exposes a traceback, driver message, or internal identifier.

## Pagination

Keyset, ordered by `entityId` (already uniquely constrained per label).
`limit` is bounded `[1, 100]`, default 20; `cursor` is an opaque,
base64-encoded `entityId` returned as `nextCursor` when more results remain.
Nested collections (roles under their Person/Organisation, positions under
their order) are owner-bounded and returned as a plain list, not paginated.

## Bounded relationship reads

Two operations exist specifically to satisfy "read the graph without raw
graph access":

- `GET /products/{productId}/components` -- the full recursive `CONTAINS`
  subtree, depth-capped defensively (not as a business rule) at
  `PRODUCT_COMPONENT_MAX_DEPTH` in `entity_repository.py`.
- `GET /orders/{orderId}/detail` -- the header plus each position's resolved
  `stockItemId`/`productId`/`supplierOrganisationId`/`travellerPersonId`
  (identifiers only, never embedded objects or raw nodes).

Both return a small, fixed response shape regardless of how large the
underlying graph traversal is; neither accepts a client-supplied query,
label, or relationship type.

## Authorization

Every mutating route depends on `get_current_actor`
(`cct/api/dependencies.py`), a placeholder that trusts any caller. No
authentication/authorization mechanism is selected anywhere in the project
yet; this exists so route signatures already carry an actor-context
dependency a real mechanism can replace later, and so the API does not claim
every caller may perform every operation. It must not be treated as access
control.

## Generated TypeScript client

`frontend/packages/api-client` is generated and validated from this API's
OpenAPI document, never authored by hand for the transport types:

1. `backend/scripts/export_openapi.py` calls `create_app().openapi()` with no
   live database and writes `frontend/packages/api-client/generated/openapi.json`.
2. `openapi-typescript` generates `src/generated/schema.ts` (types only).
3. `src/client.ts` is the small hand-authored facade wiring `ApiClientConfig`
   into `openapi-fetch`'s typed client over the generated `paths` type --
   there is no per-operation generated method surface.

`npm run api-client:generate` runs the whole chain; `npm run
api-client:validate` regenerates and fails on any committed drift (`git diff
--exit-code`), standing in locally for the CI check `docs/implementation/
openapi.md` describes until a CI pipeline exists to run it automatically.
