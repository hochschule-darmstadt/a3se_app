# Environment Name

- Status: draft
- Owner: Architecture/Operations
- Last reviewed: YYYY-MM-DD

Use this template for one independently governed deployment environment and save it as `<name>-environment.md` beside the authoritative Deployment Architecture. Replace all instructional text and placeholders with project evidence, and remove sections that are genuinely inapplicable.

Do not create an environment specification for a branch, build profile, prototype, pipeline job, test container, temporary database, or machine unless it has an independently governed environment purpose and lifecycle. Describe variations inside one environment as execution profiles. Keep reusable method and general deployment guidance in the owning skill rather than in the finished artifact.

Use stable `ENV-<KEY>-NNN` identifiers for actual environment requirements. Write normative requirements with the repository's accepted `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, or `MAY` terms. Preserve identifiers while their meaning remains stable; retire rather than reuse them. Do not assign requirement IDs to assumptions, proposals, recommendations, placeholders, or open questions.

## Purpose and authority

State the environment's purpose, consumers, prohibited uses, lifecycle stage, and the decisions this specification owns. Link to the authoritative Deployment Architecture, requirements, Software Architecture, Technology, Security and Privacy Architecture, and operational guidance without duplicating their content.

## Environment profile

| Concern | Definition | Evidence or source |
|---|---|---|
| Authoritative profile name | Descriptive name | Landscape entry or decision |
| Short name | Stable concise identifier | Naming decision |
| Purpose | Development, integration, demonstration, acceptance, production operation, or another evidenced purpose | Requirement or lifecycle need |
| Consumers and operators | Authorized users, delivery actors, and operational owners | Actor, operating model, or decision |
| Prohibited uses | Uses this environment must not support | Constraint, security boundary, or deferral |
| Trust and exposure | Local, private, partner, public, or other defined boundary | Security Architecture |
| Data class | Permitted and prohibited data categories | Requirements and Security Architecture |
| Lifecycle | Creation, expected lifetime, change cadence, and retirement model | Delivery or operating model |
| Maturity | Draft, proposed, implemented, operational, or deferred | Current evidence |

## Drivers and constraints

| Driver or constraint | Source and status | Environment consequence | Validation or decision need |
|---|---|---|---|
| Requirement, quality scenario, security control, technology boundary, delivery need, or operating constraint | Direct authoritative link | Topology, isolation, data, lifecycle, exposure, or evidence implication | Required decision or proof |

Include only drivers that materially affect this environment.

## Runtime topology

| Deployable element or dependency | Artifact or technology | Runtime node and placement | Instance or scaling model | Network path and trust boundary | Owner |
|---|---|---|---|---|---|
| Frontend, backend, worker, database, gateway, external integration, migration, scheduler, telemetry component, or administrative surface | Selected mechanism | Process, container, host, managed service, browser, device, or external node | Count, elasticity, active/passive, or deliberately unresolved | Ingress, egress, protocol, origin, and boundary | Delivery or operational owner |

Add a deployment diagram in the repository's established deployment-topology notation (see [notations](../standards/notations.md)) only when it communicates material node, instance, or boundary relationships more clearly than the table. Link its authoritative source and rendered output.

## Environment requirements

| ID | Normative requirement | Source or rationale | Verification | Status |
|---|---|---|---|---|
| `ENV-<KEY>-NNN` | The responsible subject `SHALL` produce a verifiable environment outcome under a stated condition. | Requirement, architecture, security control, decision, or operating need | Test, inspection, deployment evidence, exercise, or review | draft, proposed, accepted, implemented, or deprecated |

Link shared `DEP-NNN` requirements instead of copying them. Keep one atomic outcome per requirement.

## Execution profiles

Use this section only when the environment has materially different repeatable run modes that remain inside the same governance boundary.

| Execution profile | Identifier | Purpose | Build or artifact form | Configuration class | Data and storage state | Tooling and access | Lifecycle |
|---|---|---|---|---|---|---|---|
| Descriptive name | Stable concise identifier | Why this mode exists | Source, development server, package, image, or immutable artifact | Profile and permitted overrides | Persistent, seeded, restored, disposable, or shared state | Debug, inspection, administrative, or restricted surface | Start, reset, stop, retain, and dispose behavior |

For each profile, document additional detail only where the comparison does not define a verifiable contract.

## Isolation and concurrency

Define applicable isolation units and the consequences of sharing them.

| Boundary | Isolation unit | Sharing policy | Concurrent-use rule | Failure or interference consequence | Evidence or gap |
|---|---|---|---|---|---|
| Workspace, tenant, account, subscription, project, namespace, host, process, container, network, port, credential, database server, logical database, schema, storage, cache, queue, or external dependency | Concrete unit | Dedicated, controlled shared, or prohibited shared | Supported concurrency and allocation mechanism | Blast radius and affected evidence | Configuration, test, observation, or open gap |

## Configuration, identities, secrets, and keys

| Concern | Source and injection | Scope | Storage and access | Rotation or expiry | Prohibited treatment |
|---|---|---|---|---|---|
| Non-secret configuration, runtime identity, credential, secret, certificate, or key | Configuration system, deployment automation, identity platform, or manual boundary | Environment, application, service, instance, or session | Authorized location and readers | Required lifecycle | Version control, reuse, plaintext retention, or other prohibition |

Distinguish committed non-secret examples from runtime values. Link detailed identity, authorization, cryptography, and key-management controls to Security Architecture.

## Network and access boundaries

| Path or surface | Source | Destination | Protocol and protection | Exposure | Authorization and administration | Evidence or unresolved need |
|---|---|---|---|---|---|---|
| User path, service path, data path, administrative path, telemetry path, or external integration | Runtime identity or network zone | Runtime node or external boundary | Protocol, transport, origin, encryption, or gateway | Loopback, private, partner, public, or prohibited | Authentication, authorization, least privilege, and owner | Test, configuration, diagram, or decision |

Record ingress, egress, name resolution, origins, proxies, firewalls, and administrative access only where applicable.

## Data, storage, migration, and reset

| Data or state | Permitted classification | Store and ownership | Initialization or restore | Migration and compatibility | Persistence, backup, and retention | Reset or disposal |
|---|---|---|---|---|---|---|
| Application data, fixture, file, cache, message, index, secret state, telemetry, or generated evidence | Synthetic, test, demonstration, operational, personal, sensitive, or prohibited | Database, volume, object store, queue, or external service | Empty, seeded, migrated, copied, restored, or generated | Schema and application compatibility rule | Required persistence and recovery treatment | Safe reset, purge, archive, or decommission action |

State whether any data may move into or out of the environment. Do not imply that database copies or fixtures are permitted without an accepted data-handling basis.

## Build, artifact, deployment, and rollback

| Stage | Input | Produced or selected artifact | Integrity and provenance | Environment-specific action | Failure and rollback behavior | Evidence |
|---|---|---|---|---|---|---|
| Build, package, publish, configure, migrate, deploy, verify, promote, or roll back | Revision, dependency set, artifact, configuration, and schema state | Versioned package, image, static assets, migration set, or deployment release | Identification, signing, checksum, SBOM, or repository as applicable | Injection and placement without source divergence | Stop, retry, rollback, restore, reconcile, or manual decision | Pipeline record, manifest, test, or observation |

Link executable CI/CD automation rather than reproducing it. State explicitly when artifact promotion or rollback is not yet defined.

## Lifecycle and operations

| Lifecycle activity | Trigger and authority | Mechanism or owning procedure | Required precondition | Success evidence | Failure or escalation path |
|---|---|---|---|---|---|
| Provision, bootstrap, start, health-check, deploy, scale, stop, reset, back up, restore, rotate, patch, decommission, or recover | Event and accountable role | Automation, platform, or linked runbook | Required state and approval | Observable result | Safe response and owner |

Include only activities required by this environment's maturity. Exact routine commands and troubleshooting belong in linked runbooks.

## Health, diagnostics, observability, and support

| Signal or capability | Purpose | Source and destination | Data restrictions | Retention and access | Consumer and response |
|---|---|---|---|---|---|
| Health, readiness, logs, metrics, traces, audit, deployment events, alerts, diagnostics, or support access | Startup, operation, performance, security, recovery, or investigation | Emitting component and collection surface | Redaction and prohibited content | Authorized readers and lifecycle | Developer, operator, security, support, or automated action |

Do not claim monitoring, alerting, or support readiness from the presence of a health endpoint alone.

## Verification and evidence boundary

State the evidence required before this environment may be used for its declared purpose. Distinguish deployment verification from product acceptance and distinguish this environment from local or CI verification contexts and their temporary sandboxes.

| Claim | Required evidence | Execution context | Retention or link | Limitation |
|---|---|---|---|---|
| Topology, isolation, startup, migration, configuration, security, data, health, rollback, recovery, or operational claim | Automated check, inspection, exercise, measurement, or accountable review | Environment instance, CI verification, local verification, or test sandbox | Durable evidence location | What the evidence does not establish |

## Current implementation alignment

| Capability or requirement | Required target | Current evidence | Alignment | Gap and owner |
|---|---|---|---|---|
| Environment concern or `ENV-<KEY>-NNN` | Intended architecture | Configuration, infrastructure, script, run, or observation | aligned, partial, absent, or conflicting | Exact follow-up and accountable owner |

Never describe a target proposal as current implementation. Do not promote existing implementation into an accepted decision without review.

## Alternatives and consequential decisions

| Concern | Options considered | Current proposal or decision | Rationale and trade-offs | Decision record or resolution condition |
|---|---|---|---|---|
| Environment boundary, topology, isolation, platform placement, data lifecycle, access, promotion, recovery, or operating model | Viable alternatives, including deferral where responsible | Proposed or accepted direction | Linked drivers and consequences | `DR-NNNN` or accountable next step |

## Assumptions and open questions

| Type | Statement | Affected requirements or topology | Owner | Validation, resolution, or expiry condition |
|---|---|---|---|---|
| Assumption or open question | Material uncertainty without normative ID | Direct links or environment concerns | Accountable role | Evidence, decision, exercise, implementation finding, or date |

## Cross-artifact handoffs

| Owning artifact or workflow | Required clarification or change | Affected identifiers or boundaries | Owner and completion evidence |
|---|---|---|---|
| Requirements, Software Architecture, Entity Model, Technology, Security, Implementation, CI/CD, Test, Operations, Prototype, Risk, or Decision Records | Precise handoff without redefining the target artifact | Environment requirements, nodes, paths, data, or lifecycle | Accountable role and observable completion |

## Validation status

Record:

- profile purpose and landscape consistency;
- runtime-node and deployable-element coverage;
- environment, execution-profile, instance, verification-context, and sandbox classification;
- traceability of `ENV-<KEY>-NNN` and applicable `DEP-NNN` requirements;
- architecture, technology, security, data, network, identity, secret, lifecycle, observability, and operational alignment;
- current-implementation comparison;
- diagram rendering and visual inspection where diagrams exist;
- link and repository validation;
- skipped checks, evidence limitations, open decisions, and residual risks.

## Sources and related artifacts

Link directly to the Deployment Architecture, relevant requirements and quality scenarios, constraints, exclusions, decisions, Software Architecture, Logical Entity Model, Technology, Security and Privacy Architecture, implementation and infrastructure configuration, CI/CD, tests and evidence, operational runbooks, prototype material, risks, notation guidance, and definition of done used by this specification.
