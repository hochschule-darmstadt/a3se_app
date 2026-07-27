# Multi-Agent Operating Model

- Status: accepted
- Owner: Engineering
- Last reviewed: 2026-07-27

Specialists may be implemented with different models or execution environments according to data sensitivity, task complexity, cost, latency, and required tool access. Model selection must not change the evidence or quality bar.

## Roles

- Orchestrator: scopes work, assigns bounded tasks, manages dependencies, and integrates results.
- Product: protects stakeholder outcomes, scope, rules, language, traceability, user experience, accessibility, and product-side privacy expectations.
- Engineering: evaluates architecture trade-offs, records decisions, implements accepted behavior, maintains technology guidance, and validates implementation quality.
- QA: challenges testability, edge cases, consistency, and acceptance evidence.
- Operations: protects deployability, observability, resilience, recovery, capacity, and operational security.

These are responsibilities, not necessarily permanent processes or separate agents. The orchestrator activates only the roles justified by the task and may combine them when independence is not required. Role-specific technology and platform guidance remains deferred until accepted decisions establish it.

## Cross-cutting security and privacy

Security and privacy remain explicit cross-cutting responsibilities:

- Product owns user privacy expectations, data minimization, and appropriate user control.
- Engineering owns threat modeling, secure architecture, secure implementation, and dependency hygiene.
- Operations owns infrastructure security, secrets handling, operational access, recovery, and incident readiness.
- QA independently challenges abuse cases, control behavior, and security acceptance evidence.

The orchestrator activates a dedicated security/privacy specialist when work involves identity, payments, sensitive personal data, externally exposed interfaces, trust-boundary changes, consequential threats, or uncertain legal obligations.

## Independence and negotiation

1. The orchestrator gives each specialist the same task statement and relevant evidence.
2. Specialists report independently before seeing proposed resolutions when bias matters.
3. Each finding states evidence, affected IDs, severity, confidence, and a proposed action.
4. Specialists and the orchestrator negotiate temporary conflicts in the active session context.
5. The accountable owner accepts, rejects with rationale, requests evidence, or escalates.
6. Persist only consequential outcomes or unresolved work that must survive the session, using the appropriate authoritative project artifact or external task system.
7. Accepted outcomes are recorded directly in their authoritative requirement, rule, model, ADR, risk, test, or other project artifact.

Session context is the default coordination medium. It may contain tentative findings and intermediate work, but it is not durable project documentation. Before a session ends, the orchestrator decides whether consequential unresolved work needs an explicit owner and durable record.

## Guardrails

Agents receive least-privilege tools and minimum necessary context. Sensitive data remains in approved environments. Outputs from weaker, cheaper, or local models require the same validation as other contributions; criticality determines review depth.

## Decision record

See [ADR-0002](../decisions/0002-adopt-five-role-agent-operating-model.md).
