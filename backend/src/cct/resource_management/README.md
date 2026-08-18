# Resource Management Layer

This single layer namespace supports graph-oriented discovery without merging business ownership. Its five subpackages correspond to the accepted Resources modules. Each owns its writes, invariants, public operations, and persistence port.

There is deliberately no generic `graph_queries` package. A bounded graph-query interface belongs to the consuming module or use case; its Neo4j implementation belongs under `cct.infrastructure.neo4j`.

Issue #21 adds a small shared kernel used by every module's `service.py`:
`errors.py` (typed domain errors mapped to HTTP responses by `cct.api`),
`relationship_types.py` (the accepted Neo4j edge-type vocabulary),
`pagination.py` (keyset cursor helpers), and `repository_ports.py`
(`EntityRepositoryPort`, the Protocol modules depend on instead of importing
`cct.infrastructure`, and `ScopedEntityRepository`, which allow-lists the
`EntityKind`s a module may read, write, or delete). This kernel does not own
module writes or business invariants; each module's `service.py` still owns
its own operations.
