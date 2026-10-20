# Release NNN Backlog

- Status: draft
- Owner: Management
- Last reviewed: YYYY-MM-DD

Use this template for the tracker-independent coarse plan of one governed release horizon and save it as `release-NNN-backlog.md` in `docs/management/`. Replace all instructional text and placeholders with current evidence. Preserve the zero-padded release number while the release horizon remains the same; never reuse a retired number.

Keep the Release Backlog concise. It organizes supported Epics and Features, coarse dependencies, sequencing, and planning questions without replacing authoritative product, domain, UX, architecture, security, test, or operational artifacts. Do not invent Stories, estimates, assignments, sprint commitments, dates, priorities, or tracker state.

## Release identity and horizon

| Planning concern | Definition and evidence |
|---|---|
| Release number | `NNN`; link the decision or numbering evidence for a distinct new horizon |
| Planning horizon | The bounded product, transition, operational, or other outcome horizon governed by this backlog |
| Included product boundary | Product areas, outcomes, actors, use cases, or enabler concerns considered for this horizon |
| Explicit exclusions and deferrals | Adjacent scope not governed here, with direct links to authoritative exclusions or later planning |
| Input status | Lifecycle state and material limitations of the product, solution, risk, and validation evidence used |
| Planning confirmation | Accountable authority, participating roles, date, and whether the structure is draft, proposed, accepted, or replanned |

The release number identifies this artifact and its planning horizon. It does not imply priority, a target date, acceptance, commitment, delivery, or product-scope approval.

## Purpose and authority

State that this document owns the negotiable Epic and Feature organization, stable planning identifiers, coarse dependencies, sequencing guidance, and recorded release or iteration outlook for the named horizon.

State the work-tracking boundary. External or repository-based trackers may mirror `EP-NNN` and `FT-NNN` identifiers, but they do not replace this plan or become authoritative for product intent, requirements, architecture, or acceptance. Link an accepted tracker decision when one applies without copying operational tracker metadata into backlog items.

## Planning principles

Record only project-specific principles and accepted planning conventions. Preserve these general boundaries:

- Epics express coherent product or operational outcomes normally containing multiple meaningful Features.
- Features express independently understandable, demonstrable, and evaluable capabilities with exactly one Epic parent.
- Domains, use cases, and use-case slices may suggest Epic, Feature, and Story boundaries, but the mappings are heuristics rather than mandatory identities.
- Enabler Epics or Features exist only for independently evaluable security, migration, operational, technical, assurance, or delivery outcomes; supporting activity alone remains supporting work.
- Backlog items link to authoritative evidence and do not redefine it.
- Stories are normally derived and selected during iteration planning rather than anticipated across the full release.

## Evidence and coverage summary

Use this section when it materially improves reviewability. Show how relevant outcomes and representative actor goals are covered, deferred, excluded, or remain unresolved without reproducing their specifications.

| Authoritative outcome or anchor | Evidence status | Backlog disposition | Epic or Feature | Gap, deferral, or rationale |
|---|---|---|---|---|
| Direct link to product outcome, use case, requirement, control, constraint, or validated need | accepted, proposed, draft, or unresolved | covered, deferred, excluded, or gap | `EP-NNN`, `FT-NNN`, or `Not assigned` | Concise explanation and owner where unresolved |

## Current Release Backlog

All entries remain candidates while this artifact is `draft`. Preserve stable identifiers through wording, sequencing, tracker, and lifecycle changes while their planning identity remains the same; retire rather than reuse them.

### EP-NNN — Outcome-oriented name

- **Classification:** Product Epic, Enabler Epic, or another accepted classification
- **Outcome:** Observable product or operational result and beneficiaries
- **Boundary and rationale:** Why the contained capabilities belong together, including explicit adjacent exclusions and justified cross-domain or cross-module scope
- **Primary anchors:** Direct links to the principal product, domain, behavioral, solution, control, constraint, risk, or evidence sources
- **Success evidence:** Concise Epic-level evidence without duplicating Feature acceptance

| Feature | Intended capability | Primary anchors | Boundary or validation note |
|---|---|---|---|
| `FT-NNN` — Outcome-oriented name | Independently evaluable product or operational capability | Direct authoritative links | Required split, combination, uncertainty, or `None` |

Repeat this section for every Epic. Every Feature must have exactly one Epic parent. Use the canonical [Epic](epic.md) and [Feature](feature.md) templates when separate work-item records are maintained; link them without duplicating their detailed content here.

## Coarse dependencies and sequencing guidance

Describe outcome-level prerequisites and ordering influences rather than task dependencies, implementation layers, or calendar commitments.

| Source item | Related item | Relationship and rationale | Evidence | Planning implication |
|---|---|---|---|---|
| `EP-NNN` or `FT-NNN` | `EP-NNN` or `FT-NNN` | Prerequisite, enabling relationship, coordination need, or preferred sequence | Direct link or planning decision | Coarse consequence without invented dates or assignments |

State explicitly when ordering is logical rather than chronological and identify work that may proceed independently.

## Release and iteration outlook

Include this section only for allocations or iteration mappings that have actually been decided. Link the governing Sprint Backlog, Stories, and defined Slice Manifests without duplicating their scope or implying completion of parent Features or Epics.

| Epic or Feature | Allocation or outlook | Stories and Slices | Decision status and evidence | Limitation |
|---|---|---|---|---|
| `EP-NNN` or `FT-NNN` | Release, iteration, deferred horizon, or unallocated | Direct `ST-NNN` and `SL-NNN` links when they exist | Proposed, confirmed, replanned, or completed with accountable source | What the allocation does not decide |

If no allocation has been decided, state that plainly rather than inventing one.

## Assumptions, risks, gaps, and handoffs

| Type | Statement | Affected items or horizon | Owner | Validation, treatment, or resolution condition |
|---|---|---|---|---|
| Assumption, planning risk, coverage gap, dependency, limitation, or cross-artifact handoff | Material uncertainty or required upstream clarification | Direct stable IDs or release boundary | Accountable role or owning workflow | Evidence, decision, review, or event needed |

Link material risks to Risk Management and material product, requirements, architecture, security, deployment, test, or operational gaps to their owning artifacts. Do not resolve them by silently changing the backlog.

## Open planning questions

| ID or reference | Question | Why it matters | Owner | Resolution evidence or decision |
|---|---|---|---|---|
| Stable local reference when useful | Unresolved planning question | Boundary, sequencing, coverage, allocation, or confidence effect | Accountable role | Required source, review, or decision |

## Validation status

Record:

- release-number uniqueness, monotonic allocation, filename, and horizon continuity;
- Epic and Feature identifier uniqueness, preservation, retirement, and parentage;
- traceability of every included item to sufficient authoritative evidence;
- coverage, deferrals, exclusions, gaps, enabler treatment, and cross-cutting obligations;
- dependency and sequencing review without unsupported dates, estimates, assignments, priorities, or implementation order;
- lifecycle status, input uncertainty, accountable confirmation, and tracker-independence checks;
- management navigation, cross-artifact links, repository validation, skipped checks, limitations, and residual risks.

## Sources and related artifacts

Link directly to Project Management, Product Vision, scope and exclusions, glossary, domains, actors, use cases, requirements, UX, Software Architecture, Logical Entity Model, Technology, Security and Privacy Architecture, prototype and review evidence, Test Strategy, Deployment Architecture, CI/CD, Risk Management, Stakeholder Management, relevant decisions, Sprint Backlogs, Slice Manifests, agent workflows, artifact lifecycle, and Definition of Done used for this release horizon.
