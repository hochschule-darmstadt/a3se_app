---
name: create-technology
description: Collaboratively create, refine, correct, or assess a justified technology baseline mapping accepted architecture, security, quality, delivery, and operational needs to languages, frameworks, data stores, integration mechanisms, build tooling, and verification technologies with explicit usage boundaries and validation. Use after software architecture and relevant constraints are sufficiently established; do not use it to redefine requirements or logical architecture, design concrete deployment infrastructure, create implementation code, or select products without evidence.
---

# Create Technology

Develop an evidence-aware technology baseline with the user. Translate accepted or explicitly provisional architecture, quality, security, delivery, integration, data, and operational needs into a coherent set of technology selections, usage boundaries, compatibility expectations, alternatives, and validation work.

Treat the baseline as a revisable solution design. Later use-case detail, architecture refinement, prototypes, implementation, testing, security assessment, deployment design, operations, support information, or product lifecycle changes may refine or replace a selection. The user's instructions take precedence. Authorization to select technologies does not authorize requirements changes, logical architecture redesign, infrastructure provisioning, dependency installation, implementation, external purchases, production changes, or unrelated repository edits.

## Preserve artifact authority

- Requirements own product behavior, constraints, exclusions, and measurable quality outcomes.
- Software Architecture owns modules, responsibilities, internal dependency rules, contracts, consistency boundaries, and distribution strategy.
- The Logical Entity Model owns technology-neutral entities, value structures, relationships, integrity semantics, and module ownership.
- Security and Privacy Architecture owns protected assets, trust boundaries, threat treatment, control objectives, and security responsibility allocation.
- Technology owns selected languages, runtimes, frameworks, database products, protocols, libraries, build and package tools, test technologies, and their justified usage boundaries.
- Decision records own accepted consequential selections, rejected alternatives, and trade-offs when governance requires a durable decision.
- Deployment Architecture owns concrete processes, containers, hosts, networks, regions, environments, managed services, scaling topology, secrets placement, and runtime operations.
- Implementation owns source layout, packages, classes, configuration, physical schemas, migrations, dependency manifests, lockfiles, exact resolved versions, and executable behavior.
- Test owns independent verification design and evidence; tool selection does not define acceptance.
- Operations owns production monitoring, patching, vulnerability management, backup execution, recovery, incident response, and support procedures.

Do not silently change an owning artifact to justify a preferred product. Apply a secondary-artifact edit only when it is meaning-preserving, necessary for consistency, and within the user's requested scope. Hand material requirement, architecture, security, deployment, test, or operational changes to their owning workflow.

## Use technology terms precisely

- **Technology concern:** a capability requiring a technical mechanism, such as browser UI, application runtime, persistence, integration, build, testing, or observability.
- **Technology option:** a product, language, framework, protocol, library, tool, or managed capability considered for a concern.
- **Selection:** the current proposed or accepted option for a defined usage boundary.
- **Usage boundary:** the parts of the solution and purposes for which a selection is permitted, required, optional, or excluded.
- **Technology baseline:** the coherent set of selections and policies sufficient for the declared architecture scope or vertical slice.
- **Compatibility set:** versions and products known or required to work together; it is distinct from an exact resolved dependency graph.
- **Version policy:** rules for selecting, recording, updating, supporting, and retiring versions.
- **Validation spike:** bounded executable work that answers a named uncertainty without becoming product scope by implication.
- **Non-selection:** a product or mechanism deliberately not chosen, or deferred until a stated trigger occurs.

Do not equate a logical module with a framework module, package, process, service, container, repository, schema, or deployment unit. Do not equate choosing a database with defining the physical data model; choosing a protocol with defining an API; choosing a test framework with defining acceptance; choosing a security library with satisfying a control objective; or choosing a cloud or container technology with an accepted Deployment Architecture.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md` and the repository context map.
2. Follow the architecture and technology reading path and read the current Technology artifact and canonical [Technology template](../../../docs/governance/templates/technology.md).
3. Read the Product Vision, relevant use cases and domain rules, functional and non-functional requirements, constraints, exclusions, source evidence needed to interpret uncertainty, and applicable decisions.
4. Read the Software Architecture, Logical Entity Model, Security and Privacy Architecture, external boundaries, consistency needs, and unresolved architecture questions.
5. Read Deployment Architecture, implementation guidance, dependency manifests, tests, CI/CD, operations, migration material, and prototypes only where they establish accepted constraints, current evidence, compatibility facts, or drift.
6. Read applicable artifact-lifecycle, continuous-alignment, decision, requirements-language, notation, tooling, and definition-of-done guidance.

Record the lifecycle status and authority of material inputs. Draft architecture and coarse quality requirements may support a draft technology baseline when uncertainty and validation needs remain explicit. Do not promote an implementation convenience, familiar product, current codebase, or prototype choice into an accepted constraint by implication.

Preserve the established artifact location and compatible structure. In this repository, maintain the authoritative technology baseline at `docs/architecture/technology.md`.

## Select the operating mode and scope

Determine the mode from the request and current artifacts:

- **Initial baseline:** establish the first coherent set of technology selections, boundaries, alternatives, policies, and validation work.
- **Refinement or correction:** reopen affected selections, versions, boundaries, alternatives, or assumptions while preserving unaffected content and decisions.
- **Selected-slice baseline:** select only the technologies required for named use cases, modules, integrations, or a coherent vertical slice.
- **Prototype or PoC baseline:** minimize the stack while retaining enough production-like behavior to validate the named architecture and technology hypotheses.
- **Option assessment:** compare candidates against explicit drivers and report a recommendation without writing unless changes are authorized.
- **Alignment assessment:** compare Technology with architecture, security, deployment, implementation, tests, operations, or support status and report drift or gaps.
- **Early draft:** when explicitly requested, record provisional selections once their purpose, evidence, alternatives, and limitations are clear enough not to mislead.

On every later invocation, load current selections, usage boundaries, non-selections, alternatives, version policy, decisions, assumptions, open questions, and validation evidence before proposing changes. Treat the current baseline as a starting point, not an unquestionable standard.

State the system, environments, modules, use cases or slices, technology concerns, artifacts, and decisions in scope. Do not infer production scope from a prototype, dependency manifest, generated project, current developer machine, or vendor offering.

## Establish technology drivers

Build a visible inventory of material drivers, including only those supported by evidence:

- architecture style, module boundaries, dependency rule, distribution strategy, contracts, and consistency needs;
- browser, endpoint, device, external-system, data-location, interoperability, migration, or certification constraints;
- data shape, transaction, query, history, media, search, volume, and retention needs;
- security trust boundaries, identity and authorization needs, control objectives, secret and key responsibilities, and supply-chain expectations;
- performance, availability, scalability, resilience, accessibility, usability, observability, recovery, maintainability, portability, and support horizons;
- delivery skills, build reproducibility, testability, licensing, cost, ecosystem maturity, operational capability, and organizational policy;
- prototype questions and evidence required before commitment.

Classify consequential statements as facts, assumptions, proposals, decisions, recommendations, or open questions. Do not fabricate performance targets, team skills, hosting constraints, compliance requirements, volumes, support periods, budgets, or integration protocols to complete a comparison.

## Build the technology concern map

Identify only concerns required by the declared scope. Typical concerns include:

- programming languages and runtime platforms;
- backend and frontend application frameworks;
- interaction and interface protocols;
- primary persistence and specialized storage;
- data-access and migration tooling;
- identity, authorization, cryptography, secret, and security-testing mechanisms;
- build, packaging, dependency, and artifact management;
- unit, component, integration, contract, browser, performance, resilience, and architecture testing;
- logging, metrics, tracing, diagnostics, and health interfaces;
- local development and reproducible dependency runtime;
- device, desktop, mobile, batch, messaging, media, reporting, search, or analytics technologies where evidenced.

Do not populate every category by default. An unresolved concern is preferable to a gratuitous product. Separate a required capability from the selected mechanism and record the trigger for later selection.

## Evaluate options proportionately

For each consequential concern:

1. State the capability and scope the technology must serve.
2. Link the architecture, requirement, security, operational, or delivery drivers.
3. Identify viable candidates, including retaining an existing selection or making no selection yet.
4. Compare candidates using criteria relevant to this decision rather than a generic feature checklist.
5. Examine compatibility with the rest of the proposed baseline and the cost of operating, testing, updating, and replacing it.
6. Identify licensing, lifecycle, vendor, ecosystem, supply-chain, and support implications.
7. Define a validation spike when decisive uncertainty cannot be resolved responsibly from evidence alone.
8. Record the proposal, rejected alternatives, consequences, confidence, and decision or resolution condition.

When exact current versions, support windows, licenses, vulnerabilities, compatibility matrices, or vendor capabilities matter, verify them against current primary documentation. Record the verification date and avoid relying on memory or secondary summaries. Do not browse merely to decorate a decision whose required evidence already exists locally.

Prefer the smallest coherent baseline that satisfies the known drivers. A familiar, popular, modern, or feature-rich technology is not self-justifying. Avoid overlapping frameworks and infrastructure products until a distinct responsibility or constraint warrants them.

## Define usage boundaries and architecture mapping

For every selection state:

- the concern and permitted purpose;
- the modules, layers, interfaces, adapters, environments, or slices to which it applies;
- what it must not own or expose;
- its interaction with logical architecture and security boundaries;
- compatibility and lifecycle expectations;
- deployment, implementation, test, and operational consequences;
- reconsideration triggers.

Preserve module-first structure when the Software Architecture establishes it. A framework must support module boundaries rather than replace them with global technical layers or shared persistence models. External products and protocols remain behind the owning module's ports and adapters. Frontend and API models do not become persistence or domain models by default.

## Define version and dependency policy

Use authoritative build and dependency files for exact versions once implementation exists. The Technology artifact should normally define:

- supported release posture, such as maintained stable or LTS lines where available;
- compatibility requirements among runtimes, frameworks, build tools, databases, drivers, and test tools;
- lockfile, wrapper, dependency-resolution, repository, provenance, and reproducibility expectations;
- update cadence and review criteria;
- vulnerability and end-of-support response;
- rules for preview, milestone, snapshot, unmaintained, transitive, or duplicate dependencies;
- where exact selected versions and generated inventories remain authoritative.

Do not maintain a second manually copied dependency inventory in the architecture artifact. Record an exact version there only when the version itself is a consequential constraint or decision.

## Address data and integration technology without designing them prematurely

A database selection establishes a persistence platform, not one table per logical entity, a cross-module shared model, identifier format, indexing plan, or complete physical schema. Preserve module ownership and hand physical models and migrations to implementation planning.

A protocol or interface technology establishes interaction mechanics, not endpoint semantics, payloads, messages, compatibility promises, or authorization behavior. Define those contracts only when the owning use cases and architecture justify them.

Evaluate messaging, caching, search, object storage, graph, time-series, workflow, streaming, and other specialized products only when a distinct driver exceeds the capabilities or suitability of the simpler baseline. Record explicit non-selections and reconsideration triggers where they prevent accidental proliferation.

## Address security, verification, delivery, and operations

Map accepted security control objectives to candidate or selected technology mechanisms without treating product presence as control effectiveness. Keep identity provider, policy engine, cryptography, secret management, scanning, logging, and monitoring unresolved until requirements and deployment context support a responsible selection.

Select verification tools according to required evidence. Distinguish domain tests, module tests, database integration tests, interface contracts, browser behavior, accessibility, performance, resilience, security, architecture rules, migration, packaging, and operational checks. Test technology does not define the acceptance criterion it executes.

Define the smallest reproducible build and local execution path suitable for the declared scope. Do not turn local containers, development servers, or packaged prototype choices into production topology. Record consequences and handoffs for CI/CD, Deployment Architecture, Operations, support, backup, recovery, and observability.

## Define prototype validation when relevant

For a prototype or PoC baseline, state the hypotheses and select only the technologies needed to exercise them. Record which parts are production-like, mocked, reduced, deferred, or deliberately excluded.

At minimum, consider evidence for:

- clean and reproducible build;
- application startup and principal component integration;
- module and dependency boundaries;
- representative persistence and migration behavior;
- interface behavior and error handling;
- applicable security enforcement and denied scenarios;
- representative automated tests;
- packaging or execution path;
- dependency inventory and unexplained infrastructure.

A successful prototype demonstrates the declared hypotheses only. It does not prove scalability, security, compliance, operability, supportability, or production readiness unless those qualities were explicitly tested with suitable evidence.

## Determine readiness

An early draft is ready when its scope and input status are explicit, each selection is visibly provisional or accepted, usage boundaries and material alternatives are visible, and unresolved high-impact concerns are not hidden.

A reviewable baseline is ready for its declared scope when:

- every selection traces to architecture, requirements, security, delivery, operational, or validation evidence;
- required technology concerns are covered or explicitly deferred with triggers;
- the complete selection set is mutually compatible at the claimed level;
- usage boundaries prevent frameworks and products from redefining module, entity, contract, security, or deployment authority;
- alternatives and non-selections explain consequential trade-offs;
- version, dependency, support, licensing, provenance, update, and retirement expectations are proportionate;
- prototype and production claims are clearly distinguished;
- verification can test the material hypotheses and qualities;
- decisions, assumptions, open questions, limitations, and cross-artifact handoffs are explicit;
- no concrete infrastructure, physical data model, API design, or implementation detail is presented without authority.

Do not require system-wide selection completeness for a selected slice. Do not propose acceptance while an unresolved compatibility, lifecycle, licensing, security, support, or operational issue makes the baseline irresponsible.

## Confirm before writing

Present a concise synthesis of:

- operating mode, scope, and material input status;
- technology drivers and concern map;
- proposed selections and usage boundaries;
- compatibility and version policy;
- data, integration, security, build, test, and operational implications;
- prototype validation where applicable;
- alternatives, non-selections, assumptions, open questions, decisions, and handoffs.

Ask the user to confirm or correct the synthesis before material writes unless they explicitly request an immediate provisional draft. Confirmation means the baseline reflects current understanding; it does not make it accepted, complete, implementation-ready, production-ready, supported, or secure.

## Create or update the Technology artifact

After confirmation, or immediately for an explicitly requested provisional draft:

1. Update the authoritative Technology artifact at the established repository location.
2. Use the canonical [Technology template](../../../docs/governance/templates/technology.md) while preserving compatible established structure.
3. Keep a new or materially changed artifact in `draft` unless the accountable architecture authority explicitly assigns another status.
4. Link requirements, modules, entities, security controls, deployment constraints, decisions, tests, implementation, operations, and primary product documentation rather than duplicating their authority.
5. Record accepted consequential choices in decision records where governance requires it.
6. Use exact versions in the artifact only when they are consequential; otherwise leave exact resolved versions to executable build and dependency files.
7. Apply only authorized, meaning-preserving secondary-artifact repairs and produce precise handoffs for material changes owned elsewhere.
8. Do not install dependencies, scaffold projects, write implementation code, provision infrastructure, change CI/CD, or create vendor accounts unless separately requested and authorized.

## Validate and report

Verify that:

- every selected technology has a stated concern, usage boundary, driver, rationale, and validation path;
- selection status agrees with linked decision records and no draft proposal is presented as accepted;
- material alternatives and non-selections are represented fairly;
- selected products and versions are mutually compatible at the evidenced level;
- current product, support, version, license, and vulnerability claims cite authoritative evidence when material;
- module, layer, entity, persistence, interface, security, deployment, and operational boundaries remain intact;
- exact versions are not duplicated inconsistently with build files;
- prototype limitations and production obligations remain distinct;
- assumptions, open questions, reconsideration triggers, and handoffs remain visible;
- links resolve and repository validation passes where applicable.

Run feasible documentation and architecture validation. If configured tooling is unavailable or unrelated checks fail, perform focused checks and report the skipped validation and impact rather than expanding the task.

Report changed files, lifecycle status, selections and non-selections, usage boundaries, compatibility and version findings, material alternatives, decision-record needs, prototype evidence, handoffs, validation results, remaining assumptions, and residual limitations. Do not present a draft baseline as accepted, complete, implementation-ready, production-ready, secure, compliant, or vendor-supported without corresponding authority and evidence.
