# Localhost Deployment Architecture

- Status: proposed
- Owner: Operations/Architecture
- Last reviewed: 2026-08-17

## Scope and authority

[DR-0011](../../governance/decisions/0011-use-docker-for-localhost-deployment.md) selects Docker on one developer workstation as the initial development and proof-of-concept boundary. This specification maps the accepted [modular software architecture](../../architecture/software-architecture/software-architecture.md) and [technology profile](../../architecture/technology.md) to that boundary. It does not select a server, cloud, hosting provider, remote environment, CI/CD product, or production topology.

Docker, localhost, React/Vite/Mantine, one Python/FastAPI modular monolith, and Neo4j Community Edition are selected facts. Port numbers, volume names, configuration names, and health endpoints below are proposals for implementation. Production capacity, availability, backup, recovery, observability, network security, and operational access are deferred.

![Localhost deployment architecture](deployment-architecture.svg)

[PlantUML source](deployment-architecture.puml)

## DEP-001 Runtime topology

One workstation contains the browser and Docker execution environment. Docker contains the minimum three runtime units:

| Runtime | Artifact and logical mapping | Interfaces | Persistence |
|---|---|---|---|
| web | immutable static assets built from the shared React client platform; Customer and Staff Interaction presentation code | loopback 127.0.0.1:8080 to container HTTP 8080; browser calls the API | none |
| api | one Python/FastAPI process containing every accepted logical module as a modular monolith | loopback 127.0.0.1:8000 to HTTP 8000; internal Bolt to neo4j:7687 | no host filesystem writes; document storage remains undecided |
| neo4j | Neo4j Community Edition database; physical consolidation does not change module-owned writes | internal Docker network only at 7687 and 7474; no host publication by default | named volume neo4j-data |

Logical modules remain packages and in-process dependencies inside api; they are not containers. One private project network connects the units. Only web and api publish loopback-bound ports. Docker service names are internal discovery names.

## DEP-002 Images and builds

- Application images use pinned, NFR-003-reviewed base versions and non-root runtime users. Floating latest tags are prohibited.
- Web uses a multi-stage build: the selected Node version produces Vite assets and a small static runtime serves only the output.
- Api installs locked Python dependencies and starts one FastAPI process without development auto-reload.
- Neo4j uses a pinned Community Edition image consistent with DR-0010.
- Build contexts exclude VCS data, environments, caches, reports, secrets, and personal data.
- Digests, SBOMs, vulnerability policy, and provenance remain implementation/security work.

No Dockerfile or Compose file is added by this requirements change because there is no application source or accepted workspace/package profile to build. Fake health-only containers would not demonstrate React or FastAPI. DEP-Q-001 gates those artifacts.

## DEP-003 Configuration and secrets

Configuration enters through explicitly named environment variables or mounted local files excluded from version control. A committed example may contain names and safe synthetic defaults, never credentials.

| Name | Consumer | Proposed purpose |
|---|---|---|
| APP_API_BASE_URL | web build | browser API origin; default http://127.0.0.1:8000 |
| APP_ENV / APP_LOG_LEVEL | api | local / INFO; sensitive payload logging remains prohibited |
| NEO4J_URI | api | bolt://neo4j:7687 |
| NEO4J_USERNAME | api | local non-secret account name |
| NEO4J_PASSWORD | api and neo4j | required local secret supplied outside Git |

The browser never receives database credentials. Product agents receive controlled application tools, not database configuration. External AI or supplier connectivity requires a selected provider, data-flow/privacy review, allow-list, timeout, and failure policy before outbound access is enabled.

## DEP-004 Startup, health, and readiness

Compose shall create the network and volume, start Neo4j, wait for authenticated readiness, start api, then make web available. Ordering alone is insufficient; dependants use health conditions and bounded retry.

| Probe | Success means | Does not mean |
|---|---|---|
| Neo4j health | Bolt accepts an authenticated trivial query | schema or business data are ready |
| GET /health/live | API event loop responds | dependencies are usable |
| GET /health/ready | configuration and initialization are valid and Neo4j answers a bounded query | optional integrations are healthy |
| web GET /health | static server responds | API or journeys are ready |

Readiness exposes stable dependency codes without credentials, connection strings, stack traces, or customer data. Probes have short timeouts and never mutate business state.

## DEP-005 Persistence, reset, and recovery

The neo4j-data volume survives container recreation and normal shutdown. A destructive reset removes only the resolved project volume after operator confirmation; it never targets an unresolved variable, broad host path, or unrelated volume.

Local recovery evidence shall create synthetic data through an owned operation, recreate containers, verify persistence, create a version-supported dump while stopped if required, reset, restore, and re-verify. Exact commands await the pinned image. This proves local mechanics only, not production recovery objectives. Generated documents remain excluded until the storage-port decision.

## DEP-006 Operations and failures

The later runbook shall validate configuration and occupied ports; build; start and wait for health; inspect bounded logs; exercise readiness; stop without deleting data; restart and verify persistence; and perform an explicit scoped reset/recovery.

| Failure | Required observation and recovery |
|---|---|
| missing configuration | fail before traffic; name the setting, not its value |
| port conflict | identify the occupied loopback port; use an approved override or stop the conflict |
| Neo4j unavailable | API liveness remains, readiness fails, affected operations report recoverable unavailability |
| API unavailable | client shows recoverable unavailability; no pending action appears completed |
| restart loop | bounded on-failure retry; repeated failure remains visible |
| corrupt/incompatible volume | readiness fails; no automatic reset; operator follows version-specific recovery |
| external dependency failure | only affected capability degrades; timeout and uncertainty remain explicit |

An on-failure policy with bounded retries is proposed. Automatic migration, rollback, and volume deletion are prohibited until specified.

## DEP-007 Trust boundaries and limitations

The diagram identifies browser-to-loopback, Docker network, FastAPI application, and persistence boundaries. Loopback reduces accidental LAN exposure but is not authentication, encryption, firewalling, or hostile-host isolation. A developer with host or Docker-daemon access can inspect containers, environment, traffic, and volumes.

Production customer data, credentials, and backups are prohibited. Synthetic examples are required. Containers do not replace module authorization, controlled agent tools, database least privilege, input validation, audit, or dependency maintenance.

Localhost cannot prove remote TLS, segmentation, secret distribution, multi-user access, production monitoring, capacity, availability, online backup, recovery objectives, upgrades, scaling, or disaster recovery.

## Acceptance evidence

| Evidence | Result on 2026-08-17 |
|---|---|
| DR-0010/0011 and module mapping reviewed | pass |
| PlantUML syntax and SVG render | pass |
| Visual SVG review | pass: nodes, paths, ports, volume, and boundary notes are legible |
| harness, links, and architecture checks | pass |
| Docker build and Compose configuration | blocked: React/FastAPI source and accepted packaging are absent |
| startup, health, persistence, restart, reset, and recovery | blocked by the same prerequisite |
| Security/Privacy analysis | proposed above; independent review pending |

AI drafted the mapping. Critical review rejected one-container-per-module, public database ports, invented production hosts, bind-mounted source as the reproducible topology, embedded secrets, fake application containers, and production-readiness claims.

## Open questions

| ID | Question | Owner and resolution |
|---|---|---|
| DEP-Q-001 | When do React/FastAPI source and packaging authorize Dockerfiles and Compose? | Implementation/Architecture; source and packaging decisions present |
| DEP-Q-002 | Which pinned images satisfy NFR-003 and supply-chain policy? | Implementation/Security; licence and image review |
| DEP-Q-003 | What production capacity, availability, recovery, observability, network, and access objectives apply? | Requirements/Operations/Security |
| DEP-Q-004 | Which server or hosting platform, if any, follows localhost validation? | Architecture/Operations/Management; later decision |
| DEP-Q-005 | What generated-document storage and local persistence policy apply? | Requirements/Architecture; storage decision |
