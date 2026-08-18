"""Deterministic 2027 StockItem calendar generator (issue #12).

Pure computation, no I/O: every function here takes data in and returns
StockItemSpec tuples out, so the full-year x every-room-category/flight-type
matrix can be exhaustively unit-tested without touching Neo4j. The
orchestrator is the only caller that turns these specs into real
create_stock_item calls.

Rule (deterministic, no `random`):
  - quantity(product, date) = 0 when (day_of_year + ordinal) % 11 == 0
    (roughly one day in eleven has no sellable stock for that product,
    product-shifted by `ordinal` so different products don't all go to
    zero on the same calendar day).
  - otherwise quantity = 10 when (day_of_year + ordinal) % 30 == 0 (a
    periodic "peak" date demonstrating the documented 0-10 ceiling is
    real, not just a claimed upper bound), else 1 + ((day_of_year * 7 +
    ordinal * 13) % 3) (a low, deterministic 1-3 baseline).
  - a (productId, date) pair explicitly listed in `guaranteed_dates`
    (the exact dates the seeded orders in orders.json allocate against)
    always gets at least quantity 1, overriding the zero rule -- orders
    must never reference a date this generator left empty.

`ordinal` is a stable per-product integer derived from the catalog ID's
numeric suffix, offset by product family so a flight and a room category
sharing the same suffix number do not share a zero/peak pattern.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from decimal import Decimal

START_2027 = date(2027, 1, 1)
END_2027 = date(2027, 12, 31)

ROOM_CATEGORY_TYPE = "product/accommodation/room-category"
FLIGHT_TYPE = "product/flight"

FLIGHT_STOCK_TYPE = "stock/flight/seat"
ROOM_CATEGORY_STOCK_TYPE = "stock/accommodation/room-category"

FLIGHT_BASE_PRICE = 250
ROOM_BASE_PRICE = 90

# product/* type -> stock/* type, covering every family a seeded order
# position allocates against (not only the flight/room-category families
# that get a full 2027 calendar -- mobility/water/experience/protection get
# one ad hoc StockItem per date an order position actually needs, via
# `ad_hoc_stock_spec` below).
PRODUCT_TYPE_TO_STOCK_TYPE = {
    FLIGHT_TYPE: FLIGHT_STOCK_TYPE,
    ROOM_CATEGORY_TYPE: ROOM_CATEGORY_STOCK_TYPE,
    "product/mobility/transfer": "stock/mobility/transfer",
    "product/mobility/rail": "stock/mobility/rail",
    "product/mobility/coach": "stock/mobility/coach",
    "product/mobility/vehicle-rental": "stock/mobility/vehicle-rental",
    "product/water/day-boat": "stock/water/day-boat",
    "product/water/cruise": "stock/water/cruise",
    "product/experience/guided-tour": "stock/experience/guided-tour",
    "product/experience/activity": "stock/experience/activity",
    "product/protection/travel": "stock/protection/travel",
}
AD_HOC_BASE_PRICE = 60


@dataclass(frozen=True)
class StockItemSpec:
    entity_id: str
    type: str
    product_id: str
    service_date: date
    unit_price_amount: Decimal
    currency_code: str = "EUR"

    @property
    def properties(self) -> dict[str, object]:
        return {
            "serviceDate": self.service_date,
            "unitPriceAmount": self.unit_price_amount,
            "currencyCode": self.currency_code,
        }


def _product_ordinal(product_id: str) -> int:
    prefix, _, suffix = product_id.partition("-")
    offset = 0 if prefix == "FLT" else 500
    return int(suffix) + offset


def daily_quantity(product_id: str, day: date, *, guaranteed: bool) -> int:
    ordinal = _product_ordinal(product_id)
    day_of_year = day.timetuple().tm_yday
    if (day_of_year + ordinal) % 11 == 0:
        return 1 if guaranteed else 0
    if (day_of_year + ordinal) % 30 == 0:
        return 10
    return 1 + ((day_of_year * 7 + ordinal * 13) % 3)


def _daily_price(base: int, day: date) -> Decimal:
    day_of_year = day.timetuple().tm_yday
    return Decimal(base + (day_of_year % 50)).quantize(Decimal("0.01"))


def generate_stock_specs(
    product_ids_by_type: dict[str, list[str]],
    guaranteed_dates: set[tuple[str, date]],
    *,
    start: date = START_2027,
    end: date = END_2027,
) -> tuple[StockItemSpec, ...]:
    """Generate the deterministic dated inventory for a set of products.

    `product_ids_by_type` maps FLIGHT_TYPE/ROOM_CATEGORY_TYPE to the list of
    (non-reserve, used) catalog product ids of that type. `guaranteed_dates`
    is the exact (productId, date) set the seeded orders allocate against --
    never left at zero regardless of the deterministic formula.
    """

    specs: list[StockItemSpec] = []
    for product_type, stock_type, base_price in (
        (FLIGHT_TYPE, FLIGHT_STOCK_TYPE, FLIGHT_BASE_PRICE),
        (ROOM_CATEGORY_TYPE, ROOM_CATEGORY_STOCK_TYPE, ROOM_BASE_PRICE),
    ):
        for product_id in product_ids_by_type.get(product_type, []):
            day = start
            while day <= end:
                guaranteed = (product_id, day) in guaranteed_dates
                quantity = daily_quantity(product_id, day, guaranteed=guaranteed)
                price = _daily_price(base_price, day)
                for unit in range(1, quantity + 1):
                    specs.append(
                        StockItemSpec(
                            entity_id=f"STK-{product_id}-{day.isoformat()}-U{unit}",
                            type=stock_type,
                            product_id=product_id,
                            service_date=day,
                            unit_price_amount=price,
                        )
                    )
                day += timedelta(days=1)
    return tuple(specs)


def ad_hoc_stock_spec(product_id: str, product_type: str, service_date: date) -> StockItemSpec:
    """One deterministic StockItem for a mobility/water/experience/protection
    product date an order position needs -- these families are not part of
    the mandatory 2027 daily calendar (only room categories and flight types
    are), so they get exactly the dated units seeded orders allocate
    against, not a speculative full-year run.
    """

    stock_type = PRODUCT_TYPE_TO_STOCK_TYPE[product_type]
    price = _daily_price(AD_HOC_BASE_PRICE, service_date)
    return StockItemSpec(
        entity_id=f"STK-{product_id}-{service_date.isoformat()}-U1",
        type=stock_type,
        product_id=product_id,
        service_date=service_date,
        unit_price_amount=price,
    )
