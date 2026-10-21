---
name: create-deployment-architecture
description: Collaboratively create, refine, correct, or assess a concrete deployment architecture and its environment specifications, covering environment purpose, runtime placement, isolation, configuration, data, lifecycle, exposure, delivery boundaries, and operational readiness. Use after software architecture, technology, security, and relevant quality constraints are sufficiently established; do not use it to redefine logical architecture, select unsupported technologies, implement infrastructure or CI/CD, write operating runbooks, or claim production readiness without evidence.
---

# Create Deployment Architecture

Create an evidence-aware deployment architecture with the user. Map accepted software structure, technology, security controls, quality needs, delivery constraints, and operating responsibilities to named environments and concrete runtime boundaries. Define only the environments needed for the current lifecycle stage; keep later environments visible through explicit activation conditions rather than inventing their design.

The user's instructions take precedence. Authorization to design deployment architecture permits edits to its authoritative artifacts and directly affected links or diagrams. It does not authorize infrastructure provisioning, external deployment, account or secret changes, pipeline implementation, production access, application implementation, or unrelated repository edits.

## Preserve artifact authority

- Requirements own product behavior, constraints, exclusions, and measurable quality outcomes.
- Software Architecture owns logical modules, contracts, dependencies, consistency, and distribution strategy.
- The Logical Entity Model owns technology-neutral entities and module ownership.
- Technology owns selected products, runtimes, frameworks, data stores, protocols, build tools, and verification technologies.
- Security and Privacy Architecture owns protected assets, trust boundaries, threat treatment, control objectives, and permitted security profiles.
- Deployment Architecture owns environment profiles, runtime-node placement, instance and isolation boundaries, configuration and secret placement, network exposure, data-store placement, lifecycle, delivery topology, and deployment-specific operational qualities.
- An environment specification owns the concrete contract of one environment without duplicating the complete landscape.
- CI/CD owns executable build, verification, packaging, promotion, and deployment automation. Deployment Architecture states the environmental contract that automation must satisfy.
- Implementation configuration and infrastructure-as-code are executable evidence. They do not silently replace the architecture or redefine its requirements.
- Operations owns exact procedures, monitoring operation, backup execution, recovery, support, and incident response.
- Decision records own consequential accepted choices and trade-offs when repository governance requires them.

Do not change an owning artifact merely to make a preferred topology fit. Apply secondary edits only when they are meaning-preserving, necessary for consistency, and within the requested scope. Route material findings to their owning workflow.

## Use deployment terms precisely

- **Environment profile:** a named architectural contract with an independently governed purpose, audience, trust and exposure boundary, topology, configuration class, data policy, lifecycle, and evidence expectations.
- **Execution profile:** a repeatable way to run an environment that changes build form, configuration, tooling, data initialization, or lifecycle without creating a new independently governed environment.
- **Environment instance:** one concrete running realization of an environment profile and optional execution profile, including its processes, containers, configuration, credentials, ports, networks, storage, and data state.
- **Runtime node:** a host, managed runtime, process, container, browser, database-management-system instance, device, or other execution location.
- **Verification execution context:** a controlled local or CI context created to execute checks and produce evidence; it is not a deployment target or promotion stage merely because application components run within it.
- **Execution sandbox:** a subordinate short-lived boundary created inside a verification context for a test suite, migration check, or similar purpose.

The codebase is not an environment discriminator. Development, review, acceptance, and production environments should normally execute the same product code line, even though they may run different identified versions and configuration. A prototype, proof of concept, branch, pipeline job, database, container, or machine is not automatically an environment.

Treat a context as a separate environment only when independent governance of purpose, consumers, trust, exposure, topology, data, lifecycle, promotion, or operational ownership materially requires it. Treat a variation as an execution profile when it remains inside the same environment boundary and mainly changes how that environment is built, initialized, run, inspected, reset, or reviewed. Treat a concrete launch as an instance.

## Load the authoritative context

Before substantive design work:

1. Read every applicable `AGENTS.md`, the repository context map, lifecycle workflow, artifact-lifecycle guidance, requirements-language rules, notation guidance, and definition of done.
2. Read the current Deployment Architecture and every environment specification affected by the request. Read the canonical [Deployment Architecture template](../../../docs/governance/templates/deployment-architecture.md) and [Environment template](../../../docs/governance/templates/environment.md).
3. Read relevant requirements, quality scenarios, constraints, exclusions, decisions, risks, and operating assumptions.
4. Read Software Architecture, Logical Entity Model, Technology, and Security and Privacy Architecture sections that constrain runtime placement or trust boundaries.
5. Read the prototype charter, implementation guidance, tests, local-development guidance, CI/CD material, operational guidance, and risk records only where they establish accepted needs, current facts, executable evidence, or drift.
6. Inspect applicable executable configuration, manifests, lockfiles, containers, profiles, migrations, health endpoints, scripts, and pipeline definitions before describing the current state.

Record the lifecycle status and authority of material inputs. Existing implementation demonstrates current behavior but does not become an accepted architecture choice by implication. When current product versions, managed-service behavior, platform limits, or security capabilities materially affect a decision, verify them against authoritative primary sources and record the verification date.

Preserve established artifact locations and compatible structure. In this repository, maintain the landscape at `docs/operations/deployment-architecture/deployment-architecture.md` using the canonical Deployment Architecture template, and maintain environment specifications beside it as `<name>-environment.md` using the canonical Environment template. Follow the repository topic-growth strategy when the topic has not yet been expanded.

## Select the operating mode and scope

Determine the mode from the request and current artifacts:

- **Initial landscape:** identify required environment profiles, short names, purposes, maturity, dependencies, and activation conditions.
- **Environment specification:** define or refine one environment using the canonical template.
- **Basic Concept or Prototype scope:** establish only the local implementation, review, and verification contracts needed to realize and technically review the selected slice safely.
- **Shared-environment design:** define a justified development, integration, demonstration, acceptance, or other shared environment.
- **Production design:** define production topology only when accepted security, quality, capacity, continuity, support, and operating ownership make the result responsible.
- **Refinement or correction:** change affected topology, boundaries, requirements, decisions, gaps, or links while preserving unaffected identifiers and content.
- **Alignment assessment:** compare specifications with executable configuration and report drift without editing unless changes are authorized.

State the system boundary, environments, execution profiles, runtime elements, lifecycle stage, artifacts, and decisions in scope. Do not infer production scope from a prototype, local Compose file, current workstation, generated project, or cloud product.

## Establish deployment drivers

Use only evidenced drivers that materially affect placement or environment boundaries:

- accepted distribution strategy, deployable units, interfaces, consistency, and external integrations;
- selected runtimes, data stores, packaging, migration, verification, and observability mechanisms;
- trust boundaries, information sensitivity, identities, access paths, secrets, keys, administrative surfaces, and telemetry restrictions;
- availability, performance, scalability, resilience, recovery, retention, data location, portability, and support needs;
- developer concurrency, local reproducibility, review independence, test isolation, artifact promotion, rollback, cost, and operating ownership;
- prototype hypotheses and evidence conditions whose validity depends on environment state.

Classify consequential statements as facts, assumptions, proposals, decisions, recommendations, or open questions. Do not fabricate users, traffic, regions, recovery objectives, availability targets, data classes, hosting policies, budgets, or team capabilities to complete a topology.

## Define the environment landscape

For each candidate environment, establish:

- authoritative profile name and concise short name;
- purpose, consumers, and prohibited uses;
- trust and exposure boundary;
- lifecycle and change cadence;
- data and identity class;
- maturity and whether it is required for the current lifecycle stage;
- applicable environment specification or the trigger that justifies creating one.

Do not assume a universal set or naming sequence such as `LOCAL`, `DEV`, `TEST`, `DEMO`, `STAGE`, or `PROD`. Preserve accepted project names. Combine environments only when their consumers, change cadence, data, access, stability, evidence needs, and operating ownership are compatible. Split them only when a material independent boundary exists.

Keep a deferred environment in the landscape when its future role is known, but do not create a detailed specification merely to fill a matrix. Record its activation condition, prerequisites, and owner.

## Separate environments, execution profiles, and verification

Before adding a landscape row, answer:

1. Is the application interactively developed, reviewed, accepted, demonstrated, or operated there for an independently governed purpose?
2. Does it have its own audience, trust or exposure boundary, configuration authority, data policy, lifecycle, promotion semantics, or operational owner?
3. Would changing or destroying it have consequences independent of another environment?

If the answers are materially yes, define an environment profile. If the difference is a clean build, hot reload, deterministic fixtures, debug tooling, packaging, reset behavior, or similar variation within one boundary, define an execution profile. If the sole purpose is automated checking, define a verification execution context. If it exists only for one test or check, define a sandbox within that context.

A prototype is product scope and maturity, not an environment category. When a prototype is reviewed locally, decide whether reproducibility requires a separate local execution profile or a genuinely separate environment. Keep the code in the same product codebase unless another accepted decision explicitly establishes a disposable implementation.

## Define the shared deployment baseline

Map only accepted logical and technology choices to runtime placement:

- deployable artifacts and their build or package form;
- processes, containers, hosts, managed services, devices, browsers, and data stores;
- instance counts or scaling direction where requirements justify them;
- network paths, origins, ingress, egress, administrative access, and external dependencies;
- runtime identities, configuration, secrets, keys, storage, migrations, and telemetry;
- artifact identity, promotion, rollback, and compatibility expectations.

Do not equate a module, subdomain, entity, repository, schema, container, service, host, or environment. Preserve the accepted distribution strategy and module ownership. If the mapping exposes a logical-architecture or technology problem, record a handoff rather than silently redesigning it.

Record only genuinely project-specific cross-environment requirements in the artifact. Use stable `DEP-NNN` identifiers and the repository's normative requirements language. Preserve IDs while meaning remains stable; retire rather than reuse them. Keep reusable method, decision criteria, and generic best practices in this skill instead of copying them into every project artifact.

## Specify one environment

Use the canonical [Environment template](../../../docs/governance/templates/environment.md) and keep only applicable sections. The specification should be independently reviewable and link to shared deployment requirements rather than duplicate them.

At minimum, establish:

- purpose, consumers, prohibited uses, maturity, and authority;
- runtime topology and deployment-unit placement;
- instance, tenant, workspace, network, process, storage, and failure isolation as applicable;
- execution profiles and the differences they control;
- source or artifact identity, configuration classes, runtime identities, secrets, and keys;
- data class, database placement, migrations, fixtures, persistence, reset, backup, and disposal according to scope;
- network exposure, external integrations, administrative access, and trust boundaries;
- provisioning, deployment, health, startup, shutdown, reset, rollback, retention, and decommission lifecycle where applicable;
- logging, metrics, tracing, diagnostics, monitoring, alerting, and support ownership according to maturity;
- verification and evidence expected before the environment can be used for its declared purpose;
- current implementation evidence, gaps, assumptions, decisions, open questions, and handoffs.

Assign stable environment-requirement identifiers such as `ENV-<KEY>-NNN` only to actual normative statements. Use `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` according to the repository requirements-language standard. Do not assign requirement IDs to placeholders, assumptions, proposals, recommendations, or open questions.

Distinguish the required target from current implementation. A configuration file, running container, or successful manual launch is evidence of current alignment, not proof that isolation, reproducibility, security, recovery, or operability requirements are complete.

Use technical and operational language. Do not insert domain scenarios or illustrative business records unless a domain-specific data class or regulatory boundary materially changes deployment; link to its authoritative source instead of reproducing it.

## Address local environments proportionately

For a local environment, explicitly determine:

- whether each checkout or worktree needs an independent instance;
- whether concurrent instances are supported;
- how project names, ports, credentials, networks, volumes, caches, and databases are scoped;
- which state is persistent, disposable, shared, or prohibited;
- how development, clean review, and local verification avoid influencing one another;
- whether processes run on the host, in containers, or in another local runtime and why;
- whether global tools are modified or repository-local wrappers and containers are used;
- which endpoints bind only to loopback and which optional inspection surfaces are permitted;
- how a clean review identifies its source or artifact, creates deterministic state, verifies health, and resets.

Do not require separate infrastructure merely because two modes have different names. Conversely, do not claim isolation when profiles still share a database-management process, administrator, volume, port, or lifecycle boundary that matters to the intended evidence.

## Keep CI/CD and operations boundaries explicit

Deployment Architecture may require a clean runner, immutable artifact, environment-specific configuration, gated promotion, deployment health, rollback, or evidence retention. It does not implement the pipeline or select a provider without technology and delivery evidence.

Model CI verification as a verification execution context unless it deploys to an independently governed application environment. Keep test containers and temporary databases as sandboxes. Hand executable workflow, runner, cache, artifact-store, credential-injection, and retention design to CI/CD ownership.

Keep exact setup, routine commands, backup operation, incident procedure, and troubleshooting in operational runbooks. Environment specifications define the contract those procedures satisfy.

## Use diagrams only when they add precision

Use the deployment-topology notation established by the repository's notation guidance for concrete runtime nodes and deployed instances when a diagram materially improves understanding; in this repository that is UML deployment diagrams in PlantUML. Use C4 deployment views only where no deployment notation is established. Use UML where precise interaction or state semantics are needed. Keep source beside the owning specification, render it with repository tooling, inspect the result, and never edit a generated image as the source.

Do not create a diagram merely to repeat a small topology table. Never imply an unaccepted service, cluster, region, trust boundary, redundancy model, or scaling topology through layout.

## Collaborate and manage decisions

Ask first about distinctions that change the number or meaning of environments: purpose, consumers, exposure, data class, isolation, lifecycle, review independence, promotion, and ownership. Resolve material choices with the user; make ordinary reversible editorial and mapping choices autonomously.

For each consequential alternative, record the options, drivers, trade-offs, current proposal or decision, and resolution condition. Create or update a decision record when governance requires durable acceptance. Do not turn the user's example into a universal rule or silently convert an assumption into a requirement.

Stop and request direction when safe progress requires an unsupported hosting choice, production exposure, real data, new security authority, an unresolved distribution change, external provisioning, or another material decision outside the requested scope.

## Maintain alignment and handoffs

When the architecture changes, inspect and update affected environment files, diagrams, technology and security links, prototype inputs, implementation guidance, CI/CD contracts, tests, runbooks, risks, and decisions in the same coherent change where authorized.

Route findings precisely:

- behavior or quality gaps to Requirements;
- module, contract, consistency, or distribution gaps to Software Architecture;
- entity-meaning or ownership gaps to the Logical Entity Model;
- unsupported products or mechanisms to Technology;
- trust, identity, authorization, privacy, or control gaps to Security Architecture;
- executable configuration and packaging gaps to Implementation;
- pipeline and promotion gaps to CI/CD;
- procedure, monitoring, backup, recovery, incident, or support gaps to Operations;
- evidence-design gaps to Test;
- prototype scope or hypothesis gaps to the prototype charter.

## Validate and report

Before completion:

1. Confirm every environment has a distinct evidenced purpose or is explicitly deferred with an activation condition.
2. Confirm execution profiles, instances, verification contexts, and sandboxes are not misrepresented as environments.
3. Trace runtime placement to accepted Software Architecture and Technology without redefining them.
4. Check environment-specific requirements for stable IDs, normative wording, feasibility, and verifiability.
5. Check network, identity, secret, data, migration, storage, lifecycle, telemetry, administrative, and operational boundaries proportionately to each environment's maturity.
6. Compare target specifications with executable configuration and record drift instead of concealing it.
7. Render and inspect changed diagrams, validate links and repository structure, and run the definition-of-done checks.
8. Record skipped validation, limitations, unresolved decisions, and residual risks.

Report the environments and execution profiles created or changed, consequential decisions and deferrals, current implementation gaps, affected artifacts, validation performed, and the next accountable handoffs. Do not claim that a draft, local, prototype, or unprovisioned environment is production-ready.
