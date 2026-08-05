# Vite

- Status: accepted
- Owner: Implementation
- Last reviewed: 2026-08-05

This guide supplements [Clean Code](clean-code.md). Vite is the selected frontend build foundation.

## Implementation rules

- Customer and Staff Interaction shall use a shared, minimal base configuration while retaining separate application entry points and builds.
- Configuration shall be typed. Plugins shall be introduced only for a demonstrated need and shall pass the dependency and licence gate.
- Browser environment variables shall be explicitly declared and validated. Values are strings until parsed.
- Every `VITE_` variable shall be considered public because its value is bundled into client code. Secrets and private service credentials are prohibited.
- Local environment files containing machine-specific or sensitive values shall remain untracked. A safe example file shall document required variables.
- Aliases shall improve stable imports but shall not bypass architecture-module visibility.
- `vite preview` shall be used only to inspect a build locally, never as the production server.

## Documentation notation

The configuration shall document each mode, public environment variable, build entry point, output, and non-obvious plugin through concise TypeScript comments and the relevant operational guide. Comments shall explain intent rather than restate configuration syntax.

## Verification

Both applications shall build reproducibly from a clean checkout. The gate shall detect accidentally exposed secrets, unexpected bundle growth, and unresolved or circular imports.

## Primary references

- [Vite environment variables and modes](https://vite.dev/guide/env-and-mode)
- [Vite build guide](https://vite.dev/guide/build)
- [Vite CLI](https://vite.dev/guide/cli)
