"""Deterministic planning primitives for the AI travel advisor.

The language model may extract intent and select among API results, but it must
not be the authority for date arithmetic or itinerary completeness.  This
module is deliberately independent of FastAPI, Neo4j, and any agent runtime so
it can be used by a future LangGraph node and tested without infrastructure.
"""

from __future__ import annotations

from datetime import date, datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, model_validator


class CapacityUnit(StrEnum):
    BED = "bed"
    SEAT = "seat"


class ComponentKind(StrEnum):
    TRANSPORT = "transport"
    ACCOMMODATION = "accommodation"
    ACTIVITY = "activity"


class TravelIntent(BaseModel):
    """Structured customer intent after language-model extraction."""

    model_config = ConfigDict(extra="forbid")

    origin_code: str | None = Field(default=None, min_length=3, max_length=3)
    return_code: str | None = Field(default=None, min_length=3, max_length=3)
    destination: str | None = Field(default=None, min_length=1, max_length=100)
    start_date: date | None = None
    end_date: date | None = None
    min_days: int | None = Field(default=None, ge=1, le=365)
    max_days: int | None = Field(default=None, ge=1, le=365)
    traveller_count: int = Field(default=1, ge=1, le=20)
    budget_amount: float | None = Field(default=None, ge=0)
    budget_currency: str = Field(default="EUR", min_length=3, max_length=3)

    @model_validator(mode="after")
    def validate_date_bounds(self) -> "TravelIntent":
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValueError("end_date must not be before start_date")
        if self.min_days and self.max_days and self.min_days > self.max_days:
            raise ValueError("min_days must not exceed max_days")
        return self


class ItineraryComponent(BaseModel):
    """A component selected from an authoritative API result."""

    model_config = ConfigDict(extra="forbid")

    component_id: str = Field(min_length=1, max_length=100)
    product_id: str | None = Field(default=None, min_length=1, max_length=100)
    display_name_chain: tuple[str, ...] = ()
    kind: ComponentKind
    location_code: str | None = Field(default=None, min_length=3, max_length=3)
    from_code: str | None = Field(default=None, min_length=3, max_length=3)
    to_code: str | None = Field(default=None, min_length=3, max_length=3)
    service_date: date
    end_date: date | None = None
    unit_price: float = Field(ge=0)
    currency: str = Field(min_length=3, max_length=3)
    capacity_unit: CapacityUnit | None = None
    available_capacity: int = Field(default=0, ge=0)

    @model_validator(mode="after")
    def validate_component_dates(self) -> "ItineraryComponent":
        if self.end_date and self.end_date < self.service_date:
            raise ValueError("component end_date must not be before service_date")
        return self


class ItineraryDiagnostic(BaseModel):
    model_config = ConfigDict(extra="forbid")

    rule_id: str = Field(min_length=1, max_length=50)
    message: str = Field(min_length=1, max_length=500)
    component_ids: tuple[str, ...] = ()


def elapsed_days(start: date, end: date) -> int:
    """Return elapsed calendar days between arrival and departure.

    The end date is checkout/departure, not another accommodation night.
    Therefore 4 January arrival to 12 January checkout is 8 days and 8
    nights (the nights beginning on 4 through 11 January).  If the customer
    means the night beginning on 12 January as well, checkout is 13 January.
    """

    return (end - start).days


def required_nights(start: date, checkout: date) -> tuple[date, ...]:
    """Return each accommodation night for an arrival/checkout interval."""

    return tuple(date.fromordinal(start.toordinal() + offset) for offset in range((checkout - start).days))


def validate_itinerary(intent: TravelIntent, components: tuple[ItineraryComponent, ...]) -> tuple[ItineraryDiagnostic, ...]:
    """Validate completeness without querying or mutating any resource."""

    diagnostics: list[ItineraryDiagnostic] = []
    if intent.start_date and intent.end_date:
        duration = elapsed_days(intent.start_date, intent.end_date)
        if intent.min_days and duration < intent.min_days or intent.max_days and duration > intent.max_days:
            diagnostics.append(ItineraryDiagnostic(rule_id="TRAVEL-DURATION", message=f"Travel duration is {duration} days, outside the requested bounds."))

        nights = set(required_nights(intent.start_date, intent.end_date))
        covered = {
            night
            for component in components
            if component.kind is ComponentKind.ACCOMMODATION and component.end_date
            for night in required_nights(component.service_date, component.end_date)
        }
        missing = sorted(nights - covered)
        if missing:
            diagnostics.append(ItineraryDiagnostic(rule_id="ACCOMMODATION-COVERAGE", message="Every night between arrival and checkout needs accommodation.", component_ids=tuple(str(item) for item in missing)))

    if intent.origin_code and not any(item.kind is ComponentKind.TRANSPORT and item.from_code == intent.origin_code for item in components):
        diagnostics.append(ItineraryDiagnostic(rule_id="START-TRANSPORT", message="The itinerary has no transport from the requested origin."))
    if intent.return_code and not any(item.kind is ComponentKind.TRANSPORT and item.to_code == intent.return_code for item in components):
        diagnostics.append(ItineraryDiagnostic(rule_id="END-TRANSPORT", message="The itinerary has no transport to the requested return point."))

    required_capacity = intent.traveller_count
    capacity_groups: dict[tuple[object, ...], list[ItineraryComponent]] = {}
    for component in components:
        if component.capacity_unit:
            key = (component.product_id or component.component_id, component.kind, component.service_date, component.end_date, component.capacity_unit)
            capacity_groups.setdefault(key, []).append(component)
    for grouped in capacity_groups.values():
        available = sum(item.available_capacity for item in grouped)
        if available < required_capacity:
            diagnostics.append(ItineraryDiagnostic(
                rule_id="PERSON-CAPACITY",
                message=f"The selected stock has capacity for {available}, but {required_capacity} travellers require capacity.",
                component_ids=tuple(item.component_id for item in grouped),
            ))

    if intent.budget_amount is not None:
        total = sum(item.unit_price for item in components if item.currency == intent.budget_currency)
        if total > intent.budget_amount:
            diagnostics.append(ItineraryDiagnostic(rule_id="BUDGET", message=f"The composition total {total:.2f} {intent.budget_currency} exceeds the budget {intent.budget_amount:.2f} {intent.budget_currency}."))
    return tuple(diagnostics)
