# Lifecycle Agent Operating Model

- Status: accepted
- Owner: Management
- Last reviewed: 2026-09-21

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

## Using repository skills

This operating model is the durable, human-readable source for lifecycle accountability, boundaries, collaboration, and escalation. Repository [skills](../../../.agents/skills/README.md) operationalize bounded tasks; they provide repeatable task-specific procedures and scope limits, but do not replace accountable ownership, stakeholder authority, independent review, or the evidence required by this operating model.

Use the relevant charter first, then select the applicable skill and workflow. The [agent workflow task-to-artifact contracts](../workflows/agent-workflows/agent-workflows.md#task-to-artifact-contracts) are the authoritative mapping from a task to its inputs and outputs. The following links are entry points rather than an exhaustive role-to-skill assignment:

| Lifecycle responsibility | Typical skill entry points | Workflow entry points |
|---|---|---|
| Requirements | [product vision](../../../.agents/skills/create-product-vision/SKILL.md), [glossary](../../../.agents/skills/create-glossary/SKILL.md), [domains](../../../.agents/skills/create-domains/SKILL.md), [actors](../../../.agents/skills/create-actors/SKILL.md), [use cases](../../../.agents/skills/create-use-cases/SKILL.md), [business objects](../../../.agents/skills/create-business-objects/SKILL.md), [navigation](../../../.agents/skills/create-navigation-map/SKILL.md), [wireframes](../../../.agents/skills/create-wireframes/SKILL.md), and [design system](../../../.agents/skills/create-design-system/SKILL.md) | [Requirements workflow](../workflows/requirements-workflow.md) |
| Architecture | [software architecture](../../../.agents/skills/create-software-architecture/SKILL.md), [entities](../../../.agents/skills/create-entities/SKILL.md), [technology](../../../.agents/skills/create-technology/SKILL.md), and [security architecture](../../../.agents/skills/create-security-architecture/SKILL.md) | [Modular software architecture](../workflows/modular-software-architecture.md) and [deployment architecture](../workflows/deployment-architecture.md) |
| Implementation | [prototype specification](../../../.agents/skills/specify-prototype/SKILL.md) when a representative slice needs a charter; [commit readiness](../../../.agents/skills/commit-readiness/SKILL.md) before a commit or pull request | [Commit workflow](../workflows/commit-workflow.md) |
| Test | No dedicated repository skill currently; apply independent challenge proportionate to risk | [Definition of done](../workflows/definition-of-done.md) and [continuous specification alignment](../workflows/continuous-spec-alignment.md) |
| Operations | No dedicated repository skill currently; activate operational expertise when the charter's risks apply | [Deployment architecture](../workflows/deployment-architecture.md) and [definition of done](../workflows/definition-of-done.md) |
| Management | [commit readiness](../../../.agents/skills/commit-readiness/SKILL.md) for commit or pull-request preparation | [Artifact lifecycle](../workflows/artifact-lifecycle.md), [continuous specification alignment](../workflows/continuous-spec-alignment.md), and [definition of done](../workflows/definition-of-done.md) |

See [DR-0006](../decisions/0006-align-harness-with-lifecycle-terminology.md).
