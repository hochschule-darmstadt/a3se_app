# Product Vision and Scope

- Status: draft
- Owner: Requirements
- Last reviewed: YYYY-MM-DD

Use this template for the authoritative statement of product intent. Replace all instructional text with stakeholder-supported content. Keep detailed actor definitions, requirements, constraints, scope exclusions, and feature specifications in their authoritative artifacts and link them here instead of duplicating them.

Classify material statements as facts, assumptions, proposals, decisions, or open questions. Do not present source material as accepted intent, invent missing targets, or assign requirement identifiers to placeholders, proposals, or open questions.

## Vision

Describe the problem or opportunity, the desired future, the product's role in creating that future, and its distinguishing value where evidence supports one. Keep the vision concise, outcome-oriented, and independent of architecture and implementation choices.

## Target users and outcomes

Summarize the people or organisations expected to benefit and the outcomes they need. Treat newly identified interacting roles as actor candidates for `create-actors`; do not establish stable `ACT-` identities in the Product Vision. Link interacting roles to their authoritative `ACT-` entries when already available, and link non-interacting interested parties to stakeholder-management evidence.

| Target user or stakeholder | Current problem or opportunity | Desired outcome | Evidence and status |
|---|---|---|---|

## Product principles

Record the principles that guide product trade-offs. State their practical implication so that they can guide later decisions, and identify whether each principle is a proposal or an approved decision.

| Principle | Practical implication or trade-off | Authority and status |
|---|---|---|

## Product capability areas

Describe the complete set of coarse product capabilities needed to understand the intended product surface. Capability areas group stakeholder-relevant abilities; they are not business domains, bounded contexts, software modules, backlog items, or detailed requirements.

For each area, state its intended contribution and representative capabilities precisely enough that intended feature families and candidate features are derivable at a coarse level and later terminology and requirements work can identify the concepts and questions to refine. Include scope-defining or distinguishing capabilities when they materially clarify intent, but do not attempt an exhaustive feature list. Preserve more detailed current-state behavior and stakeholder wording in linked source evidence.

| Capability area | Intended contribution or outcome | Representative capabilities | Evidence and status | Boundaries and open questions |
|---|---|---|---|---|

## Scope

The capability-area table describes the positive product scope at this level. Record only cross-cutting rules that qualify how those areas enter the product scope, without repeating capability descriptions, outcomes, principles, success measures, or detailed requirements. Link explicit exclusions to their authoritative `SE-` entries and limitations or provisional assumptions to their authoritative `CON-` entries.

### Boundary rules

- Cross-cutting inclusion, replacement, transition, or delivery-horizon rule that applies across capability areas.

### Outside the current scope

- Link to an explicit `SE-` entry. Do not infer an exclusion from silence.

## Proposed success measures

Define indicators that would show progress toward the desired outcomes. Include a baseline, direction, target, timeframe, and evidence or accountable authority when known. Keep unapproved targets visibly proposed; do not fabricate missing values.

| Outcome | Indicator | Baseline | Direction or target | Timeframe | Evidence, authority, and status |
|---|---|---|---|---|---|

## Assumptions and open questions

Record only unresolved matters material to the vision. Link assumptions or constraints to their authoritative `CON-` entries when sufficiently defined. Every assumption needs a validation condition; every open question needs an owner and the evidence or authority required to close it.

| Type | Statement | Owner | Validation or resolution condition | Review trigger or date |
|---|---|---|---|---|

## Product and delivery terminology

Define product names, software-component or product-capability labels, and terms needed to understand modernization, migration, acceptance, or delivery intent. Keep domain-expert vocabulary in the authoritative domain glossary and link to it instead of duplicating definitions. Omit this section when the Product Vision needs no local terminology.

## Sources and related artifacts

- Link relevant source evidence, including detailed capability statements and terminology-discovery evidence, plus actors, stakeholder information, constraints, scope exclusions, requirements, and consequential decisions directly to their authoritative locations.
