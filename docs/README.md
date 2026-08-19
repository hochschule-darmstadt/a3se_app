# Software Engineering Lifecycle Harness

- Status: accepted
- Owner: Management
- Last reviewed: 2026-08-05

This directory is the durable context harness for humans and AI agents. Start here, then load only the lifecycle information needed for the task. The folders organize authoritative information; they are not sequential phase gates or exclusive role boundaries.

## Lifecycle areas

- [governance/](governance/): agents, workflows, standards, templates, tooling policy, references, and decisions
- [requirements/](requirements/): business context, stakeholder needs, terminology, behavior, rules, constraints, UX, and source evidence
- [architecture/](architecture/): system structure, data architecture, technology decisions, and security architecture
- [implementation/](implementation/): technology-specific implementation guidance after technology selection
- [test/](test/): independent test design, scenarios, and verification evidence
- [operations/](operations/): deployment and runtime operation
- [management/](management/): planning, stakeholder engagement, risks, and lifecycle coordination

Cross-cutting concerns such as security, privacy, accessibility, reliability, and AI validation remain shared responsibilities defined by the operating model and definition of done.

## Status vocabulary

- `draft`: incomplete and open for discussion
- `proposed`: coherent and awaiting approval
- `accepted`: authoritative until superseded
- `deprecated`: retained for history; no longer authoritative

## Reading paths

| Task | Read first | Then read |
|---|---|---|
| Requirements | [requirements/README.md](requirements/README.md) | glossary, actors, use cases, cross-cutting requirements, scope exclusions, constraints, UX, and sources |
| Domain modeling | [requirements/domains/domains.md](requirements/domains/domains.md) | glossary, business objects, and rules |
| UX | [requirements/ux/README.md](requirements/ux/README.md) | actors, use cases, and quality requirements |
| Architecture or technology | [architecture/README.md](architecture/README.md) | requirements, constraints, quality requirements, and decisions |
| Implementation | [implementation/README.md](implementation/README.md) | accepted architecture and technology decision |
| Test | [test/README.md](test/README.md) | requirements, acceptance examples, scenarios, and validation evidence |
| Operations | [operations/README.md](operations/README.md) | architecture, deployment architecture, and operational risks |
| Management | [management/README.md](management/README.md) | project management, stakeholder management, and risk management |
| Agent responsibilities | [governance/agents/README.md](governance/agents/README.md) | relevant lifecycle agent charter |
| Workflow | [governance/workflows/README.md](governance/workflows/README.md) | artifact lifecycle and definition of done |
| Standards and notations | [governance/standards/README.md](governance/standards/README.md) | relevant notation and tooling guidance |
| Decisions | [governance/decisions/README.md](governance/decisions/README.md) | applicable decision records |

## Topic growth strategy

A topic starts as a single file such as `architecture.md`. When it needs independently reviewable parts, diagram sources, or supporting assets, replace that file with a same-named directory containing both `README.md` and a same-named authoritative document. The `README.md` is only a routing page: it identifies the authoritative topic document and tells readers what to read, without duplicating the specification or requiring them to inspect included diagram assets individually. Put the authoritative document and supporting files beside that README, and preserve the topic title, authority, and inbound links.

Examples:

```text
architecture.md
```

grows into:

```text
architecture/
    README.md
    architecture.md
    context.puml
    building-blocks.md
```

The routing README of a grown topic declares a `Topic document` link to the same-named Markdown file. Harness validation checks that declaration. Multi-document collections such as standards, workflows, or source evidence are not grown single topics and do not use it.

Do not create a directory merely to hold one short document. Existing multi-document collections such as standards, templates, tooling, decisions, references, workflows, and source evidence are already grown topics.

## Context hygiene

Every directory has a `README.md`. Every substantive document begins with status, owner, and last-reviewed metadata. Prefer stable IDs and relative links. Link to one authoritative definition rather than copying it.

A grown topic's routing `README.md` is exempt from the status/owner/last-reviewed triad: it is a pointer to the same-named authoritative topic document, which carries that metadata instead.
