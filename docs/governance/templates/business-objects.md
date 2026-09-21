# Business Objects

- Status: draft
- Owner: Requirements
- Last reviewed: YYYY-MM-DD

Use this template for the authoritative conceptual catalog of coarse business objects in the problem space. Replace all instructional text and placeholders with evidence-supported content. The artifact records business meaning, exactly one primary subdomain, lifecycle responsibility, conceptual relationships, and boundary-validation findings. It does not define database tables, API resources, messages, DTOs, implementation classes, persistence entities, DDD Entities, Value Objects, Aggregates, or software modules.

Use `BO-NNN` identifiers for business objects admitted to the authoritative catalog. Preserve an ID when a rename, clarification, lifecycle refinement, or subdomain remapping retains semantic identity. For splits and merges, preserve an existing ID only where continuity is clear; otherwise assign new IDs and retire the predecessors. Never assign an ID merely to preserve an unresolved noun candidate, and never reuse a retired ID.

Classify material statements as facts, assumptions, proposals, decisions, recommendations, or open questions. Link to the glossary for domain meaning, the Domain Landscape for subdomain authority, use cases for behavioral evidence, and domain rules for normative policies and invariants.

## Purpose and model boundary

State the overall domain, subdomains, use-case or capability slice, and conceptual level covered by this artifact. Identify whether this version is an initial draft, refinement or correction, selected-slice elaboration, or alignment assessment. Record accountable authority, lifecycle status, known gaps, and next validation needs.

Explain which external concepts are referenced but not owned. Confirmation of a draft means that it represents current understanding; it does not make the model exhaustive, optimal, accepted, or implementation-ready.

## How to read this model

Explain that:

- every cataloged business object has exactly one primary subdomain;
- participating subdomains consume, reference, or contribute facts without sharing ownership;
- graphical package containment denotes primary problem-space responsibility, not software or database containment;
- conceptual relationships do not prescribe storage, navigation properties, calls, messages, transactions, or deployment;
- context-specific representations of the same real-world subject may be separate business objects when meaning or lifecycle differs.

## Business-object landscape

Include a PlantUML UML class diagram when the number of objects or relationships makes a graphical overview materially useful. Keep the sibling `.puml` source authoritative, render a derived `.svg` locally with the approved diagram tooling, embed the SVG here, and link the source directly below it. Omit this section when a diagram would add no useful information.

Represent each object as a class with stereotype `<<business object>>` and no implementation attributes or operations. Group objects by their primary subdomain, ordered Core, Supporting, then Generic and by stable ID within each group. Use the established Domain Landscape colors. Show only evidence-supported conceptual relationships; add multiplicity, aggregation, or composition only when its precise business meaning is established.

## Business-object catalog

Keep stable IDs as raw text in the first column. Each row must identify exactly one primary subdomain.

| ID | Business object | Definition | Primary subdomain | Central lifecycle or responsibility | Participating subdomains | Related use cases | Status |
|---|---|---|---|---|---|---|---|
| BO-NNN | Singular domain name | Concise, non-circular business definition | `SD-NNN` | What the primary subdomain authoritatively governs | `SD-NNN` and exchanged facts, or none | `UC-NNN`, as applicable | draft, proposed, accepted, or deprecated |

## Business objects

Repeat the following subsection for every active object. Order objects by stable ID unless a confirmed lifecycle or hierarchy makes another order materially clearer.

### BO-NNN: Business-object name

- **Definition:** A domain-expert definition with material examples or counterexamples where needed.
- **Business purpose:** Why the concept must be distinguished and retained.
- **Primary subdomain:** Exactly one `SD-NNN` and why it owns the central meaning, lifecycle, or decisions.
- **Identity or equality:** Business characteristics that distinguish an instance or value, without designing a technical key.
- **Lifecycle and states:** Business-relevant creation, validity, transitions, corrections, cancellation, supersession, merge, archival, and retirement as applicable.
- **Responsibilities:** What the object represents, protects, or makes decidable in the problem space.
- **Rules and invariants:** Links to authoritative domain rules; summarize only what is necessary to explain the object boundary.
- **Participating subdomains and published facts:** What other subdomains consume or contribute without sharing the object's central model.
- **Conceptual relationships:** Links to related `BO-` entries and the business meaning of each relationship.
- **Supported use cases:** Links to actor goals that create, identify, use, change, correct, or retire the object.
- **Explicit non-responsibilities:** Closely related concepts, documents, views, or context-specific representations deliberately kept outside.
- **Privacy, safety, compliance, retention, and quality considerations:** Link cross-cutting requirements rather than duplicating them.
- **Evidence, authority, and status:** Direct sources, accountable experts, assumptions, and lifecycle state.

## Conceptual relationships

Record only relationships that materially improve understanding. Do not infer them from foreign keys, API references, object navigation, or current schemas.

| Source object | Relationship | Target object | Multiplicity or temporal constraint | Owning meaning and evidence |
|---|---|---|---|---|
| `BO-NNN` | Business-language relationship | `BO-NNN` or external concept | Only when established | Which subdomain defines the relationship and supporting evidence |

## Context-specific representations and published facts

Use this section when several subdomains model related real-world subject matter differently. Do not force a false enterprise-wide canonical object.

| Owning subdomain and object | Neighboring subdomain and representation | Published or required business fact | Semantic distinction and boundary rationale |
|---|---|---|---|

## Behavioral and lifecycle validation

Use representative use cases or clearly labeled discovery scenarios to test creation, identification, state change, correction, rejection, cancellation, supersession, merge, archival, and retirement.

| Use case or evidence | Objects and subdomains | Lifecycle or ownership result | Model finding |
|---|---|---|---|

Include normal, alternative, error, correction, historical, and boundary behavior proportionately. Record ambiguous authority, circular ownership, or inconsistent multiplicity as an open question.

## Model evolution

Include this section when revising a previously recorded model. Summarize semantic changes rather than editorial updates.

| Change | Previous IDs | Current IDs | Reason and evidence | Decision or authority |
|---|---|---|---|---|
| Rename, refine, split, merge, remap, add, or retire | IDs or none | IDs or none | What new understanding exposed | Link or accountable authority and status |

## Retired business objects

Retain deprecated identifiers and never reuse them.

| ID | Former business object | Retirement reason | Successor objects | Status |
|---|---|---|---|---|

## Alternatives and rejected candidates

Record only alternatives that materially improve understanding of object boundaries or remain relevant to future review.

| Candidate or alternative | Potential value | Reason not selected | Evidence or decision |
|---|---|---|---|

## Assumptions and open questions

Every assumption needs a validation condition. Every open question needs an owner and the evidence, authority, or event required to resolve it.

| Type | Statement | Affected IDs or candidates | Owner | Validation or resolution condition | Review trigger or date |
|---|---|---|---|---|---|

## Cross-artifact handoffs

List material findings owned by another artifact or workflow.

| Owning artifact or workflow | Required change or question | Affected IDs or candidates | Owner and resolution condition |
|---|---|---|---|

## Sources and related artifacts

Link directly to the Product Vision, glossary, business domains, actors, use cases, domain rules, cross-cutting requirements, constraints, source evidence, applicable decisions, diagram source, and other artifacts needed to validate the model. Do not duplicate their authoritative content.
