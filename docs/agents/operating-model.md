# Multi-Agent Operating Model

- Status: proposed
- Owner: Engineering
- Last reviewed: 2026-07-22

Specialists may be implemented with different models or execution environments according to data sensitivity, task complexity, cost, latency, and required tool access. Model selection must not change the evidence or quality bar.

## Roles

- Orchestrator: scopes work, assigns bounded tasks, manages dependencies, and integrates results.
- Product/domain: protects stakeholder outcomes, rules, language, and traceability.
- QA: challenges testability, edge cases, consistency, and acceptance evidence.
- Security/privacy: analyzes threats, data handling, abuse, and compliance questions.
- UX/accessibility: validates research evidence, journeys, usability, and accessibility.
- Architecture: evaluates trade-offs against accepted drivers and records decisions.

## Independence and negotiation

1. The orchestrator gives each specialist the same task statement and relevant evidence.
2. Specialists report independently before seeing proposed resolutions when bias matters.
3. Each finding states evidence, affected IDs, severity, confidence, and a proposed action.
4. Specialists and the orchestrator negotiate temporary conflicts in the active session context.
5. The accountable owner accepts, rejects with rationale, requests evidence, or escalates.
6. Persist only consequential outcomes or unresolved work that must survive the session, using the appropriate authoritative project artifact or external task system.
7. Accepted outcomes are recorded directly in their authoritative requirement, rule, model, ADR, risk, test, or other project artifact—not in a generic coordination record.

Session context is the default coordination medium. It may contain tentative findings and intermediate work, but it is not durable project documentation. Before a session ends, the orchestrator decides whether consequential unresolved work needs an explicit owner and durable record.

## Guardrails

Agents receive least-privilege tools and minimum necessary context. Sensitive data remains in approved environments. Outputs from weaker, cheaper, or local models require the same validation as other contributions; criticality determines review depth.
