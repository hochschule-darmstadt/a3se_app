# Operations

- Status: draft
- Owner: Operations
- Last reviewed: 2026-08-17

Operations covers delivery and runtime concerns including reproducible builds, deployment, configuration, observability, resilience, backup, recovery, capacity, cost, access, and incident readiness.

- [Localhost Deployment Architecture](deployment-architecture/): Docker topology, UML diagram, configuration, health, persistence, failures, and deferred production concerns

[DR-0011](../governance/decisions/0011-use-docker-for-localhost-deployment.md) selects Docker and localhost for the initial development/proof-of-concept deployment. A deployment server, remote hosting platform, production topology, and CI/CD product remain undecided. Operational requirements must influence those later choices.
