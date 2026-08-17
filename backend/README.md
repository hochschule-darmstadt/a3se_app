# CCT Backend

The installable Python distribution uses the `src` layout and the import package `cct`, meaning Christopher Columbus Travel. Source is organised by accepted architecture module rather than global controller/service/model/repository folders.

- `api`: shared FastAPI transport adapter boundary; internal route grouping remains deferred
- `core_processes`: Core Business Process modules
- `resource_management`: five independently owned Resources modules beneath one clearly named layer namespace
- `infrastructure`: technology adapters, including Neo4j

Runtime composition and any future agent-tool adapter will be introduced only
when a concrete implementation issue requires them.

No business behavior, FastAPI application, Neo4j query, schema, or seed implementation belongs to issue #19. Run `npm run backend:check` from the repository root for import compilation and architecture tests.
