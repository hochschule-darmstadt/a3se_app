# CI/CD

- Status: draft
- Owner: Operations/Implementation/Test
- Last reviewed: YYYY-MM-DD

Use this template to define the verification and delivery baseline justified by the current lifecycle stage. Replace instructional text and placeholders with project-specific, evidence-supported content. Specify the current contract and explicit activation conditions without inventing remote integration, publication, promotion, deployment, or production capability.

Assign stable `CICD-NNN` identifiers only to normative delivery or verification rules. Preserve an identifier while its meaning continues; retire rather than reuse it. Do not assign identifiers to commands, current observations, placeholders, proposals, or open questions.

## Purpose and authority

State the source boundary, lifecycle stage, review or delivery purpose, environments, and decisions governed by this baseline.

Link rather than duplicate the Test Strategy, Technology, Security and Privacy Architecture, Deployment Architecture and environment specifications, implementation guidance, local-development guidance, and repository automation. Clarify that:

- Test Strategy owns required checks, reviews, evidence semantics, and readiness criteria;
- Technology owns selected build, packaging, verification, and delivery mechanisms;
- Deployment Architecture owns environment contracts, topology, exposure, configuration, data, lifecycle, and rollback or recovery needs;
- CI/CD owns orchestration of verification, build, package, artifact handling, integration, publication, promotion, deployment, delivery evidence, and failure behavior;
- executable scripts and pipeline definitions implement the contract without replacing its authority;
- accountable review and release approval remain separate from pipeline success.

## Current delivery scope

| Capability | Current-stage position |
|---|---|
| Focused developer feedback, complete local verification, build, packaging, migration verification, cross-boundary verification, remote CI, artifact publication, promotion, environment delivery, rollback, recovery, or operational handoff | Required target, current evidence and maturity, material limitation, and activation condition |

Distinguish target capability from current automation. Local verification is not continuous integration unless an automated integration event independently verifies an identified source state and records the result.

## Local agent verification contract

| ID | Current rule |
|---|---|
| `CICD-NNN` | The responsible developer, agent, automation, or repository `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, or `MAY` produce a verifiable local-delivery outcome under a stated condition. |

Address applicable repository wrappers and dependency locks, focused feedback, complete gates, runtime prerequisites, state isolation, data, credentials, network boundaries, cleanup, failures, reruns, evidence, retained outputs, and source-line consistency. Keep exact command order and script implementation in repository automation.

## Required local verification outcomes

| Concern | Required outcome | Current mechanism |
|---|---|---|
| Governance, static analysis, focused tests, integration, contract, migration, architecture, security, system path, browser path, build, packaging, environment validation, or accountable review | Observable result traced to the Test Strategy or another owning source | Repository-owned mechanism or explicit gap; state blocking and evidence semantics where material |

CI/CD orchestrates these outcomes but does not redefine their expected behavior or test intent. Distinguish fast focused feedback from the complete gate required for a readiness claim.

## Failure handling and evidence

Define how results distinguish:

- specification, test-oracle, architecture, security, or environment gaps;
- implementation defects;
- automation defects;
- unavailable prerequisites or external dependencies;
- environment or infrastructure failures;
- security findings and approval needs.

State stopping and rerun behavior, accountable exception content, and evidence requirements. Every readiness report should identify the source state, governed gate or command, execution context, result, material limitation, and skipped or unavailable checks. Passing automation does not imply acceptance, security approval, release authorization, or production readiness.

## Build and artifact boundary

Describe the relationship among source revision, dependencies, toolchain, configuration class, migration set, build outputs, and any reusable artifact. State whether outputs are ephemeral, retained, immutable, or governed release artifacts; identify current evidence and deferred decisions. Do not introduce publication, signing, provenance, inventory, or promotion machinery without an evidenced consumer or control objective.

## Remote CI boundary

State whether continuous integration is active, proposed, or deferred. If active, define:

- integration events and identified source states;
- runner ownership, isolation, supported toolchain, and reconstruction from clean state;
- identity, secrets, network, cache, concurrency, timeout, and untrusted-input boundaries;
- required verification outcomes, status reporting, evidence, retention, and branch or review interaction;
- failure handling and unavailable-prerequisite behavior.

If remote CI is deferred, record its activation condition and avoid provider, runner, credential, webhook, cache, or repository-control assumptions. Provider selection belongs to an evidenced Technology and decision process.

## Continuous delivery and deployment boundary

State separately whether artifact publication, continuous delivery, and continuous deployment are active, proposed, or deferred.

For each activated environment or delivery stage define the input artifact and configuration, trigger and approval, migration and deployment action, health and verification result, failure or rollback behavior, retained evidence, and operational handoff. Derive every target from its environment specification. Do not activate an environment, authorize data, create source divergence, or invent rollback and availability guarantees in this artifact.

## Activation conditions

| Capability | Activation condition |
|---|---|
| Remote CI, immutable publication, promotion, shared-environment delivery, production delivery, rollback, recovery, or another deferred capability | Evidence or lifecycle event, required prerequisites, decision owner, and resulting handoff |

Deferred capability remains intentionally unspecified until its activation condition is met. Reinvoke `create-ci-cd` when a condition becomes true.

## Open decisions and limitations

| Question or limitation | Resolution condition |
|---|---|
| Material missing requirement, provider or mechanism choice, security policy, artifact consumer, environment authority, approval, retention, rollback, or operating responsibility; identify the owner and affected boundary in the statement or linked handoff | Evidence, decision, implementation, or lifecycle event required |

## Sources and related artifacts

Link directly to the Test Strategy, quality requirements, Software Architecture, Technology, Security and Privacy Architecture, Deployment Architecture and environment specifications, Prototype Charters, Slice Manifests, implementation and local-development guidance, repository automation, operational procedures, risks, decisions, lifecycle workflow, and definition of done used by this baseline.
