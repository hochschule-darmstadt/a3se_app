# DR-0010: Adopt a Python-centred modular technology stack

- Status: accepted
- Date: 2026-08-04
- Deciders: project owner and architecture
- Supersedes: none

## Context

The accepted software architecture defines bounded modules, acyclic dependencies, and freedom to begin as a modular monolith and extract deployable services later. The logical entity model uses flexible typed properties, rule-based semantic validation, recursive structures, and cross-entity graph patterns. Product AI is a central capability rather than an isolated add-on: conversational travel advice, booking assistance, and fulfilment support need controlled access to current business capabilities and data.

The initial evaluation followed the stakeholder's named React, Python, FastAPI, and graph-database preferences too closely. An independent comparison then favoured Angular, Java with Spring Modulith, and PostgreSQL. Review against the concrete object graph and the intended breadth of agent functionality changed the balance: a split Java/Python backend would introduce a permanent integration boundary through the centre of the product, while plain relational persistence would make the demonstrated heterogeneous, multi-hop paths less natural to query.

Subsequent UI evaluation established that dynamic travel offers and destination pages do not require public search-engine indexing. Customer Interaction needs a modern responsive booking portal, while Staff Interaction needs a dense functional business interface; both shall share one frontend technology platform without requiring identical presentation profiles.

## Decision drivers

- one implementation language for business modules, agent orchestration, validation, and AI integration;
- natural representation and traversal of the concrete multi-hop object graph;
- controlled reuse of the same module operations by web interactions and product agents;
- explicit contracts despite runtime-defined properties and validation rules;
- rapid delivery and access to the Python AI ecosystem;
- preservation of logical module boundaries and future service extraction;
- compliance with the zero-cost software constraint in NFR-003;
- reliable transactions for ordering and stock allocation;
- measurable UI and conversational response times under NFR-001 and NFR-002.

## Considered options

- Angular, Java, Spring Boot, Spring Modulith, and PostgreSQL: strong integrated UI and backend conventions, enforceable Java module rules, and mature relational transactions, but weaker alignment with pervasive Python agent logic and less natural handling of the demonstrated graph patterns without additional graph technology.
- React, a Java transactional core, and separately deployed Python agents: preserves Java backend strengths, but duplicates contracts and adds network, authentication, failure-handling, deployment, and observability concerns between product agents and core operations from the outset.
- React, Python, FastAPI, and relational PostgreSQL: provides a unified implementation language, but uses relational representations for data whose concrete example already contains heterogeneous multi-hop and recursive graph patterns.
- React, Python, FastAPI, and PostgreSQL with Apache AGE: combines relational and graph facilities under PostgreSQL and remains a fallback candidate, but adds an extension and hybrid query model when a native graph database can be evaluated directly.
- React, Python, FastAPI, and Neo4j Community Edition: aligns the implementation language with agent development and the property-graph data model, but the free edition is single-instance and lacks several enterprise operational capabilities; these limitations must be tested against actual project needs.
- ArangoDB Community Edition: technically aligns with graph and document needs, but its current terms prohibit commercial production use and therefore fail NFR-003.
- React Router v7 Framework Mode with Vite and Mantine: provides one client-rendered React platform, routing and build conventions, and a shared themable component foundation without requiring an additional JavaScript server runtime; its suitability for both interaction profiles remains subject to PoC validation.
- Next.js App Router: provides strong server rendering and dynamic search-discovery support, but those capabilities are not required for dynamic travel content and would introduce an additional server-side application layer beside FastAPI.
- React and Vite assembled without Framework Mode: keeps the client small but leaves more routing, data-loading, error-boundary, and code-splitting conventions to the project.

## Decision

Adopt this initial product technology profile:

- React with TypeScript, React Router v7 Framework Mode, Vite, and Mantine for Customer and Staff Interaction. Both use client-side rendering and the same technology platform, while their themes, density, navigation, and interaction patterns may differ. The selection is subject to PoC validation.
- Python for the modular backend core.
- FastAPI as the HTTP interaction adapter. Domain and application logic shall not depend on FastAPI request objects or routing concerns.
- Pydantic contract models and explicit domain types at trust and module boundaries. Runtime-defined property bags remain subject to type definitions, vocabularies, mandatory/optional rules, and cross-property validation.
- Neo4j Community Edition for the persistence proof of concept. It remains the selected operational database if the proof of concept reveals no showstopper.
- Controlled agent tools that invoke provided module operations. Product agents shall not receive unrestricted database credentials or arbitrary write-query execution.
- A modular monolith as the initial application structure and runtime boundary. Module interfaces shall preserve the option to extract independently deployable components later, particularly an AI component if scaling, security, or failure isolation justifies it.

Neo4j may physically hold connected data from several modules, but physical consolidation does not remove ownership. Each module controls its writes, labels or relationship types, persistence adapter, and invariants. Cross-module agent actions use module operations. Any cross-module graph read must be exposed through an authorised, bounded query operation or a controlled read projection.

Generated business documents remain behind a storage port with opaque references; this decision does not select a filesystem or object-storage product.

## Consequences

### Positive

- Agent logic and business logic can initially share Python contracts and in-process module interfaces without a mandatory Java/Python network boundary.
- React clients can consume explicit OpenAPI/Pydantic contracts while remaining independent of backend persistence models.
- Customer and Staff Interaction can share routing, build, component, theme, and contract foundations while retaining purpose-specific user experiences.
- Neo4j directly represents nodes, typed relationships, flexible properties, recursive composition, and heterogeneous paths visible in the logical object example.
- A modular monolith minimises initial operational complexity while retaining extraction seams.
- Controlled tools keep validation, authorisation, transactions, and audit behaviour between an agent and business state.

### Negative and risks

- Python module boundaries and acyclic dependencies require explicit packaging rules, static analysis, and architecture tests rather than Spring Modulith's integrated enforcement.
- Runtime flexibility can degrade into untyped dictionaries unless Pydantic contracts, explicit value types, and strict validation are consistently applied.
- Python CPU throughput and blocking drivers may threaten response targets unless I/O, concurrency, and workloads are measured.
- Neo4j Community Edition is limited to a single-instance deployment. Online backup, clustering, failover, multiple standard databases, and several enterprise security capabilities are not available without a paid edition.
- Neo4j property-value constraints may require value objects to be represented as nodes or encoded values rather than arbitrary nested documents.
- A graph shared physically across modules can tempt direct cross-module access and must be governed through ownership and interface tests.
- The selected React platform still requires choices for forms, data access, client state, localisation, authentication, testing, and complex staff grids.
- Mantine is not a specialised enterprise data-grid product; required Staff Interaction grid behaviour may require an additional NFR-003-compliant component.

## Validation and revisit triggers

The Neo4j proof of concept shall use the existing concrete object example and realistic test scenarios. It shall exercise flexible properties, vocabulary and cross-property validation, recursive product, stock, and order structures, heterogeneous multi-hop paths, indexed search, concurrent stock allocation, transaction rollback, agent read tools, agent command tools, backup, restore, and upgrade.

Any of the following is a database showstopper and reopens the selection:

- a required commercial-production capability would require a paid Neo4j edition and therefore violate NFR-003;
- required backup, recovery, availability, access control, audit, or operational maintenance cannot be achieved safely with Community Edition;
- correct concurrent stock allocation or order transactions cannot be demonstrated;
- representative graph queries or indexed property searches cannot meet agreed performance targets;
- the semantic property model cannot be represented and validated without unacceptable complexity or information loss;
- module ownership or controlled agent access cannot be enforced without unrestricted cross-module database access;
- the supported Python driver, transaction handling, migration approach, or upgrade path proves unsuitable.

If a showstopper occurs, compare PostgreSQL with Apache AGE, plain PostgreSQL, and other NFR-003-compliant graph products against the same acceptance evidence. ArangoDB may return only if its applicable commercial-production terms change and pass a fresh licence review.

React Router v7, Vite, and Mantine remain selected only if the PoC demonstrates a modern responsive Customer Interaction profile and a dense, efficient Staff Interaction profile on the same foundation. Revisit the selection if accessibility, localisation preparation, validation and error presentation, required staff grid behaviour, NFR-001 performance, or NFR-003 cost compliance fails, or if a mandatory React server runtime becomes necessary.

The overall stack shall also be revisited if Python cannot meet NFR-001/NFR-002 under representative load or if module-dependency checks cannot reliably enforce the accepted architecture.

## Links

- [Technology profile and evaluation](../../architecture/technology.md)
- [Modular software architecture](../../architecture/software-architecture/software-architecture.md)
- [Logical entity model and object example](../../architecture/entity-model/entity-model.md)
- [Non-functional requirements](../../requirements/non-functional-requirements.md)
