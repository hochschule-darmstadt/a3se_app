# Artifact Authority and Lifecycle

- Status: accepted
- Owner: Requirements/Architecture/Test/Management
- Last reviewed: 2026-10-11

This document defines which artifact answers which question, how evidence becomes accepted specification, and what constitutes a coherent requirements slice.

## Statement types

- **Fact:** supported by identified stakeholder or source evidence.
- **Assumption:** provisionally treated as true with a validation or expiry condition.
- **Proposal:** a candidate change awaiting accountable approval.
- **Decision:** an approved consequential choice recorded in its authoritative artifact or a decision record.

Discovery material does not become a requirement merely because it appears plausible or is repeated by an agent. Record unresolved matters as `Open question` entries with an owner and the evidence or authority needed to close them. Do not assign a stable requirement ID to a placeholder.

## Authoritative artifacts

| Question | Authoritative artifact | Identifier |
|---|---|---|
| Who interacts with the system? | Actor catalog | `ACT-` |
| Who has an interest in the system without necessarily interacting with it? | Stakeholder management | none |
| What actor goal and observable interaction must be supported? | Use case | `UC-` |
| What stable business concept carries meaning, lifecycle, or responsibility in the problem space? | Business-object catalog | `BO-` |
| What behavior applies across multiple use cases? | Functional requirement catalog | `FR-` |
| What measurable cross-cutting quality or compliance outcome is required? | Non-functional requirement catalog | `NFR-` |
| What capability is explicitly outside the product scope? | Scope exclusion catalog | `SE-` |
| What limitation or provisional assumption applies? | Constraint and assumption catalog | `CON-` |
| What term has what meaning in a context? | Glossary | none |
| What behavior demonstrates acceptance? | Examples in or linked from the owning requirement | owning requirement ID |
| What coarse delivery outcome organizes several capabilities? | Release Backlog or mapped work item | `EP-` |
| What independently evaluable capability organizes vertical delivery slices? | Release Backlog or mapped work item | `FT-` |
| What negotiable iteration outcome is selected, sized, and prioritized? | Sprint Backlog or mapped Story work item | `ST-` |
| What bounded technical experiment tests an architecture or technology direction? | Prototype Charter, including its Prototype review record | `POC-HYP-` and `POC-SC-` local identifiers |
| What coherent vertical specification and implementation boundary realizes planned work? | Slice Manifest | `SL-` |
| Which reusable executable mechanisms are currently available for delivery work? | Technical Foundation record linked to executable manifests, scripts, and configuration | `TF-CHK-` local identifiers |
| In what verified sequence will one Prototype or Slice be realized and evidenced? | Scope-specific Implementation Plan | `IP-INC-` and `IP-DEC-` local identifiers |
| What evidence-led conclusion applies to an implemented Slice? | Slice review record inside the governing Slice Manifest | owning `SL-` and `SL-NNN-AC-` identifiers |
| What supporting work or observed defect is tracked? | Configured repository or external work-tracking system | tracker-specific reference |
| What consequential choice was made? | Decision record | `DR-` |

Plans and work-tracking items organize delivery; they are not authoritative for stakeholder intent. Reprioritizing, moving, or closing them does not change accepted requirements. `EP-NNN`, `FT-NNN`, and `ST-NNN` are durable tracker-independent planning identities; repository paths, issue numbers, URLs, project fields, and other tracker-native identifiers are mappings that may change without renumbering the planning item. `SL-NNN` is the durable identity of a Slice Manifest that composes one exact specification and implementation boundary without replacing its authoritative sources. Maintain one Implementation Plan per Prototype or Slice scope and revise it with visible history rather than creating competing plans. Keep Prototype and Slice review results inside their governing scope artifacts; keep raw execution evidence in linked evidence locations. Use the canonical [Release Backlog](../templates/release-backlog.md), [epic](../templates/epic.md), [feature](../templates/feature.md), [story](../templates/story.md), [Sprint Backlog](../templates/sprint-backlog.md), [Prototype Charter](../templates/prototype.md), [Slice Manifest](../templates/slice.md), [Technical Foundation](../templates/technical-foundation.md), [Implementation Plan](../templates/implementation-plan.md), [task](../templates/task.md), and [bug](../templates/bug.md) templates.

Use cases are authoritative for actor goals, observable interactions, scenarios, and guarantees. The functional and non-functional catalogs contain only requirements that apply across multiple use cases. A use case references applicable `FR-` and `NFR-` identifiers instead of repeating their statements; a catalog entry links back to its applicable use cases.

## Lifecycle

1. **Source evidence:** retain provenance and relevant context without treating the source as accepted intent.
2. **Discovery statement:** classify the statement as fact, assumption, proposal, or open question.
3. **Candidate artifact (`draft`):** place the statement in its authoritative artifact with evidence and links.
4. **Reviewed artifact (`proposed`):** Requirements confirms intent and terminology; Test challenges ambiguity and acceptance evidence; other roles review proportionately.
5. **Accepted specification (`accepted`):** the accountable authority approves it and material open questions are closed or explicitly owned.
6. **Architecture and decision:** translate accepted needs into structures and recorded choices without redefining intent.
7. **Delivery item and implementation:** link implementation slices to accepted specifications without copying their authority.
8. **Validation and operation:** link tests, reviews, demonstrations, and operational evidence to the accepted specification.
9. **Retirement (`deprecated`):** retain identifiers and history; never reuse them for a different meaning.

These activities iterate. They are not mandatory sequential project phases.

## Requirements slice

A coherent requirements slice normally contains stakeholder outcomes, actor goals, relevant policies and information concepts, quality concerns and constraints, acceptance examples, source evidence and open questions, and direct links among affected artifacts. Work vertically through one reviewable slice before populating many catalogs horizontally.

## Change propagation

When evidence, intent, architecture, behavior, or constraints change:

1. update the authoritative artifact without changing its stable identifier;
2. identify affected policies, models, examples, plans, tests, diagrams, decisions, implementation, and operational guidance;
3. update affected artifacts in the same coherent change where practical;
4. record unresolved divergence with an owner and resolution condition;
5. rerun structural validation and proportionate specialist review.

See [Continuous Specification Alignment](continuous-spec-alignment.md) and the [Definition of Done](definition-of-done.md).
