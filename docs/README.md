# Project Context Map

This directory is the durable context harness for humans and AI agents. Documents should be loaded progressively: begin here, then read only the sources relevant to the current task.

## Status vocabulary

- `draft`: incomplete and open for discussion
- `proposed`: coherent and awaiting approval
- `accepted`: authoritative until superseded
- `deprecated`: retained for history; no longer authoritative

## Reading paths

| Task | Read first | Then read |
|---|---|---|
| Requirements | [requirements/README.md](requirements/README.md) | discovery-source briefs, glossary, stakeholders, use cases, quality requirements |
| Domain modeling | [domain/README.md](domain/README.md) | glossary, business rules, bounded contexts |
| Architecture or stack | [architecture/README.md](architecture/README.md) | quality requirements, constraints, ADRs |
| UX | [product/personas.md](product/personas.md) | use cases and accessibility constraints |
| QA | requirements and acceptance criteria | use cases, quality scenarios, traceability |
| Security/privacy | stakeholders and context | [security/README.md](security/README.md), threats, relevant ADRs |
| Agent orchestration | [agents/operating-model.md](agents/operating-model.md) | specialist charters and collaboration rules |
| Re-engineering | [reengineering/README.md](reengineering/README.md) | inventory, target design, impact analysis, and validation |
| Infrastructure/operations | [operations/README.md](operations/README.md) | IaC, CI/CD, deployment, and operability evidence |

## Authoritative areas

- [product/](product/): vision, scope, stakeholders, and glossary
- [requirements/](requirements/): functional and quality requirements with acceptance evidence
- [ux/](ux/): user research, journeys, wireframes, accessibility, and UI concepts
- [domain/](domain/): domain language, rules, models, and boundaries
- [data/](data/): conceptual, logical, and physical data models and governance
- [specification/](specification/): approved notations and diagram-as-code rules
- [architecture/](architecture/): architecture drivers, candidate technologies, and decisions
- [technology/](technology/): selected stack and stack-specific engineering guidance (empty until decided)
- [security/](security/): data classification, threats, controls, and privacy concerns
- [agents/](agents/): specialist-agent charters and collaboration protocol
- [engineering/](engineering/): workflow, quality gates, and continuous alignment
- [testing/](testing/): AI-assisted test design, automation, and validation strategy
- [automation/](automation/): conversational agents, workflow automation, and multi-agent systems
- [reengineering/](reengineering/): brownfield inventory, restructuring, and forward-engineering evidence
- [operations/](operations/): infrastructure as code, CI/CD, deployment, and operations
- [responsible-ai/](responsible-ai/): critical evaluation and ethical, legal, societal, and professional reflection
- [decisions/](decisions/): immutable architecture decision records
- [templates/](templates/): canonical document fragments to copy when adding content

## Context hygiene

Every substantive document begins with status, owner, and last-reviewed metadata. Prefer stable IDs and relative links. Avoid copying the same requirement into several files; link to its authoritative definition instead.
