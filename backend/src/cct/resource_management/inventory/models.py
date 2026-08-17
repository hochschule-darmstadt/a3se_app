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

