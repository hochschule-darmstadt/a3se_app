# Resource Management Layer

This single layer namespace supports graph-oriented discovery without merging business ownership. Its five subpackages correspond to the accepted Resources modules. Each owns its writes, invariants, public operations, and persistence port.

There is deliberately no generic `graph_queries` package. A bounded graph-query interface belongs to the consuming module or use case; its Neo4j implementation belongs under `cct.infrastructure.neo4j`.
