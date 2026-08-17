# DR-0012: Use a validated property registry and direct Neo4j properties

- Status: accepted
- Owner: Architecture/Implementation
- Date: 2026-08-17
- Supersedes: none

## Context

The logical entity model intentionally varies properties by `type`. Issue #20
must preserve that flexibility without making arbitrary dictionaries, runtime
attributes, JSON blobs, or unrestricted graph access authoritative. The
[terminology catalog](../../architecture/entity-model/terminology.md) and issue
#10 scenarios provide the current contracts.

Pydantic 2.13.4 and Neo4j Python Driver 6.2.0 were evaluated on 2026-08-17
against Neo4j Community Edition 2026.06 documentation. Both are permissively
licensed and require no licence fee.

## Options considered

| Option | Result |
|---|---|
| Generic `dict[str, PropertyValue]` only | Rejected: preserves shape but cannot express type-specific required, forbidden, coded, and cross-property rules safely. |
| Runtime `setattr` or unrestricted extras | Rejected: hides the property boundary, permits structural-name collisions, weakens tooling, and makes serialization non-deterministic. |
| Only concrete Pydantic models/discriminated unions | Rejected as the public generic representation: the catalog is expected to grow across independently owned modules and one global union would centralize ownership. |
| Explicit properties map plus controlled typed registry | Accepted: preserves the generic boundary while giving application code immutable typed properties and module-owned validation. |
| Neo4j direct properties | Accepted for supported values: queryable and indexable without duplicating a document store. |
| JSON property blob | Rejected: obscures keys and types from Cypher, indexing, and integrity inspection. |
| Property/value nodes | Rejected for ordinary scalar values: creates excessive graph structure and indirect queries without current semantic benefit. |
| Hybrid persistence | Accepted only for deliberate lossless mappings, currently exact decimal strings with an explicit structural marker; semantic references and composition remain relationships. |

## Decision

Use an immutable `FlexibleEntity` boundary with explicit `entityId`,
`entityKind`, optional terminology-governed `type`, `schemaVersion`, and
`properties`. A deployment-time registry keyed by `(entityKind, type)` selects
a strict, immutable, extra-forbidding Pydantic property model owned by the
applicable Resource Management module. Unknown types and keys fail closed.
There is no untrusted runtime registration or dynamic class creation.

Persist structural fields and validated Neo4j-supported property values
directly on a node whose singular PascalCase label equals `entityKind`.
Relationships represent roles, supply, recursive containment, inventory,
allocation, customers, and travellers. Labels and relationship types come from
code allow-lists; all values are parameters.

Neo4j has no exact decimal property type. Money amounts therefore use a
canonical base-ten string under the authoritative property key and record that
mapping in the structural homogeneous string list `decimalPropertyKeys`.
Round-trip validation restores `Decimal`. Numeric price-range queries are
deferred; if required, a reviewed minor-unit representation replaces this PoC
mapping. Maps, nested lists, heterogeneous lists, null list elements, and
unknown objects fail rather than becoming JSON.

Community Edition uniqueness constraints protect `entityId`; selected direct
properties receive range indexes. Existence, property-type, node-key, and
relationship-key constraints are Enterprise-only, so application validation,
managed transactions, schema-versioned integrity scans, and integration tests
compensate. A uniqueness constraint alone does not require property existence
for every node and cannot replace application validation.

## Consequences

- Type-specific properties have normal Python attribute access after boundary
  validation while serialized names remain authoritative lower camel case.
- Strict Python inputs are not coerced (`500` is not flight number `"500"`).
  API JSON parsing may use a separately reviewed transport model, but module
  validation remains strict.
- Models are frozen. Changes create and fully revalidate a new entity; mutation
  cannot leave a partially validated instance.
- Missing differs from null. Optional `None` values are omitted from Neo4j
  because assigning `null` removes a property. Empty homogeneous lists are
  permitted only when a contract declares a list field.
- Python `date`, local `time`, and `datetime` map to Neo4j temporal values.
  Spatial values are allowed by the persistence value domain when a future
  terminology contract introduces an explicit type. Entity references and
  recursive values never appear as embedded identifiers or maps.
- A contract change increments `schemaVersion` and requires a repeatable,
  reviewed migration plus revalidation. Vocabulary updates do not silently
  reinterpret historical codes.
- Static discriminated unions remain useful inside a bounded API contract, but
  the controlled registry is the ownership-preserving extensibility mechanism.

## Validation evidence and limitations

The prototype covers flight and room-category incompatibility, person roles,
stock, orders, strict values, coded values, cross-property rules, reserved-name
collisions, immutable revalidation, lossless decimal/date round trips,
unsupported Neo4j values, parameterized managed writes, Community schema, a
recursive `CONTAINS` relationship, and a bounded heterogeneous fulfilment path.

AI-generated test candidates were reviewed against TERM-001–TERM-009 and issue
#10. Rejected assumptions included treating scenario prose as properties,
accepting numeric flight numbers through coercion, treating a uniqueness
constraint as existence validation, using floating point for money, embedding
references in property maps, and claiming an actual IATA/ICAO assignment check
without licensed current datasets. The last limitation remains explicit:
syntax is executable, but production code-list currency requires an access and
licensing decision.

Actual server integration is environment-dependent and belongs in the Neo4j
integration suite. Broader CRUD, seed generation, allocation concurrency, and
all catalog-family property definitions remain issues #21, #12, and later
requirements work.

## References

- [Flexible entity implementation](../../architecture/entity-model/implementation.md)
- [Pydantic configuration](https://docs.pydantic.dev/latest/api/config/)
- [Pydantic strict mode](https://docs.pydantic.dev/latest/concepts/strict_mode/)
- [Neo4j property values](https://neo4j.com/docs/cypher-manual/current/values-and-types/)
- [Neo4j constraints](https://neo4j.com/docs/cypher-manual/current/schema/constraints/)
- [Neo4j Python data types](https://neo4j.com/docs/python-manual/current/data-types/)
- [Neo4j managed transactions](https://neo4j.com/docs/python-manual/current/transactions/)

