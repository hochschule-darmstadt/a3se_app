---
name: create-software-architecture
description: Collaboratively create, refine, correct, or assess a technology-neutral software architecture covering business-oriented modules, their internal dependency structure, module contracts and coupling, and a justified modular-monolith, service, or hybrid distribution strategy. Use after domain, use-case, business-object, constraint, and quality evidence is sufficient; do not use it to create the logical Entity Model, select technologies, design concrete deployment infrastructure, or implement code.
---

# Create Software Architecture

Develop an evidence-aware solution structure with the user. Translate problem-space authority into three complementary architecture dimensions without treating any transformation as mechanical:

1. vertical business-oriented modules derived from domains, actor goals, business-object lifecycles, and change drivers;
2. a horizontal internal responsibility model and dependency rule inside each module;
3. explicit inter-module contracts, coupling rules, consistency boundaries, and a justified distribution strategy.

Treat the current architecture as a revisable design that later requirements, entity modeling, technology evaluation, prototypes, tests, implementation, or operational evidence may refine or correct. The user's instructions take precedence. Authorization to design software architecture does not authorize requirements changes, detailed entity modeling, technology selection, deployment provisioning, implementation, or unrelated repository changes.

## Preserve artifact authority

- Requirements own product intent, domain meaning, actors, actor goals, business behavior, business objects, constraints, exclusions, and measurable quality outcomes.
- The software-architecture artifact owns logical modules, module responsibilities, internal layer or ring responsibilities, dependency rules, provided interfaces, required ports, adapters, module interactions, static dependencies, consistency boundaries, and the justified distribution strategy.
- The Logical Entity Model owns technology-neutral logical entities, properties, relationships, integrity semantics, and their one owning module. This skill may identify entity-model needs and ownership expectations but must not create the detailed model implicitly.
- Technology decisions own frameworks, languages, database products, messaging products, runtime products, libraries, and tool choices.
- Security Architecture owns security controls, trust boundaries, threat treatment, and security-specific structural decisions. This skill allocates security-relevant responsibilities or ports only as far as requirements and accepted decisions justify them.
- Deployment Architecture owns the concrete mapping to processes, containers, hosts, regions, networks, managed services, and infrastructure.
- Implementation owns source packages, classes, functions, framework configuration, physical schemas, build structure, and executable behavior.
- Decision records own accepted consequential choices and rejected alternatives when repository governance requires a record.

Do not silently modify an owning artifact to make the architecture fit. Apply a secondary-artifact edit only when it is meaning-preserving, necessary for consistency, and within the user's requested scope. Hand material defects or missing authority to the owning workflow.

## Use architecture terms precisely

- **Module:** a solution-space encapsulation boundary with cohesive responsibility, explicit contracts, and protected internals.
- **Layer or ring:** a horizontal responsibility boundary inside a module. It does not override the module as the primary encapsulation boundary.
- **Provided interface:** a capability a module offers to actors, other modules, or external participants.
- **Required port:** a consumer-owned abstraction describing a capability the module needs without depending on a supplying mechanism.
- **Adapter:** a boundary implementation connecting a port or provided interface to another module, external system, device, persistence mechanism, or delivery mechanism.
- **Published business fact:** an established outcome or state exposed without sharing the publisher's internal model.
- **Static dependency:** a source-level dependency between architectural elements; it is distinct from runtime invocation direction.
- **Distribution strategy:** the justified choice to run modules together, separately, or in a hybrid topology without equating a module with a deployment unit.

Do not equate a domain, subdomain, bounded context, business object, navigation area, module, service, process, database, repository, package, team, or deployment unit without evidence and an explicit rationale.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md` and the repository context map.
2. Follow the architecture reading path and read the existing software architecture, the canonical [software-architecture template](../../../docs/governance/templates/software-architecture.md), and the [Modular Software Architecture Workflow](../../../docs/governance/workflows/modular-software-architecture.md).
3. Read the Product Vision, glossary, Domain Landscape and any justified bounded contexts, actor catalog, use-case catalog, detailed use cases in scope, business-object catalog, domain rules, functional and non-functional requirements, constraints, scope exclusions, UX evidence, source evidence needed to interpret uncertainty, and applicable decisions.
4. Read the existing Entity Model, Security Architecture, Deployment Architecture, technology decisions, tests, and implementation only where they supply evidence, establish an accepted constraint, or require alignment.
5. Read artifact-lifecycle, continuous-alignment, notation, diagram-tooling, requirements-language, and definition-of-done guidance.

Record the lifecycle status of material inputs. Draft or proposed requirements may support exploratory architecture, but architecture work must preserve their uncertainty and must not promote them by implication. If product boundaries, domain authority, representative actor goals, or material quality drivers are too incoherent for responsible architecture work, identify the exact prerequisite gap rather than inventing it.

Preserve the established architecture location and compatible structure. In this repository, maintain the authoritative topic document at `docs/architecture/software-architecture/software-architecture.md` and its routing page at `docs/architecture/software-architecture/README.md`.

## Select the operating mode and scope

Determine the mode from the request and current artifacts:

- **Initial architecture:** establish the first reviewable three-dimensional architecture baseline.
- **Refinement or correction:** reopen affected modules, layer responsibilities, contracts, dependencies, consistency boundaries, or distribution choices while preserving unaffected content and stable IDs.
- **Selected-slice elaboration:** derive interactions, contracts, and architecture consequences for named use cases or a coherent slice without pretending the complete system architecture is finished.
- **Alignment assessment:** compare the architecture with current requirements, decisions, Entity Model, technology, deployment, tests, or implementation and report findings without writing unless changes are authorized.
- **Early draft:** when explicitly requested, record a provisional design once its purpose, evidence, alternatives, and limitations are clear enough not to mislead.

State the system, product boundary, use cases or slices, architecture dimensions, artifacts, and decisions in scope. Do not infer scope from artifact status, current implementation, navigation breadth, or delivery priority.

## Establish architecture drivers

Build a visible driver inventory from requirements and decisions. Include only material drivers such as:

- business responsibility and information authority;
- actor goals and cross-boundary behavior;
- business-object identity, lifecycle, and correction behavior;
- security, privacy, safety, compliance, availability, performance, scalability, operability, retention, recovery, and audit scenarios;
- external systems, devices, locality, and trust boundaries;
- browser, endpoint, migration, data-location, certification, or other approved constraints;
- accepted technology or deployment decisions that legitimately constrain the logical architecture.

Classify each consequential statement as fact, assumption, proposal, decision, recommendation, or open question. Do not fabricate a quality target, transaction requirement, service boundary, external actor, or integration mechanism to complete the design.

## Derive vertical modules

Treat each established subdomain as an initial module candidate, then challenge the mapping with use cases, business objects, rules, semantic boundaries, and change drivers. Build a working candidate inventory containing:

- provisional name and kind;
- cohesive responsibility, owned decisions, and owned information;
- originating domains, use cases, business objects, rules, qualities, and constraints;
- explicit non-responsibilities and neighboring owners;
- provided and required capabilities;
- external participants and integration needs;
- plausible split, combination, interaction, orchestration, integration, or resource alternatives;
- expected dependency direction and cycle risk;
- confidence, evidence, and disposition.

A one-to-one subdomain/module mapping is acceptable only when it remains coherent after interaction and lifecycle analysis. Consider deviations when evidence supports them:

- split a subdomain into modules with distinct lifecycles, rules, external dependencies, or change drivers;
- combine candidates only when responsibility, language, lifecycle, and authority are genuinely cohesive;
- introduce an actor-goal-oriented interaction or composition module when a use case spans several authoritative modules without transferring their fact ownership;
- introduce an orchestration module only when it owns a durable coordination lifecycle rather than merely forwarding calls;
- extract an integration or resource module only when a cohesive mechanism or external change driver warrants its own boundary;
- reject generic common, integration, workflow, or utility modules that would accumulate unrelated business behavior.

Assign `MOD-NNN` only when a candidate enters the authoritative architecture. Preserve, split, merge, retire, and never reuse identifiers according to the repository's stable-ID rules.

## Design the internal module architecture

Define a module-first internal responsibility structure. Compare Layered, Onion, Clean, Ports and Adapters, or another suitable model based on the drivers; do not accept an architecture-style label without concrete responsibility and dependency rules.

Unless existing evidence supports another model, evaluate a structure equivalent to:

- **Interaction:** translates actor-facing or system-facing input and output;
- **Application:** orchestrates use cases, logical transactions, provided interfaces, and required ports;
- **Domain:** owns module decisions, invariants, policies, and logical behavior;
- **Adapters:** connect ports and interfaces to mechanisms, other modules, or external participants.

Define which layers or rings may depend on which others, who owns ports and interfaces, where adapters reside, how shared technical utilities are constrained, and how exceptions are justified. Keep the module as the primary boundary; do not organize the system primarily as global technical layers containing every domain.

## Derive interactions, contracts, and dependencies

For every in-scope use case or slice:

1. Trace the actor goal, main behavior, material alternatives, guarantees, and quality concerns across candidate modules and external participants.
2. Create a UML sequence diagram with actors, modules, external systems, and required ports as lifelines.
3. Name messages as domain-oriented operations or published facts rather than transport or framework calls.
4. Derive received operations as candidates for the receiving module's provided interface.
5. Introduce a consumer-owned required port and supplying adapter when a direct dependency would violate the internal dependency rule or couple policy to a mechanism.
6. Record partial failure, retry, idempotency, compensation, and human resolution only when supported by behavior or quality evidence.
7. Revise module boundaries when interaction evidence exposes circular authority, excessive orchestration, hidden ownership, or incoherent dependencies.

Separate runtime direction from static dependency direction. Build a dependency catalog and a UML module view showing modules, internal layers where useful, provided interfaces, required ports, adapters, and static dependencies. Every dependency requires evidence, must obey the declared dependency rule, and must participate in an acyclic graph.

## Establish entity ownership and consistency boundaries

Use business objects and use cases to state which module is expected to own each logical entity family, then hand detailed entity derivation to `create-entities`. Do not equate every `BO-` entry with one entity or define physical persistence here.

For material cross-module behavior, establish only what the evidence supports:

- authoritative source of each fact;
- reference or contract-local representation used by consumers;
- module-local atomicity needs;
- immediate versus eventual cross-module consistency;
- failure visibility and recovery responsibility;
- permitted retry, idempotency, compensation, or human resolution;
- historical meaning consumers must retain when source facts change.

Do not solve uncertainty with shared entity models, cross-module repository access, or an ungoverned shared database schema.

## Assess decoupling and distribution

Define coupling rules before selecting runtime topology. Modules interact only through explicit provided interfaces, required ports, published facts, or interaction/composition contracts. Prohibit access to another module's internal entities, repositories, adapters, or logical storage even if a physical runtime or database is shared.

Evaluate modular monolith, independently deployable services, and hybrid alternatives against evidenced drivers:

- independent scalability or processing profile;
- failure isolation and degradation behavior;
- independent release cadence and contract stability;
- security, privacy, regulatory, or trust boundaries;
- geographic, data-jurisdiction, device, or endpoint locality;
- technology-specific runtime requirements;
- long-lived organizational ownership and operational maturity.

Do not derive a service per module. When distributed drivers are weak or unresolved, prefer a modular-monolith proposal as the lower-complexity baseline while preserving logical boundaries; keep that recommendation visibly provisional unless accepted. When independent deployment is proposed, assess latency, availability, consistency, contract evolution, security, observability, deployment coordination, rollback, support, and data ownership.

The software architecture owns the distribution strategy and permissible extraction boundaries. Hand the concrete mapping to processes, containers, hosts, regions, networks, managed services, and infrastructure to Deployment Architecture. Hand product and mechanism selection to `create-technology`.

## Address cross-cutting concerns proportionately

Allocate cross-cutting responsibilities, ports, or architecture constraints only where requirements and risk justify them. Link security, privacy, audit, observability, availability, performance, retention, recovery, and operability to their owning requirements and architecture artifacts. Do not create a generic module for every concern or silently select a technology.

When an unresolved concern materially changes module, contract, consistency, or distribution choices, retain alternatives and an owned open question instead of forcing apparent completeness.

## Revise continuously and preserve traceability

After material evidence:

1. reconsider modules, responsibilities, exclusions, layers, contracts, dependencies, consistency, and distribution;
2. split, combine, rename, add, reject, extract, or retire candidates as warranted;
3. update affected sequence diagrams, module views, catalogs, and dependency checks;
4. identify impacts on requirements, Entity Model, Technology, Security, Deployment, Test, Operations, and Implementation;
5. explain material revisions before moving to the next unresolved design question.

Preserve unaffected content and identifiers. Do not retain a defective boundary merely to avoid changing an ID, and avoid semantic or stylistic churn when evidence and meaning are unchanged.

## Determine readiness

An early draft is ready when its scope and evidence are clear enough not to mislead, every shown module and distribution choice is visibly proposed or previously accepted, material alternatives and gaps are visible, and the user confirms the snapshot.

A reviewable architecture is ready when, for its declared scope:

- every module has a cohesive responsibility, explicit exclusions, evidence, and stable identity;
- domain, use-case, and business-object coverage is accounted for without a forced one-to-one mapping;
- the internal layer or ring model has concrete responsibilities and a testable dependency rule;
- every in-scope use case has a consistent sequence view and traceable contracts;
- provided interfaces, required ports, adapters, operations, and published facts agree across diagrams and catalogs;
- static dependencies are evidenced, directionally permitted, and acyclic;
- entity ownership expectations and cross-module consistency needs are explicit without designing the Entity Model or persistence;
- distribution strategy is justified by drivers and does not equate modules with services;
- external boundaries and cross-cutting concerns are addressed proportionately;
- requirements uncertainty, assumptions, alternatives, and open questions remain visible and owned;
- no technology, concrete deployment, or implementation choice is presented without authority.

Do not demand system-wide completeness for a selected-slice architecture. Do not propose acceptance while a material gap makes central ownership, dependency direction, consistency, or distribution irresponsible.

## Confirm before writing

Present a concise synthesis of:

- architecture scope and input status;
- material drivers;
- proposed modules and non-one-to-one derivations;
- internal layer or ring model and dependency rule;
- principal interactions, contracts, adapters, and dependency direction;
- entity-ownership and consistency expectations;
- modular-monolith, service, or hybrid recommendation and its drivers;
- external and cross-cutting boundaries;
- material alternatives and rejected structures;
- assumptions, open questions, decisions, and cross-artifact handoffs.

Ask the user to confirm or correct the synthesis before material writes unless they explicitly request an immediate provisional draft. Confirmation means the design reflects current understanding; it does not make a draft accepted, optimal, complete, or implementation-ready.

## Create or update the architecture artifacts

After confirmation, or immediately for an explicitly requested provisional draft:

1. Update the authoritative software architecture using `docs/governance/templates/software-architecture.md` and the repository's established compatible structure.
2. Assign and preserve stable `MOD-NNN` identifiers and record split, merge, rename, extraction, and retirement history where material.
3. Create or update authoritative UML sequence sources and rendered views for every in-scope use case or slice.
4. Create or update the authoritative UML module/dependency source and rendered view. Keep source authoritative and generated images derived.
5. Maintain catalogs for modules, contracts, dependencies, distribution assessments, assumptions, open questions, decisions, and handoffs.
6. Keep a new or materially changed architecture in `draft` unless the accountable architecture authority explicitly assigns another status.
7. Record consequential accepted choices and rejected alternatives in decision records when required.
8. Link requirements, Entity Model, Technology, Security, Deployment, tests, implementation, and operations rather than duplicating their authority.
9. Apply only authorized, meaning-preserving secondary-artifact repairs. Produce precise handoffs for material changes owned elsewhere.
10. Do not create detailed entities, select technology products, define concrete deployment infrastructure, or implement code unless separately requested.

Use the repository's approved UML and C4 notations and diagram tooling. Render and visually inspect every meaningful diagram. Parser success does not prove that module boundaries, sequence semantics, dependency direction, or visual grouping are correct.

## Validate and report

Critically compare the completed architecture with the confirmed synthesis and authoritative inputs. Verify:

- module and identifier consistency across text and diagrams;
- requirements, use-case, business-object, and quality-driver traceability;
- sequence messages and contract catalogs agree;
- every static dependency has evidence and obeys the dependency rule;
- the module dependency graph is acyclic;
- logical entity ownership agrees with the Entity Model where it exists;
- interaction modules do not absorb source-fact ownership;
- cross-module consistency and failure behavior are not invented or hidden;
- distribution choices are justified and remain distinct from concrete deployment;
- no framework, database, protocol, service, process, container, or implementation structure was selected without authority;
- assumptions, alternatives, limitations, and handoffs remain visible.

Run repository documentation and diagram validation when available. Render and visually inspect architecture views. If configured tooling is unavailable, do not rebuild or replace it as part of this workflow; perform feasible manual checks and report the skipped validation and impact.

Report changed files, lifecycle status, module and boundary changes, internal architecture and dependency rule, contract and interaction coverage, dependency validation, consistency and distribution conclusions, alternatives, decisions, cross-artifact handoffs, validation results, remaining assumptions and open questions, and residual limitations. Do not present a provisional architecture as accepted, complete, deployment-ready, or implementation-ready.
