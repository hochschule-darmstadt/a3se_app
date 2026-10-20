# Test Strategy

- Status: draft
- Owner: Test
- Last reviewed: YYYY-MM-DD

Use this template to define the test and evidence baseline justified by the current lifecycle stage. Replace instructional text and placeholders with project-specific, evidence-supported content. Keep the strategy concise, link authoritative behavior and controls instead of copying them, and defer unsupported production or later-environment assurance explicitly.

Assign stable `TST-NNN` identifiers only to normative test policies. Preserve an identifier while its meaning continues; retire rather than reuse it. Do not assign policy IDs to assumptions, observations, tool commands, placeholders, or open questions.

## Purpose and authority

State the lifecycle stage, product or subsystem boundary, review or delivery purpose, and decisions governed by this strategy.

Clarify that authoritative behavior and measurable outcomes remain in Requirements, UX, Architecture, Security, Deployment, Prototype, Slice, or other owning specifications. State that:

- this strategy owns cross-cutting objectives, policies, test-level responsibilities, data and environment use, evidence semantics, human review, and readiness gates;
- Technology owns selected test mechanisms;
- CI/CD owns repeatable execution of the verification contract;
- detailed test designs, executable tests, and generated results are evidence rather than requirements;
- accountable evaluation and acceptance remain outside automated test execution.

## Current scope

List the behavior, quality concerns, architecture boundaries, environments, delivery stages, and review decisions covered now.

List material concerns deliberately excluded or deferred because their requirements, environments, risks, mechanisms, or operating conditions are not yet established. Explain the evidence limitation and activation condition. An exclusion from the current strategy does not declare the corresponding product quality unnecessary.

## Test objectives

| Objective | Evidence required now | Current limitation or deferred assurance |
|---|---|---|
| Requirement, quality, architecture, security, data-integrity, interaction, migration, environment, delivery, or operational objective | Observable automated, measured, inspected, or reviewed evidence | What the current evidence cannot establish and when more is needed |

Include only objectives justified by authoritative claims, explicit risks, consequential unknowns, or the current delivery stage. Do not invent numeric targets, platform matrices, compliance obligations, or production conditions.

## Test policy

| ID | Current rule |
|---|---|
| `TST-NNN` | The responsible subject `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, or `MAY` produce a verifiable testing or evidence outcome under a stated condition. |

Cover applicable traceability, oracle independence, scenario categories, data, isolation, environment use, test-level responsibility, human review, failure, exception, and evidence rules. Keep generic testing guidance in the owning skill rather than reproducing it here.

## Test levels and current mechanisms

| Test level or review | Current responsibility | Current mechanism | Required use |
|---|---|---|---|
| Specification validation, static analysis, unit, component, contract, integration, migration, architecture, security, system, browser, quality measurement, operational exercise, exploratory review, UX review, accessibility review, or accountable evaluation | Claims and risks owned at this level | Link the accepted mechanism or identify the current gap | Change, boundary, stage, or readiness condition that requires it |

Select levels by claim and risk rather than by a universal pyramid. Prefer the narrowest reliable level and add broader checks only for material boundaries or failure modes. Distinguish target responsibility from currently implemented capability, and record limitations in the objectives or open-decisions sections rather than hiding them.

## Traceability and evidence

Describe the smallest project-specific chain from authoritative claims or risks to bounded evidence claims, tests or reviews, results, and accountable decisions. Use stable identifiers and direct links.

```text
authoritative claim or explicit risk
    → bounded evidence claim
    → automated check, observation, measurement, or human review
    → result, limitation, and accountable decision
```

State what an evidence record must identify, such as source state, execution context, relevant configuration, method or command, result, skipped or unavailable checks, material failure, and residual limitation. Define retention only where an explicit policy requires it; do not retain generated output merely to demonstrate activity.

## Test data and environment use

| Context | Permitted state and use | Evidence boundary |
|---|---|---|
| Development state, verification context, execution sandbox, review environment, shared environment, or another authorized context | Permitted and prohibited data, credentials, ownership, isolation, initialization, concurrency, migration, reset, cleanup, and disposal | Claims this context can and cannot support |

Link Deployment and Security Architecture for environment and data authority. Do not authorize production data, environment access, copies, promotion, or persistent state without an accepted basis.

## Current-stage readiness and review gate

State the exact prototype, Slice, release candidate, environment, or other review transition governed by this gate.

Define:

- required evidence claims and applicable test or review levels;
- treatment of normal, alternative, error, denied, cancellation, boundary, and recovery behavior;
- required human review;
- blocking failures and missing evidence;
- accountable exception content and authority;
- skipped-check and residual-risk reporting;
- what passing the gate establishes and explicitly does not establish.

Passing a gate must not be described as product acceptance, security or compliance approval, release authorization, or production readiness unless the owning accountable decision expressly establishes that conclusion.

## Next-stage handoff

Describe how later prototypes, Slices, releases, or environments reuse, refine, replace, or extend the current strategy. State how existing tests and evidence are classified when their claims, sources, environments, or validity change.

Hand required executable outcomes to CI/CD and detailed evidence claims to the relevant Prototype Charter, Slice Manifest, requirement, or test-design work. Do not specify implementation plans or pipeline command sequences here.

## Open decisions and limitations

| Question or limitation | Resolution condition |
|---|---|
| Material missing requirement, risk decision, mechanism, environment, evidence rule, or review authority; identify the accountable owner in the statement or linked handoff | Evidence, decision, implementation, or lifecycle event required |

## Sources and related artifacts

Link directly to the requirements and acceptance examples, quality scenarios, UX artifacts, Software Architecture, Logical Entity Model, Technology, Security and Privacy Architecture, Deployment Architecture and environment specifications, Prototype Charters, Slice Manifests, implementation guidance, CI/CD baseline, test designs and evidence, risks, decisions, lifecycle workflow, and definition of done used by this strategy.
