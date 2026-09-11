# DR-0024: Use a local grounded advisor stack for Q&A and future tools

- Status: accepted
- Date: 2026-09-10
- Deciders: project owner and engineering
- Supersedes: none

## Context

Issue #46 requires question answering grounded in the synthetic catalogue,
terminology, and approved policy content. Issue #47 will later add controlled
agent tools and customer-action confirmation. The developer workflow must work
without a hosted AI account or customer data leaving the local environment.
The existing technology profile leaves the model, inference runtime, and
retrieval implementation open.

## Decision drivers

- local execution on ordinary developer hardware;
- zero mandatory licence or usage fees under NFR-003;
- reuse of one model boundary for #46 and #47;
- explicit provenance, freshness, and fail-closed uncertainty handling;
- no unrestricted database or mutation authority for the model;
- reversible indexing choice for the current small synthetic catalogue.

## Considered options

- Hosted model API and hosted vector store: rejected for the MVP because it
  adds external data processing, credentials, network dependency, and usage
  cost to the developer workflow.
- Local Qwen3 through Ollama with no retrieval: rejected because the model
  could not reliably ground answers in changing catalogue and policy facts.
- Local Qwen3 through Ollama with Qdrant and local embeddings: selected because
  it keeps generation and retrieval local while preserving a replaceable
  adapter boundary.

## Decision

Use the following MVP stack:

- `qwen3:8b` through the Ollama HTTP API as the answer/tool-capable model;
  `qwen3:4b` is the documented low-memory fallback.
- The Compose Ollama service requests `gpus: all`; GPU acceleration therefore
  depends on the developer's configured NVIDIA container runtime, with CPU as
  the fallback outside that environment.
- `sentence-transformers/all-MiniLM-L6-v2` for local English embeddings.
- Qdrant Python client local on-disk mode for the initial semantic index. The
  index is persisted in the `advisor-index` volume and may later move to a
  Qdrant service without changing the retriever port.
- `MOD-ADVISOR` as a bounded application capability. It receives provided
  module reads and returns a validated answer/evidence/state contract. It never
  receives Neo4j credentials, raw Cypher, or unrestricted write tools.
- #46 enables only read-only Q&A. #47 may reuse the model, retriever, and typed
  tool registry after separately accepted action policy and confirmation gates.

Index stable product descriptions, display context, glossary terms, and
approved policy sections. Never index inventory, capacity, prices, service
dates, availability, or globally shared customer/order context. Changing facts
are read through owning module operations at question time. Rebuild after seed
reset and update product records after successful commits; stale records fail
closed.

## Consequences

### Positive

- Developers can run the complete AI path locally with Docker and no hosted
  provider account.
- The same model boundary can support #47 without granting the model direct
  business-system authority.
- Volatile facts remain authoritative and current in the resource modules.
- The small local index is simple to inspect, rebuild, and replace.

### Negative and risks

- Local 8B quality and latency may not meet production expectations, especially
  on CPU; the fallback 4B model is not equivalent in quality.
- Qdrant local mode is single-process oriented and does not provide the
  operational features of a dedicated service.
- Ollama and model artefact versions must be pinned and evaluated before any
  production claim.
- No authoritative customer-facing policy corpus is currently identified.

## Validation and revisit triggers

Validate answerable, uncertain, no-answer, stale-index, prompt-injection,
Ollama-unavailable, and local latency scenarios. Revisit the model if the
evaluation set or NFR-002 fails; revisit Qdrant local mode if multiple workers,
index concurrency, backup, or operational recovery becomes necessary; revisit
the local-only boundary only after an explicit data-processing and cost review.

## Links

- [Implemented backend advisor architecture](../../architecture/software-architecture/backend-architecture.md#22-ai-travel-advisor-implemented-backend)
- [Implemented frontend advisor architecture](../../architecture/software-architecture/frontend-architecture.md#31-ai-travel-advisor-implemented-frontend)
- [FR-008 and FR-009](../../requirements/functional-requirements.md)
- [NFR-002 and NFR-003](../../requirements/non-functional-requirements.md)
- [Issue #46](https://github.com/hochschule-darmstadt/a3se_app/issues/46)
- [Issue #47](https://github.com/hochschule-darmstadt/a3se_app/issues/47)
