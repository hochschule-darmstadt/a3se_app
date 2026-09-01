"""FastAPI application factory.

`create_app()` takes no required arguments: `app.state.dependencies` is unset
until `backend/scripts/serve.py` sets it (or a test overrides individual
dependencies), and OpenAPI schema generation never executes a route handler
or a `Depends(...)` callable, so schema export needs no live database.
"""

from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import incoming_references, orders, organisations, persons, products, stock_items
from .errors import register_exception_handlers

# The Customer (port 4300) and Staff (port 4301) Vite dev servers (#22) are a
# different browser origin than this API's own host:port, so every browser
# request needs an explicit CORS allow-list -- without it, no route works
# from either frontend app despite curl/pytest never observing the failure
# (CORS is enforced by the browser, not the server). No credentials
# (cookies/auth headers) are sent (DR-0013's Actor is a placeholder), so a
# fixed local dev-origin allow-list is sufficient; it does not need to widen
# to a wildcard or reflect arbitrary origins.
DEFAULT_ALLOWED_ORIGINS = (
    "http://127.0.0.1:4300,http://localhost:4300,http://127.0.0.1:4301,http://localhost:4301,"
    "http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:5174,http://localhost:5174"
)


def create_app() -> FastAPI:
    app = FastAPI(
        title="Christopher Columbus Travel API",
        version="0.1.0",
        description="Shared capability-oriented API reused by Customer and Staff Interaction.",
    )
    allowed_origins = os.environ.get("CCT_API_ALLOWED_ORIGINS", DEFAULT_ALLOWED_ORIGINS).split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["Content-Type"],
    )
    register_exception_handlers(app)
    app.include_router(persons.router)
    app.include_router(organisations.router)
    app.include_router(products.router)
    app.include_router(stock_items.router)
    app.include_router(incoming_references.router)
    app.include_router(orders.router)
    return app
