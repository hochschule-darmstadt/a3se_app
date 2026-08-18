# Resource Management unit tests

These tests derive flexible-entity contract cases from the terminology catalog,
issue #10 examples, and issue #20 mapping boundaries. They test public behavior
rather than private implementation structure.

Issue #21 adds: `test_pagination.py` and `test_repository_scoping.py` for the
shared kernel; one `test_<module>_service.py` per Resources module exercising
its `service.py` against `support.fake_entity_repository.FakeEntityRepository`
(create/get/list/update/delete, not-found, duplicate, invalid-reference,
delete-conflict, and, for the three modules that read across a module
boundary, the resulting cross-module writes). Where a test needs the full
Order -> Stock -> Product -> Supplier -> Organisation and
traveller -> Person chain, one shared fake instance stands in for the single
Neo4j graph every module's `ScopedEntityRepository` view wraps in production.

