---
name: create-technical-foundation
description: Establish, repair, or align the smallest executable technical foundation required for Prototype and Slice delivery, including repository structure, build, test runtime, migrations, configuration, local execution, packaging, and verification entry points. Use after architecture, technology, security, deployment, test, and CI/CD baselines are sufficiently decided; do not define product behavior, select unsupported technology, implement a delivery Slice, redesign governing baselines, deploy externally, or claim product or production readiness.
---

# Create Technical Foundation

Create a reusable executable baseline before Prototype specification and ordinary Slice planning depend on it. Establish mechanisms, not product behavior. Keep the foundation small, source controlled, reproducible, and consistent with accepted architecture and technology decisions.

The user's instructions take precedence. Authorization covers repository-local foundation code, configuration, scripts, empty migrations, minimal smoke fixtures, and raw technical evidence. It does not authorize production access, shared infrastructure mutation, business-feature implementation, or new architectural and technology decisions.

## Preserve authority

- Software Architecture owns module boundaries, dependency rules, contracts, and distribution strategy.
- Technology owns languages, frameworks, datastores, build tools, versions, and usage boundaries.
- Security, Deployment Architecture, Test Strategy, and CI/CD own their respective policies and required mechanisms.
- The Technical Foundation record owns only the current executable mechanism index, smoke evidence, gaps, and revision history.
- Manifests, source, scripts, and configuration remain authoritative for their exact executable content.

Do not turn a convenient scaffold default into an accepted decision. Route a missing or contradictory baseline to its owner.

## Load a bounded context

Read applicable repository instructions, the documentation routing index, workflow, Definition of Done, and the canonical Technical Foundation template. Then load only accepted sections that govern the mechanisms being established: architecture, entities where migrations require them, technology, security, deployment environment, test strategy, CI/CD, decisions, and existing source structure.

On repeated invocation, read the current Technical Foundation record, repository state, latest smoke evidence, and open gaps first. Preserve working mechanisms and stable check identifiers. Do not rebuild green areas merely because the skill was invoked again.

## Select the operating mode

- **Initial:** no usable shared foundation exists.
- **Continuation:** complete named mechanisms or checks left partial by an earlier run.
- **Correction:** repair a demonstrated foundation defect without broadening scope.
- **Alignment:** reconcile the foundation with an accepted baseline change and identify affected delivery work.

State the mode, source state, mechanisms in scope, governing anchors, and explicit exclusions.

## Establish readiness

Before writing, verify that every selected mechanism has an accepted owner and usage boundary. At minimum, determine which of these are required now:

- repository and module structure;
- language runtime and dependency management;
- build and local verification entry points;
- unit- and integration-test runtime;
- configuration and secret-free local profiles;
- database connectivity and forward-migration mechanism;
- reproducible local dependencies and lifecycle commands;
- packaging, artifact, architecture-check, or static-analysis entry points required by the current baselines.

If a necessary technology, environment, test, or delivery choice is undecided, stop that mechanism and create a precise handoff. Do not select a framework or invent a policy inside this skill.

## Implement the smallest foundation increment

For each mechanism:

1. Inspect existing files and conventions before changing them.
2. Define one observable technical outcome and the smallest smoke check that proves it.
3. Add or adjust only foundation-level structure, configuration, scripts, minimal bootstrap code, and synthetic fixtures needed for that outcome.
4. Run the smoke check from a documented clean-enough state.
5. Record the exact command, source state, result, limitation, and next gap.

Use empty or behavior-neutral seams where product logic would otherwise be required. A generic commerce foundation, for example, may prove that empty `Catalog` and `Ordering` module boundaries compile and that a migration runner starts; it must not implement product search or order placement.

Do not add a broad automation framework to prove one command. Reuse repository wrappers, lockfiles, and accepted tools. Never weaken checks or security boundaries to obtain a green result.

## Maintain the foundation record

Create or update the established Technical Foundation artifact, defaulting to `docs/implementation/technical-foundation.md`. Use the canonical template and keep it concise:

- link each mechanism to its executable location and governing source;
- assign stable `TF-CHK-NNN` identifiers to durable smoke checks;
- distinguish usable, partial, blocked, and superseded mechanisms;
- record provisional choices, missing capabilities, and their owners;
- append meaningful revision history instead of erasing prior evidence.

The record is an index, not a copy of manifests or logs.

## Diagnose and route failures

Classify a failure before editing: foundation implementation, tool or version compatibility, configuration, environment, test runtime, migration, packaging, or governing-baseline gap. Change one causal assumption at a time. After two similar unsuccessful corrections, reduce the reproduction and form a materially different hypothesis before continuing.

Route product behavior to `specify-prototype` or `specify-slice`, implementation sequencing to `plan-implementation`, test cases to `create-tests`, and Slice code to `create-code`.

## Validate and report

Run applicable smoke checks and repository validation. Verify that a fresh agent can find the foundation record, reproduce each claimed mechanism, distinguish facts from gaps, and identify which capabilities are ready.

Report the mode, changed mechanisms and files, exact checks and results, current foundation state, provisional choices, unresolved gaps and owners, and whether the baseline is sufficient for `specify-prototype` and `plan-implementation`. Never describe it as proof of product correctness, release readiness, or production readiness.
