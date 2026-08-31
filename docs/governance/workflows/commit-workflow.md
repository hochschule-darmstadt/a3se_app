# Change and Commit Workflow

- Status: accepted
- Owner: Management/Implementation
- Last reviewed: 2026-08-19

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
6. Commit one coherent intent with a descriptive imperative message.

Do not mix unrelated cleanup with behavior changes. Do not claim tests or reviews that did not run. Technology-specific branching, formatting, linting, testing, and commit-message rules will be added only after the stack and delivery platform are selected.

## Checkpoints

Where an issue names a "Checkpoint" (e.g. human acceptance of a wireframe, human review of an implementation), that checkpoint is a stop, not a step: present the work and wait for the human's explicit authorization before committing it. "Checkpoint, then commit" describes the required order of events, not a single action for the agent to complete unattended. This applies whether or not the individual issue spells it out again.
