"""Backend-owned searchable projection for StockItems."""

from __future__ import annotations

from cct.resource_management.contracts import EntityKind
from cct.resource_management.repository_ports import EntityRepositoryPort
from cct.resource_management.touristic_product_management.search import LOCATION_TERMS, build_product_search_text


def build_search_text(
    product_repository: EntityRepositoryPort,
    partner_repository: EntityRepositoryPort | None,
    product_id: str,
) -> str:
    """Build normalized search text from the product chain and supplier context."""
    return build_product_search_text(product_repository, partner_repository, product_id)
