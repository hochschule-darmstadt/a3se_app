# Technical Foundation

- Status: draft
- Owner: Implementation
- Last reviewed: 2026-10-21

This record indexes the executable foundation that already exists in the repository, so that `plan-implementation`, `create-tests`, `create-code`, and `operate-ci-cd` can find it without working it out again. It records the current state only: no foundation code or configuration was changed to create it. Manifests, scripts, and configuration remain authoritative for their exact content.

## Baseline and mode

| Concern | Definition |
|---|---|
| Foundation state | **usable** for in-process verification, build, and the interactive local stack; **partial** for isolated Neo4j integration and browser end-to-end runs |
| Operating mode | initial (record only; no foundation changes) |
| Repository state | `main` at `3a209be`; working tree clean |
| Governing baselines | [Project structure](../architecture/software-architecture/project-structure.md), [Technology](../architecture/technology.md) ([DR-0010](../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md), [DR-0015](../governance/decisions/0015-frontend-thin-slice-testing-i18n-and-catalog-listing.md)), [Deployment Architecture](../operations/deployment-architecture/deployment-architecture.md) ([DR-0011](../governance/decisions/0011-use-docker-for-localhost-deployment.md), [DR-0014](../governance/decisions/0014-deterministic-seed-data-and-compose-seeding.md), [DR-0025](../governance/decisions/0025-conditional-local-seed-and-index-refresh.md)), [Test Strategy](../test/test-strategy.md), [CI/CD](../operations/ci-cd.md). Security Architecture has no accepted controls. |

## Established mechanisms

| Mechanism | Source-controlled location | Governing boundary | Smoke evidence | Status and limitation |
|---|---|---|---|---|
| Repository and module structure | [`backend/src/cct`](../../backend/src/cct/README.md), `frontend/apps/{customer,staff}`, [`frontend/packages`](../../frontend/packages/README.md) | [Project structure](../architecture/software-architecture/project-structure.md) | `TF-CHK-006`; architecture tests in `TF-CHK-001` | usable |
| Node runtime and dependencies | Root [`package.json`](../../package.json) (npm workspaces, Node `>=22 <23`), `package-lock.json` | DR-0010, DR-0015; `CICD-002` | `TF-CHK-002` to `TF-CHK-005` | usable |
| Python runtime and dependencies | [`backend/pyproject.toml`](../../backend/pyproject.toml) (Python `>=3.12`, pinned direct dependencies, `test` extra); image uses `python:3.13-slim` | DR-0010; `CICD-002` | `TF-CHK-001` | partial: transitive dependencies are unlocked (`TF-GAP-002`) |
| Backend verification entry point | `npm run backend:check` (compile, then unittest discovery over [`backend/tests`](../../backend/tests/README.md)) | Test Strategy test levels; `CICD-005` | `TF-CHK-001` | usable; the Neo4j suites skip by design |
| Backend unit and API test runtime | unittest, fakes in `backend/tests/support`, FastAPI `TestClient` | `TST-004`, `TST-009` | `TF-CHK-001` | usable |
| Neo4j integration test runtime | [`backend/tests/integration/neo4j`](../../backend/tests/integration/neo4j/README.md), enabled by `CCT_NEO4J_TEST_*` | `TST-006`, `TST-007`; `CICD-006` | `TF-CHK-011` not run | blocked: no isolated test database (`TF-GAP-001`) |
| Frontend typecheck and component tests | `npm run frontend:typecheck`, `npm run frontend:test` (Vitest and React Testing Library beside each feature) | DR-0015 | `TF-CHK-002`, `TF-CHK-003` | usable; end-to-end specs are not type-checked (`TF-GAP-005`) |
| Frontend build | `npm run frontend:build` (React Router build, client-rendered) | Technology; DR-0015 | `TF-CHK-005` | usable; output is ephemeral and ignored by Git |
| Browser end-to-end runtime | [`frontend/tests/playwright.config.ts`](../../frontend/tests/playwright.config.ts) (Playwright 1.56.1, Desktop Chrome, starts both dev servers) | `TST-007`, `TST-011`; `CICD-006` | `TF-CHK-012`, last run 2026-08-18 | partial: needs the interactive stack and its seeded state (`TF-GAP-001`); no viewport projects (`TF-GAP-006`); outputs not ignored (`TF-GAP-004`) |
| HTTP contract generation | `npm run api-client:generate` and `api-client:validate` ([`export_openapi.py`](../../backend/scripts/export_openapi.py), openapi-typescript) | DR-0013; `CICD-009` | `TF-CHK-004` | usable |
| Configuration and secrets | `CCT_*` environment variables; root `.env` excluded from Git supplies the synthetic Neo4j password | DEP-003; `TST-005` | `TF-CHK-009` | usable |
| Local runtime stack | [`docker-compose.yml`](../../docker-compose.yml) (`neo4j`, `api`, `ollama`; profile-gated `seed`, `seed-reset`, `ollama-pull`), [`backend/Dockerfile`](../../backend/Dockerfile), [local development](../operations/local-development.md) | DEP-001 to DEP-006 | `TF-CHK-009`; `TF-CHK-010`, last run 2026-08-18 | partial: see `TF-GAP-003`, `TF-GAP-007`, `TF-GAP-008`, `TF-GAP-009` |
| Data reset and seeding | [`backend/scripts/seed_data.py`](../../backend/scripts/seed_data.py), conditional refresh at API startup | DR-0014, DR-0025 | `TF-CHK-010` | usable for a disposable local graph. There is no forward-migration mechanism; seeding resets and reloads. |
| Specification and diagram validation | `npm run harness:validate`, `architecture:validate`, `diagrams:validate` | [Commit workflow](../governance/workflows/commit-workflow.md#proportionate-checks) | `TF-CHK-006` to `TF-CHK-008` | usable |
| Remote CI | [`harness-validate.yml`](../../.github/workflows/harness-validate.yml) | [CI/CD](../operations/ci-cd.md#remote-ci-boundary) | Runs on PRs and pushes to `main` | usable for harness and architecture only; product checks deferred by CI/CD |

## Foundation checks

All checks below run on the Windows 11 workstation with Node 22.15.0, Python 3.13.3, and Docker 29.7.2.

| ID | Preconditions | Check | Expected result | Latest result and evidence |
|---|---|---|---|---|
| `TF-CHK-001` | Backend installed with the `test` extra | `npm run backend:check` | Exit 0; Neo4j suites reported as skipped | 2026-10-21, `b7a2c02`: pass, 320 tests, 14 skipped, 24 s |
| `TF-CHK-002` | `npm install` done | `npm run frontend:typecheck` | Exit 0 | 2026-10-21, `b7a2c02`: pass, 31 s |
| `TF-CHK-003` | `npm install` done | `npm run frontend:test` | Exit 0 | 2026-10-21, `b7a2c02`: pass, customer 15 files and 96 tests, staff 10 files and 47 tests, 64 s |
| `TF-CHK-004` | Backend and Node dependencies installed | `npm run api-client:validate` | Exit 0; working tree unchanged | 2026-10-21, `b7a2c02`: pass, 8 s |
| `TF-CHK-005` | `npm install` done | `npm run frontend:build` | Exit 0 | 2026-10-21, `3a209be`: pass, 68 s |
| `TF-CHK-006` | none | `npm run architecture:validate` | Exit 0; acyclic module order | 2026-10-21, `3a209be`: pass, 30 module dependencies |
| `TF-CHK-007` | Diagram tooling available (`npm run diagrams:doctor`) | `npm run diagrams:validate` | Exit 0 | 2026-10-21, `3a209be`: pass, 24 s |
| `TF-CHK-008` | none | `npm run harness:validate` | Exit 0 | 2026-10-21, `3a209be` content: pass |
| `TF-CHK-009` | Root `.env` sets `CCT_NEO4J_PASSWORD` | `docker compose config --quiet` | Exit 0 | 2026-10-21, `3a209be`: pass |
| `TF-CHK-010` | Docker running; `.env` present; interactive state may be reset | `docker compose up -d --build api`, then `docker compose ps` | `neo4j` healthy, then `api` running; empty graph seeded | 2026-08-18, issue #12: pass ([Deployment Architecture evidence](../operations/deployment-architecture/deployment-architecture.md#acceptance-evidence)). Not re-run on 2026-10-21, because it would mutate interactive state. |
| `TF-CHK-011` | A disposable database (`TST-006`) | `CCT_NEO4J_TEST_*` set, then `npm run backend:test` | The Neo4j suites run and pass | Not run; blocked by `TF-GAP-001` |
| `TF-CHK-012` | Seeded local stack running | `npm run frontend:test:e2e` | All specs pass | 2026-08-18: 4 specs pass ([DR-0015](../governance/decisions/0015-frontend-thin-slice-testing-i18n-and-catalog-listing.md)). Not re-run on 2026-10-21; until `TF-GAP-001` is fixed, a run needs the exception in `CICD-006`. |

Passing these checks proves only that the mechanisms work. It does not prove product behavior.

## Provisional choices and gaps

| Type | Statement | Owner | Resolution or replacement trigger | Affected delivery work |
|---|---|---|---|---|
| Gap `TF-GAP-001` | There is no disposable test stack. `CCT_NEO4J_TEST_URI=bolt://localhost:7687` reaches the interactive database, and Playwright uses the interactive stack. | Technical Foundation, Operations | A separate Compose project with its own volumes, ports, and test-only password exists and `TF-CHK-011` passes. | Every Slice triggering `TST-007`; until then each needs a `CICD-006` exception. |
| Gap `TF-GAP-002` | Python transitive dependencies are unlocked, so two builds of the same commit can differ. | Technology, Implementation | A lock mechanism is selected under NFR-003 and committed. | Remote CI activation; reproducible builds |
| Gap `TF-GAP-003` | `ollama` and `ollama-pull` use `ollama/ollama:latest`, which DEP-002 prohibits. | Implementation, Deployment Architecture | The image is pinned. | Advisor reviews (`TST-010`); reproducibility |
| Gap `TF-GAP-004` | `test-results/` and `playwright-report/` are not in `.gitignore`, which `CICD-010` relies on. | Implementation | `.gitignore` covers them. | Any Slice running Playwright |
| Gap `TF-GAP-005` | No TypeScript configuration covers `frontend/tests/e2e`, so the specs are not type-checked. | Implementation | A typecheck covers the specs. | Slices changing browser journeys |
| Gap `TF-GAP-006` | There are no Playwright viewport projects for mobile, tablet, and PC widths. | Implementation, Test | Projects exist for the DS-FND-004 exemplars. | Customer-journey Slices (`TST-011`) |
| Gap `TF-GAP-007` | The API has no `/health/live` or `/health/ready` route; Compose gates on Neo4j health only. | Implementation | The DEP-004 endpoints exist. | Readiness-based test orchestration; remote Playwright |
| Gap `TF-GAP-008` | There is no `web` image or frontend Dockerfile; the browser apps run only as dev servers. | Implementation, Architecture | DEP-Q-001 is resolved for `web`. | Any packaging or environment delivery |
| Risk `TF-GAP-009` | Compose publishes Neo4j on 7474 and 7687, contrary to DEP-001. `api` depends on the GPU-bound `ollama` service, so the stack cannot start on a host without a GPU. | Deployment Architecture, Implementation | Compose and Deployment Architecture are reconciled; the Ollama dependency is optional for non-advisor work. | `TF-GAP-001`; remote Playwright |
| Provisional choice | No aggregate local gate script exists; checks are selected manually from the commit workflow. | Implementation | Repeated omissions in Slice reviews, or remote CI activation | All Slices |

## Revision history and readiness

| Date | Mode | Change | Evidence | Result |
|---|---|---|---|---|
| 2026-10-21 | initial | Recorded the existing foundation and its gaps; no foundation changes | `TF-CHK-001` to `TF-CHK-009` run on 2026-10-21; `TF-CHK-010` and `TF-CHK-012` from 2026-08-18 | usable with named gaps |

**Ready for `plan-implementation` and `specify-prototype`:** module structure, Node and Python dependency installation, backend unit and API tests, frontend typecheck, component tests and build, contract generation and drift check, specification validation, and the interactive local stack.

**Not available:**
- Isolated Neo4j integration and browser end-to-end runs (`TF-GAP-001`). A Slice triggering `TST-007` names this gap in its plan and records a `CICD-006` exception.
- Responsive viewport tests (`TF-GAP-006`).
- Health-based orchestration (`TF-GAP-007`).
- Packaging of the web apps (`TF-GAP-008`).
- Reproducible Python builds (`TF-GAP-002`).

This record makes no claim about product correctness, release readiness, or production readiness. AI compiled it from the repository and the 2026-10-21 check runs. The local stack and Playwright were not re-run, to avoid mutating interactive state, so their evidence is dated 2026-08-18.
