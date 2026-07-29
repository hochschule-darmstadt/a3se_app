# DR-0007: Govern work with GitHub Issues and a Project board

- Status: accepted
- Date: 2026-07-29
- Deciders: project owner and management
- Supersedes: none

## Context

The project needs a simple, visible mechanism for proposing features, reporting bugs, and tracking work without turning delivery items into authoritative requirements. Agents require durable templates in the harness, while occasional manual GitHub use requires equivalent repository-native forms.

## Decision drivers

- consistent evidence for agent-created and manually created issues;
- clear separation between requirements authority and work tracking;
- minimal status vocabulary;
- one visible board for repository work;
- prevention of drift between harness and GitHub templates;
- no secrets or personal data in issue evidence.

## Considered options

- Track work only in specifications: preserves authority but does not support assignment and progress tracking.
- Use status labels on issues: simple, but duplicates GitHub issue state and Project status and can drift.
- Use GitHub Issues with canonical harness templates and a Project status field: preserves specification authority while providing structured work tracking.

## Decision

Use GitHub Issues for work tracking. Use three issue kinds:

- `task` for concrete lifecycle, governance, analysis, decision, implementation, test, or operational work;
- `feature` for proposed capabilities, behavior changes, or lifecycle improvements;
- `bug` for observed deviations from accepted expectations.

The canonical Markdown templates are [task.md](../templates/task.md), [feature.md](../templates/feature.md), and [bug.md](../templates/bug.md). GitHub Issue Forms in `.github/ISSUE_TEMPLATE/` implement those templates for manual entry, apply the corresponding `task`, `feature`, or `bug` label, and add new issues to organization Project 2. Blank issue creation is disabled for ordinary contributors.

Use a GitHub Project board owned by the `hochschule-darmstadt` organization and associated with this repository. Its `Status` field has exactly `Open`, `In progress`, and `Done`, and the board groups items by that field. New repository issues enter `Open`; completed items enter `Done` and the underlying issue is closed as completed.

The configured board is [a3se_app Issues](https://github.com/orgs/hochschule-darmstadt/projects/2/views/2).

Status is Project metadata, not a repository label. GitHub's native issue state remains open or closed. Issues and project position organize work but never approve requirements, architecture, or other consequential decisions.

## Consequences

### Positive

- Task, feature, and bug reports request consistent, lifecycle-aware evidence.
- Agents can use templates without depending on GitHub availability.
- Manual GitHub entry receives equivalent guidance.
- A small board communicates progress without a parallel status-label system.

### Negative and risks

- The Markdown and YAML representations require synchronized maintenance.
- Project automation depends on GitHub permissions and platform behavior.
- Closing an issue and setting `Done` are two related state changes that automation or workflow discipline must keep aligned.

## Validation and revisit triggers

The harness validator checks that all canonical templates and GitHub forms exist, reference one another, use the expected labels, and disable blank issues. Revisit when issue volume justifies additional types, priorities, workflow states, or automation.

## Links

- [Templates](../templates/README.md)
- [Artifact lifecycle](../workflows/artifact-lifecycle.md)
- [Management](../../management/README.md)
- [GitHub Project](https://github.com/orgs/hochschule-darmstadt/projects/2/views/2)
