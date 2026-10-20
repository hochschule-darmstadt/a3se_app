---
name: specify-prototype
description: Select and specify a representative fixed use-case Slice as a Prototype or proof-of-concept charter for validating architecture and technology, including their technical-security and delivery mechanisms. Use after the Technical Foundation and sufficient authoritative behavior and UX exist, for initial specification or later refinement, correction, readiness, or alignment; do not validate business correctness, implement or plan the Prototype, redefine authoritative inputs, review results, or claim production readiness.
---

# Specify Prototype

Create or maintain one bounded Prototype Charter that uses a representative vertical slice to test technical hypotheses. Business behavior and UX are fixed inputs to the experiment. The Prototype may show whether they can be realized with the proposed architecture and technology, but this task does not decide whether they are correct for the product.

Authorization to specify does not authorize implementation planning, tests, code, pipeline operation, external deployment, Prototype review, approval, or changes to authoritative requirements and design.

## Preserve authority

- The use-case catalog and detailed use-case specification own actor goals, scenarios, guarantees, rules, and acceptance examples.
- Navigation, Wireframes, and Design System own interaction structure, states, feedback, recovery, and experience guidance.
- Software Architecture, Logical Entities, Technology, Security, Deployment Architecture, Test Strategy, and CI/CD own their respective technical baselines.
- The Technical Foundation record owns available executable mechanisms and gaps.
- The Prototype Charter owns the selected representative slice, technical hypotheses, prototype-only treatments, evidence scenarios, completion and abort criteria, input routing, and Prototype review record.
- The Implementation Plan owns execution sequence. Tests, code, and delivery evidence own raw results. `review-prototype` owns the evidence-led recommendation; accountable authority owns approval.

Do not copy authority into the Charter. Link exact anchors and route material defects to their owners.

## Load a bounded context

Read repository instructions, documentation routing, lifecycle workflow, artifact guidance, Definition of Done, and the canonical Prototype template. Read the current Charter on repeated invocation.

Start with Product Vision, glossary, actors, use-case catalog, constraints, and decisions only far enough to identify a representative actor goal. Then progressively load the selected detailed use case, acceptance examples, relevant UX, architecture, entities, technology, security, deployment, test, CI/CD, and Technical Foundation anchors. Existing implementation or review evidence is continuation-, correction-, or alignment-only input.

## Select the operating mode

- **Initial:** select the first representative slice and create its Charter.
- **Refinement:** improve named hypotheses, scope, treatments, scenarios, or criteria while preserving unaffected content.
- **Correction:** repair a demonstrated Charter defect and record its impact.
- **Readiness assessment:** determine whether the current Charter can hand off to planning, writing only when authorized.
- **Alignment:** compare the Charter with accepted baseline changes and update or report drift.

On repeated invocation, treat the current Charter and history as the baseline. Preserve stable `POC-HYP-NNN` and `POC-SC-NNN` identifiers while meaning continues; retire rather than reuse them.

## Confirm prerequisites

Before selecting hypotheses, verify:

- the actor goal has a sufficiently detailed complete use-case specification;
- relevant UX states and recovery paths exist;
- architecture, logical entities, technology, technical security, deployment, test, and CI/CD baselines are sufficiently decided;
- the Technical Foundation is usable for the intended experiment or its exact accepted limitation is explicit;
- central business rules and acceptance examples needed by the slice are not being invented.

Reactivate the owning skill for a material gap. An explicitly requested early draft may retain visible blockers, but it must not be called ready for implementation planning.

## Select a representative fixed slice

Choose a coherent vertical slice beginning at a clear trigger and ending in an observable result. Prefer a slice that:

- crosses meaningful interaction, application, domain, persistence, and delivery boundaries;
- exercises technical uncertainty worth resolving;
- includes proportionate normal, denied, error, boundary, and recovery behavior;
- is small enough to implement and review without unrelated product scope;
- has sufficient authoritative behavior and UX to avoid invention.

Record included and excluded behavior without redefining the complete actor goal. Exclusion from the Prototype is not exclusion from the product.

## Define only technical hypotheses

Create a small set of falsifiable hypotheses concerning one or more of:

- module ownership, dependency direction, contracts, consistency, or distribution assumptions;
- logical-entity realization, persistence, migrations, or data compatibility;
- framework, datastore, integration, build, packaging, or runtime compatibility;
- technical security and privacy mechanisms under the permitted Prototype profile;
- deployment, configuration, observability, reproducibility, CI/CD, or local review mechanisms;
- the selected technical toolchain's ability to build, verify, package, and expose one vertical slice as traceable evidence.

For each hypothesis state observable evidence and the decision it enables. Do not create hypotheses about product value, business-rule correctness, navigation quality, content, or usability. Conformance to fixed business and UX inputs may be an implementation precondition or finding, not the subject of validation.

## Define scope, treatments, and technical mapping

Record included scenarios, explicit exclusions, and every simulated, stubbed, fixture-driven, reduced, deferred, or real mechanism. Link each provisional treatment to the authoritative question it must not replace and its reconsideration trigger.

Map the slice to relevant UX states, modules, contracts, entities, technology mechanisms, security restrictions, environment, data change, and delivery path only far enough to constrain planning and test the hypotheses. Leave file layout, endpoints, schemas, packages, algorithms, and execution sequence to `plan-implementation` unless an accepted baseline already fixes them.

## Define evidence and decision criteria

Create stable evidence scenarios with source, preconditions, synthetic data, stimulus, expected observable result, minimum evidence, environment, and limitation. Cover technical behavior proportionately across normal, denied, error, boundary, and recovery paths.

Separate:

- **completion criteria:** evidence required before `review-prototype`;
- **abort or re-specification criteria:** conditions that make continued delivery misleading, unsafe, or unable to test a hypothesis;
- **review semantics:** supported, rejected, inconclusive, not run, or not applicable;
- **feedback routing:** owner for implementation, test, plan, foundation, architecture, technology, security, deployment, CI/CD, Charter, or workflow findings.

Passing tests is evidence, not approval.

## Compose the planning handoff

Populate **Implementation-planning input routing** with only the exact anchors needed at planning start or before a dependent increment. This contract supports both the decomposed implementation path and the optional complete `implement-prototype` assignment for a stronger model capable of the combined complexity. Include the applicable Technical Foundation state. Keep prior plans, code, and review history out of an initial working set unless they constrain the current scope.

Index expected deliverables under **Planned evidence and implementation handoff** using the shared task chain: `plan-implementation`, `create-tests`, `create-code`, `operate-ci-cd`, and `review-prototype`. When the integrated alternative is selected, assign planning, tests, code, and raw delivery evidence to `implement-prototype`; retain the same artifact locations and the separate `review-prototype` handoff.

## Determine readiness and write

A Charter is ready for planning when the fixed slice and exclusions are unambiguous; technical hypotheses are falsifiable; treatments and security limits are visible; relevant baselines and Technical Foundation mechanisms are sufficient; evidence is feasible; and no unresolved authoritative contradiction would force invention.

Before a material write, present a concise synthesis for user confirmation unless the user explicitly requests an immediate provisional draft. Then create or update the established Charter, defaulting to `docs/implementation/prototype.md`, using the canonical template. Preserve compatible user-authored content, direct links, identifiers, and review history. Initialize new evidence and review entries honestly; never fabricate results.

## Validate and report

Check representative-slice traceability, fixed-input boundaries, technical-hypothesis scope, scenario-to-evidence coverage, real versus provisional treatments, Technical Foundation compatibility, planning input routing, security constraints, completion and abort criteria, stable identifiers, valid links, repository validation, and explicit limitations.

Report the operating mode, Charter location and status, selected slice, technical hypotheses, treatments, evidence scenarios, blockers and owners, changes from prior state, and whether it is ready for `plan-implementation` or the selected `implement-prototype` alternative. Never describe it as implemented, reviewed, product-validated, accepted, release-ready, or production-ready.
