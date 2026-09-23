# Product Vision and Scope

- Status: draft
- Owner: Requirements
- Last reviewed: YYYY-MM-DD

Use this template as a set of prompts for the authoritative statement of product intent, not as a mandatory layout. Keep the Product Vision concise and outcome-oriented; use prose, bullets, or tables as fit the product and available evidence. Omit sections that add no material information. Keep detailed actor definitions, requirements, constraints, scope exclusions, and feature specifications in their authoritative artifacts and link them when they materially qualify or support the Vision.

Classify material statements as facts, assumptions, proposals, decisions, or open questions. Do not present source material as accepted intent, invent missing targets, or assign requirement identifiers to placeholders, proposals, or open questions.

## Vision

Describe the problem or opportunity, the desired future, the product's role in creating that future, and its distinguishing value where evidence supports one. Keep the vision concise, outcome-oriented, and independent of architecture and implementation choices.

## Target users and outcomes

Summarize the people or organisations expected to benefit and the outcomes they need. Concise prose or bullets are sufficient when they are clear. Distinguish users, beneficiaries, and other stakeholders when the distinction matters. Treat newly identified interacting roles that need validation as candidates for `create-actors`; do not establish stable `ACT-` identities here. Link to authoritative actor or stakeholder information when it materially aids understanding.

An optional table can help when several target groups need comparison:

| Target user or stakeholder | Current problem or opportunity | Desired outcome | Evidence and status |
|---|---|---|---|

## Product principles

Record principles when they materially guide product trade-offs. State practical implications where needed for later decisions. Make proposal or decision status explicit when approval is consequential or unclear; a concise list is sufficient when a table adds no value.

An optional table can help compare principles and trade-offs:

| Principle | Practical implication or trade-off | Authority and status, when relevant |
|---|---|---|

## Product capabilities and areas (optional)

Include this section when capability grouping helps explain the product surface, important boundaries, or material distinctions. A concise Vision need not enumerate every capability area. Capability areas group stakeholder-relevant abilities; they are not business domains, bounded contexts, software modules, backlog items, or detailed requirements.

Use prose, bullets, or the optional table below as appropriate. Include representative capabilities only when they clarify intent or distinguish the product. Put detailed coverage in linked authoritative artifacts when that improves reviewability; do not create an exhaustive feature list or supporting evidence document only to fill this template.

| Capability area (if useful) | Contribution or outcome | Representative capabilities (if useful) | Evidence/status (if material) | Boundaries/open questions (if material) |
|---|---|---|---|---|

## Scope

Summarize material product boundaries without repeating capability descriptions, outcomes, principles, success measures, or detailed requirements. Link an authoritative exclusion or constraint when it materially qualifies the Vision; do not infer exclusions from silence or turn this section into a catalog.

Use only the boundary subsections that help explain the current product scope:

### Boundary rules (optional)

- Cross-cutting inclusion, replacement, transition, or delivery-horizon rule that applies across capability areas.

### Outside the current scope (optional)

- Link to an explicit `SE-` entry. Do not infer an exclusion from silence.

## Proposed success measures

Include useful indicators of progress toward desired outcomes when they can be stated without inventing evidence. Directional indicators are acceptable. Add baseline, target, timeframe, and evidence or accountable authority when supported; otherwise defer those details, and keep unapproved targets visibly proposed. This section is not a measurement plan.

| Outcome | Indicator | Baseline | Direction or target | Timeframe | Evidence, authority, and status |
|---|---|---|---|---|---|

The table is optional; concise indicators in prose or bullets are sufficient when clearer.

## Assumptions and open questions

Include this section only for unresolved matters that materially affect product intent, scope, or a pending decision. Link to authoritative `CON-` entries when available. State a validation condition for material assumptions. Give an open question an owner and resolution evidence when it needs follow-up; omit the section when no material unresolved matters remain.

| Type | Statement | Owner | Validation or resolution condition | Review trigger or date |
|---|---|---|---|---|

The table is optional; use prose or bullets when they communicate the unresolved matters more clearly.

## Product and delivery terminology

Use this section only when a product name, software-component or capability label, or delivery term needs a local explanation to understand the Vision. Link to glossary definitions for domain vocabulary instead of duplicating them. Omit the section when terms are already clear from context or authoritative links.

## Sources and related artifacts

- Link directly to sources or related artifacts when they materially support or qualify the Vision, resolve uncertainty, or enable follow-up. Keep candidate handoffs in the owning evidence or open-question location when one is needed; do not duplicate established glossary or actor definitions.
