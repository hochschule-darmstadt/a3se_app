"""Person Management flexible-property contracts."""

from typing import Literal

from pydantic import Field

from ..contracts import StrictProperties


class PersonProperties(StrictProperties):
    given_name: str = Field(alias="givenName", min_length=1, max_length=100)
    family_name: str = Field(alias="familyName", min_length=1, max_length=100)
    address_locality_name: str | None = Field(default=None, alias="addressLocalityName", min_length=1, max_length=100)


class PersonRolePropertiesBase(StrictProperties):
    """Shared PersonRole lifecycle status.

    `roleStatusCode` follows the same namespaced-code pattern as
    Order Management's `orderStatusCode`. It is the only current status
    transition mechanism (PUT the role with a new code), consistent with
    that precedent; a hard delete remains available but "deactivate" in
    VIEW-S-002 means setting `role/inactive`, not removing the record.
    """

    role_status_code: Literal["role/active", "role/inactive"] = Field(
        default="role/active", alias="roleStatusCode"
    )


PaymentMethodCode = Literal[
    "payment/paypal",
    "payment/credit-card",
    "payment/sepa-direct-debit",
    "payment/bank-transfer",
    "payment/invoice",
]


class CustomerRoleProperties(PersonRolePropertiesBase):
    payment_method_code: PaymentMethodCode | None = Field(default=None, alias="paymentMethodCode")


class TravellerRoleProperties(PersonRolePropertiesBase):
    pass

