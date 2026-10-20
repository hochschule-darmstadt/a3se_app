# Deployment Architecture

- Status: draft
- Owner: Architecture/Operations
- Last reviewed: YYYY-MM-DD

Use this template for the authoritative environment landscape and shared deployment architecture. Replace all instructional text and placeholders with project evidence, remove sections that are genuinely inapplicable, and preserve compatible established structure.

This document governs the relationships across environments, shared placement constraints, cross-environment requirements, environment maturity, and the boundary between deployment and verification. Use the canonical [Environment template](environment.md) for the independently reviewable contract of one environment. Do not turn branches, build profiles, prototypes, pipeline jobs, test containers, temporary databases, or machines into environments without an independently governed purpose and lifecycle.

Use stable `DEP-NNN` identifiers only for project-specific normative requirements that apply across environments. Write them with the repository's accepted `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, or `MAY` terms. Preserve identifiers while meaning remains stable; retire rather than reuse them. Do not assign requirement IDs to assumptions, proposals, recommendations, placeholders, or open questions.

## Purpose and authority

Define the system boundary and state that Deployment Architecture owns environment profiles, shared runtime placement, instance and isolation boundaries, configuration and secret placement, network exposure, data-store placement, delivery topology, environment lifecycle, and deployment-specific operational qualities.

Link to the authoritative requirements, Software Architecture, Logical Entity Model, Technology, Security and Privacy Architecture, Test Strategy, CI/CD, and operational guidance. State explicitly that this artifact does not redefine product behavior, logical modules, technology selection, security controls, prototype scope, executable delivery automation, or operating procedures.

## Scope and maturity

Describe the lifecycle stage, environments, execution profiles, runtime elements, decisions, and evidence in scope. Identify deferred environment concerns and their activation conditions without inventing topology. State explicitly what this architecture does not establish, such as production readiness, external deployment authority, real-data use, or operational approval.

## Deployment drivers and constraints

| Driver or constraint | Source and lifecycle status | Deployment consequence | Validation or decision need |
|---|---|---|---|
| Distribution, integration, technology, quality, security, privacy, delivery, data, resilience, recovery, portability, cost, or operating need | Direct authoritative link and status | Environment boundary, placement, isolation, exposure, lifecycle, or evidence implication | Required decision, experiment, review, or proof |

Include only evidenced drivers that materially affect deployment. Do not fabricate users, traffic, regions, availability targets, recovery objectives, data classes, hosting policies, budgets, or team capabilities.

## Environment landscape

Define environments only when purpose, consumers, governance, trust, exposure, data, lifecycle, promotion, or operational ownership requires an independent boundary.

| Environment profile | Short name | Purpose and consumers | Governance boundary | Maturity and current-stage need | Specification or activation condition |
|---|---|---|---|---|---|
| Descriptive profile name | Stable concise identifier | Intended use and authorized consumers | Distinct trust, exposure, lifecycle, promotion, or ownership reason | draft, proposed, implemented, operational, or deferred; required now or later | Direct environment-specification link or evidence needed before definition |

Record the remaining profile boundaries without overloading the landscape table:

| Environment | Prohibited uses | Trust and exposure | Data and identity class | Lifecycle and change cadence | Accountable owner |
|---|---|---|---|---|---|
| Stable profile name or short name | Uses the profile must not support | Local, private, partner, public, or another defined boundary | Permitted and prohibited categories and identities | Creation, lifetime, change, reset, and retirement direction | Architecture, delivery, or operational authority |

Do not assume a universal environment sequence or names such as `LOCAL`, `DEV`, `TEST`, `DEMO`, `STAGE`, or `PROD`. Preserve accepted project terminology. Link detailed topology and environment-specific requirements to the relevant environment specification.

## Shared deployment baseline

Map accepted logical and technology choices to deployable artifacts and placement without equating modules, repositories, schemas, containers, services, hosts, or environments.

| Deployable element or dependency | Artifact or selected technology | Placement direction | Instance or scaling direction | Network or trust boundary | Authoritative source |
|---|---|---|---|---|---|
| Frontend, backend, worker, gateway, database, migration, scheduler, telemetry component, administrative surface, or external dependency | Versioned package, image, static assets, runtime, store, protocol, or deliberately unresolved mechanism | Browser, process, container, host, managed service, device, or external node | Accepted count, elasticity, redundancy, or unresolved requirement | Ingress, egress, protocol, exposure, and identity boundary at landscape depth | Software Architecture, Technology, Security Architecture, requirement, or decision |

Add a C4 deployment view only when it communicates material node, instance, or trust-boundary relationships more clearly than the tables. Link its authoritative source and rendered output.

## Cross-environment requirements

| ID | Normative requirement | Source or rationale | Verification | Current evidence or status |
|---|---|---|---|---|
| `DEP-NNN` | The responsible subject `SHALL` produce a verifiable cross-environment outcome under a stated condition. | Requirement, architecture, security control, decision, delivery, or operating need | Test, inspection, exercise, deployment evidence, or accountable review | draft, proposed, accepted, implemented, partial, deferred, or deprecated with direct evidence |

Keep one atomic outcome per requirement. Put requirements belonging to only one environment in that environment's `ENV-<KEY>-NNN` catalog instead.

## Execution profiles

Use this section only when one or more environments have repeatable run modes that remain inside the same governance boundary.

| Environment | Execution profile | Identifier | Purpose | Material variation | State and lifecycle | Detailed specification |
|---|---|---|---|---|---|---|
| Profile name | Descriptive mode | Stable concise identifier | Why the mode exists | Build form, configuration, tooling, data initialization, access, or evidence difference | Persistent, seeded, restored, disposable, reset, or retained direction | Direct environment-specification link |

State why each profile is not a separate environment. Do not model an environment instance as a profile.

## Verification execution

Use this section when local or CI verification runs deployable components outside an independently governed application environment.

| Verification context | Purpose | Created resources or sandboxes | Isolation and lifecycle | Required evidence | Boundary from environments and promotion |
|---|---|---|---|---|---|
| Local, CI, laboratory, or another controlled context | Checks performed and claims supported | Processes, containers, temporary stores, browsers, or devices | Allocation, concurrency, cleanup, and retention | Direct check, report, observation, or gap | Why this is not an environment or release stage |

Test databases, containers, and similar resources subordinate to one verification run are execution sandboxes, not environments.

## Environment activation conditions

Record deferred profiles without designing unsupported topology.

| Environment | Definition begins when | Preconditions and required decisions | Accountable owner | Evidence needed before use |
|---|---|---|---|---|
| Deferred profile | Observable demand or lifecycle trigger | Requirements, security, exposure, data, hosting, delivery, operations, cost, or ownership decisions | Accountable role | Specification, implementation, verification, and approval evidence |

## Current implementation alignment

Separate the required target from executable evidence. Existing configuration demonstrates current behavior but does not become an accepted architecture choice by implication.

| Concern or requirement | Required target | Current evidence | Alignment | Gap, owner, and follow-up |
|---|---|---|---|---|
| Environment, profile, placement, isolation, configuration, data, migration, exposure, artifact, lifecycle, observability, or `DEP-NNN` concern | Intended architecture | Configuration, infrastructure, manifest, script, run, measurement, or observation | aligned, partial, absent, conflicting, or deferred | Precise limitation and completion evidence |

## Alternatives and consequential decisions

| Concern | Options considered | Current proposal or decision | Rationale and trade-offs | Decision record or resolution condition |
|---|---|---|---|---|
| Environment boundary, placement, isolation, exposure, data lifecycle, artifact promotion, rollback, recovery, or operating model | Viable alternatives including responsible deferral | Proposed or accepted direction | Linked drivers and consequences | `DR-NNNN` or accountable next step |

## Assumptions, risks, and open questions

| Type | Statement | Affected environments, requirements, or topology | Owner | Validation, treatment, resolution, or expiry condition |
|---|---|---|---|---|
| Assumption, deployment risk, limitation, or open question | Material uncertainty without a normative requirement ID | Direct links or named boundaries | Accountable role | Evidence, decision, exercise, implementation finding, or date |

## Cross-artifact handoffs

| Owning artifact or workflow | Required clarification or change | Affected identifiers or boundaries | Owner and completion evidence |
|---|---|---|---|
| Requirements, Software Architecture, Logical Entity Model, Technology, Security, Implementation, CI/CD, Test, Operations, Prototype, Risk, or Decision Records | Precise handoff without redefining the target artifact here | Environments, `DEP-NNN`, nodes, paths, data, lifecycle, or evidence | Accountable role and observable completion |

## Validation status

Record:

- distinct evidenced purposes for current environments and explicit activation conditions for deferred profiles;
- classification of environments, execution profiles, instances, verification contexts, and sandboxes;
- traceability of deployable elements and runtime placement to accepted Software Architecture and Technology;
- stable identifier, normative wording, feasibility, and verifiability checks for `DEP-NNN` requirements;
- proportionate network, identity, secret, data, migration, storage, lifecycle, delivery, rollback, telemetry, administration, recovery, and operational review;
- comparison of target architecture with executable configuration and explicit drift;
- diagram rendering and visual inspection where diagrams exist;
- link and repository validation, skipped checks, evidence limitations, open decisions, and residual risks.

## Sources and related artifacts

Link directly to relevant product and quality requirements, constraints, exclusions, decisions, Software Architecture, Logical Entity Model, Technology, Security and Privacy Architecture, environment specifications, implementation and infrastructure configuration, Test Strategy, CI/CD, prototype and Slice material, delivery evidence, operational runbooks, risks, notation guidance, agent workflows, artifact lifecycle, and Definition of Done.
