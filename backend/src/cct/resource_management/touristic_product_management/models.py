"""Touristic Product Management flexible-property contracts."""

from datetime import time
from typing import Literal

from pydantic import Field, model_validator

from ..contracts import StrictProperties


class FlightProperties(StrictProperties):
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


class SeatProperties(StrictProperties):
    seat_number: str = Field(alias="seatNumber", pattern=r"^[1-9][0-9]{0,2}[A-Z]$")


class RoomCategoryProperties(StrictProperties):
    room_type_code: Literal["room/double"] = Field(alias="roomTypeCode")
    smoking_preference_code: Literal["nonSmoking", "smoking", "unspecified"] | None = Field(
        default=None, alias="smokingPreferenceCode"
    )


class RoomProperties(StrictProperties):
    room_number: str = Field(alias="roomNumber", min_length=1, max_length=20)


class EmptyProductProperties(StrictProperties):
    pass

