# DR-0030: Move Commit Checks into the Commit Workflow

- Status: accepted
- Date: 2026-10-21
- Deciders: project owner, by explicit instruction in the active session
- Supersedes: DR-0029 in part (retention of the `commit-readiness` skill)

## Context

[DR-0029](0029-adopt-oculus-lifecycle-skills-and-templates.md) adopted the Oculus skill baseline and retained the A3SE-only `commit-readiness` skill as a local extension. That skill wrapped step 4 of the [commit workflow](../workflows/commit-workflow.md) and was the only location of the project-specific mapping from changed areas to repository check scripts.

The adopted `operate-ci-cd` skill now executes the accepted verification path for Prototype and Slice delivery and records its evidence. Together, the two skills overlapped in running the same checks, while the check mapping itself remained a project fact held only in a procedure.

## Decision drivers

- one authoritative location for the change-to-check mapping;
- coverage of every commit, including documentation, harness, and defect changes outside Slice delivery;
- no overlapping skill responsibilities;
- a skill collection that matches the adopted Oculus baseline without local extensions.

## Considered options

- Retain `commit-readiness` and document its boundary to `operate-ci-cd`: keeps automatic skill triggering on commit requests but leaves the mapping inside a skill and keeps a local divergence.
- Remove the skill and move its mapping, honesty rule, and reporting format into the commit workflow: one authoritative location usable by every commit and by `operate-ci-cd`, at the cost of the skill trigger.

## Decision

Remove the `commit-readiness` skill. The commit workflow's **Proportionate checks** section owns the mapping from changed areas to check scripts, the rule that unrun checks are never claimed, and the ran/skipped/result report. `operate-ci-cd` runs those checks as part of Prototype or Slice delivery and records evidence; the commit workflow continues to govern every commit, including Checkpoint stops.

All other DR-0029 decisions remain unchanged.

## Consequences

### Positive

- The check mapping has one authoritative, linkable location.
- Commits outside Slice delivery remain covered without a separate procedure.
- The skill collection contains only the adopted baseline.

### Negative and risks

- Agents no longer load a dedicated skill when asked to commit; they must follow the commit workflow through the repository instructions and Definition of Done.
- When a new check script is added, the commit workflow table must be updated in the same change.

## Validation and revisit triggers

Validate that no repository reference to the removed skill remains and that `npm run harness:validate` passes. Revisit if commits are repeatedly proposed without the proportionate checks, or when the CI/CD baseline defines local verification stages that should own the mapping instead.

## Links

- [DR-0029](0029-adopt-oculus-lifecycle-skills-and-templates.md)
- [Change and Commit Workflow](../workflows/commit-workflow.md)
- [Operate CI/CD skill](../../../.agents/skills/operate-ci-cd/SKILL.md)
- [Repository skills](../../../.agents/skills/README.md)
