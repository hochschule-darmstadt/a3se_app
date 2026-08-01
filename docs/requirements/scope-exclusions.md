# Scope Exclusions

- Status: draft
- Owner: Requirements
- Last reviewed: 2026-08-01

This catalog records capabilities that stakeholders explicitly decide are outside the product scope. “Scope exclusions” is used instead of “requirement exclusions” because an excluded capability is not a requirement on the system.

Each exclusion has a stable `SE-` identifier, evidence or accountable authority, rationale, and a review condition. Exclusions are boundaries, not negative requirements: do not phrase them as system behavior with `SHALL NOT` unless prohibition itself is required behavior.

| ID | Excluded capability | Rationale | Source/authority | Affected scope | Review condition | Status |
|---|---|---|---|---|---|---|
| SE-001 | Internal implementation of the Accounting, Reporting, and Human Resources bounded contexts | These supporting processes remain external to the implementation scope; the project covers only the interfaces through which in-scope bounded contexts interact with them | Stakeholder scope direction, 2026-08-01 | [Supporting Processes bounded contexts](bounded-contexts/bounded-contexts.md) | Revisit only if the project's implementation scope is explicitly expanded | accepted |

Do not infer exclusions from silence. Record only explicit stakeholder decisions, and link affected vision, use cases, requirements, or plans rather than duplicating their content.
