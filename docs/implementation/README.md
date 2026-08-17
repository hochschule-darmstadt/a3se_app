# Implementation Harness

- Status: accepted
- Owner: Implementation
- Last reviewed: 2026-08-05

This area defines the normative implementation harness for the technologies selected by [DR-0010](../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md). It supplements, but does not override, requirements or the accepted [software architecture](../architecture/software-architecture/software-architecture.md).

## Reading path

1. Read [Clean Code](clean-code.md) for the cross-technology rules.
2. Read the guides for every language and technology touched by the change.
3. Read the selecting decision and the relevant architecture module before implementation.

## Guides

| Scope | Guide |
|---|---|
| Cross-technology code quality | [Clean Code](clean-code.md) |
| Frontend language | [TypeScript](typescript.md) |
| UI library | [React](react.md) |
| Application routing | [React Router](react-router.md) |
| Frontend build | [Vite](vite.md) |
| UI component foundation | [Mantine](mantine.md) |
| HTTP contract | [OpenAPI](openapi.md) |
| HTTP adapter | [FastAPI](fastapi.md) |
| Backend language | [Python](python.md) |
| Runtime contracts | [Pydantic](pydantic.md) |
| Graph persistence | [Neo4j](neo4j.md) |

The concrete repository layout, module-to-directory mapping, and dependency
boundaries are architecture concerns defined in the
[project-structure view](../architecture/software-architecture/project-structure.md).

Cross-cutting rules are authoritative only in `clean-code.md`. Technology guides link to those rules and define only idiomatic mechanisms, notation, and checks. A technology guide must not copy a general rule merely to make the file self-contained.

The guides prescribe capabilities where a concrete supporting tool is not yet selected. Adding a mandatory formatter, linter, test framework, package manager, client generator, or similar dependency requires the applicable decision and the zero-cost licence check required by NFR-003.
