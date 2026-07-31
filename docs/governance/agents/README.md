# Lifecycle Agent Operating Model

- Status: accepted
- Owner: Management
- Last reviewed: 2026-07-29

The harness uses six lifecycle responsibilities:

- [Requirements](requirements-agent.md)
- [Architecture](architecture-agent.md)
- [Implementation](implementation-agent.md)
- [Test](test-agent.md)
- [Operations](operations-agent.md)
- [Management](management-agent.md)

These are responsibilities, not necessarily permanent processes or separate agents. Management scopes work and activates only the responsibilities justified by a task. Roles may be combined when independence is not required; Test should remain independent when risk or acceptance confidence warrants it.

Lifecycle folders organize information, not exclusive ownership. Security, privacy, accessibility, reliability, and AI validation remain cross-cutting. Activate dedicated expertise when identity, payments, sensitive personal data, externally exposed interfaces, trust-boundary changes, consequential threats, uncertain legal obligations, or material accessibility risks exceed the standing roles' evidence.

## Collaboration

1. Management provides a bounded task, affected artifacts, and the same relevant evidence.
2. Specialists report independently before seeing proposed resolutions when bias matters.
3. Material findings state evidence, affected IDs, severity, confidence, proposed action, and accountable owner.
4. Conflicts are negotiated in the active session and escalated when stakeholder authority or new evidence is required.
5. Persist only consequential outcomes or unresolved work requiring durable ownership.
6. No agent silently turns an assumption, proposal, or generated output into an accepted requirement or decision.

Agents receive least-privilege tools and minimum necessary context. Model choice does not change the evidence or quality bar.

See [DR-0006](../decisions/0006-align-harness-with-lifecycle-terminology.md).
