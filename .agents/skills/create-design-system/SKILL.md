---
name: create-design-system
description: Collaboratively create, refine, correct, or assess a requirements-level design system of reusable experience principles, semantic foundations, interaction patterns, components, content guidance, and validation criteria. Use after representative navigation and wireframes exist; do not use it for high-fidelity mockups, brand invention, framework or component-library selection, frontend implementation, or product behavior owned by use cases.
---

# Create Design System

Create or evolve the authoritative requirements-level design system for the target product. Establish a coherent reusable experience language that can guide wireframes, prototypes, implementation, and evaluation without prematurely choosing a design tool, frontend framework, component library, or code structure.

The skill is generic. Product identity, actors, terminology, channels, interaction risks, accessibility needs, foundations, patterns, and components must come from the current repository and stakeholder evidence. Existing design-system content is a revisable hypothesis rather than unquestionable truth. Treat the user as a collaborative expert whose expertise may include the business domain, operations, product, UX, accessibility, visual design, architecture, and the existing system.

The user's instructions take precedence over this skill. Authorization to define a design system does not authorize changes to product intent, actor goals, navigation, business behavior, permissions, architecture, implementation technology, branding, or unrelated artifacts.

## Preserve semantic ownership

- The Product Vision owns product intent, target users, outcomes, capabilities, scope, constraints, and exclusions.
- The actor catalog and UX research own evidenced roles, contexts of use, abilities, environments, and user needs.
- Use cases own actor goals, scenarios, outcomes, extensions, and guarantees.
- The navigation map owns destinations, navigation hierarchy, labels, and entry points.
- Wireframes own interaction-specific information hierarchy, actions, states, feedback, recovery, and transitions.
- The design system owns reusable experience principles, semantic foundations, cross-interaction patterns, component responsibilities and variants, content guidance, and design-system validation criteria.
- Non-functional requirements own measurable cross-cutting quality and compliance outcomes. The design system implements or interprets them as reusable UX guidance without replacing their authority.
- Architecture and implementation own technical components, framework selection, CSS or native tokens, route structure, code, packaging, and runtime behavior.
- Branding evidence or an approved brand system owns logos, brand identity, and brand-specific visual constraints.

Do not silently change an owning artifact to make a reusable pattern fit. Apply a secondary-artifact edit only when it is meaning-preserving, necessary for consistency, and within the user's requested scope. Hand material changes to the owning workflow.

## Use design-system terms precisely

- **Experience principle**: a durable rule guiding interaction decisions across several contexts.
- **Semantic token**: an implementation-independent name for a visual or spatial role, such as primary text, warning, focus, or default spacing. A draft value is a hypothesis, not necessarily final code.
- **Pattern**: reusable guidance for solving an interaction problem across several frames or goals.
- **Component responsibility**: the actor-facing purpose, content, behavior, variants, and states expected from a reusable UI concept. It is not an implementation class.
- **Content guidance**: reusable language and message rules that preserve domain meaning and support comprehension.
- **Design-system validation criterion**: evidence needed to show that a principle, foundation, pattern, or component works across its intended contexts.

Do not equate any of the following without evidence:

- a wireframe box and a reusable component;
- a semantic token and a CSS custom property or framework variable;
- a component name and an implementation package;
- a navigation-map group and a navigation component variant;
- a visual state and a business state;
- hidden or unavailable presentation and authorization;
- one successful interaction example and a product-wide reusable rule;
- conventional appearance and usability or accessibility evidence.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md`.
2. Read the repository context map and follow its UX and requirements reading paths.
3. Read the Product Vision, glossary, actors, use-case catalog, representative detailed use cases and acceptance examples, business objects, applicable rules and cross-cutting requirements, scope exclusions, constraints, navigation map, wireframes, existing design system, UX or user-research evidence, approved branding evidence, linked sources, applicable decisions, notation guidance, artifact-lifecycle guidance, requirements workflow, and definition of done when present.
4. Load only additional architecture, security, test, operations, or implementation context that materially constrains reusable experience behavior.

The initial workflow requires representative actor goals, navigation, and low-fidelity interaction states from which reusable needs can be distinguished from one-off details. If those prerequisites are materially absent or contradictory, identify the exact gap and hand it to the owning workflow instead of inventing a comprehensive component system.

Use `docs/governance/templates/design-system.md` when present. In this repository, maintain the authoritative topic document at `docs/requirements/ux/design-system/design-system.md` and its routing page at `docs/requirements/ux/design-system/README.md`. Preserve a compatible established structure.

## Select the operating mode and baseline

Determine the mode from the user's request and existing artifacts. Ask only when materially ambiguous.

- **Initial draft:** derive the first reviewable principles, foundations, patterns, and component responsibilities from representative product evidence.
- **Refinement:** add detail, variants, states, tokens, content guidance, responsive behavior, or validation criteria while preserving unaffected content.
- **Correction:** reopen and change misleading principles, values, patterns, component boundaries, terminology, or criteria when evidence warrants it.
- **Alignment:** reconcile the design system after changes to Product Vision, actors, use cases, requirements, the navigation map, wireframes, accessibility needs, or approved brand guidance.
- **Assessment:** evaluate consistency, reuse, coverage, evidence, and implementation neutrality without writing unless the user authorizes changes.

For a repeated invocation, treat the current design system as the baseline. Preserve unaffected stable identifiers, semantic token names, confirmed principles, component responsibilities, decisions, links, lifecycle status, and user-authored content. Reopen affected entries when new interaction evidence reveals a false generalization or missing variant. Avoid stylistic churn when meaning and behavior are unchanged.

Do not infer artifact breadth from lifecycle status, detail level, or delivery sequence. Establish intended coverage from the user's request and authoritative product boundary. Do not label the artifact by a delivery stage or treat the current component inventory as an exclusion of future product needs.

## Establish the design-system boundary

State provisionally:

- actors, channels, contexts, devices, and interaction families supplying evidence;
- reusable problems and repeated interaction responsibilities already visible in the navigation map and wireframes;
- known product, brand, accessibility, privacy, safety, regulatory, organizational, and environmental constraints;
- which foundations or component concepts already exist and which are unresolved hypotheses;
- whether the task seeks broad foundations, focused correction, or deeper treatment of selected reusable patterns;
- which technology, branding, or implementation choices remain deliberately undecided.

Ask the user to correct material coverage assumptions before detailed design-system questions. Do not infer a reusable rule solely from one frame, and do not require every wireframe element to become a component.

## Build a reusable-pattern inventory

Create a visible working inventory from the authoritative inputs. On later runs, seed it with existing `UX-DS-NNN` principles, semantic tokens, component responsibilities, variants, validation criteria, assumptions, and open questions.

For each candidate record:

- type: principle, foundation, semantic token, pattern, component responsibility, content rule, or validation criterion;
- actor-facing purpose and problem solved;
- interaction families, frames, destinations, and actors that provide evidence;
- content, states, variants, density, responsive, and input-method needs;
- accessibility, privacy, safety, and information-minimization implications;
- relationship to authoritative `UC-`, `NAV-`, `WF-`, `UX-WF-`, `FR-`, `NFR-`, `CON-`, or decision identifiers;
- plausible alternatives and risk of false generalization;
- evidence, accountable expert, confidence, and lifecycle status;
- disposition: unresolved, under analysis, ready to confirm, confirmed, rejected with rationale, or owned open question.

The inventory is an analytical aid. Assign a stable `UX-DS-NNN` identifier only to a durable design-system principle or requirement entering the authoritative artifact. Use stable semantic token names for foundations; do not assign requirement IDs merely to every numeric value or table row.

## Interview as a rigorous collaborative design partner

Tell the user that design-system discovery, refinement, correction, or assessment is beginning. State that a fully proposed reusable language will be written only after the understanding threshold is met, while an explicitly requested early draft may be written as a provisional snapshot after its current meaning and limitations are confirmed.

Ask the highest-value unresolved design-system question next. Prefer one focused question per turn; group tightly related questions only when the user requests a faster questionnaire. Adapt questions to the evidence and preceding answers.

Establish only what is material from the following:

- which experience principles must hold across different roles and interaction families;
- what information density, readability, input efficiency, interruption handling, and error recovery the work contexts require;
- which typography, color, spacing, sizing, shape, icon, motion, and focus roles need semantic foundations;
- which application-shell, navigation, context, form, table, list, message, dialog, progress, review, and completion patterns repeat;
- which states and variants are genuinely reusable and which remain interaction-specific;
- what content tone, terminology, action-label, status-message, and error-message rules preserve domain meaning;
- which responsive, keyboard, assistive-technology, touch, zoom, and text-resizing needs apply;
- what traveler, customer, payment, or organizational information must be minimized or protected;
- which legacy or familiar visual conventions measurably support performance and which are accidental constraints;
- which draft values require contrast, usability, accessibility, or cross-context validation;
- what evidence or accountable authority can resolve remaining uncertainty.

Classify consequential statements as facts, assumptions, proposals, decisions, recommendations, or open questions. Challenge decorative rules without an actor need, tokens named after raw colors rather than semantic roles, inaccessible state distinctions, components inferred from implementation libraries, variants that encode permissions, one-off wireframe details promoted to universal rules, and untested claims of familiarity or efficiency.

## Derive reuse from representative interactions

Use navigation-map and wireframe evidence to discover repeated needs without making them subordinate implementation specifications.

- Generalize a principle or pattern only when it protects a recurring actor need or a cross-cutting requirement.
- Keep behavior unique to one actor goal in the owning use case or wireframe; link it from the design system only when a reusable component must accommodate it.
- Define components by actor-facing responsibility, content, states, variants, and accessibility behavior rather than markup or framework APIs.
- Use semantic tokens so later implementations can map values without changing their meaning.
- Keep numeric values explicitly draft until applicable accessibility, usability, device, branding, or implementation evidence supports acceptance.
- Treat component usage links as evidence of applicability, not as delivery scope or proof that the component works everywhere.

## Revise continuously and preserve traceability

After material new evidence:

1. reconsider principles, token meanings and values, patterns, component responsibilities, states, variants, and validation criteria;
2. add, rename, split, merge, replace, reject, or deprecate entries as warranted;
3. update links to navigation-map destinations, wireframes, use cases, requirements, constraints, and decisions;
4. identify impacts on Product Vision, glossary, actors, use cases, requirements, the navigation map, wireframes, security, architecture, tests, or implementation guidance;
5. explain material revisions before moving to the next question.

Preserve traceability without allowing existing names to freeze a defective system:

- keep a `UX-DS-NNN` identifier when wording or evidence changes but the same durable principle remains;
- split or merge identified principles using the repository's normal stable-ID rules and never reuse a retired ID;
- preserve a semantic token name when its role remains the same even if its draft value changes;
- rename a token when its semantic role changes, record the predecessor, and do not silently reuse the old name for a different purpose;
- deprecate superseded principles, tokens, patterns, or components when their continued appearance would mislead consumers;
- record material predecessor and successor relationships and the evidence or decision behind the change.

## Validate reuse and consistency

Test proposed design-system entries across materially different representative interactions:

- conversational travel advice and itinerary composition;
- sales offer, travel order, and payment handling;
- seasonal planning, procurement, inventory, or other high-density staff work where applicable;
- customer-facing, traveler-facing, or external-party interaction where applicable;
- empty, loading, success, warning, validation, authorization, conflict, interruption, failure, and recovery states;
- keyboard-only, assistive-technology, zoom, text-resizing, narrow viewport, touch, and high-density desktop contexts as evidenced;
- different organizations, locations, roles, working contexts, and information-sensitivity levels.

Verify that principles do not contradict tokens, components, wireframes, or the navigation map; that component variants do not encode unevidenced permissions or business rules; and that the same semantic state has compatible language and presentation across interactions.

## Determine readiness

An early draft is ready when the current evidence base and intended coverage are sufficiently clear, every entry is distinguishable as proposed or previously accepted, draft values and false-generalization risks are visible, known gaps and validation needs are explicit, the user confirms the snapshot, and the artifact remains `draft`.

A reviewable design system is ready when:

- every principle, token, pattern, and component responsibility has a distinct reusable purpose;
- entries agree with glossary language, navigation-map structure, wireframe behavior, and applicable requirements;
- component responsibilities specify material states and variants without prescribing implementation APIs;
- semantic tokens express roles rather than accidental raw values;
- color, focus, text, status, motion, and interaction meaning do not rely on one sensory channel;
- applicable responsive, keyboard, assistive-technology, privacy, safety, and information-density needs are visible;
- draft numeric values and open accessibility or branding choices are not presented as accepted facts;
- stable IDs and token lifecycle changes preserve traceability;
- remaining alternatives have an owner and resolution condition.

Do not demand high-fidelity visual polish or complete component coverage. A non-blocking uncertainty may remain when its impact, owner, and resolution condition are explicit.

## Confirm the understanding

Before writing, present a concise synthesis containing:

- product contexts and representative interactions supplying evidence;
- proposed experience principles and semantic foundations;
- reusable patterns and component responsibilities with material states and variants;
- content, responsive, accessibility, privacy, safety, density, and context guidance;
- draft values, material alternatives, rejected generalizations, and validation needs;
- facts, assumptions, recommendations, decisions, and open questions;
- exact handoffs required for Product Vision, glossary, actors, use cases, requirements, the navigation map, wireframes, security, architecture, tests, implementation guidance, branding, or decisions;
- known limitations in the available evidence.

Ask the user to confirm or correct the synthesis as an accurate representation of the current understanding. Confirmation does not make the system comprehensive, usability-validated, accessibility-conformant, visually final, or accepted. Record the lifecycle status and accountable authority that actually apply.

## Create or update the design-system artifact

After confirmation:

1. Update the authoritative design-system artifact using `docs/governance/templates/design-system.md` and the repository's established compatible structure.
2. Maintain stable experience-principle IDs, semantic token names, component responsibilities, material states and variants, content guidance, validation criteria, assumptions, open questions, and lifecycle information.
3. Keep numeric values and unvalidated conventions visibly draft. Link the evidence or resolution condition required to accept them.
4. Keep the artifact concise. Link to actors, use cases, requirements, constraints, the navigation map, wireframes, evidence, brand guidance, and decisions rather than duplicating them.
5. Keep a new or materially changed design system in `draft` unless the accountable authority explicitly approves another lifecycle state. Preserve an existing status when no semantic change occurred.
6. Apply only explicitly authorized, meaning-preserving secondary-artifact repairs. Produce precise handoffs for material changes owned elsewhere.
7. Do not create high-fidelity mockups, logos, brand identity, implementation components, CSS, frontend code, framework configuration, routes, APIs, schemas, architecture, backlog items, or test automation unless the user separately requests them.

## Validate and report

Critically compare the completed artifact with the confirmed synthesis and authoritative evidence. Verify experience-principle IDs, semantic token roles and values, component responsibilities, states, variants, content guidance, validation criteria, lifecycle status, usage links, and cross-artifact consistency. Confirm that the artifact has not silently become a brand invention, implementation library, permissions model, business-rule catalog, or high-fidelity UI specification.

Run repository documentation validation when available. Validate or explicitly defer applicable contrast, keyboard, assistive-technology, responsive, content, usability, and cross-context checks; do not claim conformance from token tables alone. If configured tooling is unavailable, do not rebuild, replace, upgrade, or downgrade it as part of this workflow. Perform feasible checks manually and report skipped validation and impact.

Report changed files, lifecycle status, principle and foundation changes, component and variant changes, representative coverage, material alternatives, cross-artifact handoffs, validation performed, remaining assumptions and open questions, and residual limitations. Do not present a provisional design system as comprehensive, accepted, accessibility-conformant, visually final, or implementation-ready.
