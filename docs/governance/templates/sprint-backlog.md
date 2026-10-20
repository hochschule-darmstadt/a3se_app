# Sprint NNN Backlog

- Status: draft
- Owner: Management
- Last reviewed: YYYY-MM-DD

Use this template for the tracker-independent planning baseline of one iteration. Replace all instructional text and placeholders. Keep the accepted planning decision concise and link authoritative product and solution artifacts instead of copying them.

## Purpose and authority

State the iteration governed by this artifact and its authority over the goal, timebox, capacity basis, accepted load, selected Stories, sequencing, planning assumptions, risks, replanning, and completion record.

State explicitly that:

- Stories organize planned outcomes and do not define detailed product behavior, Slice boundaries, test design, or implementation intent;
- the team and accountable planning authority confirm scope and load;
- external trackers may mirror stable identifiers but are not authoritative for this planning decision.

## Iteration frame

| Planning concern | Decision |
|---|---|
| Iteration | `NNN` |
| Timebox | Start and end, or another accepted bounded planning period |
| Goal | One coherent outcome for the iteration |
| Capacity basis | Team availability, carry-in, reviewer access, known constraints, and evidence actually used |
| Relative sizing convention | Accepted local scale and what it compares; state that it is not duration |
| Accepted load | Team-confirmed number and mix of Stories, or another explicit load boundary |
| Confirmation | Accountable role, participating roles, date, and whether scope is proposed, confirmed, or replanned |
| Completion decision | Conditions for completing the iteration and treatment of unfinished work |

Do not infer capacity, velocity, duration, or an `S`/`M`/`L` mix. Record the team's actual decision and rationale.

## Selected Story summary

| Story | Parent Feature | Observable outcome | Relative size | Confidence | Hard dependencies | Work-item mapping |
|---|---|---|---|---|---|---|
| `ST-NNN` | `FT-NNN` | Actor or operational result | Accepted relative size | High, medium, or low with meaning defined below | Story, decision, evidence, or `None` | Link or `Not assigned` |

Use one row per selected Story. Preserve stable IDs across iteration and tracker changes.

## Selected Stories

### ST-NNN — Outcome-oriented name

- **Parent Feature:** `FT-NNN` — name
- **Primary anchors:** Direct links to the Release Backlog item and relevant authoritative behavior or constraint
- **Actor or operational outcome:** Observable result and beneficiary
- **Starting position:** Relevant prior evidence, prototype, implementation, unresolved work, or `No implementation baseline`
- **Planning boundary:** Planning-level inclusion and explicit adjacent exclusions; leave exact Slice composition to **Specify Slice**
- **Relative effort:** Team-confirmed size
- **Planning confidence:** Level plus evidence and important uncertainty
- **Dependencies and review needs:** Hard prerequisites, preferred ordering, decisions, specialist input, and accountable reviews
- **Work-item mapping:** Direct external reference or `Not assigned`
- **Outcome status:** `planned`, `accepted`, `removed`, `replaced`, or `unfinished`; complete during execution or replanning

Repeat for every selected Story. Do not embed detailed use-case scenarios, authoritative acceptance examples, Wireframes, APIs, schemas, tasks, or implementation plans.

## Sequencing and capacity decision

Explain:

1. the intended Story order and which work may proceed in parallel;
2. why the selected set jointly supports the iteration goal;
3. why the load fits the confirmed capacity basis;
4. which condition would invalidate the current size, sequence, or load;
5. whether Tasks and Bugs may be added without expanding Story scope.

Distinguish hard prerequisites from preferred sequencing. Record any accepted exception to the normal load boundary.

## Considered but unselected candidates

Include only candidates whose disposition matters for later planning.

| Candidate or stable ID | Reason considered | Disposition | Reason and evidence | Reconsideration trigger |
|---|---|---|---|---|
| Name or `ST-NNN` | Priority, dependency, carry-over, or alternative | deferred, rejected, replaced, or returned for refinement | Concise rationale | Evidence, capacity, or decision needed |

Absence from the selected set is not a product-scope decision unless the owning scope artifact says so.

## Iteration-level assumptions and risks

| Type | Statement | Affected goal or Story | Owner | Review or replanning trigger |
|---|---|---|---|---|
| Assumption, delivery risk, dependency, or decision need | Material statement | Direct stable IDs | Accountable role or workflow | Evidence, event, or deadline |

Do not hide weak specification, missing review capacity, or unresolved dependency inside planning confidence alone.

## Replanning record

Complete when accepted scope or its planning basis changes.

| Date | Trigger and evidence | Decision | Added, removed, replaced, or changed IDs | Goal, load, sequence, and dependency impact | Confirmed by |
|---|---|---|---|---|---|
| YYYY-MM-DD | Material change | Explicit decision | Stable IDs | Consequence | Accountable role and participating team roles |

Unfinished work does not carry over automatically. Preserve an existing Story ID only when its outcome remains materially the same.

## Review and completion expectations

- Each selected Story passes through **Specify Slice**, **Plan Implementation**, proportionate evidence creation, implementation, delivery verification, and **Review Slice**.
- Story acceptance is an accountable decision supported by current evidence; code or passed checks alone do not imply acceptance.
- Scope changes, skipped checks, deviations, and residual risks are explicit before iteration completion.
- Completing a Story does not by itself complete its parent Feature or Epic.

Add project-specific completion conditions without duplicating the Definition of Done.

## Iteration outcome

Complete at the end of the iteration.

| Story | Result | Slice and review evidence | Deviations and residual work | Effect on Release Backlog or later planning |
|---|---|---|---|---|
| `ST-NNN` | accepted, removed, replaced, or unfinished | Direct links | Explicit limitation or follow-up | Link or `None` |

Record the accountable iteration-completion decision and date.

## Validation status

Record:

- team confirmation of goal, capacity basis, relative sizes, accepted load, and selected scope;
- Release Backlog and Story-parent consistency;
- stable Story-ID and work-item mapping checks;
- dependency, sequence, risk, and review-capacity checks;
- repository validation, skipped checks, limitations, and residual uncertainty.

## Sources and related artifacts

Link directly to Project Management, Release Backlog, Scope Management, Risk Management, Stakeholder Management, selected requirement and solution anchors, prior iteration or prototype evidence, relevant decisions, agent workflows, artifact lifecycle, and Definition of Done.
