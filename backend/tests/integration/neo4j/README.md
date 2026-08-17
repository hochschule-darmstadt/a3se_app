# Neo4j integration tests

Tests in this directory verify Neo4j adapters against a disposable controlled
database. They are skipped unless all required connection settings are
explicitly supplied:

```text
CCT_NEO4J_TEST_URI=bolt://localhost:7687
CCT_NEO4J_TEST_USER=neo4j
CCT_NEO4J_TEST_PASSWORD=<test-only password>
```

The issue #20 suite creates Community-compatible constraints and indexes,
round-trips a typed entity, exercises indexed lookup, and traverses recursive
and heterogeneous relationships. It deletes only nodes whose synthetic
`entityId` begins with `I20-`; never point it at production data.
