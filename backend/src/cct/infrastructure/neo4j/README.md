# Neo4j Adapters

Only this package may import the Neo4j Python driver or contain Cypher. It will implement module-owned persistence/query ports without exposing driver records, sessions, raw queries, or cross-module write authority.

The issue #20 prototype maps validated flexible properties directly onto nodes,
keeps graph semantics in relationships, and validates writes before entering a
managed transaction. Issue #21 expands `Neo4jEntityRepository` into the full
resource CRUD adapter: `get`/`list` (keyset-paginated)/`delete` (blocked by a
same-transaction dependent-relationship check) alongside `save`, plus
`create_relationship`/`list_related` for the accepted relationship vocabulary,
`get_component_tree` (a defensively depth-capped recursive `CONTAINS` read for
Touristic Product Management), and `get_order_detail` (bounded id-only summary
of an order's positions, implementing `ORDER_DETAIL_TRAVERSAL`). Each Resources
module depends only on the `EntityRepositoryPort` Protocol in
`cct.resource_management.repository_ports`, never on this package directly.
