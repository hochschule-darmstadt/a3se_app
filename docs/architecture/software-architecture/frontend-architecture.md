# Frontend Architecture

- Status: accepted
- Owner: Architecture/Implementation
- Last reviewed: 2026-08-31

This document is the authoritative frontend architecture for the Customer and
Staff Interaction applications. It specifies conventions already realized by
the current implementation and conventions that future frontend extensions
must follow. It complements the technology-neutral [modular software
architecture](software-architecture.md), the repository mapping in [project
structure](project-structure.md), and the technology rationale in
[DR-0010](../../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md).
It records implementation guidance, not new technology or business
requirements. A future extension may challenge this guidance only with code,
test, and architecture evidence and, where the choice is consequential, a
decision record.

## Workspace and application boundaries

The two React Router v7 Framework Mode applications are independently runnable
workspaces: `frontend/apps/customer` owns Customer Interaction routes and
`frontend/apps/staff` owns Staff Interaction routes. Shared transport code is
in `frontend/packages/api-client`; shared Mantine presentation, shell,
status, authentication-placeholder, and localization primitives are in
`frontend/packages/ui`. The applications consume the same capability-oriented
API; the API is not split into customer and staff clients.

## Routing and URL state

Each application declares its route tree in `app/routes.ts` using the React
Router route configuration (`index` and `route`). Route modules own the view
for a URL and are composed through `root.tsx`, which provides the application
shell and shared providers. Route-level `meta()` functions provide document
titles, and the root `ErrorBoundary` is a last-resort application fallback;
feature routes handle expected loading and API failures themselves.

Navigation state that must survive refresh, browser history, or a copied link
is encoded as URL search parameters. This includes the Customer journey's
criteria and selected product/order context, and Staff list filters, selected
detail, panel, position, and page state. Staff routes use the shared
`staff-view-state` helpers to validate and patch these parameters. Transient
input and form state remains local to the component with React state. No
general client-side store is used.

The Customer application is configured as an SPA (`ssr: false`); routes should
not assume server-side loaders or server-only data access. The current
implemented data path is browser-side API access.

## Data loading and API access

Routes call the shared `apiClient` from `@cct/api-client`. It is one typed
`openapi-fetch` client generated from the FastAPI OpenAPI contract, and
consumers use typed path operations such as `client.GET(...)` and
`client.PUT(...)`; operation-specific wrapper methods are not generated.

`@tanstack/react-query` owns request lifecycle and cache state. The shared
`useApiQuery` and `useApiMutation` wrappers normalize the `{ data, error,
response }` result from `openapi-fetch` into `ApiError`. `useCursorPage` adds a
client-side cursor stack for endpoints exposing only a forward `nextCursor`.
The Staff product tree uses `useAllPages` where matching must cover the whole
small synthetic catalogue; that helper has a documented 50-page defensive
bound and is not a general large-dataset strategy.

Mutations invalidate affected query keys through the application `QueryClient`
after success. The API client package remains transport-focused; route and
feature modules decide which data a screen needs and how it is presented.

## Components, state, and shared UI

Feature behavior is colocated with route modules and route-specific helpers.
The shared `@cct/ui` package supplies Mantine providers and the reusable
`CustomerShell`/`StaffShell`, `StatusBanner`/`ApiErrorBanner`, `FormErrorSummary`,
`DataTable`, cursor pager, cards, icons, design tokens, and `translate()`.
The calling route owns filtering, sorting, and paging state; `DataTable` is a
thin accessible Mantine `Table` + `ScrollArea` wrapper rather than a business
data-grid. The Staff shell owns navigation presentation while each route owns
its screen content and URL-state transitions.

The Customer app uses the shared `MockAuthProvider` and a local locale context.
The mock actor is a PoC placeholder and carries no credential or authorization
meaning. `en-GB` is the authored locale and `en-XP` is generated pseudo-locale
content used to demonstrate structural localization readiness. Staff currently
uses the shared UI foundation without a real staff authentication mechanism.

## Loading, empty, and error handling

Expected request states are explicit in each route: loading uses
`StatusBanner`, empty results use its empty state, and normalized failures use
`ApiErrorBanner` with retry where retry is meaningful. Form validation uses the
focus-moving `FormErrorSummary`; mutation failures remain visible and do not
pretend that an operation succeeded. The API error categories mirror the
backend's stable `ErrorResponse` categories and distinguish validation,
not-found, conflict, network, and unknown outcomes.

The Customer catalogue criteria are currently retained as URL context while
the backend list contract supplies cursor pagination; the frontend does not
invent client-side business matching. This is the explicit contract boundary
recorded in [DR-0015](../../governance/decisions/0015-frontend-thin-slice-testing-i18n-and-catalog-listing.md).

## Testing conventions

Vitest and React Testing Library test route and component behavior beside the
feature under test. Tests cover meaningful state transitions such as loading,
empty, validation, not-found, conflict, retry/error, URL-state behavior, and
keyboard interaction. `frontend/tests/e2e` contains Playwright browser tests
for the Customer and Staff journeys against the real running API and seeded
data. The root scripts are `frontend:test` and `frontend:test:e2e`; type and
production-build checks run through each workspace.

The e2e suite is an explicit integration check, not a replacement for
isolated route tests. It is currently run manually and is not covered by CI;
the current limitations remain those recorded in [DR-0015](../../governance/decisions/0015-frontend-thin-slice-testing-i18n-and-catalog-listing.md).

## Extension rules and issue traceability

Feature code stays inside its owning Customer or Staff application unless the
behavior is genuinely shared. Shared API and UI packages must not import an
application. New screens are route modules with colocated helpers and tests;
cross-application integration and browser tests belong under `frontend/tests`.
The shared `CustomerShell`/`StaffShell` remains the composition boundary, with
its landmarks, skip link, keyboard behavior, responsive profiles, and explicit
placeholder authentication preserved.

List screens use declared cursor pagination and server-side predicates where
available. Full-catalog fetching is allowed only for a bounded cross-page
projection such as the Staff product hierarchy; a missing backend capability
must not become permanent client-side business logic. Customer criteria remain
URL context until genuine product matching exists in the API.

The UI consumes API-owned `displayName` and `displayNameChain` projections and
joins chains with ` · ` only for presentation. Product hierarchy navigation is
immediate-parent through root, preserves Staff URL state, and uses the
existing Mantine `Badge` chip pattern for ancestor and component links. Future
capacity UI treats `remainingCapacity` as the source of truth and `available`
as derived; it does not reintroduce individual seat/room entities or a second
capacity calculation (#50, #51, #53, #56). Generated IDs are identifiers, not
secrets. Once the proposed ID policy in #57/[DR-0021](../../governance/decisions/0021-transaction-safe-prefixed-identifiers.md)
is accepted, new UI must show the single order ID and must not add a separate
order-number concept.

New route tests cover applicable loading, empty, validation, not-found,
conflict, retry, unavailable/alternative, keyboard, focus, and responsive
states. Shared view-state tests cover filter/detail round trips, reload,
related-record navigation, and browser back/forward restoration.

| Issues | Conventions carried forward |
|---|---|
| #19, #27 | Two feature-oriented apps, shared packages, shell composition, accessibility, and responsive profiles |
| #28–#33 | Staff MVP views, list/detail patterns, shared API/UI use, and explicit deferred scope |
| #21, #22 | OpenAPI client, query/cache wrappers, cursor pages, honest search contract, Vitest, and Playwright |
| #50, #51, #53 | Display projections, URL-restorable navigation, and hierarchy/component chips |
| #56, #57 | Traveller-based capacity presentation and transaction-safe prefixed ID display rules |

## Continuous realignment

This architecture must be reconciled when a route, provider,
API-client convention, shared UI primitive, or testing convention changes.
The change workflow requires the implementation and this document (and any
affected architecture or decision link) to be realigned in the same coherent
change. Incidental code details should remain undocumented unless they are
repeated, intentional conventions.

## Authority and limitations

The current codebase and its tests are the source for the realized claims
above. Accepted
requirements, decisions, and the technology-neutral architecture remain
authoritative for intent and rationale. Open choices are not silently closed
by this document: authentication, real server-side product search, responsive
breakpoint evidence, and CI automation remain follow-up concerns identified in
the linked decisions.
