# CI/CD

- Status: draft
- Owner: Operations/Implementation/Test
- Last reviewed: 2026-10-21

## Purpose and authority

This baseline defines how source states of this repository are verified during regular Slice delivery after the Basic Concept: the MVP iteration ([#23](https://github.com/hochschule-darmstadt/a3se_app/issues/23)) and later Slices under the [Agent Workflows](../governance/workflows/agent-workflows/agent-workflows.md). It covers one developer workstation running the [localhost deployment](deployment-architecture/deployment-architecture.md) and the existing GitHub Actions [harness validation job](../../.github/workflows/harness-validate.yml). No other environment exists ([DEP-Q-004](deployment-architecture/deployment-architecture.md#open-questions)).

Authority stays with the owning artifacts:

- [Test Strategy](../test/test-strategy.md) owns the required checks, scope triggers (`TST-007`, `TST-010`, `TST-011`), evidence semantics, and the Slice readiness gate.
- The [commit workflow](../governance/workflows/commit-workflow.md#proportionate-checks) owns the mapping from changed paths to checks. This baseline refers to that table rather than repeating it ([DR-0030](../governance/decisions/0030-move-commit-checks-into-commit-workflow.md)).
- [Technology](../architecture/technology.md) and its decisions own the selected build and test mechanisms.
- [Deployment Architecture](deployment-architecture/deployment-architecture.md) owns runtime topology, configuration names, data classes, and recovery needs.
- [Security Architecture](../architecture/security.md) owns control objectives; none is accepted yet.
- Root [`package.json`](../../package.json) scripts, [`docker-compose.yml`](../../docker-compose.yml), and workflow files implement this contract. They do not redefine it.
- This baseline owns the orchestration of local and remote verification, build and artifact boundaries, failure behavior, delivery evidence, and the activation conditions for deferred capabilities.

Passing automation is supporting evidence for a [Slice review](../../.agents/skills/review-slice/SKILL.md). It is not acceptance, security approval, release authorization, or production readiness.

## Current delivery scope

| Capability | Current-stage position |
|---|---|
| Focused developer feedback | Required. Available through the test runners (unittest, Vitest, Playwright) for single modules, files, or specs. |
| Complete local verification | Required (`CICD-004`). Available as separate root npm scripts selected through the commit workflow; there is no single aggregate entry point. All default checks passed on 2026-10-21 (see [evidence](#current-evidence)). |
| Neo4j integration verification | Required by `TST-007`. The suites exist but are skipped unless `CCT_NEO4J_TEST_*` is set. There is no isolated test database: the documented URI reaches the interactive Compose database. **Gap** (`CICD-006`). |
| Browser end-to-end verification | Required by `TST-007` and `TST-011`. Playwright exists but runs against the interactive stack and seeded state. There is no isolated test stack and no viewport projects. **Gap** (`CICD-006`). |
| Build and packaging | `frontend:build` and the local `cct-backend:local` image exist. Outputs are ephemeral and not governed artifacts. The `web` image does not exist ([DEP-Q-001](deployment-architecture/deployment-architecture.md#open-questions)). |
| Migration verification | Not applicable. There is no migration mechanism; seed refresh is reset-and-reload ([DR-0025](../governance/decisions/0025-conditional-local-seed-and-index-refresh.md)). |
| Remote CI | Active only for `harness:validate` and `architecture:validate`. Remote execution of product checks is **deferred** (project owner, 2026-10-21). |
| Artifact publication, promotion, environment delivery, rollback, recovery, operational handoff | Absent and deferred. There is no consumer and no environment beyond localhost. |

Local verification is not continuous integration. The only automated integration event is the harness job.

## Local agent verification contract

| ID | Current rule |
|---|---|
| `CICD-001` | Developers and agents SHALL use the root `package.json` scripts as the entry points for governed checks. A check reported as run SHALL be run through its script, not through an ad hoc equivalent. |
| `CICD-002` | Dependencies SHALL be installed from committed manifests: Node packages from `package-lock.json` under Node 22, and the backend from `backend/pyproject.toml` including its `test` extra. Python SHOULD be 3.13 to match the backend image. A change SHALL NOT alter `package-lock.json` or the pinned dependencies unless a dependency change is in scope. |
| `CICD-003` | During implementation, developers and agents SHOULD run the narrowest affected tests for fast feedback. Focused results SHALL NOT be reported as the complete gate. |
| `CICD-004` | Before proposing a commit or claiming Slice readiness, every check triggered by the commit workflow and by `TST-007`, `TST-010`, and `TST-011` SHALL run against the final source state, after the last edit. The report SHALL state each check as ran, skipped, or failed. |
| `CICD-005` | The default checks (`backend:check`, `frontend:typecheck`, `frontend:test`, `api-client:validate`, `harness:validate`, `architecture:validate`, `diagrams:validate`) SHALL remain runnable without Docker, Neo4j, a model runtime, or credentials. A check that needs any of these SHALL be a separately triggered suite, not part of the default checks. |
| `CICD-006` | Neo4j integration and Playwright suites SHALL run against a disposable test stack isolated from interactive development state: its own Compose project, volumes, and ports, and a test-only password supplied from the environment outside Git (`TST-005`, `TST-006`). They SHALL NOT use the interactive `neo4j-data`, `advisor-index`, or `advisor-state` volumes. Until that stack exists, running one of these suites against the interactive stack requires a recorded accountable exception (`TST-008`). The seed integration suite SHALL NOT run against the interactive database. |
| `CICD-007` | A suite skipped by environment gating SHALL be reported as skipped, with its count and reason (for example `backend:check` "OK (skipped=14)": Neo4j integration not configured). It SHALL NOT be reported as passed (`TST-008`). |
| `CICD-008` | Verification SHALL use synthetic data only. It SHALL NOT use production data or credentials, and SHALL NOT call outbound AI or supplier providers ([DEP-003](deployment-architecture/deployment-architecture.md#dep-003-configuration-and-secrets)). Dependency installation and the pinned local model and embedding downloads are the permitted network uses. |
| `CICD-009` | A check that regenerates tracked files, such as `api-client:validate`, SHALL leave the working tree unchanged on success. A drift failure SHALL be classified first. The regenerated output SHALL be committed only when the contract change is intended (`TST-002`). |
| `CICD-010` | Build outputs, caches, test reports, Playwright traces, and screenshots are ephemeral. They SHALL NOT be committed, and SHALL be retained only for failures or recorded exceptions, as the Test Strategy's evidence rule requires. |
| `CICD-011` | A failed check SHALL stop the readiness claim. It SHALL be classified and routed under [Failure handling and evidence](#failure-handling-and-evidence). Expectations SHALL NOT be weakened, checks skipped, or runs repeated until green. A rerun is permitted only after a failure is classified as an environment fault or unavailable prerequisite, and both results SHALL be reported. |
| `CICD-012` | There SHALL be one product code line. Behavior differences between interactive, test, and later contexts SHALL come only from reviewed configuration ([DEP-003](deployment-architecture/deployment-architecture.md#dep-003-configuration-and-secrets)), not from test-only branches in product code. |
| `CICD-013` | The remote harness job SHALL run on every pull request and every push to `main`, using public repository content only and no secrets. Its result SHALL NOT replace the local gate. |

## Required local verification outcomes

| Concern | Required outcome | Current mechanism |
|---|---|---|
| Specification integrity | Links, identifiers, metadata, and diagram sources validate | `harness:validate` (local and remote), `diagrams:validate` (local); triggers in the commit workflow |
| Architecture conformance | Layer direction, acyclicity, and internal-package and persistence isolation hold | `architecture:validate` (local and remote); `backend/tests/architecture` within `backend:check` |
| Backend unit and API behavior | Rules, services, advisor logic with a stub model (`TST-009`), and HTTP behavior pass in-process | `backend:check`: compile, then unittest discovery; Neo4j suites skip by design (`CICD-007`) |
| HTTP contract consistency | The generated OpenAPI document and TypeScript client match the backend ([DR-0013](../governance/decisions/0013-shared-resource-crud-api-and-openapi-contract.md)) | `api-client:validate`: regenerate, then `git diff --exit-code` |
| Frontend static and component behavior | Workspaces type-check; component and route tests pass with mocked fetch ([DR-0015](../governance/decisions/0015-frontend-thin-slice-testing-i18n-and-catalog-listing.md)) | `frontend:typecheck`, `frontend:test`. The end-to-end specs are not type-checked (DR-0015 limitation). |
| Persistence integration | Mapping, indexes, traversals, transactions, and seed load hold on real Neo4j Community Edition (`TST-007`) | `backend/tests/integration/neo4j`, enabled by `CCT_NEO4J_TEST_*`. **Gap:** no isolated database (`CICD-006`). |
| Browser journeys | Changed journeys complete against the real API and seeded data (`TST-007`), at representative widths for Customer journeys (`TST-011`) | `frontend:test:e2e`, Desktop Chrome only. **Gap:** no isolated stack and no viewport projects. |
| Advisor behavior on the pinned model | A human-reviewed scenario run records the model version and index fingerprint (`TST-010`) | Manual; no automation |
| Human UX and Slice review | Recorded review decisions | Outside automation |

A frontend build is not a required check: no consumer uses its output, and the Test Strategy does not require it.

## Failure handling and evidence

Classify every failure before acting on it:

| Class | Example | Route |
|---|---|---|
| Specification or test-oracle gap | An expectation without an authoritative source; contradicting sources | Owning requirement or design artifact, through the Slice |
| Product defect | Behavior contradicts its authoritative source | Implementation |
| Test defect | The test asserts something its source does not say, or is nondeterministic | Test owner; fix without weakening intent (`TST-002`) |
| Automation defect | A wrong script, path, or gating | Implementation or Operations; fix the script, not the check's intent |
| Unavailable prerequisite | No isolated database, a model not pulled, a missing environment variable | Report as skipped or unavailable (`CICD-007`); Technical Foundation |
| Environment fault | Port conflict, Docker daemon down, stale backend image | Operations; one classified rerun (`CICD-011`) |
| Security finding or approval need | A secret in output, real data, or an exception request | Escalate to the project owner |

A failed, missing, or skipped required check blocks the readiness claim unless the Slice Manifest records an accountable exception. The exception states scope, reason, accepted risk, owner, and resolution condition. The project owner is the exception authority ([Test Strategy](../test/test-strategy.md#current-stage-readiness-and-review-gate)).

Every readiness report identifies:

- the commit, and whether the working tree had uncommitted changes;
- the execution context: workstation, interactive or isolated stack, and the relevant configuration such as the seeded state, model version, and index fingerprint;
- each check with its result and skip count;
- skipped or unavailable checks, with their reason;
- classified failures;
- material limitations.

Playwright reuses already running dev servers outside CI (`reuseExistingServer`), so the report states whether the servers matched the reported source state.

### Current evidence

On 2026-10-21, on a Windows 11 workstation with Node 22.15.0 and Python 3.13.3, a clean working tree at commit `b7a2c02`, and no Docker services required:

| Check | Duration | Result |
|---|---|---|
| `backend:check` | 24 s | 320 tests passed; 14 skipped (Neo4j integration not configured) |
| `frontend:typecheck` | 31 s | Passed |
| `frontend:test` | 64 s | Passed: customer 15 files and 96 tests; staff 10 files and 47 tests |
| `api-client:validate` | 8 s | Passed; working tree unchanged |

The run was not network-isolated. Offline execution of `CICD-005` is therefore asserted, not evidenced.

## Build and artifact boundary

A local build is identified by:

- the commit;
- `package-lock.json` and the direct pins in `backend/pyproject.toml`;
- the Node 22 and Python 3.13 toolchain;
- the local configuration class (DEP-003);
- the seed and index fingerprints that API startup computes (DR-0025).

Python transitive dependencies are not locked, so two backend builds of the same commit can differ.

| Output | Status |
|---|---|
| `frontend/apps/*/build/` | Ephemeral and ignored by Git; no consumer |
| `cct-backend:local` image | Ephemeral local image under a mutable tag; rebuilt with `docker compose up -d --build api` after backend changes ([local development](local-development.md)) |
| `generated/openapi.json` and `src/generated/schema.ts` | Tracked source kept consistent by `CICD-009`; not build artifacts |

There are no governed release artifacts. Rebuilding for every use is accepted because nothing is published or promoted. A registry, signing, provenance, SBOM, or versioned release is not introduced until a consumer or control objective exists.

## Remote CI boundary

**Active:** The [`harness-validate.yml`](../../.github/workflows/harness-validate.yml) job runs on every pull request and every push to `main`. It uses `ubuntu-latest` and Node 22, installs no dependencies, uses no secrets, and runs `harness:validate` and `architecture:validate`. The workflow does not declare token permissions explicitly. Whether `main` requires it as a status check is a repository setting that this baseline has not verified.

**Deferred:** Remote execution of the product checks and of the Neo4j and Playwright suites. The project owner decided on 2026-10-21 to keep these as the local contract above for now.

The project owner also decided the following, which applies when remote product CI activates:

- Unfiltered jobs become required status checks on `main`; the project owner configures branch protection.
- Path-filtered jobs remain advisory. A required job that path filters skip would stay pending and block unrelated merges.
- Jobs run with read-only repository permissions, no repository secrets, pinned toolchains, and cancellation of superseded runs.
- A Neo4j job uses a service container that is discarded after the run, with a password generated during the run (`TST-005`, `TST-006`).

Provider selection is not part of this deferral. GitHub Actions hosts the existing job, but [Operations](README.md) still lists the CI/CD product as undecided. Activation records the choice in a decision record.

## Continuous delivery and deployment boundary

Artifact publication, continuous delivery, and continuous deployment are all deferred. No environment exists beyond the localhost workstation, and none is authorized ([DEP-007](deployment-architecture/deployment-architecture.md#dep-007-trust-boundaries-and-limitations), DEP-Q-004). Local Compose startup, seeding, and reset are development operations, not deployments, and are governed by [local development](local-development.md).

## Activation conditions

| Capability | Activation condition |
|---|---|
| Isolated local test stack for Neo4j and Playwright (`CICD-006`) | Technical Foundation provides a separate Compose project with disposable volumes, distinct loopback ports or none, a test-only password from the environment, and a documented `CCT_NEO4J_TEST_*` target. Reinvoke this skill to record the mechanism and retire the interim exception path. |
| Remote CI for the default product checks | The project owner requests it, or local gate omissions recur in Slice reviews. Prerequisites are a Python dependency lock and a decision record selecting the provider. Owner: project owner and Operations. |
| Remote Neo4j integration job | Remote CI for product checks is active and the isolated stack's configuration is proven locally. It runs advisory under the path-filter rule. |
| Remote Playwright job | Technical Foundation provides a startup that runs on a hosted runner: no GPU-bound Ollama dependency for non-advisor journeys, a pinned Ollama image (DEP-002 prohibits `latest`), a cached or disabled embedding download, bounded seeding time, and the DEP-004 health endpoints. Viewport projects are needed for `TST-011`. |
| Artifact publication and promotion | An environment or external consumer is specified in Deployment Architecture. |
| Environment delivery, rollback, and recovery | An environment specification authorizes it (DEP-Q-004, DEP-Q-003). |

Deferred capability remains unspecified until its condition is met. Reinvoke `create-ci-cd` at that point.

## Open decisions and limitations

| Question or limitation | Resolution condition |
|---|---|
| The documented `CCT_NEO4J_TEST_URI=bolt://localhost:7687` reaches the interactive database, because Compose publishes 7687 and 7474 on loopback, contrary to DEP-001 (Operations/Technical Foundation; also recorded in the Test Strategy). | The isolated test stack exists and Deployment Architecture and Compose are reconciled. |
| Python transitive dependencies are unlocked, so builds are not reproducible (Technology, remaining work item 3; Technical Foundation). | A lock mechanism is selected under NFR-003 and committed. |
| `docker-compose.yml` uses `ollama/ollama:latest`, contrary to DEP-002, and `api` depends on the GPU-bound `ollama` service (Deployment Architecture/Technical Foundation). | The image is pinned and the dependency is made optional or conditional. |
| There is no single aggregate local gate entry point; checks are selected manually from the commit workflow (Technical Foundation, optional). | A repository script runs the triggered checks and reports skips, or the manual selection is confirmed as sufficient. |
| Playwright output directories (`test-results/`, `playwright-report/`) are not ignored by Git, which `CICD-010` relies on (Technical Foundation). | `.gitignore` covers them. |
| The harness workflow declares no explicit token permissions, and its required-check status on `main` is unverified (Operations; repository setting owned by the project owner). | Permissions are set to read-only and the branch-protection state is confirmed. |
| Offline execution of the default checks is unverified (`CICD-005`). | A network-isolated run is recorded, or remote CI provides it. |

## Sources and related artifacts

- Test: [Test Strategy](../test/test-strategy.md), [backend tests](../../backend/tests/README.md), [Neo4j integration tests](../../backend/tests/integration/neo4j/README.md), [frontend tests](../../frontend/tests/README.md), [PoC evidence matrix](../test/poc-evidence-matrix.md)
- Architecture: [Technology](../architecture/technology.md), [Security](../architecture/security.md), [Software Architecture](../architecture/software-architecture/software-architecture.md)
- Operations: [Deployment Architecture](deployment-architecture/deployment-architecture.md), [local development](local-development.md)
- Automation: [`package.json`](../../package.json), [`docker-compose.yml`](../../docker-compose.yml), [`playwright.config.ts`](../../frontend/tests/playwright.config.ts), [`harness-validate.yml`](../../.github/workflows/harness-validate.yml)
- Decisions: DR-0010, DR-0011, DR-0013–DR-0015, DR-0025, DR-0029, DR-0030 in the [decision log](../governance/decisions/README.md)
- Governance: [commit workflow](../governance/workflows/commit-workflow.md), [Agent Workflows](../governance/workflows/agent-workflows/agent-workflows.md), [definition of done](../governance/workflows/definition-of-done.md)

AI drafted this baseline from the sources above and from a local run of the default checks. The project owner decided on 2026-10-21 to defer remote product CI, to keep the Neo4j and Playwright suites on an isolated local stack, and to use required checks for unfiltered jobs and advisory status for path-filtered jobs when remote CI activates. Review corrected one conflict among the owner's answers before drafting: an initial combination would have made a path-filtered required check block unrelated merges.
