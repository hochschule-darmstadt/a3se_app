# Lifecycle Agent Charters

- Status: accepted
- Owner: Management
- Last reviewed: 2026-10-20

The authoritative [SDLC responsibility model](../lifecycle/lifecycle.md) defines accountability, authority, independence, collaboration, and escalation. The retained charters below provide A3SE-specific entry points and must be read within those boundaries.

- [Requirements](requirements-agent.md)
- [Architecture](architecture-agent.md)
- [Implementation](implementation-agent.md)
- [Test](test-agent.md)
- [Operations](operations-agent.md)
- [Management](management-agent.md)

## Using repository skills

The [repository skill index](../../../.agents/skills/README.md) lists the adopted Oculus baseline and the local commit-readiness extension. The [Agent Workflows](../workflows/agent-workflows/agent-workflows.md) own task-to-artifact contracts and coordination. Skills define bounded procedures; they do not transfer stakeholder authority or replace independent challenge.

| Responsibility | Skill entry points |
|---|---|
| Requirements | Product framing, domain analysis, detailed use cases, navigation, wireframes, and design system skills. |
| Architecture | Software architecture, entities, technology, security architecture, and deployment architecture skills. |
| Implementation | Technical foundation, coding guidelines, implementation planning, code creation, and the optional integrated Prototype implementation. |
| Test | Test strategy, test creation, Prototype technical review, and Slice acceptance review. |
| Operations | Deployment architecture, CI/CD baseline, and operation of the accepted delivery path. |
| Management | Release and sprint backlogs, Slice coordination, and commit readiness. |

See [DR-0006](../decisions/0006-align-harness-with-lifecycle-terminology.md) and [DR-0029](../decisions/0029-adopt-oculus-lifecycle-skills-and-templates.md).
