# Technology Evaluation

- Status: proposed
- Owner: Architecture
- Last reviewed: 2026-08-03

## Purpose and decision state

This document evaluates the core implementation technologies for [task #4](https://github.com/hochschule-darmstadt/a3se_app/issues/4). It distinguishes stakeholder preferences from selections: the stack below is proposed, but no product is selected until an accepted decision record resolves the open evidence and trade-offs.

The accepted [modular software architecture](software-architecture/software-architecture.md) remains authoritative. Technology choices shall preserve module ownership and acyclic dependencies and shall not determine whether modules are deployed as a modular monolith, independent services, or a hybrid. Deployment topology and concrete hosting products belong to the later [deployment architecture](../operations/deployment-architecture.md).

## Architecture drivers

- [FR-001–FR-004](../requirements/functional-requirements.md): British English, language extensibility, web interfaces, and responsive Customer Interaction.
- [NFR-001–NFR-003](../requirements/non-functional-requirements.md): accepted interactive and conversational response-time targets and zero-cost software-use constraint.
- [SE-001](../requirements/scope-exclusions.md): only interfaces to Accounting, Reporting, and Human Resources are in implementation scope.
- [Logical Data Model](data-model/data-model.md): connected business objects, recursive structures, flexible typed properties, semantic property contracts, and singular module ownership.
- [Modular Software Architecture](software-architecture/software-architecture.md): logical module interfaces must remain independent of process and storage placement.
- Stakeholder preference, 2026-08-03: prioritize implementation speed, maintainability, and strong AI-library integration; use a modern web UI; represent connected travel structures and flexible properties naturally; store generated documents outside the operational graph.

The following evidence is still missing and prevents a final database or hosting decision: expected data volume and growth, peak concurrency, representative query shapes and traversal depths, consistency and transaction boundaries, availability and recovery targets, retention and immutability rules for business documents, and hosting constraints. Expected scale is also required to prove that every selected software edition remains free of charge under NFR-003.

## Proposed technology profile

| Concern | Proposed direction | State | Rationale and boundary |
|---|---|---|---|
| Web UI | React with TypeScript, within a production React framework | proposed | Component reuse and a mature web ecosystem fit the three interaction surfaces. React is a UI library rather than the complete framework decision. React Router framework mode and Next.js remain candidates until routing, server rendering, public discoverability, and hosting needs are known. |
| Server language | Python | proposed | Optimizes for development speed and access to AI, data-processing, and orchestration libraries. Performance shall be verified against NFR-001 and NFR-002 with representative workloads; CPU-bound or independently scalable AI work may be isolated behind a module interface without changing the language choice for the main backend. |
| HTTP API | FastAPI with Pydantic models and OpenAPI contracts | proposed | Fits typed Python, asynchronous I/O, request/response validation, OpenAPI, JSON Schema, security schemes, and generated client possibilities. HTTP endpoints shall expose module capabilities, not persistence models. Internal calls in a modular monolith need not be HTTP calls. |
| Operational business data | One graph-capable, schema-flexible database product, evaluated per module-owned data boundary | proposed | The logical model benefits from graph traversal and flexible key/value properties. “Schema-flexible” shall not mean unvalidated: owning modules enforce the semantic property contracts, and database constraints/indexes supplement rather than replace them. |
| Generated documents | Blob/object-storage abstraction with database metadata and references | proposed | Itineraries, vouchers, tickets, and invoices are derived artifacts, not graph payloads. The database stores a stable document identifier, business-object reference, media type, version, integrity hash, lifecycle state, and opaque storage locator. A local filesystem implementation is suitable only where the deployment architecture establishes adequate durability, backup, access control, and shared access. |

## Web UI evaluation

The React project recommends using a framework for new production applications and lists both Next.js and React Router as supported choices. The present requirements justify React and TypeScript, but do not yet justify server-side rendering or a Node.js UI server.

| Candidate | Strengths for this system | Costs and risks | Assessment |
|---|---|---|---|
| React Router framework mode | Standards-oriented routing and data loading; can support client rendering and preserve a clear FastAPI backend boundary | Smaller set of integrated full-stack conventions; the team must choose more supporting libraries | Preferred if the application is primarily an authenticated business SPA |
| Next.js | Integrated routing, rendering, streaming, and server-rendering options; strong public-site capabilities | Adds a Node.js server/runtime model when dynamic server rendering is used and may duplicate backend responsibilities unless boundaries are disciplined | Preferred only if public discoverability, server rendering, or route-level rendering requirements justify it |
| React assembled directly with a build tool | Maximum frontend/backend separation and a small runtime footprint | The team must assemble routing, data loading, error handling, and production conventions; official React guidance prefers a framework | Retain only if a framework proof of concept shows unnecessary complexity |

Proposed decision: select React with TypeScript now, but resolve React Router versus Next.js after documenting public-site and rendering requirements. Responsive behavior and accessibility remain acceptance concerns, not framework properties.

## Python and FastAPI evaluation

Python is widely suitable for business APIs when its operational profile matches the workload; language-level performance alone is not a reason to reject it. FastAPI provides an asynchronous ASGI path for I/O-heavy APIs, but no framework removes database latency, inefficient graph queries, CPU-bound work, or external AI-provider latency.

| Candidate | Strengths | Costs and risks | Assessment |
|---|---|---|---|
| Python + FastAPI | Strong AI ecosystem; concise typed APIs; Pydantic validation; OpenAPI and JSON Schema; asynchronous I/O | Dynamic-language errors require strict typing and tests; CPU-bound work needs measurement and possibly separate workers; synchronous drivers can block request execution | Recommended |
| Python + Django | Mature integrated business framework, administration, authentication, and ORM ecosystem | Relational ORM focus is less aligned with the proposed graph/document persistence; more framework surface than the API-first architecture currently needs | Viable alternative if integrated administration becomes a major driver |
| TypeScript + a Node.js API framework | One language across UI and server; mature asynchronous ecosystem | Weaker fit with the stated Python/AI preference and duplicates the reason for selecting Python | Rejected as the default, not prohibited for a separately justified component |

Proposed decision: Python and FastAPI form the default backend/API stack. Module domain logic shall remain independent of FastAPI, Pydantic transport models, database drivers, and AI-provider SDKs through adapters at module boundaries.

## Operational database evaluation

The target is a property-rich graph with flexible JSON-like values, keyed lookup, transactions, indexes, constraints, a viable Python integration, and acceptable operations and licensing. A database being “schema-free” is not sufficient evidence: the system still requires versioned type catalogs, validators, vocabulary rules, migrations, indexes, and measurable query performance.

| Criterion | Weight | ArangoDB | Neo4j | Evidence needed before acceptance |
|---|---:|---|---|---|
| Fit to graph plus document/key-value model | 25 | Native document, key/value, and graph models under one query language | Native property graph with key/value properties, but not a general document database | Map representative entities and queries in a proof of concept |
| Graph traversal and query expressiveness | 20 | AQL supports document queries, joins, and traversals | Cypher and native property-graph traversal are core strengths | Benchmark itinerary, composition, availability, and order traversals |
| Validation and flexible properties | 10 | Flexible JSON documents with optional JSON Schema validation | Flexible node/relationship properties with indexes and constraints | Demonstrate the semantic property contracts and vocabulary versioning |
| Python integration | 10 | Python clients exist; support status and async behavior require confirmation | Official Python driver, including async APIs | Exercise transactions, retries, pooling, observability, and failure handling |
| Transactions and consistency | 10 | Candidate; exact cross-collection/module behavior must be tested | Candidate; graph transactions are a core capability | Define module transaction boundaries and concurrency scenarios |
| Operations, backup, recovery, and scaling | 10 | Candidate; edition-dependent capabilities and limits require review | Candidate; several production capabilities are edition-dependent | Test backup/restore and document RTO/RPO and topology assumptions |
| Security and privacy | 5 | Authentication, authorization, encryption, auditing, and masking need edition-specific review | Authentication and authorization capabilities vary by edition | Threat-model database access and prove least privilege per module |
| Compliance with NFR-003 | 10 | Material risk: current Community terms restrict commercial use by aggregate dataset size and other conditions | Community is GPLv3; required production capabilities must be available without a paid edition | Obtain legal review and prove that intended use, scale, and required capabilities incur no software fees |

Current recommendation: use ArangoDB as the leading proof-of-concept candidate because its native multi-model shape most closely matches the requested graph plus flexible document/key-value model. Keep Neo4j as the graph-specialist comparator. Do not accept either product until a representative proof of concept, operational review, and proof of NFR-003 compliance are complete. Any capability or scale that requires a paid edition disqualifies that candidate. The proof of concept shall use the existing logical model and exercise at least recursive product composition, date-qualified inventory lookup, traveler/order traversal, property validation, indexed identifier lookup, concurrent stock allocation, and backup/restore.

One database product does not imply one shared mutable model. Each Resources module owns its collections or graph partitions and its persistence adapter. Other modules use identifiers, projections, exchanged representations, or provided operations; they shall not issue queries against another module's owned data. Physical consolidation may be chosen later without weakening logical encapsulation.

## Generated-document storage

Binary or rendered documents shall not be stored as large graph properties. A storage port owned by the module responsible for the document lifecycle shall support put, retrieve, version, integrity verification, retention, and deletion/hold behavior. Its implementation may target an object/blob service or a filesystem, but business code shall receive an opaque document reference rather than a provider-specific path or URL.

Before selecting the implementation, requirements must define document classes, expected sizes and volume, retention periods, immutability and audit needs, confidentiality, encryption, backup/recovery, malware scanning for uploaded content, and whether multiple application instances require shared storage. Invoices may also be subject to legal retention and immutability obligations; those rules require stakeholder/legal evidence before architecture acceptance.

## Required decision evidence

1. Confirm whether the customer-facing site needs search-engine discoverability or server-side rendering; then choose the React framework profile.
2. Benchmark a thin Python/FastAPI vertical slice against NFR-001 and a streamed chatbot slice against NFR-002.
3. Execute the ArangoDB-versus-Neo4j proof of concept with identical domain scenarios and record query plans and measurements.
4. Review licences and production editions and prove that all required database, backup, recovery, security, development, testing, and operational capabilities satisfy NFR-003 at the intended scale.
5. Define generated-document retention, immutability, access, and recovery requirements before selecting filesystem or object/blob storage.
6. Record accepted selections and rejected alternatives in decision records; only then create technology-specific implementation guides.

## Primary evidence

- [React: Creating a React App](https://react.dev/learn/creating-a-react-app)
- [FastAPI features](https://fastapi.tiangolo.com/features/)
- [ArangoDB Community Edition features](https://docs.arangodb.com/3.12/about-arangodb/features/community-edition/)
- [ArangoDB Community Edition License Agreement](https://arangodb.com/wp-content/uploads/2024/05/ADB-Community-License_31OCT2023.pdf)
- [Neo4j Operations Manual](https://neo4j.com/docs/operations-manual/current/introduction/)
- [Neo4j Python Driver](https://neo4j.com/docs/api/python-driver/current/)

## Decision status

No technology is accepted yet. The recommendations above are ready for stakeholder review; unresolved evidence is explicit and no implementation guide has been created prematurely.
