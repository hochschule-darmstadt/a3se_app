# ADR-0001: Adopt a notation-aware diagrams-as-code toolchain

- Status: accepted
- Date: 2026-07-21
- Deciders: project owner and architecture
- Supersedes: none

## Context

Agents and human collaborators need reproducible diagram generation without reducing BPMN, UML, C4, or DDD concepts to visually similar but semantically weaker generic graphs.

## Decision drivers

- standards fidelity and machine validation;
- text sources suitable for Git and agent editing;
- deterministic local and CI rendering;
- cross-platform collaborator setup;
- no dependency on public rendering services or disclosure of project content.

## Considered options

- Mermaid for every diagram: simple, but insufficiently faithful for authoritative BPMN, UML, and C4 models.
- PlantUML for every diagram: strong UML coverage, but not a native BPMN model and weaker than a shared C4 model.
- Notation-aware tools with a common wrapper: more tools, but preserves semantics and supports validation.

## Decision

Use PlantUML 1.2026.3 for UML and data-flow diagrams, Structurizr 2026.06.28 for C4, Mermaid CLI 11.16.0 for lightweight explanatory diagrams, and bpmnlint 11.12.1 plus bpmn-js 18.21.0 with Puppeteer 25.3.0 for native BPMN 2.0 sources. Keep Context Mapper CML 6.12.0 opt-in for strategic DDD because its current standalone dependency graph is older; isolate it in its IDE/Java environment rather than adding it to the default executable pipeline.

Tool versions live in `tools/diagrams/versions.json`; Node dependencies are exact and locked. Local rendering is mandatory for sensitive content. SVG is the standard derived format.

## Consequences

### Positive

- Agents edit reviewable sources and validation catches notation errors.
- C4 views can derive from one model.
- BPMN remains interoperable BPMN 2.0 XML.
- Collaborators install identical versions through repository scripts.

### Negative and risks

- Node.js 22, Java 17+, and Docker are prerequisites.
- Multiple DSLs require focused agent instructions.
- Context Mapper is not part of the default CI path until its dependency posture is reviewed.

## Validation and revisit triggers

Review when a tool is unsupported, a security issue affects a pinned version, rendering becomes non-deterministic, or Context Mapper publishes a suitably maintained standalone distribution.

## Links

- [Diagram tooling](../engineering/diagram-tooling.md)
- [Specification notations](../specification/notations.md)
