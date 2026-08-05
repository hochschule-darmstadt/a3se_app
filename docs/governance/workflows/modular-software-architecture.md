# Modular Software Architecture Workflow

- Status: accepted
- Owner: Architecture
- Last reviewed: 2026-08-05

This workflow derives a technology-neutral modular software architecture from domain boundaries and behavioral requirements. It defines logical code and contract structure, not processes, containers, servers, infrastructure, or runtime placement. The outcome must leave room for a modular monolith, independently deployable services, and hybrid deployment.

## Inputs and authority

Use the following inputs in order:

1. the business domain model;
2. business objects and use cases assigned to those domains;
3. cross-cutting functional and non-functional requirements, constraints, exclusions, glossary, and accepted decisions;
4. existing architecture and validation evidence.

Record each input's status. Proposed or draft requirements may support exploratory or even accepted architecture when the accountable architecture authority explicitly accepts the stability risk, but this never promotes those requirements. State the assumption and require impact analysis when the input changes.

## Procedure

1. Treat each domain as an initial module candidate. A domain is a problem-space boundary; a module is a solution-space encapsulation boundary. Do not silently equate them or preclude later splits, combinations, actor-facing interaction modules, or extracted resource modules.
2. Iterate through every in-scope use case. Create one UML sequence diagram per use case with actors, module candidates, and required ports as lifelines. Give each operation a concise domain-oriented name and collect received operations as candidates for the receiving module's provided interface.
3. Distinguish runtime calls from static source dependencies. For a normal module call, the caller depends on the receiver's provided interface. If that direction would violate the layer rule or couple business logic to an interaction mechanism, define a required port in the consuming business module and implement it with an adapter in the supplying module. The adapter statically depends on the consumer-owned port; a runtime invocation through the port does not reverse that dependency.
4. Create a UML class diagram organized as enterprise, layers, and module packages. Show each module's provided interfaces, required ports, and adapters. Include operations while the diagram remains readable; move long operation lists to an adjacent authoritative catalog and link them rather than omitting the contracts.
5. Derive package dependencies from direct module calls and adapter-to-port realizations. Dependencies may stay within a layer or point downward through the declared layer order; they must not point upward and must form an acyclic graph.
6. If a cycle or upward dependency appears, first verify that the sequence and dependency derivation are correct. Then refactor responsibility, introduce a consumer-owned port, or revise a misplaced module boundary. Escalate to the architecture authority when alternatives change business ownership or bounded-context meaning.
7. Keep the result independent of deployment topology. Do not infer services, containers, processes, databases, protocols, or infrastructure from module packages unless separately authorized by a recorded decision.
8. Refine and optimize iteratively. Revisit candidate boundaries after the sequence interactions, shared information responsibilities, dependency graph, and concrete object usage are visible. Split, combine, rename, retain interaction modules without corresponding business domains, or extract resource modules when this improves cohesion, ownership, reuse, or dependency direction; then regenerate every affected sequence, interface catalog, model, and validation result. Preserve traceability to the originating domains and record consequential refinements rather than treating the first mapping as final.

## Required artifacts

- one authoritative modular software architecture document;
- a UML sequence-diagram source and generated image for every in-scope use case;
- a UML module overview source and generated image, using the repository's supported diagram tooling;
- a catalog of module IDs, provided interfaces, required ports, adapters, operations, and use-case evidence;
- explicit limitations, assumptions, and unresolved review findings;
- automated validation where practical.

When supporting assets cause the topic to grow into a directory, follow the [topic growth strategy](../../README.md#topic-growth-strategy): the routing `README.md` points to the same-named authoritative document, which embeds the generated diagrams.

## Validation and acceptance

Before proposing or accepting the architecture:

- every in-scope use case has a sequence diagram and traceable module operations;
- diagram messages and interface catalogs agree;
- every direct dependency has sequence evidence;
- every adapter realizes a declared consumer-owned required port;
- no dependency points upward through the layer hierarchy;
- the dependency graph is acyclic;
- excluded bounded-context implementations remain external contracts where interfaces are in scope;
- deployment choices and technology selections have not been introduced without authority;
- generated diagrams are current, links resolve, and harness validation passes;
- material limitations and the status of requirements used as inputs are explicit.

Architecture acceptance approves the structural design, not the status of its input requirements. Later requirement changes must be assessed against module responsibilities, interfaces, sequence diagrams, dependency direction, and deployment freedom. Update affected artifacts together under [Continuous Specification Alignment](continuous-spec-alignment.md).
