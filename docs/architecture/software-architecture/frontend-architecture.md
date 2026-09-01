# Frontend Architecture

- Status: accepted
- Owner: Architecture/Implementation
- Last reviewed: 2026-08-31

This document is the authoritative frontend architecture for the Customer and
Staff Interaction applications. It specifies the conventions already realized
in the repository and the conventions every future frontend extension shall
follow. It is the implementation companion to the technology-neutral
[modular software architecture](software-architecture.md), the repository
mapping in [project-structure.md](project-structure.md), and the accepted
technology profile in
[DR-0010](../../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md).

This document extends the decisions made in issues #19, #21, #22, #27–#33,
#50–#53, #56, and #57. Those work items explain delivery scope and evidence;
the rules below are the durable answer to “how do future views work here?”.
This document does not replace requirements, UX wireframes, the API contract,
or decision records. It must not silently turn a proposal or an incidental
implementation detail into a requirement.

## 1. Architectural principles

1. Customer and Staff are two interaction applications on one React platform,
   not two copies of the backend or two unrelated design systems.
2. A route owns its view behavior; shared packages own only behavior that is
   genuinely shared and technology-level.
3. The URL is the durable state of a navigable view. Refresh, copy/paste,
   forward/back, and a related-record link must preserve the state represented
   by the URL.
4. The API is the source of truth for business data and read projections. The
   frontend may format or arrange a response but must not invent business
   matching, availability, display-name, or capacity semantics.
5. Every user-visible state is explicit: loading, empty, validation failure,
   not-found, conflict, network failure, success, and the applicable
   alternative path.
6. Accessibility, responsive behavior, localization readiness, and keyboard
   operation are part of the view contract and its tests.

## 1.1 MVP view obligations

The delivered Staff views are examples of one shared architecture, not six
independent conventions. Future changes extend the applicable row below:

| View / source issue | Required frontend shape |
|---|---|
| Staff home, #28 | Compose the Staff shell and navigation; keep dashboard/summary behavior distinct from resource CRUD views and document deferred actions |
| Customers and travellers, #29 | Use Person/PersonRole API projections; distinguish customer and traveller roles; edit lifecycle/payment categories only through validated API operations |
| Suppliers and partners, #30 | Use Organisation/OrgaRole projections and role badges; navigate related entities with the display-chain-plus-ID rule |
| Touristic product catalogue, #31 | Use the recursive product tree, supplier context, display-name chains, bounded hierarchy reads, and list/detail state |
| Inventory, #32 | Show dated stock, represented product context, supplier context, capacity and availability projections; preserve product/stock ownership boundaries |
| Travel orders, #33 | Show order headers, positions, customer/traveller/stock/product context and order status; keep unresolved positions and payment-dependent states truthful |

The Customer journey is the thin slice from #22, not a claim that all business
use cases are implemented. Each view must identify which wireframe flow it
implements and which behavior remains deferred.

## 2. Application and package boundaries

| Area | Responsibility | Required boundary |
|---|---|---|
| `frontend/apps/customer` | Customer Interaction routes and journey | May import shared packages and its own feature code; never Staff implementation |
| `frontend/apps/staff` | Staff Interaction routes and operational views | May import shared packages and its own feature code; never Customer implementation |
| `frontend/packages/api-client` | Generated OpenAPI types, typed HTTP facade, query/error wrappers | Transport only; no route or business presentation |
| `frontend/packages/ui` | Mantine providers, themes, shells, common components, icons, i18n and PoC auth | Shared presentation/infrastructure only; no application workflow |
| `frontend/tests` | Cross-application integration and Playwright browser tests | Must not become a shared feature-code directory |

Use feature-oriented route modules and colocated helpers/tests. Shared packages
must not import either application, and frontend packages must not contain
Python models, Neo4j access, persistence, or copied backend domain rules. A new
shared primitive requires evidence that at least two applications or features
need the same behavior.

The selected platform is React with TypeScript, React Router v7 Framework
Mode, Vite, and Mantine (DR-0010, DR-0015). Do not introduce another UI
framework, router, server runtime, grid, query library, or localization library
without a new decision record.

## 3. Bootstrap, shells, and profiles

Each application composes providers in `root.tsx`, exports a route-level
fallback `ErrorBoundary`, and keeps expected API failures inside routes.
Customer uses `CustomerUiProvider`, `MockAuthProvider`, locale context, and
`QueryClientProvider`; Staff uses `StaffUiProvider` and
`QueryClientProvider`. The mock actor and user menu are placeholders, not
authorization.

Every Customer route composes `CustomerShell`; every Staff route composes
`StaffShell`. The shell is the boundary established by #27 and owns landmarks,
skip link, header/footer/sidebar structure, focus behavior, density/theme
profiles, Staff primary navigation, and shared branding/icons. Views must not
recreate shell chrome locally. New navigation requires corresponding
navigation-map/wireframe evidence. Legal/imprint text and real staff login
remain deferred until confirmed.

## 4. Routing and route modules

Declare routes in each `app/routes.ts` with React Router's `index` and `route`
configuration. A route module owns one URL view and may export `meta()` for its
document title. Keep route composition, data selection, and user interaction in
the route or its feature helper; put reusable visual primitives in `@cct/ui`
only when they satisfy the shared boundary.

The Customer journey is a sequence of independently linkable routes:

```text
home/search -> product detail -> compose/availability -> offer
             -> sign-in -> order
```

Product, date, traveller count, and journey context travel through URL
parameters. An unavailable result follows the documented alternative-date or
assistance path and is never shown as bookable. Staff views use list/detail or
list/tree layouts; selected records, positions, create/detail panels, filters,
sort state, and page belong to the URL when they affect the visible view.
Unsaved form input remains local and ephemeral.

## 5. URL view-state contract

Use `useSearchParams`, `Link`, and React Router navigation with the shared Staff
helpers in `staff-view-state.ts`. Do not create a second history mechanism.

For URL-backed Staff state:

1. A filter or sort updates the URL and resets an incompatible page.
2. Selection updates detail state while preserving filters and pagination.
3. A related-record link pushes a new state, preserving the originating state.
4. Reload reconstructs the same list, filter, page, and detail view where valid.
5. Browser back/forward restores the prior view instead of a blank/default list.
6. Malformed or stale parameters use safe defaults and keep the route usable.

Use stable URL-safe IDs, never credentials, tokens, or sensitive personal data.
This contract is the frontend realization of #51 and DS-CMP-007.

Issue #49 extends this contract through the shared `IncomingReferenceLinks`
pattern: links preserve the complete relative origin in `returnTo`; target
views use exact identifier filters (`customerRoleId`, `travellerRoleId`,
`supplierRoleId`, `productId`, or `stockItemId`) and expose a deliberate return
control. The accepted paths are Customer/traveller role → Orders, supplier
role → Products, Product → Inventory, and StockItem → Orders. Product → Orders
and supplier → Inventory are excluded.

## 6. API client, queries, and pagination

`frontend/packages/api-client` is generated from FastAPI OpenAPI: the export
script writes `openapi.json`, `openapi-typescript` generates `schema.ts`, and
the hand-authored `openapi-fetch` facade exposes typed path operations. Never
hand-edit generated transport types. Contract changes regenerate the schema,
validate drift, update consumers, and update tests together.

`@tanstack/react-query` owns request lifecycle and cache state. Use
`useApiQuery`/`useApiMutation` so all failures become `ApiError`; invalidate
affected query keys after mutations; include every result-changing filter in a
query key. Use the bounded cursor contract (`limit`, opaque `cursor`,
`nextCursor`). `useCursorPage` provides Previous using a local cursor stack.

`useAllPages` is allowed only for bounded cross-page projections such as the
Staff product hierarchy and has a documented 50-page limit. It must not hide a
missing backend search capability. Customer criteria are currently context
only; the frontend must not client-filter the catalogue to simulate search.
When server-side product/date/party matching exists, replace this thin slice
with that API capability.

## 7. Entity display, chains, and links

The API supplies read-only `displayName` and `displayNameChain` projections.
The frontend never recomputes semantic components from raw properties; it may
join the ordered chain with ` · ` for presentation.

Whenever the UI labels an entity object, the label is:

```text
displayNameChain joined with " · "  +  " · "  +  entityId
```

The entity ID is always last. This applies to entity rows, relationship rows,
detail references, and chips. Statuses, types, dates, amounts, and counts are
not entity objects and do not receive an ID suffix.

Product hierarchy follows one consistent rule: ancestor chips are immediate
parent first and root last; each chip uses that ancestor's own display-name
chain followed by its ID; component and ancestor chips reuse Mantine `Badge`
as links; links preserve Staff filters/page/selection; a root has no ancestor
row; and a supplier-root relationship specified as prose remains a text link.
This is the “always done this way” rule extending #50, #51, and #53. A chip
must not be labelled only with a type, truncated ID, or raw property.

## 8. Shared UI, forms, and presentation states

Use `@cct/ui` and design tokens before creating local equivalents:
`StatusBanner`, `ApiErrorBanner`, `FormErrorSummary`, `DataTable`,
`CursorPager`, `ResourceCard`, `OfferSummary`, shells, icons, and themes.
Mantine `Table` + `ScrollArea` is the accepted PoC staff grid; routes own
sorting/filtering/paging. Revisit DS-Q-003 and NFR-003 before adding an
enterprise grid or a paid dependency.

Forms keep unsaved fields local, validate before mutation, focus the shared
error summary, and leave correction/retry possible. Successful mutations
update or invalidate visible data and navigate to the result without losing
view context. Customer and Staff themes may differ in density, but shared
components retain consistent semantics, text alternatives, visible focus,
keyboard operation, and responsive layout.

## 9. Localization and authentication

Customer layout text uses the shared translation shape. `en-GB` is authored;
`en-XP` is generated pseudo-locale content proving extraction/layout
readiness, not a real second-language requirement. Do not invent a real
translation or add a full i18n dependency until a language is approved.

`MockAuthProvider`/`useMockActor` are localStorage-backed PoC behavior with no
credential verification or token. The Customer identity is a fixed synthetic
demo actor and Staff's user menu is a placeholder. Neither frontend state nor
an entity ID provides authorization. Future authentication must be enforced by
the API and must revisit URL leakage, credentialed CORS, and error behavior.

## 10. Loading, error, and alternative behavior

Every query-driven route explicitly distinguishes pending, successful empty,
validation failure, not-found, conflict, network/unknown failure, retry, and
successful mutation states. Use `StatusBanner`, `ApiErrorBanner`, and
`FormErrorSummary`; do not inspect free-form exception strings. A failed
payment, allocation, order, or availability operation is never presented as
confirmed. Alternative-date, human-assistance, and other exception paths are
part of route acceptance tests.

## 11. Testing conventions

Use Vitest + React Testing Library for colocated route/component tests and
Playwright for browser tests under `frontend/tests/e2e` against the real API
and seed data. Mocks prove route behavior but not CORS, generated contracts,
routing integration, or database-backed journeys.

New view behavior tests applicable loading, empty, validation, not-found,
conflict, retry, boundary, alternative, keyboard, focus, and responsive
states. URL-backed views test filter/detail round trips, reload, related-link
navigation, back/forward, and the exact display-name-chain-plus-ID label.
Product hierarchy tests assert chip ordering and preserved context.

The root checks are `frontend:typecheck`, `frontend:build`, `frontend:test`,
and `frontend:test:e2e`. E2E and Compose runs remain manual until CI exists;
manual evidence must not be described as automated evidence.

## 12. Rules for future extensions

Before adding a view or shared component, identify its owning application,
route, UX artifact, API operation, and stable requirement/decision references.
Check this document and the design system first; reuse the existing shell,
URL-state, query/error, projection, entity-label, accessibility, and testing
conventions. Add evidence for normal, alternative, error, boundary, and
accessibility behavior. Update this document when a reusable convention is
established; use a decision record when a consequential selection changes.

## 13. Residual constraints and realignment

Real authentication, genuine Customer product search, production responsive
evidence, full data-grid evaluation, CI automation, and real second-language
content remain open. Traveller-based capacity is constrained by #56:
`remainingCapacity` is authoritative and `available` is derived. The #57 ID
policy remains proposed in DR-0021 until accepted.

Reconcile this architecture whenever route, URL-state, API-client, shared UI,
display-link, accessibility, localization, capacity presentation, or testing
conventions change. The implementation and tests provide realization evidence;
requirements and decision records remain authoritative for intent, rationale,
and unresolved risk.

## Decision record index

[DR-0010](../../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md)
selects the shared React platform and keeps client rendering, accessibility,
localization, grid behavior, and performance subject to evidence.
[DR-0013](../../governance/decisions/0013-shared-resource-crud-api-and-openapi-contract.md)
defines the shared capability API and generated TypeScript boundary.
[DR-0015](../../governance/decisions/0015-frontend-thin-slice-testing-i18n-and-catalog-listing.md)
defines React Query, Vitest/RTL, Playwright, Mantine DataTable, pseudo-locale,
explicit CORS, and the honest no-filter Customer catalogue behavior.
[DR-0019](../../governance/decisions/0019-compute-resource-display-projections.md)
defines API-owned display projections; [DR-0021](../../governance/decisions/0021-transaction-safe-prefixed-identifiers.md)
remains the proposed source for the future generated-ID display contract.
