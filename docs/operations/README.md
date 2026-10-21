# Operations

- Status: draft
- Owner: Operations
- Last reviewed: 2026-10-20

Operations covers delivery and runtime concerns including reproducible builds, deployment, configuration, observability, resilience, backup, recovery, capacity, cost, access, and incident readiness.

- [Local Development](local-development.md): commands for starting and stopping the local browser, API, and Neo4j environment
- [Localhost Deployment Architecture](deployment-architecture/): Docker topology, UML diagram, configuration, health, persistence, failures, and deferred production concerns
- [CI/CD](ci-cd.md): local verification contract, the remote harness job, build boundary, and activation conditions for deferred remote CI and delivery

[DR-0011](../governance/decisions/0011-use-docker-for-localhost-deployment.md) selects Docker and localhost for the initial development/proof-of-concept deployment. A deployment server, remote hosting platform, production topology, and CI/CD product remain undecided. Operational requirements must influence those later choices.

Use [Create Deployment Architecture](../../.agents/skills/create-deployment-architecture/SKILL.md) for environment specifications, [Create CI/CD](../../.agents/skills/create-ci-cd/SKILL.md) for delivery policy, and [Operate CI/CD](../../.agents/skills/operate-ci-cd/SKILL.md) to execute the established authorized path. The [deployment](../governance/templates/deployment-architecture.md), [environment](../governance/templates/environment.md), and [CI/CD](../governance/templates/ci-cd.md) templates support those tasks without changing the accepted local technology and deployment decisions.
