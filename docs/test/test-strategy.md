# Test Strategy

- Status: draft
- Owner: Test
- Last reviewed: 2026-10-21

## Purpose and authority

This strategy is the test and evidence baseline for iterative delivery after the Basic Concept: the MVP iteration ([#23](https://github.com/hochschule-darmstadt/a3se_app/issues/23)) and later regular Slices delivered under the [Agent Workflows](../governance/workflows/agent-workflows/agent-workflows.md) adopted by [DR-0029](../governance/decisions/0029-adopt-oculus-lifecycle-skills-and-templates.md). It governs what evidence a Slice must present before its [Slice review](../../.agents/skills/review-slice/SKILL.md). The proof of concept (issue #13) is complete; its [evidence matrix](poc-evidence-matrix.md) and [DR-0016](../governance/decisions/0016-poc-technology-confirmation-with-residual-risk.md) retain their historical scope and are not reclassified here.

Authority stays with the owning artifacts:

- [Requirements](../requirements/README.md), [use cases](../requirements/use-cases/use-cases.md), and [UX](../requirements/ux/README.md) own intended behavior, measurable outcomes, and acceptance examples.
- [Software Architecture](../architecture/software-architecture/software-architecture.md) and the [Logical Entity Model](../architecture/entity-model/entity-model.md) own structural and information boundaries.
- [Technology](../architecture/technology.md) and its decisions ([DR-0010](../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md), [DR-0015](../governance/decisions/0015-frontend-thin-slice-testing-i18n-and-catalog-listing.md)) own the selected test mechanisms.
- [Security Architecture](../architecture/security.md) owns control objectives; none is accepted yet.
- [Deployment Architecture](../operations/deployment-architecture/deployment-architecture.md) owns environments, exposure, and data classes.
- Slice Manifests own their bounded evidence claims. The CI/CD baseline (not yet created) will own repeatable execution of the checks required here.
- This strategy owns cross-cutting test objectives, policies, test-level responsibilities, data and environment use, evidence semantics, human review, and the Slice readiness gate.

Detailed test designs, executable tests, and generated results are evidence, not requirements. Accountable evaluation and acceptance are outside automated execution.

## Current scope

Covered now:

- Customer and Staff Interaction web apps, the FastAPI modular monolith, its resource and core-process modules, Neo4j Community Edition persistence, deterministic seeding, and the local Automated Travel Advisor ([DR-0024](../governance/decisions/0024-local-grounded-advisor-stack.md), [DR-0026](../governance/decisions/0026-use-langgraph-for-client-draft-travel-composition.md), [DR-0028](../governance/decisions/0028-unify-advisor-routing-in-langgraph.md));
- execution on one developer workstation with Docker Compose and the frontend dev servers ([local development](../operations/local-development.md)), and the existing GitHub Actions [harness validation job](../../.github/workflows/harness-validate.yml);
- the readiness gate for regular Slice review.

Deferred, with activation condition:

| Concern | Evidence limitation | Activation condition |
|---|---|---|
| Performance and load ([NFR-001](../requirements/non-functional-requirements.md), NFR-002) | No agreed normal-load profile, measurement environment, or observation window. Existing [performance evidence](performance-evidence.md) is local single-request observation and is not NFR verification. | Test/Operations resolve the verification question in the NFR catalog. |
| Security testing beyond placeholder behavior | Authentication is the PoC placeholder (DR-0015 item 6); no threat model or control objectives exist. | Security Architecture is accepted, or real authentication/authorization is introduced. |
| Accessibility conformance | No conformance level or contrast target is set ([DS-Q-001](../requirements/ux/design-system/design-system.md)). | DS-Q-001 is resolved as a measurable requirement. |
| Operational exercises (backup, restore, upgrade, recovery drills) | Only startup and reseed have been smoke-tested ([DEP-005](../operations/deployment-architecture/deployment-architecture.md), DEP-006). | A Slice or the deployment baseline claims recovery or operability. |
| Remote, shared, review, or production environments | None exist ([DEP-Q-004](../operations/deployment-architecture/deployment-architecture.md)). | An environment is specified in Deployment Architecture. |
| Real second interaction language | Only the `en-XP` pseudo-locale exists ([FR-002](../requirements/functional-requirements.md), DR-0015 item 4). | A second language is approved in Requirements. |

Excluding a concern from this baseline does not declare the corresponding quality unnecessary.

## Test objectives

| Objective | Evidence required now | Current limitation or deferred assurance |
|---|---|---|
| Actor-goal behavior of each Slice follows its use-case scenario, extensions, and guarantees | Unit, API, and component tests for the Slice's claims; browser end-to-end tests for each changed journey | Use-case acceptance examples are uneven; gaps are routed to Requirements through the Slice. |
| Cross-cutting computed rules ([FR-010–FR-014](../requirements/functional-requirements.md)) hold | Unit and API tests using the rule-table examples and invalid-graph cases | None beyond the rule table's examples. |
| Identifiers and transactional integrity ([FR-015](../requirements/functional-requirements.md), FR-016, [NFR-004](../requirements/non-functional-requirements.md)) hold | Unit tests plus real Neo4j integration tests for allocation, rollback, and retry | Concurrent stock reservation and rollback remain open from DR-0016. |
| Flexible properties and graph mapping follow the [terminology catalog](../architecture/entity-model/terminology.md) and [DR-0012](../governance/decisions/0012-use-validated-property-registry-and-direct-neo4j-properties.md) | Unit validation tests; Neo4j integration tests for mapping, indexes, and recursive and heterogeneous traversals | Multi-hop traversal and index evidence are partial (evidence matrix). |
| Module boundaries match the Software Architecture | Architecture tests and `architecture:validate` | Static import analysis only; it cannot prove runtime authorization or audit ownership. |
| The HTTP contract stays consistent between backend and clients ([DR-0013](../governance/decisions/0013-shared-resource-crud-api-and-openapi-contract.md)) | OpenAPI contract tests and generated-client drift check | Contract shape only; behavior is evidenced at other levels. |
| Browser journeys work against the real stack ([FR-003](../requirements/functional-requirements.md), FR-005) | Playwright against the seeded local stack | Desktop Chrome only; no other browsers or engines. |
| Customer Interaction adapts to PC, tablet, and mobile ([FR-004](../requirements/functional-requirements.md)) | Completion of changed customer journeys at representative widths | No viewport evidence exists today; this is a current gap. |
| British English and language extensibility ([FR-001](../requirements/functional-requirements.md), FR-002) | Component checks that user-facing text goes through the shared dictionary, plus pseudo-locale rendering | Structural only; no real second language. |
| Advisor behavior ([FR-008](../requirements/functional-requirements.md), FR-009, FR-018) is controlled and honest about action state | Deterministic stub-model tests plus a human-reviewed scenario run against the pinned local model | No accepted evaluation set or numeric quality threshold; the agent-tool boundary remains open from DR-0016. |
| Protected outcomes are withheld from anonymous users ([FR-006](../requirements/functional-requirements.md), FR-007, FR-018) | Denied-path and return-to-destination tests against the placeholder | Placeholder behavior only; not authentication or authorization evidence. |
| Seeding is deterministic and complete ([DR-0014](../governance/decisions/0014-deterministic-seed-data-and-compose-seeding.md), [DR-0025](../governance/decisions/0025-conditional-local-seed-and-index-refresh.md)) | Seed unit tests; opt-in seed integration suite | The integration suite takes several minutes and is opt-in. |
| UX consistency with the [design system](../requirements/ux/design-system/design-system.md) and wireframes | Human UX review of changed views | No accessibility conformance claim (DS-Q-001). |
| Specification and cross-artifact integrity | `harness:validate`, `diagrams:validate` | Structural only; content correctness needs review. |

## Test policy

| ID | Current rule |
|---|---|
| `TST-001` | Every test and human review SHALL trace to an authoritative identifier (for example `UC-`, `FR-`, `NFR-`, `DS-`, `DEP-`, `TS-`, or a decision record) or to an explicit risk named in the governing Slice Manifest. |
| `TST-002` | Expected results SHALL be derived from the authoritative source, not from current implementation output. A test SHALL NOT be changed to match the implementation unless its owning specification changed first. |
| `TST-003` | For each Slice claim, tests SHALL cover the normal path and those alternative, error, denied, cancellation, boundary, and recovery behaviors that the use-case extensions, minimal guarantees, or rules define. The Slice SHALL record every omitted category with its reason. |
| `TST-004` | A claim SHALL be established at the narrowest level that can show it reliably. Broader levels SHALL be added only for a boundary or failure mode the narrower level cannot reach, such as real Neo4j transactions or browser enforcement like CORS. |
| `TST-005` | Tests SHALL use only synthetic data from the [test scenarios](test-scenarios/test-scenarios.md), [catalogs](test-scenarios/catalogs.md), seed sources, or test-local fixtures. Credentials SHALL come from environment variables outside Git. Production data and credentials SHALL NOT be used. |
| `TST-006` | Neo4j integration tests SHALL run only against a database whose state the run may discard. They SHALL delete only their own prefixed records, or SHALL clear the graph only where the suite declares that it does so. |
| `TST-007` | A Slice that changes a persistence adapter, transaction, identifier allocation, constraint, index, or seed behavior SHALL run the affected Neo4j integration suites. A Slice that changes a browser-visible journey or the browser's reach to the API SHALL run the affected Playwright specs. A Slice that changes the OpenAPI contract SHALL run the generated-client drift check. |
| `TST-008` | A required check that was skipped or unavailable, including a suite skipped by its environment gating, SHALL be reported as skipped, never as passed. It SHALL block the Slice readiness gate unless an accountable exception is recorded. |
| `TST-009` | Advisor routing, tool invocation, action states, sign-in gating, model unavailability, and no-action/no-reservation behavior SHALL be tested with a deterministic stub model. Those tests SHALL NOT require a live model to pass. |
| `TST-010` | A Slice that changes advisor prompts, model, retrieval, index inputs, or routing SHALL include a human-reviewed run of its scenarios against the pinned local model. The run SHALL cover the applicable DR-0024 categories (answerable, uncertain, no-answer, stale-index, prompt-injection, model-unavailable) and SHALL record the model version and index fingerprint. No numeric quality rate SHALL be claimed until an evaluation set and threshold are accepted. |
| `TST-011` | A Slice that changes a Customer Interaction journey SHALL show the journey completing at representative mobile, tablet, and PC widths ([DS-FND-004](../requirements/ux/design-system/design-system.md) exemplars), by browser-level test or recorded human review. |
| `TST-012` | Tests of protected or denied behavior against the authentication placeholder SHALL be reported as placeholder-behavior evidence, not as security-control evidence. |
| `TST-013` | A test failure SHALL be classified as a product defect, test defect, environment fault, or specification gap and routed to its owner. Expectations SHALL NOT be weakened to make a check pass. |
| `TST-014` | Test counts and code-coverage figures SHALL NOT be reported as requirement or risk coverage. Coverage SHALL be stated as traced claims with their evidence. |
| `TST-015` | Passing automated checks SHALL NOT be reported as acceptance. Correctness that depends on intent, UX, advisor answer quality, or architecture fit SHALL be established by recorded human review. |

## Test levels and current mechanisms

| Test level or review | Current responsibility | Current mechanism | Required use |
|---|---|---|---|
| Specification validation | Links, identifiers, metadata, diagram sources | `npm run harness:validate`, `npm run diagrams:validate`; harness check in CI | Per the [commit workflow](../governance/workflows/commit-workflow.md#proportionate-checks) |
| Architecture checks | Layer direction, acyclicity, internal-package and persistence isolation | [`backend/tests/architecture`](../../backend/tests/architecture/README.md); `npm run architecture:validate` in CI | Every backend or architecture change |
| Backend unit | Domain rules, validation, services, advisor logic with stub model | [`backend/tests/unit`](../../backend/tests/unit/README.md), unittest, fakes in `backend/tests/support` | Every backend change, via `npm run backend:check` |
| API and contract | HTTP behavior, error mapping, OpenAPI shape, client drift | [`backend/tests/api`](../../backend/tests/api/README.md) with TestClient; `npm run api-client:validate` | Every backend change; drift check per `TST-007` |
| Neo4j integration | Real mapping, indexes, traversals, transactions, seed load | [`backend/tests/integration/neo4j`](../../backend/tests/integration/neo4j/README.md); skipped unless `CCT_NEO4J_TEST_*` is set | Per `TST-007`; the seed suite only when seed behavior changes |
| Frontend component | Route and component states, error rendering, i18n structure | Vitest and React Testing Library beside each feature, with mocked fetch (DR-0015) | Every frontend change, via `npm run frontend:test` |
| Browser end-to-end | Journeys across the real API and seeded data, including browser-only failures | [Playwright](../../frontend/tests/README.md), `npm run frontend:test:e2e`, Desktop Chrome | Per `TST-007`; viewport coverage per `TST-011` is a current gap |
| Advisor human review | Answer grounding and quality, prompt-injection resistance | Recorded review run against the pinned local model; no automation | Per `TST-010` |
| UX and accessibility review | Fit with wireframes, design-system contracts, keyboard and focus behavior | Human review of changed views | Every Slice that changes a view |
| Slice acceptance review | Whether the evidence supports the Slice's claims | [Review Slice](../../.agents/skills/review-slice/SKILL.md) by the accountable reviewer | Every Slice |

## Traceability and evidence

```text
UC / FR / NFR / DS / DEP / DR identifier or explicit risk
    → Slice Manifest evidence claim
    → test (by file and name), measurement, or human review
    → result in the Slice Manifest evidence summary, limitation, and review decision
```

A test names the identifier or Slice claim it supports in its name, docstring, or describe block. The evidence summary in the Slice Manifest identifies:

- the commit;
- the execution context and relevant configuration, such as the test database, seeded state, model version, and index fingerprint;
- each command or review method and its result;
- skipped or unavailable checks;
- material failures and how they were classified;
- residual limitations.

Raw logs, reports, traces, and screenshots are retained only for failures or recorded exceptions. Otherwise the summary is the durable record.

## Test data and environment use

| Context | Permitted state and use | Evidence boundary |
|---|---|---|
| In-process unit, API, and component tests | No external services; fakes and mocked fetch; synthetic fixtures only | Logic and contract claims only; cannot show persistence, browser enforcement, or deployment behavior |
| Disposable Neo4j test database (`CCT_NEO4J_TEST_*`) | Test-only password; prefixed test records or a declared full clear (`TST-006`); no concurrent runs against the same database | Real persistence, index, and transaction behavior on Community Edition at workstation scale |
| Seeded local stack (Compose `api` and `neo4j`, dev servers 4300/4301) | Freshly seeded synthetic data. Journeys that create orders or edit status mutate state, so reseed before a run whose expectations depend on initial seed state. | End-to-end journeys on one workstation in Desktop Chrome; not multi-user, remote, or production behavior |
| Local advisor runtime (pinned Ollama model, local index) | Synthetic catalogue and conversation content only; no outbound providers (DEP-003) | Qualitative, human-judged behavior for the recorded model and index only |
| GitHub Actions runner | Public repository content only; no secrets or databases | Specification and architecture validation only |
| Interactive development state (`neo4j-data`, advisor volumes) | Manual exploration; may be reset automatically by seed refresh | Observation only; it is not a verification context for automated claims |

Production data, shared environments, and remote environments do not exist and are not authorized ([DEP-007](../operations/deployment-architecture/deployment-architecture.md)).

## Current-stage readiness and review gate

This gate governs the move from an implemented Slice to its Slice review. A Slice is ready for review when:

- every Slice evidence claim traces to its source (`TST-001`) and is covered by the applicable categories (`TST-003`);
- the checks the [commit workflow](../governance/workflows/commit-workflow.md#proportionate-checks) prescribes for the change have passed, and so have the scope-triggered suites under `TST-007`, `TST-010`, and `TST-011`;
- the human UX review and, where applicable, the advisor review are recorded;
- the evidence summary is complete, and skipped checks and residual limitations are explicit (`TST-008`).

A failed required check, or a required check that is missing or skipped without an exception, blocks the gate. An accountable exception records scope, reason, accepted risk, owner, and resolution condition in the Slice Manifest. The project owner is the accountable reviewer and the exception authority.

Passing the gate establishes only that the Slice's declared claims have the required evidence in the stated local contexts. It does not establish product acceptance, security or privacy approval, accessibility conformance, performance compliance, release authorization, or production readiness.

## Next-stage handoff

- **CI/CD (`create-ci-cd`):** automate the commit-workflow checks first (`backend:check`, frontend typecheck and test, `api-client:validate`). Then define how Neo4j integration and Playwright can run in an isolated context so that `TST-007` stops depending on manual execution.
- **Technical Foundation:** provide a disposable Neo4j test database separate from the interactive volume. Add Playwright viewport projects for `TST-011` and type-checking of the end-to-end specs (DR-0015 limitation). Implement the proposed health endpoints (DEP-004) before any readiness-based test orchestration.
- **Slice specification:** each Slice Manifest declares its evidence claims, the triggered suites, and the human reviews this strategy requires.

Existing tests remain valid evidence for the claims they were written for. When a claim, source, or environment changes, the affected tests are re-derived from the current authoritative source (`TST-002`) rather than carried forward unchanged. Extend this strategy when a deferred concern activates.

## Open decisions and limitations

| Question or limitation | Resolution condition |
|---|---|
| The normal-load profile for NFR-001/NFR-002 is undefined (Test/Operations). | The profile, measurement environment, and observation window are recorded in the NFR catalog. |
| There is no accepted advisor evaluation set or quality threshold (Requirements/Test with the project owner). | A versioned evaluation set and threshold are accepted. `TST-010` then gains a measured criterion. |
| The documented `CCT_NEO4J_TEST_URI=bolt://localhost:7687` reaches the Compose dev database, because `docker-compose.yml` publishes 7687 and 7474 on loopback. This contradicts DEP-001's "no host publication by default", and the seed integration suite would clear the interactive graph (Operations/Technical Foundation). | Deployment Architecture and Compose are reconciled, and a disposable test database is provided. |
| Concurrent stock reservation, rollback, and the controlled agent-tool boundary remain unevidenced (DR-0016; Architecture/Implementation). | Follow-up Slices provide Neo4j integration evidence under `TST-007`. |
| No responsive-breakpoint evidence exists for FR-004 (Test/Technical Foundation). | Viewport projects or recorded reviews exist for current customer journeys. |
| No accessibility conformance target exists (DS-Q-001; Requirements/Test). | DS-Q-001 is resolved. Automated or assisted accessibility checks are then added. |
| Security Architecture is not accepted and authentication is a placeholder (Architecture). | Security Architecture is accepted. A security test level is then added. |
| There is no NFR-003 licence inventory for the test tools (Architecture). | The technology licence inventory covers the test dependencies. |
| The evidence matrix's "No CI automation exists" finding is historical. The harness and architecture checks now run in GitHub Actions, while no product test suite does (Test). | The CI/CD baseline records the current automation. The matrix stays a dated historical record. |

## Sources and related artifacts

- Requirements: [functional](../requirements/functional-requirements.md), [non-functional](../requirements/non-functional-requirements.md), [constraints](../requirements/constraints.md), [use cases](../requirements/use-cases/use-cases.md), [design system](../requirements/ux/design-system/design-system.md)
- Architecture: [Software Architecture](../architecture/software-architecture/software-architecture.md), [Logical Entity Model](../architecture/entity-model/entity-model.md), [Technology](../architecture/technology.md), [Security](../architecture/security.md)
- Operations: [Deployment Architecture](../operations/deployment-architecture/deployment-architecture.md), [local development](../operations/local-development.md)
- Test: [test scenarios](test-scenarios/test-scenarios.md), [PoC evidence matrix](poc-evidence-matrix.md), [performance evidence](performance-evidence.md), [backend tests](../../backend/tests/README.md), [frontend tests](../../frontend/tests/README.md)
- Decisions: DR-0010, DR-0012–DR-0016, DR-0024–DR-0026, DR-0028, DR-0029 in the [decision log](../governance/decisions/README.md)
- Governance: [lifecycle](../governance/lifecycle/lifecycle.md), [Agent Workflows](../governance/workflows/agent-workflows/agent-workflows.md), [commit workflow](../governance/workflows/commit-workflow.md), [definition of done](../governance/workflows/definition-of-done.md)

AI drafted this strategy from the sources above. The project owner decided the blocking policy, advisor evidence approach, performance deferral, and review authority on 2026-10-21. The Neo4j port publication and test-database collision were found during drafting and are recorded as open rather than resolved.
