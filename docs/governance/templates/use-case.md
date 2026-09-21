# UC-NNN: Goal-oriented title

- Status: draft
- Owner: Requirements
- Level: user goal
- Scope: System under consideration
- Primary actor: `ACT-NNN` Actor name
- Supporting actors: `ACT-NNN` Actor name, or none
- Primary subdomain: `SD-NNN` Subdomain name
- Participating subdomains: `SD-NNN` Subdomain name, or none
- Related catalog entry: `UC-NNN`
- Elaboration purpose: Initial specification, refinement, correction, assessment, or named validation purpose
- Source/evidence: Direct links to authoritative artifacts and evidence
- Last reviewed: YYYY-MM-DD

## Goal and scope

State the primary actor's goal, the observable business result, where the use case begins and ends, and what closely related behavior is explicitly outside this goal. Link neighboring use cases rather than absorbing their behavior.

## Stakeholders and interests

| Stakeholder or actor | Interest that this use case must protect |
|---|---|
| `ACT-NNN` or accountable stakeholder | Business outcome, protection, or constraint |

## Preconditions

List only conditions that must already hold and that this use case does not establish. Do not use preconditions to hide actor or system behavior.

1. Preconditions, or state that none beyond authorized access and an available system are established.

## Trigger

State the business event or actor intent that starts the use case.

## Main success scenario

1. Primary actor expresses an intention or supplies business information.
2. The system performs an observable responsibility in domain language.
3. Continue until the success guarantee is achieved.

## Extensions

Tie every extension to a main-scenario step or an explicit condition. State whether it returns to a step, completes with a valid alternative result, transfers to another use case, or ends without the goal.

| Step or condition | Alternative, error, or failure handling | Outcome or resume point |
|---|---|---|
| 2a | Observable handling | Resume at step N, transfer to `UC-NNN`, or end |

## Success guarantee

State the business facts and protected interests that hold after successful completion.

## Minimal guarantee

State what remains protected or true after cancellation, rejection, interruption, or failure.

## Policies and information

- **Business objects:** Link relevant `BO-` entries and state how the use case uses or changes them.
- **Rules and decisions:** Link authoritative domain rules or decisions; do not duplicate them.
- **Information ownership and handoffs:** Identify the authoritative subdomain for material facts crossing a boundary.
- **Neighboring use cases:** Link preceding, following, alternative, or recovery goals without using `include` or `extend` unless their precise UML semantics are intended.

## Applicable cross-cutting requirements and constraints

Reference applicable `FR-`, `NFR-`, `CON-`, and `SE-` identifiers. Do not repeat their normative statements.

## Use-case-specific quality and compliance considerations

Record only concerns unique to this actor goal. Promote behavior or measurable outcomes applying across multiple use cases to the appropriate `FR-` or `NFR-` catalog and replace repeated text with references.

## Acceptance examples

| ID | Scenario or extension | Given | When | Then | Status |
|---|---|---|---|---|---|
| AE-UC-NNN-01 | Normal, alternative, error, correction, or boundary behavior | Relevant initial facts | Actor intent or business event | Observable outcome and protected guarantee | draft |

## Assumptions and open questions

| Type | Statement | Affected steps or guarantees | Owner | Resolution condition |
|---|---|---|---|---|
| Assumption or open question | Unconfirmed behavior or policy | Step, extension, or guarantee | Accountable role | Evidence, decision, or event needed to resolve it |

## Cross-artifact handoffs

| Target artifact or workflow | Required clarification or change | Evidence | Status |
|---|---|---|---|
| Catalog, glossary, actors, domains, business objects, rules, cross-cutting requirements, UX, architecture, test, or delivery | Precise handoff without silently changing the owning artifact | Source or scenario finding | open |

## Sources and related artifacts

Link the use-case catalog, Product Vision, glossary, actors, domains, business objects, rules, constraints, scope exclusions, cross-cutting requirements, source evidence, decisions, and neighboring use cases required to validate this specification.
