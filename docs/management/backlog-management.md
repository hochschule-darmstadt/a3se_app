# Backlog and Scope Management

- Status: proposed
- Owner: Management
- Last reviewed: 2026-07-31

The product backlog organizes proposed system scope as `epic -> feature -> story`. Backlog items support planning and delivery; they do not approve a bounded context, use case, requirement, or design. Authoritative requirements remain in [Requirements](../requirements/README.md), and consequential governance choices remain in [Decision Records](../governance/decisions/README.md).

## Hierarchy

| Level | Planning purpose | Required requirements link | Sizing and completion rule |
|---|---|---|---|
| Epic | Groups outcomes that belong to one domain boundary | Exactly one candidate or accepted bounded context | May span several releases; complete when its planned features are complete or explicitly removed |
| Feature | Represents one actor goal delivered within its epic | Exactly one use case in the epic's bounded context | Reviewable end-to-end capability; complete when its planned stories and feature-level acceptance evidence are complete |
| Story | Selects one independently reviewable use-case slice | Parent feature plus the relevant use-case flow, rules, and requirement IDs | Small enough to complete as one coherent increment; covers one happy, alternative, or exception path, or one cohesive rule set |

The correspondence is deliberate but not identity: an epic is not the authoritative bounded-context definition, a feature is not the authoritative use-case specification, and a story is not itself a requirement. If discovery changes a boundary or use case, update and review the requirements artifact first, then reconcile the backlog links.

Each feature has exactly one epic parent, and each story has exactly one feature parent. Do not skip a level. Use GitHub's parent/sub-issue relationship where available and repeat the parent issue URL in the issue body so the relationship remains visible outside a Project view. A parent may close only when all intended children are closed or explicitly removed with rationale.

## Story slicing

Prefer the smallest slice that produces observable acceptance evidence. A story may cover:

- the main success scenario (happy path);
- one alternative or exception path;
- one boundary condition; or
- a cohesive subset of domain policies that can be reviewed independently.

Do not split solely by technical layer, component, or activity. Cross-cutting analysis, governance, infrastructure, and documentation work remains a `task`; observed deviations remain a `bug`. Tasks and bugs may link to any backlog level but are not children in the product-scope hierarchy unless their outcome genuinely meets that level's definition.

## GitHub representation

Use the canonical [epic](../governance/templates/epic.md), [feature](../governance/templates/feature.md), and [story](../governance/templates/story.md) templates. Equivalent GitHub Issue Forms add each item to the [a3se_app Issues Project](https://github.com/orgs/hochschule-darmstadt/projects/2/views/2).

The Project retains `Open`, `In progress`, and `Done` as workflow status. Enable GitHub's built-in `Parent issue` and `Sub-issue progress` fields. Add a single-select `Backlog level` field with `Epic`, `Feature`, `Story`, and `Supporting work`; set it consistently with the issue form. Board status and backlog level are planning metadata, not specification approval.

## Refinement checks

Before an item is ready for delivery:

- its parent relationship and authoritative links are present and consistent;
- statements are classified as facts, assumptions, proposals, or accepted requirements;
- included and excluded scope are explicit;
- acceptance evidence is observable and uses synthetic data;
- dependencies, open questions, lifecycle concerns, and residual risks are visible; and
- the story is independently reviewable without silently selecting architecture or technology.

Changes to parentage require checking the bounded-context and use-case links. A mismatch is an unresolved scope question, not permission to change the requirements model from the backlog.
