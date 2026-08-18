# Infrastructure unit tests

These tests verify mapping failures and transaction-boundary behavior without
claiming to replace Neo4j Community Edition integration tests.

`test_entity_repository_crud.py` extends the `RecordingDriver`-style fakes
from `test_neo4j_mapping.py` to assert the exact parameterized Cypher shape
of the issue #21 `get`/`list`/`delete`/`create_relationship`/`list_related`/
`get_component_tree`/`get_order_detail` additions, including the
direction-sensitive delete-dependent check (outgoing ownership edges block
the owner; incoming reference edges block the referenced node) -- still no
real database.

