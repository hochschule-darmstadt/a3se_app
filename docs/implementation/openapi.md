# OpenAPI

- Status: accepted
- Owner: Implementation
- Last reviewed: 2026-08-05

This guide supplements [Clean Code](clean-code.md). The FastAPI-generated OpenAPI description is the authoritative machine-readable HTTP contract.

## Contract rules

- Operations shall cover required create, read, update, and delete functionality through domain-oriented resources and module capabilities. They shall not expose generic graph-node or relationship CRUD that bypasses module ownership and business invariants.
- Every operation shall have a stable unique `operationId`, domain-oriented tags, a concise summary, request and response schemas, explicit status codes, security requirements, and documented error responses.
- Schema names and fields shall use glossary terminology. Units, formats, nullability, optionality, constraints, and closed vocabularies shall be machine-readable where OpenAPI supports them.
- A consistent error schema shall preserve the distinction between validation, business, authorisation, conflict, and infrastructure outcomes without exposing internals.
- Incompatible contract changes require explicit versioning and migration. Compatible additions shall still be reviewed against generated-client behaviour.
- Synthetic examples shall cover representative normal and error cases. Personal or secret data is prohibited.
- TypeScript clients shall be generated reproducibly from the validated contract. Generated client code shall not be edited by hand.

## Documentation notation

FastAPI metadata and Pydantic schema metadata are the source for operation and schema documentation. Markdown descriptions may explain semantics, but shall link to requirements instead of copying business rules into the API contract.

## Verification

CI shall validate the OpenAPI document, detect contract changes, regenerate clients reproducibly, and run provider and consumer contract tests. An unexplained breaking change shall fail the gate.

## Primary reference

- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
