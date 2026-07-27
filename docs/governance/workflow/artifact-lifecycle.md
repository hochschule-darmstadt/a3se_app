# Artifact Authority and Lifecycle

- Status: accepted
- Owner: Product/Engineering/QA
- Last reviewed: 2026-07-27

This document defines which artifact answers which question, how evidence becomes accepted specification, and what constitutes a coherent product-definition slice.

## Statement types

- **Fact:** supported by identified stakeholder or source evidence.
- **Assumption:** treated as provisionally true and accompanied by a validation or expiry condition.
- **Proposal:** a candidate change awaiting accountable approval.
- **Decision:** an approved consequential choice recorded in its authoritative artifact or an ADR.

Discovery material does not become a requirement merely because it appears plausible or is repeated by an agent.

Record an unresolved matter in its owning artifact as an `Open question` with an accountable owner and the evidence or decision needed to close it. Do not assign a requirement ID until the question yields an actual candidate artifact.

## Authoritative artifacts

| Question | Authoritative artifact | Identifier |
|---|---|---|
| Who has an interest or interacts with the system? | Stakeholder and actor catalog | `STK-` |
| What user model is supported by evidence? | Persona catalog | `PER-` |
| What must the business be able to do? | Capability catalog | `CAP-` |
| What actor goal and observable interaction must be supported? | Use case | `UC-` |
| What invariant or business policy applies? | Business rule catalog | `BR-` |
| What behavior cannot be expressed adequately by a use case or rule? | Functional requirement catalog | `FR-` |
| What measurable quality outcome is required? | Quality requirement catalog | `QR-` |
| What limitation or provisional assumption applies? | Constraint and assumption catalog | `CON-` |
| What term has what meaning in a context? | Glossary | none |
| What behavior demonstrates acceptance? | Acceptance examples in or linked from the owning specification | owning specification ID |
| What work is a negotiable delivery slice? | User story or external delivery item | `US-` or external ID |
| What consequential engineering choice was made? | ADR | `ADR-` |
| How are evidence, specifications, delivery, and validation related? | Traceability catalog | referenced IDs |

User stories and delivery tasks organize work; they are not authoritative for product intent. Reprioritizing them does not change accepted requirements. Product intent changes only through maintenance of the owning specification artifacts.

## Lifecycle

1. **Source evidence:** retain provenance and relevant context without treating the source as accepted product intent.
2. **Discovery statement:** classify the statement as fact, assumption, proposal, or open question.
3. **Candidate artifact (`draft`):** place the statement in its authoritative artifact with evidence and links.
4. **Reviewed artifact (`proposed`):** Product confirms intent and terminology; QA challenges ambiguity and acceptance evidence; other roles review proportionately.
5. **Accepted specification (`accepted`):** the accountable owner approves it and unresolved material questions are either closed or explicitly owned.
6. **Delivery item:** link a negotiable implementation slice to accepted specifications without copying their authority.
7. **Validation evidence:** link tests, reviews, demonstrations, or operational evidence back to the accepted specification.
8. **Retirement (`deprecated`):** retain the identifier and history; never reuse it for a different meaning.

Status changes require evidence appropriate to their impact. An agent may propose a transition but may not silently approve a material business decision.

## Product-definition slice

A coherent product-definition slice normally contains:

- one capability or bounded capability fragment and its stakeholder outcome;
- the relevant actor goal or use-case fragment;
- applicable business rules and information concepts;
- relevant quality concerns, constraints, and assumptions;
- acceptance examples covering normal, alternative, error, and boundary behavior as applicable;
- source evidence, open questions, and explicit owners for unresolved material issues;
- traceability among the affected artifacts.

Work vertically through one reviewable slice before populating many catalogs horizontally. A slice may omit an artifact only when it is genuinely irrelevant, not merely undiscovered.

## Change propagation

When evidence, intent, or behavior changes:

1. update the authoritative artifact without changing its stable identifier;
2. identify affected rules, models, examples, delivery items, tests, diagrams, and decisions through links;
3. update affected artifacts in the same coherent change where practical;
4. record unresolved divergence with an owner and resolution condition;
5. rerun structural validation and proportionate specialist review.

See [Continuous Specification Alignment](continuous-spec-alignment.md) and the [Definition of Done](definition-of-done.md).
