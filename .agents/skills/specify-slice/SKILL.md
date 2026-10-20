---
name: specify-slice
description: Collaboratively turn a selected Sprint Backlog Story into one or more coherent, implementation-ready vertical Slice Manifests by helping the user choose scope within the planning mandate, identifying and coordinating required refinements across authoritative artifacts, preserving traceability, and producing a reviewed handoff to plan-implementation. Use after iteration planning selects a Story; do not use it to prioritize backlog work, alter sprint scope without replanning, create implementation plans, tests, or code, or replace authoritative requirements and design artifacts.
---

# Specify Slice

Specify one coherent vertical Slice within the planning mandate of a selected Story. Help the user choose a useful boundary, determine which authoritative artifacts must be refined, coordinate those refinements through their owning skills, and create or update the Slice Manifest that makes the result ready for implementation planning.

The Sprint Backlog is the primary planning input. Evidence informs the Slice boundary and required detail; it does not independently select the next priority. The user's instructions take precedence. Authorization to specify a Slice does not authorize sprint reprioritization, implementation planning, code, tests, tracker writes, production changes, or unrelated artifact completion.

## Preserve artifact authority

- The Release Backlog owns coarse Epic and Feature planning.
- The Sprint Backlog and selected Story own the iteration mandate, intended outcome, parent Feature, planning boundary, size, dependencies, and priority.
- Detailed use-case specifications own actor-goal behavior, scenarios, extensions, guarantees, concerns, and acceptance examples.
- Domain, business-object, rule, quality, UX, entity, architecture, technology, security, deployment, test, delivery, and operations artifacts own their respective content.
- The Slice Manifest owns the exact composition and boundary of one coherent specification and implementation unit, its authoritative anchors, affected artifacts, readiness state, and implementation-planning handoff.
- The implementation plan owns technical realization choices, increments, sequencing, files, migrations, test implementation, and executable checks.
- Code, tests, migrations, configuration, and delivery evidence own the realized result. `review-slice` owns the review record and recommendation; accountable authority owns acceptance.
- Decision Records own consequential accepted choices; risk and management artifacts own their respective decisions.

The Slice Manifest links authoritative content and summarizes only the information needed to understand the boundary and handoff. Do not copy whole requirements, UX, architecture, or test specifications into it.

## Use Slice terms precisely

- **Planning mandate:** the selected Story's outcome and boundary as accepted in the Sprint Backlog.
- **Slice:** one coherent vertical specification and implementation unit that produces an independently reviewable part of that outcome.
- **Candidate boundary:** a proposed trigger-to-observable-result path, including necessary behavior, data, UX, solution, security, delivery, and evidence concerns.
- **Impact map:** the set of authoritative artifacts that must be reviewed and, where necessary, refined for this Slice.
- **Slice Manifest:** the stable, tracker-independent index of the agreed boundary, authoritative anchors, required refinements, readiness, and delivery evidence.
- **Specification readiness:** sufficient resolved product and solution intent for responsible implementation planning; it is not complete product specification or production readiness.
- **Implementation handoff:** the fixed inputs, constraints, affected areas, evidence expectations, and explicitly open ordinary implementation choices supplied to `plan-implementation`.

A Prototype Charter is a specialized Slice-0 technical-validation artifact. It additionally owns architecture and technology hypotheses, provisional treatments, and review semantics. A normal Slice Manifest must not copy those Prototype-only concerns unless the selected Story explicitly productizes or revisits them.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md`, `docs/README.md`, the iteration workflow, artifact lifecycle, definition of done, and relevant decisions.
2. Read the active Sprint Backlog, the selected Story, its parent Release Backlog items, and the canonical template at `docs/governance/templates/slice.md`.
3. Read existing Slice Manifests and the identifier registry before allocating or changing `SL-NNN`.
4. Follow the Story's direct anchors into the relevant Product Vision, glossary, domains, actors, use cases and detailed specifications, business objects, rules, quality requirements, UX, architecture, entities, technology, security, deployment, test, CI/CD, operations, risks, and decisions.
5. Read earlier Prototype, implementation, and technical-review evidence only where it affects the selected Story or proposed Slice.
6. Inspect current code and tests only as evidence of the existing realization. Do not let implementation silently override authoritative intent.

Record the lifecycle status and authority of material inputs. Draft inputs may support a draft Slice when uncertainty and its consequences remain explicit.

Maintain Slice Manifests at `docs/implementation/slices/SL-NNN-<slug>.md`. On first use, create `docs/implementation/slices/README.md` as the collection index and update it on later runs.

## Select the operating mode

- **Initial specification:** derive and prepare the first Slice for a selected Story.
- **Refinement:** deepen or correct the boundary and affected artifacts without changing the planning mandate.
- **Subsequent Slice:** select the next coherent part of the same Story after prior Slice evidence exists.
- **Prototype transition:** reconcile a reviewed Prototype Charter, implementation, technical review, and provisional treatments into a regular Slice under an explicitly selected Story.
- **Readiness assessment:** evaluate an existing Slice and report gaps without writing unless authorized.
- **Alignment repair:** restore traceability after an authorized change in an owning artifact.

Preserve Slice identity across compatible refinement. Do not use a new identifier merely because the title, file name, estimate, or implementation changes.

## Require a selected Story

Confirm that the active Sprint Backlog selects the Story and that its outcome, parent Feature, planning boundary, size, dependencies, and confirmation state are visible.

If no Story is selected, stop Slice selection and route the planning question to `create-sprint-backlog`. If the requested boundary exceeds or materially changes the Story, present the mismatch and route it to explicit sprint replanning. Do not choose the next priority from evidence alone.

## Help the user choose the Slice boundary

Within the selected Story, establish:

- the actor or operational outcome advanced by this Slice;
- trigger, required preconditions, and observable end state;
- included normal, alternative, error, denied, cancellation, boundary, and recovery behavior;
- necessary information, lifecycle changes, UX states, and external interactions;
- explicit exclusions and the remainder left in the Story;
- required qualities, controls, environment, delivery path, and evidence;
- dependencies, assumptions, and unresolved decisions.

When more than one boundary is credible, propose a small set of reasoned alternatives and recommend one. Prefer a Slice that is vertical, coherent, independently reviewable, small enough to implement responsibly, large enough to yield meaningful evidence, and useful for resolving current risk. The user confirms the boundary.

A Story may require several ordered Slices; one Slice may contribute to more than one Story only when the Sprint Backlog or an explicit replanning decision authorizes the cross-Story boundary. Record mappings without turning Story and Slice into a mandatory one-to-one hierarchy.

For a Prototype transition, compare the regular intent with the Charter, technical review, implementation, and evidence. Classify each provisional treatment as accepted through an owning artifact, replaced, retained temporarily with an explicit constraint, or excluded. Existing code is a starting point, not acceptance evidence by itself.

## Build the Slice impact map

For the confirmed boundary, assess only relevant concerns:

- domain language, actor identity, use-case scenarios, extensions, guarantees, rules, examples, and qualities;
- business objects, lifecycle states, logical entities, value structures, invariants, ownership, and data sensitivity;
- navigation, frames, information, actions, states, feedback, recovery, accessibility, and reusable patterns;
- module ownership, contracts, dependencies, consistency, concurrency, failure handling, and integration boundaries;
- technology usage boundaries, compatibility, data migration, build and test mechanisms;
- identity, authorization, trust boundaries, threats, controls, privacy, logging, and verification;
- deployment environment, configuration, dependencies, data lifecycle, exposure, delivery, observability, recovery, and operational constraints;
- test levels, evidence scenarios, CI/CD gates, review needs, risks, and decisions.

Classify each concern as already sufficient, requiring refinement, irrelevant to this Slice, or blocked by a decision. Do not demand system-wide completion. Record a direct link to the owning artifact and the exact Slice-specific gap.

## Reactivate owning skills selectively

Use the owning skill for every material refinement when an applicable repository skill exists, for example `specify-use-case`, `create-business-objects`, `create-wireframes`, `create-design-system`, `create-entities`, `create-software-architecture`, `create-technology`, `create-security-architecture`, or `create-deployment-architecture`.

Before applying an owning skill, read its complete `SKILL.md`, its canonical template, and only the references required by that skill. Tell the user when a skill causes an action or pause. Apply it to the selected Slice boundary and preserve its authority; do not reproduce its method inside the Slice Manifest.

If a needed skill does not yet exist, update the owning artifact only when the governing repository workflow and user authorization make that safe. Otherwise record a precise handoff and block readiness when the missing decision is material.

Update authoritative artifacts before marking their Slice impact resolved. Preserve stable identifiers and make consequential choices through their owning decision mechanism. Avoid opportunistic completion of unrelated areas.

## Assign and preserve Slice identifiers

Unless another accepted convention exists:

- allocate `SL-NNN` monotonically when a Slice first enters governed specification;
- never reuse a retired identifier;
- preserve the identifier across title, file, implementation, Story-allocation, and status changes when the coherent outcome remains the same;
- allocate new identifiers for materially different Slices created by a split or replacement and record the relationship;
- use local child identifiers such as `SL-NNN-AC-NNN` only where stable Slice-level claims are needed.

## Create or update the Slice Manifest

Use `docs/governance/templates/slice.md` while preserving any compatible established structure. Record:

1. Slice identity, iteration, Story and Feature mappings, and status;
2. intended outcome and rationale;
3. planning mandate, included behavior, exact boundary, and exclusions;
4. authoritative anchors and stable acceptance claims;
5. UX, domain, data, solution, security, environment, delivery, and evidence impact;
6. dependency and sequencing context;
7. artifact impact map with owning skill and resolution status;
8. decisions, assumptions, risks, and open questions;
9. implementation-planning handoff and readiness assessment;
10. later implementation and review evidence links without duplicating raw evidence.

Keep the Manifest concise. It composes authoritative information; it does not become a shadow specification. Leave a new or materially revised Manifest `draft` until the user or accountable reviewer confirms the boundary and readiness.

## Prepare the implementation-planning handoff

Summarize for `plan-implementation`:

- fixed Slice boundary and explicit exclusions;
- authoritative behavior, examples, UX states, qualities, and controls;
- owning and participating modules, logical entities, contracts, consistency and integration boundaries;
- technology and environment constraints;
- data-change and migration expectations at the accepted level of authority;
- evidence claims, test obligations, review path, and delivery gates;
- dependencies, risks, assumptions, prohibited broadening, and open ordinary implementation choices.

Use one shared implementation-plan artifact for the Slice, defaulting to `docs/implementation/slices/SL-NNN-<slug>-implementation-plan.md` and the canonical `docs/governance/templates/implementation-plan.md`. Do not create the plan inside this skill.

Do not invent file lists, endpoint shapes, database tables, package structures, algorithms, implementation increments, or test code unless an authoritative external contract or accepted decision already fixes them. Those are implementation-planning concerns.

## Determine readiness

A Slice is ready for implementation planning when:

- it remains within a team-selected Story or has an explicit replanning decision;
- trigger, observable outcome, included behavior, exclusions, and remaining Story scope are unambiguous;
- authoritative use-case behavior and acceptance examples are detailed enough for the Slice;
- required UX states and accessibility expectations are defined;
- domain, entity, module, contract, consistency, technology, security, environment, data, and operational implications are either resolved or explicitly not applicable;
- evidence claims and validation paths are traceable and feasible;
- dependencies and required decisions are available;
- the impact map has no material unresolved change that would alter behavior, data ownership, architecture, security, delivery feasibility, or scope;
- ordinary implementation choices remain available to planning rather than being prematurely prescribed;
- the user or accountable reviewer confirms the boundary and readiness.

Do not require complete specifications for unrelated use-case paths, environments, product areas, or future Slices. Do not declare readiness while a material contradiction is merely labeled as an assumption.

## Handle findings and replanning

- Route new product behavior to the requirements owner and, if it exceeds the Story, to sprint replanning.
- Route changes to scope, architecture, security, technology, deployment, or quality through their owning artifact and decision process.
- Record implementation discoveries as evidence; do not silently backfill them as requirements.
- When a Slice becomes too broad, propose a coherent split inside the same Story and preserve traceability.
- When the selected Story is no longer viable, stop and provide the exact evidence needed by `create-sprint-backlog` for replanning.

## Validate and report

Run the repository's relevant documentation, link, identifier, and harness checks. Review the diff for duplicated authority, unsupported scope, hidden design choices, missing stable IDs, and unrelated edits.

Report:

- selected Story and confirmed Slice boundary;
- Slice ID and Manifest path;
- authoritative artifacts reviewed, updated, or handed off through owning skills;
- remaining Story scope and dependencies;
- readiness result and material blockers or residual risks;
- implementation-planning inputs and ordinary choices intentionally left open;
- validation performed, skipped checks, and limitations.
