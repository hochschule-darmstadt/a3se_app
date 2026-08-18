"""FastAPI application factory.

`create_app()` takes no required arguments: `app.state.dependencies` is unset
until `backend/scripts/serve.py` sets it (or a test overrides individual
dependencies), and OpenAPI schema generation never executes a route handler
or a `Depends(...)` callable, so schema export needs no live database.
"""

from __future__ import annotations

from fastapi import FastAPI

from . import orders, organisations, persons, products, stock_items
from .errors import register_exception_handlers


def create_app() -> FastAPI:
    app = FastAPI(
        title="Christopher Columbus Travel API",
        version="0.1.0",
        description="Shared capability-oriented API reused by Customer and Staff Interaction.",
    )
    register_exception_handlers(app)
    app.include_router(persons.router)
    app.include_router(organisations.router)
    app.include_router(products.router)
    app.include_router(stock_items.router)
    app.include_router(orders.router)
    return app
