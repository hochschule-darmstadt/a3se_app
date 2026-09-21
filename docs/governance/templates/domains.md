# Business Domains

- Status: draft
- Owner: Requirements
- Last reviewed: YYYY-MM-DD

Use this template for the authoritative strategic DDD view of the product's problem space. Replace all instructional text and placeholders with evidence-supported content. The artifact defines the current overall domain, subdomain responsibilities and boundaries, strategic classification, and any bounded contexts that are sufficiently justified. Treat a `draft` as a falsifiable current model that may be refined or corrected as later evidence emerges, not as an optimal or final design. The artifact does not define software modules, services, team topology, databases, deployment units, APIs, or implementation technology.

Use stable identifiers for model elements recorded in the authoritative draft: `DOM-NNN` for an independently cataloged overall domain when needed, `SD-NNN` for subdomains, and `BC-NNN` for bounded contexts. Working candidates that have not entered the artifact do not need stable IDs. Preserve an ID when a rename or refinement retains semantic identity. For splits and merges, preserve an existing ID only where semantic continuity is clear; otherwise assign new IDs and retire the predecessors. Record successor relationships and never reuse retired IDs. Traceability must not prevent correction of a defective design.

Classify material statements as facts, assumptions, proposals, decisions, recommendations, or open questions. Link to the Product Vision for product intent and capability coverage, to the glossary for domain meaning, and to the owning artifacts for use cases, business objects, rules, constraints, architecture, and consequential decisions.

## Purpose and model boundary

State what problem-space decision this artifact records, which overall domain it covers, and what remains outside its authority. Identify whether this version is an initial draft, a refinement or correction, or the result of an alignment assessment. Record the accountable authority, lifecycle status, present maturity, known limitations, and next validation needs. Explain any deliberate deferral of bounded-context analysis.

Confirmation of a draft means that it accurately represents the current understanding. It does not assert that the decomposition is complete, optimal, accepted, or closed to later correction.

## How to read this model

Briefly define the notation and visual conventions actually used. Distinguish overall domain, subdomain, bounded context, external domain, and unresolved candidate. Explain the visual treatment of Core, Supporting, and Generic subdomains and of provisional or unresolved elements, if any. State explicitly that graphical containment and relationships do not imply software containment, runtime calls, storage, transactions, deployment, or team ownership.

## Domain landscape

Unless the repository or user requires another notation, create the overview as a PlantUML UML package diagram. Keep its sibling `.puml` source authoritative, render a derived `.svg` locally with the approved diagram tooling, embed the SVG near the beginning of the completed artifact, and link the source directly below it.

Use nested packages for each overall domain, its strategic-classification areas, its recorded subdomains, unresolved boundary candidates, and adjacent external domains or ecosystems. Give every cataloged overall domain and subdomain a two-line package title with its stable identifier on the first line and its complete name on the second. The diagram must show every recorded subdomain with its strategic classification and all material external domains. An early draft may also show a material unresolved candidate when it is visually distinguished from recorded subdomains and does not receive a misleading stable ID. Show bounded contexts only when their model boundaries are justified, and visually distinguish them from subdomains.

Use the approved strategic-DDD notation for a semantic Context Map when one is warranted. Keep every diagram source authoritative and every rendered SVG derived. Every element and semantic relationship in the diagram must be explained below; layout-only PlantUML constraints are not domain relationships.

Follow the diagram with a short prose synthesis of its most important boundary and classification decisions. Do not duplicate the complete catalog.

## Overall domain

### Domain statement

Describe the business problem space and intended business outcome in domain language. Do not define it by the product name, delivery channel, current implementation, or proposed architecture.

### Included scope

- Summarize the included parts of the problem space and link their Product Vision authority.

### External boundary and exclusions

- Identify adjacent or external domains and explicitly excluded responsibilities. Link formal product-scope exclusions to their authoritative entries instead of duplicating them.

### Evidence and authority

Identify supporting Product Vision statements, source evidence, accountable experts, decisions, and lifecycle status.

## Subdomain catalog

Include every confirmed or proposed subdomain shown in the Domain Landscape. Classification expresses strategic differentiation, not importance, compliance criticality, complexity, or implementation cost.

| ID | Subdomain | Classification | Business purpose | Information or decision authority | Status |
|---|---|---|---|---|---|
| SD-NNN | Name | Core, Supporting, Generic, or explicitly unresolved | Concise outcome | Concise statement of what this subdomain authoritatively decides or maintains | draft, proposed, accepted, or deprecated |

## Subdomains

Repeat the following subsection for every cataloged subdomain. Order the subsections by stable identifier unless an established domain hierarchy makes another order materially clearer.

### SD-NNN: Subdomain name

- **Classification:** Core, Supporting, Generic, or unresolved
- **Purpose:** The distinct business outcome or contribution.
- **Responsibility:** What the subdomain authoritatively decides, governs, or maintains.
- **Included responsibilities:** Cohesive responsibilities that belong here.
- **Explicit exclusions:** Closely related responsibilities owned elsewhere.
- **Key language:** Links to material glossary terms and any context-specific use.
- **Rules and lifecycles:** Links to authoritative rules, invariants, and lifecycles; summarize only what is necessary to explain the boundary.
- **Information authority:** Business information owned here, distinguished from information merely consumed.
- **Neighbors and external dependencies:** Related subdomains or external domains and the business reason for the relationship.
- **Supported scenarios:** Links to authoritative use cases when available, otherwise to clearly identified discovery evidence.
- **Evidence, rationale, and status:** Sources, expert judgment, accountable authority, strategic-classification rationale, and lifecycle state.

Record a local assumption or open question here only when it is necessary to interpret this boundary; otherwise reference the consolidated section below.

## Bounded-context landscape

Include this section only when one or more bounded contexts meet the project's readiness criteria. A bounded context is a consistent model and language boundary, not an inferred software service, module, database, team, or deployment unit.

Embed the rendered Context Map and link its authoritative source. Show stable bounded-context identifiers, their mapping to subdomains, material dependency direction, and only those established DDD Context Mapping patterns whose semantics are supported by evidence. Explain every relationship in the relationship catalog.

If bounded-context analysis is deliberately deferred, state that in **Purpose and model boundary** instead of creating an empty Context Map.

## Bounded-context catalog

Omit this section when no bounded contexts are yet justified.

| ID | Bounded context | Model purpose | Supported subdomain or subdomains | Language scope | Status |
|---|---|---|---|---|---|
| BC-NNN | Name | Concise model responsibility | SD-NNN | Scope in which its ubiquitous language is consistent | draft, proposed, accepted, or deprecated |

## Bounded contexts

Repeat the following subsection for every cataloged bounded context. Omit the entire section when no bounded contexts are yet justified.

### BC-NNN: Bounded-context name

- **Model purpose and responsibility:** What this model represents and decides.
- **Supported subdomains:** Links to the applicable `SD-` entries and explanation of any non-trivial mapping.
- **Ubiquitous language:** Scope, material meanings, and semantic differences from neighboring contexts; link authoritative glossary definitions where applicable.
- **Information authority:** Information and decisions authoritative within this context.
- **Published business facts:** Facts exposed to neighboring contexts at the problem-space level without prescribing an interface mechanism.
- **Required business facts:** Facts consumed from neighboring or external contexts.
- **Explicit boundary:** Responsibilities and meanings deliberately kept outside.
- **Evidence, rationale, and status:** Supporting sources, expert judgment, authority, and lifecycle state.

## Context relationships

Omit this section when no Context Map is present. Record model relationships, not technical calls or data pipelines. Verify dependency direction before naming a Context Mapping pattern.

| Source context | Target context | Direction and DDD relationship | Business meaning exchanged | Boundary rationale and evidence |
|---|---|---|---|---|
| BC-NNN | BC-NNN or external context | Direction plus supported Context Mapping pattern | Stable business fact, request, or outcome | Why the models remain separate and how the relationship was established |

## Boundary validation

Summarize the representative end-to-end scenarios used to challenge the decomposition. Link authoritative use cases when they exist; otherwise link discovery evidence and do not present the scenarios as accepted use-case specifications.

| Scenario or evidence | Participating subdomains or contexts | Ownership and handoff result | Boundary finding |
|---|---|---|---|

Include normal, alternative, error, correction, and boundary behavior proportionately. Record unexplained circular authority, shared ownership, or model leakage as an open question rather than hiding it.

## Strategic classification rationale

Explain the evidence and trade-offs behind material Core, Supporting, and Generic classifications. Distinguish differentiation from operational importance, regulatory criticality, complexity, and cost. Link any consequential sourcing or architecture decision rather than making it here.

## Model evolution

Include this section when the artifact revises a previously recorded landscape. Summarize semantic changes rather than editorial updates. Preserve enough traceability to understand corrections without retaining obsolete elements in the current Domain Landscape.

| Change | Previous IDs | Current IDs | Reason and evidence | Decision or authority |
|---|---|---|---|---|
| Rename, refine, split, merge, move, reclassify, add, or retire | IDs or none | IDs or none | What new understanding exposed and why the current model is better | Link or accountable authority and status |

## Alternatives and rejected decompositions

Record only alternatives that materially improve understanding of the selected boundaries or remain relevant to future review. State the evidence and reason for rejection. Link consequential approved choices to a decision record; do not duplicate its full rationale.

| Alternative | Potential benefit | Reason not selected | Evidence or decision |
|---|---|---|---|

## Assumptions and open questions

Include unresolved matters that materially affect the landscape, classification, bounded-context mapping, or relationships. Every assumption needs a validation condition. Every open question needs an owner and the evidence, authority, or event required to resolve it.

| Type | Statement | Affected IDs | Owner | Validation or resolution condition | Review trigger or date |
|---|---|---|---|---|---|

## Cross-artifact handoffs

List material findings that belong to another authoritative artifact and remain unresolved. Do not use this section as a substitute for applying an already authorized, meaning-preserving consistency repair.

| Owning artifact or workflow | Required change or question | Affected IDs | Owner and resolution condition |
|---|---|---|---|

## Sources and related artifacts

Link directly to the Product Vision, domain glossary, source evidence, actors, use cases, business objects, domain rules, scope exclusions, constraints, applicable decisions, diagram sources, and other artifacts needed to validate this decomposition. Do not duplicate their authoritative content.
