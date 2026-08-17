# Backend Tests

Tests are separate from installable source and grouped by risk:

- `architecture`: static module/import constraints
- `unit`: isolated domain/application behavior
- `integration`: Neo4j and cross-adapter behavior
- `api`: FastAPI/OpenAPI contracts

Issue #19 provides executable architecture checks only. Later issues add behavior tests alongside implementation. Run all current checks with `npm run backend:check`.
