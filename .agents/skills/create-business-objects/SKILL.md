---
name: create-business-objects
description: Collaboratively discover, refine, correct, or assess a problem-space catalog of business objects, assign every object to exactly one primary subdomain, and maintain its conceptual PlantUML landscape. Use after domain language and subdomain boundaries are sufficiently established, alongside use-case discovery; do not use it for database schemas, API models, implementation classes, DDD tactical design, or software architecture.
---

# Create Business Objects

Develop an evidence-aware conceptual business-object model collaboratively with the user. Treat every draft as a falsifiable current model that later use cases, rules, lifecycle analysis, or domain corrections may refine or replace. Treat the user as a collaborative requirements and domain-design partner whose expertise may include the business domain, operations, product, information modeling, DDD, architecture, and the legacy system.

The user's instructions take precedence over this skill. Authorization to analyze or document business objects does not authorize changes to product intent, glossary meanings, actors, use cases, domain boundaries, architecture, logical or physical data models, APIs, implementation, or unrelated artifacts.

## Preserve semantic ownership

- The domain glossary owns the meaning and context of domain-expert terms.
- The business-domains artifact owns subdomain responsibilities, boundaries, strategic classification, and justified bounded contexts.
- The business-object catalog owns stable, coarse problem-space concepts, their defining meaning, exactly one primary subdomain responsibility, business lifecycle, conceptual relationships, and responsibility boundaries.
- Use cases own actor goals, observable interactions, scenarios, and guarantees. They provide behavioral evidence for objects but do not define object structure by themselves.
- Domain rules own normative policies and invariants where the repository provides a dedicated authority. Link them rather than copying their normative text.
- Functional and non-functional requirements own cross-use-case behavior and measurable quality or compliance outcomes.
- Architecture owns software modules, services, interfaces, persistence, technical data ownership, integration, deployment, and technology choices.
- Later logical entity models may refine business objects into entities, value structures, references, or other constructs. Implementation owns classes, tables, documents, messages, DTOs, fields, and serialization.
- Source evidence supports analysis but is not accepted object meaning or ownership by itself.

Do not silently change an owning artifact to make a business-object proposal fit. Apply a secondary-artifact edit only when it is meaning-preserving, necessary for consistency, and within the user's requested scope. Hand material changes to the owning workflow.

## Use business-object terms precisely

- **Business object**: a stable, coarse concept about which the business needs to retain meaning, responsibility, state, value, or lifecycle across one or more actor goals.
- **Primary subdomain**: the one subdomain that authoritatively defines the object's meaning and governs its central lifecycle or business decisions.
- **Participating subdomain**: another subdomain that consumes, references, or contributes facts without owning the object's central meaning or lifecycle.
- **Conceptual relationship**: a business-meaning relationship between objects, independent of storage, navigation properties, foreign keys, endpoints, or message formats.
- **Lifecycle**: the business-relevant states, transitions, corrections, retirement, and temporal constraints of an object.
- **Published business fact**: a stable fact another subdomain can consume without sharing the owning subdomain's internal model.
- **Context-specific representation**: a distinct model of a related real-world subject whose meaning and lifecycle differ across subdomains.

Do not equate any of the following without evidence:

- glossary term and business object;
- actor, use case, capability, subdomain, document, report, screen, form, event, command, API resource, file, or database table and business object;
- business object and DDD Entity, Value Object, Aggregate, Aggregate Root, implementation class, or persistence entity;
- shared real-world subject and one enterprise-wide canonical object;
- a relationship and a technical reference, join, call, message, or ownership mechanism;
- primary subdomain responsibility and software-module or database ownership.

Prefer a singular domain name. Admit a candidate only when explicitly modeling it improves understanding of responsibility, lifecycle, rules, relationships, or use-case behavior. Do not turn every noun or field into a business object.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md`.
2. Read the repository context map and follow its requirements and domain-modeling reading paths.
3. Read the authoritative Product Vision, domain glossary, business-domains artifact and diagrams, existing business-object artifact, canonical business-object template, actor and use-case catalogs, available detailed use cases, domain rules, functional and non-functional requirements, scope exclusions, constraints, source evidence, applicable decisions, requirements workflow, artifact-lifecycle guidance, notation guidance, diagram-tooling policy, and definition of done when present.
4. Load only additional architecture, test, UX, operations, or management context that materially informs the problem-space model.

The initial workflow requires domain language and subdomain boundaries sufficient to discuss object meaning and primary responsibility. Use cases may be developed concurrently: use available actor-goal and scenario evidence, but do not block an early object draft solely because the complete use-case catalog is unfinished. If a material prerequisite is absent, identify the exact gap and hand it to the owning workflow rather than deriving business objects from implementation schemas or decontextualized nouns.

Use the repository's canonical business-object template when one exists. Preserve the established location and compatible structure of an existing artifact. If neither exists, propose a minimal structure before creating one.

## Select the operating mode and baseline

Determine the mode from the user's request and existing artifacts. Ask only when materially ambiguous.

- **Initial draft:** establish the first reviewable catalog and conceptual landscape. It may remain incomplete when the user requests an early snapshot, provided uncertainties and validation needs are explicit.
- **Refinement or correction:** reopen affected meanings, primary-subdomain assignments, lifecycles, responsibilities, relationships, names, or boundaries. Permit renaming, splitting, merging, remapping, adding, or retiring objects when evidence warrants it.
- **Selected-slice elaboration:** deepen the objects and relationships needed for selected subdomains or use cases without pretending that the complete product model is finished.
- **Alignment assessment:** evaluate the current catalog against domains, language, use cases, rules, and evidence without writing unless the user authorizes changes.

For a refinement or correction, treat the existing model as a baseline rather than unquestionable truth. Preserve unaffected content, IDs, decisions, and lifecycle status. Reopen an object whenever later evidence exposes conflicting meanings, lifecycle ownership, false sharing, or a defective domain boundary.

## Establish the modeling boundary

State provisionally:

- the overall domain and subdomains covered;
- the use-case or capability slice being analyzed;
- the level of conceptual detail needed;
- external concepts that are referenced but not owned;
- whether the aim is catalog breadth, selected-slice depth, or boundary validation.

Ask the user to correct material coverage assumptions before detailed modeling. Do not derive the scope from existing tables, classes, forms, API payloads, reports, or legacy modules.

## Build a candidate inventory

Create a visible working inventory from subdomain responsibilities, glossary terms, available use cases, domain rules, evidence, and the current business-object model. On a later run, seed it with existing IDs, lifecycle state, relationships, uncertainties, and affected neighbors.

For each candidate record:

- provisional singular name and concise definition;
- business purpose and why it deserves explicit modeling;
- candidate primary subdomain and ownership rationale;
- participating subdomains and facts used or contributed;
- identity or distinguishing characteristics in business terms, without designing a key;
- central lifecycle, states, decisions, corrections, and retirement;
- business responsibilities and applicable rules;
- conceptual relationships and temporal or cardinality constraints when evidenced;
- related actor goals and use cases;
- context-specific meanings or plausible separate representations;
- explicit non-responsibilities and implementation concepts it must not absorb;
- evidence, confidence, alternatives, and disposition.

The inventory is an analytical aid, not the authoritative catalog. Do not assign a stable `BO-NNN` identifier merely to preserve a noun candidate or unresolved placeholder.

## Develop and compare candidate models

Propose the smallest useful set of plausible object decompositions instead of converting every source noun into a catalog row. Explain evidence, advantages, risks, and unresolved assumptions for material alternatives.

A candidate becomes stronger when several signals align:

- several steps or use cases refer to the same coherent business concept;
- the business distinguishes individual identity, value, status, validity, provenance, or temporal history;
- rules or decisions govern its lifecycle;
- one subdomain clearly has authority over its meaning and transitions;
- neighboring subdomains need stable facts about it;
- domain experts use a recognizable name and distinguish it from related concepts;
- corrections, cancellation, supersession, merging, or retirement have business meaning.

Split a candidate when meanings, lifecycles, authority, or invariants differ by context. Merge candidates when they are merely synonyms, views, fields, technical projections, or lifecycle stages of one concept. Recommend an option when evidence supports one, while distinguishing recommendation from fact and accountable decision.

## Interview as a rigorous collaborative design partner

Tell the user that business-object discovery, refinement, correction, elaboration, or assessment is beginning. State that a fully proposed model will be written only after the relevant understanding threshold is met, while an explicitly requested early draft may be written as a provisional snapshot after its current meaning and limitations are confirmed.

Ask the highest-value unresolved meaning, lifecycle, or ownership question next. Prefer one focused question per turn; group tightly related questions only when the user requests a faster questionnaire. Adapt questions to evidence and earlier answers.

For each material candidate, establish only what is needed from the following:

- the domain-expert definition and examples or counterexamples;
- why the business needs to distinguish and retain the concept;
- what establishes its identity or equality in business terms;
- its lifecycle, states, transition authority, corrections, and terminal conditions;
- rules, invariants, validity periods, provenance, and audit-significant changes;
- the primary subdomain and why it owns the central meaning or lifecycle;
- participating subdomains and the stable facts they need;
- relationships to other objects, including temporal order and evidenced multiplicity;
- related actors, use cases, decisions, inputs, outcomes, and exceptional behavior;
- semantic collisions or context-specific representations;
- privacy, safety, security, regulatory, retention, and quality implications;
- evidence, accountable authority, and unresolved uncertainty.

Classify consequential statements as facts, assumptions, proposals, decisions, recommendations, or open questions. Challenge noun harvesting, universal “master data” objects, unexamined shared models, data-centered ownership, object names copied from screens or tables, premature attributes and types, and relationships justified only by foreign keys or APIs.

Do not invent lifecycle states, multiplicities, invariants, ownership, or information exchange. When the user does not know, retain an explicit open question with an owner and resolution condition.

## Assign exactly one primary subdomain

Assign every cataloged business object to exactly one primary subdomain: the subdomain that defines its central meaning and governs its authoritative lifecycle or decisions. Record other subdomains as participants and describe the business facts they consume or contribute.

If an object cannot be assigned responsibly:

1. test whether the candidate combines distinct context-specific meanings and should be split;
2. test whether it is a generic term, view, document, integration payload, or technical record rather than a business object;
3. test whether domain boundaries or information authority are defective or unresolved;
4. retain an owned open question or produce a precise `create-domains` handoff rather than selecting arbitrarily.

Do not solve cross-subdomain use by declaring shared ownership. Prefer explicit published business facts or separate context-specific representations when meanings and lifecycles differ. Do not infer implementation duplication, synchronization, or integration mechanisms.

## Revise the model and preserve traceability

After material new evidence:

1. reconsider meanings, boundaries, lifecycle, primary responsibility, and relationships;
2. split, merge, rename, remap, add, reject, or retire candidates as warranted;
3. update affected use-case, rule, and subdomain coverage;
4. identify impacts on terminology, actors, domains, use cases, rules, requirements, architecture, data modeling, decisions, tests, or delivery items;
5. explain material revisions before moving to the next question.

Use stable identifiers without allowing them to freeze a defective conceptual model:

- assign `BO-NNN` only when a candidate enters the authoritative catalog;
- keep the ID for a rename, clarification, lifecycle refinement, or remapping that preserves semantic identity;
- on a split, retain the original ID only for a clearly continuous concept and assign new IDs to genuinely new concepts; otherwise retire the original and assign new IDs to all successors;
- on a merge, retain an existing ID only when one concept clearly continues and absorbs another; otherwise create a new ID and retire the predecessors;
- retire an object whose meaning no longer exists and never reuse its ID;
- record material predecessor and successor relationships and their evidence or decision.

Keep the identifier as raw text such as `BO-001` in the first catalog-table column when repository validation discovers definitions there.

## Stress-test objects against behavior and boundaries

Use representative actor goals and scenarios to trace object creation, identification, use, state change, correction, rejection, cancellation, supersession, merge, archival, and retirement. For each material transition determine:

- which subdomain owns the decision;
- which actor or rule authorizes it;
- which facts cross boundaries;
- which invariants or guarantees apply;
- how neighboring representations remain semantically distinct;
- whether relationships and multiplicities hold during exceptional and historical states.

Use findings to refine objects, use cases, or domain boundaries. Scenario analysis validates the conceptual model; it does not authorize UI, API, storage, event, or service design.

## Determine readiness

An early draft is ready when the modeling boundary is clear enough not to mislead, shown objects are visibly proposed or previously accepted, known gaps and alternatives are visible, the user confirms the snapshot, and the artifact remains `draft`.

A reviewable catalog is ready when:

- every object has a recognizable business meaning and reason to be modeled;
- every object has exactly one primary subdomain;
- central lifecycle and responsibility are coherent enough to distinguish neighboring objects;
- participating subdomains and exchanged facts are explicit where material;
- relationships express business meaning rather than technical navigation;
- glossary terms, domains, use cases, and rules do not knowingly contradict the model;
- contextual meanings are separated instead of hidden in a universal object;
- entities, value objects, aggregates, tables, schemas, APIs, documents, screens, and implementation classes have not been inferred prematurely;
- stable IDs are unique and evolution preserves traceability;
- assumptions and open questions are explicit and owned.

Do not demand a complete enterprise information model. A selected vertical slice may be ready while other candidates remain deferred, provided scope and gaps are explicit.

## Confirm the understanding

Before writing, present a concise synthesis containing:

- modeling boundary and covered subdomains or use cases;
- objects to add, retain, rename, split, merge, remap, or retire;
- definitions, primary subdomains, central lifecycles, responsibilities, participating subdomains, and material relationships;
- contextual representations and published business facts;
- behavioral and boundary-validation findings;
- material alternatives and rejected candidates;
- facts, assumptions, recommendations, decisions, and open questions;
- exact handoffs required for glossary, domains, actors, use cases, rules, requirements, architecture, data modeling, or decisions;
- known evidence limitations.

Ask the user to confirm or correct the synthesis as an accurate representation of current understanding. Confirmation does not make the model complete, optimal, accepted, or an implementation design.

## Create or update the business-object artifacts

After confirmation:

1. Update the authoritative business-object catalog using the canonical template.
2. Create or update the authoritative conceptual PlantUML source and locally rendered SVG when a graphical overview materially improves understanding.
3. Keep the catalog concise and retain detailed discovery evidence in linked sources.
4. Use stable identifiers consistently and preserve rename, split, merge, remap, and retirement traceability.
5. Keep a new or materially changed model in `draft` unless the accountable authority explicitly approves another status.
6. Link glossary definitions, subdomains, actors, use cases, domain rules, requirements, constraints, evidence, and decisions rather than duplicating their authoritative content.
7. Apply only authorized, meaning-preserving secondary-artifact repairs. Produce precise handoffs for material changes owned elsewhere.
8. Do not create database schemas, logical entities, aggregates, APIs, messages, classes, modules, services, persistence designs, or implementation plans unless separately requested.

### Lay out a conceptual Business-object Landscape in PlantUML

When the model contains enough objects or relationships to benefit from a diagram, use a PlantUML UML class diagram as a conceptual notation. Keep an authoritative sibling source such as `business-object-landscape.puml`, render it locally to `business-object-landscape.svg`, embed the SVG near the beginning of the artifact, and link the source directly below it. Never edit the generated SVG by hand.

- Represent each business object as a plain UML `class`, without a stereotype, attributes, or operations. Put the raw `BO-NNN` identifier on the first line and the complete name on the second, for example `class "BO-001\nOphthalmic Examination" as BO001`.
- Set `skinparam SameClassWidth true` so every business-object class uses the width of the widest label. Do not simulate equal widths with padding, HTML labels, invisible text, or generated SVG edits.
- Use `top to bottom direction`, disable shadows, use an available readable sans-serif font at approximately 14 points, and use rectangular packages. Keep text large enough for normal Markdown rendering instead of compensating with browser zoom.
- Enclose the complete model in a light-grey overall-domain package. Within it, use horizontally ordered classification packages Core, Supporting, then Generic when present. Group objects by their one primary subdomain in nested packages.
- Use the Domain Landscape's accessible classification colors: Core amber (`#FEF3C7`/`#B45309`), Supporting blue (`#DBEAFE`/`#1D4ED8`), and Generic green (`#DCFCE7`/`#15803D`). Use light grey for the overall domain and genuinely external concepts.
- Put the classification abbreviation or subdomain ID on the first package-title line and its complete name on the second. Order subdomains and objects by stable ID unless confirmed meaning requires another order.
- Stack the classes inside each subdomain vertically with consecutive hidden `down` edges. Place subdomain packages horizontally with consecutive hidden `right` edges. Align the complete strategic groups with hidden `right` edges such as `CORE -[hidden]right-> SUPPORTING`; a hidden `down` edge between these groups causes the entire following group to be vertically offset.
- Let package height follow the number of contained objects. Do not add fake or unlabeled business objects merely to equalize package heights.
- Keep the full landscape focused on primary-subdomain containment. Record conceptual relationships, participating subdomains, published facts, multiplicities, and temporal constraints in the catalog rather than drawing a dense network over the overview. When a relationship view materially aids understanding, create a separate focused slice instead of making the complete landscape unreadable.
- If two subdomains model the same real-world subject differently, show separate business objects with distinct IDs and meanings rather than one shared class spanning package boundaries.
- Include a concise legend stating that package containment denotes primary subdomain responsibility and that conceptual relationships are cataloged in the accompanying document.
- Hidden edges are layout constraints, not business relationships. Use them only for ordering and alignment; never describe them as model semantics.
- Split an unreadable landscape by overall domain, subdomain group, or coherent vertical slice instead of shrinking text or suppressing meaningful distinctions.

A proven baseline is:

```plantuml
top to bottom direction
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 14
skinparam SameClassWidth true
skinparam packageStyle rectangle

package "DOM-001\nOverall Domain" as DOM001 #line:9CA3AF;back:F3F4F6 {
  package "Core subdomains" as CORE #line:B45309;back:FFFBEB {
    package "SD-001\nExample Core Subdomain" as SD001 #line:B45309;back:FFFDF5 {
      class "BO-001\nFirst Business Object" as BO001 #line:B45309;back:FEF3C7
      class "BO-002\nSecond Business Object" as BO002 #line:B45309;back:FEF3C7
      BO001 -[hidden]down-> BO002
    }
  }

  package "Supporting subdomains" as SUPPORTING #line:1D4ED8;back:EFF6FF {
    package "SD-002\nExample Supporting Subdomain" as SD002 #line:1D4ED8;back:F8FBFF {
      class "BO-003\nThird Business Object" as BO003 #line:1D4ED8;back:DBEAFE
    }
  }

  CORE -[hidden]right-> SUPPORTING
}

legend bottom
  Package containment denotes primary subdomain responsibility.
  Conceptual relationships are cataloged in the accompanying document.
endlegend
```

Render with the repository toolchain, for example:

```sh
npm run diagrams:render -- path/to/business-object-landscape.puml path/to/business-object-landscape.svg
```

Run diagram validation and visually inspect the SVG. Reject a rendering with wrong ownership containment, implementation detail, unsupported multiplicities, crossed or ambiguous relationships, unreadable labels, misleading shared objects, or excessive empty space. Correct the `.puml`, regenerate, and inspect again; parser success alone is insufficient.

## Validate and report

Critically compare the completed catalog and landscape with the confirmed synthesis and evidence. Verify definitions, identifiers, primary and participating subdomains, lifecycle, relationships, use-case and rule links, status, and model evolution. Confirm every object has exactly one primary subdomain and no conceptual relationship silently prescribes technical structure.

Run repository documentation and diagram validation when available. If configured tooling is unavailable, do not rebuild, replace, upgrade, or downgrade it; perform feasible manual checks and report skipped validation and impact.

Report changed files, resulting object model and lifecycle status, primary-subdomain assignments, material relationships and contextual representations, alternatives and rejected candidates, boundary findings, cross-artifact handoffs, validation performed, remaining assumptions and open questions, and residual limitations. Do not present a provisional or partial model as exhaustive, accepted, or implementation-ready.
