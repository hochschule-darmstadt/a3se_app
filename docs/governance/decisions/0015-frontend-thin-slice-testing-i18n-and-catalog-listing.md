# DR-0015: Frontend thin-slice test stack, i18n demonstration, staff grid, and catalog listing

- Status: accepted
- Owner: Implementation/Architecture
- Date: 2026-08-18
- Supersedes: none

## Context

Issue #22 implements the Customer and Staff Interaction frontend thin slice on top of the scaffold (#19), the shared CRUD API and generated TypeScript client (#21, DR-0013), and deterministic seed data (#12, DR-0014). Several choices DR-0010 explicitly left open had to be resolved to write any route: no frontend test framework was selected (`frontend/tests/README.md` deferred it from #19); DS-Q-003 (whether Mantine `Table` is sufficient for the Staff Interaction grid) was open; FR-002 (interaction-language extensibility) had no chosen mechanism; and the accepted #21 API has no filter/search query parameters on `GET /products` or `GET /stock-items` -- only cursor pagination -- while #22's customer journey calls for "enter travel criteria" and "search the seeded catalog."

## Decision drivers

- #22 must not fabricate business behaviour (filtering/matching) the backend does not genuinely provide, and must record any resulting contract gap rather than emulate it permanently in the frontend.
- #22 must not add a paid or incompatible grid library without recording the DS-Q-003 evaluation.
- FR-002 requires the UI to be *structured* for a second interaction language; no second language content is accepted anywhere in `docs/requirements` today, so inventing translated business copy would silently turn an assumption into a requirement (AGENTS.md rule 3).
- The DoD requires acceptance evidence (normal/alternative/error/boundary) for a merged change; some test automation is therefore required, not optional polish.

## Considered options

- **Search/filter**: implement client-side filtering over listed products/stock-items to approximate a real search. Rejected: this is exactly "emulate business behaviour permanently in the frontend" that #22 forbids; it would also silently hide the real missing backend capability behind seemingly-working UI.
- **Search/filter**: list the full seeded catalog with real server-side (cursor) pagination and no filtering, capturing entered criteria only as context. Accepted: honest about what the current API contract supports; the missing filter/search query parameters are recorded here as an open backend contract gap for a follow-up API change.
- **Test stack**: Jest + jsdom. Rejected: needs separate transform configuration to work with Vite/React Router v7's ESM-first tooling that Vitest gets natively.
- **Test stack**: Vitest + React Testing Library for component tests, Playwright for one browser-level e2e spec per app. Accepted: Vitest shares Vite's config and transform pipeline already in every app/package; Playwright is the practical choice for a true browser-level acceptance run against the real API and seeded Neo4j, which component tests cannot provide.
- **Staff grid (DS-Q-003)**: adopt an enterprise data-grid package (e.g. AG Grid, TanStack Table) now. Rejected for this pass: introduces a new dependency (cost/licence surface under NFR-003) before the seed-data volume (dozens to low hundreds of rows per page) has shown Mantine `Table` insufficient.
- **Staff grid**: Mantine `Table` + `ScrollArea`, with sort/filter/paging state owned by the calling route over one fetched page. Accepted as this thin slice's answer to DS-Q-003 -- explicitly scoped to the current seed-data volume, not a final resolution of the open design-system question.
- **i18n**: adopt a full i18n library (`react-i18next` or similar) and author a second language's business copy now. Rejected: no second language has been decided or approved by any stakeholder; authoring one here would assert an unapproved requirement.
- **i18n**: a minimal shared `translate()` dictionary lookup plus a generated pseudo-locale (`en-XP`, systematic diacritic substitution and bracketing of the same English text) to prove the UI never hard-codes English strings into layout, without asserting real second-language content. Accepted.
- **Query/cache**: hand-rolled `useEffect`/`useState` data fetching per route. Rejected: would duplicate loading/error/retry handling in every route instead of once.
- **Query/cache**: `@tanstack/react-query`, wrapped by `useApiQuery`/`useApiMutation` in `@cct/api-client` so every route gets the same `ApiError` normalization. Accepted; recorded as the chosen query/cache library per #22's own instruction to record such choices.

## Decision

1. `GET /products` and `GET /stock-items` have no filter/search query parameters today. The Customer Interaction "search" step (#22 requirement 2) lists the seeded catalog with real server-side cursor pagination and performs no client-side filtering; entered travel criteria (origin, destination/region, dates, traveller composition) are captured and displayed as context, not used to narrow results. **Contract gap for a follow-up API change:** `/products` and `/stock-items` need filter query parameters (at minimum by product family/type and service date) before a genuine search can be built; this is intentionally not worked around in the frontend.
2. Frontend testing: Vitest + React Testing Library for component/unit tests, colocated beside each route/component per `frontend/tests/README.md`; Playwright for one browser-level e2e spec per app against the real backend and seeded data. New root scripts `frontend:test` and `frontend:test:e2e`.
3. Staff Interaction data grid: Mantine `Table` + `ScrollArea` via the new shared `@cct/ui` `DataTable` component (sort/filter/paging state held by the calling route over one fetched page). This answers DS-Q-003 for the current seed-data volume only.
4. FR-002 demonstration: a shared `@cct/ui` `translate()` dictionary keyed by `Locale` (`"en-GB" | "en-XP"`), where `en-XP` is a generated pseudo-locale, not authored second-language business content.
5. Query/cache: `@tanstack/react-query`, added to `@cct/api-client` and both apps; `useApiQuery`/`useApiMutation` wrap `openapi-fetch` calls and normalize failures through the new `@cct/api-client` `toApiError`/`ApiError` (mirroring `backend/src/cct/api/errors.py`'s `type`/HTTP-status categories) so every route renders failures through one shared `@cct/ui` `StatusBanner`/`ApiErrorBanner`.
6. Authentication remains the documented PoC placeholder: a `@cct/ui` `MockAuthProvider`/`useMockActor` (`localStorage`-backed, no credential verification, no token) mirrors the backend's own placeholder `Actor` (DR-0013). It must not be read as authorization; `#21`'s API remains solely responsible for any future permission enforcement.
7. `backend/src/cct/api/app.py` gains explicit CORS middleware (`CCT_API_ALLOWED_ORIGINS`, defaulting to the Customer/Staff dev-server origins `http://127.0.0.1:4300`/`4301` and their `localhost` equivalents), discovered as a hard blocker only during live browser verification of this issue (curl and every prior backend/API test bypass the browser's CORS enforcement entirely, so #21's 231 passing tests never exercised it). No credentials (cookies/auth headers) are sent by either app, so a fixed allow-list is sufficient without widening to a reflected/wildcard origin.

## Consequences

### Positive

- No fabricated search/matching logic exists anywhere in the frontend; the real capability gap is visible in this record (for `#13`'s eventual evidence matrix to consume) rather than hidden behind a plausible-looking UI.
- One shared error-normalization and status-rendering path (`toApiError`, `useApiQuery`/`useApiMutation`, `StatusBanner`/`ApiErrorBanner`) is reused by every route in both apps instead of being re-derived per screen.
- DS-Q-003 has a recorded, evidenced-for-this-scale answer instead of remaining silently unaddressed.
- Live browser-level verification (not just mocked component tests) caught a genuine cross-cutting defect -- the API was entirely unreachable from a browser without CORS headers -- before it reached a stakeholder demo.

### Negative and risks

- Customer catalog browsing without filtering is not a realistic search experience; a stakeholder reviewing the PoC will see the full seeded catalog rather than matching results. This is the intended, honest reflection of the current API contract, not a defect to silently patch in the frontend.
- The `en-XP` pseudo-locale proves structural i18n-readiness only; it is not evidence that any real second language would fit the same UI without further layout/typography review (longer real translations can still overflow differently than pseudo-localized text).
- Mantine `Table` has not been evaluated against Staff Interaction's full production data volume; if a future dataset is much larger than the current seed data, DS-Q-003 may need to be reopened.
- `@tanstack/react-query`'s cache/retry defaults are used largely as-is for this thin slice; consequential cache-tuning (stale time, retry count) is not evaluated here.

## Validation and revisit triggers

`frontend:typecheck` and `frontend:build` pass for both apps and all shared packages. `frontend:test` (Vitest + RTL) passes: 32 tests across 9 files (19 customer, 13 staff), covering loading/empty/error/validation/not-found/conflict states, the unavailable→alternative-date path, permitted-edit success/validation/conflict, sorting/filtering, and keyboard row activation. `backend:test` passes: 239 tests (up 2 from adding the two new scaffold-directory `README.md` files the architecture test requires), unaffected by the CORS middleware addition.

`frontend:test:e2e` (Playwright) was executed against a real, live stack, not merely written: `docker compose --profile seed run seed` against a fresh local Neo4j, `api` container rebuilt with the CORS fix, both app dev servers pointed at it. All 4 specs pass (2 customer: golden path plus unavailable/alternative-date; 2 staff: golden path plus keyboard tab-order) on repeated runs. This live run surfaced and fixed three real defects the Vitest suites (which mock every fetch) could not catch:

- **Missing CORS middleware** (see Decision item 7) -- without it, every browser request from either app to the API failed outright; curl and `TestClient`-based backend tests never exercise a real browser's CORS enforcement, so this was invisible until a real browser was used.
- Two `frontend/tests/e2e/customer.spec.ts` locator bugs, both instances of checking the DOM synchronously right after a cursor-page fetch instead of polling: `locator.count()` and `locator.isVisible()` do not wait/retry (only `expect(locator).toBeVisible()` does), so the pagination-search helper could skip past the page that actually contained the target product; and a bare `page.locator("div", { has: ... })` matched every ancestor `div` up to the results grid, so its "View details" link resolved to the *first* card on the page rather than the one actually containing the target product id. Both were test-code defects, not application defects -- the same click-through flow, driven directly, always behaved correctly.

Revisit the search/filter decision once `/products`/`/stock-items` gain filter query parameters (frontend should then replace full-catalog listing with real filtered search). Revisit DS-Q-003 if a future dataset volume or required interaction (multi-column filter UI, virtualization) exceeds what Mantine `Table` supports. Revisit the i18n decision once a real second interaction language is requirements-approved. Revisit the CORS allow-list if either app's dev/build port ever changes, or once real authentication introduces credentialed requests.

### Explicit limitations, not solved here

Only `PER-001` is ever assignable as the customer/traveller identity in the Customer app's mock sign-in (a hardcoded PoC demo identity, not a real account system); person/organisation/product/stock-item records are read-only in the Staff app (no edit UI) except an order's `orderStatusCode`; the Staff stock-items view is plain pagination with no per-product lookup (the same missing-filter contract gap as the customer catalogue); the `en-XP` locale is a generated pseudo-locale proving structural readiness, not real second-language content; no CI pipeline runs `frontend:test:e2e` or `docker compose` automatically (both are local/manual today, the same limitation DR-0014 already recorded for its own integration test); and the `frontend/tests/e2e/*.spec.ts` files are not covered by any `tsc --noEmit` gate (Playwright transpiles them at run time but no workspace typechecks them).

## Links

- Issue #22 (Implement Customer and Staff frontend thin slice) in the repository's GitHub issue tracker
- [DR-0010: Python-centred modular technology stack](0010-adopt-python-centered-modular-technology-stack.md)
- [DR-0013: Shared resource CRUD API and OpenAPI contract](0013-shared-resource-crud-api-and-openapi-contract.md)
- [DR-0014: Deterministic seed data and Compose seeding](0014-deterministic-seed-data-and-compose-seeding.md)
- [Design system](../../requirements/ux/design-system/design-system.md)
- [Navigation maps](../../requirements/ux/navigation-maps/navigation-maps.md)
- [Wireframes](../../requirements/ux/wireframes/wireframes.md)
- [Functional requirements](../../requirements/functional-requirements.md)
