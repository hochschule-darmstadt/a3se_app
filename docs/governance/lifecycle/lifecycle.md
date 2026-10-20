# Software Development Life Cycle (SDLC) Responsibility Model

- Status: accepted
- Owner: Management
- Last reviewed: 2026-09-22

This Software Development Life Cycle (SDLC) model defines the durable responsibilities, authority boundaries, and independent challenge perspectives needed across software development. It does not require six permanent agents, processes, teams, or sequential phases. One human or agent may exercise several responsibilities when independence is not material; separate specialists should be activated when risk, decision authority, or confidence requires them.

Skills define how to perform a bounded task. Workflows coordinate tasks and lifecycle transitions. Templates define artifact structure. This responsibility model instead defines which perspective must own or challenge a concern regardless of the skill, workflow, tool, or agent executing the work.

## Responsibilities and authority

| Responsibility | Accountable for | Decision authority | Must not | Independent challenge |
| --- | --- | --- | --- | --- |
| Requirements | Stakeholder intent, domain meaning, actors, use cases, business objects, rules, constraints, quality needs, UX expectations, assumptions, and requirements traceability. | May structure, clarify, and maintain evidenced requirements; material product choices require the accountable stakeholder or Product Owner. | Select solution architecture or implementation technology, turn assumptions into requirements, or treat backlog and implementation state as product intent. | Challenges whether proposed scope, architecture, and delivery preserve evidenced actor outcomes and domain meaning. |
| Architecture | Software structure, logical entities, module and contract boundaries, consistency, technology selection, security architecture, deployment design, and consequential technical trade-offs. | May propose and maintain solution decisions supported by requirements, qualities, risks, and constraints; accepted consequential choices follow repository decision governance. | Redefine business intent, infer requirements from preferred technology, or introduce production implementation without authority. | Challenges structural coherence, technology fit, security and privacy boundaries, data authority, deployability, and long-term consequences. |
| Implementation | Executable realization through code, physical schemas, migrations, configuration, dependencies, interfaces, packaging, and implementation-level evidence. | May choose ordinary reversible implementation details within accepted requirements, architecture, technology, and security boundaries. | Change owning specifications to make code pass, introduce material architecture or product decisions silently, or claim evaluation or approval. | Challenges whether specifications are implementable and reports contradictions, deviations, skipped checks, and residual risks to their owners. |
| Test | Independent verification design, testability, scenarios, evidence sufficiency, defects, quality assessment, and cross-artifact consistency. | May determine proportionate verification methods and report evidence-based findings; intended behavior remains owned by requirements and accountable authorities. | Redefine expected behavior, weaken acceptance to fit implementation, or infer approval from passing checks. | Independently challenges ambiguity, edge cases, state transitions, abuse cases, failure and recovery behavior, accessibility, and unsupported claims. |
| Operations | Deployability, runtime configuration, observability, resilience, recovery, capacity, infrastructure security, secrets, operational access, incident readiness, and supportability. | May establish operational practices within accepted architecture, technology, security, and service objectives; material platform choices require supported decisions. | Select infrastructure or platforms without drivers, treat local development topology as production design, or accept unowned operational risk. | Challenges architecture and implementation against real deployment, recovery, security, maintenance, and support conditions. |
| Management | Work scope, planning, dependencies, stakeholder engagement, risks, decisions, evidence flow, lifecycle coordination, and explicit ownership of unresolved work. | May organize and coordinate work and maintain management artifacts; approval of material product or technical choices remains with the accountable stakeholder or specialist authority. | Approve business intent or technical direction merely by coordinating it, or make plans authoritative for requirements and architecture. | Challenges whether work is bounded, authorities are clear, impacts are reconciled, and completion evidence is sufficient and honestly reported. |

## Cross-cutting responsibilities

Security, privacy, accessibility, reliability, safety, compliance, data integrity, and AI-output validation remain cross-cutting. They are not delegated away merely because one artifact or skill has a related name.

Activate dedicated expertise when the work involves material identity or authorization decisions, payments, sensitive personal data, externally exposed interfaces, trust-boundary changes, consequential threats, uncertain legal or regulatory obligations, safety exposure, material accessibility risk, or another concern beyond the standing responsibilities' demonstrated competence.

## Combining and separating responsibilities

- Combine responsibilities when the task is bounded, evidence is shared, and independence would not materially improve confidence.
- Separate Requirements from approval authority when stakeholder intent or product trade-offs remain unresolved.
- Keep Test independent from Implementation when acceptance confidence, safety, security, compliance, migration integrity, or material risk warrants an unbiased challenge.
- Use independent Architecture, Security, Operations, or specialist review when a consequential choice exceeds the implementing agent's authority or competence.
- Specialists are advisory unless explicitly delegated decision authority. Their findings state evidence, affected identifiers, severity or impact where useful, confidence, proposed action, and accountable owner.

## Collaboration rules

1. Management or the active workflow establishes a bounded task, affected artifacts, required responsibilities, and shared evidence.
2. Each responsibility works from the same authoritative facts while preserving its own authority boundary.
3. Specialists report independently before seeing proposed resolutions when anchoring or confirmation bias would reduce confidence.
4. Material conflicts are resolved through evidence and the accountable authority, not by silently merging incompatible conclusions.
5. Persist consequential decisions, accepted changes, residual risks, and unresolved work in the appropriate authoritative artifact or work-tracking system.
6. No responsibility silently converts an assumption, proposal, generated output, test result, implementation choice, or plan into an accepted requirement or decision.

Agents receive least-privilege tools and the minimum context needed for the assigned responsibility. Model choice, automation, or the number of agents does not change the evidence, authority, or quality bar.

## Related governance

- [DR-0006: Align the harness with software engineering lifecycle terminology](../decisions/0006-align-harness-with-lifecycle-terminology.md)
- [Artifact lifecycle](../workflows/artifact-lifecycle.md)
- [Definition of done](../workflows/definition-of-done.md)
- [Agent workflows](../workflows/agent-workflows/README.md)
- [Repository skills](../../../.agents/skills/README.md)
