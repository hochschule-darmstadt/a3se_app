"""Shared searchable projection for products and their business context."""

from __future__ import annotations

from cct.resource_management.contracts import EntityKind, ValidatedEntity
from cct.resource_management.partner_management import service as partner_service
from cct.resource_management.relationship_types import RelationshipType
from cct.resource_management.repository_ports import EntityRepositoryPort


LOCATION_TERMS: dict[str, tuple[str, ...]] = {
    "BER": ("Berlin", "Germany"),
    "FRA": ("Frankfurt", "Frankfurt am Main", "Germany"),
    "MUC": ("Munich", "Germany"),
    "LIM": ("Lima", "Peru"),
    "CUZ": ("Cusco", "Peru"),
    "GIG": ("Rio de Janeiro", "Brazil"),
    "GRU": ("Sao Paulo", "Brazil"),
    "SCL": ("Santiago", "Chile"),
    "EZE": ("Buenos Aires", "Argentina"),
    "BOG": ("Bogota", "Colombia"),
    "UIO": ("Quito", "Ecuador"),
    "PUQ": ("Punta Arenas", "Chile"),
}


def _text_values(entity: ValidatedEntity) -> list[str]:
    values: list[str] = [entity.entity_id, entity.type or ""]
    for value in entity.properties.model_dump(by_alias=True).values():
        if isinstance(value, (str, int, float)):
            values.append(str(value))
            location_terms = LOCATION_TERMS.get(str(value).upper())
            if location_terms:
                values.extend(location_terms)
            if isinstance(value, str) and value.casefold() == "lima":
                values.append("Peru")
    return values


def build_product_search_text(
    product_repository: EntityRepositoryPort,
    partner_repository: EntityRepositoryPort | None,
    product_id: str,
) -> str:
    """Build normalised text from product ancestry and supplier context."""
    product = product_repository.get(EntityKind.TOURISTIC_PRODUCT_ITEM, product_id)
    if product is None:
        return product_id.casefold()

    chain = (*product_repository.get_ancestors(product_id), product)
    entities: list[ValidatedEntity] = list(chain)
    root = chain[0]
    supplier_roles = product_repository.list_related(
        from_kind=EntityKind.TOURISTIC_PRODUCT_ITEM,
        from_id=root.entity_id,
        relationship=RelationshipType.SUPPLIED_BY,
        to_kind=EntityKind.ORGA_ROLE,
    )
    entities.extend(supplier_roles)
    for role in supplier_roles:
        if partner_repository is None:
            continue
        organisation = partner_service.get_organisation_for_role(partner_repository, role.entity_id)
        if organisation is not None:
            entities.append(organisation)
    return " ".join(term for entity in entities for term in _text_values(entity)).casefold()
