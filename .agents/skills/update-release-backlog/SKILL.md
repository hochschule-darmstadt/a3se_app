---
name: update-release-backlog
description: Reconcile an existing numbered Release Backlog with selected or replanned iteration Stories, Slice links, and delivery evidence, updating only affected Epics, Features, and release outlook. Use after sprint planning or when material iteration evidence changes; do not create Stories, make sprint commitments, or synchronize a tracker.
---

# Update Release Backlog

Reconcile an existing Release Backlog with iteration planning decisions and subsequent Slice or delivery evidence. Work with the user to keep the affected Epic and Feature structure, release outlook, and traceability consistent without taking ownership of the Sprint Backlog or authoritative product artifacts.

## Purpose and boundaries

Use this skill after Stories have been selected or replanned for an iteration, or when later Slice and delivery evidence materially changes the release-level outlook. Update only the affected parts of the existing numbered Release Backlog.

- Use [Create Release Backlog](../create-release-backlog/SKILL.md) for the initial Epic and Feature baseline or broad structural refinement not bounded to one iteration.
- Use [Create Sprint Backlog](../create-sprint-backlog/SKILL.md) to select and replan Stories and to agree iteration scope, load, sequence, and completion treatment.
- Use [Specify Slice](../specify-slice/SKILL.md) to establish a Slice boundary and coordinate the authoritative specification changes it requires.

This task reconciles those decisions in the Release Backlog. It does not create or rewrite Story definitions, change the Sprint Backlog's commitments, specify Slices, define requirements, implement work, or synchronize an issue tracker. If the user requests an external tracker update, leave the repository backlog in a coherent state and hand off to a separately authorized workflow.

## Preserve artifact authority and hierarchy

- The Release Backlog owns the negotiable Epic and Feature structure, their stable planning identifiers, coarse dependencies, sequencing guidance, and release or iteration outlook.
- The Sprint Backlog owns selected Stories, their iteration allocation, accepted load, priority, and completion treatment.
- Every Feature has exactly one parent Epic. Every Story has exactly one parent Feature; do not skip a level or infer a parent from a title alone.
- Stories use stable tracker-independent ST-NNN identifiers. Slices use distinct SL-NNN identifiers and have their own Slice Manifests. A Story may be realized by one or more Slices; do not treat the identifiers or artifacts as interchangeable.
- Requirements, domain, UX, architecture, security, test, and delivery artifacts remain authoritative for their own content. Backlog items link to those artifacts rather than replacing them.
- A selected or accepted Slice does not by itself accept its parent Feature, Epic, Release Backlog, or product scope.

Follow the accepted backlog and identifier decisions: [DR-0008](../../../docs/governance/decisions/0008-adopt-epic-feature-story-backlog-hierarchy.md), as partially superseded by [DR-0029](../../../docs/governance/decisions/0029-adopt-oculus-lifecycle-skills-and-templates.md) for flexible mappings, tracker-independent planning identifiers, and separate Slice Manifests.

## Load the relevant current context

Before proposing changes:

1. Read [the documentation context map](../../../docs/README.md), applicable repository instructions, and [Project Management](../../../docs/management/project-management/project-management.md).
2. Read the existing numbered Release Backlog for the target release and the current Sprint Backlog. Confirm that the release horizon is unchanged.
3. Read the selected or replanned Story records and the Slice Manifests already linked to them. Read only the authoritative requirements, decisions, risks, review records, and delivery evidence that could affect the proposed reconciliation.
4. Inspect the current identifiers, parent links, release outlook, dependencies, sequencing, assumptions, and open questions in those artifacts. Preserve unaffected user-authored content and existing IDs.

If the target release or the status of an iteration decision is unclear, resolve that ambiguity with the user before treating it as a fact. Distinguish selected, proposed, in-progress, completed, and accepted work.

## Reconcile the affected backlog

Build a concise traceability view from each selected Story to its one parent Feature and that Feature's parent Epic. Where a Slice Manifest exists, link it to the Story using the approved planning records. Do not add speculative Slice links before a Slice has been defined.

Assess whether the new planning decision or evidence changes any of the following:

- an Epic or Feature outcome, scope boundary, exclusion, or authoritative anchor;
- a Story's parent Feature or the coherence of the affected Feature;
- a supported dependency or logical sequence between outcomes;
- the release or iteration outlook, including links to selected Stories and defined Slices;
- an assumption, risk, unresolved question, or evidence limitation that affects planning confidence.

Update only what the evidence or an accountable planning decision justifies. Preserve stable EP-NNN, FT-NNN, and ST-NNN identifiers when identity remains the same. Allocate new Epic or Feature identifiers monotonically under the repository convention; never reuse retired identifiers. Record material split, combination, replacement, parent, or retirement effects and their traceability.

Do not infer new product scope, priority, release horizon, dates, estimates, capacity, staffing, completion, or acceptance from code, document order, or a successful Slice. Keep coarse release sequencing distinct from the Sprint Backlog's iteration commitments. If an update requires a new release horizon, unsupported capability, materially different outcome, or unresolved parent assignment, explain the gap and route the decision rather than silently changing the plan.

## Work with the user

Present the affected Epic and Feature changes with their Story and Slice links, evidence, assumptions, and implications. The user or accountable planning authority confirms material changes to outcomes, scope, parentage, release allocation, or sequencing. Apply only authorized changes. If the current evidence supports no change, report the alignment or gap without rewriting the backlog.

## Update and validate

Edit the existing numbered Release Backlog in its current structure and style. Update its iteration outlook when selected Stories, defined Slices, or reviewed delivery evidence warrant it. Keep Story details and iteration commitments in the Sprint Backlog; do not duplicate them as competing Release Backlog authority.

Before finishing, verify that:

- the target release number and horizon are unchanged;
- affected identifiers are unique and stable, and retired identifiers are not reused;
- every affected Feature has exactly one valid Epic parent, and every referenced Story has exactly one valid Feature parent;
- Story-to-Slice references point to existing, relevant Slice Manifests and preserve the distinction between ST-NNN and SL-NNN;
- changed outcomes, anchors, dependencies, sequencing, and outlook agree with current authoritative evidence and planning decisions;
- cross-artifact links are valid and the relevant documentation checks pass.

Run npm run harness:validate for documentation changes when available. Report the updated items, confirmed decisions, unresolved gaps, evidence limitations, and any validation that could not be completed. Leave final backlog acceptance and external tracker synchronization to their accountable authorities and separately authorized workflows.
