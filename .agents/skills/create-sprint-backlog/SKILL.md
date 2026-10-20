---
name: create-sprint-backlog
description: Collaboratively create, refine, replan, or assess a tracker-independent Sprint Backlog by combining Release Backlog priorities and delivery evidence with a team-confirmed iteration goal, timebox, capacity basis, accepted relative load, selected Stories, dependencies, sequencing, risks, and completion conditions. Use during iteration planning; do not use it to define authoritative requirements, specify Slices, plan implementation, infer velocity or duration from relative sizes, assign individuals, synchronize a tracker, or implement work.
---

# Create Sprint Backlog

Create or evolve one Sprint Backlog with the user and delivery team. Turn the current release outlook, product priorities, dependencies, evidence, and actual team conditions into an explicit iteration planning decision without turning the backlog into a competing requirements or Slice specification.

Treat the Sprint Backlog as a revisable commitment for one iteration. The user's instructions take precedence. Authorization to create it does not authorize requirement changes, detailed Slice specification, implementation planning, tracker writes, assignments, or delivery work.

## Preserve artifact authority

- Product, requirements, UX, architecture, security, technology, deployment, test, and operational artifacts own their respective facts and decisions.
- The Release Backlog owns coarse Epic and Feature planning, dependencies, and release or iteration outlook.
- The Sprint Backlog owns the iteration goal, timebox, capacity basis, team-accepted load, selected Stories, relative sizes, planning confidence, sequence, dependencies, planning assumptions, risks, and replanning or completion record.
- A Story is a negotiable planning item for an actor or operational outcome. Its planning boundary is not a detailed specification.
- A Slice Manifest owns the exact coherent behavior and solution boundary selected from a planned Story, the affected authoritative artifacts, specification readiness, and the handoff to implementation planning.
- An implementation plan owns the technical realization sequence. Tasks and Bugs organize supporting work and defects.
- Risk Management owns material risk treatment; Decision Records own accepted consequential choices and rejected alternatives.
- The team and accountable planning authority confirm the accepted iteration scope and load. The agent advises, challenges, and records; it does not manufacture a commitment.

Link to authoritative sources instead of copying their detail. Do not silently repair an owning artifact to make a Story appear ready.

## Remain independent of issue tracking

The Sprint Backlog must work with repository files, GitHub, GitLab, Jira, another tracker, or no tracker.

- Use stable repository identifiers such as `ST-NNN`.
- Record external work-item mappings only when they already exist or a separately authorized workflow supplies them.
- Do not query, create, update, delete, or synchronize tracker items as part of this skill.
- Do not treat tracker state as authority for product behavior, architecture, or sprint commitment.

## Use planning terms precisely

- **Iteration or sprint:** the bounded planning period governed by this backlog.
- **Iteration goal:** the coherent outcome the selected Stories collectively pursue.
- **Capacity basis:** the team conditions, availability, review access, known carry-in, and constraints used for the planning decision; it is not an invented velocity number.
- **Accepted load:** the team-confirmed amount and mix of relative work, for example a locally agreed mix of `S`, `M`, and `L` Stories. No particular mix is a universal default.
- **Story:** a stable, tracker-independent planning item with exactly one parent Feature and an observable outcome.
- **Planning boundary:** enough inclusion and exclusion information to estimate, sequence, and later specify the Story without defining the detailed Slice.
- **Relative size:** a team-owned comparison of delivery effort, uncertainty, review demand, and integration breadth in the current planning context; it is not a duration.
- **Planning confidence:** confidence in the Story's current boundary, dependencies, and size, not confidence that implementation will succeed.
- **Slice:** a coherent specification and implementation unit subsequently selected within the Story's planning mandate.
- **Replanning:** an explicit team decision that changes accepted scope, load, sequence, or assumptions. Unfinished work does not silently carry over.

## Load the authoritative context

Before substantive planning:

1. Read every applicable `AGENTS.md`, `docs/README.md`, the management reading path, iteration workflow, artifact lifecycle, definition of done, and relevant decisions.
2. Read the current Sprint Backlog when present and the canonical template at `docs/governance/templates/sprint-backlog.md`.
3. Read Project Management, Release Backlog, Scope Management, Risk Management, Stakeholder Management, and any explicit release or deadline decisions.
4. Read the Product Vision and the requirement, UX, architecture, security, technology, deployment, test, and operations anchors necessary to understand candidate outcomes and constraints.
5. Read prior iteration outcomes, Prototype review, implementation evidence, unresolved Bugs, and delivery evidence only where they affect feasibility, dependencies, confidence, or capacity.
6. Inspect the governed Story identifier registry and existing Story mappings before allocating or changing identifiers.

Record whether important inputs are accepted, draft, assumed, proposed, incomplete, or contradicted. Existing code and prototype evidence may reduce uncertainty but do not create sprint scope by implication.

In this repository, maintain Sprint Backlogs at `docs/management/sprint-NNN-backlog.md` and keep `docs/management/README.md` current.

## Select the operating mode

- **Initial planning:** establish the first backlog for the iteration.
- **Refinement:** improve boundaries, sizes, dependencies, confidence, sequence, or evidence without changing the accepted goal unnecessarily.
- **Replanning:** explicitly add, remove, replace, split, combine, or reorder accepted work because conditions changed.
- **Completion update:** record accepted, removed, replaced, or unfinished outcomes and the resulting planning evidence.
- **Alignment assessment:** compare an existing backlog with current evidence and report drift without writing unless authorized.

Preserve the iteration and Story identities on later runs. Do not interpret refinement as permission to expand scope.

## Establish the iteration frame with the team

Elicit or confirm:

- iteration identifier and timebox;
- one coherent iteration goal;
- team availability, specialist or reviewer availability, leave, carry-in, and other material constraints;
- capacity basis and any historical evidence the team actually wants to use;
- the relative sizing convention and the accepted load or load range;
- fixed dependencies, decision gates, or dates;
- accountable planning authority and how confirmation will be recorded;
- the completion and replanning rule.

Never infer velocity, team capacity, calendar duration, number of Stories, or an `S`/`M`/`L` mix from generic practice or a previous project. A prior iteration is evidence to discuss, not an automatic commitment. When information is uncertain, record the uncertainty and propose a conservative option for team confirmation.

## Build and challenge the candidate Story set

Derive candidates primarily from the current Release Backlog, its planning outlook, team priorities, explicit dependencies, and current delivery evidence. Requirements and solution artifacts test feasibility and coverage; they do not independently set the sprint priority.

For each candidate establish:

- exactly one parent Feature and the relevant Epic context;
- observable actor or operational outcome;
- primary authoritative anchors;
- planning-level inclusion and exclusion boundary;
- relative size and the team reasoning behind it;
- planning confidence and material uncertainty;
- prerequisites, ordering influences, review needs, and external dependencies;
- existing work-item mapping, when any.

Challenge candidates that are horizontal activities, architecture layers, disconnected task bundles, too broad to specify responsibly, too small to produce a reviewable outcome, unsupported by current scope, or dependent on unresolved decisions.

When a reviewed Prototype is an evolutionary implementation seed, propose a first regular Story that reconciles its provisional treatments, authoritative artifacts, and approval state. Do this only when the Release Backlog and team priority support that outcome. Preserve the distinction between technical Prototype review and normal Slice acceptance.

Do not create detailed use-case steps, authoritative acceptance examples, Wireframes, data designs, APIs, schemas, implementation tasks, or a Slice Manifest here. Record a specification dependency or lower confidence instead.

## Assign and preserve Story identifiers

Follow the repository's accepted Story policy. Unless another accepted convention exists:

- allocate `ST-NNN` monotonically when a Story enters governed planning;
- preserve the identifier across title, estimate, iteration, tracker, and repository-path changes;
- never reuse a retired identifier;
- retain the identifier when a Story moves to a later iteration without materially changing its outcome;
- allocate new identifiers for materially different outcomes created by a split or replacement and record the relationship.

## Size and fit the team-confirmed load

Facilitate relative sizing rather than generating an authoritative estimate. Make the evidence visible: existing implementation, specification maturity, novelty, dependencies, integration breadth, security or data sensitivity, test and review demand, and operational change.

Compare the candidate set with the team-confirmed capacity basis and accepted load. Surface overload, hidden work, sequencing conflicts, missing review capacity, and low-confidence items. Recommend removal, replacement, splitting, or a validation-first sequence when warranted, but let the team and accountable authority make the commitment.

Supporting Tasks and Bugs may be anticipated but do not authorize an additional product Story or expand the iteration goal. Do not convert T-shirt sizes into hours or dates unless an accepted local planning policy explicitly defines that mapping.

## Agree sequence, risks, and completion semantics

Distinguish hard prerequisites from preferred order. Prefer early resolution of material uncertainty and vertical outcomes over a sequence of technical layers. Record:

- why the selected Stories jointly support the iteration goal;
- planned order and parallel work, where relevant;
- material assumptions and risks with owners and review triggers;
- the condition that forces replanning;
- the rule for unfinished work;
- the evidence and accountable decision needed to accept a Story and complete the iteration.

## Work with the human in the loop

The agent synthesizes evidence, proposes candidates, checks coverage and dependencies, challenges load, and drafts the artifact. The team supplies or confirms capacity, relative sizing, accepted load, priority, and commitment. The accountable planning authority accepts material changes.

Before recording accepted scope, present a concise planning proposal containing:

- iteration goal, timebox, and capacity basis;
- proposed Stories with outcome, parent, anchors, size, confidence, and boundary;
- proposed load and how it compares with the team-accepted load;
- sequence, dependencies, risks, assumptions, and deferred candidates;
- unresolved decisions and recommended replanning triggers.

Obtain explicit user or team confirmation unless the user requested an immediate provisional draft. Label unconfirmed scope as proposed; do not present it as a commitment.

## Create or update the Sprint Backlog

Use `docs/governance/templates/sprint-backlog.md` while preserving any compatible established structure. Include:

1. repository-standard metadata and authority statement;
2. iteration frame and team-confirmed planning basis;
3. selected Story summary and one planning section per Story;
4. sequencing and capacity decision;
5. material assumptions, risks, and replanning triggers;
6. completion semantics and, on later runs, outcome record;
7. direct links to authoritative and related artifacts.

Keep a new or materially changed backlog `draft` until the accountable authority assigns another lifecycle status. Link rather than duplicate requirements or solution detail.

During replanning:

- preserve the original decision context and stable identifiers;
- record scope additions, removals, replacements, and changed assumptions;
- do not silently carry unfinished work into another iteration;
- update release outlook or management navigation only when needed to keep authorities consistent;
- hand requirement, architecture, security, risk, or scope changes to their owning workflow.

## Determine readiness

A Sprint Backlog is ready for use when:

- the goal, timebox, capacity basis, accepted load, and confirmation state are explicit;
- each selected Story has one parent Feature, an observable outcome, authoritative anchors, a planning boundary, relative size, confidence, and dependencies;
- the selected set fits the team-confirmed planning basis or explicitly records an accepted exception;
- sequence and hard dependencies are coherent;
- specification gaps lower confidence or create a handoff instead of being hidden;
- assumptions, risks, review needs, and replanning triggers are explicit;
- completion and unfinished-work semantics are clear;
- no detailed Slice, implementation plan, assignment, invented capacity, or tracker mutation is embedded.

## Validate and report

Run the repository's relevant documentation, link, identifier, and harness checks. Review the final diff for accidental requirements, unsupported commitments, duplicated authority, unstable IDs, and unrelated edits.

Report:

- artifact created or changed and operating mode;
- team-confirmed goal, load, and selected Story IDs, or the fact that they remain proposed;
- important sequence, dependencies, assumptions, risks, and specification handoffs;
- material replanning decisions and preserved identifiers;
- validation performed, skipped checks, and residual limitations;
- confirmation or decision still required.
