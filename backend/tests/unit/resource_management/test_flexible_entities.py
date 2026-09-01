"""Reviewed terminology-derived tests for flexible entity contracts."""

from __future__ import annotations

from datetime import date, time
from decimal import Decimal
import unittest

from pydantic import ValidationError

from cct.resource_management.contracts import EntityKind
from cct.resource_management.default_registry import create_entity_registry


def flight(**overrides: object) -> dict[str, object]:
    properties: dict[str, object] = {
        "flightNumber": "CA500",
        "departureLocationCode": "FRA",
        "arrivalLocationCode": "GIG",
        "scheduledDepartureLocalTime": time(10, 30),
        "scheduledArrivalLocalTime": time(18, 45),
        "aircraftTypeDesignator": "B744",
    }
    properties.update(overrides)
    return {
        "entityId": "FLT-02",
        "entityKind": "TouristicProductItem",
        "type": "product/airline/flight",
        "schemaVersion": 1,
        "properties": properties,
    }


class FlexibleEntityValidationTest(unittest.TestCase):
    def setUp(self) -> None:
        self.registry = create_entity_registry()

    def test_flight_selects_typed_contract_and_supports_attribute_access(self) -> None:
        entity = self.registry.validate(flight())
        self.assertEqual("500", entity.properties.flight_number)
        self.assertEqual(EntityKind.TOURISTIC_PRODUCT_ITEM, entity.entity_kind)

    def test_flight_properties_are_rejected_for_room_category(self) -> None:
        candidate = flight()
        candidate["type"] = "product/accommodation/room-type"
        with self.assertRaises(ValidationError):
            self.registry.validate(candidate)

    def test_room_category_requires_its_own_properties(self) -> None:
        entity = self.registry.validate(
            {
                "entityId": "ACC-02",
                "entityKind": "TouristicProductItem",
                "type": "product/accommodation/room-type",
                "properties": {"roomTypeCode": "room/double", "smokingPreferenceCode": "nonSmoking"},
            }
        )
        self.assertEqual("room/double", entity.properties.room_type_code)

    def test_required_unknown_and_wrongly_typed_values_are_rejected(self) -> None:
        missing = flight()
        del missing["properties"]["flightNumber"]  # type: ignore[index]
        with self.assertRaises(ValidationError):
            self.registry.validate(missing)
        with self.assertRaises(ValidationError):
            self.registry.validate(flight(airport="FRA"))
        with self.assertRaises(ValidationError):
            self.registry.validate(flight(flightNumber=500))

    def test_invalid_coded_value_is_rejected(self) -> None:
        with self.assertRaises(ValidationError):
            self.registry.validate(
                {
                    "entityId": "ACC-02",
                    "entityKind": "TouristicProductItem",
                    "type": "product/accommodation/room-type",
                    "properties": {"roomTypeCode": "DBL"},
                }
            )

    def test_cross_property_rule_rejects_equal_airports(self) -> None:
        with self.assertRaisesRegex(ValidationError, "must differ"):
            self.registry.validate(flight(arrivalLocationCode="FRA"))

    def test_reserved_names_cannot_collide_with_flexible_properties(self) -> None:
        with self.assertRaisesRegex(ValidationError, "reserved structural names"):
            self.registry.validate(flight(entityId="shadow"))

    def test_models_are_immutable_and_revalidate_each_boundary_input(self) -> None:
        entity = self.registry.validate(flight())
        with self.assertRaises(ValidationError):
            entity.properties.flight_number = "600"  # type: ignore[misc]
        changed = flight(flightNumber="600")
        self.assertEqual("600", self.registry.validate(changed).properties.flight_number)

    def test_person_role_stock_and_order_item_examples_validate(self) -> None:
        customer = self.registry.validate(
            {"entityId": "ROLE-001", "entityKind": "PersonRole", "type": "person/customer",
             "properties": {"paymentMethodCode": "payment/paypal"}}
        )
        stock = self.registry.validate(
            {"entityId": "STOCK-001", "entityKind": "StockItem", "type": "stock/airline/flight/seat",
             "properties": {"serviceDate": date(2027, 1, 8), "unitPriceAmount": Decimal("500.00"),
                            "currencyCode": "EUR"}}
        )
        order = self.registry.validate(
            {"entityId": "ORDER-001", "entityKind": "OrderItem", "type": "order/header",
             "properties": {"orderNumber": "5766", "orderStatusCode": "order/paid"}}
        )
        self.assertEqual("payment/paypal", customer.properties.payment_method_code)
        self.assertEqual(Decimal("500.00"), stock.properties.unit_price_amount)
        self.assertEqual("5766", order.properties.order_number)

    def test_invalid_calendar_date_and_negative_amount_are_rejected(self) -> None:
        with self.assertRaises(ValueError):
            date(2027, 2, 29)
        with self.assertRaises(ValidationError):
            self.registry.validate(
                {"entityId": "STOCK-001", "entityKind": "StockItem", "type": "stock/airline/flight/seat",
                 "properties": {"serviceDate": date(2027, 2, 28), "unitPriceAmount": Decimal("-0.01"),
                                "currencyCode": "EUR"}}
            )

    def test_unregistered_type_fails_closed(self) -> None:
        candidate = flight()
        candidate["type"] = "product/future/runtime-plugin"
        with self.assertRaisesRegex(ValueError, "unsupported entity contract"):
            self.registry.validate(candidate)

    def test_unknown_schema_version_requires_migration(self) -> None:
        candidate = flight()
        candidate["schemaVersion"] = 2
        with self.assertRaisesRegex(ValueError, "unsupported schemaVersion"):
            self.registry.validate(candidate)
