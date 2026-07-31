# Requirements

- Status: draft
- Owner: Requirements
- Last reviewed: 2026-07-31

This area is authoritative for the business problem, stakeholder intent, terminology, required behavior, constraints, quality needs, and UX expectations. Requirements describe what is needed without prematurely selecting implementation technology.

## Current specification reading path

Read the populated requirements documents in this order, moving from overall intent and domain boundaries toward behavioral detail:

1. [Product Vision and Scope](vision.md) explains why the system is being built, the intended outcomes, and its current scope.
2. [Glossary](glossary.md) establishes the shared business language used by all subsequent documents.
3. [Bounded Contexts](bounded-contexts/bounded-contexts.md) divides the Tour Operator enterprise into coherent areas of responsibility and provides the structural overview.
4. [Actors](actors.md) identifies the people, external parties, and external systems that interact with those contexts.
5. [Business Objects](business-objects.md) introduces the coarse-grained information concepts and assigns their ownership to bounded contexts.
6. [Use Cases](use-cases/use-cases.md) provides the behavioral overview and links to one detailed specification for each actor goal.

The [requirements sources](sources/) retain discovery evidence and provenance. They support the specification but are not accepted requirements and need not be read sequentially.

## Possible later additions

The following artifacts are present but not yet substantively filled. Add to them only when stakeholder evidence or delivery needs justify the additional detail:

- [Constraints and Assumptions](constraints.md) currently records only that the technology stack is undecided; business, regulatory, organizational, technical, or temporal constraints may be added later.
- [Quality Requirements](quality-requirements.md) has no measurable quality scenarios yet. Add them when quality expectations and target measures have been agreed.
- [User Experience Requirements](ux/) currently contains no sitemap or wireframes. Add UX artifacts when accepted actor goals and use cases provide enough evidence for interaction design.

Use the [requirements workflow](../governance/workflows/requirements-workflow.md) for a coherent requirements slice.
