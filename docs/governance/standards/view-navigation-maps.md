# View Navigation Maps

- Status: proposed
- Owner: Requirements/Architecture
- Last reviewed: 2026-08-14

## Purpose and boundary

A view navigation map is a requirements-level graph of navigable views and permitted traversal. It answers which view an actor can reach next and which event initiates that traversal. It does not define URLs, layout, widgets, deployment boundaries, or software modules.

A sitemap instead describes information hierarchy. Create one only when a hierarchy question cannot be answered by a navigation map. A use-case activity diagram describes the actor/system task flow within an actor goal; a navigation map may link several such goals but does not replace their behaviour. Wireframes consume stable view identifiers and add information hierarchy, actions, states, and layout within each view.

## Constrained UML state-machine profile

Authoritative maps SHALL use UML 2.x state-machine semantics in PlantUML:

- A state represents one navigable page or view and carries a stable `VIEW-C-NNN` or `VIEW-S-NNN` identifier.
- A directed transition represents permitted traversal and is labelled `event` or `event [guard]`.
- A guard is used only when an accepted requirement evidences the authorization or prerequisite. Unresolved access rules belong in the owning specification, not in an invented guard.
- Initial and final pseudostates represent evidenced entry and terminal destinations. They do not imply a URL or browser lifecycle.
- Composite states are used only when the contained navigation area has meaningful state-machine semantics.
- Internal processing, validation steps, and domain states are not navigation states. Use-case activity diagrams own detailed task flow.
- Global navigation, deep links, return, cancellation, unavailable, validation-error, recovery, and dead-end behaviour are reviewed explicitly. An unresolved behaviour is recorded as an open question rather than guessed.

Sources (`.puml`) are authoritative and generated SVGs are review artifacts under [Diagram Tooling](../tooling/diagram-tooling.md). Each owning specification provides a traceability table with view purpose, audience, evidence, and classification as fact, proposal, or unresolved question.

## Review and validation

Requirements reviews derivation and terminology; Test reviews reachability, dead ends, alternative paths, and traceability; UX/accessibility reviews orientation, focus after traversal, recovery, and responsive parity; Security/privacy reviews evidenced guards and sensitive destinations; Architecture performs only a downstream realizability check.

Validation requires PlantUML parsing, SVG rendering and visual inspection, repository harness validation, and a comparison of every map element against its traceability table. Parser success does not establish stakeholder acceptance.
