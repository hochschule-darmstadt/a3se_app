# Project Context Map

This directory is the durable context harness for humans and AI agents. Documents should be loaded progressively: begin here, then read only the sources relevant to the task.

## Authoritative themes

- [governance/](governance/): agent roles, decisions, workflows, standards, references, and templates
- [product/](product/): stakeholder intent, requirements, domain knowledge, UX, and data meaning
- [engineering/](engineering/): architecture, technology, security engineering, automation, and engineering tooling
- [quality/](quality/): independent testing and validation strategy and evidence
- [operations/](operations/): infrastructure, CI/CD, deployment, observability, resilience, and recovery

Folders express authoritative information themes, not exclusive role ownership. Cross-cutting concerns such as security, privacy, accessibility, reliability, and AI validation retain the responsibilities defined in the operating model and definition of done.

## Status vocabulary

- `draft`: incomplete and open for discussion
- `proposed`: coherent and awaiting approval
- `accepted`: authoritative until superseded
- `deprecated`: retained for history; no longer authoritative

## Reading paths

| Task | Read first | Then read |
|---|---|---|
| Requirements | [product/requirements/README.md](product/requirements/README.md) | discovery sources, glossary, stakeholders, use cases, quality requirements |
| Domain modeling | [product/domain/README.md](product/domain/README.md) | glossary, business rules, bounded contexts |
| UX | [product/personas.md](product/personas.md) | use cases and accessibility constraints |
| Data | [product/data/README.md](product/data/README.md) | domain model, classification, privacy, and ownership |
| Architecture or stack | [engineering/architecture/README.md](engineering/architecture/README.md) | quality requirements, constraints, technology guidance, and ADRs |
| Security/privacy | [engineering/security/README.md](engineering/security/README.md) | stakeholders, data classification, threats, and relevant ADRs |
| QA | [quality/testing/README.md](quality/testing/README.md) | requirements, acceptance criteria, quality scenarios, and traceability |
| Infrastructure/operations | [operations/README.md](operations/README.md) | IaC, CI/CD, deployment, and operability evidence |
| Agent orchestration | [governance/agents/operating-model.md](governance/agents/operating-model.md) | role charters and collaboration rules |
| Engineering workflow | [governance/workflow/commit-workflow.md](governance/workflow/commit-workflow.md) | definition of done and continuous alignment |
| Notations and standards | [governance/standards/notations.md](governance/standards/notations.md) | diagram tooling and templates |

## Context hygiene

Every substantive document begins with status, owner, and last-reviewed metadata. Prefer stable IDs and relative links. Avoid copying the same requirement into several files; link to its authoritative definition instead.
