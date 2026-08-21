"""Inventory flexible-property contracts."""

from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import Field

from ..contracts import StrictProperties


class StockProperties(StrictProperties):
    service_date: date = Field(alias="serviceDate")
    unit_price_amount: Decimal = Field(alias="unitPriceAmount", ge=Decimal("0"))
    currency_code: Literal["EUR"] = Field(alias="currencyCode")
    capacity_quantity: int = Field(alias="capacityQuantity", ge=0, default=1)
    held_quantity: int = Field(alias="heldQuantity", ge=0, default=0)
    allocated_quantity: int = Field(alias="allocatedQuantity", ge=0, default=0)
    inventory_status_code: Literal["inventory/active", "inventory/withdrawn", "inventory/expired"] = Field(
        alias="inventoryStatusCode", default="inventory/active"
    )
