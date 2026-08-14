# Deployment Architecture Workflow

- Status: accepted
- Owner: Operations/Architecture
- Last reviewed: 2026-08-14

Use this workflow to map accepted logical architecture and technology decisions to runtime units and infrastructure nodes without changing module responsibilities.

## Inputs

- accepted modular software architecture and technology decisions;
- applicable quality, security, privacy, capacity, backup, recovery, cost, and operational-access requirements;
- [DR-0011](../decisions/0011-use-docker-for-localhost-deployment.md) for the initial Docker-on-localhost boundary.

## Procedure

1. State the deployment scope and explicitly separate selected facts, assumptions, proposals, and deferred choices.
2. Map logical modules to the minimum justified runtime units; do not infer one container per module.
3. Model the topology as a UML deployment diagram in PlantUML. Show nodes, execution environments, deployed artifacts, communication paths, relevant ports, persistent volumes, and trust-boundary annotations.
4. For the initial topology, model a single workstation, Docker, and localhost access. Do not name or imply a remote deployment server or production hosting platform.
5. Define reproducible container build, configuration, startup ordering, health/readiness, persistence, and local recovery expectations without embedding secrets.
6. Trace each runtime and operational choice to an accepted requirement or decision. Record unsupported production concerns as open questions rather than solving them speculatively.
7. Validate the PlantUML source, render its SVG, visually inspect it, and run the harness checks.

## Completion evidence

- The specification distinguishes logical modules, processes/containers, and the host node.
- Docker artifacts and communication paths match the UML deployment diagram.
- Localhost-only scope and its limitations are explicit.
- The deployment server and production topology remain deferred with revisit conditions.
- Security, privacy, secrets, persistence, observability, backup, recovery, portability, licensing, and failure behaviour are considered proportionately.
- Relevant decision records, architecture and operations routing pages, diagram sources/renders, and checks agree.
