# Project Structure

- Status: accepted
- Owner: Architecture/Implementation
- Last reviewed: 2026-08-17

This view is the authoritative mapping from the logical
[software architecture](software-architecture.md) to repository directories and
import namespaces. It defines structural boundaries, not business behavior,
entity representation, API operations, seed data, or deployment topology.

## Frontend workspace

The root npm workspace contains two independently runnable React Router v7
Framework Mode single-page applications:

| Architecture ownership | Repository path | Responsibility |
|---|---|---|
| MOD-CI / Customer Interaction | `frontend/apps/customer` | Customer-facing routes and features |
| MOD-SI / Staff Interaction | `frontend/apps/staff` | Staff-facing routes and features |
| Shared HTTP access | `frontend/packages/api-client` | Transport-neutral API client contracts |
| Shared presentation | `frontend/packages/ui` | Mantine theme and application providers |

Each application starts route-oriented and grows feature-oriented as behavior
is implemented. Shared packages must not import either application. Customer
and staff use the same capability-oriented backend API; the API is not divided
by frontend application. Component and route tests are colocated with their
features, while cross-application integration and end-to-end tests belong in
`frontend/tests`.

## Backend packages

The installable Python import namespace is `cct` under `backend/src`; tests are
kept separately under `backend/tests`.

| Architecture ownership | Python package |
|---|---|
| HTTP adapter | `cct.api` |
| MOD-SP / Season Planning | `cct.core_processes.season_planning` |
| MOD-PROC / Procurement | `cct.core_processes.procurement` |
| MOD-TPD / Touristic Product Design | `cct.core_processes.touristic_product_design` |
| MOD-SALES / Sales | `cct.core_processes.sales` |
| MOD-CARE / Customer Care | `cct.core_processes.customer_care` |
| MOD-CM / Person Management | `cct.resource_management.person_management` |
| MOD-SM / Partner Management | `cct.resource_management.partner_management` |
| MOD-TPM / Touristic Product Management | `cct.resource_management.touristic_product_management` |
| MOD-INV / Inventory | `cct.resource_management.inventory` |
| MOD-OM / Order Management | `cct.resource_management.order_management` |
| Neo4j adapters | `cct.infrastructure.neo4j` |

Shared flexible-entity boundary types and the controlled registry live directly
under `cct.resource_management`; each owning module defines its terminology
contracts in its own `models.py`. This small shared kernel does not own module
writes or business invariants.

The descriptive names `core_processes` and `resource_management` make their
architectural role explicit. In particular, `resource_management` avoids the
common interpretation of a generic `resources` directory as static images,
templates, translations, or configuration.

Backend tests mirror the source boundaries under `backend/tests`, with
dedicated architecture, unit, integration, API-contract, and Neo4j integration
locations. Production packages never import test code.

## Cross-module graph access

The five Resource Management modules share the `cct.resource_management`
namespace without merging their ownership. Graph traversal is not assigned to
a generic `graph_queries` package. A query spanning modules is named and owned
by its consuming use case: the consumer defines the required interface, an
owning module exposes a provided interface, and `cct.infrastructure.neo4j`
implements persistence details. Runtime wiring remains deferred until an
executable backend requires it.

For example, Sales may need to confirm an offer containing product, stock, and
traveller references. `cct.core_processes.sales` owns a narrowly named
availability-read port describing only that use case. A Neo4j adapter may
traverse the relevant Touristic Product Management, Inventory, and Person
Management entities in one bounded query and return the declared projection.
Sales receives neither generic CRUD access nor a Neo4j session, and the adapter
cannot write through another module's internal repository.

## Dependency rules

- Resource Management modules do not depend on Core Process workflows, HTTP,
  or infrastructure adapters.
- Core Process workflows may use Resource Management interfaces but do not
  depend on FastAPI or Neo4j.
- API adapters invoke application capabilities and do not own business rules.
- Neo4j driver imports remain inside `cct.infrastructure.neo4j`.
- Dependencies within a layer must remain acyclic.
- A module must not import another module's internal repository or persistence
  implementation.

The architecture test suite parses Python imports to enforce these rules,
detect cycles, and require a `README.md` in every repository directory covered
by this structure.

## Structural tooling and licence evidence

The npm workspace reuses the repository's existing package manager and
lockfile. Versions were verified against the public npm registry on 2026-08-17.
All selected structural dependencies are available without licence fees,
satisfying NFR-003.

| Dependency | Version | Licence | Purpose |
|---|---:|---|---|
| React / React DOM | 19.2.8 | MIT | UI runtime |
| React Router packages | 7.18.2 | MIT | Framework Mode routing, runtime, and build integration |
| isbot | 5.2.1 | MIT | Runtime detection required by the React Router build pipeline |
| Mantine core / hooks | 8.3.18 | MIT | Shared UI foundation |
| Vite | 7.3.6 | MIT | Frontend build tool |
| TypeScript | 5.9.3 | Apache-2.0 | Static frontend checks |
| React type packages | 19.2.14 / 19.2.3 | MIT | React TypeScript declarations |
| setuptools | 77 or newer | MIT | Python package build backend |

The authoritative Python package metadata is `backend/pyproject.toml`; a
manually maintained `requirements.txt` is not part of the structure. A pinned
deployment dependency file may be generated later if the deployment design
requires one.

## Open structural decisions

- Concrete cross-module ports remain unnamed until a consuming use case
  establishes their semantic contract.
- Runtime composition and agent-tool adapters are absent and should be added
  only for a concrete executable or integration requirement.
- No formatter, linter, frontend test framework, or FastAPI adapter has yet
  been introduced. DR-0012 pins Pydantic and the Neo4j driver for the flexible
  entity prototype.
- React Router v8 migration flags remain outside the accepted v7 structure and
  require coordinated assessment before adoption.

Build, installation, and validation commands belong in the root,
`frontend`, and `backend` READMEs so this architecture view remains stable when
tool commands change.
