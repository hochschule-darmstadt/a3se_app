# DR-0028: Unify advisor routing in LangGraph

- Status: proposed
- Date: 2026-09-17
- Deciders: project owner and architecture
- Supersedes: DR-0026 in part

## Context

The customer browser previously selected grounded Q&A or travel composition from keyword patterns. A narrative travel request could therefore be treated as a RAG question instead of a request to compose Individual Travel. That browser decision cannot reliably interpret a complete conversation, corrections, or short replies.

## Decision drivers

- classify the complete conversation rather than isolated trigger words;
- preserve bounded read-only RAG and client-draft composition authorities;
- retain explicit sign-in, no-reservation, and no-order boundaries;
- stream a grounded answer after its server-side route is selected.

## Considered options

- Extend the browser keyword list: rejected because it remains brittle and puts business routing in presentation logic.
- Send a client classifier request before choosing an endpoint: rejected because it adds a client-controlled routing boundary.
- Route every message through one backend LangGraph workflow: selected.

## Decision

The local model produces structured output for the complete conversation, including `request_kind` (`advice` or `compose`). The first node of the unified LangGraph workflow uses that value to choose either the grounded RAG branch or the bounded client-draft composition branch. The Customer Interaction browser sends every message to `POST /advisor/respond/stream`; it performs no intent keyword classification.

The RAG branch retrieves and generates after the graph selects it, then streams its generated chunks through the open response. The composition branch returns one typed completion event, may ask for missing facts, and emits only client-side draft actions. An unsigned composition request yields the sign-in requirement before StockItem access or actions. Neither branch may reserve, order, access repositories directly, execute raw Cypher, access external providers, or perform payment operations.

## Consequences

### Positive

- Narrative requests and short follow-ups are classified from their complete conversation by the local model.
- One graph owns the message-routing policy; the browser cannot silently diverge.
- Grounded-answer streaming remains available after RAG routing.

### Negative and risks

- Classification precedes retrieval and the first streamed RAG chunk, so it may jeopardize [NFR-002](../../requirements/non-functional-requirements.md). No compliance claim is made before measurement under the agreed load profile.
- `isAuthenticated` currently comes from the existing mock Customer Interaction contract. It must be replaced by a server-authenticated principal before it is treated as production authorization evidence.

## Validation and revisit triggers

Test narrative composition, a short composition follow-up, RAG advice retrieval and streaming, unsigned composition, model unavailability, and no-action/no-reservation behavior. Measure first content-bearing response timing against NFR-002. Revisit streaming or orchestration if that evidence fails.

## Links

- [DR-0024](0024-local-grounded-advisor-stack.md)
- [DR-0026](0026-use-langgraph-for-client-draft-travel-composition.md)
- [FR-008](../../requirements/functional-requirements.md)
- [FR-009](../../requirements/functional-requirements.md)
- [FR-018](../../requirements/functional-requirements.md)
- [UC-001](../../requirements/use-cases/uc-001-seek-travel-advice.md)
