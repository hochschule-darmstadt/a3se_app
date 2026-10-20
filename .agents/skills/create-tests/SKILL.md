---
name: create-tests
description: Create, refine, correct, or align the unit and integration tests required by one ready implementation-plan increment, preserving authoritative behavior, test-strategy boundaries, and traceable evidence intent. Use after a reviewed Prototype or Slice implementation plan identifies test responsibilities; do not define test policy or frameworks, implement product behavior, weaken expectations to match current code, operate the full CI/CD path, review the result, or claim acceptance or production readiness.
---

# Create Tests

Create both unit and integration tests for one bounded implementation-plan increment. This single task intentionally spans coding-level unit tests and integration-level boundary tests. Keep each test at the narrowest reliable level and make its source expectation traceable.

Authorization covers test code, test fixtures, test-only configuration, minimal test doubles within the accepted toolchain, and focused test execution. It does not authorize product-code implementation, a new testing framework, shared infrastructure changes, or changes to authoritative behavior.

## Preserve authority

- The Prototype Charter or Slice Manifest owns scope and claims.
- Requirements, use cases, UX, architecture, entities, technology, security, and environment artifacts own their defined expectations.
- Test Strategy owns level responsibilities, automation policy, data, environments, evidence semantics, and readiness gates.
- The Implementation Plan owns increment order and planned test responsibilities.
- Test source owns executable examples; it does not create requirements by itself.

If sources disagree, do not encode a convenient interpretation. Stop the affected test and route the contradiction.

## Load a bounded context

Read repository instructions, the workflow, Definition of Done, the governing scope artifact, the current Implementation Plan, and the exact increment in scope. Follow only its named behavior, UX, architecture, entity, security, Test Strategy, and Technical Foundation anchors. Inspect the existing test conventions and relevant production seams.

On repeated invocation, read current tests and their latest focused results first. Preserve valid coverage and stable test intent. Do not regenerate an entire suite for one missing case.

## Select the operating mode

- **Initial:** create the tests planned for an increment that has no adequate executable coverage.
- **Continuation:** complete named missing cases or levels from an earlier run.
- **Correction:** repair a demonstrated test defect without changing the expected behavior.
- **Alignment:** update tests after an accepted source or plan change, marking obsolete expectations clearly.

State the mode, scope identity, plan increment, authoritative expectations, test levels, and exclusions.

## Design proportionate coverage

For each planned responsibility:

1. identify the stable claim, scenario, rule, control, or boundary it evidences;
2. select unit, integration, or both according to Test Strategy and risk;
3. define preconditions, synthetic data, stimulus, observable result, and failure message;
4. cover applicable normal, alternative, boundary, denied, error, retry, and recovery behavior;
5. avoid asserting internal details unless the accepted architecture or contract makes them material.

Unit tests isolate one behavior or policy at a stable seam. Integration tests exercise a real accepted boundary such as persistence, serialization, module collaboration, framework wiring, or an adapter contract. Do not call a mock-heavy unit test an integration test.

A generic commerce example may clarify intent: an order-total rule can have focused unit examples, while saving and reloading an order through the accepted persistence adapter is integration evidence. The example does not invent tax, discount, or authorization rules.

## Implement tests before product behavior

Use existing frameworks, fixtures, naming, builders, containers, and execution entry points. Add only the smallest test support needed by the planned cases. Use synthetic data and avoid secrets or external production systems.

When the behavior is not implemented yet, run the focused test and confirm that it fails for the intended missing behavior, not compilation, broken infrastructure, stale data, or unrelated configuration. Record an expected-red result as evidence of test readiness, not as a defect or completed implementation.

When correcting or aligning tests around existing behavior, distinguish:

- a test defect, which this skill may repair;
- a product-code defect, which belongs to `create-code`;
- a missing foundation or environment mechanism, which belongs to `create-technical-foundation` or its governing owner;
- an expectation or scope defect, which belongs to the appropriate specification or planning workflow.

Do not edit product code to make tests pass. Do not delete, skip, loosen, or rewrite a valid expectation merely because current code fails.

## Record execution evidence

Run the smallest relevant unit and integration commands. Record command, source state, environment, result, expected-red reason or green outcome, skipped cases, and direct report location in the Implementation Plan or its linked raw-evidence destination. Update the governing Charter or Manifest only with meaning-preserving evidence links and status.

## Validate and report

Verify source traceability, correct level selection, deterministic synthetic data, isolation, meaningful failure diagnostics, compatibility with the Technical Foundation, stable links, and repository validation. State explicitly when a planned level is not applicable and why.

Report the mode, increment, tests and fixtures changed, unit and integration responsibilities covered, commands and results, expected-red or green state, gaps and owners, and whether the increment is ready for `create-code`. Never claim acceptance, complete integration, or production readiness.
