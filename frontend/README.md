# Frontend Workspace

The npm workspace contains two independent React Router v7 Framework Mode applications:

- `apps/customer`: Customer Interaction (MOD-CI)
- `apps/staff`: Staff Interaction (MOD-SI)

Both applications are client-rendered SPAs and consume shared packages:

- `packages/api-client`: transport-client boundary; generated OpenAPI code will be introduced by its owning issue
- `packages/ui`: Mantine provider, semantic theme foundation, and shared accessible primitives

Feature code belongs inside the application that owns the user interaction. Reuse is promoted only after a stable shared contract exists. The workspace uses npm because the repository already had npm tooling and a lockfile. All selected packages use permissive zero-cost licences recorded in the [project-structure view](../docs/architecture/software-architecture/project-structure.md).

Run `npm run frontend:typecheck` and `npm run frontend:build` from the repository root.
