"""Inventory flexible-property contracts."""

from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import Field, model_validator

from ..contracts import StrictProperties


class StockProperties(StrictProperties):
    service_date: date = Field(alias="serviceDate")
    unit_price_amount: Decimal = Field(alias="unitPriceAmount", ge=Decimal("0"))
    currency_code: Literal["EUR"] = Field(alias="currencyCode")
    capacity_quantity: int = Field(alias="capacityQuantity", ge=0, default=1)
    remaining_capacity: int = Field(alias="remainingCapacity", ge=0, default=1)
    inventory_status_code: Literal["inventory/active", "inventory/withdrawn", "inventory/expired"] = Field(
        alias="inventoryStatusCode", default="inventory/active"
    )

    @model_validator(mode="after")
    def remaining_capacity_must_not_exceed_purchased(self) -> "StockProperties":
        if self.remaining_capacity > self.capacity_quantity:
            raise ValueError("remainingCapacity must not exceed capacityQuantity")
        return self
