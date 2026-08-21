"""Read-only TERM-011 display projections shared by API collection/detail responses."""

from __future__ import annotations

from dataclasses import dataclass

from cct.resource_management.contracts import EntityKind, ValidatedEntity
from cct.resource_management.errors import InvalidEntityGraphError
from cct.resource_management.partner_management import service as partner_service
from cct.resource_management.relationship_types import RelationshipType
from cct.resource_management.repository_ports import EntityRepositoryPort


@dataclass(frozen=True, slots=True)
class DisplayProjection:
    display_name: str
    display_name_chain: tuple[str, ...]


PERSON_ROLE_LABELS = {"person/customer": "Customer", "person/traveller": "Traveller"}
ORGA_ROLE_LABELS = {
    "organisation/airline": "Airline",
    "organisation/accommodation": "Accommodation",
    "organisation/mobility": "Mobility",
    "organisation/water-transport": "Water transport",
    "organisation/experience": "Experience",
    "organisation/protection": "Protection",
}
ROOM_TYPE_LABELS = {
    "room/single": "Single room",
    "room/double": "Double room",
    "room/twin": "Twin room",
    "room/triple": "Triple room",
    "room/family": "Family room",
    "room/adjoining": "Adjoining rooms",
    "room/suite": "Suite",
    "room/cabin": "Cabin",
}


def _properties(entity: ValidatedEntity) -> dict[str, object]:
    return entity.properties.model_dump(by_alias=True)


def person(entity: ValidatedEntity) -> DisplayProjection:
    properties = _properties(entity)
    label = f"{properties['givenName']} {properties['familyName']}".strip()
    return DisplayProjection(label, (label,))


def person_role(entity: ValidatedEntity, owner: ValidatedEntity) -> DisplayProjection:
    label = PERSON_ROLE_LABELS.get(entity.type or "")
    if label is None:
        raise InvalidEntityGraphError(entity.entity_id, f"unsupported PersonRole type {entity.type}")
    return DisplayProjection(label, (*person(owner).display_name_chain, label))


def organisation(entity: ValidatedEntity) -> DisplayProjection:
    label = str(_properties(entity)["name"]).strip()
    return DisplayProjection(label, (label,))


def orga_role(entity: ValidatedEntity, owner: ValidatedEntity) -> DisplayProjection:
    label = ORGA_ROLE_LABELS.get(entity.type or "")
    if label is None:
        raise InvalidEntityGraphError(entity.entity_id, f"unsupported OrgaRole type {entity.type}")
    return DisplayProjection(label, (*organisation(owner).display_name_chain, label))


def _product_ancestry(repository: EntityRepositoryPort, entity: ValidatedEntity) -> tuple[ValidatedEntity, ...]:
    chain = [entity]
    seen = {entity.entity_id}
    current = entity
    while True:
        parents = repository.get_product_parents(current.entity_id)
        if len(parents) > 1:
            raise InvalidEntityGraphError(entity.entity_id, f"product {current.entity_id} has multiple CONTAINS parents")
        if not parents:
            break
        parent = parents[0]
        if parent.entity_id in seen:
            raise InvalidEntityGraphError(entity.entity_id, "product CONTAINS ancestry contains a cycle")
        seen.add(parent.entity_id)
        chain.append(parent)
        current = parent
    chain.reverse()
    return tuple(chain)


def _supplier_role(repository: EntityRepositoryPort, product: ValidatedEntity) -> ValidatedEntity | None:
    roles = repository.list_related(
        from_kind=EntityKind.TOURISTIC_PRODUCT_ITEM,
        from_id=product.entity_id,
        relationship=RelationshipType.SUPPLIED_BY,
        to_kind=EntityKind.ORGA_ROLE,
    )
    if len(roles) > 1:
        raise InvalidEntityGraphError(product.entity_id, "product has multiple suppliers")
    return roles[0] if roles else None


def _product_label(entity: ValidatedEntity, supplier: ValidatedEntity | None) -> str:
    properties = _properties(entity)
    if entity.type == "product/airline/flight":
        if supplier is None or supplier.type != "organisation/airline":
            raise InvalidEntityGraphError(entity.entity_id, "flight requires one supplying airline role")
        designator = _properties(supplier).get("airlineDesignator")
        if not designator:
            raise InvalidEntityGraphError(entity.entity_id, "supplying airline role has no airlineDesignator")
        return f"{designator}{properties['flightNumber']} {properties['departureLocationCode']}–{properties['arrivalLocationCode']}"
    if entity.type == "product/airline/flight/seat":
        return str(properties["seatNumber"])
    if entity.type == "product/accommodation/room-type":
        code = str(properties["roomTypeCode"])
        try:
            return ROOM_TYPE_LABELS[code]
        except KeyError as exc:
            raise InvalidEntityGraphError(entity.entity_id, f"unsupported roomTypeCode {code}") from exc
    if entity.type == "product/accommodation/room-type/room":
        return str(properties["roomNumber"])
    name = properties.get("name")
    if not isinstance(name, str) or not name.strip():
        raise InvalidEntityGraphError(entity.entity_id, "product type requires name")
    return name.strip()


def product(
    entity: ValidatedEntity,
    product_repository: EntityRepositoryPort,
    partner_repository: EntityRepositoryPort,
) -> DisplayProjection:
    ancestry = _product_ancestry(product_repository, entity)
    root = ancestry[0]
    root_supplier = _supplier_role(product_repository, root)

    # Supplier is a property of each product, not inherited product identity.
    # A multi-leg itinerary may contain flights operated by different airlines;
    # each flight therefore uses its own supplier to compute its designator.
    labels = [_product_label(item, _supplier_role(product_repository, item)) for item in ancestry]
    prefix: list[str] = []
    if root_supplier is not None:
        owner = partner_service.get_organisation_for_role(partner_repository, root_supplier.entity_id)
        prefix.extend(orga_role(root_supplier, owner).display_name_chain)
    return DisplayProjection(labels[-1], tuple(prefix + labels))
