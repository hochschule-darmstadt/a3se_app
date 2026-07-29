# DR-0006: Align the harness with software engineering lifecycle terminology

- Status: accepted
- Date: 2026-07-29
- Deciders: project owner and management
- Supersedes: DR-0002, DR-0003, DR-0005 in part

## Context

The harness grouped information into Product, Engineering, Quality, Operations, and Governance and used five broad agent roles. Although compact, the names hid established distinctions among requirements, architecture, implementation, testing, and management. Decision records were also described as architecture decisions even when they governed process or business concerns.

## Decision drivers

- terminology recognizable across the software engineering lifecycle;
- explicit separation of requirements, architecture, and implementation authority;
- independent testing responsibility;
- explicit management responsibility;
- one navigable authoritative location for each topic;
- progressive growth without premature directory proliferation;
- preservation of historical identifiers and evidence.

## Considered options

- Retain the five information themes: least migration work, but preserves ambiguous lifecycle boundaries.
- Rename folders only: improves navigation but leaves ownership, workflow, and validation contradictory.
- Align folders, agent responsibilities, decision records, workflows, and validation together: larger migration, but produces one coherent harness.

## Decision

Use these top-level lifecycle information areas under `docs/`: `requirements`, `architecture`, `implementation`, `test`, `operations`, and `management`, with `governance` applying across them.

Use corresponding Requirements, Architecture, Implementation, Test, Operations, and Management agent responsibilities. These responsibilities are collaborative and iterative, not sequential phase gates. Folder placement does not imply exclusive ownership of cross-cutting concerns.

Use general decision records identified as `DR-NNNN` for consequential business, governance, architecture, technology, implementation, test, operational, or management choices. Never reuse a number.

Apply a topic growth strategy: begin with `topic.md`; when the topic requires independently reviewable constituent documents, diagrams, or assets, replace it with `topic/README.md` and supporting files. Every directory has a `README.md`.

Preserve existing requirements identifiers and source evidence. Do not create technology-specific implementation guidance until a decision selects that technology.

## Consequences

### Positive

- Navigation and responsibilities use widely understood lifecycle terminology.
- Architecture and implementation choices remain visibly downstream of accepted requirements.
- Management and independent testing are explicit.
- The structure can grow without creating a directory for every small topic.
- Decision records can govern any consequential choice.

### Negative and risks

- Existing paths, metadata, links, validation rules, and historical descriptions require migration.
- Lifecycle names could be mistaken for waterfall gates; navigation and role guidance must continue to state that work is iterative.
- Renaming existing record identifiers requires updating every reference and validation rule atomically.

## Validation and revisit triggers

Validate relative links, stable IDs, decision index consistency, README presence, obsolete live paths, and path-sensitive diagram tooling. Revisit if lifecycle placement repeatedly obscures authority, creates duplicate facts, or encourages sequential handoffs.

## Links

- [Documentation context map](../../README.md)
- [Lifecycle agents](../agents/README.md)
- [Artifact lifecycle](../workflows/artifact-lifecycle.md)
- [Definition of done](../workflows/definition-of-done.md)
- [DR-0002](0002-adopt-five-role-agent-operating-model.md)
- [DR-0003](0003-organize-documentation-by-information-theme.md)
- [DR-0005](0005-operationalize-product-definition-harness.md)
