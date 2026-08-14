# Operations

- Status: draft
- Owner: Operations
- Last reviewed: 2026-08-14

Operations covers delivery and runtime concerns including reproducible builds, deployment, configuration, observability, resilience, backup, recovery, capacity, cost, access, and incident readiness.

- [deployment-architecture.md](deployment-architecture.md): deployment topology and operational boundaries

[DR-0011](../governance/decisions/0011-use-docker-for-localhost-deployment.md) selects Docker and localhost for the initial development/proof-of-concept deployment. A deployment server, remote hosting platform, production topology, and CI/CD product remain undecided. Operational requirements must influence those later choices.
