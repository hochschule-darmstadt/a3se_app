# Use-Case Activity Diagram Standard

- Status: proposed
- Owner: Architecture/Requirements
- Last reviewed: 2026-08-12

Use-case activity diagrams are synchronized views of authoritative textual use-case specifications. They make actor and system actions, decisions, iteration, feedback, recovery, and handoffs reviewable without approving new behaviour, resolving policy gaps, or prescribing a user interface.

This standard refines the repository's preference for [UML 2.x interaction semantics](notations.md) and uses the accepted [diagram toolchain](../tooling/diagram-tooling.md).

## Default notation and ownership

Use a UML 2.x activity diagram as the default view for one actor-goal use case. Author it as PlantUML beside the owning use-case specification and render an SVG with the same base name. Link the rendered view from the use case; the textual specification remains authoritative when a view and its source disagree.

Each activity diagram:

- identifies the use case by its stable `UC-` identifier;
- uses partitions named with stable actor identifiers and `System` to distinguish observable responsibility where it matters;
- labels actions with main-success step references such as `MSS 3` and alternatives with extension references such as `EXT 2-3`;
- uses guarded decisions, merges, loops, and termination deliberately rather than decorative flowchart shapes;
- exposes system feedback, incomplete or uncertain outcomes, recovery choices, and human handoff only when the use case specifies them;
- uses glossary terms and links back to the owning specification rather than repeating policies or acceptance examples; and
- contains no screens, controls, internal modules, services, databases, or technical implementation choices.

## Choosing another view

An optional UML sequence diagram may accompany the activity view when temporal ordering, conversational turns, interaction channels, or a handoff cannot be understood adequately from the activity diagram.

Use BPMN 2.0 instead only when the authoritative scope is an end-to-end business process across several actor goals or roles and business events, messages, timeouts, or compensation are central. A generic boxes-and-arrows flow is not an acceptable substitute for UML or BPMN semantics.

## Validation and review

Validate sources with `npm run diagrams:validate`, render them with `npm run diagrams:render -- <source>`, and visually inspect the SVGs. Reviewers compare every branch with the owning main-success scenario, extensions, guarantees, policies, requirements, and acceptance example. Parser validity does not demonstrate correct business meaning.

UX review determines whether a diagram provides sufficient input for task flows, state and feedback hypotheses, recovery, accessibility, and channel handoffs without prematurely defining screens. Review findings that change behaviour belong in the authoritative use case; findings about the reusable convention belong in this standard.
