# Neo4j Adapters

Only this package may import the Neo4j Python driver or contain Cypher. It will implement module-owned persistence/query ports without exposing driver records, sessions, raw queries, or cross-module write authority.

Issue #20 decides the entity mapping. Issue #21 adds resource adapters. This scaffold contains neither a driver dependency nor database behavior.
