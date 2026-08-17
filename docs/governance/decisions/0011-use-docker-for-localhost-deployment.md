# DR-0011: Use Docker for the Initial Localhost Deployment

- Status: accepted
- Date: 2026-08-14
- Deciders: project owner and architecture/operations
- Supersedes: none

## Context

The accepted technology profile selects a client-rendered React application, a Python/FastAPI modular backend, and Neo4j Community Edition, but deliberately leaves runtime packaging and hosting open. The deployment-architecture task now needs a reproducible initial boundary without prematurely selecting a deployment server or production hosting platform.

## Decision

- Use Docker containers as the packaging and runtime-isolation mechanism for the initial deployment architecture.
- Limit the first deployment topology to a single developer workstation reached through localhost.
- Use a UML deployment diagram, maintained as PlantUML source with a generated SVG, to show nodes, execution environments, artifacts, communication paths, ports, volumes, and trust-boundary annotations.
- Keep the deployment server, remote hosting platform, production topology, scaling, availability, and disaster-recovery topology undecided until requirements and operational evidence justify them.
- Treat localhost as development and proof-of-concept deployment evidence, not as a production topology or production-readiness claim.

Docker containerization does not imply one container per logical module. The initial modular backend remains one modular-monolith runtime unless the deployment-architecture work records evidence for a different runtime mapping.

## Consequences

### Positive

- Contributors receive one reproducible local packaging and startup model.
- The deployment diagram can be validated with the existing PlantUML toolchain.
- Deferring the server avoids inventing hosting, network, availability, and recovery requirements.

### Negative and risks

- Localhost does not demonstrate remote network security, production secret handling, horizontal scaling, high availability, or disaster recovery.
- Docker introduces image, base-image, volume, network, and lifecycle decisions that must be maintained and security-reviewed.
- Host resource limits and operating-system differences can affect proof-of-concept evidence.

## Validation and revisit triggers

Issue #8 shall demonstrate that the selected application and database units start reproducibly with Docker on localhost, communicate only through documented paths, preserve data according to the declared local-volume policy, and expose health or readiness evidence. Select a deployment server and production topology only in a later decision when hosting, capacity, availability, security, backup, recovery, and operational-access requirements are known.

## Links

- [Deployment architecture](../../operations/deployment-architecture/deployment-architecture.md)
- [Technology profile](../../architecture/technology.md)
- [Deployment Architecture Workflow](../workflows/deployment-architecture.md)
- [Diagram tooling](../tooling/diagram-tooling.md)
