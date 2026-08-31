# Flexible Entity Implementation

- Status: accepted
- Owner: Architecture/Implementation
- Last reviewed: 2026-08-17

This view applies [DR-0012](../../governance/decisions/0012-use-validated-property-registry-and-direct-neo4j-properties.md)
to the [logical entity model](entity-model.md). The logical vocabulary remains
authoritative in [terminology.md](terminology.md); this document owns its Python
and Neo4j representation.

## Python contract

```text
untrusted mapping
  -> FlexibleEntity (reserved structure + explicit properties map)
  -> EntityTypeRegistry[(entityKind, type)]
  -> module-owned StrictProperties model
  -> immutable ValidatedEntity
```

`PropertyValue` comprises Boolean, integer, float, string, exact decimal,
calendar date, local time, date-time, and homogeneous tuples of those scalar
types. A terminology contract narrows this broad domain for every property.
Unknown types, unknown keys, coercive values, and reserved-name collisions are
errors. The registry is assembled by trusted application code and cannot load
untrusted runtime definitions.

| Responsibility | Owner |
|---|---|
| Generic structure and reserved names | `cct.resource_management.contracts` |
| Registry behavior | `cct.resource_management.registry` |
| Accepted catalog composition | `cct.resource_management.default_registry` |
| Type-specific property rules | Owning module's `models.py` |
| Persistence conversion | `cct.infrastructure.neo4j.entity_mapping` |

Serialization emits structural fields separately and property keys using their
terminology aliases. Models are frozen; updates rebuild and revalidate the
entire entity. `schemaVersion` starts at 1 and changes only with a reviewed
contract migration.

## Neo4j mapping

| Logical entity | Node label |
|---|---|
| Person | `Person` |
| PersonRole | `PersonRole` |
| Organisation | `Organisation` |
| OrgaRole | `OrgaRole` |
| TouristicProductItem | `TouristicProductItem` |
| StockItem | `StockItem` |
| OrderItem | `OrderItem` |

All nodes contain `entityId`, `entityKind`, `schemaVersion`, optional `type`,
and validated flexible properties flattened under their lower-camel-case
terminology names. `Decimal` is stored as a canonical string and identified by
`decimalPropertyKeys`; supported temporal values remain temporal. Missing and
optional null properties are absent. Nested maps and unsupported list shapes
are rejected.

| Relationship | Meaning |
|---|---|
| `HAS_ROLE` | Person to PersonRole, or Organisation to OrgaRole |
| `CONTAINS` | Recursive product, stock, or order composition |
| `SUPPLIED_BY` | Product to supplying OrgaRole |
| `REPRESENTS_PRODUCT` | StockItem to TouristicProductItem |
| `ALLOCATES_STOCK` | Order position to allocated StockItem |
| `CUSTOMER` | Order header to customer PersonRole |
| `ASSIGNED_TRAVELLER` | Order position to traveller PersonRole |

Community schema creates one `entityId` uniqueness constraint per label and
 indexes for accepted lookup paths such as product type and flight departure.
Application validation remains mandatory because Community
Edition cannot enforce property existence or types.

## Generated identifiers

[DR-0021](../../governance/decisions/0021-transaction-safe-prefixed-identifiers.md)
owns the staff-create ID policy. `Neo4jEntityRepository.create_generated` uses
an `EntityIdCounter` node and reserves the next value in the same managed write
transaction that creates the entity. Root counters are keyed by the explicit
prefix registry; order positions use a counter keyed by their order and are
created with the order `CONTAINS` edge. Counter values are not reset on normal
startup and are not decremented after deletion. Existing seeded IDs are loaded
through explicit save/restore, and an incompatible catalog requires a fresh
database seed rather than an in-place migration.

## Boundary validation

| Boundary | Required behavior |
|---|---|
| API | Validate transport shape; do not expose database labels or queries. See [API architecture](../api.md) and DR-0013 for the realized contract, aggregate boundaries, and error mapping. |
| Resource Management module | Select contract and enforce all terminology and cross-property rules |
| Repository | Accept only a validated entity or validate immediately before a managed transaction |
| Neo4j | Enforce available uniqueness constraints and indexes; never act as the semantic validator |
| Integrity check/migration | Read each node, reconstruct its contract, report or migrate invalid schema versions atomically |

The public registry and entity contracts are the authoritative input for issue
#12. Seed data must not recreate property rules.
