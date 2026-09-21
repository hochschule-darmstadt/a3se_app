# Logical Entity Model

- Status: draft
- Owner: Architecture
- Last reviewed: YYYY-MM-DD

Use this template for the authoritative technology-neutral Logical Entity Model. Replace all instructional text and placeholders with evidence-supported content. The artifact derives logical entities, value structures, relationships, references, snapshots, and integrity boundaries from Business Objects, behavior, and the Software Architecture, and assigns every entity to exactly one owning module.

The artifact does not define problem-space Business Objects, database tables, columns, keys, schemas, documents, graph structures, persistence models, API payloads, messages, implementation classes, frameworks, database products, or deployment topology. Link to their authoritative artifacts rather than duplicating them.

Assign stable `ENT-NNN` identifiers only when an entity enters the authoritative model. Preserve an identifier while the same semantic identity continues. On a split or merge, retain an existing identifier only when semantic continuity is clear; otherwise retire it, assign successor identifiers, and never reuse the retired identifier.

Classify consequential statements as facts, assumptions, proposals, decisions, recommendations, or open questions. A `draft` model may contain explicit proposals without presenting them as accepted requirements or implementation decisions.

## Purpose and model boundary

State the system and solution boundary, the modeling mode and coverage, the requirements and architecture baseline used, and the decisions this artifact owns. Identify the modules, use cases, or vertical slices covered and distinguish what remains authoritative in Business Objects, use cases, domain rules, Software Architecture, Security and Privacy Architecture, Technology, Migration, and Implementation.

Record the lifecycle status of material inputs. Draft Business Objects and coarse use cases may support a draft Entity Model when their uncertainty and impact conditions remain visible; they must not be promoted into exact properties, multiplicities, invariants, or transaction boundaries by implication.

## Modeling principles

Record the rules that govern entity identity, value structures, ownership, references, historical meaning, and implementation independence. At minimum, establish that:

- every entity has exactly one owning module;
- cross-module use does not create shared ownership;
- Business Objects are evidence rather than mandatory one-to-one entity definitions;
- logical identity is described in business terms rather than as a technical key;
- value structures have no independently governed identity or lifecycle in the current model;
- projections and views do not become source entities merely because they are materialized;
- physical storage and implementation remain undecided.

## Modeling evidence and confidence

List only Business Objects, use cases, rules, requirements, architecture boundaries, decisions, migration evidence, or external authorities that materially shape the model.

| Evidence or driver | Source and lifecycle status | Entity-model consequence | Confidence or validation need |
|---|---|---|---|
| Business Object, use case, rule, module, requirement, constraint, or decision | Direct link and status | Identity, ownership, property, relationship, history, or integrity implication | Confidence and evidence still required |

## Entity landscape

Embed a compact rendered UML class diagram when it materially improves review and link its authoritative PlantUML source directly below it. Group entities by owning `MOD-NNN` module and show only selected lifecycle-significant relationships. Keep comprehensive properties, evidence, alternatives, and repetitive cross-module references in the catalogs.

Explain how to read module containment, solid entity relationships, dotted cross-module references or derived facts, multiplicities, and omitted repetitive references. Identify modules that currently own no logical entity rather than inventing entities to populate them.

## Entity catalog

Organize the catalog by owning module. Every entity appears under exactly one module and carries a stable `ENT-NNN` identifier.

### MOD-NNN: Module name

| ID | Entity | Requirements origin | Business identity | Principal semantic properties | Lifecycle and integrity responsibility | Status |
|---|---|---|---|---|---|---|
| `ENT-NNN` | Singular domain-oriented name | Direct `BO-`, `UC-`, rule, requirement, module, and decision links | Business basis by which one occurrence remains distinguishable over time | Technology-neutral properties needed for identity, behavior, relationships, or history | Creation, transition, correction, supersession, merge, cancellation, and terminal responsibility supported by evidence | draft, proposed, accepted, or deprecated |

When a module owns no entity, state why. Valid reasons may include composing views, coordinating behavior without a durable lifecycle, or adapting an external mechanism. Do not add a technical session, message, cache, transport envelope, or adapter-state entity merely to complete module coverage.

### Detailed entity specification

Use a detailed subsection only when the catalog row cannot carry the semantics needed for review.

#### ENT-NNN: Entity name

- **Purpose and meaning:** Why the entity exists and what it represents.
- **Requirements evidence:** Direct links to Business Objects, use cases, rules, requirements, and decisions.
- **Owning module:** Exactly one `MOD-NNN` with ownership rationale.
- **Business identity:** Identity in domain terms without selecting a technical key.
- **Principal properties:** Property meanings, optionality, repetition, units, provenance, validity, and history only where evidenced.
- **Lifecycle:** Creation, states, transition authority, correction, cancellation, supersession, merge, and terminal behavior.
- **Invariants and guarantees:** Normative rules or use-case guarantees linked to their authoritative source.
- **Relationships:** Internal associations, containment, evidence, derivation, participation, and temporal constraints.
- **Cross-module semantics:** References, current facts, published facts, contract-local representations, or snapshots used by other modules.
- **Explicit exclusions:** Neighboring entities, value structures, projections, external concepts, and implementation concerns deliberately kept outside.
- **Quality and risk implications:** Material privacy, security, safety, audit, retention, recovery, concurrency, or migration concerns.
- **Status and validation:** Confidence, alternatives, unresolved questions, and evidence required next.

## Business-object derivation

Account for every Business Object relevant to the declared scope without assuming a one-to-one transformation.

| Business-object source | Entity, value, reference, projection, external concept, or deferred result | Derivation and evidence | Alternative considered |
|---|---|---|---|
| `BO-NNN` or coherent relationship | `ENT-NNN`, named value structure, reference, projection, external concept, or deferred candidate | Why identity, lifecycle, relationship meaning, composition, or absence justifies the result | Material alternative and disposition |

Explain additional entities not corresponding directly to one Business Object. Typical justifications include an independently governed identifier, a relationship with its own lifecycle or properties, or a constituent occurrence that requires distinct identity and history.

## Value structures and references

Catalog concepts that are intentionally not independent entities.

| Concept | Current treatment | Used by | Semantics and open boundary |
|---|---|---|---|
| Domain-oriented name | Value structure, reference, snapshot, projection, or external concept | `ENT-*`, `MOD-*`, or contract | Meaning, source authority, validity, historical behavior, and evidence that would trigger reconsideration |

Do not reduce a concept to a value merely because an implementation could embed it. Do not promote every repeated value, coded term, address, timestamp, or external identifier into an entity without independently governed identity or lifecycle.

## Relationship catalog

Name relationships in domain language. Mark exact multiplicities and temporal constraints as proposed or open unless normal, exceptional, corrected, cancelled, and historical scenarios establish them.

### Relationships within owning modules

| Source | Relationship | Target | Multiplicity or temporal rule | Integrity owner | Evidence and status |
|---|---|---|---|---|---|
| `ENT-NNN` | Domain relationship | `ENT-NNN` | Exact, proposed, or open constraint | `MOD-NNN` | Use case, rule, Business Object, or decision |

### Cross-module references and derived facts

| Owning entity or fact | Referencing entity or module | Boundary semantics | Current fact or snapshot | Evidence and unresolved behavior |
|---|---|---|---|---|
| `ENT-NNN` or named fact | `ENT-NNN` or `MOD-NNN` | What the consumer may rely on without sharing ownership | Lookup, published fact, contract-local representation, immutable or versioned snapshot | Source, freshness, correction, merge, failure, and history evidence |

Cross-module references must preserve source authority. A shared runtime or physical data store does not authorize another module to import, mutate, or expose the owning module's internal entity model.

## Lifecycle and integrity boundaries

Describe the entity changes and cohesive integrity boundaries supported by current behavior. For material transitions record:

- owning entity and module;
- actor, rule, or fact authorizing the transition;
- preconditions, postconditions, and guarantees;
- invariants requiring immediate validation;
- historical facts that must remain stable;
- cross-module outcomes and affected references;
- evidenced retry, idempotency, compensation, recovery, or human-resolution needs.

Do not equate an integrity boundary with a DDD Aggregate, repository, database transaction, event-sourcing stream, or distributed transaction unless a separately authorized design establishes that mapping.

## Entity coverage by module

| Module | Owned entities | Coverage conclusion | Remaining question or handoff |
|---|---|---|---|
| `MOD-NNN` Module name | `ENT-NNN` entries or None | Which module responsibilities and lifecycles are covered, or why no entity is owned | Missing behavior, boundary question, or validation need |

## Model evolution

Record material renames, splits, merges, ownership corrections, and retirements. Preserve unaffected identifiers and never reuse a retired `ENT-NNN`.

| Entity ID | Change | Predecessor or successor | Rationale and evidence | Status |
|---|---|---|---|---|
| `ENT-NNN` | Added, renamed, split, merged, remapped, or retired | Related `ENT-*` identifiers | Meaning-preserving rationale or consequential decision | draft, proposed, accepted, or deprecated |

## Alternatives and unresolved modeling boundaries

| Concern | Current proposal | Alternative or unresolved question | Resolution evidence needed |
|---|---|---|---|
| Entity boundary, value treatment, relationship entity, projection, ownership, multiplicity, or history | Current model | Material alternative | Detailed scenario, rule, quality evidence, migration finding, or decision |

## Assumptions and open questions

| Type | Statement | Affected entities or modules | Owner | Resolution condition |
|---|---|---|---|---|
| Assumption or open question | Material uncertainty | `ENT-*` and `MOD-*` identifiers | Accountable role | Evidence, decision, or event required |

## Cross-artifact handoffs

| Owning artifact or workflow | Required clarification or alignment | Affected model elements | Owner and resolution condition |
|---|---|---|---|
| Glossary, Business Objects, use cases, rules, Software Architecture, Security, Technology, Migration, Test, or Implementation | Exact handoff without redefining the target artifact | `ENT-*`, `MOD-*`, `BO-*`, `UC-*`, or relationships | Accountable role and completion evidence |

## Validation status

Record:

- `ENT-*` uniqueness and agreement between catalog and diagrams;
- exactly one owning module per entity;
- Business Object and in-scope use-case coverage;
- justified entity, value, relationship entity, reference, snapshot, projection, external-concept, and deferred decisions;
- relationship, multiplicity, temporal, lifecycle, and integrity evidence;
- cross-module authority and historical-meaning checks;
- diagram rendering and visual inspection;
- link and repository validation;
- skipped checks, evidence limitations, and residual risks.

## Sources and related artifacts

Link directly to the Product Vision, glossary, domains, actors, use cases, domain rules, Business Objects, functional and non-functional requirements, constraints, exclusions, source evidence, Software Architecture, Security Architecture, migration evidence, decisions, notation guidance, diagram tooling, tests, and implementation evidence used by the declared model scope.
