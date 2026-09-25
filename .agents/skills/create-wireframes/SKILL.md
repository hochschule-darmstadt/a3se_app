---
name: create-wireframes
description: Collaboratively create, refine, correct, or assess annotated low-fidelity wireframes for actor-goal interactions, including information, actions, states, feedback, recovery, optional Mermaid frame flows, and browser-viewable HTML renderings. Use after relevant actors, use cases, and navigation are sufficiently established; do not use it for high-fidelity mockups, design-system definition, business-process modeling, implementation architecture, or production frontend implementation.
---

# Create Wireframes

Create or evolve the authoritative low-fidelity interaction concepts for the target product. Use wireframes to make information hierarchy, available actions, system feedback, interaction states, recovery paths, and context visible before implementation choices harden them.

The skill is generic. Product names, actors, use cases, destinations, frame structure, labels, channels, and interaction priorities must come from the current repository and stakeholder evidence. Existing wireframes are revisable hypotheses rather than unquestionable truth. Treat the user as a collaborative expert whose expertise may include the business domain, operations, product, UX, accessibility, architecture, and the existing system.

The user's instructions take precedence over this skill. Authorization to design or document wireframes does not authorize changes to product intent, actor goals, business behavior, navigation structure, business rules, permissions, architecture, implementation, or unrelated artifacts.

## Preserve semantic ownership

- The Product Vision owns product intent, target users, outcomes, capabilities, scope, constraints, and exclusions.
- The actor catalog owns stable interacting roles and external participants.
- The use-case catalog and individual use-case specifications own actor goals, business scenarios, extensions, outcomes, and guarantees.
- The navigation map owns actor-facing destinations, navigation groups, hierarchy, labels, and entry points.
- The wireframe artifact owns low-fidelity screen or state concepts, information hierarchy, available actions, validation presentation, feedback, recovery, and transitions among represented frames. Its Markdown catalog is authoritative; optional HTML, CSS, and JavaScript render those same concepts for review and validation.
- The design system owns reusable experience principles, tokens, visual patterns, and component guidance.
- Security and architecture own authentication, authorization, permissions, technical trust boundaries, routes, components, services, APIs, persistence, and deployment structure.
- Tests, HTML renderings, and prototypes validate interaction hypotheses but do not become authoritative requirements merely by existing.

Do not silently change an owning artifact to make a wireframe proposal fit. Apply a secondary-artifact edit only when it is meaning-preserving, necessary for consistency, and within the user's requested scope. Hand material changes to the owning workflow.

## Use interaction-design terms precisely

- **Wireframe**: a low-fidelity representation of one coherent screen, state, or interaction surface. It communicates structure and behavior without prescribing final visual styling or implementation.
- **Frame**: one identified wireframe representation. A frame may contain several components and may represent a stable state rather than a separately navigable page.
- **Interaction state**: a meaningful condition such as empty, loading, validation failure, possible duplicate, authorization failure, or success that changes available information, actions, or recovery.
- **Wireframe flow**: an optional overview of transitions among represented frames and material states. It is not the authoritative business sequence.
- **Annotation**: an explanation of behavior, rationale, constraint, accessibility need, uncertainty, or connection to an authoritative requirement that is not obvious from the drawing alone.
- **HTML rendering**: a browser-viewable low-fidelity representation of cataloged frames and states. It may be clickable but remains a requirements-level validation aid rather than production frontend code or an independent behavioral specification.

Do not equate any of the following without evidence:

- one use-case step and one screen;
- one use case and one page or fixed wizard;
- one navigation-map destination and one frame;
- one business object and one form section;
- a visual control and a domain operation;
- menu visibility and authorization;
- a low-fidelity layout and an implementation component tree;
- a wireframe transition and the complete business process.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md`.
2. Read the repository context map and follow its UX and requirements reading paths.
3. Read the Product Vision, glossary, domain landscape, actor catalog, use-case catalog, relevant detailed use-case specifications and acceptance examples, business objects, applicable rules and cross-cutting requirements, scope exclusions, constraints, navigation map, existing wireframes and their HTML renderings, design system, UX or user-research evidence, linked sources, applicable decisions, notation guidance, artifact-lifecycle guidance, requirements workflow, and definition of done when present.
4. Load only additional architecture, security, test, operations, or implementation context that materially constrains the interaction concept.

The initial workflow requires a sufficiently clear actor goal, observable outcome, relevant alternatives and failures, actor context, and navigation entry point. If a material prerequisite is absent or contradictory, identify the exact gap and hand it to the owning workflow rather than inventing business behavior in the wireframe.

Use `docs/governance/templates/wireframes.md` when present. In this repository, maintain the authoritative topic document at `docs/requirements/ux/wireframes/wireframes.md` and its routing page at `docs/requirements/ux/wireframes/README.md`. When a browser-viewable rendering is warranted, maintain `wireframes.html`, `wireframes.css`, and only when interaction requires it `wireframes.js` beside the topic document, and link the rendering from both the topic document and routing page. Preserve a compatible established structure.

## Select the operating mode and baseline

Determine the mode from the user's request and existing artifacts. Ask only when materially ambiguous.

- **Initial draft:** derive the first reviewable low-fidelity frames from established actor goals, scenarios, navigation, and constraints.
- **Refinement:** add interaction detail, states, annotations, transitions, accessibility behavior, or responsive considerations while preserving unaffected frames.
- **Correction:** reopen and change misleading information hierarchy, actions, states, labels, transitions, or recovery behavior when evidence warrants it.
- **Alignment:** reconcile the Markdown wireframes and any derived HTML rendering after changes to actors, use cases, the navigation map, business rules, constraints, quality requirements, or design-system guidance.
- **Assessment:** evaluate coverage, consistency, usability hypotheses, and traceability without writing unless the user authorizes changes.

For a repeated invocation, treat the current frames as the baseline. Preserve unaffected stable identifiers, confirmed concepts, links, lifecycle status, user-authored content, and still-valid HTML rendering. Reopen affected frames freely when use-case or usability evidence shows that the current interaction is defective. Keep Markdown and browser-viewable representations semantically aligned, but avoid stylistic churn when meaning and behavior are unchanged.

Do not infer artifact breadth from lifecycle status, detail level, or delivery sequence. Represent the interactions established by the user's request and authoritative evidence. Do not label a wireframe artifact by a delivery stage or imply that omitted interactions are outside the product unless that boundary is itself authoritative and relevant.

## Establish the interaction boundary

State provisionally:

- actors, goals, use cases, channels, devices, and contexts being represented;
- starting destination and supported entry points from the navigation map;
- observable completion, alternative outcomes, failures, and handoffs;
- working contexts that must remain visible, such as customer, traveler, travel order, itinerary, season, or work item;
- whether the task seeks broad consistency, a focused interaction concept, or correction of selected frames;
- applicable privacy, safety, regulatory, accessibility, and interruption constraints.

Ask the user to correct material coverage assumptions before detailed frame questions. Do not invent screens merely because a use case contains several steps, and do not compress distinct actor decisions or safety-sensitive states merely to reduce the frame count.

## Build a frame-and-state inventory

Create a visible working inventory from the authoritative inputs. On later runs, seed it with existing `WF-NNN` frames, `UX-WF-NNN` cross-frame states, labels, transitions, assumptions, and open questions.

For each frame candidate record:

- provisional frame name and actor-facing purpose;
- primary actor and relevant supporting actors;
- related `UC-` scenarios, extensions, guarantees, and acceptance examples;
- related `NAV-` destination or contextual entry point;
- information shown, edited, selected, confirmed, or deliberately hidden;
- primary, secondary, destructive, cancel, back, and recovery actions;
- entry conditions, exit outcomes, and neighboring frames or handoffs;
- empty, loading, success, validation, authorization, conflict, interruption, failure, and retry states where material;
- keyboard, focus, reading order, status announcement, contrast-independent meaning, viewport, and assistive-technology implications;
- privacy, safety, audit, organization, location, and working-context implications;
- evidence, accountable expert, confidence, and lifecycle status;
- available text, HTML, or other review representations and whether they remain aligned;
- disposition: unresolved, under analysis, ready to confirm, confirmed, rejected with rationale, or owned open question.

The inventory is an analytical aid. Assign a stable `WF-NNN` identifier only when a frame enters the authoritative artifact. Assign `UX-WF-NNN` only to a reusable or cross-frame interaction-state requirement, not to every annotation or local message.

## Interview as a rigorous collaborative design partner

Tell the user that wireframe discovery, refinement, correction, or assessment is beginning. State that a fully proposed interaction concept will be written only after the understanding threshold is met, while an explicitly requested early draft may be written as a provisional snapshot after its current meaning and limitations are confirmed.

Ask the highest-value unresolved interaction question next. Prefer one focused question per turn; group tightly related questions only when the user requests a faster questionnaire. Adapt questions to the evidence and preceding answers.

Establish only what is material from the following:

- what the actor needs to know, decide, enter, review, or recover at each meaningful point;
- what context must remain visible and what information must be minimized or withheld;
- which actions are primary, secondary, reversible, destructive, or unavailable in a state;
- how the interaction communicates empty, loading, progress, success, warning, validation, conflict, authorization, timeout, failure, retry, and cancellation;
- how the actor enters, leaves, resumes, repeats, or hands off the work;
- what may be prefilled, retained, discarded, or restored and under which confirmed rules;
- how keyboard, focus, reading order, announcements, labels, errors, and non-color cues work;
- which viewport, input device, environment, interruption pattern, or assistive technology materially affects the design;
- which familiar legacy patterns are validated needs and which are accidental constraints;
- which interaction alternatives should be compared or tested with representative users;
- what evidence or accountable authority can resolve remaining uncertainty.

Classify consequential statements as facts, assumptions, proposals, decisions, recommendations, or open questions. Challenge happy-path-only frames, unlabeled icon assumptions, unexplained required fields, premature confirmation, ambiguous destructive actions, hidden context changes, inaccessible feedback, excessive disclosure, technical terminology, and UI behavior that silently invents domain rules.

## Derive frames from behavior without duplicating it

Use the detailed use-case scenarios and acceptance examples as authoritative behavioral input. Translate them into interaction consequences rather than copying scenario prose into the wireframe artifact.

- Combine consecutive use-case steps in one frame when the actor can understand and complete them coherently.
- Separate frames or states when the actor must make a materially different decision, verify a consequential result, recover from failure, or change working context.
- Model an alternative as an inline state, variation, modal concept, separate frame, or handoff according to its interaction impact rather than its numbering in the use case.
- Keep business outcomes and guarantees linked to the use case. The wireframe shows how the actor perceives and influences them.
- Do not hide unresolved domain rules inside labels, required markers, default values, validation messages, or enabled actions. Mark them as hypotheses and link the open question.

## Revise continuously and preserve traceability

After material new evidence:

1. reconsider frame boundaries, information hierarchy, actions, states, transitions, annotations, and labels;
2. add, rename, split, merge, move, reject, or retire frames and cross-frame states as warranted;
3. update links to use cases, navigation-map destinations, constraints, business objects, and design-system patterns;
4. identify impacts on Product Vision, glossary, actors, use cases, rules, the navigation map, design system, security, architecture, tests, or delivery work;
5. explain material revisions before moving to the next question.

Preserve stable identifiers without letting them freeze a defective interaction model:

- assign `WF-NNN` only when a frame enters the authoritative artifact;
- keep the ID for a rename, annotation refinement, layout refinement, or state elaboration that preserves the same interaction responsibility;
- on a split, retain the original ID only for a clearly continuous frame and assign new IDs to genuinely new frames; otherwise retire the original and assign new IDs to all successors;
- on a merge, retain an existing ID only when one frame clearly continues and absorbs another; otherwise create a new ID and retire the predecessors;
- retire a frame or cross-frame state that no longer applies and never reuse its ID;
- record material predecessor and successor relationships and the evidence or decision behind the change.

## Use a wireframe flow proportionately

A wireframe flow may appear near the beginning of the artifact when it materially helps readers understand how the represented frames and states connect. Keep it subordinate to the use case:

- show `WF-NNN` frames and only material intermediate states or handoffs;
- use transition labels for actor choices or observable outcomes, not copied use-case narration;
- do not present it as the authoritative business sequence, process model, or navigation map;
- keep detailed extensions and guarantees in the use case and detailed frame behavior in annotations;
- omit the diagram when the textual frame inventory and neighboring-frame links are clearer.

Use an embedded Mermaid `flowchart`, normally `LR`, for a compact coherent flow. Keep the source directly in the Markdown artifact. Render and inspect it; source order does not guarantee visual order.

This version of the skill does not prescribe a hierarchy or partitioning scheme for a large collection of wireframes. Do not keep expanding one global flow until it becomes unreadable, shrink labels to compensate, or invent a repository hierarchy implicitly. When breadth makes the overview difficult to scan, keep the textual inventory authoritative, preserve existing readable views, record the exact scaling problem, and ask the user to establish the hierarchy or view-partitioning convention before restructuring the artifact.

## Validate the interaction concept

Stress-test representative frames and transitions against:

- normal completion and observable success;
- alternatives, actor choices, no-result and empty states;
- invalid, missing, late, conflicting, corrected, or stale information;
- cancellation, interruption, timeout, retry, duplicate submission, and safe recovery;
- authorization failure and information minimization;
- handoffs to neighboring use cases, channels, roles, or external systems;
- keyboard-only operation, focus order, error summary, programmatic labels, status announcements, zoom, text resizing, and non-color cues;
- representative viewports, input devices, high-frequency work, and interruption contexts;
- consistency of application shell, navigation, working context, terminology, and reusable patterns across frames.

Do not manufacture interaction states merely to fill a checklist. Cover those supported by the use case, cross-cutting requirements, risk, or explicit validation goals, and record material gaps.

## Determine readiness

An early draft is ready when the actors, interaction boundary, authoritative behavioral input, and current frame coverage are sufficiently clear; every shown frame and state is distinguishable as proposed or previously accepted; known gaps and validation needs are visible; the user confirms the snapshot; and the artifact remains `draft`.

A reviewable wireframe set is ready when:

- every frame has a distinct interaction purpose and links to relevant actor goals and navigation destinations;
- information, actions, context, feedback, transitions, and recovery are understandable without inventing business rules;
- normal, material alternative, error, interruption, and completion states are represented or explicitly handed off;
- labels agree with the glossary and navigation map;
- privacy, safety, accessibility, organization, location, channel, and viewport concerns are visible;
- cross-frame state requirements are consistent and not duplicated as contradictory local annotations;
- stable IDs are unique and lifecycle changes preserve traceability;
- any wireframe flow remains readable and does not masquerade as a business process;
- unresolved alternatives have an owner and resolution condition.

Do not demand visual polish or perfect knowledge. A non-blocking uncertainty may remain when its impact, owner, and resolution condition are explicit.

## Confirm the understanding

Before writing, present a concise synthesis containing:

- actors, goals, use cases, destinations, channels, contexts, and intended wireframe coverage;
- proposed frames, important states, transitions, information, actions, feedback, and recovery;
- application-shell and working-context expectations;
- accessibility, privacy, safety, interruption, device, and responsive findings;
- material alternatives, rejected concepts, and validation needs;
- facts, assumptions, recommendations, decisions, and open questions;
- whether a compact wireframe flow remains useful and readable;
- whether browser-viewable HTML would materially improve review of transitions, states, responsive behavior, keyboard operation, or representative task completion;
- exact handoffs required for Product Vision, glossary, actors, use cases, rules, the navigation map, design system, security, architecture, tests, or decisions;
- known limitations in the available evidence.

Ask the user to confirm or correct the synthesis as an accurate representation of the current understanding. Confirmation does not make the interaction concept optimal, validated, or accepted. Record the lifecycle status and accountable authority that actually apply.

## Create or update the wireframe artifact

After confirmation:

1. Update the authoritative wireframe artifact using `docs/governance/templates/wireframes.md` and the repository's established compatible structure.
2. Maintain a concise frame inventory with stable IDs, actor-facing purposes, related actors, use cases, navigation-map destinations, and status.
3. Include a compact embedded Mermaid Wireframe Flow only when it improves comprehension and remains readable.
4. Represent each frame with a low-fidelity text diagram or another repository-approved reviewable form, followed by annotations that explain behavior, constraints, uncertainty, accessibility, feedback, and recovery.
5. Record reusable cross-frame states separately when they apply to several frames; keep one-frame behavior with that frame.
6. Keep the artifact concise. Link to authoritative actor goals, scenarios, rules, business objects, constraints, evidence, decisions, the navigation map, and design-system guidance rather than duplicating them.
7. Keep a new or materially changed wireframe artifact in `draft` unless the accountable authority explicitly approves another lifecycle state. Preserve an existing status when no semantic change occurred.
8. Apply only explicitly authorized, meaning-preserving secondary-artifact repairs. Produce precise handoffs for material changes owned elsewhere.
9. Create or update a browser-viewable HTML rendering when the user requests it or when its clickability materially improves validation and the intended representation has been confirmed. Do not generate it merely because HTML is available.
10. Do not create high-fidelity mockups, final visual styling, new design tokens, production components, technical routes, permissions, APIs, schemas, architecture, backlog items, or application implementation unless the user separately requests them.

### Keep low-fidelity representations reviewable

- Use a consistent canvas width and application-shell structure across related text wireframes so changes in content and state are easy to compare.
- Put actor-visible labels and values in the drawing; put rationale, constraints, and unresolved questions in annotations.
- Show primary, secondary, back, cancel, destructive, and recovery actions distinctly in text without relying on color.
- Show representative content synthetically and minimize personal or health information.
- Mark illustrative identifiers, fields, values, and required states as hypotheses when their governing rules are unresolved.
- Keep the diagrams implementation-neutral. A box communicates grouping or placement, not necessarily a frontend component.
- When a frame has several materially different states, use small focused variants rather than one overloaded drawing.

## Create browser-viewable HTML wireframes proportionately

HTML is useful when reviewers need to experience application-shell continuity, navigation, input carry-over, progressive disclosure, material alternatives, validation, feedback, recovery, responsive behavior, focus movement, or a representative end-to-end actor goal. Prefer static text diagrams when a frame is simple and clickability would add no meaningful evidence.

When HTML rendering is selected:

- keep `wireframes.md` authoritative for frame identity, meaning, annotations, lifecycle, unresolved questions, and traceability;
- map every rendered frame or material state to its stable `WF-NNN` or `UX-WF-NNN` identifier and provide stable hash or equivalent local entry points when practical;
- derive screen sequence and observable outcomes from linked use cases without reproducing domain logic in JavaScript;
- use semantic HTML, persistent labels, meaningful headings, logical reading and focus order, live status where warranted, keyboard-operable controls, and non-color indicators;
- use synthetic, visibly non-production information and minimize traveler, payment, identity, or other sensitive detail;
- use plain HTML and CSS by default, adding only the minimum local JavaScript needed to switch frames, expose states, retain illustrative input, or demonstrate feedback;
- do not add a framework, package, service, network dependency, build system, backend, storage, authentication, authorization, telemetry, or application architecture merely to render the wireframes;
- mark preview-only controls, state selectors, annotations, or test affordances so reviewers cannot mistake them for proposed product UI;
- make cancellation, unsuccessful outcomes, duplicate-submission prevention, and completion unambiguous without pretending unresolved business rules are decided;
- link the rendering from the authoritative Markdown artifact and routing page, and state there that it is a rendering rather than an independent specification.

### Align HTML with the design system

Use accepted or draft design-system foundations and reusable patterns when they exist, but preserve their lifecycle and uncertainty. Map their semantic typography, color, spacing, focus, shell, navigation, form, status, action, and completion guidance into shared CSS rather than restating the design system in each frame.

When representative wireframes precede a sufficiently developed design system, use a deliberately neutral local stylesheet and hand repeated needs to the design-system workflow. Do not silently establish brand styling, final component anatomy, breakpoints, or implementation tokens through CSS. When the design system later changes, update affected renderings for alignment without changing wireframe behavior unless the behavioral evidence also changed.

Keep one compact HTML rendering with shared CSS and optional shared JavaScript while it remains understandable. If breadth makes one rendering or one global control surface difficult to navigate, preserve the Markdown catalog and existing readable views, record the scaling problem, and obtain an agreed hierarchy or partitioning convention before multiplying files or inventing a structure.

## Validate and report

Critically compare the completed artifact with the confirmed synthesis and authoritative evidence. Verify frame and state identifiers, labels, actors, use cases, navigation destinations, information, actions, transitions, guarantees perceived by the actor, state coverage, lifecycle status, and links. Confirm that the artifact has not silently become a business-process specification, design system, permissions model, technical route map, architecture, or implementation plan.

Render or preview every Mermaid diagram and inspect the low-fidelity frames at a readable size. For HTML renderings, verify local assets and links, browser loading without console failures, stable frame entry points, at least one representative normal path, material alternative and failure states, value carry-over where shown, prevention of misleading success, keyboard and focus behavior, and representative wide and narrow layouts. Use the repository's existing browser tooling when available; do not install, rebuild, replace, upgrade, or downgrade tooling solely for this workflow. Perform feasible checks manually and report skipped validation and impact.

Report changed files, wireframe lifecycle status, frame and state changes, interaction coverage, material alternatives, validation needs, cross-artifact handoffs, validation performed, HTML rendering coverage when applicable, remaining assumptions and open questions, and residual limitations. Do not present provisional wireframes or a working HTML path as usability-validated, accepted, visually final, production-ready, or implementation-ready.
