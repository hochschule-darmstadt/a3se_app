# Templates

- Status: proposed
- Owner: Management
- Last reviewed: 2026-10-15

- [decision-record.md](decision-record.md): general consequential decision record
- [release-backlog.md](release-backlog.md): one numbered release horizon's tracker-independent Epic and Feature structure, evidence coverage, coarse dependencies, sequencing, allocations, and planning uncertainty
- [epic.md](epic.md): coherent product outcome or capability area with primary domain or subdomain anchors where meaningful
- [feature.md](feature.md): independently evaluable product capability linked to one or more authoritative behavioral anchors
- [story.md](story.md): negotiable iteration-planning outcome with a durable tracker-independent `ST-NNN` identity and exactly one parent Feature
- [sprint-backlog.md](sprint-backlog.md): one iteration's team-confirmed goal, capacity basis, accepted load, selected Stories, sequencing, risks, replanning, and completion record
- [slice.md](slice.md): one coherent vertical specification and implementation unit with stable `SL-NNN` identity, authoritative impact map, readiness, and evidence handoff
- [implementation-plan.md](implementation-plan.md): one executable implementation plan shared by Prototype and Slice delivery, with ordered increments, evidence mapping, and visible revision history
- [task.md](task.md): concrete lifecycle or engineering work
- [bug.md](bug.md): observed defect or specification deviation
- [use-cases.md](use-cases.md): actor-goal use-case catalog and PlantUML landscape
- [use-case.md](use-case.md): Cockburn-style specification of one individual use case
- [product-vision.md](product-vision.md): stakeholder-aligned product intent, outcomes, capability areas, boundaries, and proposed success measures
- [glossary.md](glossary.md): domain terminology with definitions, contexts, discouraged synonyms, and links to supporting evidence and unresolved terminology work
- [domains.md](domains.md): strategic DDD decomposition into an overall domain, subdomains, justified bounded contexts, and their graphical landscape
- [actors.md](actors.md): stable human roles and external participants that directly interact across the system boundary
- [business-objects.md](business-objects.md): conceptual business objects, lifecycles, relationships, and primary-subdomain responsibility
- [navigation-map.md](navigation-map.md): actor-facing information architecture, navigation principles, destination inventory, and embedded Mermaid overview
- [wireframes.md](wireframes.md): annotated low-fidelity frames, interaction states, transitions, recovery behavior, and optional Mermaid frame flow
- [design-system.md](design-system.md): reusable experience principles, semantic foundations, interaction patterns, component responsibilities, and validation criteria
- [software-architecture.md](software-architecture.md): technology-neutral modules, internal dependency structure, module contracts, consistency boundaries, and distribution strategy
- [entities.md](entities.md): technology-neutral logical entities, value structures, relationships, integrity boundaries, and exactly one owning module per entity
- [technology.md](technology.md): justified technology selections, usage boundaries, compatibility and version policy, alternatives, and validation
- [security-architecture.md](security-architecture.md): protected assets, trust boundaries, threats, security responsibilities, control objectives, and verification expectations
- [deployment-architecture.md](deployment-architecture.md): environment landscape, shared runtime placement, cross-environment requirements, execution and verification boundaries, activation conditions, and implementation alignment
- [environment.md](environment.md): one concrete deployment environment covering topology, execution profiles, isolation, configuration, data, lifecycle, exposure, operations, and evidence
- [test-strategy.md](test-strategy.md): current-stage test objectives, policies, test-level responsibilities, traceability, data and environment use, evidence semantics, and readiness gates
- [ci-cd.md](ci-cd.md): current and deferred local verification, integration, build, artifact, promotion, deployment, failure, evidence, and activation boundaries
- [prototype.md](prototype.md): representative fixed use-case slice, architecture and technology hypotheses, provisional treatments, realization boundaries, security profile, evidence scenarios, bounded implementation-planning routing, and technical-review criteria
- [coding-guidelines.md](coding-guidelines.md): project- and technology-specific coding rules, implementation patterns, version-matched references, optional quality skills, exceptions, and rule verification mappings
- [technical-foundation.md](technical-foundation.md): current executable build, test, migration, configuration, environment, packaging, and verification mechanisms with smoke evidence and known gaps

These Markdown files are the canonical templates for agents and repository work. If the repository later adds issue forms for manual entry, keep those forms aligned with the corresponding templates in the same change.

Templates support consistent evidence; they do not replace accountable judgment. Issues organize work and findings; they do not become authoritative requirements or decisions merely by being created or moved on a board.
