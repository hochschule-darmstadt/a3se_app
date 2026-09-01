# Local Development

- Status: accepted
- Owner: Development/Operations
- Last reviewed: 2026-09-01

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
docker compose up -d
docker compose --profile seed run --rm seed
```

The first command starts Neo4j and the API. The second clears the disposable
local graph and loads the deterministic synthetic inspection data from
scratch. Every seed invocation starts fresh; it never migrates or merges with
retained records. Seeding is explicit and is not part of ordinary startup.

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
