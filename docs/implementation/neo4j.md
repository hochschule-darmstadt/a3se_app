# Neo4j

- Status: accepted
- Owner: Implementation
- Last reviewed: 2026-08-05

This guide supplements [Clean Code](clean-code.md) and applies to the Neo4j Community Edition PoC selected by DR-0010. Retention remains subject to the recorded PoC criteria.

## Implementation rules

- Neo4j driver and Cypher code shall exist only in persistence adapters. Interaction modules, domain code, and product agents shall use module-owned operations rather than database sessions.
- Queries shall use the GQL-compatible subset of Neo4j Cypher wherever it adequately supports the required graph operation. Neo4j-specific Cypher extensions may be used when required for functionality, transactional correctness, security, or demonstrated performance. Such extensions shall be explicitly documented.
- Labels shall use singular `PascalCase`, relationship types `UPPER_SNAKE_CASE`, and properties `camelCase`. Names shall use the project glossary and remain owned by one module.
- Every persisted entity shall have a stable domain identifier and an applicable uniqueness constraint. Indexes shall follow measured query needs, not speculation.
- Cypher shall be parameterised. Labels, relationship types, sort expressions, path depth, and other elements that cannot be parameterised shall come only from bounded allow-lists.
- The application shall specify the database explicitly and keep one application-scoped driver. Sessions and transactions shall be short-lived, scoped to one unit of work, and never shared concurrently.
- Managed transaction functions shall be used for retryable reads and writes. Their callbacks shall be idempotent because the driver may retry them.
- Results needed outside a transaction shall be consumed or transformed before its scope ends.
- Stock allocation and order creation shall use an atomic, concurrency-safe write and shall roll back completely on failure. Retries shall not duplicate reservations or business events.
- Variable-length and heterogeneous traversals shall have bounded depth, result size, execution time, actor scope, labels, and relationship types. Product agents shall receive purpose-specific operations, never arbitrary Cypher.
- Schema changes and reference data shall use reviewed, versioned, repeatable migrations. Community Edition operation shall not depend on an Enterprise-only feature.

## Query documentation notation

A named query or repository method shall document its business purpose, parameters, result projection, allowed graph scope, transaction and locking assumptions, retry semantics, expected indexes or constraints, and maximum path bounds. Any Neo4j-specific Cypher extension shall additionally document why the GQL-compatible subset is insufficient and the resulting portability impact. Complex Cypher shall use concise comments for stages whose intent is not evident from the pattern.

## Verification

Integration tests shall run against the selected Neo4j edition and cover constraints, mappings, multi-hop patterns, rule-validated properties, rollback, concurrent stock allocation, bounded agent reads, and migration repeatability. Query review shall identify use of Cypher features outside Neo4j's documented GQL conformance. Performance-sensitive queries shall retain measured `PROFILE` evidence and the representative data volume.

## Primary references

- [Neo4j Python driver manual](https://neo4j.com/docs/python-manual/current/)
- [Neo4j transactions](https://neo4j.com/docs/python-manual/current/transactions/)
- [Neo4j performance recommendations](https://neo4j.com/docs/python-manual/current/performance/)
- [Neo4j GQL conformance](https://neo4j.com/docs/cypher-manual/current/appendix/gql-conformance/)
- [ISO/IEC 39075:2024 GQL](https://www.iso.org/standard/76120.html)
