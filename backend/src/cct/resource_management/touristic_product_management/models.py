"""Touristic Product Management flexible-property contracts."""

from datetime import time
from typing import Literal

from pydantic import Field, model_validator

from ..contracts import StrictProperties

RoomTypeCode = Literal[
    "room/single",
    "room/double",
    "room/twin",
    "room/triple",
    "room/family",
    "room/adjoining",
    "room/suite",
    "room/cabin",
]


class CatalogueItemProperties(StrictProperties):
    """Shared fields for catalogue-root product types (not their structural children).

    `name` is human-authored source data for TERM-011's computed display
    projection. It is optional where a type-specific rule supplies the
    display label. `lifecycleStatusCode` closes WF-Q-014 and follows the
    `roleStatusCode` pattern (TERM-003): "activate"/"retire" in VIEW-S-003
    transition this status on the same record; there is no separate
    version-number/version-history mechanism in MVP.
    """

    name: str | None = Field(default=None, min_length=1, max_length=200)
    lifecycle_status_code: Literal["product/draft", "product/active", "product/retired"] = Field(
        default="product/draft", alias="lifecycleStatusCode"
    )


class FlightProperties(CatalogueItemProperties):
    flight_number: str = Field(alias="flightNumber", pattern=r"^[0-9]{1,4}$")
    departure_location_code: str = Field(alias="departureLocationCode", pattern=r"^[A-Z]{3}$")
    arrival_location_code: str = Field(alias="arrivalLocationCode", pattern=r"^[A-Z]{3}$")
    scheduled_departure_local_time: time = Field(alias="scheduledDepartureLocalTime")
    scheduled_arrival_local_time: time = Field(alias="scheduledArrivalLocalTime")
    aircraft_type_designator: str | None = Field(
        default=None, alias="aircraftTypeDesignator", pattern=r"^[A-Z0-9]{2,4}$"
    )

    @model_validator(mode="after")
    def locations_must_differ(self) -> "FlightProperties":
        if self.departure_location_code == self.arrival_location_code:
            raise ValueError("departureLocationCode must differ from arrivalLocationCode")
        return self


class RoomCategoryProperties(CatalogueItemProperties):
    room_type_code: RoomTypeCode = Field(alias="roomTypeCode")
    smoking_preference_code: Literal["nonSmoking", "smoking", "unspecified"] | None = Field(
        default=None, alias="smokingPreferenceCode"
    )


class EmptyProductProperties(CatalogueItemProperties):
    name: str = Field(min_length=1, max_length=200)

