"""Unit tests for Order Management application operations, against a fake repository.

Uses one shared FakeEntityRepository across "modules" (mirroring the single
Neo4j graph every ScopedEntityRepository view wraps in production) so the
full Order -> Stock -> Product -> Supplier -> Organisation and
position -> traveller -> Person chain can be exercised end to end.
"""

from __future__ import annotations

from datetime import date, time
from decimal import Decimal
import unittest

from support.fake_entity_repository import FakeEntityRepository

from cct.resource_management.errors import DependentEntityExistsError, DuplicateEntityError, EntityNotFoundError
from cct.resource_management.inventory import service as inventory_service
from cct.resource_management.order_management import service
from cct.resource_management.partner_management import service as partner_service
from cct.resource_management.person_management import service as person_service
from cct.resource_management.touristic_product_management import service as product_service


class OrderServiceTest(unittest.TestCase):
    def setUp(self) -> None:
        self.repository = FakeEntityRepository()
        self.stock_repository = self.repository
        self.person_repository = self.repository

    def create_order_fixture(self, order_id: str = "I21-ORDER-01") -> None:
        service.create_order(
            self.repository, entity_id=order_id, properties={"orderNumber": "5766", "orderStatusCode": "order/reserved"}
        )

    def test_create_order_succeeds(self) -> None:
        self.create_order_fixture()
        entity = service.get_order(self.repository, "I21-ORDER-01")
        self.assertEqual("order/reserved", entity.properties.order_status_code)

    def test_create_order_rejects_duplicate(self) -> None:
        self.create_order_fixture()
        with self.assertRaises(DuplicateEntityError):
            self.create_order_fixture()

    def test_get_order_raises_not_found(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.get_order(self.repository, "MISSING")

    def test_update_order_transitions_status(self) -> None:
        self.create_order_fixture()
        updated = service.update_order(
            self.repository, "I21-ORDER-01", properties={"orderNumber": "5766", "orderStatusCode": "order/paid"}
        )
        self.assertEqual("order/paid", updated.properties.order_status_code)

    def test_delete_order_blocked_while_position_exists(self) -> None:
        self.create_order_fixture()
        service.create_order_position(self.repository, entity_id="I21-POS-01", order_id="I21-ORDER-01")
        with self.assertRaises(DependentEntityExistsError):
            service.delete_order(self.repository, "I21-ORDER-01")

    def test_create_order_position_requires_existing_order(self) -> None:
        with self.assertRaises(EntityNotFoundError):
            service.create_order_position(self.repository, entity_id="I21-POS-01", order_id="MISSING")

    def test_create_order_position_rejects_duplicate(self) -> None:
        self.create_order_fixture()
        service.create_order_position(self.repository, entity_id="I21-POS-01", order_id="I21-ORDER-01")
        with self.assertRaises(DuplicateEntityError):
            service.create_order_position(self.repository, entity_id="I21-POS-01", order_id="I21-ORDER-01")

    def test_list_order_positions_returns_created_positions(self) -> None:
        self.create_order_fixture()
        service.create_order_position(self.repository, entity_id="I21-POS-01", order_id="I21-ORDER-01")
        positions = service.list_order_positions(self.repository, "I21-ORDER-01")
        self.assertEqual(("I21-POS-01",), tuple(p.entity_id for p in positions))

    def test_delete_order_position_removes_entity(self) -> None:
        self.create_order_fixture()
        service.create_order_position(self.repository, entity_id="I21-POS-01", order_id="I21-ORDER-01")
        service.delete_order_position(self.repository, "I21-POS-01")
        with self.assertRaises(EntityNotFoundError):
            service.get_order_position(self.repository, "I21-POS-01")

    def test_allocate_stock_requires_existing_stock(self) -> None:
        self.create_order_fixture()
        service.create_order_position(self.repository, entity_id="I21-POS-01", order_id="I21-ORDER-01")
        with self.assertRaises(EntityNotFoundError):
            service.allocate_stock(
                self.repository, "I21-POS-01", stock_item_id="MISSING", stock_repository=self.stock_repository
            )

    def test_assign_traveller_requires_existing_role(self) -> None:
        self.create_order_fixture()
        service.create_order_position(self.repository, entity_id="I21-POS-01", order_id="I21-ORDER-01")
        with self.assertRaises(EntityNotFoundError):
            service.assign_traveller(
                self.repository, "I21-POS-01", traveller_role_id="MISSING", person_repository=self.person_repository
            )

    def test_full_order_detail_resolves_stock_product_supplier_and_traveller(self) -> None:
        # Order -> position -> stock -> product -> supplier role -> organisation,
        # and position -> traveller role -> person: the full bounded chain the
        # issue requires reading without raw graph access.
        person_service.create_person(
            self.repository, entity_id="I21-PERSON", properties={"givenName": "Emil", "familyName": "Brandt"}
        )
        person_service.create_person_role(
            self.repository, entity_id="I21-TRAVELLER-ROLE", person_id="I21-PERSON", type="person/traveller", properties={}
        )
        partner_service.create_organisation(
            self.repository, entity_id="I21-SUPPLIER", properties={"name": "Condorleaf Air"}
        )
        partner_service.create_orga_role(
            self.repository,
            entity_id="I21-SUPPLIER-ROLE",
            organisation_id="I21-SUPPLIER",
            type="organisation/airline",
            properties={"airlineDesignator": "0Q"},
        )
        product_service.create_product(
            self.repository,
            entity_id="I21-FLIGHT",
            type="product/airline/flight",
            properties={
                "flightNumber": "500",
                "departureLocationCode": "FRA",
                "arrivalLocationCode": "GIG",
                "scheduledDepartureLocalTime": time(10, 30),
                "scheduledArrivalLocalTime": time(18, 45),
            },
        )
        product_service.set_supplier(
            self.repository, "I21-FLIGHT", supplier_role_id="I21-SUPPLIER-ROLE", partner_repository=self.repository
        )
        product_service.create_product(
            self.repository, entity_id="I21-SEAT", type="product/airline/flight/seat",
            properties={"seatNumber": "1A"}, parent_product_id="I21-FLIGHT",
        )
        inventory_service.create_stock_item(
            self.repository,
            entity_id="I21-STOCK",
            type="stock/flight/seat",
            properties={"serviceDate": date(2027, 1, 8), "unitPriceAmount": Decimal("500.00"), "currencyCode": "EUR"},
            product_id="I21-SEAT",
            product_repository=self.repository,
        )
        self.create_order_fixture()
        service.create_order_position(self.repository, entity_id="I21-POS-01", order_id="I21-ORDER-01")
        service.allocate_stock(
            self.repository, "I21-POS-01", stock_item_id="I21-STOCK", stock_repository=self.stock_repository
        )
        service.assign_traveller(
            self.repository,
            "I21-POS-01",
            traveller_role_id="I21-TRAVELLER-ROLE",
            person_repository=self.person_repository,
        )

        detail = service.get_order_detail(self.repository, "I21-ORDER-01")
        self.assertEqual(
            (
                {
                    "positionId": "I21-POS-01",
                    "stockItemId": "I21-STOCK",
                    "productId": "I21-SEAT",
                    "supplierOrganisationId": "I21-SUPPLIER",
                    "travellerPersonId": "I21-PERSON",
                },
            ),
            detail,
        )


if __name__ == "__main__":
    unittest.main()
