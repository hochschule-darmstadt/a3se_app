# Frontend Architecture

- Status: accepted
- Owner: Architecture/Implementation
- Last reviewed: 2026-09-15

This document is the authoritative frontend architecture for the Customer and
Staff Interaction applications. It specifies the conventions already realized
in the repository and the conventions every future frontend extension shall
follow. It is the implementation companion to the technology-neutral
[modular software architecture](software-architecture.md), the repository
mapping in [project-structure.md](project-structure.md), and the accepted
technology profile in
[DR-0010](../../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md).

This document extends the decisions made in issues #19, #21, #22, #27–#33,
#47, #50–#53, #56, and #57. Those work items explain delivery scope and evidence;
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
| Touristic product catalogue, #31 / #60 | Use the recursive product tree, supplier context, display-name chains, bounded hierarchy reads, and list/detail state; render the optional backend-owned product description in customer and staff product detail views |
| Inventory, #32 | Show dated stock, represented product context, supplier context, capacity and availability projections; preserve product/stock ownership boundaries |
| Travel orders, #33 | Show order headers, positions, customer/traveller/stock/product context and order status; keep unresolved positions and payment-dependent states truthful |

The customer My orders view uses the order summary collection as the selectable
list and loads the bounded order-detail projection for the selected order. It
renders the order number, lifecycle status, customer, service-date range,
indicative total, and one structured card per position. Position cards retain
the backend identifiers and show the resolved product chain, service date,
price, stock reference, and assigned travellers; missing stock or traveller
data is labelled as unresolved rather than presented as confirmed. Stock
details are fetched only for the selected order's positions.

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
profiles, Staff primary navigation, and shared branding/icons. The staff logo
is a home link like the customer logo; both applications expose the icon-only
Waypoint mark as the browser-tab favicon. Views must not
recreate shell chrome locally. New navigation requires corresponding
navigation-map/wireframe evidence. Legal/imprint text and real staff login
remain deferred until confirmed.

The Customer footer has content-dependent height and remains in normal document
flow. It must not use fixed positioning because that would cover the final
controls or content on long and responsive pages.

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

The Customer traveller-selection step is a modal overlay over the current
portal context, not a replacement full-page view. Its `returnTo` URL parameter
is preserved through sign-in; adding a position returns to that originating
view (normally the search result or product detail), while closing the modal
returns there without changing the session-scoped Travel aggregate.

VIEW-C-007 is delivered as a customer-wide advisor surface: the application
root mounts the shared `AdvisorConversation` component, whose launcher remains
available on every customer route and whose right-side drawer carries the
current confirmed context. The `/assistance` route makes the related-order,
current-issue, confirmed-state, and future handover context explicit. This
phase uses the grounded Q&A service from #46 and the client-side planning
action boundary for #47 documented below. Real staff handover remains separate
implementation work.
The advisor transcript is memory-only frontend state owned by the root-mounted
customer advisor. It survives customer-route changes and the sign-in redirect
within the current page lifecycle, but a reload, a new or duplicated tab,
another browser, or sign-out starts a new transcript. Each request sends prior
customer/advisor turns as bounded conversation memory and sends confirmed facts
through the separate `confirmedContext` contract; the backend does not retain
either between requests.

### 3.1 AI Travel Advisor: implemented frontend

The customer application mounts `CustomerAdvisor` from `root.tsx`, so the
launcher and right-side Mantine drawer are available on every customer route.
The shared `AdvisorConversation` component owns the visible transcript,
composer, submit state, automatic scroll-to-latest behaviour, and incremental
NDJSON rendering. The welcome message is presentation-only and is not sent as
conversation history.

The transcript is not persisted in browser storage. On startup the customer app
removes the retired `cct.customer.advisor.conversation.v1` and `.v2` keys so
transcripts written by earlier builds cannot be restored. Before a request, the
component removes empty messages, excludes the welcome message, and sends at
most the last twenty customer/advisor turns. The customer app reads validated entries from
`cct.customer.advisor.confirmed-context.v1` and sends them as
`confirmedContext`; ordinary transcript messages are never converted into
confirmed facts. There is currently no customer UI action that writes new
confirmed-context entries, so this store is normally empty until a view
integration supplies confirmed facts.

Requests use `POST /advisor/answer/stream` with `message`, `conversation`, and
`confirmedContext`. The response is newline-delimited JSON: each `chunk` is
appended to the active advisor message immediately and the final `complete`
event supplies the answer state. The frontend does not perform retrieval,
interpret product data, or simulate streaming after completion. There is no
server-side conversation identifier or cross-device persistence. The customer
home advisor action navigates to `/assistance`, where the shared advisor drawer
opens automatically while the route's explanatory context remains available
behind the overlay.

VIEW-C-011 and VIEW-C-012 share one account page with an in-page mode switch.
Registration persists a Person and active `person/customer` role through the
generated API client and stores the returned Person identifier. Sign-in
resolves an existing active customer by exact email and stores that returned
identifier; it never substitutes a seeded Person ID. Password verification,
tokens, and production sessions remain outside this MVP mechanism.

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

Both portal shells expose the same Back and Forward controls. They operate on
the browser/router history rather than maintaining a second application
history stack, so the controls preserve URL-backed filters, selections,
pagination, and return paths. They appear immediately after the logo/page
identity at the left side of both headers, in browser order, and use the
secondary blue action token; My travel remains the Customer shell's warm
primary action and the user control remains neutral on the dark navigation
surface.

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

The pre-order customer Travel is the narrow exception to URL-backed view state.
It is a session-scoped aggregate stored under one versioned `sessionStorage`
key and exposed only through the Customer application's `TravelProvider`.
Pending add-to-travel data survives the sign-in `returnTo` round trip;
travellers created in the selection view remain client-only and reusable until
successful atomic placement. Sign-out and successful placement clear the
Travel. Search criteria and record selection remain URL state, and persisted
orders remain server state. New customer flows must not introduce another
browser store without revisiting this boundary.

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
missing backend search capability. The Customer catalogue sends location or
theme text and the requested service-date interval to `GET /catalogue-search`.
The backend searches generated StockItem `searchText` projections, filters
sellable dates, and returns one product-level result with aggregated available
dates. The portal also offers a product-type criterion, defaulting to `All`;
when a concrete type is selected it is passed as `productType` to the same
catalogue projection. Traveller count is carried as search context until
booking confirmation can evaluate capacity and pricing.
The home date picker defaults latest return to one day after a newly selected
earliest departure when no return date is already present. Search result cards
use the backend-provided `displayNameChain` joined with ` · ` as their title;
available service dates are presented only through the per-product dropdown,
not as a separate date list in the card body.

Staff date-range filters follow the same rule: selecting a From date defaults
To to the following day, and clearing From clears the derived To value. This
is applied consistently to Orders and Inventory; users may subsequently edit
To independently.

Stock availability is resolved by querying the backend with `productId` and
the candidate service-date range. The frontend stores and submits the
returned `StockItem.entityId`; it must not fabricate an ID from product/date
values or treat `remainingCapacity` as a frontend-derived convention.

## 6.1 Client-side AI travel-agent composition (#47)

The frontend owns the editable My Travel composition. It stores the current
travellers, positions, and pending selection in the versioned `sessionStorage`
state managed by `frontend/apps/customer/app/lib/travel.tsx`. There is
deliberately no server-side draft aggregate for the advisor workflow. The
backend may return typed candidates, diagnostics, and proposed actions, but it
does not persist or hold the composition.

The customer advisor in `frontend/apps/customer/app/advisor.tsx` keeps two
interaction paths: ordinary knowledge questions use the existing streaming RAG
endpoint; planning-shaped requests use `POST /advisor/compose`, whose typed
response carries action data back to the client. Composition is multi-turn, and
the answers it asks for ("Berlin", a travel partner's name, a month) carry no
planning keyword of their own, so once composition has started every following
turn stays on the compose endpoint until a draft is proposed. This keeps the
generative path out of planning, where it has no authority over availability
and must never report a booking. Before applying returned actions the client
ensures the signed-in customer exists as the `self` traveller, because
positions are expanded per traveller.

The client applies only the bounded action vocabulary through `TravelProvider`:
`add-traveller`, `add-position`, `remove-position`, `replace-position`, and
`reorder-positions`. An `add-traveller` action contains the user-provided
client traveller ID, display name, given name, and family name. An add-position
action contains an authoritative StockItem ID,
product ID, service date, price, currency, display-name chain, and optional
traveller IDs. If traveller IDs are omitted, the action expands to the current
client travellers. Invalid or incomplete action payloads are ignored and the
existing state is retained. These operations are local state transitions; they
do not mean that capacity is allocated or reserved.

The My Travel order path includes a compatibility migration for older
session-storage drafts: if a new traveller has only a display name, the client
derives the given and family names immediately before calling `/orders/place`.
The API remains strict and authoritative; the migration does not create a
reservation or bypass order validation. A newly returned `add-traveller` action
also updates an existing client entry with missing structured names, so a
repeated advisor conversation repairs the local draft.

The action contract is one-way: the frontend can apply returned draft changes,
but the advisor UI has no client path to `/orders/place`. Final ordering remains
the explicit control on the My Travel route. That route submits the current
client state through the existing order API, where authoritative availability,
traveller assignments, capacity, and transaction rules are revalidated. A
failed order does not convert a draft action into a reservation.

The backend graph and this client boundary are separated as follows:

```text
advisor message
      |
      +--> RAG question --------> streaming answer
      |
      +--> planning request ----> typed candidates/diagnostics/actions
                                      |
                                      v
                            TravelProvider session state
                                      |
                                      v
                             user reviews/modifies
                                      |
                                      v
                              explicit Order button
                                      |
                                      v
                                /orders/place
```

The frontend must not reconstruct business semantics from action text,
product metadata, or guessed IDs. It renders API-provided projections and uses
backend diagnostics for plausibility. Assumptions, unresolved gaps, changed
components, and action failures must be visible and reversible. The UI must
never display “reserved” or “allocated” for a client draft unless the
authoritative order/inventory response says so.

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

Entity chips must use the icon for the entity represented by that chip, never
the icon of the detail view or the preceding entity in a hierarchy. Mixed
chains are expected: an order-position hierarchy uses order for the
order/position chip, inventory for the StockItem chip, catalogue for product
and ancestor chips, supplier for organisation/role chips, and person for
customer/traveller chips. Shared chip primitives must therefore receive an
explicit icon or apply a documented semantic entity-kind mapping; they must
not use an unrelated default icon. Detail-panel tests shall cover a mixed
chain and verify icon ownership for each chip.

## 8. Shared UI, forms, and presentation states

Use `@cct/ui` and design tokens before creating local equivalents:
`StatusBanner`, `ApiErrorBanner`, `FormErrorSummary`, `DataTable`,
`CursorPager`, `ResourceCard`, `OfferSummary`, shells, icons, and themes.
Mantine `Table` + `ScrollArea` is the accepted PoC staff grid; routes own
sorting/filtering/paging. Revisit DS-Q-003 and NFR-003 before adding an
enterprise grid or a paid dependency.

Customer catalogue search renders one cursor pager after populated results,
following the established portal reading flow. The route owns the cursor stack
and the shared `CursorPager` owns button semantics.

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

`MockAuthProvider`/`useMockActor` implement client-only PoC identity: the
synthetic Customer actor is stored in browser `localStorage`, while no
credential is verified and no token is issued. Sign-out removes that identity,
clears the Customer's session-scoped Travel draft and confirmed context, and
resets the memory-only advisor transcript. A new or duplicated browser tab and
a page reload also start with an empty transcript; the Travel draft and
confirmed context remain tab-scoped in `sessionStorage`. Staff's user menu remains a placeholder.
Neither frontend state nor an entity ID provides authorization. Future real
authentication must be enforced by the API and must revisit URL leakage,
credentialed CORS, and error behavior.

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
and explicit CORS. Its original no-filter catalogue limitation has since been
superseded by the implemented `/catalogue-search` projection.
[DR-0023](../../governance/decisions/0023-product-level-location-aware-catalogue-search.md)
defines the current location-aware StockItem search projection and product-level
result contract.
[DR-0019](../../governance/decisions/0019-compute-resource-display-projections.md)
defines API-owned display projections; [DR-0021](../../governance/decisions/0021-transaction-safe-prefixed-identifiers.md)
remains the proposed source for the future generated-ID display contract.
[DR-0026](../../governance/decisions/0026-use-langgraph-for-client-draft-travel-composition.md)
defines the LangGraph orchestration boundary and the browser-owned draft
action model.

Staff routes do not render a breadcrumb trail. The persistent staff-area
sidebar is the authoritative navigation context; route-level breadcrumb data,
where retained for shared route signatures, is intentionally ignored by the
staff shell.
