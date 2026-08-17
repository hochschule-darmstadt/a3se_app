"""Person Management flexible-property contracts."""

from typing import Literal

from pydantic import Field

from ..contracts import StrictProperties


class PersonProperties(StrictProperties):
    given_name: str = Field(alias="givenName", min_length=1, max_length=100)
    family_name: str = Field(alias="familyName", min_length=1, max_length=100)
    address_locality_name: str | None = Field(default=None, alias="addressLocalityName", min_length=1, max_length=100)


class CustomerRoleProperties(StrictProperties):
    payment_method_code: Literal["payment/paypal"] | None = Field(default=None, alias="paymentMethodCode")


class TravellerRoleProperties(StrictProperties):
    pass

