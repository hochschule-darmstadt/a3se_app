# Story

Use this template for one negotiable iteration-planning outcome within a Feature. A Story is a planning item that may later be realized by one or more coherent Slices; it is not an authoritative requirement, detailed Slice specification, or implementation plan.

## Identity and allocation

- **Story ID:** `ST-NNN`
- **Parent Feature:** `FT-NNN`
- **Iteration allocation:** Link the current Sprint Backlog, or state `Unallocated`.
- **Slice mappings:** Link allocated `SL-NNN` Slice Manifests when they exist, or state `Not specified`.
- **Work-item mappings:** Link repository, GitHub, GitLab, Jira, or other tracker records where present.

Allocate the Story ID monotonically from the governed product planning context. Preserve it across title, estimate, iteration, repository-path, and tracker changes; never allocate a new identifier merely because the Story moves. Do not allocate an identifier independently inside a tracker when the Story already exists in a Sprint Backlog or another governed planning artifact.

## Actor outcome

State the observable outcome for the actor and why this Story matters.

## Parent feature and authoritative links

Link exactly one Feature parent and the use cases, rules, requirements, constraints, evidence, and solution boundaries that support planning this outcome. Explain material cross-use-case scope. Classify unsupported statements as assumptions or proposals.

## Planning boundary and exclusions

State enough intended inclusion and adjacent exclusion to size, sequence, and later specify the Story responsibly. Do not define exact scenario steps, UX states, data changes, interfaces, tests, or implementation tasks here. Those belong to authoritative artifacts, the Slice Manifest, and implementation planning.

## Evidence expectation

State the observable evidence expected before this Story can be accepted. Link authoritative acceptance examples and later Slice claims rather than duplicating them. Existing code, a prototype, or passed checks may be starting evidence but does not imply regular Slice or Story acceptance.

## Relative planning assessment

- **Relative size:** Team-confirmed size within the current planning context, or `Unestimated`.
- **Planning confidence:** Current confidence plus the evidence and uncertainty behind it.
- **Capacity implication:** Review, specialist, environment, or sequencing need that materially affects iteration planning.

Relative size is not duration and must not be inferred without the team.

## Dependencies and lifecycle considerations

State dependencies and relevant security, privacy, accessibility, data, test, operations, and management implications. Link supporting tasks or bugs where needed.

## Open questions

List unresolved matters with an owner and the evidence or decision required to close each one.

## Completion

- [ ] The stable Story ID, parent Feature, iteration allocation, and work-item mappings agree.
- [ ] The parent Feature, planning anchors, boundary, and exclusions are current.
- [ ] Every implementing Slice Manifest is linked and remains within the accepted planning mandate.
- [ ] Required Slice claims have review evidence and an accountable acceptance result.
- [ ] Authoritative artifacts and affected stable IDs are updated or linked.
- [ ] Residual risks, skipped checks, and follow-up work are explicit.
