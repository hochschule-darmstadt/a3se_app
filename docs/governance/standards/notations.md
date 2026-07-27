# Specification Languages and Notations

- Status: proposed
- Owner: Engineering
- Last reviewed: 2026-07-21

Prefer established, text-based notations that can be reviewed and versioned.

| Concern | Preferred notation/reference | Use |
|---|---|---|
| Terminology | DDD ubiquitous language and bounded contexts | domain vocabulary and semantic boundaries |
| Actor goals | Cockburn-style use cases | structured interaction requirements |
| Backlog slices | Connextra-style user-story sentence plus acceptance examples | conversation and incremental planning; not a complete requirements model |
| Acceptance examples | Gherkin | executable or reviewable examples; not a substitute for domain rules |
| Business processes | BPMN 2.0 | cross-role workflows, events, gateways, and compensation |
| Software structure/interaction | UML 2.x | class, state, sequence, and component semantics when precision is needed |
| Data concepts and logical relationships | UML class diagrams; Information Engineering/Crow's Foot for relational views | meaning, cardinality, integrity, and ownership before physical schemas |
| Architecture communication | C4 model | system context, containers, components, and deployment views |
| Interfaces and events | OpenAPI, AsyncAPI, JSON Schema where applicable | machine-readable contracts after integration needs are understood |
| Quality | ISO/IEC 25010 plus quality-attribute scenarios | quality vocabulary and measurable requirements |
| Architecture documentation | arc42 concepts | architecture structure and concerns |
| Decisions | MADR-style ADRs | consequential choices and their trade-offs |
| Threat modeling | STRIDE with data-flow diagrams | systematic threat discovery |
| Personas/UX | ISO 9241-210 human-centred design process | research-backed artifacts; clearly mark proto-personas |
| UI concepts | annotated low-fidelity wireframes, followed by accessible executable prototypes | information hierarchy, actions, states, and interaction hypotheses |
| Software supply chain and findings exchange | CycloneDX or SPDX for SBOMs; SARIF for static-analysis findings | machine-readable inventory and findings, not proof of runtime behavior |
| Infrastructure | declarative platform-native IaC plus C4 deployment views | reproducible resources and deployment communication after platform selection |

Diagram source belongs beside its owning specification. Generated images are derived artifacts. The notation-aware renderer and validation policy is defined in [Diagram Tooling](../../engineering/tooling/diagram-tooling.md); renderer choice must not distort the standard semantics being expressed.

Not every artifact benefits from a diagram DSL. Personas, ethical reflection, AI evaluation results, and most quality scenarios are usually clearer as structured text or tables. Wireframes need visual review but have no single standards-equivalent notation; do not mislabel generic boxes and arrows as UML or BPMN.
