"""Consistent error mapping from domain exceptions to HTTP responses.

Validation, business, conflict, and infrastructure outcomes are distinguished
without leaking internals (tracebacks, driver messages) to the caller.
"""

from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError as PydanticValidationError

from cct.resource_management.errors import (
    DependentEntityExistsError,
    DuplicateEntityError,
    EntityNotFoundError,
    InvalidReferenceError,
)

from .schemas import ErrorResponse


def _respond(status_code: int, error_type: str, title: str, detail: str) -> JSONResponse:
    body = ErrorResponse(type=error_type, title=title, detail=detail)
    return JSONResponse(status_code=status_code, content=body.model_dump(by_alias=True))


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(EntityNotFoundError)
    async def handle_not_found(request: Request, exc: EntityNotFoundError) -> JSONResponse:
        return _respond(404, "not_found", "Resource not found", str(exc))

    @app.exception_handler(DuplicateEntityError)
    async def handle_duplicate(request: Request, exc: DuplicateEntityError) -> JSONResponse:
        return _respond(409, "duplicate", "Resource already exists", str(exc))

    @app.exception_handler(DependentEntityExistsError)
    async def handle_dependent(request: Request, exc: DependentEntityExistsError) -> JSONResponse:
        return _respond(409, "conflict", "Cannot delete: dependent relationships exist", str(exc))

    @app.exception_handler(InvalidReferenceError)
    async def handle_invalid_reference(request: Request, exc: InvalidReferenceError) -> JSONResponse:
        return _respond(422, "invalid_reference", "Invalid reference", str(exc))

    @app.exception_handler(RequestValidationError)
    async def handle_request_validation(request: Request, exc: RequestValidationError) -> JSONResponse:
        return _respond(422, "validation_failed", "Request validation failed", str(exc.errors()))

    @app.exception_handler(PydanticValidationError)
    async def handle_domain_validation(request: Request, exc: PydanticValidationError) -> JSONResponse:
        return _respond(422, "validation_failed", "Request validation failed", str(exc.errors()))

    @app.exception_handler(ValueError)
    async def handle_value_error(request: Request, exc: ValueError) -> JSONResponse:
        return _respond(422, "validation_failed", "Request validation failed", str(exc))

    @app.exception_handler(PermissionError)
    async def handle_permission_error(request: Request, exc: PermissionError) -> JSONResponse:
        # Only raised by a wiring bug (ScopedEntityRepository misconfiguration),
        # never by caller input -- 500, not a client error.
        return _respond(500, "infrastructure_error", "Internal configuration error", "an internal error occurred")

    @app.exception_handler(Exception)
    async def handle_unexpected(request: Request, exc: Exception) -> JSONResponse:
        return _respond(500, "infrastructure_error", "Internal server error", "an unexpected error occurred")
