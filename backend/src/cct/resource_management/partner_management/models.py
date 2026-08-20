"""Partner Management flexible-property contracts."""

from typing import Literal

from pydantic import Field

from ..contracts import StrictProperties


class OrganisationProperties(StrictProperties):
    name: str = Field(min_length=1, max_length=200)
    address_locality_name: str | None = Field(default=None, alias="addressLocalityName", min_length=1, max_length=100)


class OrgaRolePropertiesBase(StrictProperties):
    """Shared OrgaRole lifecycle status.

    `roleStatusCode` follows the same namespaced-code pattern as Person
    Management's `PersonRolePropertiesBase` (WF-Q-010 precedent). It is the
    only current status transition mechanism (PUT the role with a new code);
    a hard delete remains available but "deactivate" in VIEW-S-004 means
    setting `role/inactive`, not removing the record.
    """

    role_status_code: Literal["role/active", "role/inactive"] = Field(
        default="role/active", alias="roleStatusCode"
    )


class AirlineRoleProperties(OrgaRolePropertiesBase):
    airline_designator: str = Field(alias="airlineDesignator", pattern=r"^[A-Z0-9]{2}$")


class EmptySupplierRoleProperties(OrgaRolePropertiesBase):
    pass

