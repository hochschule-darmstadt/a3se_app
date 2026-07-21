# Specification Languages and Notations

- Status: proposed
- Owner: Architecture
- Last reviewed: 2026-07-21

Prefer established, text-based notations that can be reviewed and versioned.

| Concern | Preferred notation/reference | Use |
|---|---|---|
| Terminology | DDD ubiquitous language and bounded contexts | domain vocabulary and semantic boundaries |
| Actor goals | Cockburn-style use cases | structured interaction requirements |
| Acceptance examples | Gherkin | executable or reviewable examples; not a substitute for domain rules |
| Business processes | BPMN 2.0 | cross-role workflows, events, gateways, and compensation |
| Software structure/interaction | UML 2.x | class, state, sequence, and component semantics when precision is needed |
| Architecture communication | C4 model | system context, containers, components, and deployment views |
| Quality | ISO/IEC 25010 plus quality-attribute scenarios | quality vocabulary and measurable requirements |
| Architecture documentation | arc42 concepts | architecture structure and concerns |
| Decisions | MADR-style ADRs | consequential choices and their trade-offs |
| Threat modeling | STRIDE with data-flow diagrams | systematic threat discovery |
| Personas/UX | ISO 9241-210 human-centred design process | research-backed artifacts; clearly mark proto-personas |

Diagram source belongs beside its owning specification. Generated images are derived artifacts. The notation-aware renderer and validation policy is defined in [Diagram Tooling](../engineering/diagram-tooling.md); renderer choice must not distort the standard semantics being expressed.
