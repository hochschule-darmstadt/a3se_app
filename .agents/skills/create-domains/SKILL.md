---
name: create-domains
description: Collaboratively create, refine, correct, or assess a strategic DDD decomposition of a product's problem space into domains, subdomains, and justified bounded contexts. Use after product intent and domain language are sufficiently established; do not use it to design software architecture, detailed use cases, business-object models, or implementation modules.
---

# Create Business Domains

Develop an evidence-aware strategic Domain-Driven Design decomposition with the user. Treat every draft as a falsifiable current model that later evidence may refine or correct, not as a structure to defend. Treat the user as a collaborative domain-design partner whose expertise may include the business domain, product, organization, legacy system, architecture, and DDD. Propose and defend candidate structures, invite alternatives and corrections, and critically evaluate the agent's and the user's proposals against the available evidence.

The user's instructions take precedence over this skill. Authorization to analyze or document business domains does not authorize changes to product intent, glossary meanings, detailed use cases, business-object models, software architecture, implementation, or unrelated artifacts.

## Preserve semantic ownership

- The Product Vision owns product intent, target users and outcomes, capability areas, product boundaries, and transformation intent.
- The domain glossary owns the meaning and context of domain-expert vocabulary.
- The business-domains artifact owns the current problem-space decomposition, subdomain responsibilities and boundaries, strategic classification, and justified bounded-context view.
- Use cases own actor goals and observable interactions. Business-object artifacts own their catalog and detailed problem-space responsibilities. Domain rules own normative business policies and invariants where the repository provides a dedicated authority.
- Architecture owns software structure, integration mechanisms, data stores, deployment units, and technology choices.
- Source evidence supports analysis but is not accepted intent or a confirmed domain boundary by itself.

Do not silently change an owning artifact to make the proposed decomposition fit. Apply a secondary-artifact edit only when it is meaning-preserving, necessary for consistency, and within the user's requested scope. Hand material changes to the workflow that owns them.

## Use DDD terms precisely

- **Overall domain**: the complete business problem space being considered.
- **Subdomain**: a cohesive part of that problem space with a distinct business purpose, rules, language, or responsibility.
- **Core subdomain**: a subdomain that provides material strategic differentiation or advantage. Importance, compliance criticality, complexity, or implementation cost alone does not make a subdomain core.
- **Supporting subdomain**: product- or organization-specific capability needed to support the core without being the principal source of differentiation.
- **Generic subdomain**: capability whose required behavior is substantially standardized or commonly available.
- **Bounded context**: a boundary within which a particular domain model and ubiquitous language are consistent.
- **Domain landscape**: a view of the overall domain, its subdomains, their strategic classification, and external domain boundaries.
- **Context map**: a view of bounded contexts and their model relationships, dependency direction, and collaboration patterns.

Do not equate any of the following without evidence:

- Product Vision capability area and subdomain;
- subdomain and bounded context;
- bounded context and software module, service, team, database, or deployment unit;
- actor, data entity, document type, user-interface area, external system, integration standard, or current legacy component and subdomain;
- shared information and shared model ownership.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md`.
2. Read the repository context map and follow its requirements and domain-modeling reading paths.
3. Read the authoritative Product Vision, domain glossary, linked discovery evidence, existing business-domains artifact, canonical domains template, business objects, actors, use cases, domain rules, scope exclusions, constraints, applicable decisions, requirements workflow, artifact-lifecycle guidance, notation guidance, diagram-tooling policy, and definition of done when present.
4. Load only additional architecture, test, operations, or management context that materially constrains or informs the domain analysis.

The initial workflow requires product intent that establishes the intended product surface and domain language sufficient to discuss its meaning. If the Product Vision or glossary is absent or too incomplete to support responsible analysis, identify the exact prerequisite gap and hand it to `create-product-vision` or `create-glossary`; do not infer a domain landscape from implementation structure or decontextualized nouns.

Use the repository's canonical domains template when one exists. Preserve the established location and compatible structure of an existing business-domains artifact. If neither exists, propose a minimal structure before creating one.

## Select the operating mode and baseline

Determine the mode from the user's request and the existing artifacts. Ask only when the distinction is materially ambiguous.

- **Initial draft:** establish the first reviewable decomposition. It may remain incomplete or deliberately provisional when the user wants an early artifact, provided its limitations, unresolved candidates, and next validation needs are explicit.
- **Refinement or correction:** start from the existing landscape and the requested or evidence-driven delta. Reopen any affected boundary, responsibility, classification, bounded context, or relationship. Permit renaming, splitting, merging, moving responsibilities, reclassifying, adding, or retiring elements when the evidence warrants it.
- **Alignment assessment:** evaluate the current landscape against the latest authoritative context and report findings without writing unless the user also authorizes changes.

For a refinement or correction:

1. treat the existing artifact and diagrams as the baseline, not as unquestionable truth;
2. identify new or changed evidence, previously recorded uncertainties, and the exact affected IDs and neighbors;
3. use later use cases, business objects, rules, terminology, expert feedback, and architecture analysis as challenge evidence without letting them silently override the owning domain artifact;
4. preserve unaffected content, IDs, decisions, and lifecycle status;
5. reassess impacted end-to-end scenarios and propagate confirmed consequences;
6. avoid semantic or stylistic churn when the evidence and intent are unchanged.

Confirmation before writing means that the artifact faithfully represents the current understanding. It does not mean that a `draft` is optimal, complete, accepted, or closed to later correction. An accepted landscape may also be revised when accountable new evidence warrants change, but follow the repository's lifecycle and decision rules rather than silently rewriting history.

## Establish the analysis boundary

Begin with a provisional statement of the overall domain and its external boundary. Derive it from intended outcomes, capability coverage, explicit inclusions and exclusions, target operating context, and evidence. Do not describe the overall domain in terms of the product name, delivery channel, architecture, or current implementation.

Make material uncertainty visible, including:

- product or market boundaries that change which business rules apply;
- organizational or geographic scope;
- whether an adjacent capability is owned, integrated, or external;
- whether current-system behavior represents accepted intent;
- whether a stated constraint is a business necessity, current technical limitation, proposed architecture, or approved decision.

Ask the user to correct the overall-domain statement and candidate coverage before investing in detailed boundary questions. Treat confirmation of coverage as permission to analyze those candidates, not as approval of their boundaries or classification.

## Build a candidate inventory before detailed interviewing

Create a visible working inventory from the Product Vision, glossary, linked evidence, current domain landscape, and relevant existing specifications. On a later run, seed the inventory with existing elements, their IDs, lifecycle state, recorded uncertainties, and affected relationships before adding new candidates. For each candidate record:

- provisional name and business purpose;
- source statements and affected product capabilities;
- characteristic language and concepts;
- candidate responsibilities and explicit non-responsibilities;
- business decisions, rules, invariants, and lifecycles that may establish cohesion;
- possible information authority;
- neighboring or external areas;
- plausible alternative splits or merges;
- provisional Core, Supporting, or Generic classification with rationale and uncertainty;
- whether a bounded context is evidenced, merely hypothesized, or not yet considered;
- disposition: unresolved, under analysis, ready to confirm, confirmed, rejected with rationale, or owned open question.

The inventory is an analytical aid, not the authoritative domain artifact. Do not present generated candidates as discovered facts. A user-supplied decomposition is a proposal to evaluate unless it is already an approved decision supported by the repository. Do not demote accepted elements to uncommitted candidates on every rerun, but do challenge them when new evidence or an explicit correction request exposes a defect.

## Develop competing decompositions

Propose the smallest useful set of plausible decompositions rather than anchoring the interview on one answer. Explain the evidence, advantages, risks, and unresolved assumptions for each material alternative. Recommend an option when the evidence supports one, but keep the recommendation visibly distinct from stakeholder evidence and accountable decisions.

Use multiple boundary signals together. A candidate boundary becomes stronger when several of these align:

- distinct business purpose or outcome;
- separate decision authority or accountable expert group;
- cohesive business rules and invariants;
- independent lifecycle or state transitions;
- context-specific language or materially different meanings for shared terms;
- clear information authority;
- different regulatory, policy, temporal, or organizational change drivers;
- different strategic differentiation or sourcing considerations;
- stable business facts that can cross the boundary without sharing the internal model.

One signal alone is rarely decisive. A current database boundary, application screen, organizational chart, integration endpoint, or legacy module is evidence about the current solution, not proof of a problem-space boundary.

## Interview as a collaborative design partner

Tell the user that strategic domain discovery, refinement, correction, or assessment is beginning. State that a fully proposed landscape will be written only after the understanding threshold is met, while an explicitly requested early draft may be written as a provisional snapshot after its current meaning and limitations are confirmed. Acknowledge that the user may contribute business, DDD, architecture, organizational, or legacy-system expertise.

Ask the highest-value unresolved boundary question next. Prefer one focused question per turn; group tightly related questions only when the user requests a faster questionnaire. Adapt each question to the current evidence and preceding answers rather than following a fixed checklist.

Use the interview to co-design, compare, challenge, and validate decompositions, not merely to elicit facts. For each material candidate or boundary, establish only what is needed from the following:

- business purpose and outcome;
- included and excluded responsibilities;
- business decisions, policies, and invariants;
- lifecycle and state ownership;
- ubiquitous language and semantic collisions;
- actors, experts, and decision authority;
- information ownership versus information use;
- inputs, outputs, and business facts exchanged with neighbors;
- dependency direction and tolerance for independent change;
- regulatory, organizational, and temporal change drivers;
- strategic differentiation and plausible make, buy, or integrate implications, without selecting architecture;
- representative normal, alternative, error, and boundary scenarios.

When the user offers an architectural argument, determine whether it is:

- a domain necessity;
- evidence from the current system;
- an organizational or operational constraint;
- a proposed future architecture;
- or an approved decision.

Retain useful architectural insight without converting solution structure into a business-domain boundary. If the best problem-space decomposition conflicts with an existing constraint or decision, expose the conflict and hand the architectural consequence to the appropriate workflow.

Classify each consequential statement as fact, assumption, proposal, decision, recommendation, or open question. Challenge vague responsibilities, noun-based partitions, circular ownership, unexamined shared models, hidden integration domains, and boundaries justified only by implementation. Do not invent business rules, strategic differentiation, organizational authority, or model relationships.

Do not repeat an answered question unless new evidence conflicts with the answer. When the user does not know, retain an explicit open question instead of forcing a choice. Name an owner and the evidence, authority, or event required to resolve every material open question.

## Revise the candidate landscape continuously

After material new evidence:

1. reconsider the overall-domain boundary;
2. split, merge, rename, add, or reject candidates as warranted;
3. update responsibilities, exclusions, classification, and alternatives;
4. identify impacts on terminology, product intent, use cases, business objects, rules, architecture, or decisions;
5. explain material revisions to the user before moving to the next boundary question.

Do not preserve the initial proposal merely for consistency. Do not introduce stylistic churn when the evidence and meaning are unchanged.

When revising recorded elements, preserve traceability without allowing identifiers to freeze a defective design:

- keep the ID for a rename, clarification, or boundary refinement that preserves semantic identity;
- on a split, retain the original ID only for a clearly continuous concept and assign new IDs to genuinely new concepts; otherwise retire the original and assign new IDs to all successors;
- on a merge, retain an existing ID only when one concept clearly continues and absorbs the other; otherwise create a new ID and retire the predecessors;
- retire an element whose meaning or responsibility no longer exists and never reuse its ID;
- record material predecessor and successor relationships and the evidence or decision behind the correction.

## Stress-test the decomposition

Test the candidate landscape with representative end-to-end business scenarios from the evidence. If authoritative use cases exist, prefer them; otherwise use clearly labeled discovery scenarios without creating authoritative use cases.

For each scenario, determine:

- which subdomains and candidate bounded contexts participate;
- which area owns each material decision and lifecycle transition;
- which areas consume but do not own information;
- which business facts cross boundaries;
- where terms change meaning;
- where corrections, delays, rejection, partial completion, or conflicting information are resolved;
- whether the decomposition creates circular authority, an incoherent shared model, or an artificial handoff.

Use the results to revise the candidates. Scenario coverage is boundary-validation evidence, not a substitute for later use-case specification.

## Introduce bounded contexts only when justified

Establish subdomains in the problem space before asserting bounded contexts in the solution's modeling space. Add a bounded-context proposal only when the evidence supports a distinct model and language boundary. One subdomain may be supported by multiple bounded contexts, and one context may contribute to adjacent subdomains; explain every non-trivial mapping.

For each proposed bounded context establish:

- model purpose and responsibility;
- supported subdomain or subdomains;
- ubiquitous-language scope and material term meanings;
- authoritative information and published business facts;
- explicitly excluded responsibilities;
- neighboring contexts, dependency direction, and evidence;
- an established DDD Context Mapping pattern only when its semantics are supported.

Do not add bounded contexts merely to complete a template. Do not infer APIs, messages, services, storage, transactions, or deployment boundaries from the context map.

## Determine readiness

Assess readiness separately for an early draft, the subdomain landscape, and the bounded-context view.

An early draft is ready to write when:

- its scope and purpose are clear enough that the snapshot will not be misleading;
- every shown element is distinguishable as proposed, unresolved, or previously accepted;
- known gaps, alternatives, and validation needs are visible;
- the user confirms that the snapshot accurately reflects the current understanding;
- the artifact will remain `draft` and will not be presented as complete or optimal.

The subdomain landscape is ready to confirm when:

- the overall domain and its external boundary are coherent with the Product Vision;
- every material capability and candidate has an explicit disposition;
- each proposed subdomain has a distinct business purpose and defensible responsibility boundary;
- material overlaps, gaps, and shared concepts have been resolved or are explicitly owned;
- strategic classifications are supported or visibly deferred;
- representative scenarios do not reveal unexplained ownership or circular authority;
- no capability area, actor, entity, legacy component, technical standard, or software module has been silently promoted to a subdomain;
- no hidden or unowned material uncertainty makes the current decomposition irresponsible to adopt.

The bounded-context view is ready only when, in addition:

- every proposed context has a coherent model and language boundary;
- its mapping to subdomains is explicit;
- information authority and material context relationships are understood;
- dependency direction and any named Context Mapping pattern are supported by evidence;
- the view does not imply unapproved software architecture.

Do not demand perfect knowledge. A non-blocking uncertainty may remain when its impact, owner, and resolution condition are explicit. If a material question prevents a responsible boundary or classification, keep the affected item unresolved rather than forcing apparent completeness. If the user requests an early draft or asks to stop before full readiness, comply once the early-draft conditions are met, keep the output in `draft`, distinguish the current model from unresolved candidates, and expose the unfinished inventory and next validation needs.

## Confirm the understanding

Before writing, present a concise synthesis containing:

- overall domain and external boundary;
- proposed subdomains, responsibilities, exclusions, and strategic classification;
- justified bounded contexts and their mappings, if any;
- material context relationships and information authority;
- representative scenario results;
- recommended decomposition and material alternatives;
- rejected candidates or decompositions with rationale;
- facts, assumptions, recommendations, decisions, and open questions;
- exact handoffs required for Product Vision, glossary, actors, use cases, business objects, rules, architecture, or decisions;
- known limitations in the available evidence.

Ask the user to confirm or correct the synthesis as an accurate representation of the current understanding. Do not treat this confirmation as approval of an optimal or final design, and do not silently turn the agent's recommendation, an expert opinion, or conversational agreement into accepted business intent. Record the accountable authority and lifecycle status that actually apply.

## Create or update the domain artifacts

After confirmation:

1. Update the authoritative business-domains artifact using the canonical template.
2. Create or update the authoritative Domain Landscape source and its locally rendered review artifact. Keep the graphical overview near the beginning of the document.
3. Create or update a Context Map only when the bounded-context readiness conditions are met. Use the repository's approved notation and tooling; do not substitute a generic graph for unsupported DDD semantics.
4. Keep diagram source authoritative and generated images derived. Use stable domain, subdomain, and bounded-context identifiers consistently in text and diagrams. Apply the rename, split, merge, and retirement rules above; never preserve a defective model merely to retain an ID and never reuse a retired ID.
5. Keep the domain artifact concise and current. Preserve detailed discovery evidence, candidate history, and unresolved analysis in linked source evidence or the repository's authoritative open-question location rather than turning the artifact into an interview transcript.
6. Keep a new or materially changed landscape in `draft` unless the accountable authority explicitly approves another lifecycle state. An early draft may contain clearly marked proposed boundaries and owned uncertainties. Preserve an existing status when no semantic change occurred.
7. Record only justified bounded contexts. Omit or explicitly defer the Context Map when the analysis supports only a problem-space decomposition.
8. Link to glossary definitions, rules, use cases, business objects, constraints, source evidence, and decisions rather than duplicating their authoritative content.
9. Apply only explicitly authorized, meaning-preserving secondary-artifact repairs. Produce precise handoffs for material changes owned elsewhere.
10. Do not create detailed use cases, business-object models, architecture, services, APIs, schemas, databases, team boundaries, or implementation plans unless the user separately requests them.

### Lay out the Domain Landscape as a PlantUML package view

Unless the repository or user requires another notation, create the high-level Domain Landscape as a PlantUML UML package diagram. Keep an authoritative sibling source such as `domain-landscape.puml`, render it locally to `domain-landscape.svg`, embed the SVG near the beginning of the domain artifact, and link the source directly below the image. Never edit the generated SVG by hand.

Use named, nested packages to express only the established problem-space hierarchy:

- Represent each overall domain as a package. Give a cataloged domain a two-line title: its stable `DOM-NNN` identifier on the first line and its complete name on the second. Use a light-grey fill so this top-level boundary remains distinct from its strategic groups.
- Within an overall domain, use packages for the strategic groups **Core**, **Supporting**, **Generic**, and **Unresolved boundary candidates**, omitting empty groups. Place them from left to right in exactly that order.
- Represent every established subdomain as its own package within its strategic group. Stack subdomains vertically in stable-ID order unless the confirmed model gives another order material meaning.
- Give every subdomain a two-line package title: its stable `SD-NNN` identifier on the first line and its complete concise name on the second. Keep the name on one line when it remains readable.
- Represent unresolved candidates as visually distinct packages without misleading stable subdomain identifiers.
- Place adjacent external domains or ecosystems outside and to the right of the overall-domain package. Enclose them in one named package and stack the individual external-domain packages vertically.
- Show bounded contexts in this overview only when their model boundaries are justified and the result remains legible. Otherwise use the separate Context Map.

Use the following semantic palette unless an existing artifact or explicit user direction establishes another accessible palette:

- overall domain: light grey fill `#F3F4F6`, border `#9CA3AF`, dark text `#111827`;
- Core: amber fill `#FEF3C7`, border `#B45309`, dark-brown text `#451A03`;
- Supporting: blue fill `#DBEAFE`, border `#1D4ED8`, dark-blue text `#172554`;
- Generic: green fill `#DCFCE7`, border `#15803D`, dark-green text `#14532D`;
- unresolved candidate: white fill, grey dashed border `#6B7280`, dark-grey text `#374151`;
- external domain or ecosystem: light-grey fill `#F3F4F6`, border `#6B7280`, dark text `#1F2937`.

Keep the view compact and regular:

- Disable shadows, use rectangular package styling, and use a readable default font size of about 16 unless repository conventions require otherwise.
- Keep package titles in PlantUML's standard top position. Do not introduce nested label elements solely to simulate vertical centering.
- Give peer subdomain packages a visually uniform width and height, and do the same independently for external-domain packages. Size them for the longest complete name rather than abbreviating or wrapping names unnecessarily.
- PlantUML does not provide dependable fixed dimensions for package titles. When equalization is necessary, use minimal symmetric, background-colored inline padding in the name line and tune it from the rendered SVG. Do not add visible filler, extra padding lines, repeated descriptive words, or exposed markup. Prefer a small visual tolerance over brittle or excessive padding.
- Keep the overall domain, strategic groups, and external region only as large as their contents require. Reject large avoidable empty areas even when the syntax is valid.

PlantUML declaration order alone may not preserve the required layout. Use the smallest necessary hidden layout constraints: `-[hidden]down->` between vertically ordered sibling packages and `-[hidden]right->` between strategic groups or between the overall domain and the external region. Hidden constraints are rendering instructions, not domain relationships; do not describe them as business dependencies. Add a visible edge only for an established semantic relationship that the surrounding text explains.

Render with the repository toolchain, for example:

```sh
npm run diagrams:render -- path/to/domain-landscape.puml path/to/domain-landscape.svg
```

Run the repository's PlantUML or diagram validation and visually inspect the SVG before completing the artifact. Reject a rendering that has large avoidable empty areas, wrong strategic-group order, horizontal subdomain or external lists, inconsistent peer sizes, clipped or wrapped names that could fit on one line, exposed padding markup, unreadable text, misplaced external domains, or graphical relationships that imply unsupported business semantics. Correct the authoritative `.puml` source, regenerate the SVG, and inspect it again; parser success alone is insufficient.

## Validate and report

Critically compare the completed artifacts with the confirmed synthesis and source evidence. Verify that:

- the text and diagrams express the same boundaries, classifications, identifiers, and relationships;
- every diagram element and edge is explained in the text;
- strategic classification is not confused with business criticality;
- bounded contexts are not presented as implementation units;
- established glossary meanings remain intact and context-specific meanings are explicit;
- Product Vision capability coverage has not been lost or silently redefined;
- remaining assumptions and open questions are visible and owned;
- revisions preserve traceability for renamed, split, merged, reclassified, or retired elements without defending a known-defective boundary;
- cross-artifact links and stable identifiers remain valid.

Run the repository's documentation and diagram validation commands when available. Render and visually inspect meaningful diagrams; parser success does not prove correct business meaning. If configured tooling is unavailable, do not rebuild or replace it as part of this workflow. Perform feasible checks manually and report the skipped validation and its impact.

Report changed files, the resulting landscape and lifecycle status, confirmed subdomains and classifications, bounded contexts and relationships if any, material alternatives and rejected candidates, cross-artifact handoffs, validation performed, remaining assumptions and open questions, and residual limitations. Do not present a partial landscape or an unready Context Map as complete.
