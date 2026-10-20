---
name: operate-ci-cd
description: Execute, rerun, or diagnose the already defined CI/CD and local-delivery path for one Prototype or Slice, capture reproducible raw evidence, and route failures to their true owner. Use after planned tests and code exist and the applicable delivery mechanisms are established; do not define CI/CD policy, invent pipeline or environment architecture, rewrite product behavior or valid tests, deploy to an unauthorized target, perform acceptance review, or claim release or production readiness.
---

# Operate CI/CD

Operate the accepted verification and delivery path; do not design it. Produce raw, reproducible evidence for later Prototype or Slice review and keep execution results distinct from review conclusions.

The user's requested target and existing authorization bound every operation. Local verification may be routine. Publishing, promotion, shared-environment mutation, rollback, or deployment requires the authority already established for that target and action.

## Preserve authority

- CI/CD owns stages, gates, artifacts, promotion rules, failure policy, evidence, and activation conditions.
- Deployment Architecture and environment specifications own target topology, access, configuration, data, lifecycle, and rollback boundaries.
- The Implementation Plan owns scope-specific expected execution and evidence.
- Tests, source, migrations, and configuration own executable inputs.
- The evidence artifact owns raw results. `review-prototype` or `review-slice` owns conclusions; accountable roles own approval.

Do not add a pipeline or bypass a gate merely because the required mechanism is unavailable.

## Load a bounded execution context

Read repository instructions, workflow, Definition of Done, the governing Charter or Manifest, current Implementation Plan, Technical Foundation record, applicable CI/CD and environment sections, runbook, and only the source or test details needed to execute or diagnose named stages.

On repeated invocation, read the latest source identity, prior run result, failed stage, environment state, and superseded evidence first. Never present stale evidence as current.

## Select the operating mode

- **Initial execution:** run the applicable path for the current scope and source state.
- **Rerun:** repeat named stages after an identified change, preserving earlier results as history.
- **Targeted diagnosis:** isolate one failed or unavailable stage without implying the whole path passed.
- **Evidence completion:** perform a previously skipped authorized check or observation.

State scope, source identity, environment, mode, stages, data classification, and prohibited actions.

## Establish execution readiness

Confirm that:

- the plan identifies the expected path and evidence destination;
- tests and code for the intended increments exist;
- commands, wrappers, pipeline definitions, environment profiles, and secrets handling are already defined;
- dependencies and target services can be used safely;
- cleanup, reset, artifact retention, and rollback behavior are known where relevant;
- the requested operation is authorized.

Mark unavailable mechanisms as gaps owned by `create-ci-cd`, `create-deployment-architecture`, or `create-technical-foundation`. Do not manufacture an equivalent command and call it the accepted gate.

## Execute and capture evidence

Run stages in the defined order, commonly including applicable local checks, unit and integration tests, build, static or architecture checks, migrations, packaging, startup, smoke checks, artifact creation, promotion, deployment, or rollback verification.

For every stage record:

- exact command or pipeline run and source identity;
- tool and environment context needed for reproduction;
- start and completion state;
- passed, failed, skipped, unavailable, or superseded result;
- report, artifact, log, or observation link;
- cleanup, reset, or rollback result;
- limitations and evidence validity conditions.

Use concise indexes and durable reports rather than pasting long logs. Redact secrets and exclude personal or production data.

## Diagnose and route

Classify failures before retrying:

- test expectation or test implementation → `create-tests`;
- product source, migration, or scope configuration → `create-code`;
- increment sequence or realization decision → `plan-implementation`;
- absent shared mechanism → `create-technical-foundation`;
- pipeline policy or definition → `create-ci-cd`;
- environment architecture or lifecycle → `create-deployment-architecture`;
- scope or authoritative contradiction → `specify-prototype`, `specify-slice`, or the owning artifact.

This skill may perform read-only diagnostics and safe reruns. It must not fix another task's artifact unless the user separately authorizes that task.

## Determine evidence readiness

Evidence is ready for review when all required stages have current attributable results, skipped or unavailable checks are explicit, artifacts and observations match the source state, teardown or rollback obligations are satisfied, and another reviewer can reproduce the path.

Passing gates demonstrates only the checks that ran. It does not approve the Slice, support a Prototype hypothesis by itself, or establish release or production readiness.

## Validate and report

Verify stage completeness, source and environment identity, artifact integrity where required, secret-safe evidence, cleanup state, direct links, repository validation, and honest status semantics.

Report the mode, source and target, stages and results, artifact and evidence locations, failures by owner, skipped or unavailable checks, cleanup or rollback state, residual limitations, and whether evidence is ready for `review-prototype` or `review-slice`.
