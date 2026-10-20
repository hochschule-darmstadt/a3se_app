---
name: create-code
description: Implement, refine, correct, or align the product code, migrations, and scope-specific configuration for one implementation-plan increment until its prepared unit and integration tests pass. Apply applicable coding guidelines when available and existing governing constraints and conventions otherwise. Use after create-tests has supplied adequate executable expectations; do not redefine scope or architecture, create a test or delivery framework, change valid tests to fit the implementation, operate the full CI/CD path, perform review, or claim acceptance, release, or production readiness.
---

# Create Code

Implement one bounded plan increment against prepared tests and fixed authoritative constraints. Prefer the smallest complete change that makes the intended behavior executable and leaves the repository diagnosable.

Authorization covers product source, scope-specific migrations, fixtures, configuration, and focused verification needed for the increment. It does not authorize production access, external deployment, broad refactoring, test-policy changes, or unrelated repository work.

## Preserve authority

- The governing Prototype Charter or Slice Manifest owns scope, claims, and constraints.
- The Implementation Plan owns increment boundaries, order, ordinary decisions, and evidence intent.
- Prepared tests express executable expectations but do not override their authoritative sources.
- Architecture, entities, technology, security, deployment, Test Strategy, and CI/CD retain authority over their concerns.
- Applicable Clean Code guidance and accepted Coding Guidelines govern coding conventions, implementation patterns, and rule-level verification within those constraints. Honor documented exceptions only within their stated scope.
- Source, migrations, and configuration own the exact implementation.

If implementation requires changing a fixed boundary, stop and hand the finding to its owner. Do not encode a new requirement or architectural decision as an incidental code choice.

## Load the smallest implementation context

Read repository instructions, [the documentation context map](../../../docs/README.md), [the implementation reading path](../../../docs/implementation/README.md), workflow, Definition of Done, the governing scope artifact, current Implementation Plan, exact increment, its tests, and relevant Technical Foundation mechanisms. Load the authoritative anchors needed for the increment and applicable repository-wide, language, or module coding guidance. Inspect existing conventions and overlapping user changes before editing.

On repeated invocation, start from the recorded source state, current increment status, latest focused test and code-check results, unresolved findings, and current applicable guidance. Preserve valid code and do not restart completed work.

## Apply available coding guidance

- **With Coding Guidelines:** find their authoritative location through repository instructions and the implementation index, including a grown topic's routing page. Read only rules, patterns, examples, reference-use instructions, verification mappings, and exceptions relevant to the changed scope. Apply rules according to their lifecycle status and explicit authority; a draft proposal is not binding unless the user authorizes its use for this increment.
- **Without Coding Guidelines:** proceed from repository instructions, applicable general Clean Code guidance, accepted architecture and technology decisions, existing tool configuration, and consistent local conventions. Make ordinary implementation choices within those constraints. Do not invent a normative rule catalog, treat observed defects as conventions, or require guideline creation before coding.
- **Partial or conflicting guidance:** use established rules where applicable and the same fallback for uncovered routine details. Route material ambiguity or contradiction to `create-coding-guidelines` or the owning specification workflow; continue independent work within fixed boundaries. Missing guidelines alone are not a readiness failure, and this skill does not automatically create or revise them.

For unfamiliar APIs or implementation patterns, consult the indicated version-matched library sources and approved examples when available. Otherwise inspect existing dependency code or current primary documentation relevant to the exact uncertainty. Keep reference snapshots read-only and normal package dependencies authoritative for application imports.

Use available, approved quality-focused skills when their invocation conditions apply and their work fits the increment. An unavailable optional skill does not block implementation; report it when material. This does not authorize skill installation, harness activation, broader review, or external actions. Skill output supports implementation judgment; configured checks and explicit review criteria determine the verification evidence.

## Select the operating mode

- **Initial:** implement a prepared increment for the first time.
- **Continuation:** resume a partially implemented increment from recorded evidence.
- **Correction:** fix a demonstrated product-code, migration, or scope-configuration defect.
- **Alignment:** adapt code after an accepted source or plan change without broadening the scope.

State the mode, scope, increment, tests, affected realization areas, and explicit exclusions.

## Confirm implementation readiness

Verify that:

- the increment has an observable outcome and fixed source anchors;
- required unit and integration tests exist or a documented exception explains why a level is not applicable;
- expected-red failures are caused by missing or defective behavior rather than infrastructure;
- required Technical Foundation mechanisms are usable;
- migrations, compatibility, security, data, configuration, and reset constraints are explicit;
- applicable coding rules and their scoped exceptions are understood, and any required code-check mechanism is usable or has an exception permitted by the governing verification policy;
- no unresolved contradiction requires an authoritative decision.

If these conditions fail, route the exact gap to `plan-implementation`, `create-tests`, `create-technical-foundation`, or the owning specification workflow.

## Implement one causal increment

1. Make the smallest production change that can satisfy the prepared expectation.
2. Preserve module ownership, dependency direction, contracts, entity meaning, security controls, and accepted technology boundaries; apply the scoped coding guidance and approved patterns identified above.
3. Add forward migrations and safe configuration changes when planned; do not rewrite shared or released history.
4. Use synthetic fixtures and explicit non-secret configuration.
5. Run the focused tests after each causal change.
6. Refactor only within the increment when tests remain green and the change reduces immediate complexity.

Do not add speculative abstractions, unrelated cleanup, hidden fallback behavior, or hard-coded business rules. Do not weaken coding rules, check configuration, or valid tests merely to obtain green. When a test is demonstrably defective, stop that path and return it to `create-tests` with evidence.

## Diagnose failures without thrashing

Classify failure as product logic, wiring, data or migration, configuration, compatibility, test defect, foundation or environment, or authoritative gap. Keep the smallest reproduction and change one causal assumption at a time.

After two substantially similar unsuccessful corrections, pause speculative editing. Record observation separately from cause hypothesis, inspect exact versions and boundaries, reduce the reproduction, and form a materially different hypothesis.

## Complete the increment

Run all focused unit and integration tests assigned to the increment plus proportionate nearby regression checks. Run the configured coding-rule checks relevant to the change using established entry points and an appropriate scope, preserving unrelated user work. Missing required shared checks belong to `create-technical-foundation`; policy and gate changes belong to their existing owners.

Update the Implementation Plan and linked evidence index with source locations, migrations, configuration, commands, results, deviations, and remaining work. Identify the guidance used, relevant rule IDs where available, checked conditions, justified exceptions, and criteria left for human review. Without guidelines, name the fallback sources and material ordinary choices; do not invent rule IDs. Do not operate or claim the complete CI/CD gate; that belongs to `operate-ci-cd`.

## Validate and report

Check source and plan traceability, applicable coding guidance, code and migration quality, configuration safety, module boundaries, focused test and code-check results, preserved user work, direct links, repository validation, and explicit skipped checks. Claim compliance only for the rules and conditions actually checked; keep remaining human review visible.

Report the mode, increment outcome, files and behavior changed, migrations or configuration, exact focused checks and results, ordinary decisions used, deviations, remaining risks and owners, and whether the increment is ready for `operate-ci-cd` or another planned increment. Never claim review acceptance, release readiness, or production readiness.
