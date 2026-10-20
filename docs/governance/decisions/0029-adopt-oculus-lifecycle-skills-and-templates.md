# DR-0029: Adopt the Oculus Lifecycle Skills and Templates

- Status: accepted
- Date: 2026-10-20
- Deciders: project owner, by explicit instruction in the active session
- Supersedes: DR-0008 in part

## Context

The project owner designated the current local OCULUS skills and templates as the valid baseline and requested their adoption in A3SE-App including all references, explicitly replacing `evaluate-prototype` with `review-prototype`. The adopted source is the OCULUS working tree, including uncommitted additions and changes, based on commit `2fd82b297a99f8a1ac211c0e29c98162854e6d75`. It contains 32 skills and 31 canonical templates. Its planning, implementation, and review semantics differ from A3SE-App's earlier harness.

The source collection also includes the referenced lifecycle model, Artifact Authority and Lifecycle, and Agent Workflows with their linked SVG views. The SHA-256 of the ordered source paths and bytes copied for this adoption is `ae3c8950946c71dc2eb5c4166c24044af725a3449a8a6bc7edbd419ae485e9c1`. Product-specific source artifacts, technology choices, decision numbers, and external tracker configuration are not transferable authority.

## Decision drivers

- one coherent skill, template, and workflow baseline;
- complete local references without importing another product's decisions;
- stable planning and implementation traceability;
- preservation of A3SE product specifications, accepted technologies, and existing evidence.

## Considered options

- Copy only skill entrypoints: leaves missing templates and conflicting coordination semantics.
- Replace all project documentation with OCULUS: loses A3SE-specific authority and evidence.
- Adopt the reusable baseline and reconcile local references and governance: preserves the product while making the requested methods usable.

## Decision

Adopt all 32 OCULUS skills and 31 canonical templates, their reusable lifecycle guidance and Agent Workflows, with the following local adaptations:

- Preserve A3SE's established Product Vision, Navigation Maps, Logical Entity Model, Security, and Project Management paths. Map source-only decision references to this record, retaining A3SE decision identities. Normalize the redundant trailing blank line in the imported Sprint Backlog template without changing its content.
- Replace the `evaluate-prototype` skill with `review-prototype`. Prototype review assesses declared architecture and technology hypotheses against fixed behavior and UX inputs. Regular product acceptance belongs to Slice review; prior evidence is not retroactively reclassified.
- Share `plan-implementation`, `create-tests`, `create-code`, and `operate-ci-cd` between Prototype and Slice delivery. Retain `implement-prototype` as an optional complete assignment when the executing model can manage its combined complexity, with the same durable plan and evidence and a subsequent separate technical review.
- Retain the A3SE-only `commit-readiness` skill as an explicitly indexed extension governed by the existing commit workflow.
- Preserve the Epic–Feature–Story hierarchy and exactly one parent Epic per Feature and one parent Feature per Story. Epics express coherent outcomes and may span domains with explicit rationale. Features express independently evaluable capabilities and may split or combine use cases with explicit authoritative anchors. These mappings supersede DR-0008's mandatory one-domain/one-use-case cardinalities.
- Use durable tracker-independent `EP-NNN`, `FT-NNN`, and `ST-NNN` planning identities. Allocate monotonically, preserve identity through compatible refinement and tracker moves, and retire rather than reuse identifiers. Assign new identities through governed planning, not by inferring them from existing GitHub issue numbers.
- Treat Stories as negotiable iteration outcomes. A separate `SL-NNN` Slice Manifest composes exact vertical scope and authoritative anchors for implementation. One Story may require multiple Slices; additional Story mappings require explicit planning authority. Material scope changes return to sprint replanning. Prototype Charters retain their own hypothesis and scenario identities and do not automatically become regular Slices.
- Keep one scope-specific Implementation Plan per Prototype or Slice, with visible revision history. Keep review conclusions in the governing Charter or Manifest and raw execution evidence in linked locations.
- Keep GitHub and organization Project 2 as A3SE's current tracker adapter. Align local Epic, Feature, and Story Issue Forms with the canonical templates while preserving that Project assignment. This adoption does not mutate external issues or allocate backlog items.

The adopted Product Vision instructions and template govern future creation and material refinement. This harness update does not rewrite existing product intent, instantiate planning commitments, alter the technology baseline, or claim new implementation or review results.

## Consequences

### Positive

- Skills, templates, coordination, artifact authority, and tracker forms use one coherent lifecycle model.
- Planning identities survive tracker changes while exact implementation scope remains separate.
- Existing A3SE artifacts and evidence retain their authority and identifiers.

### Negative and risks

- Future work must reconcile existing tracker items with the new planning and Slice records when those items enter governed refinement.
- The source includes uncommitted changes; future OCULUS updates are not automatically adopted.
- Source examples remain illustrative; they do not introduce new A3SE business requirements.

## Validation and revisit triggers

Check the adopted inventory and content against the source after the documented path and decision adaptations; validate skill frontmatter, indexes, local links, decision references, SVG XML, and GitHub Issue Form structure. Run the repository harness integrity check. Application behavior, technology, and executable delivery mechanisms are unchanged, so application builds and tests are not part of this adoption. Workflow SVGs are copied from the designated source without introducing or rendering diagram sources.

Validation evidence from this adoption on 2026-10-20:

- Source comparison passed for all 32 adopted skill entrypoints and 31 templates after the documented path/decision adaptations; the template index was also compared. All three workflow SVGs are byte-identical to the designated source and parse as XML.
- The `skill-creator` quick validator passed for all 33 skill entrypoints, including the retained local extension; frontmatter names match their directories.
- All 33 skills and 31 templates are indexed. Local target and fragment checks passed across 83 affected/supporting Markdown files, including four fragment links. The retired skill has no remaining executable or workflow reference; its name remains only in this decision's migration history.
- All three updated GitHub Issue Forms parse as YAML, retain unique body identifiers, and preserve the `hochschule-darmstadt/2` Project assignment.
- `npm run harness:validate` passed for 276 Markdown files, 49 stable requirement/actor identifiers, and 28 decision records. `git diff --check` passed.
- Application builds, tests, and diagram rendering were skipped because this change adopts documentation, templates, skill instructions, and existing SVG assets. Individual skills were not behaviorally exercised against a product scenario; structural validation does not establish their future output quality or re-approve existing project evidence.

Revisit when OCULUS changes materially, a local adaptation diverges, identifier governance becomes insufficient, or actual A3SE delivery reveals a contradiction in the adopted workflow. Later changes require explicit reconciliation rather than silently importing another project's decisions.

## Links

- [DR-0008](0008-adopt-epic-feature-story-backlog-hierarchy.md)
- [Repository skills](../../../.agents/skills/README.md)
- [Canonical templates](../templates/README.md)
- [SDLC responsibilities](../lifecycle/lifecycle.md)
- [Artifact Authority and Lifecycle](../workflows/artifact-lifecycle.md)
- [Agent Workflows](../workflows/agent-workflows/agent-workflows.md)
- [Project Management](../../management/project-management/project-management.md)
