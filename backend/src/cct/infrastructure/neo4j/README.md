# Neo4j Adapters

Only this package may import the Neo4j Python driver or contain Cypher. It will implement module-owned persistence/query ports without exposing driver records, sessions, raw queries, or cross-module write authority.

The issue #20 prototype maps validated flexible properties directly onto nodes,
keeps graph semantics in relationships, and validates writes before entering a
managed transaction. Issue #21 expands this narrow prototype into resource
CRUD adapters.
