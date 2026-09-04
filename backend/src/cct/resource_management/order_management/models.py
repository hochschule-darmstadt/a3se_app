"""Order Management flexible-property contracts."""

from typing import Literal

from pydantic import Field

from ..contracts import StrictProperties


OrderStatusCode = Literal["order/reserved", "order/paid", "order/fulfilled", "order/cancelled"]


class OrderHeaderProperties(StrictProperties):
    order_number: str | None = Field(default=None, alias="orderNumber", min_length=1, max_length=100)
    order_status_code: OrderStatusCode = Field(alias="orderStatusCode")


class OrderPositionProperties(StrictProperties):
    pass
