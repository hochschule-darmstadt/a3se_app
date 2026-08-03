# DR-0008: Adopt an epic-feature-story backlog hierarchy

- Status: proposed
- Date: 2026-07-31
- Deciders: project owner and management
- Supersedes: DR-0007 in part

## Context

DR-0007 established GitHub Issues and an organization Project as work tracking, with task, feature, and bug issue kinds. Product-scope refinement now needs an explicit hierarchy that remains aligned with domain and requirements artifacts without making the backlog authoritative.

Stakeholder direction proposes `epic -> feature -> story`: an epic roughly corresponds to a business subdomain, a feature roughly corresponds to a use case within that subdomain, and a story is a use-case slice such as the happy path or one exception path. The word "roughly" needs a precise governance rule so planning items cannot silently define requirements boundaries.

## Decision drivers

- explicit alignment between product scope, subdomains, use cases, and delivery slices;
- explicit parent-child relationships and completion rules;
- independent, reviewable acceptance evidence;
- separation of planning metadata from authoritative requirements;
- equivalent canonical Markdown templates and GitHub Issue Forms;
- continued support for cross-cutting tasks and observed bugs.

## Considered options

- Use labels only: visually simple, but labels neither enforce parentage nor express the required relationships.
- Treat backlog items as the requirements artifacts: reduces links, but mixes planning state with specification approval and creates competing authority.
- Use an explicit three-level planning hierarchy linked to authoritative artifacts: adds refinement discipline and maintenance, while preserving authority boundaries.

## Decision

Adopt the model defined in [Backlog and Scope Management](../../management/backlog-management.md):

- an `epic` is associated with exactly one candidate or accepted subdomain;
- a `feature` has exactly one epic parent and represents exactly one use case in that subdomain;
- a `story` has exactly one feature parent and selects one independently reviewable use-case slice;
- levels may not be skipped, and parent changes require rechecking authoritative links;
- tasks and bugs remain supporting work types outside the product-scope hierarchy.

The correspondence is explicit rather than identical. Backlog items do not approve or replace subdomains, use cases, requirements, rules, acceptance specifications, or decisions.

Use GitHub parent/sub-issue relationships where available and include the parent URL in the issue body. Add all issue kinds to organization Project 2. Retain the `Status` field from DR-0007, enable the built-in `Parent issue` and `Sub-issue progress` fields, and add a `Backlog level` single-select field with `Epic`, `Feature`, `Story`, and `Supporting work`.

The canonical templates are [epic.md](../templates/epic.md), [feature.md](../templates/feature.md), [story.md](../templates/story.md), [task.md](../templates/task.md), and [bug.md](../templates/bug.md). Equivalent Issue Forms live in `.github/ISSUE_TEMPLATE/`.

This decision supersedes DR-0007 only where that record limits issue kinds to task, feature, and bug or defines feature more broadly. DR-0007's authority separation, board status, privacy, synchronization, and closure rules remain in force.

## Consequences

### Positive

- Scope can be refined from domain boundary through actor goal to acceptance-sized slice.
- Parentage and authoritative links expose drift between planning and requirements.
- Story acceptance evidence can focus on one coherent path.

### Negative and risks

- Parent links and Project metadata require maintenance and may drift.
- One-use-case-per-feature can produce features too large for a single increment; stories must carry delivery slicing.
- Candidate subdomains may change during discovery, requiring backlog reconciliation.
- GitHub Issue Forms cannot by themselves enforce semantic consistency or create parent/sub-issue links.

## Validation and revisit triggers

Validate canonical templates and Issue Forms together with `npm run harness:validate`. Review hierarchy links during refinement and parent closure. Revisit if GitHub provides enforceable issue types or parent rules, if use cases consistently prove too broad for feature planning, or if cross-context outcomes cannot be represented without duplicate epics.

## Links

- [Backlog and Scope Management](../../management/backlog-management.md)
- [Project Plan](../../management/project-plan.md)
- [Business Domains and Subdomains](../../requirements/domains/domains.md)
- [Use Cases](../../requirements/use-cases/use-cases.md)
- [DR-0007](0007-govern-work-with-github-issues-and-project.md)
- [GitHub Project](https://github.com/orgs/hochschule-darmstadt/projects/2/views/2)
