---
name: create-test-strategy
description: Collaboratively create, refine, correct, or assess a risk- and evidence-based test strategy covering objectives, policy, test levels, traceability, data, environments, automation boundaries, human review, evidence handling, and readiness gates. Use after representative requirements, acceptance evidence, architecture, technology, security, and deployment constraints are sufficiently established; do not use it to write test cases or test code, implement test infrastructure or CI/CD, evaluate a specific result, or claim production assurance without evidence.
---

# Create Test Strategy

Create an evidence-aware test strategy with the user. Define how the current product stage will challenge requirements, architecture, security, quality risks, and delivery claims through proportionate automated checks and accountable human review. Establish only the assurance baseline justified now; keep later product, environment, and production concerns visible through activation or resolution conditions rather than inventing them.

Authorization to create the strategy permits edits to its authoritative artifact and directly affected links. It does not authorize test implementation, framework installation, test-environment provisioning, pipeline changes, external execution, product evaluation, acceptance, or unrelated repository edits.

## Preserve authority

- Requirements and acceptance examples own intended behavior and measurable outcomes.
- UX artifacts own interaction intent and experience criteria. Software Architecture and the Logical Entity Model own structural and information boundaries.
- Technology owns selected test products, libraries, and supported mechanisms. Security and Privacy Architecture owns control objectives and required security evidence.
- Deployment Architecture owns environments, isolation, exposure, data classes, and execution profiles.
- The Test Strategy owns cross-cutting test objectives, policies, risk coverage, test-level responsibilities, data and environment use, human-review expectations, evidence semantics, and readiness gates.
- Prototype or Slice specifications own their bounded evidence claims. Detailed test designs and executable tests realize those claims without becoming requirements.
- CI/CD owns repeatable orchestration of the required checks. Generated results are evidence; accountable review owns interpretation and acceptance.

Do not change an owning artifact to make a preferred test approach fit. Route material gaps to their owner.

## Load a bounded context

Before substantive work, read applicable `AGENTS.md` instructions, the repository context map, lifecycle and artifact guidance, definition of done, the canonical [Test Strategy template](../../../docs/governance/templates/test-strategy.md), and the current strategy when one exists.

Load only the sources needed for the current scope:

1. representative requirements, use-case scenarios, acceptance examples, quality risks, constraints, exclusions, and relevant decisions;
2. affected UX, Software Architecture, Logical Entity Model, Technology, Security and Privacy Architecture, and Deployment Architecture sections;
3. the current Prototype Charter, Slice Manifests, release or iteration goals, and review findings only where they create current evidence needs;
4. existing test code, frameworks, reports, local-development guidance, and CI/CD material only to establish present capabilities or drift.

Do not preload every requirement, environment, test, or result. Record the lifecycle status and authority of material inputs. Existing tests demonstrate current verification behavior but do not define intended behavior or prove that the strategy is sufficient.

Preserve the established artifact location and compatible structure. In this repository, maintain the strategy at `docs/test/test-strategy.md` unless the user establishes another authoritative location.

## Select mode and depth

- **Initial baseline:** create the smallest coherent strategy for the current lifecycle stage.
- **Basic Concept or Prototype:** support the representative slice, its architecture-and-technology review, and the foreseeable first regular Slices; defer unsupported production-wide assurance.
- **Iteration refinement:** extend or correct the strategy for newly relevant behavior, risks, test levels, or environments.
- **Environment or release activation:** define the additional evidence and gates required by an activated environment or delivery stage.
- **Correction:** repair an incorrect policy, boundary, mechanism mapping, or readiness claim while preserving valid content and identifiers.
- **Alignment assessment:** compare the strategy with specifications, tests, environments, automation, and evidence without editing unless authorized.

State the lifecycle stage, product or subsystem boundary, environments, delivery scopes, artifacts, and decisions in scope. A strategy may be intentionally partial; it must make its limits explicit.

## Establish test drivers and objectives

Derive objectives from evidence, not from a universal test pyramid or tool checklist. Consider proportionately:

- actor goals, guarantees, alternatives, errors, denied behavior, boundaries, recovery, and data integrity;
- architecture dependencies, contracts, consistency, migrations, and external boundaries;
- security and privacy controls, abuse cases, safe failure, identities, secrets, and prohibited disclosure;
- usability, accessibility, performance, reliability, resilience, compatibility, observability, and operability where requirements or risks justify them;
- environment isolation, configuration, data lifecycle, reproducibility, packaging, and delivery claims;
- consequential unknowns exposed by prototypes, implementation, incidents, reviews, or prior evidence.

For each objective state the evidence required now and the limitation that remains. Do not manufacture numeric targets, supported platforms, compliance obligations, risk tolerances, or production conditions merely to complete the strategy.

## Define test policy

Record only project-specific rules that govern later test design and evidence. Assign stable `TST-NNN` identifiers to normative policies, use the repository's requirements language, preserve identifiers while meaning remains stable, and retire rather than reuse them.

Policies should address applicable concerns such as:

- traceability to an authoritative claim or explicit risk;
- independence of the expected result from the current implementation;
- proportionate normal, alternative, error, denied, cancellation, boundary, and recovery coverage;
- permitted data, state isolation, reproducibility, and cleanup;
- treatment of database, integration, browser, security, quality, and human-review evidence;
- blocking failures, accountable exceptions, skipped checks, and residual limitations;
- the difference between coverage indicators and demonstrated requirement or risk coverage.

Do not assign policy IDs to assumptions, temporary observations, tool commands, placeholders, or open questions. Keep generic testing advice in this skill rather than copying it into every strategy.

## Allocate evidence across test levels and reviews

For each material claim or risk, select the lowest-cost level that can establish it reliably and add broader checks only where a boundary or failure mode requires them. Define responsibilities rather than exhaustive test cases.

Possible levels include specification validation, static analysis, unit or component tests, contract tests, integration tests, migration tests, architecture tests, security checks, system or browser tests, quality measurements, operational exercises, exploratory review, UX or accessibility review, and accountable evaluation. Use only those justified by the current scope.

For each selected level record:

- the claims or risks it owns;
- the current or intended mechanism and its accepted Technology source;
- when it is required and in which execution context;
- what it cannot establish;
- whether evidence is automated, observed, measured, or reviewed by a human.

Avoid redundant coverage whose only purpose is to increase test counts. Automated checks do not replace human judgment where correctness depends on intent, usability, architecture fit, security interpretation, or acceptance.

## Define traceability, data, environments, and evidence

Describe the smallest traceability chain that lets a reviewer move from an authoritative claim or risk to a test or review and then to a result. Preserve stable identifiers and link rather than duplicate sources.

For each relevant execution context define permitted data and credentials, state ownership, isolation, initialization, migration, reset, cleanup, concurrent-use limits, and the evidence boundary. Distinguish interactive development state, verification contexts, short-lived sandboxes, review environments, shared environments, and production. Do not authorize data movement or environment use that Deployment or Security Architecture has not permitted.

Define what a durable evidence record must identify, such as source state, environment or sandbox, relevant configuration, command or review method, result, skipped or unavailable checks, failure classification, and residual limitation. Retain raw logs, reports, screenshots, or recordings only when an explicit evidence policy requires them.

## Define readiness gates and handoffs

Define the conditions under which the current prototype, Slice, release candidate, or environment is ready for its next accountable review. A gate should reference required claims and evidence categories, not duplicate concrete command sequences owned by repository automation.

State:

- which failed or missing evidence blocks the readiness claim;
- how an accountable exception records scope, reason, risk, owner, and resolution condition;
- which reviews remain human decisions;
- what passing the gate does and does not establish;
- how evidence may be reused when its claim, source, environment, and validity remain unchanged.

Hand the required executable outcomes to CI/CD. Hand detailed scenario design to the relevant prototype, Slice, requirement, or test-design work. Do not implement a framework, harness, test script, fixture system, or pipeline as part of this skill.

## Collaborate and manage uncertainty

Resolve with the user choices that materially change assurance, cost, responsibility, or readiness: risk tolerance, required evidence, supported contexts, blocking policy, human-review authority, retention, and activation of deferred quality or production concerns. Make ordinary editorial and traceability decisions autonomously.

Classify statements as facts, assumptions, proposals, decisions, recommendations, or open questions. Give every open question an owner and resolution condition. Create or update a decision record when repository governance requires durable acceptance.

Ask the user to confirm a concise synthesis of scope, objectives, policies, level responsibilities, data and environment boundaries, gates, deferrals, and handoffs before material writes unless an immediate provisional draft was explicitly requested.

## Create or update the strategy

Use the canonical template and keep only sections relevant to the current maturity. Preserve stable policy identifiers and unaffected content on repeat invocation. Keep a new or materially changed strategy in `draft` unless accountable authority explicitly assigns another state.

Link exact authoritative sources rather than reproducing requirements, architecture, controls, environment specifications, prototype scenarios, Slice claims, commands, or raw evidence. Distinguish target strategy from currently implemented mechanisms and expose drift rather than describing an intended capability as present.

Apply only authorized, meaning-preserving secondary updates. Route material changes to Requirements, UX, Architecture, Entities, Technology, Security, Deployment, CI/CD, Implementation, Operations, planning, or evaluation ownership.

## Validate and report

Before completion, confirm that objectives trace to evidence, selected levels have non-overlapping responsibilities, data and environment use is permitted, human review is explicit, readiness semantics are bounded, deferred concerns have activation conditions, and current capabilities are not overstated.

Validate links, identifiers, lifecycle metadata, repository structure, and definition-of-done checks. Report the strategy scope, principal objectives and policies, selected levels and reviews, data and environment boundaries, gates, deferrals, current gaps, decisions, handoffs, validation performed, and residual uncertainty. Never present passing checks as product acceptance, regulatory approval, or production assurance.
