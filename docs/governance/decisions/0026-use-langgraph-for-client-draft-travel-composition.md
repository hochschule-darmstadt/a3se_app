# DR-0026: Use LangGraph for client-draft travel composition

- Status: accepted
- Date: 2026-09-15
- Deciders: project owner and architecture
- Supersedes: none

## Context

Issue #47 extends the existing grounded advisor with multi-step intent
interpretation, bounded catalogue/stock reads, deterministic itinerary
validation, and client-side draft actions. The existing RAG path must remain
fast and read-only. The feature has no server-side draft: the browser owns the
editable My Travel composition, and only the existing customer Order control
may submit it.

## Decision

Use LangGraph as the MVP orchestration framework inside the Python modular
monolith. The first graph has explicit nodes for intent completeness,
controlled candidate selection, deterministic itinerary validation, and
client-action emission. Candidate selection is injected and may consider only
authoritative results already returned by existing API/module operations.

Do not expose repositories, Neo4j, arbitrary Cypher, external providers, or
`/orders/place` to the graph. The graph is stateless for this feature and
returns typed actions/diagnostics; the frontend applies valid actions to its
session-backed TravelProvider. LangChain is optional adapter infrastructure,
not a required second orchestration layer. MCP remains deferred because the
existing authenticated API is the current boundary.

## Consequences

- Graph control flow, retries, and future checkpointing have a named extension
  point without turning business rules into prompt instructions.
- The deterministic validator remains independently testable and authoritative.
- LangGraph becomes a runtime dependency and must be included in backend
  installation and proof-of-concept checks.
- Candidate search and natural-language intent extraction are still integration
  work; this decision does not permit invented availability or automatic final
  ordering.

## Validation and revisit triggers

The proof of concept must demonstrate graph compilation, typed state transfer,
candidate restriction, invalid-itinerary diagnostics, client-action output,
and preservation of the no-server-draft/no-final-order boundary. Reconsider
the choice if dependency cost, latency, failure recovery, observability, or
state serialization cannot meet the requirements.

## Links

- [Issue #47](https://github.com/hochschule-darmstadt/a3se_app/issues/47)
- [DR-0010: Python-centred modular technology stack](0010-adopt-python-centered-modular-technology-stack.md)
- [DR-0024: Local grounded advisor stack](0024-local-grounded-advisor-stack.md)
