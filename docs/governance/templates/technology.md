# Technology

- Status: draft
- Owner: Architecture
- Last reviewed: YYYY-MM-DD

Use this template for the authoritative Technology artifact. Replace instructional text and placeholders with evidence-supported content. The artifact maps architecture, quality, security, delivery, integration, data, and operational needs to a coherent technology baseline with explicit usage boundaries, alternatives, compatibility expectations, and validation.

The artifact does not redefine requirements, logical modules, entities, interface semantics, physical data models, deployment topology, implementation code, operational procedures, or acceptance criteria. Link to their authoritative artifacts rather than duplicating them.

Classify consequential statements as facts, assumptions, proposals, decisions, recommendations, or open questions. A `draft` baseline may contain explicit proposals without presenting them as accepted decisions, installed dependencies, implemented behavior, operational evidence, or production readiness.

## Purpose and technology boundary

State the system, environment, use case, module, integration, or vertical-slice scope; the operating mode; and the technology decisions this artifact owns. Distinguish what remains authoritative in Requirements, Software Architecture, the Logical Entity Model, Security and Privacy Architecture, Deployment Architecture, Implementation, Test, Operations, and Decision Records.

Record the lifecycle status and authority of material inputs. State whether the baseline targets exploration, a prototype, an implementation starting point, an existing system, or production evolution.

## Technology drivers

| Driver | Source and lifecycle status | Technology consequence | Confidence, limitation, or validation need |
|---|---|---|---|
| Architecture, requirement, quality scenario, security control, constraint, external boundary, delivery need, operational need, or decision | Direct link and status | Capability or restriction imposed on the technology baseline | Missing evidence or next validation |

Include only material drivers. Do not invent volumes, performance targets, team skills, hosting constraints, budgets, support horizons, protocols, or compliance needs.

## Technology baseline

| Concern | Selection or current disposition | Usage boundary | Rationale and evidence | Status and decision authority |
|---|---|---|---|---|
| Language, runtime, framework, persistence, interface, build, test, security, observability, development, or other evidenced concern | Selected product or deliberately unresolved concern | Modules, layers, adapters, environments, and permitted purpose | Linked drivers and trade-offs | draft proposal, accepted decision, deferred, or not selected; `DR-NNNN` where applicable |

Do not populate technology categories without a demonstrated need. A deliberately unresolved concern is preferable to an unjustified product selection.

## Architecture mapping and usage boundaries

Explain how the technology baseline realizes the accepted Software Architecture without redefining it.

| Architecture element or boundary | Technology use | Permitted dependency or interaction | Prohibited coupling or ownership | Reconsideration trigger |
|---|---|---|---|---|
| Module, internal layer, contract, port, adapter, consistency boundary, external participant, or distribution boundary | Selected or candidate mechanism | Intended use and direction | Shared internals, direct storage access, framework leakage, or other prohibited effect | Requirement, scale, failure, security, support, or operational evidence |

Keep logical modules independent of framework packages, processes, services, containers, repositories, schemas, and deployment units unless a separate accepted design establishes that mapping.

## Application and interaction baseline

Describe selected languages, runtimes, backend and frontend frameworks, user-interface delivery, interface protocols, and interaction mechanisms. For each selection state its scope, architectural fit, limitations, and unresolved contract or deployment decisions.

Do not define endpoint paths, payload schemas, messages, UI behavior, authentication flows, or deployment topology merely by selecting a framework or protocol.

## Data and persistence baseline

Describe selected database and storage products, data-access mechanisms, and migration tooling with their usage boundaries.

- A logical entity does not imply one table, document, node, persistence class, or shared schema.
- Every persisted model remains owned by one module even when physical infrastructure is shared.
- Other modules do not gain direct repository or table access from a common database selection.
- Physical schemas, keys, indexes, constraints, mappings, migrations, history, and concurrency mechanisms belong to implementation planning.
- Additional search, cache, object, graph, time-series, analytics, or media storage requires separate evidence.

Record which data concerns remain open and what evidence will resolve them.

## Integration baseline

| Interaction or external boundary | Selected or candidate mechanism | Owning module and adapter boundary | Reliability and security implications | Contract and validation need |
|---|---|---|---|---|
| Browser, module, device, service, file, batch, message, partner, or external system interaction | Protocol, library, product, or unresolved mechanism | Architecture owner | Authentication, authorization, validation, timeout, retry, replay, duplicate, ordering, failure, or recovery | OpenAPI, AsyncAPI, schema, test, spike, or detailed use case where warranted |

Do not introduce messaging, streaming, brokers, workflow engines, gateways, service meshes, or generic integration platforms without an evidenced interaction need.

## Security and privacy realization

Map accepted security control objectives to candidate or selected technology mechanisms without treating mechanism presence as proof of effectiveness.

| Security control or boundary | Technology mechanism or disposition | Usage boundary | Deployment or operational dependency | Verification and residual limitation |
|---|---|---|---|---|
| `SEC-ARCH-NNN`, `TB-NNN`, or linked concern | Product, protocol, framework capability, unresolved mechanism, or non-selection | Where and for what purpose it applies | Identity source, key, secret, zone, operator, monitoring, or lifecycle need | Test, review, exercise, specialist evidence, or remaining risk |

Keep identity provider, policy administration, cryptography, key management, secret management, audit storage, scanning, and monitoring unresolved until requirements and environment evidence justify their selection.

## Build, packaging, and dependency management

Describe the selected build tools, wrappers, package managers, lockfiles, repositories, artifact formats, and reproducibility expectations. State the authoritative location of exact resolved dependencies after implementation begins.

Cover proportionately:

- clean build and deterministic dependency resolution;
- source and artifact provenance;
- dependency inventory and transitive dependencies;
- licensing and vulnerability review;
- artifact integrity and promotion;
- separation of development convenience from production packaging.

Do not turn local containers, development servers, or a prototype package into production topology.

## Verification technology

| Verification scope | Selected or candidate technology | Evidence it must support | Limitation or handoff |
|---|---|---|---|
| Unit, component, module, architecture, database, migration, contract, browser, accessibility, performance, resilience, security, packaging, or operational verification | Framework, tool, environment, or deferred selection | Requirement, control, architecture rule, or prototype hypothesis | What the tool cannot establish and which workflow owns acceptance |

Testing tools execute evidence; they do not define requirements or acceptance.

## Local development and minimal executable topology

Describe the smallest reproducible local or prototype arrangement needed for the declared scope. Identify application components, locally provided dependencies, configuration boundaries, synthetic data, startup path, and packaging assumptions.

Keep concrete production processes, containers, hosts, networks, regions, managed services, scale, backup, and operational ownership in Deployment Architecture.

## Version, compatibility, and support policy

State:

- maintained release or LTS posture where relevant;
- required compatibility among runtimes, frameworks, databases, drivers, build tools, and test tools;
- where exact versions and lockfiles are authoritative;
- update, vulnerability-response, and end-of-support expectations;
- rules for preview, milestone, snapshot, unmaintained, duplicate, and transitive dependencies;
- validation required before an update is adopted.

Record exact versions here only when the version itself is a consequential constraint or decision. Verify current versions, support windows, licenses, vulnerabilities, and compatibility against authoritative primary sources when they materially affect a choice.

## Explicit non-selections and deferrals

| Concern or technology | Current disposition | Reason | Reconsideration trigger |
|---|---|---|---|
| Product, platform, protocol, architectural mechanism, or unresolved concern | Not selected, deferred, or outside scope | Evidence-based rationale | Requirement, scale, trust, failure, integration, deployment, operational, support, or prototype finding |

Use this section to prevent accidental technology proliferation, not to list every conceivable product.

## Alternatives and consequential decisions

| Concern | Options considered | Current proposal or decision | Rationale and trade-offs | Decision record or resolution condition |
|---|---|---|---|---|
| Material selection or policy | Viable alternatives, including no selection where appropriate | Proposed or accepted direction | Architecture, quality, security, delivery, support, cost, licensing, and operational consequences | `DR-NNNN` or accountable next step |

Represent alternatives fairly. Familiarity, popularity, novelty, or feature count alone is not a sufficient rationale.

## Prototype or PoC validation

Include this section when a prototype or PoC is in scope.

| Hypothesis | Technology exercised | Production-like, mocked, reduced, or deferred aspects | Evidence and success criterion | Residual limitation or next decision |
|---|---|---|---|---|
| Named architecture, integration, data, security, build, test, or packaging question | Relevant selections | Explicit scope boundary | Executable observation, test, measurement, or review | What the result cannot establish |

A successful prototype validates only its declared hypotheses. It does not establish production scalability, security, compliance, supportability, or operability unless those outcomes were explicitly tested.

## Assumptions and open questions

| Type | Statement | Affected technology concerns | Owner | Validation, resolution, or expiry condition |
|---|---|---|---|---|
| Assumption or open question | Material uncertainty | Selections, integrations, versions, or policies | Accountable role | Evidence, spike, decision, implementation finding, or date |

## Cross-artifact handoffs

| Owning artifact or workflow | Required clarification or change | Affected selections or boundaries | Owner and resolution condition |
|---|---|---|---|
| Requirements, Software Architecture, Entity Model, Security, Deployment, Implementation, Test, CI/CD, Operations, Migration, or Decision Records | Exact handoff without redefining the target artifact | Technology concerns and linked identifiers | Accountable role and completion evidence |

## Validation status

Record:

- driver-to-selection and selection-to-validation traceability;
- coverage or explicit deferral of required technology concerns;
- compatibility among selected runtimes, frameworks, databases, drivers, build tools, and verification tools;
- architecture, module, entity, contract, security, and deployment-boundary alignment;
- version, support, license, provenance, dependency, and vulnerability evidence where material;
- prototype and production separation;
- agreement with decision records and executable dependency files;
- link and repository validation;
- skipped checks, evidence limitations, open decisions, and residual risks.

## Sources and related artifacts

Link directly to Product Vision, relevant use cases and rules, functional and non-functional requirements, constraints, exclusions, source evidence, Software Architecture, Logical Entity Model, Security and Privacy Architecture, Deployment Architecture, decisions, implementation and dependency files, CI/CD, test strategy and results, operations, migration evidence, prototype evidence, and authoritative primary product documentation used by the declared scope.
