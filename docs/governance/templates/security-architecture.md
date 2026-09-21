# Security and Privacy Architecture

- Status: draft
- Owner: Architecture
- Last reviewed: YYYY-MM-DD

Use this template for the authoritative Security and Privacy Architecture. Replace all instructional text and placeholders with evidence-supported content. The artifact translates protected assets, information sensitivity, product behavior, system structure, external interactions, constraints, and risk evidence into trust boundaries, threat treatments, security responsibilities, control objectives, and verification expectations.

The artifact does not establish legal compliance, certification, organization-wide information-security management, concrete deployment topology, product selection, hardening configuration, penetration-test results, or implemented control effectiveness. Link to their authoritative artifacts and evidence rather than duplicating or implying them.

Assign stable `TB-NNN` identifiers when a trust boundary enters the authoritative architecture and stable `SEC-ARCH-NNN` identifiers when a control objective enters it. Preserve an identifier while the same meaning continues; retire rather than reuse an identifier whose meaning no longer applies.

Classify consequential statements as facts, assumptions, proposals, decisions, recommendations, open questions, or risks. A `draft` architecture may contain explicit proposals without presenting them as accepted requirements, legal determinations, implemented controls, or evidence of security.

## Purpose and architecture boundary

State the product, system, environment, channel, integration, module, use-case, or vertical-slice scope. Identify the operating mode and the decisions this artifact owns. Distinguish what remains authoritative in Requirements, Actors, Use Cases, Domain Rules, the Logical Entity Model, Software Architecture, Technology, Deployment Architecture, Implementation, Operations, Test, and qualified legal, privacy, safety, compliance, or certification review.

Record the lifecycle status and authority of material inputs. Draft requirements and coarse use cases may support a draft architecture when uncertainty, impact, and validation needs remain explicit.

## Security posture and principles

State the security and privacy posture that guides decisions in this scope. Include only principles supported by requirements, risk, or accepted policy, such as default denial, least privilege, trusted enforcement, minimum disclosure, defense in depth, secure failure, provenance, recoverability, or verifiable change.

Explain what each principle means for this product. Do not use slogans as substitutes for responsibility, threat treatment, or verification.

## Security drivers and evidence

| Driver | Source and lifecycle status | Security or privacy consequence | Confidence, limitation, or validation need |
|---|---|---|---|
| Requirement, use case, information lifecycle, constraint, policy, external obligation, decision, or observed risk | Direct link and status | Asset, boundary, threat, control, responsibility, or verification implication | Missing authority, uncertainty, or next evidence |

Distinguish an applicable obligation or stakeholder need from the architecture proposed to address it. Link current primary sources when an exact external rule or standard materially affects the design.

## Protected assets and information classification

Describe the classification scheme used in this scope and the harm represented by each class. Do not introduce an unexplained generic classification.

| Class or asset ID | Protected information, capability, service, evidence, or delivery asset | Principal harms | Lifecycle and handling consequence | Evidence and status |
|---|---|---|---|---|
| Domain-relevant class or stable asset ID where used | Representative contents and authority | Confidentiality, integrity, availability, privacy, safety, financial, operational, or compliance harm | Collection, disclosure, change, retention, recovery, administration, or verification expectation | Direct source and lifecycle status |

State where credentials, secrets, keys, session material, policy, configuration, backups, logs, build artifacts, and other non-domain assets belong when they are in scope.

## Security context

Describe the verified context available to security decisions, such as subject identity and assurance, business role, action, resource, organization, location, purpose, customer or patient relationship, care or case context, delegation, representation, time, device, service, or operating arrangement.

Do not treat an actor, role, organization membership, frontend route, possession of an identifier, or successful authentication as sufficient authorization unless authoritative behavior explicitly establishes that rule.

## Data flows and trust boundaries

Embed or link a data-flow or trust-boundary view when it materially improves analysis. Show relevant users, processes, stores, modules, devices, external systems, operational services, administrative paths, and information flows without inventing deployment topology.

Explain how to read the view and which physical details remain unresolved.

### Trust-boundary catalog

| ID | Boundary | Trust distinction | Information or operations crossing | Required treatment | Evidence and status |
|---|---|---|---|---|---|
| `TB-NNN` | Named boundary | Change in identity, authority, ownership, purpose, administration, process, network, environment, or assurance | Material flows | Authentication, authorization, validation, confidentiality, integrity, availability, recovery, monitoring, or other objectives | Source and status |

Do not equate a module or layer boundary with a network trust zone. State whether each boundary is logical, organizational, environmental, physical, or unresolved.

## Threat assessment

Use STRIDE against material processes, flows, stores, participants, and trust boundaries, supplemented by privacy, safety, fraud, misuse, insider, supply-chain, migration, recovery, or operational threats when relevant.

| Threat or risk ID where tracked | Category and scenario | Threat actor or adverse condition | Affected assets, flows, or boundaries | Harm and current exposure | Existing or proposed treatment | Residual risk, owner, and resolution condition |
|---|---|---|---|---|---|---|
| Stable identifier or local reference | Concrete contextual threat, not only a category label | Plausible source | Direct IDs or links | Consequence and evidence-supported severity or confidence | Prevention, detection, limitation, recovery, and evidence objectives | Explicit uncertainty or accepted-risk authority |

Use the repository's accepted risk method where one exists. Do not invent numeric likelihoods or claim completeness merely because every STRIDE category appears.

## Security control objectives

| ID | Control objective | Driver or threat | Architectural rule and responsibility | Verification expectation | Status |
|---|---|---|---|---|---|
| `SEC-ARCH-NNN` | Technology-independent outcome | Requirement, threat, policy, decision, or asset | What must hold and who owns the decision | Observable review, test, exercise, inspection, or evidence | draft, proposed, accepted, or deprecated |

Control objectives describe outcomes. Put selected products and protocols in Technology, concrete placement in Deployment Architecture, executable configuration in Implementation, and runtime operation in Operations.

## Identity, authentication, and session boundary

For each interaction channel or subject type in scope, describe:

- human, service, device, operator, build, or external-system identity;
- identity authority and lifecycle;
- proofing and authentication assurance;
- credential, recovery, suspension, termination, and revocation expectations;
- session establishment, expiry, renewal, replay protection, and context switching;
- distinctions between subject identity, business actor, role, entitlement, and representation;
- unresolved identity provider, protocol, factor, or session-mechanism decisions.

Do not select an identity mechanism without evidence and authority.

## Authorization model

Define the provisional authorization-decision inputs, authoritative decision owner, enforcement points, default behavior, and propagation of verified security context. Address object-, organization-, location-, purpose-, relationship-, delegation-, and context-level decisions where evidenced.

State how cross-module interactions preserve source authority and how composition, caching, search, dashboards, exports, or read models avoid broadening access. Explain whether a shared authorization mechanism or dedicated module is justified without transferring domain-specific policy ownership accidentally.

## Security responsibility allocation

| Module, component, interface, adapter, store, delivery, or operational boundary | Owned security responsibility | Explicit non-responsibility | Required collaboration or handoff |
|---|---|---|---|
| Named architecture element | Decisions, enforcement, filtering, validation, evidence, or recovery owned here | Neighboring authority that remains elsewhere | Contract, context, deployment, implementation, test, or operational dependency |

Include frontend, backend, module, persistence, integration, build, deployment, and operational responsibilities only where they are in scope. Do not make Security a catch-all owner of business policy or operational execution.

## Privacy and information lifecycle

Describe how sensitive information is minimized and governed across collection, creation, use, disclosure, correction, restriction, export, retention, archival, deletion, backup, restoration, migration, support, and derived copies.

| Information class or flow | Purpose and permitted use | Copies and derived representations | Lifecycle controls | Missing authority or decision |
|---|---|---|---|---|
| Protected information or flow | Evidence-supported purpose | Logs, indexes, caches, analytics, documents, media, replicas, backups, tests, or exports | Minimization, correction, restriction, retention, deletion, recovery, or provenance | Legal, privacy, domain, deployment, or operational resolution |

Do not invent lawful basis, consent, retention duration, deletion guarantee, data residency, legal hold, representation authority, or anonymization effectiveness.

## Audit, logging, monitoring, and incident evidence

Distinguish business history, security audit evidence, operational telemetry, and compliance evidence. For each relevant category state purpose, event ownership, content limits, attribution, time semantics, access, integrity, retention, review, alerting, and investigation responsibility.

Prevent credentials, secrets, tokens, unnecessary personal content, sensitive request bodies, and protected query results from entering ordinary telemetry. State where incident response, notification, vulnerability management, and operational monitoring remain owned outside this artifact.

## Integration and interface security

| External participant or interface | Owning boundary | Identity and authorization | Data minimization and validation | Failure, replay, abuse, and recovery | Open decision or evidence |
|---|---|---|---|---|---|
| User channel, service, device, partner, file, or external ecosystem | Module and `TB-NNN` | Caller and permitted capabilities | Inbound and outbound constraints | Timeout, retry, duplicate, quarantine, safe error, or reconciliation | Requirement, technology, deployment, or operational gap |

Address file, media, document, batch, message, and device inputs explicitly when their content, size, provenance, metadata, or processing creates distinct risks.

## Prototype or PoC security profile

Include this section when a prototype or PoC is in scope. State whether it is isolated, externally exposed, connected to real systems, disposable, or intended to evolve.

| Concern | Permitted prototype treatment | Production difference or unresolved obligation | Evidence |
|---|---|---|---|
| Data, identity, authorization, network exposure, secrets, integrations, logging, dependencies, migration, testing, disposal, or evolution | Synthetic, isolated, mocked, reduced, real, or prohibited treatment | Control not yet validated or decision still required | Test, inspection, configuration, or review output |

Require at least the positive and denied scenarios needed to exercise the selected slice's security architecture. A prototype profile is not production-readiness or compliance evidence.

## Technology and deployment realization

Map accepted mechanisms to control objectives without confusing mechanism presence with outcome evidence.

| Control objective | Selected or candidate mechanism | Technology authority | Deployment or operational dependency | Validation and residual limitation |
|---|---|---|---|---|
| `SEC-ARCH-NNN` | Product, protocol, library, platform capability, process, or unresolved mechanism | Technology decision or proposal | Zone, runtime identity, key, secret, network, backup, monitoring, or operator need | Evidence and remaining risk |

Omit product selection when Technology has not established it. Hand concrete placement and runtime administration to Deployment Architecture and Operations.

## Verification strategy

| Verification area | Threats and controls covered | Required evidence | Environment and data constraints | Owner or acceptance authority |
|---|---|---|---|---|
| Authentication, authorization, disclosure, integrity, audit, privacy lifecycle, availability, recovery, interface, delivery, or operation | `SEC-ARCH-*`, threat, asset, or boundary links | Automated test, manual review, analysis, exercise, inspection, scan, or specialist assessment | Safe target, synthetic data, isolation, and access restrictions | Accountable reviewer |

Include positive, negative, alternative, error, abuse, boundary, recovery, and direct-interface scenarios proportionately. Automated checks complement but do not replace threat review, privacy review, specialist assessment, penetration testing where warranted, operational exercise, and accountable acceptance.

## Alternatives and consequential decisions

| Concern | Options considered | Current proposal or decision | Security, privacy, usability, delivery, and operational trade-offs | Decision record or resolution condition |
|---|---|---|---|---|
| Boundary, identity, session, authorization, cryptography, audit, isolation, recovery, or control allocation | Material alternatives | Proposal or accepted choice | Evidence-supported rationale and consequence | `DR-NNNN` or accountable next step |

## Evolution and accepted risks

Record material additions, changes, splits, merges, retirements, exceptions, and risk acceptances. Never reuse a retired `TB-NNN` or `SEC-ARCH-NNN` identifier.

| Element or risk | Change or disposition | Rationale and evidence | Authority | Review or expiry condition |
|---|---|---|---|---|
| `TB-NNN`, `SEC-ARCH-NNN`, threat, or risk | Added, refined, replaced, retired, mitigated, transferred, avoided, or accepted | Direct source | Accountable decision-maker | Date, event, requirement, test, or deployment change |

## Assumptions and open questions

| Type | Statement | Affected assets, boundaries, threats, or controls | Owner | Validation, resolution, or expiry condition |
|---|---|---|---|---|
| Assumption, open question, or residual risk | Material uncertainty | Direct identifiers or scope | Accountable role | Evidence, decision, test, or event required |

## Cross-artifact handoffs

| Owning artifact or workflow | Required clarification or change | Affected identifiers or scope | Owner and resolution condition |
|---|---|---|---|
| Requirements, Actors, Use Cases, Entity Model, Software Architecture, Technology, Deployment, Implementation, Test, Operations, Risk, Privacy, Legal, or Decision Records | Exact handoff without redefining the target artifact | `TB-*`, `SEC-ARCH-*`, requirement, entity, module, interface, environment, or risk | Accountable role and completion evidence |

## Validation status

Record:

- asset, data-flow, boundary, threat, and control coverage for the declared scope;
- unique and consistent `TB-*` and `SEC-ARCH-*` identifiers;
- traceability from requirements and threats to control objectives and verification;
- identity, authentication, authorization, context, and enforcement consistency;
- alignment with modules, entities, interfaces, technology, deployment, tests, and operations;
- privacy-lifecycle, audit, logging, recovery, migration, supply-chain, and privileged-access review;
- prototype and production separation where applicable;
- diagram rendering and visual inspection;
- link and repository validation;
- specialist reviews, skipped checks, evidence limitations, and residual risks.

## Sources and related artifacts

Link directly to the Product Vision, glossary, actors, use cases, domain rules, Business Objects, functional and non-functional requirements, constraints, exclusions, source evidence, Software Architecture, Logical Entity Model, Technology, Deployment Architecture, migration evidence, test strategy and results, operations, risk management, decisions, notation guidance, diagram tooling, and external primary authorities used by the declared scope.
