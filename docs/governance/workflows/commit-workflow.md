# Change and Commit Workflow

- Status: accepted
- Owner: Management/Implementation
- Last reviewed: 2026-09-10

1. Start from an identified requirement, risk, defect, or decision.
2. Declare scope and affected stable IDs using the [artifact authority and lifecycle](artifact-lifecycle.md).
3. Make the smallest coherent change, including specifications and acceptance evidence.
4. Run proportionate checks and independent specialist review where risk warrants it.
5. Reconcile cross-artifact links and continuous alignment. When an
   implementation convention changes, update the applicable as-built
   architecture document in the same change; those documents are
   [frontend](../../architecture/software-architecture/frontend-architecture.md)
   and [backend](../../architecture/software-architecture/backend-architecture.md)
   architecture.
6. Commit one coherent intent with a descriptive imperative message. When the
   change is directly assigned to a GitHub issue, include its number in the
   subject in the form `#<number>`, for example `Improve product descriptions
   (#60)`. If several issues are directly in scope, include each applicable
   number; do not invent an issue reference for untracked work.

Do not mix unrelated cleanup with behavior changes. Do not claim tests or reviews that did not run. The issue-reference convention above applies regardless of the selected delivery platform; additional technology-specific branching, formatting, linting, and testing rules may be added after the stack and delivery platform are selected.

## Checkpoints

Where an issue names a "Checkpoint" (e.g. human acceptance of a wireframe, human review of an implementation), that checkpoint is a stop, not a step: present the work and wait for the human's explicit authorization before committing it. "Checkpoint, then commit" describes the required order of events, not a single action for the agent to complete unattended. This applies whether or not the individual issue spells it out again.
