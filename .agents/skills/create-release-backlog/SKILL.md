---
name: create-release-backlog
description: Create, broadly refine, correct, or assess an evidence-backed Release Backlog of Epics and Features from product, solution, and validation evidence. Use for initial creation and structural changes not bounded to one iteration; use update-release-backlog for reconciliation driven by selected Stories and Slice links. Do not create Stories, make sprint commitments, synchronize a tracker, or implement work.
---

# Create Release Backlog

Create or evolve a tracker-independent Release Backlog with the user. Translate the current product definition, solution design, validation evidence, constraints, and management context into a coherent Epic and Feature structure without turning delivery planning into a competing requirements specification.

Treat the backlog as a revisable coarse plan. Later requirement detail, stakeholder decisions, architecture changes, prototype findings, iteration results, risks, or scope decisions may split, combine, reorder, add, defer, or retire items. The user's instructions take precedence. Authorization to create the Release Backlog does not authorize product-scope changes, detailed Story creation, sprint planning, issue-tracker writes, implementation, or unrelated repository edits.

## Preserve artifact authority

- Product Vision owns product intent, target users, outcomes, principles, broad scope, and success measures.
- Scope Management, constraints, and exclusions own accepted scope boundaries and scope-change control.
- Requirements artifacts own actors, domain meaning, behavior, rules, business objects, qualities, and experience expectations.
- Software, Entity, Security, and Technology artifacts own their respective solution-design decisions and boundaries.
- Prototype and test artifacts own validation hypotheses and evidence; successful validation does not create product scope by implication.
- Project Management owns general planning and work-tracking policy.
- Release Backlog owns the negotiable Epic and Feature organization, stable planning identifiers, coarse dependencies, sequencing guidance, and later release or iteration outlook.
- Risk Management owns material uncertainty and treatment; Stakeholder Management owns decision authority and engagement.
- Decision records own accepted consequential choices and rejected alternatives.
- Stories and iteration backlogs own committed vertical slices only after iteration planning selects them.

Backlog items organize delivery. They link to authoritative product and solution artifacts rather than copying or replacing them. Do not silently repair or expand an owning artifact to make a candidate backlog structure appear supported. Hand material gaps and contradictions to the appropriate workflow.

## Remain independent of issue tracking

The Release Backlog must remain usable with any work-tracking arrangement, including repository Markdown files, GitHub Issues, GitLab Issues, Jira, another product, or no issue tracker yet.

- Do not require or assume tracker-specific issue types, fields, labels, workflows, hierarchy features, URLs, APIs, or status names.
- Do not query, create, update, delete, reconcile, import, export, or synchronize tracker items as part of this skill.
- Do not create repository-based issue files as a substitute for external synchronization.
- Do not treat a tracker as authoritative for product intent, requirements, architecture, or the coarse release plan.
- Use stable tracker-neutral planning identifiers such as `EP-NNN` and `FT-NNN`. A separately authorized publication workflow may later carry those identifiers into the selected tracker.
- When repository decisions name a tracker, reflect only the applicable authority boundary in the artifact. Do not embed operational tracker metadata in the Epic and Feature definitions.

If the user separately requests publication or synchronization, finish or pause this skill at a coherent Release Backlog state and hand the approved artifact to a separate, explicitly authorized workflow. Do not add tracker behavior to this skill.

## Use planning terms precisely

- **Release Backlog:** the coarse, evolving plan of supported Epics and Features plus their dependencies, sequencing, and planning questions. It is not a requirements catalog or iteration backlog.
- **Release number:** the stable, zero-padded three-digit identity of one governed release horizon, reflected in its `release-NNN-backlog.md` filename. It is not a priority, date, lifecycle status, or claim that the release has been accepted or delivered.
- **Epic:** a coherent product or operational outcome normally containing multiple meaningful Features and commonly spanning more than one iteration.
- **Feature:** one independently understandable, demonstrable, and evaluable capability within exactly one Epic. It may require several Stories.
- **Story:** one independently reviewable vertical delivery slice small enough for an iteration. Stories are normally outside this skill.
- **Enabler Epic or Feature:** an independently evaluable security, migration, operational, technical, or delivery outcome. Supporting activity alone is not an enabler backlog item.
- **Primary anchor:** the authoritative domain, use case, requirement, architecture, security, constraint, or evidence that principally supports an item.
- **Coarse dependency:** an outcome-level prerequisite or ordering influence, not a task-level dependency graph or implementation sequence.
- **Release allocation:** a planning decision that associates candidate outcomes with a release horizon. It does not by itself commit detailed scope or dates.

Do not equate domains with Epics, use cases with Features, or use-case slices with Stories. These are useful derivation defaults, not identity or one-to-one cardinality rules.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md`, the repository context map, and the management reading path.
2. Read current Project Management, every existing numbered Release Backlog needed to establish numbering and continuity, Scope Management, Risk Management, Stakeholder Management, relevant decisions, workflows, and definition of done.
3. Read the Product Vision, glossary, domains, actors, use cases and detailed specifications, business objects, constraints, exclusions, quality requirements, UX artifacts, rules, and source evidence needed to understand product outcomes.
4. Read the Software Architecture, Logical Entity Model, Security Architecture, Technology baseline, and relevant decisions needed to understand module ownership, cross-cutting outcomes, dependencies, and enablers.
5. Read prototype, test, implementation, migration, delivery, and operational evidence only where it affects feasibility, sequencing, risk, or planning confidence.
6. Read the canonical [Release Backlog template](../../../docs/governance/templates/release-backlog.md) and preserve any established compatible structure.

Record the lifecycle status and authority of material inputs. Draft or incomplete artifacts may support a draft backlog when uncertainty, missing coverage, and validation needs remain explicit. Do not turn a draft use case, assumed capability, prototype treatment, or implemented convenience into accepted release scope.

Maintain Release Backlogs as a numbered series in `docs/management/`:

- use the zero-padded filename `release-NNN-backlog.md`, beginning with the existing `release-001-backlog.md`;
- preserve a release number across refinement, correction, replanning, status changes, and wording changes while the governed release horizon remains the same;
- allocate a new number monotonically from the highest number ever assigned only when the user or authoritative planning decision explicitly establishes a distinct new release horizon;
- never reuse or renumber a retired, replaced, delivered, or otherwise historical release number;
- do not recreate an unnumbered `release-backlog.md` alias;
- keep `docs/management/README.md` current as the index of numbered Release Backlogs.

Numbering identifies the artifact and its release horizon. It does not by itself allocate Epics or Features, commit scope or dates, establish priority, accept the backlog, or authorize delivery.

## Select the operating mode and planning horizon

Determine the mode from the request and existing artifact:

- **Initial backlog:** derive the first reviewable Epic and Feature structure from the available product and solution evidence.
- **Refinement or correction:** reopen affected item boundaries, anchors, dependencies, sequencing, classifications, or questions while preserving unaffected identifiers and content.
- **Selected-scope backlog:** plan only a named product area, release horizon, replacement slice, or coherent subset without implying complete product coverage.
- **Replanning:** revise ordering or allocation after new evidence, scope decisions, risks, delivery results, or changed constraints.
- **Alignment assessment:** compare the backlog with current authoritative artifacts and report gaps or drift without writing unless changes are authorized.
- **Early draft:** when explicitly requested, record a provisional backlog despite incomplete inputs, making limitations and resolution needs visible.

For reconciliation driven specifically by selected or replanned Sprint Backlog Stories and their Slice traceability, use [Update Release Backlog](../update-release-backlog/SKILL.md). Keep this skill for initial creation and broad structural refinement beyond that iteration-specific update.

State the target release number, product boundary, planning horizon, included artifacts, known exclusions, and expected level of detail. For refinement, use the existing numbered artifact. For a distinct new release horizon, inspect all existing numbered Release Backlogs, allocate the next unused number monotonically, and explain the evidence or user decision that authorizes creating it. Do not infer a new release, release commitment, target date, budget, team capacity, priority, or implementation order from document order or current code.

On every later invocation, read the current Epic and Feature catalog, identifiers, boundary notes, dependencies, sequencing, allocations, assumptions, open questions, and related decisions before proposing change.

## Build an evidence and coverage map

Create a working map of the planning-relevant evidence:

- product outcomes, capability areas, and explicit success measures;
- accepted, proposed, excluded, deferred, and unresolved scope;
- domains, subdomains, actor goals, use cases, and detailed scenarios;
- business-object lifecycles and information authority;
- software modules, interaction or composition responsibilities, and material dependencies;
- security, privacy, compliance, migration, deployment, operation, and assurance outcomes;
- prototype findings and limitations;
- stakeholder authority, risks, constraints, deadlines, and transition needs;
- existing backlog items and delivery evidence where an artifact already exists.

Classify consequential statements as facts, assumptions, proposals, decisions, commitments, or open questions. Identify unsupported capability candidates rather than filling gaps from general industry practice.

Maintain coverage in both directions:

- each included Epic and Feature has sufficient authoritative evidence;
- each material in-scope outcome and representative actor goal is mapped, explicitly deferred, or identified as a gap;
- cross-cutting obligations are either part of every affected item's completion evidence or represented by a justified independently evaluable enabler outcome.

## Derive and challenge Epic candidates

Start with product outcomes, capability areas, subdomains, module groupings, major actor-goal families, and transition outcomes as candidate signals. For each candidate establish:

- outcome and beneficiaries;
- primary authoritative anchors;
- why its capabilities belong together;
- explicit inclusions and exclusions;
- likely Feature children;
- cross-domain or cross-module scope;
- material dependencies and sequencing implications;
- success evidence at Epic level;
- assumptions, confidence, and open boundary questions.

Challenge every candidate:

- split it when contained outcomes, lifecycles, authorities, risks, or delivery paths are independently meaningful;
- combine candidates when neither produces an independently understandable outcome or their separation would duplicate acceptance;
- allow one Epic to span subdomains or modules when that is necessary for one coherent outcome and explain the mapping;
- avoid generic technical, architecture-layer, component, team, or activity Epics;
- create an enabler Epic only when it delivers an independently evaluable operational, security, assurance, migration, or transition outcome;
- do not create an Epic merely to mirror every subdomain, module, workstream, or organizational unit.

An Epic remains a candidate until the user confirms that its outcome, boundary, and planning usefulness reflect the intended product and delivery view.

## Derive and challenge Features

For each confirmed Epic, derive Feature candidates from coherent actor goals, use cases, capability slices, lifecycle segments, cross-use-case outcomes, or independently evaluable enabler results. Each Feature must:

- have exactly one parent Epic;
- describe an observable product or operational capability rather than an activity or technical layer;
- link its primary authoritative anchors;
- explain splits of one broad use case or combinations of several use cases;
- state explicit scope and exclusions at a planning level;
- be demonstrable and evaluable as a coherent result;
- remain large enough to permit responsible Story slicing during iteration planning;
- identify material dependencies, risks, assumptions, and specification gaps.

Do not create Stories, acceptance-test inventories, implementation tasks, estimates, assignments, or sprint commitments. When a Feature cannot yet be responsibly defined, retain an open question or deferred capability instead of manufacturing detail.

Technical, architectural, security, test, migration, infrastructure, documentation, and operational activities normally remain supporting work within the affected Feature. Elevate one only when it creates a distinct outcome that can be evaluated independently and is meaningful at release-planning level.

## Assign and preserve stable identifiers

Use the repository's stable-ID convention. Unless another accepted convention exists:

- assign `EP-NNN` to an Epic when it enters the authoritative Release Backlog;
- assign `FT-NNN` to a Feature when it enters the authoritative Release Backlog;
- allocate monotonically and never reuse a retired identifier;
- preserve identifiers when wording, order, parent wording, or non-material boundaries change;
- explicitly record material split, combination, replacement, or retirement effects;
- do not renumber items merely to match priority, sequence, release, domain, or tracker order.

Identifiers belong to the repository plan and remain stable regardless of the chosen issue tracker.

## Establish coarse dependencies and sequencing

Derive only planning-level relationships supported by evidence. Distinguish:

- hard outcome prerequisites from preferred sequencing;
- shared foundations from vertical value delivery;
- product Features from cross-cutting obligations;
- parallelizable work from actual dependency;
- validation or decision gates from implementation order;
- migration or transition needs from a final downstream phase.

Prefer vertical increments that combine necessary product, architecture, data, security, test, and operational evidence. Do not sequence all foundations before all user value, or defer security, migration, quality, and operation to a final phase.

Do not invent dates, durations, estimates, capacity, staffing, assignments, priorities, release names, or iteration allocations. Record them only when the user or authoritative planning evidence establishes them. Keep logical sequencing visibly distinct from calendar commitment.

## Work with the human in the loop

The agent performs the evidence synthesis, candidate derivation, coverage analysis, alternative comparison, consistency checks, and artifact drafting. The user supplies or confirms product and delivery intent and remains accountable for material planning choices.

Ask the smallest set of highest-value questions needed to resolve decisions such as:

- the planning horizon and meaning of the next usable release;
- Epic outcome boundaries and cross-domain groupings;
- Feature splits or combinations where several coherent structures are possible;
- inclusion, exclusion, or deferral of weakly evidenced capabilities;
- whether a security, migration, operational, or technical outcome warrants an enabler item;
- material dependency and sequencing trade-offs;
- the disposition of contradictions and high-impact open questions.

Do not ask the user to manually enumerate a backlog that can be responsibly derived from the artifacts. Present a reasoned candidate structure, alternatives where material, evidence gaps, and a recommendation. Iterate with the user until the synthesis is coherent enough for the requested lifecycle status.

Before material writes, present a concise synthesis of:

- mode, target release number, planning horizon, and input status;
- proposed Epic outcomes and non-one-to-one derivations;
- Feature boundaries and primary anchors;
- enabler treatment and cross-cutting obligations;
- coverage, omissions, and deferrals;
- coarse dependencies and sequencing;
- assumptions, open questions, risks, and handoffs.

Ask the user to confirm or correct the synthesis unless they explicitly request an immediate provisional draft. Confirmation means the draft reflects the current planning intent; it does not accept underlying requirements, commit delivery, allocate a release, or authorize tracker publication.

## Create or update the Release Backlog artifact

After confirmation, or immediately for an explicitly requested provisional draft, create or update the authoritative Release Backlog using the canonical [Release Backlog template](../../../docs/governance/templates/release-backlog.md). Preserve an established compatible structure. For a fresh artifact, use this structure:

1. title and repository-standard status, owner, and last-reviewed metadata;
2. the stable release number and the bounded release horizon it identifies;
3. concise authority and work-tracking boundary;
4. planning principles;
5. initial or current Release Backlog;
6. one section per Epic containing:
   - stable Epic identifier and outcome-oriented name;
   - outcome statement;
   - classification when it is an enabler;
   - a Feature table with stable identifier, intended capability, and primary anchors;
   - boundary or validation note where material;
7. coarse dependency and sequencing guidance;
8. release or iteration allocations only when actually decided;
9. open planning questions;
10. sources and related artifacts.

Keep a new or materially revised artifact in `draft` unless the accountable authority explicitly assigns another lifecycle status. Use concise summaries and links rather than copying requirements or architecture detail.

On refinement:

- preserve unaffected content and identifiers;
- explain material additions, splits, combinations, moves, retirements, or sequence changes;
- reconcile coverage and dependencies after every boundary change;
- update Project Management or management navigation only when needed to preserve the declared artifact authority and links;
- apply only authorized, meaning-preserving repairs to related artifacts;
- hand material requirement, scope, architecture, security, risk, stakeholder, or operational changes to their owning workflows.

Never create, update, or synchronize issue-tracker items during this step.

## Determine readiness

An early draft is ready when its planning horizon and input status are explicit, every item has enough evidence not to mislead, unsupported candidates are excluded or marked, major omissions are visible, and the user confirms the provisional structure.

A reviewable Release Backlog is ready for its declared horizon when:

- each Epic expresses one coherent product or operational outcome with justified boundaries;
- each Feature has exactly one Epic parent and is independently understandable, demonstrable, and evaluable;
- domains, use cases, modules, requirements, controls, constraints, and evidence are linked rather than redefined;
- non-one-to-one mappings are explained where they materially affect understanding;
- in-scope outcomes and actor goals are covered, deferred, excluded, or identified as gaps;
- enabler items represent outcomes rather than collections of technical activity;
- Feature-specific security, quality, data, test, and operational obligations are not hidden inside a later generic Epic;
- dependencies and sequencing are evidence-based and clearly distinct from calendar commitments;
- identifiers are stable and tracker-neutral;
- assumptions, open questions, risks, limitations, and cross-artifact handoffs remain visible;
- no Stories, estimates, assignments, sprint commitments, implementation tasks, or tracker state were invented.

Do not require system-wide completeness for a selected planning horizon. Do not propose acceptance while a material contradiction or missing authority makes the backlog misleading.

## Validate and report

Critically compare the completed artifact with the confirmed synthesis and authoritative inputs. Verify:

- release filenames use the `release-NNN-backlog.md` convention, numbers are unique and monotonic, the target number is preserved for refinement, and every new number has an explicit new-horizon basis;
- identifier uniqueness, continuity, preservation, and non-reuse;
- every Feature has exactly one Epic parent;
- every item has a coherent outcome and sufficient authoritative anchors;
- requirement, use-case, domain, module, security, constraint, and prototype references resolve;
- material product outcomes and actor goals have a visible disposition;
- Epic and Feature boundaries avoid unexplained overlap or gaps;
- enabler treatment and cross-cutting obligations are consistent;
- dependency and sequencing statements do not imply unsupported dates, estimates, assignments, or implementation order;
- lifecycle status and input uncertainty are represented honestly;
- management navigation and cross-artifact links remain valid;
- the artifact contains no issue-tracker-specific operational metadata or synchronization behavior unless an accepted repository decision merely needs to be referenced as context.

Run repository documentation validation when available. If configured tooling is unavailable, do not install or replace it as part of this workflow; perform feasible manual checks and report the skipped validation and impact.

Report the target release number and artifact path, changed files, lifecycle status, Epic and Feature counts, material boundary decisions, enabler treatment, coverage and deferrals, dependency and sequencing conclusions, assumptions, open questions, handoffs, and validation results. State explicitly that no issue-tracker synchronization was performed. Do not present a draft backlog as accepted scope, a committed release plan, or an iteration backlog.
