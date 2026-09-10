# AI Assistance Architecture Proposal

- Status: accepted
- Owner: Architecture/Requirements
- Last reviewed: 2026-09-10

This is the accepted Phase 1 and implementation architecture for issue #46.
The technology choice is recorded in [DR-0024](../governance/decisions/0024-local-grounded-advisor-stack.md).

## Intended MVP outcome

The Customer Interaction Automated Travel Advisor answers a bounded set of
travel questions using facts retrieved from the current synthetic catalogue and
approved project content. It identifies when evidence is insufficient and
never presents an uncertain result as a confirmed fact.

Structured search remains a separate discovery interaction. The advisor does
not become a general-purpose chatbot.

## Concrete technology proposal

### Language model and runtime

Select **`qwen3:8b`, quantised, served by Ollama** as the baseline model. Ollama
provides a local HTTP API and Qwen3 supports structured tool calling, which
keeps the same model boundary usable by #47. A developer with insufficient
memory may select **`qwen3:4b`** through the same configuration interface as a
documented fallback; 8B remains the acceptance and evaluation baseline.

The expected developer setup is Ollama plus one locally downloaded model. The
Compose Ollama service requests `gpus: all`; with a configured NVIDIA Docker
runtime, Qwen3 uses the developer GPU, while CPU remains the fallback outside
that runtime. No
customer prompt or catalogue content leaves the developer machine. The
application must fail clearly to `failed` when Ollama is unavailable; it must
not silently call a hosted provider. Temperature is `0`, tool calls are
disabled for #46, and the answer contract is validated before the response is
shown.

This model is selected for the proof of concept because it is small enough for
ordinary developer hardware while being in the Qwen3 family whose Ollama
integration supports tool calls needed by #47. It is not a claim that local 8B
quality is production-grade; the evaluation set below is a release gate.

### Embeddings and vector store

Select **`sentence-transformers/all-MiniLM-L6-v2`** through the Qdrant client's
local embedding support. It is an English, 384-dimensional, Apache-2.0 model
and is small enough for local CPU execution. British English is the current
required interaction language, so multilingual embeddings are not justified by
the current requirements.

Select **Qdrant** for the semantic index. In development and automated tests it
runs in the Python client in on-disk local mode; the initial Compose deployment
may run the same collection in a Qdrant container without changing the
retriever contract. This avoids requiring a second service for every developer
while retaining a clean migration path. Qdrant is an index, never the source
of truth.

Do not add LangChain or a general agent framework. The repository already has
explicit FastAPI/Pydantic boundaries, and a small typed adapter is easier to
test, audit, and reuse from #47.

### Proposed module boundary

Add a bounded `MOD-ADVISOR` application capability in the Python modular
monolith:

```text
Customer Interaction (MOD-CI)
        |
        v
Advisor service (MOD-ADVISOR)
   |       |          |
   |       |          +-- typed tool registry (disabled for #46)
   |       +------------- Ollama model adapter
   +--------------------- knowledge retriever
                              |        |
                              |        +-- Qdrant semantic index
                              +----------- provided catalogue/glossary/policy reads
```

`MOD-ADVISOR` owns conversation orchestration, retrieval, prompt assembly,
answer-state classification, evidence references, and model-provider
adaptation. It does not own products, inventory, orders, customer records, or
mutations. It receives those facts through provided read operations from the
owning modules. The model never receives Neo4j credentials, a repository, raw
Cypher, or a general-purpose database tool.

The #46 API is a read-only `answerQuestion` capability. #47 reuses the model
adapter, conversation state contract, evidence format, and typed tool registry,
but adds only explicitly accepted tools and confirmation gates. #47 must not
reinterpret a retrieved document as permission to perform an action.

## Proposed question scope

### In scope

- **Catalogue questions:** what a seeded travel product offers, its product
  description, supplier/category context, route or location, service dates,
  indicative price, and availability facts exposed by the catalogue
  projection.
- **Terminology questions:** meanings of approved tour-operator terms from the
  project glossary, expressed in customer-facing language.
- **Policy questions:** customer-facing policies explicitly included in an
  approved policy/content source. The advisor must retain the source label in
  its answer evidence and avoid inventing policy wording.
- **Confirmed-context questions:** explanation of facts already supplied as
  confirmed customer context, such as an order reference or current assistance
  state. This is read-only context explanation, not order management.

### Explicitly out of scope

- General knowledge, open-ended chit-chat, or questions unrelated to travel
  products and approved content sources.
- Legal, financial, medical, emergency, or regulatory advice.
- Booking, payment, stock reservation, order mutation, search execution,
  composition change, or any other customer action. Those actions belong to
  #47 and must use controlled operations.
- Unauthorised customer-specific data, raw database exploration, or answers
  based on stale or unconfirmed state.
- Replacement of the human Travel Advisor or the context-preserving handover
  path.

## Retrieval and indexing design

The Phase 2 implementation is a retrieval-grounded answer service inside the
Python modular monolith:

1. The advisor service receives a customer message and the confirmed
   interaction context allowed for that conversation.
2. A read-only knowledge adapter exposes bounded records from the sources below.
3. Retrieval first performs deterministic routing and exact filtering. It then
   uses Qdrant for semantic candidates where wording varies from the source.
4. Qwen3 receives only the top eight evidence records, each with a source ID
   and freshness metadata, plus an instruction to answer only from that
   evidence. A Pydantic response contract validates state, answer, evidence
   IDs, and uncertainty reason.
5. The HTTP adapter maps the contract to the existing `AdvisorConversation`
   surface. The frontend contains no retrieval, prompting, catalogue matching,
   or business rules.

| Source | Indexed in Qdrant | Read live at question time | Chunking / payload |
|---|---|---|---|
| Product catalogue | One record per product item: display-name chain, description, supplier/category, route/location, and stable product properties | Service dates, price, capacity, availability, and changing sales state | One product record; `sourceType`, `productId`, `productType`, `contentVersion` |
| Glossary | One record per glossary term | No | One term; term and document revision |
| Approved policy content | One record per policy section | No, unless explicitly dynamic | Section-sized chunks; policy ID, section ID, revision, effective date |
| Confirmed customer/order context | Never globally indexed | Supplied as request-scoped structured context | Not persisted in the semantic index |
| Inventory/stock | Never indexed | Always obtained through Inventory/Order read operations | No vector record; prevents stale availability/capacity answers |

The product index is for explanatory matching, not authoritative availability
or pricing. A question containing an identifier, destination, date, price, or
availability constraint invokes the corresponding exact read operation; the
answer may use only that live result for the changing fact.

### Index lifecycle

1. `advisor-index rebuild` reads approved glossary/policy files and product
   projections through owning-module read operations, canonicalises them, and
   computes a content hash for each record.
2. The command upserts changed records and deletes records whose source hash is
   absent. An index manifest stores the embedding model, collection name,
   schema version, source hash, and build timestamp.
3. Seed reset/reseed runs the rebuild after product data is loaded. A product
   create/update/delete operation schedules the same record-level upsert or
   delete after its transaction commits; a failed update marks the index stale
   and excludes that product from generated answers until rebuilt.
4. Glossary or policy changes trigger the rebuild in CI and via the local
   developer command. The API refuses to claim a source is current when the
   manifest model or schema version differs from the configured runtime.
5. Inventory changes do not trigger vector indexing because inventory is never
   indexed; live reads make those facts current by construction.

There is no background event bus in the MVP. A post-commit callback plus the
explicit rebuild command is the initial mechanism; an outbox is a later option
if update volume or reliability evidence requires it.

### Query flow

```text
message
  -> classify question and extract exact constraints
  -> exact catalogue/glossary/policy/live-context reads
  -> Qdrant semantic search over approved stable content
  -> merge, deduplicate, and require minimum evidence score
  -> Qwen3 answer contract with source IDs
  -> validate state/evidence
  -> AdvisorConversation transcript
```

The initial thresholds are testable: retrieve at most eight records, require at
least two independent matching signals for an answered catalogue question (or
one exact identifier match), and return `uncertain` or `no-answer` when the
threshold is not met. Thresholds are configuration under test, not claims
about model confidence.

## Conversational states

The advisor must expose these DS-CMP-004/009 states in the transcript:

| State | Meaning | Customer-visible next step |
|---|---|---|
| `loading` | The question is being retrieved and answered. | Wait; duplicate submission is prevented. |
| `answered` | The response is supported by retrieved evidence. | Continue or ask a follow-up. |
| `uncertain` | Evidence conflicts, is incomplete, stale, or below threshold. | Clarify or review the limitation. |
| `no-answer` | No approved source supports an answer. | Rephrase, use structured search, or request human assistance. |
| `handover` | The question is outside authority or needs human judgement. | Continue through the existing handover path. |
| `failed` | The service or an approved source was unavailable. | Retry or request human assistance; no answer is implied. |

Only `answered` may state a catalogue or policy fact as supported. The other
states must not be rendered as successful answers. The last confirmed journey
context remains unchanged in every state.

## Acceptance checklist for this proposal

- **Model:** accept `qwen3:8b` via Ollama, with `qwen3:4b` as the low-resource
  fallback.
- **Embeddings:** accept `all-MiniLM-L6-v2` locally.
- **Vector store:** accept Qdrant, local on-disk first and container-compatible
  later.
- **Index boundary:** accept that stable descriptive content is indexed while
  inventory, prices, capacity, dates, and customer context are live/request
  scoped.
- **Lifecycle:** accept explicit rebuild plus post-commit record updates and
  fail-closed stale-source handling.
- **#47 boundary:** accept the shared typed model/tool boundary, with all
  state-changing tools disabled in #46 and separately gated in #47.
- **Evaluation gate:** accept that Phase 2 is not complete until answerable,
  uncertain, no-answer, Ollama-unavailable, stale-index, and prompt-injection
  tests pass, with NFR-002 measured on the local baseline.

## Open decisions and residual risks

- The exact Ollama/Qwen3 model artefact and quantisation tag must be pinned in
  the decision record after the developer hardware check.
- The authoritative customer-facing policy content set must be identified
  before policy questions are enabled.
- Local 8B answer quality and latency may be inadequate on CPU; the 4B fallback
  is a compatibility option, not a quality guarantee.
- Qdrant local mode is convenient for development, but a production deployment
  would require a server, backup, access control, and freshness operations.

## Links

- [FR-008 and FR-009](../requirements/functional-requirements.md)
- [UC-001 Seek Travel Advice](../requirements/use-cases/uc-001-seek-travel-advice.md)
- [UC-002 Obtain Ongoing Travel Assistance](../requirements/use-cases/uc-002-obtain-ongoing-travel-assistance.md)
- [Shared UI Design System](../requirements/ux/design-system/design-system.md)
- [Technology Profile and Evaluation](technology.md)
- [Issue #46](https://github.com/hochschule-darmstadt/a3se_app/issues/46)
- [Issue #47](https://github.com/hochschule-darmstadt/a3se_app/issues/47)
- [Ollama Qwen3 model](https://ollama.com/library/qwen3)
- [Ollama tool calling](https://github.com/ollama/ollama/blob/main/docs/capabilities/tool-calling.mdx)
- [Qdrant local mode](https://qdrant.tech/documentation/frameworks/langchain/)
- [all-MiniLM-L6-v2 model card](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
