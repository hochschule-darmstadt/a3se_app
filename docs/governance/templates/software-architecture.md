# Modular Software Architecture

- Status: draft
- Owner: Architecture
- Last reviewed: YYYY-MM-DD

Use this template for the authoritative technology-neutral software architecture. Replace all instructional text and placeholders with evidence-supported content. The artifact defines three complementary solution-space dimensions: vertical business-oriented modules, the horizontal internal architecture and dependency rule within each module, and inter-module decoupling plus distribution strategy.

The artifact does not define the problem domain, detailed logical entities, implementation classes, framework configuration, physical database schemas, concrete processes, containers, hosts, cloud resources, or infrastructure. Link to their authoritative artifacts rather than duplicating them.

Assign stable `MOD-NNN` identifiers only when a module enters the authoritative architecture. Preserve an identifier while the same architectural responsibility continues. On a split or merge, retain an existing identifier only when semantic continuity is clear; otherwise retire it, assign successor identifiers, and never reuse the retired identifier.

Classify consequential statements as facts, assumptions, proposals, decisions, recommendations, or open questions. Record accepted consequential architecture choices in decision records when repository governance requires it. A `draft` architecture may contain explicit proposals without presenting them as accepted decisions.

## Purpose and architecture boundary

State the system and solution boundary, the architecture mode and coverage, the requirements baseline used, and the decisions this artifact owns. Distinguish the three architecture dimensions and identify what remains in the Entity Model, Technology, Security Architecture, Deployment Architecture, Operations, and Implementation.

Record the lifecycle status of material inputs. Draft requirements may support a draft architecture when their uncertainty and impact conditions remain visible; architecture work must not promote or silently redefine them.

## Architecture drivers

List only requirements, constraints, quality scenarios, business boundaries, integration needs, and accepted decisions that materially affect the architecture.

| Driver | Source and status | Architectural consequence | Validation or decision need |
|---|---|---|---|
| Requirement, constraint, quality scenario, or decision | Direct link and lifecycle state | Boundary, dependency, contract, consistency, or distribution implication | Evidence or accountable decision still required |

## Architecture overview

Embed a compact rendered overview when it materially improves understanding and link its authoritative source directly below it. Use UML for logical module and interaction semantics; use C4 only for system, container, component, or deployment views within its intended abstraction. Keep generated images derived and never edit them directly.

Explain how to read module containment, layer placement, ports, interfaces, adapters, dependencies, external systems, and layout-only relationships. A module must not be depicted as a service, process, container, database, or team unless another authoritative decision establishes that mapping.

## Modules

Explain how domain boundaries, business-object lifecycles, use cases, interaction composition, quality drivers, and external change drivers produced the module landscape. A subdomain is an initial module candidate, not a mandatory one-to-one module boundary.

### Module catalog

| ID | Module | Kind | Requirements evidence | Responsibility | Owned information or decisions | Explicit exclusions | Status |
|---|---|---|---|---|---|---|---|
| MOD-NNN | Name | Business, interaction, orchestration, integration, or resource | Direct `SD-`, `UC-`, `BO-`, requirement, constraint, and decision links | Cohesive solution responsibility | What this module authoritatively maintains or decides | Closely related responsibilities owned elsewhere | draft, proposed, accepted, or deprecated |

### Problem-space-to-module derivation

Record one-to-one mappings, splits, combinations, interaction modules without a corresponding subdomain, and extracted integration or resource modules.

| Problem-space source | Solution-space module or modules | Derivation and evidence | Alternative considered |
|---|---|---|---|
| Domain, subdomain, use-case group, or business-object group | MOD-NNN | Why this boundary improves cohesion, authority, change isolation, or dependency direction | Material alternative and disposition |

### Module details

Repeat for each module when the catalog does not provide enough reviewable detail.

#### MOD-NNN: Module name

- **Kind and purpose:** Business outcome or solution responsibility.
- **Requirements evidence:** Direct links to relevant domains, use cases, business objects, rules, qualities, constraints, and decisions.
- **Owned responsibilities:** Behavior, decisions, information, and lifecycle belonging here.
- **Explicit exclusions:** Neighboring responsibilities deliberately kept outside.
- **Provided capabilities:** Actor- or module-relevant capabilities without prescribing a protocol.
- **Required capabilities:** Capabilities expected through consumer-owned ports or published facts.
- **Entity ownership:** Link to module-owned logical entities when the Entity Model exists.
- **External boundaries:** External systems, devices, organizations, or mechanisms relevant to this module.
- **Quality and risk implications:** Material security, privacy, safety, performance, availability, operability, or compliance consequences.
- **Status and validation:** Evidence, uncertainty, review state, and next validation need.

## Internal module architecture

Define the horizontal responsibility structure inside modules. Keep the module as the primary encapsulation boundary and organize layers or rings within it rather than creating product-wide technical layers that mix all business modules.

### Layer or ring model

| Layer or ring | Responsibility | May depend on | Must not own or prescribe |
|---|---|---|---|
| Name | Logical responsibility | Permitted inward dependencies and owned abstractions | Prohibited outward mechanisms or foreign business responsibility |

State the dependency rule precisely. Naming an architecture style such as Layered, Onion, Clean, or Ports and Adapters is not sufficient by itself. Explain where use-case orchestration, domain policy, provided interfaces, required ports, adapters, and interaction translation belong.

### Dependency rule

- State permitted and prohibited dependencies.
- State who owns required ports and provided interfaces.
- State how adapters depend on the contracts they implement.
- State how shared technical utilities are prevented from accumulating business behavior.
- Explain justified exceptions and link their decisions.

### Application and domain boundaries

Explain how application orchestration remains distinct from module-owned domain policy and how cross-module workflows preserve each participant's information and decision authority. Link to the Entity Model rather than defining detailed logical entities here.

## Module interactions and contracts

### Contract catalog

| Owning module | Contract | Kind | Consumers or providers | Operations or facts | Requirement and interaction evidence | Status |
|---|---|---|---|---|---|---|
| MOD-NNN | Domain-oriented name | Provided interface, required port, published business fact, or interaction/composition contract | MOD-NNN or external participant | Concise operation or fact list | Use-case step, guarantee, rule, or quality scenario | draft, proposed, accepted, or deprecated |

Contracts expose the minimum stable business meaning needed at a boundary. They must not expose internal entities, repositories, persistence records, framework types, or database structures.

### Use-case interaction views

Create one UML sequence-diagram source and rendered view for every use case or slice in the declared architecture scope. Use actors, modules, external systems, and required ports as lifelines. Derive operations and dependencies from the interactions rather than inventing interfaces independently.

| Use case or slice | Participating modules and externals | Principal contracts | Diagram source | Rendered view | Findings or limitations |
|---|---|---|---|---|---|
| `UC-NNN` or explicitly named slice | MOD-NNN and external participants | Contract names | Relative source link | Relative image link | Boundary, dependency, consistency, or unresolved finding |

## Dependency model

Record static source dependencies separately from runtime calls. Every direct dependency requires interaction or architectural evidence. Static dependencies must obey the internal dependency rule and form an acyclic graph.

| Source | Target | Static dependency | Runtime interaction | Contract or port | Evidence and rationale |
|---|---|---|---|---|---|
| Layer, adapter, or module | Layer, port, interface, or module | What source code depends on | What happens at runtime | Named contract | Use case, quality driver, or decision |

Embed and link a UML module/dependency view when useful. Show provided interfaces, required ports, adapters, layer placement, and dependency direction without implying deployment topology.

## Entity ownership and consistency

Link every module to the logical entities it owns once the Entity Model exists. Define how other modules use references, contract-local representations, or published facts without importing the owning module's entity model.

State module-local atomicity expectations and, for every material cross-module workflow, identify immediate consistency needs, permitted eventual consistency, partial-failure behavior, retry, idempotency, compensation, and human resolution where supported by requirements. Do not invent these behaviors to complete the template.

## Decoupling and distribution strategy

State the current strategy: modular monolith, independently deployable services, hybrid, or deliberately unresolved. Logical modules must remain meaningful independently of the selected runtime topology.

### Coupling rules

Document rules for internal access, contract use, model sharing, cycles, synchronous and asynchronous interaction, shared libraries, data access, and external adapters.

### Distribution assessment

| Module or cohesive module part | Current runtime disposition | Drivers for or against separation | Consistency and failure implications | Required decision or evidence |
|---|---|---|---|---|
| MOD-NNN or named part | Shared runtime, separate runtime, candidate, or unresolved | Scalability, failure isolation, release cadence, trust boundary, locality, technology need, or ownership | Latency, availability, data, recovery, and operability effects | Linked decision or validation need |

Do not equate a module with a service. Independent deployment requires material evidence and assessment of contract stability, data authority, latency, consistency, security, privacy, observability, deployment, rollback, and operational ownership. Concrete mapping to processes, containers, hosts, regions, and infrastructure belongs to Deployment Architecture.

## External boundaries and integration

| External participant or ecosystem | Owning module boundary | Required or provided capability | Trust, failure, and data concerns | Evidence and unresolved decision |
|---|---|---|---|---|
| External system, device, organization, or environment | MOD-NNN | Technology-neutral responsibility | Relevant quality and risk implications | Actor, use case, requirement, constraint, or decision |

Keep domain ownership inside the responsible module and external mechanisms in adapters or deliberately extracted integration modules. Do not create a generic integration module for unrelated external concerns.

## Cross-cutting architecture concerns

Allocate cross-cutting responsibilities only when requirements justify them. Link to Security Architecture and quality requirements for authorization, privacy, audit, availability, performance, observability, retention, recovery, and operability. Record required ports or architecture responsibilities without selecting technologies or inventing missing requirements.

## Alternatives and consequential decisions

| Concern | Options considered | Current proposal or decision | Rationale and evidence | Decision record or resolution condition |
|---|---|---|---|---|
| Module boundary, layer model, contract direction, consistency, or distribution | Material alternatives | Proposal or accepted choice | Requirements and trade-offs | `DR-NNNN` or accountable next step |

## Assumptions and open questions

| Type | Statement | Affected modules or contracts | Owner | Validation or resolution condition |
|---|---|---|---|---|
| Assumption or open question | Material uncertainty | MOD-NNN, contract, interaction, or architecture view | Accountable role | Evidence, decision, or event required |

## Cross-artifact handoffs

| Owning artifact or workflow | Required clarification or change | Affected identifiers | Owner and resolution condition |
|---|---|---|---|
| Requirements, Entity Model, Technology, Security, Deployment, Test, or Implementation | Exact handoff without redefining the target artifact | IDs and architecture elements | Accountable role and completion evidence |

## Validation evidence

Record diagram rendering and visual inspection, requirement and module coverage, contract-to-sequence agreement, dependency-direction checks, cycle detection, entity-ownership consistency, distribution assessment, link validation, repository validation, skipped checks, and residual risks.

## Sources and related artifacts

Link directly to the Product Vision, glossary, domains, actors, use cases, business objects, cross-cutting requirements, constraints, exclusions, UX evidence, applicable decisions, Entity Model, Security Architecture, Deployment Architecture, architecture workflow, notation guidance, and validation evidence used by the current architecture scope.
