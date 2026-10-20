# Implementation Plan

- Status: draft
- Owner: Implementation
- Last reviewed: YYYY-MM-DD

Use this template for the implementation plan of one reviewed Prototype Charter or Slice Manifest. Keep one plan per scope identity and revise it in place with visible history; do not create a second competing plan for the same scope.

The plan translates fixed scope and accepted technical constraints into an executable sequence. It may decide ordinary implementation details, but it does not redefine requirements, UX, architecture, entities, technology, security policy, test strategy, CI/CD policy, or the governing scope artifact.

## Identity and planning state

| Concern | Definition |
|---|---|
| Scope | Direct link to one Prototype Charter or `SL-NNN` Slice Manifest |
| Plan status | draft, ready, in progress, blocked, completed, superseded, or retired |
| Planning mode | initial, continuation, correction, or alignment |
| Technical Foundation | Direct link and applicable baseline version or state |
| Planned repository state | Branch, revision, or other reproducible source identity |

## Fixed inputs and constraints

| Concern | Exact source and anchor | Fixed implication | Planning consequence |
|---|---|---|---|
| Behavior, UX, module, entity, technology, security, environment, evidence, or dependency | Direct stable link | Constraint that planning must preserve | Affected increment or decision |

List contradictions as blockers. Do not solve an authoritative gap by silently choosing a convenient implementation.

## Current-state assessment

Summarize only the repository structure, existing mechanisms, relevant code paths, prior plan state, and verified Technical Foundation facts needed for this scope. Distinguish observed facts from assumptions.

## Implementation decisions

| ID | Ordinary implementation choice | Rationale and alternatives | Fixed constraints preserved | Reconsideration trigger |
|---|---|---|---|---|
| `IP-DEC-NNN` | Replaceable internal realization choice | Concise reasoning | Direct anchors | Evidence or change that reopens it |

Escalate a choice to the owning artifact or a Decision Record when it changes an accepted boundary or has consequences beyond this scope.

## Execution increments

| ID | Intended outcome | Affected realization areas | Tests to create first | Code, migration, or configuration work | Verification and evidence | Dependencies |
|---|---|---|---|---|---|---|
| `IP-INC-NNN` | Small independently checkable result | Logical paths or components, refined to exact files only when verified | Unit and integration responsibilities | Bounded implementation work | Commands, observations, and evidence destination | Prior increment or external condition |

Order increments so that every step has an observable completion condition and leaves the repository in a diagnosable state. Do not use dates or effort estimates unless the user supplies an estimation basis and asks for them.

## Data, compatibility, and rollout

Describe applicable migrations, fixtures, compatibility boundaries, configuration changes, rollback or reset needs, and transition sequencing. Use `Not applicable` with a reason when none apply.

## Evidence and review mapping

| Scope claim, hypothesis, scenario, or completion criterion | Planned unit evidence | Planned integration evidence | CI/CD or manual evidence | Review destination |
|---|---|---|---|---|
| Stable identifier or named condition | Exact responsibility | Exact boundary | Accepted command, report, inspection, or demonstration | Prototype or Slice review record |

## Risks, blockers, and handoffs

| Type | Statement | Owner | Trigger or required resolution | Affected increment |
|---|---|---|---|---|
| Risk, blocker, assumption, dependency, or handoff | Precise condition | Owning workflow or role | Evidence or decision required | `IP-INC-NNN` |

## Plan review and revision history

| Date | Mode | Change or review result | Evidence and reviewer | Superseded content |
|---|---|---|---|---|
| YYYY-MM-DD | initial, continuation, correction, or alignment | Concise result | Direct link or accountable role | IDs or `None` |

Conclude whether the plan is ready for test-first execution through `create-tests` or directly within the selected `implement-prototype` alternative, why it is blocked, or which named increments are ready while others remain blocked. A ready plan is not approval of the implementation result.

## Validation status

Record scope traceability, plan-to-evidence coverage, Technical Foundation compatibility, fixed versus ordinary choices, dependency order, migration and reset safety, unresolved authority gaps, direct links, repository validation, skipped checks, and limitations.
