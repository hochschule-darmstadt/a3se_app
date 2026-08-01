# Technology Evaluation

- Status: draft
- Owner: Architecture
- Last reviewed: 2026-08-01

## Architecture drivers

- [FR-001–FR-004](../requirements/functional-requirements.md): British English, language extensibility, web interfaces, and responsive Customer Interaction.
- [NFR-001–NFR-002](../requirements/non-functional-requirements.md): accepted interactive and conversational response-time targets.
- [SE-001](../requirements/scope-exclusions.md): only interfaces to Accounting, Reporting, and Human Resources are in implementation scope.
- [Modular Software Architecture](software-architecture/software-architecture.md): candidate modules, interfaces, and acyclic dependencies derived from use cases.

Evaluate technologies against the modular software architecture after its review. A technology choice must not collapse module boundaries or force a deployment topology: modular-monolith, independently deployable-service, and hybrid options remain open until the later deployment-architecture task.

## Evaluation matrix

| Criterion (linked evidence) | Weight | Candidate A | Candidate B | Candidate C |
|---|---:|---:|---:|---:|

Scores without evidence are not decisions. Consider operability, security, accessibility, maintainability, ecosystem maturity, team skills, cost, reversibility, and fit to required integration patterns.

No stack, framework, database, platform, or provider is selected. A selected technology requires an accepted decision record. After selection, place technology-specific implementation guidance under [Implementation](../implementation/README.md) and link it back to that decision.
