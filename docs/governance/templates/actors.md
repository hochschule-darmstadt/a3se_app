# Actors

- Status: draft
- Owner: Requirements
- Last reviewed: YYYY-MM-DD

Use this template for the authoritative catalog of stable human roles, external parties, systems, and devices that directly interact with the system under consideration. Replace all instructional text and placeholders with evidence-supported content. Product Vision target users and stakeholder evidence may supply actor candidates, but only this artifact establishes stable actor identities.

Use `ACT-NNN` identifiers for actors admitted to the authoritative catalog. Preserve an identifier when a rename or clarification retains the same business interaction role. For splits and merges, preserve an existing ID only where semantic continuity is clear; otherwise assign new IDs and retire the predecessors. Record successor relationships and never reuse a retired ID.

An actor is not a named person, persona, stakeholder category, organization unit, account, authentication identity, authorization role, permission bundle, internal component, business object, or database record. A profession or job title qualifies only when it represents a distinct interaction responsibility. Primary and supporting are relationships between an actor and a particular use case; they are not permanent actor classifications.

## Purpose and model boundary

State the system boundary, business or operational scope, and purpose of this actor catalog. Identify whether the artifact is an initial draft, a refinement or correction, or an alignment assessment. Record the accountable authority, lifecycle status, known limitations, and next validation needs.

Explain which target users, adjacent parties, systems, and devices were considered. Link non-interacting stakeholders to stakeholder management and personas or research segments to UX evidence rather than including them as actors.

## How to read this catalog

Explain the actor types used and clarify that:

- participation in a subdomain does not imply ownership of that subdomain or its information;
- one person or organization may adopt several actors;
- one actor may participate in several subdomains and use cases;
- primary and supporting actor assignments belong to individual use cases;
- external systems and devices are included only when they directly interact across the system boundary.

## Actor catalog

Keep stable IDs as raw text in the first column so repository validation can recognize their definitions. Use singular, domain-recognizable actor names.

| ID | Actor | Type | Defining role and coarse responsibility | Interaction boundary | Participating subdomains | Evidence and status |
|---|---|---|---|---|---|---|
| ACT-NNN | Singular actor name | Human role, external party, external system, or device | What makes this interaction role distinct | What the actor directly requests, provides, or receives at the system boundary | `SD-NNN`, as applicable | Direct evidence, accountable authority, and draft/proposed/accepted status |

## Actor details

Repeat the following subsection for every active actor when the catalog row alone is insufficient to preserve material distinctions. Order actors by stable ID.

### `ACT-NNN`: Actor name

- **Type:** Human role, external party, external system, or device.
- **Definition and distinguishing responsibility:** What makes this actor a stable, distinct interaction role.
- **Coarse goals:** Concise links or summaries sufficient to explain the role; keep detailed actor goals and scenarios in use cases.
- **Interaction boundary:** What crosses the system boundary and why the participant is external.
- **Participating subdomains:** Links to relevant subdomains and the business reason for participation; do not imply actor or information ownership.
- **Representative use cases:** Links to use cases in which the actor is primary or supporting. Omit unsupported assignments when use-case discovery is incomplete.
- **Related roles and distinctions:** Overlapping roles, possible role combinations, specializations, and explicit non-equivalences.
- **Privacy, safety, compliance, or trust considerations:** Only actor-defining concerns; link cross-cutting requirements instead of duplicating them.
- **Evidence, authority, and status:** Direct sources, accountable experts, assumptions, and lifecycle state.

## Coverage and boundary validation

Account for Product Vision target users, beneficiaries, subdomains, and available use cases without manufacturing actors merely for complete-looking coverage.

| Candidate, target user, stakeholder, subdomain, or use case | Actor disposition | Boundary finding | Evidence or validation need |
|---|---|---|---|
| Referenced item | Cataloged `ACT-NNN`, excluded, deferred, or unresolved | Why it is or is not an actor and any overlap or gap | Link, owner, and resolution condition |

Include representative normal, alternative, error, correction, and external-boundary evidence proportionately. Record a missing or ambiguous participant as an open question rather than silently creating an actor.

## Actor-model evolution

Include this section when revising a previously recorded catalog. Summarize semantic changes rather than editorial updates.

| Change | Previous IDs | Current IDs | Reason and evidence | Decision or authority |
|---|---|---|---|---|
| Rename, clarify, split, merge, generalize, specialize, add, or retire | IDs or none | IDs or none | What changed in the understood interaction role | Link or accountable authority and status |

## Retired actors

Retain deprecated identifiers and never reuse them.

| ID | Former actor | Retirement reason | Successor actors | Status |
|---|---|---|---|---|

## Assumptions and open questions

Every assumption needs a validation condition. Every open question needs an owner and the evidence, authority, or event required to resolve it.

| Type | Statement | Affected IDs or candidates | Owner | Validation or resolution condition | Review trigger or date |
|---|---|---|---|---|---|

## Cross-artifact handoffs

List material findings that belong to another authoritative artifact and remain unresolved.

| Owning artifact or workflow | Required change or question | Affected IDs or candidates | Owner and resolution condition |
|---|---|---|---|

## Sources and related artifacts

Link directly to the Product Vision, domain glossary, business domains, use cases, business objects, stakeholder management, UX evidence, source evidence, scope exclusions, constraints, applicable decisions, and other artifacts needed to validate the actor boundary. Do not duplicate their authoritative content.
