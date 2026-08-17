"""Accepted terminology registry composed from module-owned contracts."""

from .contracts import EntityKind
from .inventory.models import StockProperties
from .order_management.models import OrderHeaderProperties, OrderPositionProperties
from .partner_management.models import AirlineRoleProperties, EmptySupplierRoleProperties, OrganisationProperties
from .person_management.models import CustomerRoleProperties, PersonProperties, TravellerRoleProperties
from .registry import EntityTypeRegistry
from .touristic_product_management.models import (
    EmptyProductProperties,
    FlightProperties,
    RoomCategoryProperties,
    RoomProperties,
    SeatProperties,
)


def create_entity_registry() -> EntityTypeRegistry:
    empty_supplier_types = (
        "partner/supplier/hotel", "partner/supplier/accommodation", "partner/supplier/mobility",
        "partner/supplier/water-transport", "partner/supplier/experience", "partner/supplier/protection",
    )
    empty_product_types = (
        "product/mobility/transfer", "product/mobility/rail", "product/mobility/coach",
        "product/mobility/vehicle-rental", "product/water/day-boat", "product/water/cruise",
        "product/experience/guided-tour", "product/experience/activity", "product/protection/travel",
    )
    contracts = {
        (EntityKind.PERSON, None): PersonProperties,
        (EntityKind.PERSON_ROLE, "person/customer"): CustomerRoleProperties,
        (EntityKind.PERSON_ROLE, "person/traveller"): TravellerRoleProperties,
        (EntityKind.ORGANISATION, None): OrganisationProperties,
        (EntityKind.ORGA_ROLE, "partner/supplier/airline"): AirlineRoleProperties,
        (EntityKind.TOURISTIC_PRODUCT_ITEM, "product/flight"): FlightProperties,
        (EntityKind.TOURISTIC_PRODUCT_ITEM, "product/flight/seat"): SeatProperties,
        (EntityKind.TOURISTIC_PRODUCT_ITEM, "product/hotel/room-category"): RoomCategoryProperties,
        (EntityKind.TOURISTIC_PRODUCT_ITEM, "product/accommodation/room-category"): RoomCategoryProperties,
        (EntityKind.TOURISTIC_PRODUCT_ITEM, "product/hotel/room"): RoomProperties,
        (EntityKind.STOCK_ITEM, "stock/flight/seat"): StockProperties,
        (EntityKind.STOCK_ITEM, "stock/hotel/room"): StockProperties,
        (EntityKind.ORDER_ITEM, "order/header"): OrderHeaderProperties,
        (EntityKind.ORDER_ITEM, "order/position"): OrderPositionProperties,
    }
    for value in empty_supplier_types:
        contracts[(EntityKind.ORGA_ROLE, value)] = EmptySupplierRoleProperties
    for value in empty_product_types:
        contracts[(EntityKind.TOURISTIC_PRODUCT_ITEM, value)] = EmptyProductProperties
    return EntityTypeRegistry(contracts)
