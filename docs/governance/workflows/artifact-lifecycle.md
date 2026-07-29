# Artifact Authority and Lifecycle

- Status: accepted
- Owner: Requirements/Architecture/Test/Management
- Last reviewed: 2026-07-29

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
| Who has an interest or interacts with the system? | Actor catalog | `STK-` |
| What must the business be able to do? | Capability catalog | `CAP-` |
| What actor goal and observable interaction must be supported? | Use case | `UC-` |
| What invariant or business policy applies? | Business rule catalog | `BR-` |
| What behavior cannot be expressed adequately by a use case or rule? | Functional requirement catalog | `FR-` |
| What measurable quality outcome is required? | Quality requirement catalog | `QR-` |
| What limitation or provisional assumption applies? | Constraint and assumption catalog | `CON-` |
| What term has what meaning in a context? | Glossary | none |
| What behavior demonstrates acceptance? | Examples in or linked from the owning requirement | owning requirement ID |
| What work is a negotiable delivery slice or defect? | GitHub Issue | GitHub issue number |
| What consequential choice was made? | Decision record | `DR-` |
| How are evidence, specifications, delivery, and validation related? | Traceability catalog | referenced IDs |

Plans and GitHub Issues organize work; they are not authoritative for stakeholder intent. Reprioritizing or closing them does not change accepted requirements. Use the canonical [feature](../templates/feature.md) and [bug](../templates/bug.md) templates.

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

A coherent requirements slice normally contains stakeholder outcome and capability, actor goals, rules and information concepts, quality concerns and constraints, acceptance examples, source evidence and open questions, and traceability among affected artifacts. Work vertically through one reviewable slice before populating many catalogs horizontally.

## Change propagation

When evidence, intent, architecture, behavior, or constraints change:

1. update the authoritative artifact without changing its stable identifier;
2. identify affected rules, models, examples, plans, tests, diagrams, decisions, implementation, and operational guidance;
3. update affected artifacts in the same coherent change where practical;
4. record unresolved divergence with an owner and resolution condition;
5. rerun structural validation and proportionate specialist review.

See [Continuous Specification Alignment](continuous-spec-alignment.md) and the [Definition of Done](definition-of-done.md).
