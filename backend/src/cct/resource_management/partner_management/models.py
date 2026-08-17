"""Partner Management flexible-property contracts."""

from pydantic import Field

from ..contracts import StrictProperties


class OrganisationProperties(StrictProperties):
    name: str = Field(min_length=1, max_length=200)
    address_locality_name: str | None = Field(default=None, alias="addressLocalityName", min_length=1, max_length=100)


class AirlineRoleProperties(StrictProperties):
    airline_designator: str = Field(alias="airlineDesignator", pattern=r"^[A-Z0-9]{2}$")


class EmptySupplierRoleProperties(StrictProperties):
    pass

