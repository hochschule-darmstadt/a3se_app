---
name: review-slice
description: Prepare and facilitate an evidence-led human review of one implemented Slice against its acceptance claims, fixed authoritative inputs, implementation plan, and completion conditions, then record the result and targeted handoffs. Use after current implementation and delivery evidence exist; do not specify, plan, test, or implement the Slice, fix defects, redefine requirements or architecture, make an approval without accountable authority, or infer release or production readiness.
---

# Review Slice

Review one implemented Slice as an independently evaluable delivery unit. Determine whether current evidence supports its acceptance claims and completion conditions, distinguish objective checks from human judgment, and record a bounded outcome without broadening the Slice.

The agent prepares the review and recommendation. Human reviewers supply observations and accountable roles make approval decisions.

## Preserve authority

- The Slice Manifest owns the boundary, acceptance claims, readiness conditions, evidence index, and Slice review record.
- Requirements, use cases, UX, architecture, entities, technology, security, deployment, test strategy, and CI/CD own the expectations they define.
- The Implementation Plan owns execution intent. Source, tests, reports, artifacts, and delivery logs own raw evidence.
- Review records conclusions and handoffs; it does not silently fix or redefine another artifact.

Do not infer user observation, acceptance, or approval.

## Load the review context

Read repository instructions, workflow, Definition of Done, the complete current Slice Manifest, current Implementation Plan when one exists, linked current evidence, and only the authoritative anchors needed for in-scope claims. Establish the exact source identity, environment, data constraints, and prior review history. If a legacy Slice predates the separate plan artifact, record that limitation instead of inventing a historical plan.

On repeated invocation, identify what changed and which prior conclusions became stale. Preserve unaffected valid results and history.

## Select the operating mode

- **Initial review:** assess every Slice acceptance claim and completion condition.
- **Re-review:** reassess affected claims after implementation or evidence changed.
- **Targeted review:** revisit named claims, findings, or conditions only.
- **Readiness assessment:** expose missing or invalid evidence without recording premature acceptance.

State the Slice, source identity, environment, mode, claims, and exclusions.

## Establish readiness

Verify that implementation and evidence correspond to the current Manifest and Plan; required unit, integration, delivery, inspection, demonstration, and human-review evidence is present or explicitly unavailable; deviations and residual risks are visible; and the review can be reproduced safely.

Route missing tests to `create-tests`, code defects to `create-code`, execution evidence to `operate-ci-cd`, plan defects to `plan-implementation`, and scope or authoritative gaps to `specify-slice` or the owning artifact. Never turn missing evidence into a pass.

## Conduct the review

For each claim or completion condition:

1. state the authoritative expectation and Slice boundary;
2. identify preconditions, source state, environment, synthetic data, and observable result;
3. present current automated or inspection evidence and its limits;
4. demonstrate or provide the smallest safe interaction for human judgment;
5. record human observation separately from agent analysis;
6. classify any mismatch by its true owner.

Cover behavior, UX and accessibility, data and entity integrity, module contracts, security and privacy controls, integrations, migrations, configuration, delivery, recovery, and operational evidence only where the Manifest makes them part of the Slice.

## Determine results

Assign each in-scope claim or condition one result: `accepted`, `rejected`, `inconclusive`, `not run`, or `not applicable`. Record direct evidence, environment, observations, deviations, limitations, residual risk, and required feedback.

Classify findings as implementation, tests, plan, specification, UX, architecture, entities, technology, security, deployment, CI/CD, evidence, or workflow. Do not hide a specification defect as a code defect or generalize one Slice result to the full product.

## Recommend and record the decision

Recommend `accept`, `accept with conditions`, `correct and re-review`, `re-specify or replan`, `reject`, or `inconclusive`. Keep this recommendation separate from accountable approval. Record approval only when an authorized person states it explicitly.

Update the Slice Manifest's **Slice review record**, link raw evidence, preserve superseded history, record residual risks and conditions, and create targeted handoffs with owners and completion evidence. Do not modify implementation during review.

## Validate and report

Verify complete claim coverage for the chosen mode, current evidence identity, distinct human and agent observations, bounded conclusions, owned handoffs, valid links and stable identifiers, and repository validation.

Report the mode, reviewed source and environment, claim results, human observations, findings by owner, evidence limitations, recommendation, approval state, conditions, and exact re-review scope. Never infer release or production readiness from Slice acceptance.
