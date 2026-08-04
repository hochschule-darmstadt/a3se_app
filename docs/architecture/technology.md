# Technology Profile and Evaluation

- Status: accepted
- Owner: Architecture
- Last reviewed: 2026-08-04

## Purpose and decision authority

This document explains the technology profile selected for [task #4](https://github.com/hochschule-darmstadt/a3se_app/issues/4), its architectural application, remaining product choices, and required validation. [DR-0010](../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md) is authoritative for the decision and its revisit triggers.

The accepted [modular software architecture](software-architecture/software-architecture.md) remains authoritative for logical modules, interfaces, layer direction, and acyclic dependencies. Selecting a Python modular monolith as the initial implementation does not permit modules to bypass those boundaries and does not prevent later extraction of deployable services.

## Accepted technology profile

| Concern | Selected direction | Decision boundary |
|---|---|---|
| Web UI | React with TypeScript | Applies to Customer, Staff, and Supplier Interaction. The concrete React framework, rendering mode, and build profile remain open. |
| Backend language | Python | Applies to the modular business backend and initial product-agent orchestration. |
| HTTP adapter | FastAPI | Exposes interaction and integration operations; domain and application logic remain independent of FastAPI. |
| Contracts | Pydantic contract models and explicit domain types | Used at trust, transport, tool, and module boundaries. Runtime-defined property bags remain validated rather than becoming unrestricted dictionaries. |
| Operational data | Neo4j Community Edition proof of concept, retained if no showstopper occurs | The proof of concept is a conditional validation of the selected database, not an invitation to choose a different product without the DR-0010 revisit evidence. |
| Product-agent access | Controlled agent tools backed by provided module operations | No unrestricted database credentials or arbitrary write-query execution for a product agent. |
| Initial application structure | Modular monolith | One initial backend runtime with enforceable logical modules; later extraction remains possible. |
| Generated documents | Storage port with database metadata and opaque references | The filesystem or object-storage product remains undecided pending retention, durability, access, and recovery requirements. |

## Architecture drivers

- [FR-001–FR-004](../requirements/functional-requirements.md): British English, later language extension, web-only interaction, and responsive Customer Interaction.
- [NFR-001–NFR-003](../requirements/non-functional-requirements.md): UI and conversational response-time targets and zero-cost software use.
- [Logical Data Model](data-model/data-model.md): flexible typed properties, semantic validation, recursive structures, and heterogeneous multi-hop graph patterns demonstrated by the concrete object example.
- [Modular Software Architecture](software-architecture/software-architecture.md): explicit module interfaces, acyclic dependencies, and freedom to extract deployment units later.
- [Product-agent integration](automation.md): conversational travel advice, booking assistance, and fulfilment support shall reuse controlled business operations and current authorised data.
- Order and Inventory Management require reliable concurrent state changes and rollback; a graph model does not weaken those transactional needs.

## React and TypeScript

React and TypeScript are selected for all web interaction surfaces. Shared visual components and contract types may be reused, but Customer, Staff, and Supplier Interaction retain separate module responsibilities and authorisation contexts.

The selection does not yet choose React Router, Next.js, or another production framework profile. The React project recommends a framework for new applications and identifies client-only, static, and server-rendered paths. The project must first establish whether the public customer surface needs search-engine discovery or server-side rendering. A thin slice shall also prove responsive behaviour, accessibility, British-English presentation, localisation preparation, validation, error handling, and performance under NFR-001.

Angular and Vue remain rejected alternatives for the current decision. Angular offers more integrated conventions and Vue offers a more progressive framework, but the stakeholder selected React after reviewing those trade-offs. Reopen the UI selection only under the triggers in DR-0010.

## Python modular backend

Python is selected for the business modules and initial product-agent orchestration. This avoids an obligatory language and network boundary between pervasive agent logic and the operations used by ordinary web interactions.

The codebase shall be organised by the modules in the accepted software architecture rather than by horizontal framework folders. Each module shall expose a small application interface and keep its domain logic, persistence adapter, transport adapter, and internals private. Automated architecture checks shall reject:

- dependencies that oppose the accepted layer direction;
- cycles between modules;
- imports of another module's internal packages;
- transport or persistence models exposed as domain interfaces;
- direct access to another module's persistence adapter.

Strict static analysis and tests shall complement Python's runtime flexibility. Python does not remove the need for explicit types around money, time, identifiers, lifecycle states, commands, results, and errors.

## FastAPI and contracts

FastAPI is selected as an HTTP adapter because it uses Python type declarations and Pydantic validation and produces OpenAPI and JSON Schema contracts. HTTP endpoints shall expose use-case and module capabilities, not generic CRUD access to stored nodes.

Pydantic models shall validate external requests, responses, product-agent tool arguments, tool results, and exchanged module representations. Domain types shall express stable business semantics independently of Pydantic and FastAPI where that separation materially protects the model.

Flexible property bags shall use controlled value types and versioned property definitions. Their validators shall enforce applicable entity or relationship types, mandatory and optional keys, data types, established vocabularies such as OTA, IATA, and ICAO, and cross-property constraints such as start before end. “Flexible” does not mean untyped or unvalidated.

## Product-agent integration

Chatbots, booking assistants, and fulfilment assistants may initially run in the same Python application and invoke the same provided module operations as conventional interactions. The agent orchestrator receives purpose-specific tools such as product search, availability checks, draft-order creation, stock reservation, and fulfilment actions. The owning module remains responsible for authorisation, validation, transactions, audit, and business invariants.

An agent shall not receive a general-purpose write query tool. Graph exploration, where justified, shall use a read-only query operation or projection that restricts permitted labels and relationship types, path depth, result size, execution time, actor scope, and returned data. Tool calls and consequential results shall be auditable.

If later evidence justifies an independently scalable or isolated AI component, the controlled tool contracts become its integration boundary. The initial in-process design therefore avoids premature distributed-system cost without making extraction impossible.

No agent framework, model, inference runtime, or external AI provider is selected by DR-0010. Those choices require separate evaluation of functional fit, data protection, latency, availability, evaluation quality, operational control, and cost constraints.

## Neo4j Community Edition

Neo4j Community Edition is selected for the persistence proof of concept because the concrete object example is a property graph rather than merely a set of relational hierarchies. It includes paths such as Order → Order Position → Stock Item → Touristic Product Item → composite Product Item → Supplier Role → Organisation, alongside order-to-traveller-to-person paths and recursive Order, Stock, and Product structures.

Nodes and typed relationships naturally represent this structure; both may carry flexible properties, and Cypher supports heterogeneous and variable-length pattern matching. The database shape remains subordinate to module ownership:

- each Resources module owns its mutations, invariants, labels or relationship types, and persistence adapter;
- other modules use identifiers, representations, projections, or provided operations;
- cross-module paths are exposed through authorised operations rather than unrestricted repositories;
- the database driver and Cypher statements remain persistence-adapter details;
- product agents use controlled tools, not raw database authority.

The Community Edition is suitable only if the project can operate safely within its single-instance and edition-specific constraints. The authoritative showstopper criteria are in [DR-0010](../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md). In particular, any required paid capability fails NFR-003 and reopens the database decision.

The proof of concept shall map the existing logical model and realistic scenarios and shall demonstrate:

1. flexible node and relationship properties with vocabulary and rule validation;
2. recursive and heterogeneous paths from the concrete object example;
3. indexed identifier and property searches;
4. transactional order creation and concurrent stock allocation with rollback;
5. module-owned writes and authorised cross-module reads;
6. bounded read tools and command tools for product agents;
7. backup, restore, upgrade, observability, and least-privilege operation available at EUR 0;
8. NFR-001 and NFR-002 measurements under a defined representative load.

PostgreSQL with Apache AGE is the first fallback comparator because it combines PostgreSQL transactions with an Apache-licensed graph extension and hybrid SQL/Cypher queries. Plain PostgreSQL remains a control candidate. ArangoDB Community Edition is not eligible under its current prohibition of commercial production use. Neo4j Enterprise Edition is not an acceptable fallback while it requires fees for mandatory capabilities.

## Modular monolith and deployment freedom

The initial backend is one modular monolith. Module calls are in-process and shall not be converted into HTTP merely to resemble possible future services. FastAPI serves external interaction and integration boundaries.

This decision does not define containers, processes beyond the initial application boundary, servers, hosting, scaling topology, or recovery topology. Those belong to the later [deployment architecture](../operations/deployment-architecture.md). A module may be extracted only when deployment evidence justifies the additional network, consistency, observability, security, and operational costs.

## Generated-document storage

Itineraries, vouchers, tickets, invoices, and other rendered artifacts shall not be stored as large graph properties. A storage port owned by the responsible module shall support put, retrieve, version, integrity verification, retention, and deletion or hold behaviour. Neo4j stores a stable document identifier, relevant business references, media type, version, integrity hash, lifecycle state, and opaque storage locator.

The implementation may later target a filesystem or object/blob service. Selection requires requirements for volume, retention, immutability, confidentiality, encryption, malware scanning, backup, recovery, and shared access, followed by an NFR-003 review.

## Remaining selection and validation work

1. Select the React framework and rendering profile after confirming public-site discovery and rendering requirements.
2. Select and enforce Python packaging, type-checking, dependency, migration, architecture-test, and supply-chain tooling under NFR-003.
3. Complete the Neo4j proof of concept and record its evidence against every DR-0010 showstopper.
4. Select authentication and authorisation mechanisms, an agent framework if needed, the AI model and inference/provider profile, and generated-document storage through separate evidence-backed decisions.
5. Maintain a licence and edition inventory for every mandatory dependency and operational tool.

## Primary evidence

- [DR-0010: Python-centred modular technology stack](../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md)
- [React: Creating a React App](https://react.dev/learn/creating-a-react-app)
- [FastAPI features](https://fastapi.tiangolo.com/features/)
- [Neo4j editions and capabilities](https://neo4j.com/docs/operations-manual/current/introduction/)
- [Neo4j variable-length paths](https://neo4j.com/docs/cypher-manual/current/patterns/variable-length-paths/)
- [Apache AGE overview](https://age.apache.org/overview/)
- [ArangoDB features and licensing](https://docs.arango.ai/arangodb/stable/features/)
