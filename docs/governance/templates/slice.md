# SL-NNN: Slice Name

- Status: draft
- Owner: Requirements, Architecture, and Implementation
- Last reviewed: YYYY-MM-DD

Use this template for one coherent vertical specification and implementation unit selected within a planned Story. Replace all instructional text and placeholders. Keep authoritative detail in its owning artifact; this Manifest composes the exact boundary, impact, readiness, and evidence links needed across the lifecycle.

## Identity and planning mandate

| Concern | Definition |
|---|---|
| Slice ID | `SL-NNN` |
| Iteration | Link the governing Sprint Backlog |
| Primary Story | `ST-NNN` and direct link |
| Additional Story mappings | Stable IDs plus explicit planning authority, or `None` |
| Parent Feature or Features | Direct `FT-NNN` links through the mapped Stories |
| Specification status | proposed, draft, ready for implementation planning, blocked, superseded, or retired |
| Implementation and review status | not planned, planned, in progress, implemented, accepted, rejected, or superseded |

Allocate Slice IDs monotonically in the governed Slice collection, preserve them across compatible refinement, and never reuse retired IDs. A Slice may cross Story boundaries only when an explicit planning decision authorizes it.

## Outcome and rationale

State the observable actor or operational result of this Slice and why this boundary is useful now. Explain how it advances the selected Story and which uncertainty, dependency, or delivery outcome it addresses.

## Slice boundary

### Trigger, preconditions, and observable end state

State where the Slice begins, the necessary business and system context, and the independently reviewable point at which it succeeds, fails safely, or hands off.

### Included behavior

Identify the exact normal, alternative, error, denied, cancellation, boundary, and recovery paths included. Link stable use-case steps, extensions, guarantees, rules, examples, and quality requirements rather than copying them.

### Excluded and remaining behavior

List adjacent behavior, integrations, actors, rules, qualities, environments, and lifecycle stages deliberately excluded. Distinguish:

- behavior remaining in the same Story for later Slices;
- behavior belonging to another planned Story or Feature;
- behavior outside accepted product scope.

Exclusion from this Slice is not product-scope exclusion by implication.

## Authoritative anchors

| Concern | Authoritative source and stable IDs | Slice-specific use | Source status |
|---|---|---|---|
| Outcome, actor, use case, rule, quality, UX, entity, module, control, technology, environment, or decision | Direct link | Exact relevance to this boundary | accepted, draft, assumed, proposed, or contradicted |

Every material claim must either have an authoritative source or be visibly classified as an assumption, proposal, or open question.

## Slice acceptance claims

| ID | Observable claim | Authoritative source | Required evidence | Review authority |
|---|---|---|---|---|
| `SL-NNN-AC-NNN` | Behavior, quality, control, delivery, or recovery result | Direct stable anchor | Automated check, inspection, demonstration, or accountable review | Role or workflow |

These claims index what must be evidenced for this Slice; they do not replace authoritative acceptance examples or test design.

## UX realization

| Destination, frame, state, or pattern | Included responsibility | Behavior trace | Accessibility, feedback, recovery, or review need |
|---|---|---|---|
| Direct UX identifier or link | Information, action, and state included in this Slice | Use-case step, extension, guarantee, or claim | Exact expectation or `Not applicable` |

Record the complete state set required by the boundary, including empty, loading, validation, denied, failure, recovery, and success states where applicable. Link the owning UX artifact.

## Domain and data impact

| Business object, entity, or value structure | Read, create, change, or reference | Lifecycle, invariant, ownership, consistency, or sensitivity implication | Authoritative source |
|---|---|---|---|
| Stable term or ID | Slice-specific use | Exact implication | Direct link |

State whether persistent data, fixtures, migration, retention, disposal, concurrency, or compatibility is relevant. Leave physical schema and migration implementation to planning unless an accepted contract or decision fixes them.

## Solution impact

### Modules, contracts, and consistency

| Module or boundary | Responsibility in this Slice | Provided or required contract | Dependency, consistency, failure, or prohibited-coupling constraint | Source |
|---|---|---|---|---|
| Stable module name or ID | Slice-specific ownership | Logical contract | Exact constraint | Direct link |

Do not turn modules automatically into packages, services, processes, schemas, or deployment units.

### Technology and integration constraints

| Concern | Accepted usage boundary | External or compatibility constraint | Ordinary implementation choice left open | Source |
|---|---|---|---|---|
| UI, backend, protocol, persistence, integration, build, test, or packaging concern | Required or prohibited use | Version, protocol, platform, or dependency condition | Choice for implementation planning | Direct link |

## Security and privacy impact

| Asset, identity, trust boundary, threat, or control | Slice-specific treatment | Positive, denied, abuse, or verification scenario | Residual risk or open decision | Source |
|---|---|---|---|---|
| Stable concern | Required behavior or constraint | Evidence expectation | Explicit limitation | Direct link |

Use synthetic data. Do not infer production readiness, compliance approval, or authorization rules from implementation convenience.

## Environment, delivery, and operations impact

| Concern | Slice requirement or constraint | Environment profile | Required evidence or operational handoff | Source |
|---|---|---|---|---|
| Configuration, dependency, data lifecycle, exposure, migration, delivery gate, observability, recovery, or support | Exact Slice-specific need | Direct environment link or `Not applicable` | Build, startup, deployment, inspection, recovery, or review evidence | Direct link |

Specify only environments needed to plan, implement, and review this Slice. Do not complete unrelated production architecture.

## Dependencies and sequence

| Dependency | Type | Required state | Evidence or owner | Effect if unavailable |
|---|---|---|---|---|
| Story, earlier Slice, decision, integration, environment, data, review, or external party | hard prerequisite or preferred order | Exact condition | Direct link or accountable role | block, re-slice, defer, simulate, or replan |

State the remaining scope and preferred next Slice inside the Story without reprioritizing the Sprint Backlog.

## Artifact impact map

| Authoritative artifact | Owning skill or workflow | Slice-specific review or change | Status | Evidence or blocker |
|---|---|---|---|---|
| Direct link | Skill name, workflow, or accountable owner | Exact concern | sufficient, updated, not applicable, or blocked | Link or resolution need |

Update the owning artifact before marking a material change resolved. Do not copy its full content into this Manifest.

## Decisions, assumptions, risks, and open questions

| Type | Statement | Affected boundary or claim | Owner | Resolution or expiry condition |
|---|---|---|---|---|
| Decision, assumption, risk, dependency, or open question | Material statement | Direct stable IDs | Accountable role or workflow | Evidence, event, or decision required |

Do not label a contradiction or material missing authority as an assumption merely to pass readiness.

## Implementation-planning handoff

### Fixed inputs and constraints

Summarize the fixed behavior, UX states, qualities, controls, module and entity ownership, contracts, consistency, technology and environment constraints, data-change expectations, evidence obligations, dependencies, and prohibited broadening. Link each authoritative source.

### Affected realization areas

Identify the logical application areas, modules, integrations, data concerns, tests, configuration, and delivery mechanisms likely to require planning. Do not invent file lists, endpoint shapes, tables, packages, algorithms, increments, or test code.

### Ordinary choices intentionally left to planning

List choices that `plan-implementation` may make within the fixed boundary, including realization sequence and replaceable internal design details.

## Readiness assessment

| Readiness concern | Status | Evidence or required resolution |
|---|---|---|
| Story mandate and boundary | ready, not ready, or not applicable | Link or blocker |
| Detailed behavior and acceptance examples |  |  |
| UX and accessibility |  |  |
| Domain and logical data |  |  |
| Modules, contracts, consistency, and integration |  |  |
| Technology and compatibility |  |  |
| Security and privacy |  |  |
| Environment, delivery, and operations |  |  |
| Evidence and review path |  |  |
| Dependencies and decisions |  |  |

Conclude with `Ready for implementation planning`, `Not ready`, or `Ready with explicitly accepted limitations`, the accountable reviewer and date, and any conditions that remain binding.

## Delivery evidence index

Complete after specification without changing the original planning authority by implication.

| Evidence | Location | Status or result | Deviation and feedback destination |
|---|---|---|---|
| Implementation plan, code, tests, migrations, configuration, build, delivery evidence, or demonstration | Direct link | planned, available, passed, failed, or superseded | Owning artifact or workflow |

## Slice review record

Complete through `review-slice` after the required evidence exists. Preserve earlier review history when a later change causes targeted re-review.

| Acceptance claim or completion condition | Review result | Direct evidence | Limitation or deviation | Required feedback or decision |
|---|---|---|---|---|
| `SL-NNN-AC-NNN` or named condition | accepted, rejected, inconclusive, not run, or not applicable | Direct link | What the evidence cannot establish | Continue, correct, re-specify, or replan |

Record the accountable Slice-review decision separately from automated check results and from the reviewer's recommendation. Feed specification and architecture findings back to their owning artifacts.

## Validation status

Record:

- Sprint Backlog and Story-mandate traceability;
- stable Slice, Story, Feature, requirement, and local claim identifiers;
- included, excluded, and remaining-Story distinctions;
- artifact-impact resolution and owning-skill handoffs;
- claim-to-source and claim-to-evidence coverage;
- readiness confirmation and ordinary implementation choices left open;
- repository validation, skipped checks, limitations, and residual risks.

## Sources and related artifacts

Link directly to the governing Sprint Backlog and Stories, Release Backlog parents, Product Vision, glossary, domains, actors, detailed use cases, Business Objects and rules, quality requirements, navigation, Wireframes, Design System, Software Architecture, Logical Entity Model, Technology, Security and Privacy Architecture, Deployment Architecture and environment specifications, test strategy and scenarios, CI/CD, operations, risks, decisions, agent workflows, artifact lifecycle, implementation guidance, and Definition of Done used by this Slice.
