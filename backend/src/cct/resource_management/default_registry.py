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
    LegacyFlightProperties,
    RoomCategoryProperties,
)


def create_entity_registry() -> EntityTypeRegistry:
    empty_supplier_types = (
        "organisation/accommodation", "organisation/mobility",
        "organisation/water-transport", "organisation/experience", "organisation/protection",
    )
    empty_product_types = (
        "product/mobility/transfer", "product/mobility/rail", "product/mobility/coach",
        "product/mobility/vehicle-rental", "product/water-transport/day-boat", "product/water-transport/cruise",
        "product/experience/guided-tour", "product/experience/activity", "product/protection/travel",
    )
    additional_stock_types = (
        "stock/accommodation/room-type",
        "stock/mobility/transfer", "stock/mobility/rail", "stock/mobility/coach", "stock/mobility/vehicle-rental",
        "stock/water-transport/day-boat", "stock/water-transport/cruise",
        "stock/experience/guided-tour", "stock/experience/activity",
        "stock/protection/travel",
    )
    contracts = {
        (EntityKind.PERSON, None): PersonProperties,
        (EntityKind.PERSON_ROLE, "person/customer"): CustomerRoleProperties,
        (EntityKind.PERSON_ROLE, "person/traveller"): TravellerRoleProperties,
        (EntityKind.ORGANISATION, None): OrganisationProperties,
        (EntityKind.ORGA_ROLE, "organisation/airline"): AirlineRoleProperties,
        # Read compatibility for databases created before the TERM-009 namespace rename.
        (EntityKind.ORGA_ROLE, "partner/supplier/airline"): AirlineRoleProperties,
        (EntityKind.TOURISTIC_PRODUCT_ITEM, "product/airline/flight"): FlightProperties,
        (EntityKind.TOURISTIC_PRODUCT_ITEM, "product/flight"): LegacyFlightProperties,
        (EntityKind.TOURISTIC_PRODUCT_ITEM, "product/accommodation/room-type"): RoomCategoryProperties,
        # Read compatibility for databases created before the TERM-009 rename.
        (EntityKind.TOURISTIC_PRODUCT_ITEM, "product/accommodation/room-category"): RoomCategoryProperties,
        (EntityKind.STOCK_ITEM, "stock/airline/flight"): StockProperties,
        (EntityKind.ORDER_ITEM, "order/header"): OrderHeaderProperties,
        (EntityKind.ORDER_ITEM, "order/position"): OrderPositionProperties,
    }
    for value in empty_supplier_types:
        contracts[(EntityKind.ORGA_ROLE, value)] = EmptySupplierRoleProperties
        contracts[(EntityKind.ORGA_ROLE, value.replace("organisation/", "partner/supplier/"))] = EmptySupplierRoleProperties
    for value in empty_product_types:
        contracts[(EntityKind.TOURISTIC_PRODUCT_ITEM, value)] = EmptyProductProperties
    for value in ("product/water/day-boat", "product/water/cruise"):
        contracts[(EntityKind.TOURISTIC_PRODUCT_ITEM, value)] = EmptyProductProperties
    for value in additional_stock_types:
        contracts[(EntityKind.STOCK_ITEM, value)] = StockProperties
    return EntityTypeRegistry(contracts)
