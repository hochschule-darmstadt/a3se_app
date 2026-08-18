"""Touristic Product Management flexible-property contracts."""

from datetime import date, time
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
ImageLicenceCode = Literal["CC0-1.0", "CC-BY-4.0", "CC-BY-SA-4.0", "CC-BY-SA-3.0", "PDM-1.0"]


class ImageProperties(StrictProperties):
    """TERM-010 image metadata, optional on any product/* type.

    `imageUrl` gates the rest: when absent every other field must also be
    absent; when present every other field is required (TERM-010's "required
    whenever imageUrl is present" rule).
    """

    image_url: str | None = Field(default=None, alias="imageUrl", pattern=r"^https://")
    image_source_page_url: str | None = Field(default=None, alias="imageSourcePageUrl", pattern=r"^https://")
    image_creator_credit: str | None = Field(default=None, alias="imageCreatorCredit", max_length=200)
    image_licence_code: ImageLicenceCode | None = Field(default=None, alias="imageLicenceCode")
    image_licence_version: str | None = Field(default=None, alias="imageLicenceVersion", min_length=1, max_length=10)
    image_attribution_text: str | None = Field(default=None, alias="imageAttributionText", min_length=1, max_length=300)
    image_alt_text: str | None = Field(default=None, alias="imageAltText", min_length=1, max_length=200)
    image_verified_date: date | None = Field(default=None, alias="imageVerifiedDate")

    @model_validator(mode="after")
    def image_fields_are_all_or_nothing(self) -> "ImageProperties":
        image_fields = (
            self.image_source_page_url,
            self.image_licence_code,
            self.image_licence_version,
            self.image_attribution_text,
            self.image_alt_text,
            self.image_verified_date,
        )
        if self.image_url is None:
            if any(field is not None for field in image_fields):
                raise ValueError("imageSourcePageUrl/licence/attribution/altText/verifiedDate require imageUrl")
        elif any(field is None for field in image_fields):
            raise ValueError("imageUrl requires imageSourcePageUrl, licence, attribution, altText, and verifiedDate")
        return self


class FlightProperties(ImageProperties):
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


class RoomCategoryProperties(ImageProperties):
    room_type_code: RoomTypeCode = Field(alias="roomTypeCode")
    smoking_preference_code: Literal["nonSmoking", "smoking", "unspecified"] | None = Field(
        default=None, alias="smokingPreferenceCode"
    )


class RoomProperties(StrictProperties):
    room_number: str = Field(alias="roomNumber", min_length=1, max_length=20)


class EmptyProductProperties(ImageProperties):
    pass

