---
name: evaluate-prototype
description: Prepare and facilitate an evidence-led human evaluation of a completed prototype or proof of concept, assess each declared hypothesis and completion criterion with the user, distinguish implementation defects from specification or architectural findings, and record conclusions, limitations, recommendation, and targeted handoffs. Use after implementation evidence exists; do not use it to specify or implement the prototype, make the accountable approval decision, or infer production readiness.
---

# Evaluate Prototype

Help the user evaluate one completed prototype or proof of concept against its declared hypotheses, scenarios, completion criteria, and authoritative context. Prepare a reproducible review, present objective evidence, guide focused human observation and judgment, classify findings by their true owner, and record a recommendation without substituting agent judgment for accountable approval.

The user's instructions take precedence. Authorization to evaluate permits read-only inspection, execution of agreed checks, local demonstration, evidence capture, and updates to the prototype's evaluation record and handoffs. It does not authorize implementation fixes, broader requirements or architecture changes, production access, external deployment, approval, or claims of production readiness.

## Preserve artifact authority

- The prototype charter owns hypotheses, evidence scenarios, completion and abort criteria, prototype limitations, the evaluation record, and the evaluation recommendation.
- Source code, migrations, configuration, test suites, build reports, and delivery logs own the executable result and raw evidence.
- Requirements, UX, Software Architecture, the Logical Entity Model, Technology, and Security Architecture retain authority over the concerns they define.
- Evaluation may identify a defect or rejected assumption but does not silently correct its owning artifact.
- The agent prepares evidence, analysis, questions, classifications, and a recommendation. The human contributes direct observation, value and usability judgment, risk acceptance, and resolution of material trade-offs.
- The accountable authority records approval separately. Neither a passing pipeline nor the evaluator's recommendation confers approval.

Do not claim that the human observed, understood, accepted, or approved something unless that feedback was actually provided.

## Load the authoritative context

Before drawing conclusions:

1. Read every applicable `AGENTS.md`, the repository context map, lifecycle workflow, review and continuous-alignment guidance, and definition of done.
2. Read the complete current prototype charter, including its purpose, lifecycle intent, selected slice, hypotheses, scope, provisional treatments, security profile, evidence scenarios, completion and abort criteria, planned evidence, open questions, and prior evaluation entries.
3. Read the linked detailed use case, acceptance examples, business rules, glossary, actor definitions, UX artifacts, constraints, exclusions, and decisions.
4. Read the relevant Software Architecture, Logical Entity Model, Technology, Security and Privacy Architecture, test strategy, CI/CD and execution guidance, implementation findings, and operational constraints.
5. Inspect the executable result, version or commit under review, migrations, tests, configuration, reports, raw logs, known deviations, and current local execution state.
6. Distinguish direct evidence, human observation, agent analysis, assumptions, and prior conclusions. Treat stale or mismatched evidence as unavailable until its applicability is established.

Preserve the established artifact location and compatible structure. In this repository, record the evaluation in the current `docs/implementation/prototype.md` unless the user establishes another authoritative location.

## Select the operating mode

- **Initial evaluation:** assess the completed slice and every declared hypothesis for the first time.
- **Re-evaluation:** assess changed implementation or new evidence while preserving the history and status of superseded evidence.
- **Targeted evaluation:** revisit named hypotheses, scenarios, risks, or prior inconclusive results without implying that unaffected concerns were rerun.
- **Evaluation-readiness assessment:** identify missing or invalid evidence and route it back to implementation or specification without recording conclusions prematurely.

State the prototype, implementation version, environment, mode, hypotheses, and criteria in scope. Do not reuse a previous conclusion automatically after relevant code, configuration, data, specification, or environment has changed.

## Establish evaluation readiness

Verify that:

- the executable result corresponds to the current reviewed charter and identifiable repository state;
- the declared local or review environment can be reproduced safely;
- required scenarios have raw evidence or a concrete manual review path;
- known deviations, prototype-only treatments, skipped checks, and residual risks are visible;
- material completion criteria have been checked rather than inferred;
- no abort criterion or safety issue makes demonstration inappropriate;
- the human can observe the interaction or receive reproducible steps, direct links, and suitable evidence for judgments that require human review.

If implementation or raw evidence is materially incomplete, route the exact gap to `implement-prototype`. If the hypothesis, expected outcome, slice, or criterion is defective or untestable, route it to `specify-prototype` or the artifact that owns the underlying concern. Do not manufacture a result from missing evidence.

Evaluation may continue with a known gap only when recording an `inconclusive`, `not run`, or narrowly scoped result is itself useful and not misleading.

## Prepare the human review

Create a compact review sequence ordered around the actor's goal rather than repository structure. For each relevant hypothesis or criterion prepare:

- the question being decided and why it matters;
- the authoritative expectation and prototype limitation;
- the scenario, preconditions, synthetic data, stimulus, and safe execution path;
- the expected observable result;
- the automated or inspection evidence already available;
- the observation or judgment required from the user;
- known deviations, evidence limits, and residual risk.

Prefer direct demonstrations, browser-accessible flows, concise commands, report links, and inspectable database state over a narrative claim. Start or exercise local components only within existing authority and without changing the implementation under evaluation. When the current medium cannot show the result directly, provide a reproducible review path and do not infer the user's conclusion.

## Facilitate evaluation with the user

Lead the user through the smallest set of representative scenarios that collectively covers the declared evidence. For each step:

1. State the hypothesis or criterion and the expected observable outcome.
2. Present the relevant automated evidence and its limitations.
3. Demonstrate or provide the exact safe interaction the user should perform.
4. Ask a focused question about what requires human judgment.
5. Capture the user's observation, concern, or decision separately from agent inference.
6. Surface contradictions immediately and determine whether another scenario or owning artifact must be revisited.

Use human review particularly for:

- whether the slice solves the intended actor problem and preserves business meaning;
- whether navigation, information, feedback, recovery, accessibility, and overall interaction are understandable;
- whether prototype limitations are acceptable for the decision being made;
- whether architecture, technology, security, and delivery trade-offs support the intended direction;
- whether the lifecycle method produced understandable traceability and reviewable evidence.

Do not burden the user with judgments that objective automated evidence can settle. Conversely, do not convert test success into a value, usability, risk-acceptance, or approval decision.

## Assess all declared dimensions

Evaluate only dimensions supported by the charter and evidence, but check that none of the following was silently omitted when relevant:

- **Behavior and requirements:** actor outcome, rules, guarantees, alternatives, errors, denied actions, boundaries, and recovery.
- **UX and accessibility:** information, actions, state transitions, feedback, recovery, clarity, keyboard or assistive behavior, and visible prototype limitations.
- **Software Architecture:** module responsibility, dependency direction, contracts, consistency, failure behavior, and distribution assumptions exercised by the slice.
- **Entities and data:** logical meaning, ownership, integrity, minimum physical realization, migrations, and data evolution.
- **Technology and delivery:** framework and datastore fit, build, startup, compatibility, reproducibility, CI/CD, observability, and local review path.
- **Security and privacy:** assets, trust boundaries, identity, authorization, validation, safe errors, secrets, logs, exposure, synthetic data, and residual threats.
- **Method and traceability:** ability to follow the slice from requirements and UX through architecture, tests, code, execution, evidence, and feedback.

Do not generalize from the prototype environment to production qualities such as scale, availability, resilience, compliance, or security unless the declared hypothesis measured them under representative conditions.

## Determine results and classify findings

Assign every hypothesis or completion criterion exactly one current result:

- **supported:** the required evidence exists and no observed contradiction defeats the bounded claim;
- **rejected:** evidence contradicts the claim or reveals an unacceptable limitation;
- **inconclusive:** available evidence cannot decide the claim;
- **not run:** the agreed check or human review was not performed;
- **not applicable:** the criterion was validly removed from this evaluation scope with an explicit reason.

For each result record direct evidence, the implementation and environment evaluated, the user's relevant observation, limitations, residual risk, and the decision or feedback required. Use cautious language: supported means supported within the prototype's declared conditions, not proven universally.

Classify every material finding by its owning concern:

- implementation defect;
- missing or contradictory requirement, use case, rule, or acceptance example;
- UX or accessibility issue;
- module, contract, consistency, or distribution issue;
- logical-entity meaning, relationship, integrity, or ownership issue;
- technology, compatibility, persistence, migration, or delivery issue;
- security or privacy issue;
- test or evidence gap;
- prototype-scope, treatment, hypothesis, or criterion defect;
- workflow, traceability, template, skill, or other method problem.

Record severity and confidence when they help prioritize or expose uncertainty. Do not hide a rejected hypothesis by relabeling it as an implementation defect, and do not treat every implementation defect as evidence that the architecture or method failed.

## Form a recommendation, not an approval

Synthesize one evidence-based recommendation:

- **proceed:** the bounded evidence supports continuing with the current direction and recorded limitations;
- **proceed with conditions:** continuation is reasonable after named conditions or handoffs are owned;
- **revise and re-evaluate:** correct the implementation, charter, or owning specification and repeat affected evaluation;
- **reject the direction:** evidence warrants abandoning or materially changing the tested approach;
- **inconclusive:** the decision requires additional or more representative evidence.

Explain which hypotheses and risks drive the recommendation and which conclusions cannot be drawn. Ask the user to confirm or correct the recorded human observations and evaluation synthesis. If the user is also the accountable approver and explicitly decides approval, record that as a separate decision according to repository governance; never infer it from agreement with the evaluation notes.

## Update the evaluation record and handoffs

After review:

1. Update the prototype charter's evaluation record for every in-scope hypothesis and completion criterion.
2. Link direct evidence; do not copy source code, generated reports, or long logs into the charter.
3. Record known limitations, residual risks, skipped checks, user observations, and the evaluator's recommendation.
4. Record the accountable approval state separately and only from explicit authority.
5. Create targeted cross-artifact handoffs that name the owning artifact or workflow, affected identifier or scenario, required clarification or change, trigger, and completion evidence.
6. Preserve prior evidence needed for auditability. Mark stale or replaced evidence as superseded rather than silently rewriting history.
7. Keep unaffected stable hypothesis and scenario identifiers. Reactivate `specify-prototype` when their meaning or testability must change.

Do not implement fixes during evaluation or silently edit requirements, UX, architecture, entities, technology, security, or delivery definitions. A separately authorized follow-up may invoke the owning skill or `implement-prototype` and then return for targeted re-evaluation.

## Validate and report

Check:

- every in-scope hypothesis and criterion has an explicit result and evidence status;
- human observations and agent analysis are distinguishable;
- conclusions do not exceed the environment, data, scenarios, or qualities actually tested;
- rejected and inconclusive results have precise owners and next evidence needs;
- recommendation and approval remain separate;
- cross-artifact links, stable identifiers, lifecycle status, and repository structure remain valid;
- applicable repository validation and definition-of-done checks passed, with skipped checks explicit.

Report the implementation version and environment evaluated, scenarios demonstrated, results by hypothesis, principal human feedback, defects and other findings by owner, evidence limitations, residual risks, recommendation, approval state, required handoffs, and the conditions for any re-evaluation. Never describe a supported prototype as a complete, accepted, secure, compliant, production-ready, or release-ready product unless separate authoritative evidence and approval establish those claims.
