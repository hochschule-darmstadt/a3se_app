---
name: implement-prototype
description: Implement, continue, correct, or align one reviewed Basic Concept Prototype as a complete assignment, including implementation planning, unit and integration tests, product code, migrations, configuration, delivery execution, and reproducible evidence. Use as an alternative to the decomposed delivery path when a stronger model can reliably manage the combined complexity. Requires a usable Technical Foundation and fixed authoritative inputs; excludes Prototype specification, technical-hypothesis review, approval, and unauthorized deployment.
---

# Implement Prototype

Turn one reviewed Prototype Charter into an executable, tested result with current evidence ready for technical review. Own the entire implementation assignment: work out the realization sequence, create the tests, implement the bounded behavior, execute the established delivery path, diagnose and correct implementation failures, and maintain the evidence needed to reproduce the result.

Perform this work directly from the instructions below and the governing artifacts. Do not invoke, delegate to, or require reading separate planning, test-creation, code-creation, or delivery-operation skills. Planning, testing, coding, and delivery are responsibilities within this assignment, rather than separate skill handoffs.

## Choose this alternative deliberately

This skill is the optional implementation path for a stronger model that can retain the fixed scope and relevant constraints, reason across tests and implementation, and maintain a coherent plan and evidence over several increments. The decomposed path remains available for models or scopes that benefit from narrower tasks. Select by demonstrated ability to handle this Prototype's complexity, rather than by a hard-coded model name or an assumed capability label.

If sustained loss of constraints or incoherent execution makes this combined assignment unreliable, checkpoint completed work, exact source state, remaining increments, and unresolved findings. Recommend continuation through narrower tasks without silently changing models or invoking another skill.

## Preserve scope and authority

- The Prototype Charter owns the representative slice, technical hypotheses, included and excluded behavior, provisional treatments, evidence scenarios, and completion and abort criteria.
- Use cases, rules, acceptance examples, Navigation Map, Wireframes, and Design System supply fixed behavior and UX. Realize their relevant states, feedback, recovery, and accessibility expectations faithfully.
- Software Architecture, Logical Entities, Technology, Security, Deployment Architecture, Test Strategy, and CI/CD retain authority over their respective boundaries.
- The Technical Foundation establishes the reusable executable mechanisms available to this assignment. Missing shared mechanisms are a foundation gap, not permission to bootstrap a new stack or delivery framework.
- One scope-specific Implementation Plan owns sequence and ordinary realization decisions. Source, tests, migrations, configuration, and linked raw reports own the implemented result and execution evidence.
- Technical-hypothesis assessment, review recommendations, and accountable approval follow implementation. Do not populate successful review conclusions or infer approval from green checks.

Authorization to implement covers the plan, tests and synthetic fixtures, product code, scope-specific migrations and configuration, local verification, and evidence maintenance for this Prototype. Publication, promotion, shared-environment changes, rollback, and external deployment remain bounded by existing authorization for the exact target and action.

## Establish the working context

Read applicable repository instructions, [documentation routing](../../../docs/README.md), the [Agent Workflows](../../../docs/governance/workflows/agent-workflows/agent-workflows.md), [Artifact Authority and Lifecycle](../../../docs/governance/workflows/artifact-lifecycle.md), [Definition of Done](../../../docs/governance/workflows/definition-of-done.md), and the [Implementation Plan template](../../../docs/governance/templates/implementation-plan.md).

Read the complete governing Charter and its exact input-routing anchors. Load the relevant Technical Foundation, fixed behavior and UX, architecture, entity, technology, security, environment, test, and delivery sections before their dependent work. Consult the established runbook for executable commands. A bibliography does not require loading the entire repository.

Inspect source paths, executable manifests, current tests, commands, branch or revision, working-tree changes, and relevant environment state. Preserve overlapping user work. Do not guess paths or present old results as evidence of the current source.

State the mode and the single Prototype in scope:

- **Initial:** plan and implement a reviewed Charter for the first time.
- **Continuation:** resume incomplete work from the current plan and evidence.
- **Correction:** fix demonstrated planning, test, code, migration, configuration, or execution defects within the unchanged Charter.
- **Alignment:** reconcile implementation after an authorized change to the Charter or governing baselines.

On repeated invocation, use the existing plan, implementation, tests, and evidence. Preserve stable `POC-HYP-NNN`, `POC-SC-NNN`, `IP-INC-NNN`, and `IP-DEC-NNN` identifiers while their meaning continues. Resume from the earliest affected responsibility; retain valid completed work.

## Confirm readiness

Confirm that the Charter has been reviewed for implementation; its fixed slice, technical hypotheses, treatments, and restrictions are explicit; the relevant Technical Foundation mechanisms are usable; and the required evidence can be obtained in an authorized environment. Artifact status alone does not establish readiness or execution permission.

Identify contradictions and missing requirements, UX states, architecture boundaries, technology selections, security rules, test policy, or delivery mechanisms before dependent work. Record each blocker with the affected identifiers, owning artifact, and required decision or evidence. Continue independent safe work when possible, but do not invent an authoritative input to unblock execution.

## Make implementation intent durable

Create or revise one Implementation Plan, normally `docs/implementation/prototype-implementation-plan.md`, using the canonical template. Record verified current-state facts, exact authoritative anchors, ordinary implementation choices and rationale, dependencies, migration and compatibility needs, configuration, reset or rollback obligations, and evidence destinations.

Divide the Prototype into independently checkable `IP-INC-NNN` increments ordered to expose technical risk early. Each increment specifies:

1. an observable outcome and its fixed behavior, UX, hypothesis, or scenario anchors;
2. verified affected realization areas;
3. unit and integration expectations to establish before changing behavior;
4. bounded code, migration, fixture, and configuration work;
5. applicable verification commands, expected observations, and report locations;
6. dependencies, exit conditions, and stop conditions.

Map every in-scope hypothesis, evidence scenario, and completion criterion to a feasible test, inspection, delivery result, or review observation. Record a reason when a test level is not applicable. Do not use invented requirements or speculative abstractions to fill the plan.

Present the concrete scope, sequence, material choices, risks, and evidence mapping for the human plan review required by the workflow. Record actual feedback or existing explicit delegation; do not fabricate a review or request the same authorization again. Resolve material plan-review findings before dependent implementation. Ordinary reversible choices within the agreed constraints remain part of this assignment.

## Implement and verify each increment

Establish executable expectations from authoritative sources before writing the corresponding product behavior. Use the accepted test framework and existing conventions, with deterministic synthetic data and the smallest necessary test support.

Unit tests exercise focused behavior or policy. Integration tests exercise real accepted boundaries such as persistence, serialization, module collaboration, framework wiring, or adapter contracts. Cover relevant normal, alternative, error, denied, boundary, retry, and recovery paths in proportion to the Charter and Test Strategy. Mock-only interactions do not prove a real integration boundary.

Run focused tests. For missing behavior, distinguish the intended failing expectation from compilation failures or unavailable infrastructure. Record expected-red results honestly. When adequate tests already exist, retain them and add only missing coverage; a continuation does not require recreating tests or forcing green tests to fail.

Implement the smallest complete production change that satisfies these expectations while preserving module ownership, dependency direction, contracts, logical-entity meaning, selected technology, and security restrictions. Realize the fixed UX, including failure and recovery states. Apply only Charter-authorized simulations and reduced treatments, and keep their limitations visible.

Add planned forward migrations and compatible configuration. Preserve shared or released migration history. Use explicit non-secret configuration and synthetic fixtures; keep reset and disposal confined to the identified permitted data and environment.

Run the increment's unit and integration tests plus proportionate nearby regression checks. Diagnose failures, correct the causal defect, and rerun the affected checks. Refactor within the bounded increment when evidence remains valid. Do not skip, weaken, or rewrite a valid expectation to match defective code. Repair a demonstrated test defect directly, preserving its authoritative intent and recording the reason.

Update the plan and evidence after each increment with completed work, exact realization locations, results, deviations, and remaining obligations. Continue until all planned increments and applicable delivery conditions are complete or a genuine blocker prevents dependent work.

## Execute the established delivery path

Use the accepted CI/CD definitions, environment profile, wrappers, and runbook. Confirm required services, safe data handling, cleanup, artifact retention, and operation authority before execution. An unavailable gate is an explicit gap; do not invent a substitute pipeline and claim equivalence.

Execute the stages required by the plan and target environment, including applicable structural and architecture checks, unit and integration tests, build, migration, packaging, startup, smoke checks, and declared browser or end-to-end scenarios. Perform publication, promotion, deployment, or rollback verification only where the target and action are already authorized. Complete locally available preparation and evidence before requesting any missing external authority.

For every required stage or scenario record the exact command or run, attributable source state, relevant tool and environment context, result, direct report or observation link, and limitations. Distinguish passed, failed, skipped, unavailable, expected-red, and superseded results. Record cleanup, reset, or rollback outcomes where applicable. Link durable raw reports rather than copying long logs into the Charter. Exclude secrets and personal data from evidence.

After a causal change, rerun the affected stages and any downstream gates whose evidence was invalidated. Preserve earlier runs as history and mark superseded evidence explicitly. Do not claim that an unchanged older report verifies newly modified source.

## Diagnose, correct, and re-plan within the assignment

Classify failures by evidence before editing:

| Finding | Action within this assignment |
|---|---|
| Test implementation or fixture defect | Repair it directly against the unchanged source expectation and rerun the affected tests. |
| Product logic, wiring, migration, or scope configuration defect | Reproduce, correct the causal implementation defect, and refresh affected evidence. |
| Increment ordering or ordinary realization choice defect | Revise the existing plan, obtain any required review of a material change, and resume the affected increments. |
| Transient execution or dependency failure | Diagnose the exact stage and perform a safe bounded rerun when conditions justify it. |
| Missing shared foundation, pipeline policy, or environment architecture | Record the gap and its owning artifact; stop dependent execution while completing independent work. |
| Defective Charter hypothesis, scope, fixed behavior, UX, or technical baseline | Record the contradiction and required upstream change; resume dependent implementation after the input is corrected and reviewed. |

Keep observations separate from cause hypotheses. After two substantially similar unsuccessful corrections, stop speculative editing, reduce the reproduction, inspect exact versions and boundaries, and form a materially different diagnosis. Stop unsafe, unauthorized, or misleading execution according to the Charter's abort criteria.

Rejection or failure alone does not justify replaying unchanged work. Correct an evidenced implementation defect, update the affected reviewed input when necessary, or obtain the missing evidence. A result that contradicts a technical hypothesis is legitimate experiment evidence; do not redesign the experiment to manufacture success.

## Complete the implementation handoff

Maintain the current plan and the linked evidence index, normally `docs/implementation/prototype-evidence.md`. Update the Charter's implementation and evidence links and factual execution state without changing hypotheses, expected behavior, review conclusions, or approval. Update affected run instructions and derived implementation documentation when the realized authorized path changes.

The result is ready for technical review when:

- all included behavior and required increments are implemented against the fixed inputs;
- required tests and delivery gates have current attributable results;
- every technical hypothesis, scenario, and completion criterion has its required evidence or a Charter-permitted documented limitation; evidence gaps that defeat a completion criterion remain blockers;
- provisional treatments, deviations, skipped checks, failed scenarios, and residual limitations are visible;
- evidence is reproducible and matches the delivered source and environment;
- cleanup and applicable rollback obligations are satisfied;
- repository validation, direct links, and stable identifiers are consistent.

Check the Charter's exact completion and abort criteria. A failed experiment may still supply useful review evidence; distinguish implementation incompleteness from evidence that challenges a hypothesis. Report missing completion conditions honestly rather than declaring the implementation complete.

Report the Prototype and mode, implemented outcomes, source and environment identity, plan and evidence locations, executed checks and scenarios, material failures or skipped work, provisional treatments, cleanup state, and remaining blockers with owners. Identify what the subsequent Prototype review can examine. Leave technical-hypothesis classifications, the review recommendation, and accountable approval to that review. Implementation completion does not establish product correctness, release readiness, or production readiness.
