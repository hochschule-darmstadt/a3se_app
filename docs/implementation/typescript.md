# TypeScript

- Status: accepted
- Owner: Implementation
- Last reviewed: 2026-08-05

This guide supplements [Clean Code](clean-code.md). TypeScript is selected by [DR-0010](../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md) for both web applications.

## Implementation rules

- `strict` shall be enabled. Strictness options shall not be weakened globally to accommodate individual code.
- `any` is prohibited in authored application code. Use `unknown` at uncertain boundaries and narrow it explicitly.
- Domain alternatives and state machines should use discriminated unions with exhaustive handling. Public data should be immutable unless mutation is intentional and owned.
- Transport types shall be generated from the OpenAPI contract or mapped explicitly; they shall not become domain models by convenience.
- Public exports shall be deliberate. Barrel files shall not expose module internals or create dependency cycles.
- Type assertions and non-null assertions shall be local, justified, and preceded by a check wherever possible.

## Documentation notation

- Exported components, hooks, functions, types, and constants whose contract is not self-evident shall use `/** ... */` TSDoc-compatible comments.
- Documentation shall describe semantic constraints, side effects, errors, generic parameters, and a usage example where needed. It shall not duplicate types already visible in the signature.
- Use standard tags such as `@param`, `@returns`, `@throws`, `@typeParam`, and `@example`; custom tags require a documented tool configuration.

## Verification

The frontend quality gate shall run strict type checking independently of the production build, linting, formatting verification, unit and interaction tests, and the application build.

## Primary references

- [TypeScript `strict`](https://www.typescriptlang.org/tsconfig/strict.html)
- [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
- [TSDoc specification](https://tsdoc.org/)
