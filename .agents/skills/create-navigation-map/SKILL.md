---
name: create-navigation-map
description: Collaboratively create, refine, correct, or assess a product's information architecture and navigation map from actor goals and UX evidence, and maintain its embedded Mermaid overview. Use after actors and use cases are sufficiently established; do not use it for detailed interaction flows, wireframes, visual design systems, URL design, permissions, software modules, or implementation architecture.
---

# Create Navigation Map

Create or evolve the authoritative information architecture and navigation model for the target product. Treat the navigation map as a UX hypothesis that organizes actor-facing destinations and paths around recognizable tasks, not as a mirror of subdomains, software components, database entities, or delivery increments.

The skill is generic. Product names, roles, navigation labels, destination groups, and delivery priorities must come from the current repository and stakeholder evidence. Existing artifacts are revisable baselines, not unquestionable truth. Treat the user as a collaborative expert whose expertise may include the business domain, operations, product, UX, information architecture, DDD, architecture, and the existing system.

The user's instructions take precedence over this skill. Authorization to analyze or document navigation does not authorize changes to product intent, domain boundaries, actors, use cases, detailed interaction behavior, permissions, architecture, implementation, or unrelated artifacts.

## Preserve semantic ownership

- The Product Vision owns product intent, target users, outcomes, capabilities, scope, constraints, and exclusions.
- The actor catalog owns the stable roles and external participants that interact with the product.
- The use-case catalog and individual use-case specifications own actor goals, scenarios, outcomes, and guarantees.
- The navigation map owns actor-facing destinations, navigation groupings, labels, hierarchy, entry points, orientation paths, and global navigation relationships.
- Wireframes own screen-level information hierarchy, actions, states, feedback, and recovery concepts.
- The design system owns reusable experience principles, tokens, patterns, and component guidance.
- Security and architecture own authentication, authorization, permissions, technical trust boundaries, routes, components, services, APIs, and deployment structure.
- Source and UX-research evidence support analysis but do not become accepted information architecture merely because an agent can derive a plausible structure from them.

Do not silently change an owning artifact to make a navigation proposal fit. Apply a secondary-artifact edit only when it is meaning-preserving, necessary for consistency, and within the user's requested scope. Hand material changes to the owning workflow.

## Use information-architecture terms precisely

- **Destination**: a stable actor-facing place that supports orientation or one or more related goals. It is not necessarily one screen, URL, component, or deployment unit.
- **Navigation group**: a user-recognizable grouping of related destinations. It need not correspond one-to-one with a DDD subdomain.
- **Entry point**: a menu item, contextual link, quick action, deep link, notification, or other supported route into a destination or task.
- **Application shell**: persistent orientation and navigation elements surrounding destinations. It does not define their implementation.
- **Navigation map**: a hierarchical and relational overview of destinations and navigation paths. It is not a use-case diagram, task flow, screen flow, permissions matrix, or URL map.

Do not equate any of the following without evidence:

- one use case and one page;
- one subdomain and one top-level menu item;
- one business object and one destination;
- one actor and one permanently fixed navigation tree;
- menu visibility and authorization;
- navigation hierarchy and browser URL hierarchy;
- dashboard cards and duplicated business behavior;
- an implementation increment and the product's information architecture.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md`.
2. Read the repository context map and follow its UX and requirements reading paths.
3. Read the Product Vision, glossary, domain landscape, actor catalog, use-case catalog, relevant individual use-case specifications, scope exclusions, constraints, quality requirements, existing navigation map, canonical navigation-map template, wireframes, design system, applicable UX or user-research evidence, linked sources, decisions, notation guidance, artifact-lifecycle guidance, requirements workflow, and definition of done when present.
4. Load only additional architecture, security, test, operations, or implementation context that materially constrains the information architecture.

The initial workflow requires a sufficiently clear product boundary, actor baseline, and representative actor goals. If these prerequisites are materially absent or contradictory, identify the exact gap and hand it to the owning workflow instead of inventing navigation to hide it.

Use `docs/governance/templates/navigation-map.md` when present. In this repository, maintain the authoritative topic document at `docs/requirements/ux/navigation-maps/navigation-maps.md` and its routing page at `docs/requirements/ux/navigation-maps/README.md`. Preserve a compatible established structure.

## Select the operating mode and baseline

Determine the mode from the user's request and existing artifacts. Ask only when materially ambiguous.

- **Initial draft:** derive the first reviewable information architecture from product intent, actors, goals, and evidence.
- **Refinement:** add detail, destinations, entry points, labels, or navigation relationships while preserving unaffected structure.
- **Correction:** reopen and change misleading groupings, labels, hierarchy, boundaries, or paths when evidence warrants it.
- **Alignment:** reconcile the navigation map after changes to Product Vision, actors, use cases, constraints, UX evidence, wireframes, or the design system.
- **Assessment:** evaluate coverage, findability, coherence, and consistency without writing unless the user authorizes changes.

For a repeated invocation, treat the current navigation map as the baseline. Preserve unaffected stable identifiers, confirmed labels, decisions, links, lifecycle status, and user-authored content. Do not rewrite merely for style.

Do not infer the breadth of the navigation map from its lifecycle status, its level of detail, or the current delivery sequence. Establish the intended coverage from the user's request and the authoritative product boundary. A coarse broad map and a detailed focused slice may coexist, but their coverage and maturity must remain unambiguous without presenting delivery planning as product structure.

## Establish the analysis boundary

State provisionally:

- the product boundary and actor-facing channels being mapped;
- the actors and contexts of use in scope;
- the actor goals and capabilities that require navigation support;
- whether the task seeks broad coverage, a focused correction, or deeper treatment of selected destinations;
- existing navigation conventions or legacy structures that are evidence rather than automatic requirements;
- applicable accessibility, privacy, safety, regulatory, organizational, and device constraints.

Ask the user to correct material coverage assumptions before detailed structure questions. Do not assume that every known capability needs persistent navigation or that every actor sees the same destinations.

## Build a destination inventory

Create a visible working inventory from the authoritative inputs. On later runs, seed it with the existing `NAV-NNN` entries, labels, hierarchy, entry points, assumptions, and open questions.

For each candidate destination record:

- provisional actor-facing label and purpose;
- actor goals supported and the primary actors who need to find it;
- parent grouping and plausible alternative groupings;
- global, contextual, quick-action, or external entry points;
- orientation and return paths;
- relevant organization, location, device, or channel context;
- confidentiality, discoverability, accessibility, and error-recovery implications;
- evidence, accountable expert, confidence, and lifecycle status;
- disposition: unresolved, under analysis, ready to confirm, confirmed, rejected with rationale, or owned open question.

The inventory is an analytical aid. Assign a stable `NAV-NNN` identifier only when a candidate enters the authoritative navigation map.

## Interview as a rigorous collaborative design partner

Tell the user that navigation-map discovery, refinement, correction, or assessment is beginning. State that a fully proposed structure will be written only after the understanding threshold is met, while an explicitly requested early draft may be written as a provisional snapshot after its current meaning and limitations are confirmed.

Ask the highest-value unresolved information-architecture question next. Prefer one focused question per turn; group tightly related questions only when the user requests a faster questionnaire. Adapt questions to the evidence and preceding answers.

Establish only what is material from the following:

- which actor is trying to accomplish which goal and from what operational context;
- which destinations need persistent navigation and which should be reached contextually;
- what labels actors recognize in their own language;
- which goals belong together in the actor's mental model;
- what the default destination and high-frequency entry points should be;
- how users retain orientation, return safely, and resume interrupted work;
- which destinations or entry points vary by role, organization, location, channel, or device without defining permissions;
- which traveler, customer, payment, or organizational information must not be exposed merely through navigation;
- which legacy conventions are validated needs and which are accidental constraints;
- which alternative hierarchies or labels deserve comparison or usability testing;
- what evidence or accountable authority can resolve remaining uncertainty.

Classify consequential statements as facts, assumptions, proposals, decisions, recommendations, or open questions. Challenge structures that simply copy the domain model, use-case catalog, organization chart, technical architecture, or legacy menu. Also challenge vague catch-all groups, duplicate destinations, action labels masquerading as stable places, and top-level menus that reflect internal terminology rather than actor goals.

## Revise continuously and preserve traceability

After material new evidence:

1. reconsider labels, destination boundaries, groupings, entry points, and orientation paths;
2. add, rename, move, split, merge, reject, or retire candidates as warranted;
3. update actor-goal coverage and relationships with wireframes or design-system patterns;
4. identify impacts on Product Vision, glossary, actors, use cases, constraints, UX research, wireframes, design system, security, or architecture;
5. explain material revisions before moving to the next question.

Preserve stable identifiers without letting them freeze a defective structure:

- assign `NAV-NNN` only when a destination enters the authoritative inventory;
- keep the ID for a rename, regrouping, or refined purpose that preserves the same actor-facing destination;
- on a split, retain the original ID only for a clearly continuous destination and assign new IDs to genuinely new destinations; otherwise retire the original and assign new IDs to all successors;
- on a merge, retain an existing ID only when one destination clearly continues and absorbs another; otherwise create a new ID and retire the predecessors;
- retire a destination that no longer exists and never reuse its ID;
- record material predecessor and successor relationships and the evidence or decision behind the change.

## Validate coverage and usability hypotheses

Verify proportionately that:

- every relevant actor goal has at least one findable entry path or an explicit disposition;
- the same business behavior is not accidentally duplicated by several destinations;
- frequent and safety-sensitive goals have appropriate entry points without overwhelming the primary hierarchy;
- labels use glossary-aligned actor language;
- the default destination, global navigation, contextual navigation, and return paths are coherent;
- customer, travel order, season, and other working contexts remain understandable;
- role-dependent visibility does not become an unevidenced permissions model;
- navigation does not expose protected information or imply unauthorized access;
- keyboard, assistive-technology, small-viewport, interruption, empty-state, and error-recovery implications have been considered at the appropriate level;
- the structure remains understandable when new goals are added.

Coverage does not require one visible menu item per use case. Record intentionally contextual, external, system-initiated, or otherwise non-persistent paths explicitly.

## Determine readiness

An early draft is ready when the current product boundary and intended coverage are sufficiently clear, every shown destination is distinguishable as proposed or previously accepted, known gaps and validation needs are visible, the user confirms the snapshot, and the artifact remains `draft`.

A reviewable navigation map is ready when:

- each destination has a distinct actor-facing purpose;
- labels and grouping agree with domain language and representative actor goals;
- relevant actor goals have findable entry paths or explicit dispositions;
- global, contextual, and high-frequency entry points are distinguished;
- the default destination and orientation model are understood;
- duplicate, catch-all, or technically named destinations are resolved or explicitly owned;
- scope, permissions, routes, domain ownership, and navigation are not conflated;
- stable IDs are unique and lifecycle changes preserve traceability;
- material accessibility, privacy, safety, channel, organization, and location concerns are visible;
- unresolved alternatives have an owner and resolution condition.

Do not demand perfect knowledge. A non-blocking uncertainty may remain when its impact, owner, and resolution condition are explicit.

## Confirm the understanding

Before writing, present a concise synthesis containing:

- product boundary, actors, contexts, and intended navigation-map coverage;
- proposed hierarchy, destinations, labels, entry points, and orientation paths;
- actor-goal coverage and intentionally contextual or external paths;
- material alternatives, rejected structures, and rationale;
- accessibility, privacy, safety, organization, location, channel, and device findings;
- facts, assumptions, recommendations, decisions, and open questions;
- exact handoffs required for Product Vision, glossary, actors, use cases, wireframes, design system, security, architecture, or decisions;
- known limitations in the available evidence.

Ask the user to confirm or correct the synthesis as an accurate representation of the current understanding. Confirmation does not make the navigation map complete, optimal, or accepted. Record the lifecycle status and accountable authority that actually apply.

## Create or update the navigation map

After confirmation:

1. Update the authoritative navigation map using `docs/governance/templates/navigation-map.md` and the repository's established compatible structure.
2. Keep the graphical overview near the beginning of the document as an embedded Mermaid diagram.
3. Keep a destination inventory with stable IDs, actor-facing labels, purposes, entry points, and linked actor goals.
4. Record navigation principles, application-shell expectations, actor-goal coverage, assumptions, open questions, retired destinations, and cross-artifact handoffs when material.
5. Keep the artifact concise. Link to actors, use cases, glossary terms, requirements, constraints, evidence, decisions, wireframes, and design-system guidance rather than duplicating authoritative content.
6. Keep a new or materially changed navigation map in `draft` unless the accountable authority explicitly approves another lifecycle state. Preserve an existing status when no semantic change occurred.
7. Apply only explicitly authorized, meaning-preserving secondary-artifact repairs. Produce precise handoffs for material changes owned elsewhere.
8. Do not create detailed task flows, wireframes, visual styling, permissions, URLs, software modules, services, APIs, schemas, architecture, backlog items, or implementation plans unless the user separately requests them.

### Create the embedded Mermaid navigation map

Use an embedded Mermaid diagram as the default graphical form. Keep it immediately below the **Navigation map** or equivalent graphical-overview heading; do not add a redundant “Mermaid” heading or create a generated image solely for the ordinary navigation-map view.

Use a Mermaid `flowchart` and represent:

- the product or channel shell as the root;
- stable actor-facing destinations as nodes whose labels begin with their `NAV-NNN` identifier;
- navigation groups as subgraphs only when their boundaries improve comprehension;
- persistent hierarchy with solid directed edges;
- materially different contextual or quick-action entry points with labeled dashed edges;
- only relationships that carry navigation meaning.

For a broad hierarchical navigation map, default to `LR`: place the product or channel shell at the left, navigation groups in the next column, and their child destinations to the right. Use another direction only when the current structure demonstrably reads better or the user requests it. Keep sibling destinations in stable-ID order unless confirmed user meaning requires another order. Prefer concise actor-facing labels and avoid embedding use-case descriptions, technical routes, subdomain internals, or implementation state into the diagram.

Use these layout techniques for a broad tree when they improve the actual rendering:

1. Start with `flowchart LR`, declare the shell root once, and connect it directly to every first-level destination or group entry.
2. Represent each first-level branch as a `subgraph` with `direction LR`. Place its group entry on the left and declare its child destinations in the intended stable-ID order so the branch reads from parent to leaves.
3. Mermaid's default layout may stack sibling subgraphs in the reverse of their source declaration order. When visual inspection confirms that behavior, declare the first-level subgraphs and the corresponding root edges in reverse target order so the rendered diagram reads top-to-bottom in the intended order. Treat this as a renderer workaround, not as semantic ordering.
4. Keep the dashboard or other ungrouped first-level destinations connected directly to the root. Verify their rendered position together with the grouped branches rather than assuming source order controls it.
5. Correct ordering by rearranging declarations before adding layout-only nodes or edges. Do not add fake navigation relationships merely to force position.

Mermaid declaration order alone does not guarantee visual ordering. Use small, well-named intermediate grouping nodes or nested subgraphs only when reordering declarations is insufficient and their presence does not suggest a false navigation level. Styling may distinguish shells, groups, and destinations when it remains accessible and subordinate to meaning.

Cross-branch quick-action or contextual edges can dominate Mermaid's automatic layout and reverse or displace the primary hierarchy. When that happens, keep those entry points authoritative in the navigation inventory and omit them from the overview rather than sacrificing the intended stable-ID order.

If the diagram becomes difficult to scan as coverage grows, do not shrink text or remove necessary meaning. Keep the textual inventory authoritative and record the visualization limitation for a later skill refinement, such as focused views or a different rendering strategy. Continue to use the embedded Mermaid form until that visualization change is deliberately agreed.

Render or preview the Markdown with the repository toolchain after every material layout change. Reject a diagram with the root anywhere other than the intended side, branches or leaves on the wrong level, sibling groups in reversed stable-ID order, misleading hierarchy, reversed edges, clipped labels, excessive crossings, inaccessible contrast, or large unexplained empty regions. Correct the Mermaid source and inspect it again; parser success and source-code order alone are insufficient.

## Validate and report

Critically compare the completed navigation map with the confirmed synthesis and authoritative evidence. Verify identifiers, labels, purposes, hierarchy, entry points, actor-goal coverage, lifecycle status, links, and diagram direction. Confirm that navigation has not silently become a permissions model, technical route map, domain diagram, screen flow, or implementation plan.

Run repository documentation validation when available and render or preview the Mermaid diagram. If configured tooling is unavailable, do not rebuild, replace, upgrade, or downgrade it as part of this workflow. Perform feasible checks manually and report skipped validation and impact.

Report changed files, navigation-map lifecycle status, material destination and hierarchy changes, actor-goal coverage, alternatives and rejected proposals, cross-artifact handoffs, validation performed, remaining assumptions and open questions, and residual limitations. Do not present a provisional navigation map as accepted or exhaustive.
