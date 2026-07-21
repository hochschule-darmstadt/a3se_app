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
| Agent orchestration | [agents/operating-model.md](agents/operating-model.md) | shared state and specialist charters |

## Authoritative areas

- [product/](product/): vision, scope, stakeholders, and glossary
- [requirements/](requirements/): functional and quality requirements with acceptance evidence
- [domain/](domain/): domain language, rules, models, and boundaries
- [specification/](specification/): approved notations and diagram-as-code rules
- [architecture/](architecture/): architecture drivers, candidate technologies, and decisions
- [technology/](technology/): selected stack and stack-specific engineering guidance (empty until decided)
- [security/](security/): data classification, threats, controls, and privacy concerns
- [agents/](agents/): specialist-agent charters and collaboration protocol
- [engineering/](engineering/): workflow, quality gates, and continuous alignment
- [decisions/](decisions/): immutable architecture decision records
- [templates/](templates/): canonical document fragments to copy when adding content

## Context hygiene

Every substantive document begins with status, owner, and last-reviewed metadata. Prefer stable IDs and relative links. Avoid copying the same requirement into several files; link to its authoritative definition instead.
