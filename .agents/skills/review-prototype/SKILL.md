---
name: review-prototype
description: Prepare and facilitate an evidence-led human review of a completed Prototype or proof of concept, assess each declared architecture and technology hypothesis and technical completion criterion, record limitations and a recommendation, and route findings to their owners. Use after implementation and current raw evidence exist; do not validate business or UX correctness, specify or implement the Prototype, fix defects, make the accountable approval decision, or infer release or production readiness.
---

# Review Prototype

Review whether a bounded Prototype supports its declared architecture and technology hypotheses, including technical-security and delivery mechanisms. The selected business behavior and UX are representative fixed inputs: verify implementation conformance where needed for the technical experiment, but do not use this review to decide whether those inputs are the right product behavior.

The agent prepares evidence, analysis, classifications, and a recommendation. Human reviewers provide observations and judgment. Accountable authority records approval separately.

## Preserve authority

- The Prototype Charter owns hypotheses, technical completion and abort criteria, evidence scenarios, limitations, and the Prototype review record.
- The Implementation Plan owns execution intent; source, tests, pipeline results, reports, and logs own raw evidence.
- Requirements, use cases, UX, architecture, entities, technology, security, deployment, test strategy, and CI/CD retain authority over their concerns.
- This review may identify defects or rejected assumptions but must not silently correct their owning artifacts.

Do not claim that a person observed, accepted, or approved something unless that feedback was actually provided.

## Load the review context

Read repository instructions, workflow, Definition of Done, the complete current Prototype Charter, current Implementation Plan when one exists, linked raw evidence, relevant Technical Foundation state, and exact authoritative sections needed to interpret each declared technical hypothesis. Inspect the source identity and environment represented by the evidence. When an implementation predates the separate plan artifact, retain that documented absence as a limitation rather than fabricating a historical plan.

Read prior review entries only to understand history, superseded evidence, or the scope of re-review. Do not preload unrelated product detail or treat old conclusions as current.

## Select the operating mode

- **Initial review:** assess every declared hypothesis and technical completion criterion for the first time.
- **Re-review:** reassess changed implementation or new evidence while preserving prior history.
- **Targeted review:** revisit named hypotheses, criteria, findings, or previously inconclusive results only.
- **Readiness assessment:** identify missing or invalid evidence without recording premature conclusions.

State the Prototype, source identity, environment, mode, hypotheses, and criteria in scope.

## Establish review readiness

Verify that:

- implementation and evidence correspond to the current Charter, source state, environment, and current Plan when one exists;
- required technical scenarios have current raw evidence or a precise authorized observation path;
- prototype-only treatments, deviations, skipped checks, and residual risks are visible;
- completion and abort criteria were checked rather than inferred;
- evidence can distinguish implementation defects from a rejected architecture or technology hypothesis.

Route missing tests to `create-tests`, code defects to `create-code`, missing or failed execution evidence to `operate-ci-cd`, plan defects or required future planning to `plan-implementation`, and defective hypotheses or scope to `specify-prototype`. A documented historical absence of a Plan can make method traceability incomplete without invalidating unrelated direct evidence. An inconclusive review may still be useful when the gap is explicit.

## Conduct the human review

For each in-scope hypothesis or criterion:

1. state the bounded technical claim and why it matters;
2. identify the source state, environment, scenario, and expected observable result;
3. tell the human reviewer which automated checks and e2e scenarios the agent already executed, including their source state, environment, result, and material limitations;
4. demonstrate or provide the smallest safe reproduction where human observation is required;
5. record human observation separately from agent analysis;
6. classify contradictions and their true owner.

Never ask a human reviewer to manually repeat an e2e scenario when current automated e2e evidence has already executed the same path successfully and covers the claim under review. Present the automated result and its limitations instead. Request human interaction only for an aspect that the automated evidence cannot decide, or when that evidence is missing, stale, inconclusive, or contradicted. Typical human-only aspects include visual conformance, comprehensibility, interaction judgment, and observations that require human perception. Target only that unmatched aspect with the shortest safe reproduction; do not make the reviewer replay already covered setup or functional steps.

Relevant dimensions include module boundaries and contracts, logical-entity realization, framework and datastore fit, migrations and compatibility, security mechanisms, build and packaging, reproducibility, observability, delivery flow, and engineering traceability. Review only dimensions declared by the Charter and supported by evidence.

Product value, business-rule correctness, content, navigation, and interaction design are not Prototype hypotheses in this workflow. A mismatch with their fixed authoritative inputs is an implementation or specification-alignment finding, not a product-validation result.

## Determine results

Assign every in-scope hypothesis or criterion one result:

- **supported:** required evidence supports the bounded claim and no contradiction defeats it;
- **rejected:** evidence contradicts the claim or exposes an unacceptable technical limitation;
- **inconclusive:** available evidence cannot decide it;
- **not run:** the agreed check or observation did not occur;
- **not applicable:** it was validly removed from this review scope with a reason.

Record direct evidence, environment, observation, limitation, residual risk, and required feedback. Supported means supported only under the declared Prototype conditions.

Classify findings as implementation, tests, plan, Technical Foundation, architecture, entity realization, technology, technical security, deployment, CI/CD, Prototype Charter, evidence, or workflow. Record severity and confidence when useful.

## Recommend without approving

Form one recommendation: `proceed`, `proceed with conditions`, `revise and re-review`, `reject the direction`, or `inconclusive`. Explain which hypotheses and risks drive it and which conclusions cannot be drawn.

Ask the user to confirm or correct recorded human observations and the review synthesis. If an accountable approver explicitly decides, record that decision separately; never infer approval from a passing gate or agreement with notes.

## Update the review record

Update the Prototype Charter's **Prototype review record**. Link evidence rather than copying logs. Preserve superseded entries needed for history, stable hypothesis identifiers whose meaning continues, limitations, residual risks, recommendation, approval state, and targeted handoffs.

Do not implement fixes during review. A separately authorized owner may make changes and return for targeted re-review.

## Validate and report

Check that every in-scope hypothesis has one result, human observations and agent analysis remain distinct, evidence matches source and environment, conclusions stay within the experiment, recommendation and approval are separate, handoffs are owned, links remain valid, and repository validation passed or was explicitly skipped.

Report the mode, reviewed source and environment, the automated checks and e2e scenarios the agent executed, results by hypothesis, principal human observations, findings by owner, limitations, residual risks, recommendation, approval state, and exact re-review conditions. Keep automated execution, agent analysis, and human observation visibly distinct. Never describe the result as proof of product correctness, complete security or compliance, release readiness, or production readiness.
