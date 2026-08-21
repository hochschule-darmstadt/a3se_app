"""Real-Neo4j evidence for the issue #21 CRUD API: full cross-module flow,
pagination, and delete-conflict protection, enabled by explicit test settings.

Reuses TS-002's synthetic data (docs/test/test-scenarios/test-scenarios.md):
Emil Brandt as customer/traveller, Condorleaf Air (SUP-AIR-01, designator
`0Q`) as supplier, flight FLT-02 FRA-GIG. Deletes only nodes whose synthetic
`entityId` begins with `I21-`; never point it at production data.
"""

from __future__ import annotations

import os
import unittest

from fastapi.testclient import TestClient
from neo4j import GraphDatabase

from cct.api.app import create_app
from cct.api.dependencies import ApiDependencies
from cct.infrastructure.neo4j.entity_repository import COMMUNITY_SCHEMA, Neo4jEntityRepository
from cct.resource_management.contracts import EntityKind
from cct.resource_management.default_registry import create_entity_registry
from cct.resource_management.repository_ports import ScopedEntityRepository


@unittest.skipUnless(os.getenv("CCT_NEO4J_TEST_URI"), "CCT_NEO4J_TEST_URI not configured")
class ResourceCrudIntegrationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.driver = GraphDatabase.driver(
            os.environ["CCT_NEO4J_TEST_URI"],
            auth=(os.getenv("CCT_NEO4J_TEST_USER", "neo4j"), os.environ["CCT_NEO4J_TEST_PASSWORD"]),
        )
        cls.driver.verify_connectivity()
        with cls.driver.session(database="neo4j") as session:
            for statement in COMMUNITY_SCHEMA:
                session.run(statement).consume()

        registry = create_entity_registry()
        repository = Neo4jEntityRepository(cls.driver, "neo4j", registry)

        def scoped(*kinds: EntityKind) -> ScopedEntityRepository:
            return ScopedEntityRepository(repository, allowed_kinds=frozenset(kinds))

        dependencies = ApiDependencies(
            person_repository=scoped(EntityKind.PERSON, EntityKind.PERSON_ROLE),
            partner_repository=scoped(EntityKind.ORGANISATION, EntityKind.ORGA_ROLE),
            product_repository=scoped(EntityKind.TOURISTIC_PRODUCT_ITEM),
            stock_repository=scoped(EntityKind.STOCK_ITEM),
            order_repository=scoped(EntityKind.ORDER_ITEM),
        )
        app = create_app()
        app.state.dependencies = dependencies
        cls.client = TestClient(app, raise_server_exceptions=False)

    @classmethod
    def tearDownClass(cls) -> None:
        with cls.driver.session(database="neo4j") as session:
            session.run("MATCH (n) WHERE n.entityId STARTS WITH 'I21-' DETACH DELETE n").consume()
        cls.driver.close()

    def test_full_order_flow_resolves_bounded_cross_module_detail(self) -> None:
        client = self.client
        self.assertEqual(
            201,
            client.post(
                "/persons", json={"entityId": "I21-PERSON", "properties": {"givenName": "Emil", "familyName": "Brandt"}}
            ).status_code,
        )
        self.assertEqual(
            201,
            client.post(
                "/persons/I21-PERSON/roles",
                json={"entityId": "I21-TRAVELLER-ROLE", "role": {"type": "person/traveller", "properties": {}}},
            ).status_code,
        )
        self.assertEqual(
            201,
            client.post("/organisations", json={"entityId": "I21-SUPPLIER", "properties": {"name": "Condorleaf Air"}}).status_code,
        )
        self.assertEqual(
            201,
            client.post(
                "/organisations/I21-SUPPLIER/roles",
                json={
                    "entityId": "I21-SUPPLIER-ROLE",
                    "role": {"type": "organisation/airline", "properties": {"airlineDesignator": "0Q"}},
                },
            ).status_code,
        )
        self.assertEqual(
            201,
            client.post(
                "/products",
                json={
                    "entityId": "I21-FLIGHT",
                    "product": {
                        "type": "product/airline/flight",
                        "properties": {
                            "flightNumber": "500",
                            "departureLocationCode": "FRA",
                            "arrivalLocationCode": "GIG",
                            "scheduledDepartureLocalTime": "10:30:00",
                            "scheduledArrivalLocalTime": "18:45:00",
                        },
                    },
                },
            ).status_code,
        )
        self.assertEqual(
            204, client.put("/products/I21-FLIGHT/supplier", json={"supplierRoleId": "I21-SUPPLIER-ROLE"}).status_code
        )
        self.assertEqual(
            201,
            client.post(
                "/stock-items",
                json={
                    "entityId": "I21-STOCK",
                    "productId": "I21-FLIGHT",
                    "type": "stock/airline/flight/seat",
                    "properties": {"serviceDate": "2027-01-08", "unitPriceAmount": "500.00", "currencyCode": "EUR"},
                },
            ).status_code,
        )
        self.assertEqual(
            201,
            client.post(
                "/orders", json={"entityId": "I21-ORDER", "properties": {"orderNumber": "5766", "orderStatusCode": "order/reserved"}}
            ).status_code,
        )
        self.assertEqual(201, client.post("/orders/I21-ORDER/positions", json={"entityId": "I21-POS"}).status_code)
        self.assertEqual(
            204, client.put("/orders/I21-ORDER/positions/I21-POS/stock", json={"stockItemId": "I21-STOCK"}).status_code
        )
        self.assertEqual(
            204,
            client.put(
                "/orders/I21-ORDER/positions/I21-POS/traveller", json={"travellerRoleId": "I21-TRAVELLER-ROLE"}
            ).status_code,
        )
        self.assertEqual(
            204, client.put("/orders/I21-ORDER/customer", json={"customerRoleId": "I21-TRAVELLER-ROLE"}).status_code
        )

        # Recursive product read: a seat contained by the flight.
        self.assertEqual(
            201,
            client.post(
                "/products",
                json={
                    "entityId": "I21-SEAT",
                    "parentProductId": "I21-FLIGHT",
                    "product": {"type": "product/airline/flight/seat", "properties": {"seatNumber": "5A"}},
                },
            ).status_code,
        )
        components = client.get("/products/I21-FLIGHT/components").json()
        self.assertEqual(
            {"I21-FLIGHT": None, "I21-SEAT": "I21-FLIGHT"}, {c["entityId"]: c["parentProductId"] for c in components}
        )

        # Bounded order detail: order -> position -> stock -> product -> supplier
        # organisation, and position -> traveller -> person, ids only.
        detail = client.get("/orders/I21-ORDER/detail").json()
        self.assertEqual(
            {
                "positionId": "I21-POS",
                "stockItemId": "I21-STOCK",
                "productId": "I21-FLIGHT",
                "supplierOrganisationId": "I21-SUPPLIER",
                "travellerPersonId": "I21-PERSON",
            },
            detail["positions"][0],
        )

        # Order status transition through the same PUT.
        updated = client.put("/orders/I21-ORDER", json={"properties": {"orderNumber": "5766", "orderStatusCode": "order/paid"}})
        self.assertEqual("order/paid", updated.json()["properties"]["orderStatusCode"])

    def test_keyset_pagination_over_real_data(self) -> None:
        client = self.client
        for suffix in ("A", "B", "C"):
            client.post(
                "/persons",
                json={"entityId": f"I21-PAGE-{suffix}", "properties": {"givenName": "Pager", "familyName": suffix}},
            )
        first_page = client.get("/persons", params={"limit": 2}).json()
        page_ids = [item["entityId"] for item in first_page["items"] if item["entityId"].startswith("I21-PAGE-")]
        self.assertLessEqual(len(page_ids), 2)
        self.assertIsNotNone(first_page["nextCursor"])
        second_page = client.get("/persons", params={"limit": 10, "cursor": first_page["nextCursor"]}).json()
        second_ids = {item["entityId"] for item in second_page["items"]}
        self.assertFalse(second_ids & set(page_ids), "second page must not repeat first page's items")

    def test_delete_blocked_by_dependent_relationship_returns_conflict(self) -> None:
        client = self.client
        client.post(
            "/persons", json={"entityId": "I21-BLOCKED-PERSON", "properties": {"givenName": "Blocked", "familyName": "Person"}}
        )
        client.post(
            "/persons/I21-BLOCKED-PERSON/roles",
            json={"entityId": "I21-BLOCKED-ROLE", "role": {"type": "person/traveller", "properties": {}}},
        )
        response = client.delete("/persons/I21-BLOCKED-PERSON")
        self.assertEqual(409, response.status_code)
        self.assertEqual("conflict", response.json()["type"])
        # Deleting the nested role first, then the person, must succeed --
        # proving the delete protection is direction-sensitive, not a deadlock.
        self.assertEqual(204, client.delete("/persons/I21-BLOCKED-PERSON/roles/I21-BLOCKED-ROLE").status_code)
        self.assertEqual(204, client.delete("/persons/I21-BLOCKED-PERSON").status_code)


if __name__ == "__main__":
    unittest.main()
