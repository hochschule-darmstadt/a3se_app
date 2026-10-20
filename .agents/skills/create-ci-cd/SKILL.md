---
name: create-ci-cd
description: Collaboratively create, refine, correct, or assess a CI/CD baseline covering local feedback, governed verification, build and packaging, artifacts, integration events, promotion, deployment, rollback, evidence, and activation conditions. Use after technology, security, deployment, test, and delivery needs are sufficiently established; do not use it to implement pipeline files or scripts, provision infrastructure, deploy, select an unsupported provider, redefine test intent or environments, or claim release or production readiness without evidence.
---

# Create CI/CD

Create an evidence-aware CI/CD baseline with the user. Define how identified source states are verified, built, packaged, evidenced, and—only when authorized environments and consumers exist—published, promoted, deployed, and recovered. Establish the minimum delivery capability needed for the current lifecycle stage and defer unsupported remote or production concerns explicitly.

Authorization to create this baseline permits edits to its authoritative artifact and directly affected links. It does not authorize pipeline implementation, repository-hook changes, external accounts, runners, secrets, artifact publication, infrastructure provisioning, deployment, production access, or unrelated repository edits.

## Preserve authority

- Requirements and quality scenarios own required outcomes. Software Architecture owns distribution, contracts, consistency, and deployable-boundary intent.
- Technology owns selected build, packaging, verification, repository, and delivery mechanisms.
- Security and Privacy Architecture owns identities, trust boundaries, secret handling, supply-chain controls, and security evidence.
- Deployment Architecture owns environment purposes, topology, exposure, configuration classes, data policy, lifecycle, deployment contracts, and rollback or recovery needs.
- Test Strategy owns required checks, reviews, evidence semantics, and readiness criteria.
- CI/CD owns the orchestration contract for developer feedback, integration verification, build, package, artifact handling, publication, promotion, deployment, delivery evidence, and failure behavior.
- Repository scripts and pipeline definitions are executable mechanisms. They do not silently redefine the baseline. Operations owns routine procedures, monitoring operation, incident handling, backup, and recovery execution.
- Prototype, Slice, release, and environment reviews own their bounded acceptance decisions. A successful pipeline is supporting evidence, not approval.

Do not change an owning artifact merely to make a preferred pipeline fit. Route material gaps to their owner.

## Use delivery terms precisely

- **Local verification:** developer- or agent-initiated checks on a workstation or equivalent local context. It is not continuous integration merely because it resembles a pipeline.
- **Continuous integration:** an automated integration event verifies an identified source state independently of persistent developer state and records the result.
- **Build artifact:** an identified output produced from a source and dependency state. It is not necessarily a governed release artifact.
- **Publication:** retaining an identified artifact for a downstream consumer.
- **Promotion:** authorizing an existing immutable artifact for a later delivery stage without rebuilding it.
- **Continuous delivery:** keeping a verified releasable change available for an accountable deployment decision.
- **Continuous deployment:** automatically deploying every qualifying change to its target environment under an accepted policy.

Do not use these labels for capabilities that current evidence does not establish.

## Load a bounded context

Before substantive work, read applicable `AGENTS.md` instructions, the repository context map, lifecycle and artifact guidance, definition of done, the canonical [CI/CD template](../../../docs/governance/templates/ci-cd.md), and the current baseline when one exists.

Load only the sources required by the current delivery stage:

1. relevant quality requirements, decisions, release or review needs, and prototype or Slice evidence claims;
2. affected Software Architecture, Technology, Security and Privacy Architecture, Deployment Architecture, environment specifications, and Test Strategy sections;
3. implementation and local-development guidance that defines supported build and runtime entry points;
4. existing manifests, lockfiles, wrappers, scripts, containers, workflow files, runner configuration, artifact stores, and recent results needed to describe current capability or drift.

Do not preload future environment specifications, provider documentation, historical logs, or all repository automation. Verify volatile provider or platform facts against primary sources only when a current decision depends on them.

Preserve the established artifact location and compatible structure. In this repository, maintain the baseline at `docs/operations/ci-cd.md` unless the user establishes another authoritative location.

## Select mode and delivery depth

- **Initial or Basic Concept baseline:** define focused local feedback, a complete local verification contract, build and packaging boundaries, and explicit activation conditions for later capabilities.
- **Prototype delivery refinement:** make the local implementation and review path reproducible without pretending it is remote CI or continuous delivery.
- **Remote CI activation:** define integration events, runners, isolation, caches, secrets, evidence, concurrency, retention, and repository status behavior after the need is accepted.
- **Artifact and promotion activation:** define immutable outputs, provenance, publication, consumers, retention, and promotion semantics.
- **Environment delivery activation:** define deployment, migration, health, approval, rollback, and evidence for one authorized environment.
- **Correction or alignment assessment:** repair the baseline or compare it with executable automation and current evidence, preserving valid content and identifiers.

State the source boundary, delivery stage, environments, artifacts, automation surfaces, and decisions in scope. Do not design production delivery merely because a build succeeds or a production environment appears in a future landscape.

## Map current and required capabilities

Assess separately:

- focused developer feedback;
- complete repository-local verification;
- reproducible build and packaging;
- database or state migration verification;
- cross-boundary or system verification;
- remote integration verification;
- artifact publication and retention;
- promotion and environment delivery;
- health verification, rollback, recovery, and operational handoff.

For each capability distinguish required target, current mechanism, evidence, limitation, maturity, and activation condition. Describe a missing capability as absent or deferred; do not infer it from a script name, manual success, or provider configuration stub.

## Define the local verification contract

At the early lifecycle stage, define the project-specific contract that developers and agents must follow without embedding a complete command implementation in prose. Use stable `CICD-NNN` identifiers for normative rules, preserve identifiers while meaning remains stable, and retire rather than reuse them.

Address applicable concerns such as:

- repository-owned wrappers, pinned manifests, lockfiles, and supported runtimes;
- focused feedback during implementation and the complete gate required before a readiness claim;
- state, database, port, process, container, cache, and credential isolation;
- permitted data, endpoints, external dependencies, and local tooling changes;
- failure classification, stopping behavior, reruns, skipped checks, and evidence reporting;
- ephemeral outputs versus explicitly retained evidence;
- one product code line with environment behavior selected through reviewed configuration.

The artifact states the contract and required outcomes. Executable repository automation owns exact commands, sequencing, cleanup implementation, and exit behavior. Do not duplicate script bodies in the baseline.

## Derive required verification outcomes

Translate the Test Strategy and other owning specifications into observable delivery outcomes. For each outcome record its source, required context, current mechanism or gap, blocking semantics, and evidence destination.

Include only applicable concerns such as repository governance, static analysis, unit or component tests, integration and contract tests, database migrations, architecture checks, security checks, system or browser paths, build and packaging, artifact inspection, environment validation, or accountable review. CI/CD orchestrates these checks; it does not redefine their test intent or expected results.

Keep focused feedback distinct from the complete current gate. A readiness statement must identify whether the applicable complete gate ran and which checks were skipped, unavailable, or failed.

## Define build and artifact boundaries

Establish proportionately:

- how source revision, dependencies, toolchain, configuration class, and migration set identify a build;
- what outputs are built or packaged and whether they are ephemeral, retained, or immutable;
- integrity, provenance, dependency, license, vulnerability, signature, and inventory evidence only where required;
- whether later stages reuse the same artifact or rebuild, and the accepted reason;
- artifact consumers, storage, access, retention, expiry, and disposal;
- versioning, compatibility, and traceability to source and evidence.

Do not introduce an artifact registry, signing service, release version, software bill of materials, or promotion model without an evidenced consumer or control objective. Local build success alone does not establish a releasable artifact.

## Define remote CI only when activated

When remote CI is required, define the accepted integration event and the minimum runner, isolation, identity, secret, network, cache, concurrency, timeout, status, evidence, and retention contract. Select a provider only when Technology and delivery evidence justify it, and record consequential choice through the repository's decision mechanism.

Remote execution must start from an identified source state, reconstruct required dependencies and sandboxes, avoid undeclared persistent machine state, and report results independently of the developer workstation. Missing prerequisites remain visible; do not weaken the governed verification contract merely to make a hosted runner pass.

If remote CI is not activated, state that clearly and avoid provider-specific workflow files, credentials, webhooks, branch controls, or runner assumptions in the baseline.

## Define delivery and deployment only for authorized environments

For each activated environment, derive the delivery contract from its environment specification. Define applicable publication, promotion, approval, configuration injection, migration, deployment, health, smoke verification, rollback, restoration, reconciliation, evidence, and operational handoff.

Build once and promote the same immutable artifact when the accepted delivery model requires it; otherwise record the justified alternative. Keep environment-specific configuration outside source divergence. Do not create an environment, choose its topology, authorize real data, or invent rollback and availability guarantees inside CI/CD.

Distinguish continuous delivery from continuous deployment and state where accountable approval remains required. A future environment may remain visible through an activation condition without a speculative pipeline design.

## Protect delivery security and evidence

Define least-privilege automation identities, secret injection and masking, untrusted-input boundaries, dependency and artifact trust, log restrictions, approval separation, and audit evidence proportionately to Security Architecture and the activated stage.

State how failures are classified and routed: specification or test-oracle gap, implementation defect, automation defect, unavailable prerequisite, environment failure, security finding, or approval need. A failed required check blocks the corresponding readiness claim unless an accountable exception records scope, reason, risk, owner, and resolution condition.

Retain only evidence justified by Test Strategy, security, release, or operational policy. Pipeline success does not imply requirement acceptance, prototype or Slice approval, security approval, release authorization, or production readiness.

## Collaborate and manage activation decisions

Resolve with the user choices that materially change delivery boundaries, cost, authority, or risk: remote integration need, provider, runner trust, artifact consumer, publication, promotion, environment activation, approval, retention, rollback, and operational ownership. Make ordinary editorial and traceability decisions autonomously.

Classify facts, assumptions, proposals, decisions, recommendations, and open questions. Give deferred capabilities an activation condition, prerequisites, and owner. Record consequential accepted choices in decision records when governance requires them.

Ask the user to confirm a concise synthesis of current capability, required local contract, verification outcomes, build and artifact boundary, activated and deferred delivery stages, security constraints, decisions, and handoffs before material writes unless an immediate provisional draft was explicitly requested.

## Create or update the baseline

Use the canonical template and keep only sections relevant to the current delivery maturity. Preserve stable `CICD-NNN` identifiers and unaffected content on repeat invocation. Keep a new or materially changed baseline in `draft` unless accountable authority explicitly assigns another state.

Link exact Test Strategy, Technology, Security, Deployment, environment, implementation, and operational sources instead of duplicating them. Distinguish target contract from current automation and expose drift. Do not create or modify pipeline definitions, scripts, infrastructure, repository settings, external credentials, artifacts, or deployments as part of this skill.

Apply only authorized, meaning-preserving secondary updates. Route missing mechanisms to implementation or delivery-automation work and material intent changes to their owning lifecycle artifact.

## Validate and report

Before completion, confirm terminology, source-to-outcome traceability, local-state protection, failure semantics, artifact identity, environment authorization, security boundaries, evidence retention, activation conditions, and current-versus-target alignment.

Validate links, identifiers, lifecycle metadata, repository structure, and definition-of-done checks. Report the current and required capability, local verification contract, build and artifact boundary, activated and deferred CI/CD stages, environment delivery coverage, decisions, gaps, handoffs, validation performed, and residual uncertainty. Never claim that a documented or passing pipeline makes a result accepted, releasable, secure, compliant, or production-ready.
