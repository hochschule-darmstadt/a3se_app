# FastAPI

- Status: accepted
- Owner: Implementation
- Last reviewed: 2026-08-05

This guide supplements [Clean Code](clean-code.md), [Python](python.md), [Pydantic](pydantic.md), and [OpenAPI](openapi.md). FastAPI is the selected HTTP adapter.

## Implementation rules

- An `APIRouter` shall group endpoints by interaction or integration boundary. Endpoint functions shall remain thin and invoke provided application interfaces through explicit dependencies.
- Endpoints shall not contain domain rules, Cypher, persistence transactions, or direct access to another module's internals.
- Request and response models shall be explicit and distinct where their semantics differ. Every endpoint shall declare its response model, success status, known errors, authorisation dependency, and stable operation identifier.
- Dependency injection shall provide application interfaces, actor context, and infrastructure resources. It shall not become a service locator available to domain code.
- Shared resources shall be created and released through application lifespan management. Blocking libraries shall not be called directly from asynchronous endpoints.
- Validation, business, authorisation, conflict, and infrastructure errors shall map consistently without exposing traces or internal messages.
- Agent endpoints and tools shall use the same authorised module operations as conventional interactions and shall never expose general database query execution.

## Documentation notation

Endpoint summaries, descriptions, parameter descriptions, response schemas, examples, deprecation state, tags, and security requirements shall be supplied through FastAPI metadata and Pydantic schema metadata so that generated OpenAPI is useful without duplicating a manual API reference. Python docstrings shall explain non-obvious orchestration and operational constraints.

## Verification

Tests shall override dependencies explicitly and cover validation, authorisation, error mapping, response filtering, OpenAPI generation, and representative integration with application interfaces.

## Primary references

- [FastAPI larger applications](https://fastapi.tiangolo.com/tutorial/bigger-applications/)
- [FastAPI response models](https://fastapi.tiangolo.com/tutorial/response-model/)
- [FastAPI dependencies](https://fastapi.tiangolo.com/tutorial/dependencies/)
