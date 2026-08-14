# Specification Languages and Notations

- Status: proposed
- Owner: Architecture
- Last reviewed: 2026-08-14

Prefer established, text-based notations that can be reviewed and versioned.

| Concern | Preferred notation/reference | Use |
|---|---|---|
| Terminology | DDD ubiquitous language, domains, and subdomains | domain vocabulary and problem-space boundaries |
| Actor goals | Cockburn-style use cases | structured interaction requirements |
| Acceptance examples | Gherkin | executable or reviewable examples; not a substitute for domain rules |
| Business processes | BPMN 2.0 | cross-role workflows, events, gateways, and compensation |
| Software structure/interaction | UML 2.x | class, state, sequence, and component semantics when precision is needed |
| Data concepts and logical relationships | UML class diagrams; Information Engineering/Crow's Foot for relational views | meaning, cardinality, integrity, and ownership before physical schemas |
| Architecture communication | C4 model | system context, containers, components, and deployment views |
| Interfaces and events | OpenAPI, AsyncAPI, JSON Schema where applicable | machine-readable contracts after integration needs are understood |
| Quality | ISO/IEC 25010 plus quality-attribute scenarios | quality vocabulary and measurable requirements |
| Architecture documentation | arc42 concepts | architecture structure and concerns |
| Decisions | MADR-style decision records | consequential choices and their trade-offs |
| Threat modeling | STRIDE with data-flow diagrams | systematic threat discovery |
| User research/UX | ISO 9241-210 human-centred design process | research-backed actor needs, tasks, contexts of use, and interaction requirements |
| UI concepts | annotated low-fidelity wireframes, followed by accessible executable prototypes | information hierarchy, actions, states, and interaction hypotheses |
| View navigation | constrained UML 2.x state machines in PlantUML | navigable views as states and event-labelled permitted traversal; see [View Navigation Maps](view-navigation-maps.md) |
| Software supply chain and findings exchange | CycloneDX or SPDX for SBOMs; SARIF for static-analysis findings | machine-readable inventory and findings, not proof of runtime behavior |
| Infrastructure | declarative platform-native IaC plus C4 deployment views | reproducible resources and deployment communication after platform selection |

Diagram source belongs beside its owning specification. Generated images are derived artifacts. The notation-aware renderer and validation policy is defined in [Diagram Tooling](../tooling/diagram-tooling.md); renderer choice must not distort the standard semantics being expressed.

Not every artifact benefits from a diagram DSL. User-research findings, ethical reflection, AI evaluation results, and most quality scenarios are usually clearer as structured text or tables. Wireframes need visual review but have no single standards-equivalent notation; do not mislabel generic boxes and arrows as UML or BPMN.
