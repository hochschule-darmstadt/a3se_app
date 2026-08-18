# Frontend cross-application tests

This location holds browser-level end-to-end tests (Playwright, `./e2e/`)
that exercise a full app against the real backend and seeded data. Component
and route unit tests belong beside the feature they verify (Vitest +
React Testing Library), not here. See
[DR-0015](../../docs/governance/decisions/0015-frontend-thin-slice-testing-i18n-and-catalog-listing.md)
for the frontend test-stack decision.

Run `npm run frontend:test:e2e` from the repository root. It starts the
Customer app (port 4300) and Staff app (port 4301) dev servers itself, but
expects the backend API and a seeded Neo4j instance already running
separately (`docker compose up`, then `docker compose --profile seed run
seed`, per DR-0014) -- these specs call the real API, never a mock.
