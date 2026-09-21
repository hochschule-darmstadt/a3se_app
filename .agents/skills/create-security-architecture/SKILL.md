---
name: create-security-architecture
description: Collaboratively create, refine, correct, or assess an evidence-aware security and privacy architecture covering protected assets, trust boundaries, threats, identity and access-control boundaries, security responsibilities, control objectives, and verification. Use after product scope, actors, use cases, architecture, information sensitivity, constraints, and technology context are sufficiently established; do not use it for legal compliance approval, organization-wide information-security management, concrete deployment hardening, penetration testing, or implementation.
---

# Create Security Architecture

Develop an evidence-aware security and privacy architecture with the user. Translate product behavior, information sensitivity, system structure, external interactions, quality requirements, and applicable constraints into protected assets, trust boundaries, threat treatments, control objectives, responsibility boundaries, and verification expectations.

Treat the architecture as a revisable risk model. Later requirements, use-case detail, technology decisions, deployment design, threat findings, prototypes, tests, incidents, or operational evidence may refine or correct it. The user's instructions take precedence. Authorization to design security architecture does not authorize requirements changes, legal conclusions, compliance approval, deployment changes, production access, security testing against live systems, implementation, or unrelated repository changes.

## Preserve artifact authority

- Requirements own intended outcomes, actor goals, behavior, constraints, exclusions, and measurable security, privacy, availability, recovery, and compliance outcomes.
- Actors are business interaction roles, not automatically accounts, credentials, permission sets, or identity-assurance levels.
- Use cases and domain rules own permitted business actions, exceptional behavior, guarantees, purpose, consent, representation, and domain-specific authority.
- Business Objects and the Logical Entity Model own information meaning, identity, lifecycle, relationships, integrity semantics, and module ownership.
- Software Architecture owns modules, contracts, dependency rules, external adapters, consistency boundaries, and distribution strategy.
- Technology owns selected identity, policy, cryptography, secret-management, logging, monitoring, scanning, and security-testing products or libraries.
- Security and Privacy Architecture owns protected-asset classification, trust boundaries, security context, threat treatment, control objectives, security responsibility allocation, and verification expectations.
- Deployment Architecture owns processes, hosts, networks, zones, origins, runtime identities, managed services, key placement, backup topology, and operational access paths.
- Implementation owns framework configuration, authorization code, security headers, physical audit records, logging configuration, database privileges, CI checks, and executable controls.
- Operations owns vulnerability management, incident response, monitoring, privileged access, backup operation, restoration, patching, and runtime evidence.
- Qualified legal, privacy, safety, compliance, and certification authorities own determinations requiring their competence.

Do not silently change an owning artifact to make a security proposal fit. Apply a secondary-artifact edit only when it is meaning-preserving, necessary for consistency, and within the user's requested scope. Hand material missing requirements, domain authority, architecture changes, technology decisions, or operational responsibilities to their owning workflow.

## Use security terms precisely

- **Protected asset:** information, behavior, capability, service, evidence, configuration, credential, or delivery artifact whose compromise causes material harm.
- **Threat actor:** a human, system, process, or environmental source capable of causing a threat; it is distinct from a product actor.
- **Trust boundary:** a boundary across which identity, authority, integrity, confidentiality, availability, administration, or ownership assumptions change.
- **Data flow:** information or command movement between users, processes, stores, devices, modules, or external systems.
- **Threat:** a plausible adverse action or condition affecting a protected asset in an identified context.
- **Risk:** plausible harm combined with likelihood or exposure, assessed using the repository's accepted method when one exists.
- **Control objective:** a technology-independent outcome or architecture rule intended to prevent, detect, limit, recover from, or evidence a threat.
- **Control mechanism:** a selected product, protocol, configuration, process, or implementation that realizes a control objective.
- **Authentication:** establishment of a subject's asserted identity at a stated assurance level.
- **Authorization:** a decision whether a subject may perform an action on a resource in a particular context and purpose.
- **Security context:** verified identity, assurance, role, organization, location, purpose, relationship, delegation, or other claims relevant to a decision.
- **Business audit evidence:** domain-significant authorship, provenance, approval, correction, or transition history.
- **Security audit evidence:** records supporting detection, accountability, privileged-access review, or incident investigation.

Do not equate authentication with authorization; an actor with a role; navigation visibility with permission; organization membership with data access; a module with a trust zone; encryption with complete protection; logging with auditability; framework defaults with a security architecture; or standards alignment with certification or legal compliance.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md` and the repository context map.
2. Follow the requirements, architecture, technology, operations, test, and decision reading paths relevant to the declared scope.
3. Read the Product Vision, glossary, actors, use cases in scope, domain rules, Business Objects, functional and non-functional requirements, constraints, exclusions, necessary source evidence, and applicable decisions.
4. Read the Software Architecture, Logical Entity Model, Technology, Deployment Architecture, existing Security and Privacy Architecture, migration material, tests, operational responsibilities, and implementation evidence that legitimately constrain the work.
5. Read the canonical [Security and Privacy Architecture template](../../../docs/governance/templates/security-architecture.md) and applicable artifact-lifecycle, continuous-alignment, risk, requirements-language, notation, diagram-tooling, and definition-of-done guidance.

Record the lifecycle status and authority of material inputs. Draft requirements and coarse use cases may support a draft security architecture, but preserve their uncertainty. Do not turn a plausible permission, retention period, legal obligation, identity-assurance level, cryptographic choice, threat likelihood, or operational responsibility into an accepted fact by implication.

Preserve the repository's established artifact location and compatible structure. In this repository, maintain the authoritative artifact at `docs/architecture/security-architecture.md`.

## Select the operating mode and scope

Determine the mode from the request and current artifacts:

- **Initial architecture:** establish the first reviewable assets, trust boundaries, threat assessment, control objectives, responsibilities, and verification plan.
- **Refinement or correction:** reopen affected assets, boundaries, threats, controls, responsibilities, assumptions, risks, or verification while preserving unaffected content and identifiers.
- **Selected-slice elaboration:** deepen security and privacy design for named use cases, modules, integrations, data flows, or a coherent vertical slice without pretending the whole system is complete.
- **Prototype or PoC profile:** define a constrained security baseline, mocked controls, isolation, synthetic-data rules, evidence, and residual risks for non-production validation.
- **Alignment assessment:** compare the architecture with current requirements, software and entity architecture, technology, deployment, tests, implementation, or operations and report findings without writing unless changes are authorized.
- **Early draft:** when explicitly requested, record a provisional architecture once its evidence, limitations, and high-risk unknowns are clear enough not to mislead.

On every later invocation, load the current protected assets, trust boundaries, control IDs, threat treatments, open risks, assumptions, decisions, and neighboring artifacts before proposing changes. Treat the current architecture as a baseline, not unquestionable truth.

State the product boundary, environments, channels, actors, data flows, modules, integrations, use cases or slices, and decisions in scope. Do not infer production readiness from an executable prototype, technology selection, framework capability, passed unit tests, or the existence of an authentication screen.

## Establish drivers and protected assets

Build a visible evidence inventory from:

- personal, health, financial, credential, operational, intellectual-property, and other sensitive information;
- clinical, safety, legal, financial, privacy, contractual, certification, and continuity harms;
- actor goals, misuse opportunities, corrections, exceptional behavior, and guarantees;
- information identity, provenance, history, retention, deletion, export, and migration lifecycles;
- external systems, devices, organizations, users, operators, environments, and supply-chain participants;
- availability, recovery, integrity, confidentiality, authenticity, accountability, and non-repudiation scenarios;
- accepted standards, policies, decisions, platform constraints, and deployment facts.

Classify assets only as far as evidence supports. State the harm and handling consequence of each classification rather than copying a generic scheme. Classify consequential statements as facts, assumptions, proposals, decisions, recommendations, open questions, or risks.

Use current primary sources when an exact external standard, law, regulatory rule, or product behavior must be verified, and retain the version or date relevant to the decision. Distinguish an applicable obligation from the proposed architecture and never provide legal or certification approval.

## Model data flows and trust boundaries

Identify users, processes, stores, modules, devices, external systems, administrative paths, build systems, and operational services involved in scope. Trace material information and command flows among them.

Create a trust boundary when assumptions materially change in identity, authority, ownership, purpose, jurisdiction, process, host, network, environment, device, confidentiality, integrity, availability, administration, or delivery authority. Assign stable `TB-NNN` identifiers when boundaries enter the authoritative architecture. Preserve IDs while meaning continues and never reuse retired IDs.

Do not create a trust boundary merely because two modules or layers differ. A module boundary may require policy enforcement without forming a separate network or administrative zone.

Use a data-flow or trust-boundary diagram when it materially improves analysis. Follow repository notation guidance, keep its authoritative source beside the artifact where applicable, show trust boundaries explicitly, and avoid inventing deployment topology.

## Identify and assess threats

Apply STRIDE to each material process, flow, store, external participant, and trust boundary as a systematic prompt, not as a substitute for contextual judgment. Add privacy, safety, fraud, misuse, insider, supply-chain, migration, recovery, or availability scenarios where product evidence warrants them.

For each material threat record the affected asset and boundary, plausible threat actor or adverse condition, precondition and path, potential harm, current controls, proposed prevention, detection, limitation, recovery and evidence objectives, residual uncertainty or risk, owner, and resolution condition.

Use the repository's accepted risk scale where available. Otherwise describe severity and confidence qualitatively and avoid fabricated numeric likelihoods. Assign stable threat or risk identifiers only when the repository treats them as authoritative tracked elements. Do not imply that a checklist, scanner, threat-modeling session, or absence of known findings proves security.

## Derive control objectives

Derive controls from identified assets, flows, boundaries, threats, requirements, and decisions. Assign stable `SEC-ARCH-NNN` identifiers to control objectives entering the authoritative architecture. A control objective states an outcome and verification intent, not a product name or configuration recipe.

Consider, where evidenced:

- trusted server-side or owning-component enforcement;
- default denial and least privilege;
- object-, context-, purpose-, relationship-, and organization-aware authorization;
- minimum collection, disclosure, export, and logging;
- input validation, output handling, safe failure, and abuse resistance;
- provenance, integrity, correction, concurrency, and tamper evidence;
- secret, key, credential, and session lifecycle;
- protected transport and storage;
- separation of duties and privileged access;
- availability, isolation, graceful degradation, backup, recovery, and reconciliation;
- verifiable source, dependency, build, artifact, migration, and release integrity;
- monitoring, investigation, notification, and incident response.

Link each control objective to its driver and define proportionate verification. Do not add a control merely because it is conventional if no relevant asset, threat, requirement, or policy justifies it. Do not omit a high-impact threat merely because its mechanism is undecided.

## Define identity and authorization boundaries

Separate business actors from digital subjects, accounts, service identities, devices, credentials, roles, entitlements, and sessions. For every channel determine, only as far as evidence supports, identity ownership and lifecycle, proofing and authentication assurance, session and credential lifecycle, recovery and revocation, distinct human and non-human identities, decision context, enforcement location, and exceptional or delegated authority.

A role may be one authorization input but must not silently become the complete policy. Test whether action, resource, organization, location, purpose, customer or patient relationship, care or case context, time, delegation, and cross-organization arrangement matter. Navigation and frontend state may communicate authorization but never replace authoritative enforcement.

Allocate domain-specific policy to the module or capability owning the protected action and information. A common identity or policy mechanism may carry verified context and execute reusable primitives without becoming the owner of every domain decision. Introduce a dedicated identity, access, consent, policy, or audit module only when its behavior and lifecycle are cohesive and evidenced.

## Allocate security responsibilities

For every module, interface, adapter, external integration, data store, frontend, delivery system, and operational boundary in scope, state its security responsibility and explicit non-responsibilities.

- Owning modules authorize their behavior and filter disclosed information.
- Composition and read-model capabilities must not broaden access granted by source owners.
- Cross-module calls carry only required verified security context; the supplying module makes its own decision.
- Shared runtime or storage does not permit direct access to another module's repositories, tables, internal types, or protected data.
- Integration adapters authenticate peers, validate untrusted input, constrain outbound disclosure, and handle replay, duplication, failure, and credential lifecycle as required.
- Frontends present context and denials safely but remain outside the authoritative enforcement boundary.
- Deployment and Operations own runtime isolation and privileged paths once the physical environment is known.

Do not make Security a catch-all owner of business authorization, domain audit meaning, privacy authority, operational response, or every cross-cutting mechanism.

## Address privacy, audit, and operations

Trace collection, creation, use, disclosure, correction, restriction, export, retention, archival, deletion, backup, restoration, migration, support, and derived representations for sensitive information in scope. Include logs, search indexes, caches, analytics, documents, media, temporary files, replicas, backups, and test data where relevant.

Do not invent consent as a universal basis, retention durations, deletion guarantees, legal holds, representative authority, data residency, or anonymization claims. Record missing authority and prevent implementation assumptions from deciding it accidentally.

Define purpose, owner, protected content, access, integrity, retention, and verification separately for business history, security audit evidence, operational telemetry, and compliance evidence. Prevent telemetry from becoming an uncontrolled secondary data store or exposing credentials, tokens, secrets, unnecessary personal content, full request bodies, or sensitive query results.

## Define a prototype or PoC profile when relevant

When a prototype or PoC is in scope, state whether it is isolated, externally exposed, connected to real systems, disposable, or intended to evolve. Define permitted data, environment exposure, mocked or real controls, secrets handling, integration restrictions, minimum positive and denied scenarios, required checks, residual threats, non-goals, and evidence produced.

Synthetic data and isolation reduce consequence but do not validate production security. A prototype identity or bypass must be impossible to enable accidentally in production. If the purpose is to validate a security mechanism, do not mock the mechanism under test.

## Reconcile neighboring artifacts

Use accepted technology and deployment decisions as constraints and verify that they can realize the control objectives. Hand product, library, protocol, and mechanism selection to Technology unless explicitly in scope; physical zones and runtime placement to Deployment Architecture; executable controls to Implementation; and monitoring, vulnerability management, incident response, privileged access, backup operation, and recovery exercises to Operations.

Implementation and operational findings may reveal missing threats or infeasible controls. Feed findings back without treating current code or infrastructure as automatic authority.

## Determine readiness

An early draft is ready when its scope, input maturity, highest-impact assets and boundaries, material threats, proposed controls, assumptions, and limitations are explicit enough not to mislead.

A reviewable architecture is ready for its declared scope when:

- material assets and harms are identified and linked to evidence;
- relevant flows and trust boundaries are explicit and stably identified where authoritative;
- threats cover applicable STRIDE and contextual privacy, safety, misuse, operational, migration, and supply-chain concerns;
- control objectives trace to threats or requirements and have verification expectations;
- identity, authentication, session, authorization, and security-context responsibilities are separated;
- module, integration, frontend, persistence, delivery, deployment, and operational responsibilities align with their owning artifacts;
- privacy and information-lifecycle implications include derived and operational copies;
- audit, business history, and telemetry are not conflated;
- prototype and production controls are distinguished where applicable;
- assumptions, accepted and residual risks, open questions, owners, and handoffs are visible;
- no unsupported claim of compliance, certification, penetration-test assurance, or production readiness is made.

Do not demand product-wide completeness for a selected slice. Do not hide a high-impact unresolved identity, authorization, disclosure, safety, or operational question behind a generic control statement.

## Confirm before writing

Present a concise synthesis of scope and input status; protected assets and harms; data flows and trust boundaries; material threats and residual risks; proposed controls and verification; identity and authorization boundaries; responsibility allocation; privacy, audit, recovery, and supply-chain implications; prototype profile where applicable; alternatives, assumptions, decisions, open questions, and handoffs.

Ask the user to confirm or correct the synthesis before material writes unless they explicitly request an immediate provisional draft. Confirmation means the architecture reflects current understanding; it does not make it accepted, complete, compliant, or production-ready.

## Create or update the security architecture

After confirmation, or immediately for an explicitly requested provisional draft:

1. Update the authoritative Security and Privacy Architecture at the established repository location.
2. Use the canonical [Security and Privacy Architecture template](../../../docs/governance/templates/security-architecture.md) while preserving compatible established structure.
3. Assign and preserve stable `TB-NNN` and `SEC-ARCH-NNN` identifiers; record material evolution when meaning changes.
4. Create or update a data-flow or trust-boundary diagram when it materially improves threat analysis or review.
5. Keep a new or materially changed artifact in `draft` unless the accountable architecture authority explicitly assigns another status.
6. Link requirements, actors, use cases, entities, modules, technologies, decisions, deployment, tests, implementation, and operations rather than duplicating their authority.
7. Apply only authorized, meaning-preserving secondary-artifact repairs. Produce precise handoffs for material changes owned elsewhere.
8. Do not implement controls, reconfigure environments, probe live systems, create accounts or credentials, access sensitive data, or declare compliance unless separately requested and authorized.

## Validate and report

Verify that:

- `TB-*` and `SEC-ARCH-*` identifiers are unique and consistent across text and diagrams;
- every material asset, flow, boundary, and threat in scope is accounted for;
- every control objective traces to evidence or a threat and has proportionate verification;
- responsibilities align with Software Architecture, Technology, Deployment, Implementation, and Operations;
- authentication is not treated as authorization and roles or organizational membership do not silently grant object access;
- sensitive information is minimized in contracts, errors, logs, exports, and derived stores;
- privacy lifecycle, audit, recovery, migration, supply-chain, and privileged-access concerns are addressed proportionately;
- prototype limitations and production obligations remain distinct;
- mechanisms are not presented as proof of outcomes;
- assumptions, alternatives, open questions, residual risks, decisions, and handoffs remain visible;
- links resolve and diagrams render and remain legible.

Run repository documentation, diagram, and architecture validation when available. If configured tooling is unavailable or unrelated checks fail, perform feasible focused checks and report the skipped validation and impact rather than expanding the task.

Report changed files, lifecycle status, scope, boundary and control changes, material threats and treatments, identity and authorization conclusions, privacy and operational implications, prototype profile, decisions, handoffs, validation results, remaining assumptions, and residual risks. Do not present a draft as accepted, compliant, certified, penetration-tested, production-ready, or secure by construction.
