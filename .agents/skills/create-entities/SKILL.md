---
name: create-entities
description: Collaboratively create, refine, correct, or assess a technology-neutral logical entity model, derive entities and value structures from business objects and behavior, assign every entity to exactly one owning software module, and maintain its UML landscape. Use after business objects, representative use cases, and module boundaries are sufficiently established; do not use it for problem-space business-object discovery, database schemas, persistence models, API payloads, implementation classes, or technology selection.
---

# Create Entities

Develop an evidence-aware logical entity model with the user. Translate problem-space Business Objects and behavioral evidence into solution-space entities, value structures, relationships, references, and integrity boundaries without turning the model into a physical or implementation design.

Treat every draft as a revisable design. Later use-case detail, domain rules, architecture changes, migration evidence, technology decisions, tests, or implementation findings may refine or correct it. The user's instructions take precedence. Authorization to model entities does not authorize requirements changes, module redesign, technology selection, database design, API design, deployment work, implementation, or unrelated repository changes.

## Preserve artifact authority

- The Product Vision owns product intent, outcomes, boundaries, principles, and capability areas.
- The glossary owns domain-term meanings and context distinctions.
- Domains and Business Objects own the problem-space decomposition, coarse business meanings, primary subdomain responsibility, and conceptual business lifecycles.
- Use cases and domain rules own actor goals, observable behavior, guarantees, policies, and normative invariants. They provide behavioral evidence for the Entity Model.
- Software Architecture owns logical modules, module responsibilities, dependency rules, contracts, coupling, consistency strategy, and distribution strategy.
- The Logical Entity Model owns technology-neutral entities, value structures, semantic properties, relationships, multiplicities where evidenced, lifecycle implications, integrity boundaries, and exactly one owning software module per entity.
- Security and Privacy Architecture owns access controls, trust boundaries, threat treatment, purpose limitation, retention controls, and security-specific structural decisions.
- Technology decisions own database products, data-access frameworks, serialization technologies, identifier generators, and other product choices.
- Implementation owns classes, packages, tables, columns, keys, collections, documents, nodes, edges, DTOs, messages, schemas, mappings, indexes, and executable behavior.
- Migration owns source-to-target mapping and reconciliation evidence without redefining target entity meaning.

Do not silently change an owning artifact to make an entity proposal fit. Apply a secondary-artifact edit only when it is meaning-preserving, necessary for consistency, and within the user's requested scope. Hand material defects or changes to the owning workflow.

## Use modeling terms precisely

- **Logical entity:** a technology-neutral solution-space concept with business-significant identity and a lifecycle governed by one module.
- **Entity identity:** the business basis by which one occurrence remains distinguishable over time; it is not a designed primary key.
- **Value structure:** a concept defined by its values and semantics rather than independent identity or lifecycle.
- **Owning module:** the one module that defines an entity's authoritative meaning, validates its invariants, and controls its lifecycle changes.
- **Reference:** a stable identification of an entity owned elsewhere without importing or sharing the owning module's internal model.
- **Contract-local representation:** the minimum information shaped for one module interaction without becoming a second authoritative entity model.
- **Snapshot:** historically retained facts whose meaning must not change when the source entity later changes.
- **Relationship entity:** an entity introduced when a relationship has its own identity, properties, lifecycle, correction, or history.
- **Projection or view:** a derived representation composed from authoritative entities; it does not become an entity merely because it is displayed, queried, cached, or persisted.
- **Integrity boundary:** the entity or cohesive group whose invariants and lifecycle changes require coordinated validation. It does not automatically prescribe a DDD Aggregate or database transaction.

Do not equate any of the following without evidence:

- Business Object and logical entity;
- entity and database table, document, graph node, ORM model, API resource, DTO, event, class, record, form, screen, report, or file;
- entity relationship and foreign key, join table, nested document, object reference, API call, or message;
- owning module and service, process, database, schema, package, deployment unit, or team;
- repeated value and independent entity;
- persisted view or cache and source-of-truth entity;
- shared real-world subject and one shared enterprise-wide entity model;
- entity cluster and DDD Aggregate or Aggregate Root.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md` and the repository context map.
2. Follow the architecture and domain-modeling reading paths.
3. Read the Product Vision, glossary, domains and bounded contexts, Business Objects and their conceptual relationships, actor and use-case catalogs, detailed use cases in scope, domain rules, functional and non-functional requirements, constraints, exclusions, source evidence needed to interpret uncertainty, and applicable decisions.
4. Read the current Software Architecture, including module responsibilities, contracts, entity-ownership expectations, consistency boundaries, and unresolved module questions.
5. Read the existing Logical Entity Model and its diagram sources, Security Architecture, migration evidence, tests, technology decisions, and implementation only where they establish accepted constraints, expose alignment needs, or provide evidence that must be reconciled without treating existing code or storage as authoritative.
6. Read the canonical [Logical Entity Model template](../../../docs/governance/templates/entities.md), artifact-lifecycle, continuous-alignment, notation, diagram-tooling, requirements-language, and definition-of-done guidance.

Record the lifecycle status of material inputs. Draft Business Objects and coarse use cases may support a draft Entity Model, but preserve their uncertainty. Do not promote provisional meanings, multiplicities, properties, or invariants by implication.

Preserve the repository's established artifact location and compatible structure. In this repository, maintain the authoritative model at `docs/architecture/entities/entities.md`, its routing page at `docs/architecture/entities/README.md`, and adjacent authoritative UML sources and derived renderings.

## Select the operating mode and scope

Determine the mode from the request and existing artifacts:

- **Initial draft:** establish the first reviewable entity catalog, module ownership model, relationship catalog, and logical landscape.
- **Refinement or correction:** reopen affected entities, value structures, properties, relationships, multiplicities, ownership, integrity boundaries, or alternatives while preserving unaffected content and stable IDs.
- **Selected-slice elaboration:** deepen the entity model needed for named modules, use cases, or a coherent vertical slice without pretending the complete product model is finished.
- **Alignment assessment:** compare the Entity Model with current requirements, Business Objects, Software Architecture, migration, tests, or implementation and report findings without writing unless changes are authorized.
- **Early draft:** when explicitly requested, record a provisional model once its evidence, scope, alternatives, and limitations are clear enough not to mislead.

On every later invocation, load the current entity IDs, ownership, lifecycle status, relationships, alternatives, open questions, and affected neighboring entities before proposing changes. Treat the current model as a baseline, not unquestionable truth.

State the system boundary, modules, use cases or slices, entity concerns, artifacts, and decisions in scope. Do not infer model scope from existing tables, schemas, classes, screens, APIs, reports, or migration files.

## Establish modeling evidence and confidence

Build a visible evidence inventory from:

- Business Object meaning, identity, lifecycle, authority, and conceptual relationships;
- use-case creation, selection, change, correction, cancellation, failure, supersession, merge, and completion behavior;
- success and minimal guarantees;
- domain rules and cross-cutting functional requirements;
- module responsibilities, contracts, consistency boundaries, and information ownership;
- external systems, devices, organizations, and source-of-truth boundaries;
- security, privacy, audit, retention, recovery, concurrency, availability, and migration requirements;
- accepted decisions that legitimately constrain logical semantics.

Classify consequential statements as facts, assumptions, proposals, decisions, recommendations, or open questions. Record confidence or evidence maturity where it changes how the model should be used.

Coarse use cases are not a reason to invent detail or to block every draft. They normally permit candidate entities, preliminary ownership, coarse lifecycle, and selected relationships. They normally do not justify exhaustive properties, exact multiplicities, transition rules, correction semantics, transaction boundaries, snapshots, concurrency behavior, or complete integrity constraints. Make those limitations explicit and target detailed use-case work at the highest-risk gaps.

## Derive candidate entities and value structures

Begin with the Business Objects, but challenge every direct transformation. For each candidate determine:

- singular domain-oriented name and concise purpose;
- originating `BO-*`, use cases, rules, requirements, modules, and decisions;
- business-significant identity and how it persists through change;
- owning module and why that module controls the lifecycle and invariants;
- principal semantic properties needed to express current behavior;
- lifecycle, state transitions, correction, supersession, merge, cancellation, and terminal behavior supported by evidence;
- relationships, temporal constraints, and multiplicities where evidenced;
- cross-module references, contract-local representations, published facts, and snapshot needs;
- privacy, security, audit, retention, recovery, and migration implications;
- alternatives such as value structure, relationship entity, projection, external reference, or no modeled element;
- evidence, confidence, unresolved questions, and disposition.

Treat a candidate as an entity when business behavior needs to distinguish and track individual occurrences over time. Strong signals include independent lifecycle transitions, correction or supersession, stable relationships, authorization over changes, historical references, or invariants tied to identity.

Treat a candidate as a value structure when its meaning is determined by its constituent values, it has no independent lifecycle, and it can be replaced as a whole without losing business meaning. Do not demote a concept to a value merely because its implementation could be embedded.

Introduce a relationship entity only when the relationship carries its own amount, role, validity, status, occurrence, rationale, correction, allocation, or history. Do not create one merely to anticipate a database join table.

Treat composed records, search results, dashboards, longitudinal views, reports, caches, and read models as projections unless they possess independently governed business identity and lifecycle.

Do not model technical sessions, transport envelopes, framework metadata, persistence records, synchronization tokens, or adapter state as logical business entities unless requirements establish enduring business meaning.

## Assign exactly one owning module

Assign every entity to exactly one module: the module that defines its authoritative meaning, validates its invariants, and controls its lifecycle transitions.

If ownership is unclear:

1. test whether the entity combines meanings or lifecycles that should be split;
2. test whether it is actually a reference, snapshot, value structure, projection, or external concept;
3. compare its lifecycle with the responsibilities and exclusions of candidate modules;
4. test whether the Software Architecture has an unresolved or defective module boundary;
5. retain an explicit open question or produce a precise architecture handoff rather than assigning shared ownership.

Cross-module use does not create shared ownership. A consuming module may retain a stable reference, a contract-local representation, an immutable or versioned snapshot, or a published fact when its own behavior requires it. State which semantics apply and what happens when the source changes.

A module may legitimately own no logical business entity when it only composes views, coordinates behavior without a durable lifecycle, or adapts an external mechanism. Do not manufacture entities to populate every module.

## Define semantic properties without designing storage

Record only properties required to identify the entity, explain its behavior, enforce known rules, establish relationships, or preserve required history. Use domain terms and technology-neutral value categories.

For each material property determine only what evidence supports:

- meaning and purpose;
- whether it participates in business identity;
- optionality, repetition, validity, provenance, or historical meaning;
- unit, currency, time semantics, classification system, or anatomical context;
- owning source and whether another module receives a current fact or snapshot;
- applicable privacy, security, retention, or audit concern.

Do not choose SQL types, column lengths, storage formats, generated keys, indexes, inheritance mappings, JSON shapes, graph labels, serialization names, null encodings, or framework annotations. Do not add universal `id`, `createdAt`, `updatedAt`, version, tenant, soft-delete, or audit fields without an evidenced semantic need.

## Model relationships, multiplicities, and time

Name relationships in domain language and specify direction only when it clarifies meaning or authority. Distinguish:

- containment or lifecycle composition;
- association and reference;
- derivation or evidence;
- allocation or participation;
- replacement, supersession, correction, or merge;
- current relationship versus historically applicable relationship;
- internal relationship versus cross-module reference.

Use exact multiplicities only when supported. Mark a multiplicity as proposed or open when scenarios do not establish it. Test normal, exceptional, cancelled, corrected, historical, and partially completed states before fixing cardinality.

Preserve time explicitly where validity, occurrence, ordering, overlap, version, or effective interval changes meaning. Do not convert all temporal behavior into timestamp fields; describe the business semantics first.

## Establish lifecycle and integrity boundaries

Trace representative use cases through entity creation, lookup, transition, validation, correction, cancellation, rejection, supersession, merge, archival, and retirement. For every material change determine:

- which entity and module own the decision;
- which actor, rule, or accepted fact authorizes it;
- preconditions, postconditions, and guarantees;
- invariants that must hold immediately;
- historical facts that must remain stable;
- cross-module outcomes and references affected;
- partial-failure, retry, idempotency, compensation, or human-resolution needs supported by evidence.

Describe integrity boundaries without prematurely declaring DDD Aggregates, repository boundaries, database transactions, event-sourcing models, or distributed protocols. Hand concrete consistency mechanisms to architecture, technology, and implementation after requirements justify them.

## Preserve identifiers and model evolution

Assign stable `ENT-NNN` identifiers only when a candidate enters the authoritative Entity Model.

- Preserve an ID when clarification, property refinement, relationship refinement, or ownership correction retains the same semantic identity.
- On a split, retain the original ID only for the clearly continuous entity and assign new IDs to genuinely new entities; otherwise retire the original and create successors.
- On a merge, retain an existing ID only when one entity clearly continues and absorbs another; otherwise create a successor and retire the predecessors.
- Retire an entity whose meaning no longer exists and never reuse its ID.
- Record material predecessor, successor, split, merge, and ownership history with evidence or decision references.
- Preserve unaffected IDs and content during selected-slice work.

Do not let identifier stability freeze a defective model.

## Reconcile neighboring models

Continuously compare the Entity Model with:

- Business Objects, ensuring every relevant object has an explained entity, value, reference, projection, external concept, or deferred disposition;
- Software Architecture, ensuring every entity has one valid module owner and cross-module references respect boundaries;
- use cases and rules, ensuring modeled identity, lifecycle, properties, relationships, and invariants have behavioral evidence;
- glossary, ensuring terms are used consistently without silently establishing missing domain definitions;
- security and privacy requirements, ensuring sensitive meaning and lifecycle are visible without inventing controls;
- migration evidence, ensuring legacy structures inform mapping questions but do not dictate the target model;
- tests and implementation, identifying drift without treating code or persistence as automatic authority.

When evidence reveals a material contradiction, keep it visible and hand it to the owning workflow. Do not silently rewrite requirements, Business Objects, modules, contracts, or implementation.

## Determine readiness

An early draft is ready when its scope and evidence are clear enough not to mislead, every entity and multiplicity is visibly proposed or previously accepted, ownership is explicit, material alternatives and gaps remain visible, and the user confirms the snapshot.

A reviewable model is ready for its declared scope when:

- relevant Business Objects and behavior are accounted for without a forced one-to-one mapping;
- every entity has a clear purpose, business identity, lifecycle evidence, and exactly one owning module;
- entity, value structure, relationship entity, projection, reference, snapshot, external concept, and deferred candidate distinctions are explicit where material;
- principal semantic properties are sufficient to explain identity, behavior, and integrity without prescribing storage;
- relationships, multiplicities, and temporal constraints are supported or visibly provisional;
- cross-module references preserve source authority and required historical meaning;
- lifecycle and integrity boundaries align with use-case guarantees and architecture consistency rules;
- stable identifiers are unique and evolution remains traceable;
- assumptions, alternatives, limitations, and cross-artifact handoffs are explicit;
- no database, API, framework, technology, deployment, or implementation choice is presented as a logical modeling fact.

Do not demand system-wide completeness for a selected slice. Do not present a coarse-input model as implementation-ready.

## Confirm before writing

Present a concise synthesis of:

- scope, operating mode, and material input status;
- entities to add, retain, refine, rename, split, merge, remap, or retire;
- value structures, relationship entities, projections, references, and deferred candidates;
- owning modules and cross-module semantics;
- identity, principal properties, lifecycle, relationships, multiplicities, and integrity implications;
- material alternatives and rejected structures;
- assumptions, open questions, decisions, evidence limitations, and cross-artifact handoffs.

Ask the user to confirm or correct the synthesis before material writes unless they explicitly request an immediate provisional draft. Confirmation means that the model reflects current understanding; it does not make it accepted, exhaustive, or implementation-ready.

## Create or update the Entity Model

After confirmation, or immediately for an explicitly requested provisional draft:

1. Update the authoritative Logical Entity Model at the established repository location.
2. Use the canonical [Logical Entity Model template](../../../docs/governance/templates/entities.md) while preserving compatible established structure. Include purpose and boundary, principles, modeling evidence, entity landscape, catalog by owning module, Business Object derivation, value structures and references, relationship catalog, lifecycle and integrity boundaries, module coverage, model evolution, alternatives, assumptions and open questions, handoffs, validation, and sources.
3. Assign and preserve stable `ENT-NNN` identifiers and record material model evolution.
4. Give each entity exactly one owning module and explicitly record modules that own no entity when that finding is material.
5. Create or update an authoritative UML class-diagram source and derived rendering when a visual landscape materially improves review.
6. Keep a new or materially changed model in `draft` unless the accountable architecture authority explicitly assigns another status.
7. Link Business Objects, use cases, rules, modules, contracts, requirements, constraints, decisions, security, migration, tests, and implementation rather than duplicating their authority.
8. Apply only authorized, meaning-preserving secondary-artifact repairs. Produce precise handoffs for material changes owned elsewhere.
9. Do not create physical schemas, database migrations, persistence mappings, API payloads, message schemas, implementation classes, services, or technology decisions unless separately requested.

## Maintain a readable UML entity landscape

Use a UML class diagram for logical entity ownership and selected relationships when the model benefits from a visual overview. Keep an authoritative sibling `.puml` source, render it locally to SVG, embed the SVG near the beginning of the model, and link the source directly below it. Never edit generated SVG manually.

- Represent each logical entity as a UML class labeled with raw `ENT-NNN` and its complete singular name.
- Group entities inside packages labeled with their owning `MOD-NNN` and module name.
- Show module containment and selected lifecycle-significant relationships. Keep comprehensive properties, evidence, alternatives, and cross-module reference semantics in the Markdown catalog.
- Use UML composition, aggregation, association, dependency, and multiplicity deliberately. Do not use composition merely because one table might contain another key.
- Use dotted dependencies for selected cross-module references or derived facts and state that they do not imply shared ownership.
- Omit repetitive customer, supplier, or external references when showing all of them would obscure the landscape; catalog them in text.
- Identify modules with no entities in the accompanying artifact or legend rather than adding artificial classes.
- Split dense diagrams into coherent module or use-case views rather than shrinking labels or drawing an unreadable network.
- Use repository notation and diagram-tooling standards, render locally, and visually inspect ownership containment, identifiers, relationships, multiplicities, labels, contrast, spacing, and readability.

## Validate and report

Critically compare the completed model with the confirmed synthesis and authoritative evidence. Verify:

- every defined `ENT-*` identifier is unique and agrees across catalog and diagrams;
- every entity has exactly one owning module;
- relevant Business Objects and in-scope use cases are accounted for;
- entity versus value, reference, projection, relationship entity, snapshot, and external-concept choices are justified;
- semantic properties do not contain accidental physical or framework design;
- relationships and multiplicities are evidenced or visibly provisional;
- cross-module references do not create shared ownership or direct foreign-model mutation;
- lifecycle and integrity statements do not invent unsupported behavior;
- corrections, supersession, merge, historical meaning, and partial failure remain visible where relevant;
- module assignments agree with Software Architecture;
- links resolve and diagrams render and remain visually legible;
- lifecycle status, assumptions, alternatives, open questions, and handoffs are accurate.

Run repository documentation, diagram, and model validation when available. If configured tooling is unavailable or unrelated checks fail, do not rebuild or replace it as part of this workflow; perform feasible focused checks and report the skipped validation and impact.

Report changed files, lifecycle status, entity additions and evolution, owning-module assignments, value and reference decisions, material relationships and integrity findings, diagram status, cross-artifact handoffs, validation results, remaining assumptions and open questions, and residual limitations. Do not present a provisional model as accepted, exhaustive, database-ready, or implementation-ready.
