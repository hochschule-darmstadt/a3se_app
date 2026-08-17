# HTTP API Adapter

Shared FastAPI transport boundary. Both frontend applications consume capability-oriented operations from this API. Its internal grouping is deliberately deferred until #21 defines concrete contracts; it shall not be divided merely by frontend identity.

Handlers may depend on public Core Process or Resource Management interfaces. They shall not contain domain rules, import another module's internals, or use Neo4j directly.
