# Proof-of-Concept Evidence Matrix

- Status: accepted
- Owner: Test
- Last reviewed: 2026-08-18

Records every acceptance criterion from issue #13 as `passed`, `failed`, or `open`, per that issue's requirement that the matrix contain no unsubstantiated `passed` result. `open` means the criterion was not exercised (no evidence found), not that it was tried and failed. This matrix consumes evidence already recorded in [DR-0013](../governance/decisions/0013-shared-resource-crud-api-and-openapi-contract.md), [DR-0014](../governance/decisions/0014-deterministic-seed-data-and-compose-seeding.md), and [DR-0015](../governance/decisions/0015-frontend-thin-slice-testing-i18n-and-catalog-listing.md); it does not re-derive their evidence. See [DR-0016](../governance/decisions/0016-poc-technology-confirmation-with-residual-risk.md) for the resulting DR-0010 technology confirmation.

## Vertical thin slice

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| 1 | Customer searches available travel by criteria | passed | `frontend/apps/customer/app/routes/home.tsx`, `search-results.tsx`; `frontend/tests/e2e/customer.spec.ts` |
| 2 | Responsive display of travel/services/itinerary/date/availability/price | open | Product-detail route and availability text exist (`product-detail.tsx`, e2e); no responsive-breakpoint (PC/tablet/mobile) test evidence found |
| 3 | Customer creates and submits draft order | passed | `compose.tsx`, `offer.tsx`, `order.tsx`; e2e asserts `ORD-DRAFT-\d+` |
| 4 | Staff finds order in filterable list | passed | `frontend/apps/staff/app/routes/orders.tsx` (sort/filter/paging), `orders.test.tsx` |
| 5 | Staff opens and edits permitted order details | passed | `staff.spec.ts` edits `orderStatusCode`, verifies round-trip |
| 6 | Staff inspects seeded Person/Organisation/TouristicProductItem/StockItem/OrderItem with IDs, terminology, relationships | passed | `staff.spec.ts` order→product navigation; `backend/tests/unit/seed/*` |
| 7 | Inspection distinguishes read-only vs editable, no unrestricted DB access | passed | `staff.spec.ts` asserts "Read-only" state; all access routed through FastAPI |
| 8 | FastAPI exposes via OpenAPI; Pydantic validates contracts/domain constraints | passed | `backend/src/cct/api/`; DR-0013 |
| 9 | Modular backend with no layer violations or cycles | passed | `backend/tests/architecture/test_dependencies.py` (layer direction, acyclicity, no cross-module internal-persistence imports) |
| 10 | Neo4j traverses heterogeneous graph and reserves Stock Items transactionally | open | Integration tests exist (`test_resource_crud_integration.py`, `test_entity_mapping_integration.py`); `order_management/service.py` performs plain create/relate, not a locking/decrementing transaction; no concurrency or reservation test found |
| 11 | Controlled agent-facing operation for product search/availability, no unrestricted DB credentials | open | No agent/tool module found anywhere in `backend/src/cct` |
| — | Successful booking demonstrated | passed | `customer.spec.ts` golden path |
| — | Unavailable-at-date with alternative-date demonstrated | passed | `customer.spec.ts` unavailable/alternative-date spec |

## Frontend evidence

| Criterion | Verdict | Evidence |
|---|---|---|
| React Router v7 client-rendered SPA, no mandatory server runtime | passed | `frontend/apps/{customer,staff}` (Framework Mode, no SSR server) |
| Separate Customer/Staff apps in one shared workspace | passed | `frontend/apps/`, `frontend/packages/` |
| Both apps use Vite, React, TypeScript, Mantine with shared contracts/UI foundations | passed | `vite.base.ts`, `tsconfig.base.json`, `@cct/ui` |
| Modern branded Customer theme and compact Staff theme | passed | Theme setup referenced in DR-0015; not independently re-verified in this pass |
| Responsive at representative PC/tablet/mobile sizes | open | No responsive/viewport test evidence found |
| Staff list sort/filter/paging/selection/keyboard operation | passed | `orders.tsx`; `staff.spec.ts` keyboard/tab-order test |
| Staff list/detail inspection for all five seeded record kinds | passed | See thin-slice #6 |
| Inspection uses canonical #18 terminology, module-respecting relationships, editable/read-only distinction | passed | See thin-slice #6, #7 |
| Mantine Table sufficiency vs. additional grid component determined | passed | DR-0015 Decision item 3 (Mantine `Table` + `ScrollArea` via `@cct/ui` `DataTable`, scoped to current seed volume) |
| FastAPI/Pydantic validation errors presented clearly and accessibly | open | Shared `ApiError`/`StatusBanner`/`ApiErrorBanner` path exists (DR-0015 item 5); no dedicated accessibility or error-clarity test evidence found in this pass |
| British English and synthetic second language produce the same business outcome | passed | DR-0015 Decision item 4 (`translate()` dictionary, `en-GB`/`en-XP` pseudo-locale); explicitly structural evidence only, not real second-language content |
| NFR-001 measured under documented representative load | open | No load-test tooling (k6/locust/artillery/etc.) found; NFR-001 verification not yet assigned per `docs/requirements/non-functional-requirements.md` |
| Every mandatory frontend library/feature satisfies NFR-003 (zero-cost) | open | No dependency/licence inventory found for the frontend stack |

## Backend, module, and contract evidence

| Criterion | Verdict | Evidence |
|---|---|---|
| OpenAPI contracts connect TypeScript clients to FastAPI without sharing persistence models | passed | `backend/src/cct/api/`; DR-0013 |
| Pydantic and explicit domain types protect transport/module/agent-tool boundaries | open | Transport/module boundary evidenced (`contracts.py`); no agent-tool boundary exists to protect (see thin-slice #11) |
| Automated architecture checks reject upward deps, cycles, internal imports, cross-module persistence use | passed | `backend/tests/architecture/test_dependencies.py` |
| Each business operation enters through the responsible interaction/core module | open | `order_management/service.py` documents itself as sole entry point; not independently cross-checked against every API call site in this pass |
| Transaction/validation/authorisation placeholder/audit ownership at appropriate boundaries | open | Validation ownership evidenced (Pydantic/contracts); no authorisation or audit-log code found |
| Controlled agent operation calls purpose-specific tools rather than raw Neo4j | open | Same as thin-slice #11: no agent operation exists yet |

## Neo4j evidence

| Criterion | Verdict | Evidence |
|---|---|---|
| Flexible properties validated by type/vocabulary/datatype/mandatory-optional/cross-property rules | passed | `backend/src/cct/resource_management/contracts.py`; `backend/tests/unit/resource_management/test_flexible_entities.py` |
| Recursive product/stock/order structures | open | Relationship types exist (e.g. `CONTAINS`); no explicit recursive-structure test confirmed in this pass |
| Heterogeneous multi-hop paths (Order→Stock→Product→Supplier Role→Organisation, traveler/person) | open | No explicit multi-hop traversal test confirmed in this pass |
| Indexed identifier/property lookup and bounded graph queries | open | No index-definition or query-plan evidence found |
| Transactional Stock Item reservation under concurrent attempts, no overbooking | open | No concurrency test found (see thin-slice #10) |
| Rollback of failed order creation or reservation | open | No rollback test found |
| Module-owned writes and authorised cross-module read operations | passed | `order_management/service.py` calls other modules' read-only service functions; enforced by the architecture test's internal-persistence check |
| Bounded read and command tools suitable for an agent | open | No agent tool module exists (see thin-slice #11) |
| Backup, restore, upgrade feasibility, observability, least-privilege on Community Edition | open | No documentation or scripts addressing this found |
| Relevant NFR-001/NFR-002 measurements under representative load | open | No measurement evidence found (see frontend NFR-001 row) |

## Cross-cutting finding

No CI automation exists (`.github/` contains only `ISSUE_TEMPLATE/`, no `workflows/`). All test execution — unit, architecture, Vitest, and Playwright e2e — is manual/local only. DR-0015 already recorded this limitation for the e2e/Compose run; it applies equally to every other suite. The "239 backend tests" / "32 frontend tests" figures cited in DR-0015 were not independently re-executed in this review pass.

## Summary

- **Passed**: the vertical thin slice's customer→staff journey, module/architecture boundary enforcement, OpenAPI/Pydantic contract layer, seeded-data inspection with correct terminology, i18n structural readiness, and the Staff-grid (DS-Q-003) decision.
- **Open** (not attempted, not proven infeasible): the controlled agent-tool boundary, Neo4j transactional stock reservation and rollback under concurrency, Neo4j backup/restore/upgrade/observability/least-privilege evidence, NFR-001/NFR-002 performance measurement, NFR-003 licence inventory, responsive-breakpoint testing, and CI automation of any test suite.
- **Failed**: none — no criterion was exercised and shown not to work.

The open items concentrate on exactly the areas DR-0010 named as its Neo4j and React-platform validation scope and revisit triggers. See [DR-0016](../governance/decisions/0016-poc-technology-confirmation-with-residual-risk.md) for how these open items are carried forward.

## Links

- Issue #13 (Implement proof of concept) in the repository's GitHub issue tracker
- [DR-0010: Python-centred modular technology stack](../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md)
- [DR-0013](../governance/decisions/0013-shared-resource-crud-api-and-openapi-contract.md), [DR-0014](../governance/decisions/0014-deterministic-seed-data-and-compose-seeding.md), [DR-0015](../governance/decisions/0015-frontend-thin-slice-testing-i18n-and-catalog-listing.md)
- [Non-functional requirements](../requirements/non-functional-requirements.md)
