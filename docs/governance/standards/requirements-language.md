# Requirements Language

- Status: proposed
- Owner: Requirements/Test
- Last reviewed: 2026-08-01

Use one atomic, necessary, unambiguous, feasible, and verifiable statement per requirement. State the responsible subject, the required outcome, the relevant condition, and a measurable acceptance criterion or link to acceptance evidence.

## Normative terms

The project adopts the requirement levels of [BCP 14](https://www.rfc-editor.org/info/bcp14/), comprising RFC 2119 and RFC 8174. Only uppercase terms carry normative meaning:

- `SHALL` and `SHALL NOT` express mandatory behavior or prohibition.
- `SHOULD` and `SHOULD NOT` express a recommendation from which deviation requires documented rationale and impact assessment.
- `MAY` expresses permitted, genuinely optional behavior.

Prefer `SHALL` for project requirements. Do not mix `MUST` and `SHALL` as stylistic variants. Use lowercase “will” only for facts or declared future events, never to impose a requirement. Avoid “can” for obligations because it describes capability rather than necessity.

## Placement and traceability

- Put actor goals, scenarios, alternatives, and guarantees in the owning `UC-` specification.
- Put behavior applying across at least two use cases in one `FR-` entry.
- Put measurable quality or compliance outcomes applying across at least two use cases in one `NFR-` entry.
- Put explicitly excluded capabilities in one `SE-` entry without presenting the exclusion as required system behavior.
- Reference stable identifiers across artifacts; do not copy normative statements.
- Preserve an identifier when wording changes, and retire it without reuse when its meaning is removed.

Proposals and open questions do not use requirement identifiers until evidence and intended normative meaning are sufficiently clear.
