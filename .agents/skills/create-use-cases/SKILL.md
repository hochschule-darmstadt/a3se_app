---
name: create-use-cases
description: Collaboratively discover, refine, correct, or assess actor-goal use cases, map every use case to exactly one primary subdomain, and maintain an authoritative use-case catalog and PlantUML landscape. Use after product intent, domain language, subdomains, and actors are sufficiently established; do not use it for individual Cockburn-style specifications, backlog features, UI flows, business-object modeling, software architecture, or implementation.
---

# Create Use Cases

Develop an evidence-aware catalog of actor goals with the user. Treat every draft as a falsifiable current model that later evidence may refine or correct, not as a catalog to defend. Treat the user as a collaborative requirements and domain-design partner whose expertise may include the business domain, product, operations, use-case modeling, DDD, architecture, and the legacy system. Propose and challenge candidates, invite alternatives and corrections, and critically evaluate the agent's and the user's proposals against the available evidence.

The user's instructions take precedence over this skill. Authorization to analyze or document use cases does not authorize changes to product intent, glossary meanings, actors, domain boundaries, business-object models, domain rules, architecture, implementation, or unrelated artifacts.

## Preserve semantic ownership

- The Product Vision owns product intent, target users and outcomes, capability areas, product boundaries, and transformation intent.
- The domain glossary owns the meaning and context of domain-expert vocabulary.
- The actor catalog owns stable actor identities, roles, goals, and responsibilities.
- The business-domains artifact owns the overall-domain boundary, subdomains, their responsibilities and strategic classification, and justified bounded contexts.
- The use-case catalog owns actor goals, observable interactions, primary and supporting actors, and the mapping of each goal to one primary subdomain and any participating subdomains.
- `specify-use-case` owns the trigger, preconditions, success and minimal guarantees, main success scenario, material extensions, use-case-specific concerns, and acceptance examples of an individual use case. Those details remain outside this skill's writing scope.
- Functional requirements own normative behavior that applies across multiple use cases. Non-functional requirements own measurable cross-cutting quality and compliance outcomes.
- Business-object artifacts own business concepts, responsibilities, lifecycles, and relationships. Domain rules own normative business policies and invariants where the repository provides a dedicated authority.
- Architecture owns software structure, integration mechanisms, data stores, deployment units, and technology choices. Delivery items own negotiable implementation slices, not stakeholder intent.
- Source evidence supports analysis but is not accepted intent by itself.

Do not silently change an owning artifact to make a use-case proposal fit. Apply a secondary-artifact edit only when it is meaning-preserving, necessary for consistency, and within the user's requested scope. Hand material changes to the workflow that owns them.

## Use use-case terms precisely

- **Actor**: a stable human role, external party, or external system that interacts with the system under consideration.
- **Primary actor**: the actor whose business goal the use case serves and who initiates or meaningfully triggers the interaction.
- **Supporting actor**: an actor that assists the interaction or supplies a service or fact without owning the central goal.
- **Use case**: a user-goal-level interaction through which a primary actor obtains an observable business result from the system under consideration.
- **Primary subdomain**: the one subdomain that owns the central business outcome, decision, or lifecycle advanced by the use case.
- **Participating subdomain**: another subdomain that supplies or consumes business facts without taking ownership of the central outcome.
- **Use-case catalog**: the authoritative overview of identified actor goals, actors, subdomain mappings, lifecycle status, coverage, and unresolved questions.
- **Use-case landscape**: a compact UML view of cataloged use cases, their primary-subdomain containment, and actor associations.

Do not equate any of the following with a use case without evidence of a distinct actor goal and observable business result:

- a screen, page, button, menu entry, form, field, or interaction gesture;
- a database CRUD operation, entity, document type, report, message, API, batch job, integration endpoint, or technical event;
- a product capability area, subdomain, bounded context, software module, service, team, or delivery item;
- a broad epic such as “manage patients” or a small implementation task such as “validate postal code”;
- every legacy feature, current workflow step, or external ecosystem.

Name a use case with a concise verb-object goal at the actor's level. Prefer channel-neutral goals unless a channel changes the actor, business outcome, policies, or material interaction boundary. Split create, read, update, and delete operations only when they represent genuinely different actor goals, authority, outcomes, or lifecycles.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md`.
2. Read the repository context map and follow its requirements and domain-modeling reading paths.
3. Read the authoritative Product Vision, domain glossary, actor catalog, business-domains artifact and diagrams, existing use-case catalog, existing individual use-case specifications as supporting evidence, canonical use-case-catalog template, business objects, domain rules, functional and non-functional requirements, scope exclusions, constraints, linked evidence, applicable decisions, requirements workflow, artifact-lifecycle guidance, requirements-language guidance, notation guidance, diagram-tooling policy, and definition of done when present.
4. Load only additional architecture, test, UX, operations, or management context that materially constrains or informs the use-case analysis.

The initial workflow requires sufficiently established product intent, domain language, subdomain boundaries, and an initial actor baseline. If the actor baseline is missing or materially defective, hand the gap to `create-actors`; hand other prerequisite gaps to their owning workflows rather than inventing them. A provisional use-case candidate may expose a needed actor or subdomain correction, but it must not silently establish that correction.

Use `docs/governance/templates/use-cases.md` as the canonical template for the use-case catalog. Preserve the established location and compatible structure of an existing catalog while aligning materially changed sections with that template. Do not use the singular `docs/governance/templates/use-case.md` for the catalog; it belongs to `specify-use-case`. If no catalog structure exists, create it from the plural template.

## Select the operating mode and baseline

Determine the mode from the user's request and existing artifacts. Ask only when the distinction is materially ambiguous.

- **Initial catalog draft:** establish the first reviewable inventory and landscape. It may remain incomplete or deliberately provisional when the user wants an early artifact, provided its limitations, gaps, and next validation needs are explicit.
- **Refinement or correction:** start from the existing catalog and reopen affected goals, actors, boundaries, mappings, coverage, or statuses. Permit renaming, splitting, merging, remapping, adding, or retiring use cases when evidence warrants it.
- **Alignment assessment:** evaluate the current catalog and its supporting evidence against the latest authoritative context and report findings without writing unless the user also authorizes changes.

For a refinement or correction:

1. treat existing artifacts and diagrams as the baseline, not as unquestionable truth;
2. identify new or changed evidence, recorded uncertainties, affected `UC-` IDs, actors, subdomains, and neighboring use cases;
3. preserve unaffected content, identifiers, decisions, and lifecycle status;
4. reopen a goal or mapping whenever later evidence, business objects, rules, terminology, expert feedback, or domain analysis exposes a defect;
5. propagate confirmed consequences to the catalog, landscape, coverage views, and cross-artifact links, and record any resulting need to revisit an existing individual specification as a handoff;
6. avoid semantic or stylistic churn when evidence and intent are unchanged.

Confirmation before writing means that the artifact faithfully represents the current understanding. It does not mean that a `draft` is optimal, exhaustive, accepted, or closed to later correction.

## Establish the system and analysis boundary

State provisionally:

- the system under consideration and the observable value it provides;
- the overall domain and included subdomains from the authoritative domain landscape;
- the actors currently in scope;
- the capability or operational slice being analyzed;
- explicit exclusions and adjacent external responsibilities;
- whether the aim is broad catalog coverage or deeper validation of a selected catalog slice.

Do not derive the boundary from screens, modules, APIs, organizational charts, or the current implementation. Ask the user to correct material coverage assumptions before investing in deeper validation. Confirmation of coverage permits analysis; it does not approve individual use cases.

## Build a candidate inventory before detailed interviewing

Create a visible working inventory from the Product Vision, domain landscape, actor catalog, glossary, evidence, and current requirements. On a later run, seed it with existing entries, IDs, lifecycle state, existing individual specifications as evidence, and open questions before adding candidates.

For each candidate record:

- provisional verb-object title;
- primary actor and the actor's goal;
- trigger and observable business outcome;
- provisional observable result needed to distinguish the goal from neighboring use cases;
- candidate primary subdomain and ownership rationale;
- participating subdomains and business facts exchanged;
- supporting actors;
- scope start and end;
- representative boundary situations needed to distinguish or validate the goal;
- policies, information, privacy, safety, compliance, and quality concerns;
- source evidence and confidence;
- plausible split, merge, rename, or exclusion alternatives;
- disposition: unresolved, under analysis, ready to confirm, confirmed, rejected with rationale, or owned open question.

The inventory is an analytical aid, not the authoritative catalog. Do not present generated candidates as discovered facts. A user-supplied list is a proposal to evaluate unless it is already approved intent supported by the repository.

## Develop and compare candidate goal structures

Propose the smallest useful set of plausible goal decompositions instead of anchoring the interview on one list. Explain evidence, advantages, risks, and unresolved assumptions for material alternatives. Recommend an option when evidence supports one, while distinguishing the recommendation from stakeholder evidence and accountable decisions.

A candidate is more likely to be a coherent use case when these signals align:

- one identifiable primary actor pursues one business goal;
- success yields one observable and valuable business result;
- the interaction has a recognizable trigger, beginning, and end;
- success and failure consequences can be distinguished independently of user-interface design;
- material alternatives and failures still serve or protect the same goal;
- one subdomain clearly owns the central decision, outcome, or lifecycle transition;
- the goal can be discussed and accepted independently of implementation tasks.

Split a candidate when it contains independent actor goals, unrelated observable outcomes, different primary actors with different goals, or multiple central outcomes owned by different subdomains. Merge candidates when they are merely consecutive steps, channels, CRUD variants, or implementation fragments of one goal and do not provide independently valuable results.

## Interview as a rigorous collaborative design partner

Tell the user that use-case discovery, refinement, correction, or assessment is beginning. State that a fully proposed catalog will be written only after the relevant understanding threshold is met, while an explicitly requested early draft may be written as a provisional snapshot after its current meaning and limitations are confirmed. Acknowledge that the user may contribute business, product, operational, DDD, architectural, UX, or legacy-system expertise.

Ask the highest-value unresolved goal or boundary question next. Prefer one focused question per turn; group tightly related questions only when the user requests a faster questionnaire. Adapt each question to the evidence and preceding answers rather than following a fixed script.

For each material candidate, establish only what is needed from the following:

- what business goal the primary actor is pursuing and why that actor owns the goal;
- the trigger, scope start and end, and observable business outcome at catalog granularity;
- representative normal, alternative, failure, and correction situations only as far as needed to distinguish the goal and validate its ownership;
- supporting actors and what each contributes;
- business decisions, policies, invariants, authorization, and information required or produced;
- privacy, safety, security, accessibility, compliance, audit, timing, and volume concerns unique to the goal;
- the primary subdomain and why it owns the central outcome;
- participating subdomains, information ownership, and stable business facts crossing boundaries;
- the evidence or authority needed to confirm the catalog entry.

When representative scenarios are needed to test the catalog, describe them as actor intentions and observable system responsibilities, not clicks, widgets, protocol calls, services, database operations, or speculative architecture. Do not turn every conditional detail into a separate use case; keep behavior that protects or completes the same actor goal within the candidate's boundary and defer its detailed specification.

Classify consequential statements as fact, assumption, proposal, decision, recommendation, or open question. Challenge vague goals, actorless functions, noun-based catalogs, catch-all “manage” use cases, premature channels, hidden batch or external actors, unsupported system boundaries, unclear observable outcomes, and circular subdomain ownership. Do not invent policies, authority, integrations, data ownership, or accepted behavior.

Do not repeat an answered question unless new evidence conflicts with the answer. When the user does not know, retain an explicit open question with an owner and the evidence, authority, or event needed to resolve it.

## Assign each use case to exactly one primary subdomain

Map every cataloged use case to exactly one primary subdomain. Select the subdomain that owns the central business result, decision, or lifecycle transition—not the subdomain with the most steps, screens, data, or technical calls.

Record other involved subdomains as participating subdomains and state the business facts they supply or consume. Participation does not transfer ownership. Shared information does not imply shared model ownership.

If a candidate cannot be mapped responsibly to one primary subdomain:

1. test whether it combines multiple actor goals and should be split;
2. test whether the subdomain boundaries, responsibilities, or terminology are defective or unresolved;
3. identify the business decision or lifecycle whose ownership is ambiguous;
4. retain an owned open question or produce a precise `create-domains` handoff rather than selecting arbitrarily.

Do not create a new subdomain merely to accommodate one candidate, and do not distort a use case to preserve an existing domain design. Use cases are valuable boundary-validation evidence, but the domain artifact remains authoritative until its owning workflow confirms a change.

## Revise the catalog continuously

After material new evidence:

1. reconsider candidate goals, actors, scope, outcomes, and mappings;
2. split, merge, rename, add, reject, or retire candidates as warranted;
3. update coverage, participating subdomains, and scenario implications;
4. identify impacts on actors, domains, terminology, business objects, rules, cross-cutting requirements, UX, architecture, decisions, tests, or delivery items;
5. explain material revisions before moving to the next question.

Do not preserve an initial proposal merely for consistency. Preserve traceability without allowing identifiers to freeze a defective goal model:

- assign a stable `UC-NNN` identifier only when a candidate enters the authoritative catalog;
- keep the ID for a rename, clarification, scenario refinement, or remapping that preserves the same primary actor goal and observable result;
- on a split, retain the original ID only for a clearly continuous goal and assign new IDs to genuinely new goals; otherwise retire the original and assign new IDs to all successors;
- on a merge, retain an existing ID only when one goal clearly continues and absorbs the other; otherwise create a new ID and retire the predecessors;
- retire a use case whose actor goal no longer exists and never reuse its ID;
- record material predecessor and successor relationships and the evidence or decision behind the change.

Use the repository's established identifier syntax. When the repository's validator discovers definitions from the first table column, keep the identifier as raw text such as `UC-001` rather than wrapping it in inline code.

## Validate coverage and boundaries

Build or update coverage views by subdomain and actor. Verify that every intended capability and material subdomain responsibility is represented by one or more actor goals or is explicitly excluded, deferred, or identified as a gap. Verify that each actor's evidenced goals have a disposition.

Stress-test the catalog with representative end-to-end situations:

- normal completion;
- alternative paths and actor choices;
- invalid, missing, late, conflicting, or corrected information;
- rejection, cancellation, timeout, partial completion, retry, and compensation;
- handoffs across subdomains and external boundaries;
- authorization, privacy, safety, compliance, and audit-sensitive outcomes;
- recovery without unintended loss of an already established business result.

Use the results to revise use cases or create precise handoffs. Coverage is not a demand to invent use cases for every entity, state transition, screen, external system, or technical operation.

## Defer individual use-case specifications

This version of the skill owns only the use-case catalog and its landscape. It may read or link existing individual specifications as evidence, but it must not create or materially revise them. Do not use the singular `use-case.md` template as a substitute for the plural catalog template.

When a catalog entry needs detailed Cockburn-style elaboration, record a precise `specify-use-case` handoff or open question. Do not perform that workflow implicitly inside catalog creation.

## Determine readiness

Assess readiness separately for an early catalog draft and a reviewable catalog.

An early catalog draft is ready to write when:

- the system boundary, analyzed slice, and intended use of the snapshot are clear enough that it will not be misleading;
- every shown use case is distinguishable as proposed, unresolved, or previously accepted;
- known coverage gaps, mapping uncertainties, alternatives, and validation needs are visible;
- the user confirms that the snapshot reflects the current understanding;
- the artifact remains `draft` and is not presented as exhaustive or optimal.

A catalog is ready to confirm when:

- every catalog entry expresses one distinct actor goal and observable business result;
- every use case has exactly one primary actor and one primary subdomain;
- supporting actors and participating subdomains are explicit where material;
- triggers, goal boundaries, and observable outcomes are understood sufficiently to distinguish neighboring use cases;
- overlaps, gaps, duplicates, and catch-all goals are resolved or explicitly owned;
- actor and subdomain coverage is accounted for without manufacturing artificial goals;
- stable IDs are unique and lifecycle changes preserve traceability;
- no screen, CRUD operation, entity, document, interface, module, or delivery item is masquerading as an actor goal;
- material assumptions and open questions are owned and visible.

Do not demand perfect knowledge. A non-blocking uncertainty may remain when its impact, owner, and resolution condition are explicit. If a material question prevents a responsible goal or mapping, keep it unresolved instead of forcing apparent completeness. If the user requests an early draft, comply once the early-draft conditions are met.

## Confirm the understanding

Before writing, present a concise synthesis containing:

- system boundary, analyzed slice, and actors in scope;
- proposed use cases with primary actors, goals, outcomes, primary subdomains, and material participating subdomains;
- important boundary, outcome, policy, and information findings;
- actor and subdomain coverage, overlaps, gaps, and boundary-validation results;
- recommended goal structure and material alternatives;
- rejected or merged candidates with rationale;
- facts, assumptions, recommendations, decisions, and open questions;
- catalog entries that need later individual elaboration, if any;
- exact handoffs required for Product Vision, glossary, actors, domains, business objects, rules, cross-cutting requirements, UX, architecture, or decisions;
- known limitations in the available evidence.

Ask the user to confirm or correct the synthesis as an accurate representation of the current understanding. Do not treat confirmation as acceptance of an optimal or final catalog, and do not silently turn an agent recommendation or conversational agreement into accepted business intent. Record the accountable authority and lifecycle status that actually apply.

## Create or update the use-case artifacts

After confirmation:

1. Update the authoritative use-case catalog using `docs/governance/templates/use-cases.md` and the repository's established compatible structure.
2. Create or update the authoritative PlantUML Use-case Landscape source and its locally rendered SVG. Keep the graphical overview near the beginning of the catalog.
3. Do not create or materially revise individual detailed specifications. Link existing ones when useful and record later elaboration needs as explicit handoffs or open questions.
4. Keep diagram source authoritative and generated images derived. Use stable actor, domain, subdomain, and use-case identifiers consistently in text and diagrams.
5. Keep the catalog concise and current. Preserve detailed discovery evidence and candidate history in linked evidence rather than turning it into an interview transcript.
6. Keep a new or materially changed catalog in `draft` unless the accountable authority explicitly approves another lifecycle state. Preserve an existing status when no semantic change occurred.
7. Include a coverage view by primary subdomain and record material boundary-validation observations, assumptions, and open questions.
8. Link to actors, domains, glossary definitions, business objects, rules, requirements, constraints, evidence, and decisions rather than duplicating authoritative content.
9. Apply only explicitly authorized, meaning-preserving secondary-artifact repairs. Produce precise handoffs for material changes owned elsewhere.
10. Do not create backlog items, user stories, UI designs, architecture, services, APIs, schemas, databases, or implementation plans unless the user separately requests them.

### Lay out the Use-case Landscape as a PlantUML UML view

Unless the repository or user requires another notation, create the high-level Use-case Landscape as a PlantUML UML use-case diagram. Keep an authoritative sibling source such as `use-case-landscape.puml`, render it locally to `use-case-landscape.svg`, and embed the SVG directly below the catalog's **Use-case landscape** heading. Do not add a second “PlantUML” or “UML” heading merely to label the rendering. Never edit the generated SVG by hand.

Use standard UML-oriented elements consistently:

- represent the system's overall domain, strategic groups, and primary subdomains as nested `rectangle` boundaries;
- represent actor goals with PlantUML `usecase` elements;
- represent actors with PlantUML `actor` elements;
- use containment only for a use case's one primary subdomain;
- keep participating-subdomain mappings in the catalog table rather than adding misleading secondary containment or a dense web of cross-boundary lines;
- add `include`, `extend`, or use-case generalization only when their UML semantics are evidenced and materially useful; do not add them to make the diagram look complete.

Use the strategic classification and order from the authoritative domain landscape:

- place Core first, then Supporting, then Generic, omitting empty groups;
- stack subdomains vertically in stable-ID order within each strategic group unless confirmed business meaning requires another order;
- stack use cases vertically in stable-ID order within each primary subdomain;
- retain unresolved use-case candidates in the textual analysis until they are cataloged; do not give them stable `UC-` identifiers merely to place them in the landscape.

Place actors locally to keep associations traceable:

- create one actor group per subdomain and place it to the left of that subdomain;
- repeat the same actor symbol in every subdomain where the actor participates, retaining the same stable actor ID and name but using a unique PlantUML alias;
- stack actors vertically in stable-ID order inside each local actor group;
- associate every actor symbol directly with its use cases, never with an actor-group boundary, strategic group, subdomain boundary, or overall-domain boundary;
- use a solid association for the primary actor and a dashed association for a supporting actor;
- omit `P` and `S` labels from individual lines and explain the line styles once in a legend;
- state in the legend that a repeated actor symbol represents the same actor identity shown locally per subdomain.

Use the following visual defaults unless an established artifact or explicit direction requires another accessible style:

- disable shadows and use a readable sans-serif font at about 13 points;
- use `skinparam linetype spline` so associations remain direct-looking and avoid the long orthogonal detours that `polyline` can create around neighboring use cases;
- actor groups: white background, grey border, dark text;
- overall domain: light-grey boundary or background that remains subordinate to the strategic colors;
- Core: amber use cases `#FEF3C7`, border `#B45309`, with a very light amber group/subdomain background;
- Supporting: blue use cases `#DBEAFE`, border `#1D4ED8`, with a very light blue group/subdomain background;
- Generic: green use cases `#DCFCE7`, border `#15803D`, with a very light green group/subdomain background;
- keep labels concise, place the stable ID first, and wrap only when required for readability.

PlantUML declaration order alone may not preserve the required layout. Use the smallest necessary hidden constraints:

- `-[hidden]down->` for the vertical order of actors, use cases, subdomains, strategic groups, and corresponding local actor groups;
- `-[hidden]right->` to keep each local actor group to the left of its corresponding subdomain;
- `[norank]` on actor-to-use-case associations so semantic links do not unnecessarily distort the layout.

Hidden constraints are rendering instructions, not business relationships. Do not describe them as domain dependencies. The semantic associations must remain direct actor-to-use-case links.

Use a compact legend such as:

```plantuml
legend bottom
  |= Relationship |= Meaning |
  | solid line | P · Primary actor |
  | dashed line | S · Supporting actor |
  | repeated actor symbol | Same actor identity, shown locally per subdomain |
endlegend
```

If the complete catalog cannot remain readable in one landscape, split the visualization by overall domain or create focused views while keeping the catalog authoritative and the view boundaries explicit. Do not solve crowding by shrinking text until it is unreadable or by reconnecting actors to aggregate boundaries.

Render with the repository toolchain, for example:

```sh
npm run diagrams:render -- path/to/use-case-landscape.puml path/to/use-case-landscape.svg
```

Run the repository's PlantUML or diagram validation and visually inspect the SVG. Reject a rendering with wrong strategic or stable-ID order, actor groups below the domain, unreadable or crossing associations, lines routed conspicuously around unrelated use cases, ambiguous primary/supporting roles, associations attached to aggregate boundaries, inconsistent duplicate actor names, clipped labels, or unnecessary empty space. Correct the authoritative `.puml`, regenerate the SVG, and inspect it again; parser success alone is insufficient.

## Validate and report

Critically compare the completed artifacts with the confirmed synthesis and source evidence. Verify that:

- catalog, landscape, coverage views, actor/subdomain artifacts, and any linked existing individual specifications use the same identifiers, names, actors, goals, and mappings;
- every use case has exactly one primary actor and one primary subdomain;
- actor associations in the landscape match the catalog and terminate at use cases;
- participating subdomains are not misrepresented as primary ownership;
- applicable policies and cross-cutting requirements are linked rather than duplicated;
- representative boundary situations have been considered proportionately enough to validate catalog granularity and ownership;
- established glossary meanings remain intact;
- remaining assumptions and open questions are visible and owned;
- revisions preserve traceability for renamed, split, merged, remapped, or retired use cases;
- cross-artifact links and stable identifiers remain valid.

Run the repository's documentation and diagram validation commands when available. Render and visually inspect meaningful diagrams; parser success does not prove correct requirements meaning. If configured tooling is unavailable, do not rebuild, replace, upgrade, or downgrade it as part of this workflow. Perform feasible checks manually and report skipped validation and impact.

Report changed files, the resulting catalog and lifecycle status, confirmed actors and subdomain mappings, material alternatives and rejected candidates, boundary-validation findings, later elaboration needs, cross-artifact handoffs, validation performed, remaining assumptions and open questions, and residual limitations. Do not present a provisional catalog as accepted or exhaustive.
