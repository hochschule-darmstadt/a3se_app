# Architecture

- Status: draft
- Owner: Architecture
- Last reviewed: 2026-08-04

Architecture translates accepted requirements and constraints into consequential structural and technology decisions when their drivers and validation needs are explicit.

- [software-architecture/](software-architecture/README.md): reading path for the modular software architecture, interfaces, and use-case interactions
- [data-model/](data-model/README.md): reading path for the generic logical entity model, module ownership, cross-module relationship semantics, and concrete object example
- [technology.md](technology.md): accepted technology profile, evaluation, open selections, and validation evidence
- [security.md](security.md): security and privacy architecture
- [automation.md](automation.md): conversational, workflow, and multi-agent automation architecture
- [data-classification.md](data-classification.md): information sensitivity
- [threat-model.md](threat-model.md): threats, trust boundaries, and mitigations

Consequential choices belong in [decision records](../governance/decisions/README.md).

Software architecture describes logical modules and dependencies. [Deployment architecture](../operations/deployment-architecture.md) separately describes processes, containers, servers, infrastructure nodes, and runtime placement after the modular design and relevant technology decisions are accepted.
