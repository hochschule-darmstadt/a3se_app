"""Dependency providers reading composed, module-scoped repositories from app state.

`request.app.state.dependencies` is set once by `backend/scripts/serve.py` (the
only place in the repository that wires cct.infrastructure to cct.api) or, in
tests, by `app.dependency_overrides`. This module never imports
cct.infrastructure.
"""

from __future__ import annotations

from dataclasses import dataclass

from fastapi import Request

from cct.resource_management.repository_ports import EntityRepositoryPort


@dataclass(frozen=True, slots=True)
class Actor:
    """Placeholder authorization context.

    No authentication/authorization mechanism is selected yet (DR-0013).
    Every mutating route depends on this so a real mechanism can replace it
    later without changing route signatures. It trusts any caller today and
    must not be mistaken for production access control.
    """

    id: str = "system"


@dataclass(frozen=True, slots=True)
class ApiDependencies:
    """Bundle of module-scoped repositories, composed once outside cct.api."""

    person_repository: EntityRepositoryPort
    partner_repository: EntityRepositoryPort
    product_repository: EntityRepositoryPort
    stock_repository: EntityRepositoryPort
    order_repository: EntityRepositoryPort


def get_current_actor() -> Actor:
    return Actor()


def get_person_repository(request: Request) -> EntityRepositoryPort:
    return request.app.state.dependencies.person_repository


def get_partner_repository(request: Request) -> EntityRepositoryPort:
    return request.app.state.dependencies.partner_repository


def get_product_repository(request: Request) -> EntityRepositoryPort:
    return request.app.state.dependencies.product_repository


def get_stock_repository(request: Request) -> EntityRepositoryPort:
    return request.app.state.dependencies.stock_repository


def get_order_repository(request: Request) -> EntityRepositoryPort:
    return request.app.state.dependencies.order_repository
