# DR-0003: Organize documentation by information theme

- Status: deprecated
- Date: 2026-07-27
- Deciders: project owner and engineering
- Supersedes: none
- Superseded by: DR-0006

## Context

The documentation had eighteen top-level folders, many containing only one file. This made the repository difficult to scan and obscured relationships among product, engineering, quality, operations, and governance information. The project is greenfield; brownfield re-engineering material belongs in a separate project.

## Decision drivers

- a small, comprehensible top-level structure;
- one authoritative location for each fact;
- progressive context loading;
- clear separation of product requirements from engineering methods and governance standards;
- room for subthemes without proliferating top-level folders;
- alignment with, but not mechanical duplication of, agent responsibilities.

## Considered options

- Keep concern-specific top-level folders: minimizes path changes but retains navigation overhead.
- Mirror agent roles exactly: simple names, but confuses accountability with information architecture.
- Organize by five information themes: keeps navigation compact while preserving cross-cutting ownership.

## Decision

Use five top-level documentation themes:

- `product/` for stakeholder intent, requirements, domain knowledge, UX, and data meaning;
- `engineering/` for architecture, technology, security engineering, automation, and tooling;
- `quality/` for independent testing and validation;
- `operations/` for delivery and runtime operation;
- `governance/` for agents, decisions, workflow, standards, AI-assistance policy, references, and templates.

Move the source PDFs to `governance/references/`. Treat notation guidance as governance standards rather than product specification. Remove the empty education area and the re-engineering area; brownfield work will use a separate project.

Folder placement does not transfer exclusive ownership of cross-cutting concerns. The multi-agent operating model remains authoritative for role responsibilities.

## Consequences

### Positive

- The top-level structure can be understood at a glance.
- Related artifacts are navigable through stable theme and subtheme boundaries.
- Requirements specifications are clearly separated from standards used to express them.
- Governance material is distinguished from product and implementation artifacts.

### Negative and risks

- Existing paths and links must be updated.
- Historical references may require context when they describe the former layout.
- Deeply nested paths are longer.

## Validation and revisit triggers

Validate relative links, repository instructions, path-sensitive automation, and Git move detection. Revisit if a theme becomes a miscellaneous catch-all, ownership becomes unclear, or routine tasks require loading unrelated subtrees.

## Links

- [Project context map](../../README.md)
- [Superseding lifecycle operating model](../agents/README.md)
- [Definition of done](../workflows/definition-of-done.md)
- [DR-0006](0006-align-harness-with-lifecycle-terminology.md)
