# Decision Records

- Status: accepted
- Owner: Management
- Last reviewed: 2026-08-04

Use immutable, sequential files such as `0007-short-title.md`, copied from the [decision-record template](../templates/decision-record.md). Decision records cover consequential business, governance, architecture, technology, implementation, test, operational, and management choices.

All records use `DR-NNNN`. Accepted records are not rewritten to hide changed thinking; supersede them with a new record and reciprocal links. Numbers are never reused.

Decision records intentionally use the `Status/Date/Deciders/Supersedes` metadata from the [decision-record template](../templates/decision-record.md) instead of the general status/owner/last-reviewed triad: a DR is an immutable point-in-time record, not a living document, so "last reviewed" would be misleading.

## Index

| Record | Decision | Status | Date | Supersedes |
|---|---|---|---|---|
| [DR-0001](0001-diagrams-as-code-toolchain.md) | Adopt a notation-aware diagrams-as-code toolchain | accepted | 2026-07-21 | none |
| [DR-0002](0002-adopt-five-role-agent-operating-model.md) | Adopt a five-role agent operating model | deprecated | 2026-07-27 | none |
| [DR-0003](0003-organize-documentation-by-information-theme.md) | Organize documentation by information theme | deprecated | 2026-07-27 | none |
| [DR-0004](0004-defer-dedicated-ai-assistance-governance.md) | Defer dedicated AI-assistance governance | accepted | 2026-07-27 | DR-0003 (in part) |
| [DR-0005](0005-operationalize-product-definition-harness.md) | Operationalize the product-definition harness | accepted | 2026-07-27 | none |
| [DR-0006](0006-align-harness-with-lifecycle-terminology.md) | Align the harness with software engineering lifecycle terminology | accepted | 2026-07-29 | DR-0002, DR-0003, DR-0005 in part |
| [DR-0007](0007-govern-work-with-github-issues-and-project.md) | Govern work with GitHub Issues and a Project board | accepted | 2026-07-29 | none |
| [DR-0008](0008-adopt-epic-feature-story-backlog-hierarchy.md) | Adopt an epic-feature-story backlog hierarchy | accepted | 2026-08-19 | DR-0007 in part |
| [DR-0009](0009-preserve-authoritative-document-when-growing-topics.md) | Preserve the authoritative document when growing topics | accepted | 2026-08-01 | DR-0006 in part |
| [DR-0010](0010-adopt-python-centered-modular-technology-stack.md) | Adopt a Python-centred modular technology stack | accepted | 2026-08-04 | none |
| [DR-0011](0011-use-docker-for-localhost-deployment.md) | Use Docker for the initial localhost deployment | accepted | 2026-08-14 | none |
| [DR-0012](0012-use-validated-property-registry-and-direct-neo4j-properties.md) | Use a validated property registry and direct Neo4j properties | accepted | 2026-08-17 | none |
| [DR-0013](0013-shared-resource-crud-api-and-openapi-contract.md) | Shared resource CRUD API, aggregate boundaries, and generated TypeScript client | accepted | 2026-08-18 | none |
| [DR-0014](0014-deterministic-seed-data-and-compose-seeding.md) | Deterministic seed data representation, generation, and Compose seeding | accepted | 2026-08-18 | none |
| [DR-0015](0015-frontend-thin-slice-testing-i18n-and-catalog-listing.md) | Frontend thin-slice test stack, i18n demonstration, staff grid, and catalog listing | accepted | 2026-08-18 | none |
| [DR-0016](0016-poc-technology-confirmation-with-residual-risk.md) | Confirm the DR-0010 technology profile with explicit residual risk | accepted | 2026-08-18 | none |
| [DR-0017](0017-align-orgarole-and-touristicproductitem-type-families.md) | Align OrgaRole and TouristicProductItem type-identifier families | accepted | 2026-08-20 | none |
| [DR-0018](0018-reduce-image-metadata-to-url-only.md) | Reduce TERM-010 image metadata to `imageUrl` only | accepted | 2026-08-21 | DR-0014 (in part) |
| [DR-0019](0019-compute-resource-display-projections.md) | Compute resource display projections in the backend | accepted | 2026-08-21 | DR-0013 in part |
| [DR-0020](0020-align-stockitem-types-with-product-leaves.md) | Align StockItem types with represented product leaves | accepted | 2026-08-21 | DR-0017 in part |
