# Local Development

- Status: accepted
- Owner: Development/Operations
- Last reviewed: 2026-09-18

This runbook starts the local proof-of-concept environment for browser
inspection. It uses Docker Compose for Neo4j and the API, and the React Router
development servers for the Customer and Staff applications.

## Prerequisites

- Docker Desktop is running and the Docker daemon is reachable.
- Node.js 22 is installed.
- Dependencies are installed from the repository root:

  ```powershell
  npm install
  ```

The root `.env` file supplies the synthetic local Neo4j password. Do not use
production credentials or customer data.

## Start the backend

From the repository root:

```powershell
docker compose up -d --build api
```

The API computes a manifest at startup. It automatically seeds the empty local
graph on first use, and reseeds when a seed JSON file or seed/index logic
changes. It rebuilds the advisor index when its indexed inputs, index logic,
model, or schema version changes. Unchanged fingerprints reuse the persisted
`neo4j-data`, `advisor-index`, and `advisor-state` volumes. The build command
must run before startup after backend source changes so the container contains
the changed logic. `CCT_FORCE_SEED=1` forces the same reset, reseed, and index
rebuild behavior.

`docker compose restart api` only restarts the existing image; it does not copy
new backend source into the container. Use `docker compose up -d --build api`
after changes under `backend/`. A plain restart is appropriate only when the
image is already current and the process needs to be restarted. Verify the
running container with `docker compose ps api` and, when relevant, an affected
API response instead of assuming that a successful restart deployed source
changes.

For a deliberate explicit reseed, use the profile-gated job:

```powershell
docker compose --profile seed run --rm seed-reset
```

The `api`, `seed`, and `seed-reset` services share the explicit
`cct-backend:local` image tag and the advisor volumes. Every seed invocation
starts fresh; it never migrates or merges retained records. This automatic
refresh is intentionally a local-development convenience and can discard
staff-created local records when seed inputs or seed logic change.

## Start the browser applications

Open two terminals. From the repository root, run:

```powershell
cd frontend/apps/customer
npx react-router dev --host 127.0.0.1 --port 4300
```

```powershell
cd frontend/apps/staff
npx react-router dev --host 127.0.0.1 --port 4301
```

Inspect the applications at:

- Customer: <http://127.0.0.1:4300/>
- Staff: <http://127.0.0.1:4301/>
- API documentation: <http://127.0.0.1:8000/docs>
- Neo4j Browser: <http://127.0.0.1:7474/>

The frontend applications default to the API at
`http://127.0.0.1:8000`. The API currently has no `/health` route; use the
Compose status and the application/API responses to verify availability.

## Stop the environment

Stop each frontend with `Ctrl+C`, then stop the backend from the repository
root:

```powershell
docker compose down
```

This preserves the named `neo4j-data` volume. Do not use `docker compose down
-v` unless an explicit local data reset is intended.

The `seed` command already performs the reset. The equivalent compatibility
alias for a deliberate reset and reload is:

```powershell
docker compose --profile seed run --rm seed-reset
```
