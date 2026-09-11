# Architecture

- Status: draft
- Owner: Architecture
- Last reviewed: 2026-08-05

Architecture translates accepted requirements and constraints into consequential structural and technology decisions when their drivers and validation needs are explicit.

- [software-architecture/](software-architecture/README.md): reading path for the modular software architecture, interfaces, and use-case interactions
- [entity-model/](entity-model/README.md): reading path for the generic logical entity model, module ownership, cross-module relationship semantics, and concrete object example
- [api.md](api.md): HTTP contract realization -- operation catalogue, error contract, pagination, bounded relationship reads, and generated TypeScript client
- [technology.md](technology.md): accepted technology profile, evaluation, open selections, and validation evidence
- AI assistance is documented as implemented in the [frontend architecture](software-architecture/frontend-architecture.md#31-ai-travel-advisor-implemented-frontend) and [backend architecture](software-architecture/backend-architecture.md#22-ai-travel-advisor-implemented-backend), under [DR-0024](../governance/decisions/0024-local-grounded-advisor-stack.md).
- [security.md](security.md): security and privacy architecture

Consequential choices belong in [decision records](../governance/decisions/README.md).

Software architecture describes logical modules and dependencies. [Deployment architecture](../operations/deployment-architecture/deployment-architecture.md) separately describes processes, containers, infrastructure nodes, and runtime placement without selecting a production server.
