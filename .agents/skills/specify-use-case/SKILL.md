---
name: specify-use-case
description: Collaboratively create, refine, correct, or assess one detailed Cockburn-style specification for an existing cataloged actor-goal use case, including scenarios, extensions, guarantees, concerns, and acceptance examples. Use after the use-case catalog establishes the UC identity, actors, and primary subdomain; do not use it to discover the overall catalog, create backlog stories or slices, design UI or architecture, or implement behavior.
---

# Specify Use Case

Develop one evidence-aware, user-goal-level use-case specification with the user. Treat the specification as a falsifiable behavioral model that later evidence, slices, tests, or implementation findings may refine or correct. Interview rigorously, propose plausible behavior, challenge ambiguity, and integrate the user's business, operational, requirements, UX, architecture, and legacy-system expertise without silently promoting either party's assumptions to accepted intent.

The user's instructions take precedence over this skill. Authorization to specify one use case does not authorize changes to the use-case catalog, actors, domain boundaries, business objects, domain rules, cross-cutting requirements, UX, architecture, backlog, tests, or implementation except for explicitly authorized meaning-preserving consistency repairs.

## Preserve semantic ownership

- The use-case catalog owns the stable `UC-` identity, actor goal, primary actor, supporting actors, primary subdomain, participating subdomains, lifecycle state, and portfolio-level coverage.
- This individual specification owns the goal boundary, stakeholders and interests, preconditions, trigger, main success scenario, extensions, success and minimal guarantees, use-case-specific concerns, and acceptance examples for that actor goal.
- The actor catalog owns actor identities and boundaries.
- The Domain Landscape owns subdomain responsibilities and strategic classification.
- The glossary owns domain meanings. Business-object and domain-rule artifacts own conceptual lifecycles, relationships, policies, and invariants.
- Functional and non-functional requirement catalogs own normative behavior or measurable outcomes applying across multiple use cases. Reference their IDs instead of copying their statements.
- Backlog features, stories, and slice specifications own negotiable delivery decomposition. A use case describes the complete actor goal and must not be reduced to the first implementation slice.
- UX owns navigation and interaction design. Architecture and implementation own technical structure and mechanisms.
- Source evidence supports analysis but is not accepted behavior by itself.

When scenario discovery exposes a material defect in an owning artifact, record a precise handoff. Do not distort the detailed specification to preserve a defective catalog entry or silently change another authority.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md` and the repository context map.
2. Read the target entry in the authoritative use-case catalog and any existing individual specification.
3. Read the canonical individual-use-case template, Product Vision, glossary, actor catalog, Domain Landscape, relevant business objects and domain rules, constraints, scope exclusions, cross-cutting requirements, source evidence, applicable decisions, requirements workflow, artifact lifecycle, requirements-language guidance, and definition of done.
4. Read related use cases closely enough to distinguish shared behavior, preceding or subsequent goals, and boundary handoffs.
5. Load UX, architecture, test, operations, or delivery context only when it supplies evidence or materially constrains this use case. Never derive required behavior merely from an existing screen, schema, API, service, or implementation.

The target normally must already have a stable `UC-` entry. If the actor goal, primary actor, or primary subdomain is absent or materially incoherent, hand the issue to `create-use-cases` rather than inventing a parallel identity. Use `docs/governance/templates/use-case.md` as the canonical structure for the individual specification.

## Select the operating mode

- **Initial specification:** develop the first reviewable Cockburn-style detail for one cataloged use case.
- **Refinement or correction:** reopen affected scenarios, extensions, guarantees, interests, policies, information, concerns, examples, or open questions while preserving unaffected content and the stable ID.
- **Alignment assessment:** compare an existing specification with its catalog entry and authoritative context without writing unless the user also authorizes changes.
- **Early draft:** when explicitly requested, write a provisional snapshot once its boundary and known uncertainty are clear enough not to mislead. Keep it `draft` and expose gaps rather than inventing answers.

On repeated invocation, treat the current specification as a baseline, not unquestionable truth. Start from the requested or evidence-driven delta, preserve stable meaning and accepted decisions, and avoid stylistic churn.

## Establish the use-case boundary

Confirm or challenge:

- the primary actor's single goal and observable business result;
- the system under consideration and user-goal level;
- the starting trigger and the point at which the goal succeeds, fails, or is abandoned;
- the primary subdomain that owns the result and any participating subdomains;
- neighboring use cases that precede, follow, include related work, or own materially different goals;
- explicit exclusions, especially maintenance, administration, UI gestures, batch operations, technical integrations, and delivery slices that do not belong to this goal.

Do not treat a screen, CRUD operation, form, entity, document, API call, system component, or backlog item as the use case. Split only when one specification actually contains independent actor goals or incompatible central outcomes. Hand a required split, merge, rename, actor correction, or subdomain remapping to `create-use-cases` before establishing contradictory detail.

## Interview as a rigorous collaborative analyst

Tell the user which use case and operating mode are being analyzed. Ask the highest-value unresolved question next, normally one focused question per turn. Do not follow a fixed questionnaire when previous answers or evidence make another question more valuable.

Establish, as applicable:

- stakeholders and the interests the use case must protect;
- preconditions that must already hold but that this use case does not establish;
- the business event or actor intent that triggers the interaction;
- the usual sequence of actor intentions and observable system responsibilities that achieves the goal;
- alternatives, optional behavior, invalid or missing information, rejection, authorization failure, cancellation, timeout, concurrency, correction, retry, compensation, partial completion, and external-party failure;
- the success guarantee and the minimal guarantee preserved when the goal is not achieved;
- business information created, consulted, changed, or published and the subdomain authoritative for each fact;
- applicable policies, business rules, constraints, privacy, security, safety, accessibility, compliance, audit, timing, volume, and operability concerns;
- concrete acceptance examples for normal, alternative, error, correction, and boundary behavior;
- evidence, accountable authority, assumptions, and unresolved questions.

Classify consequential statements as fact, assumption, proposal, decision, recommendation, or open question. Do not invent required fields, matching thresholds, authorizations, legal rules, external systems, retention periods, timing targets, or exception behavior. An unresolved material rule remains an owned open question with a resolution condition.

## Write Cockburn-style behavior precisely

Keep the main success scenario short and linear. Number each step. Express actor intentions and observable system responsibilities in domain language. A step may identify information used or produced, but must not prescribe pages, buttons, widgets, protocols, services, databases, algorithms, or deployment structure.

Write extensions against a numbered main-scenario step or an explicit condition. State the condition, the observable handling, and whether the interaction returns to a step, succeeds with a valid alternative outcome, transfers to another use case, or ends without the goal. Do not hide material failure behavior in prose and do not expand trivial UI validation into independent use cases.

State guarantees independently of implementation:

- the **success guarantee** describes the business facts and protected interests that hold after successful completion;
- the **minimal guarantee** describes what remains true after cancellation, rejection, interruption, or failure.

Link authoritative objects, rules, `FR-`, `NFR-`, `CON-`, `SE-`, actor, domain, and neighboring-use-case identifiers. Do not duplicate their normative content. Keep concerns unique to this use case here; hand genuinely cross-cutting behavior or quality outcomes to the appropriate catalog.

Acceptance examples must be externally meaningful and testable without prescribing implementation. Use concise Given/When/Then examples or the repository's established notation. Every example must trace to the main scenario, an extension, a guarantee, or a material boundary. Do not imply that illustrative test data is production data or an accepted universal rule.

## Validate the behavioral model

Challenge the specification for:

- a coherent main success scenario from trigger to success guarantee;
- every extension terminating, returning to a named step, or handing off explicitly;
- protection of the minimal guarantee under failure and cancellation;
- consistency with the cataloged actor goal, actors, and subdomain ownership;
- clear separation from neighboring use cases and delivery slices;
- authoritative ownership of information and decisions crossing subdomain or external boundaries;
- proportionate coverage of normal, alternative, error, correction, privacy, authorization, concurrency, and recovery situations;
- acceptance examples that distinguish required behavior from assumptions and open questions;
- absence of UI, architecture, schema, and implementation prescriptions.

Use scenario findings to expose defects; do not paper over them. If a missing policy prevents a responsible scenario, keep the affected extension or guarantee explicitly unresolved rather than fabricating a rule.

## Determine readiness

An early draft is ready to write when the goal, principal boundary, main success path, material uncertainties, and intended review purpose are sufficiently clear that the artifact will not be misleading.

A reviewable specification is ready to confirm when:

- it remains one user goal for one primary actor;
- preconditions and trigger do not perform work belonging inside the use case;
- the main scenario reaches the success guarantee;
- material extensions protect the minimal guarantee;
- actors, primary and participating subdomains, business objects, and neighboring use cases agree with their authoritative artifacts;
- policies and cross-cutting requirements are linked rather than duplicated;
- acceptance examples cover the significant behavior proportionately;
- assumptions and open questions have owners and resolution conditions;
- no delivery slice, UI flow, or technical design is masquerading as the complete use case.

Do not demand perfect knowledge. If the user requested a draft, preserve material uncertainty visibly. Do not propose acceptance while an unresolved issue makes the central goal, authority, success guarantee, or minimum protection incoherent.

## Confirm before writing

Present a concise synthesis of the boundary, actors, stakeholders, main scenario, material extensions, guarantees, information ownership, concerns, acceptance examples, assumptions, open questions, and cross-artifact handoffs. Ask the user to confirm or correct it unless they explicitly requested an immediate provisional draft.

Confirmation means the synthesis reflects current understanding; it does not make a `draft` complete, optimal, accepted, or closed to correction.

## Create or update the specification

After confirmation, or immediately for an explicitly requested provisional draft:

1. Create or update one individual file from `docs/governance/templates/use-case.md` in the repository's established use-case location.
2. Preserve the cataloged `UC-` identifier and link the individual specification from the catalog without turning the ID cell into a formatted value when validators require a raw ID.
3. Keep a new or materially changed specification in `draft` unless the accountable authority explicitly assigns another lifecycle state.
4. Keep scenario detail in the individual specification and the portfolio overview in `use-cases.md`; do not duplicate the full scenario in the catalog.
5. Link authoritative terms, actors, subdomains, business objects, rules, constraints, requirements, evidence, neighboring use cases, and decisions directly and relatively.
6. Record material catalog, actor, domain, object, rule, quality, UX, architecture, test, or delivery impacts as precise handoffs. Apply only authorized meaning-preserving secondary repairs.
7. Do not create stories, slice specifications, UI designs, architecture, test code, or implementation unless separately requested.

## Validate and report

Compare the written specification with the confirmed synthesis and authoritative context. Validate identifiers, links, scenario numbering, extension references, guarantees, acceptance coverage, status, and cross-artifact consistency. Run repository validation when available.

Report the created or changed specification, lifecycle status, principal scenario and extensions, unresolved questions and handoffs, validation performed, skipped checks, and residual limitations. Never present an ad hoc or early draft as accepted stakeholder intent.
