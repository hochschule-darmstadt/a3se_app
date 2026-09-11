"""Grounded, read-only advisor capability for issue #46.

The service owns orchestration only. Product facts remain in the resource
repositories; the model receives bounded evidence and no database authority.
"""

from __future__ import annotations

import json
import hashlib
import os
import re
from dataclasses import dataclass
from enum import StrEnum
from pathlib import Path
from collections.abc import Iterator
from typing import Protocol
from urllib.error import URLError
from urllib.request import Request, urlopen

from pydantic import BaseModel, ConfigDict, Field

from cct.resource_management.contracts import EntityKind
from cct.resource_management.pagination import PageRequest
from cct.resource_management.touristic_product_management.search import LOCATION_TERMS, build_product_search_text


class AdvisorState(StrEnum):
    ANSWERED = "answered"
    UNCERTAIN = "uncertain"
    NO_ANSWER = "no-answer"
    HANDOVER = "handover"
    FAILED = "failed"


class AdvisorContextItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    key: str = Field(min_length=1, max_length=100)
    value: str = Field(min_length=1, max_length=500)


class AdvisorConversationTurn(BaseModel):
    model_config = ConfigDict(extra="forbid")

    role: str = Field(pattern="^(customer|advisor)$")
    content: str = Field(min_length=1, max_length=2000)


class AdvisorQuestion(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    message: str = Field(min_length=1, max_length=2000)
    confirmed_context: list[AdvisorContextItem] = Field(default_factory=list, alias="confirmedContext")
    conversation: list[AdvisorConversationTurn] = Field(default_factory=list, max_length=20)


class AdvisorEvidence(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    source_id: str = Field(alias="sourceId")
    source_type: str = Field(alias="sourceType")
    excerpt: str


class AdvisorAnswer(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    state: AdvisorState
    answer: str
    evidence: list[AdvisorEvidence] = Field(default_factory=list)
    uncertainty_reason: str | None = Field(default=None, alias="uncertaintyReason")


@dataclass(frozen=True, slots=True)
class KnowledgeDocument:
    source_id: str
    source_type: str
    text: str
    content_version: str


class KnowledgeIndex(Protocol):
    def search(self, query: str, *, limit: int) -> list[KnowledgeDocument]: ...


class AnswerModel(Protocol):
    def answer(self, question: str, evidence: list[KnowledgeDocument], context: list[AdvisorContextItem], conversation: list[AdvisorConversationTurn]) -> AdvisorAnswer: ...

    def stream_answer(self, question: str, evidence: list[KnowledgeDocument], context: list[AdvisorContextItem], conversation: list[AdvisorConversationTurn]) -> Iterator[str]: ...


class AdvisorUnavailable(RuntimeError):
    """The configured local model or index cannot answer this request."""


class QdrantKnowledgeIndex:
    """Small on-disk Qdrant index using local all-MiniLM embeddings."""

    def __init__(self, path: str | Path, *, collection_name: str = "advisor_knowledge_v1") -> None:
        from fastembed import TextEmbedding
        from qdrant_client import QdrantClient, models

        self._models = models
        self._embedding = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
        self._client = QdrantClient(path=str(path))
        self._collection = collection_name
        if not self._client.collection_exists(collection_name):
            self._client.create_collection(
                collection_name=collection_name,
                vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE),
            )

    def replace(self, documents: list[KnowledgeDocument]) -> None:
        vectors = list(self._embedding.embed([document.text for document in documents]))
        points = [
            self._models.PointStruct(
                id=index,
                vector=vector.tolist(),
                payload={
                    "sourceId": document.source_id,
                    "sourceType": document.source_type,
                    "text": document.text,
                    "contentVersion": document.content_version,
                },
            )
            for index, (document, vector) in enumerate(zip(documents, vectors, strict=True))
        ]
        self._client.delete_collection(self._collection)
        self._client.create_collection(
            collection_name=self._collection,
            vectors_config=self._models.VectorParams(size=384, distance=self._models.Distance.COSINE),
        )
        if points:
            self._client.upsert(collection_name=self._collection, points=points)

    def search(self, query: str, *, limit: int) -> list[KnowledgeDocument]:
        exact = self._exact_search(query, limit=limit)
        if exact:
            return exact
        vector = next(iter(self._embedding.embed([query])))
        hits = self._client.query_points(
            collection_name=self._collection,
            query=vector.tolist(),
            with_payload=True,
            limit=limit,
            score_threshold=0.35,
        ).points
        semantic = [
            KnowledgeDocument(
                source_id=str(hit.payload["sourceId"]),
                source_type=str(hit.payload["sourceType"]),
                text=str(hit.payload["text"]),
                content_version=str(hit.payload["contentVersion"]),
            )
            for hit in hits
            if hit.payload
        ]
        return semantic[:limit]

    def _exact_search(self, query: str, *, limit: int) -> list[KnowledgeDocument]:
        """Resolve identifiers and directional location constraints lexically."""
        points, _ = self._client.scroll(collection_name=self._collection, limit=10000, with_payload=True)
        normalized = query.casefold()
        tokens = re.findall(r"[a-z0-9-]+", normalized)
        stop_words = {"a", "an", "and", "flight", "flights", "from", "in", "the", "to"}
        terms = [token for token in tokens if token not in stop_words and len(token) >= 3]

        location_by_alias = {
            alias.casefold(): code.casefold()
            for code, aliases in LOCATION_TERMS.items()
            for alias in (code, *aliases)
        }
        direction_field = None
        direction_term = None
        for marker, field in (("to", "arrivallocationcode"), ("from", "departurelocationcode")):
            try:
                marker_index = tokens.index(marker)
                candidate = tokens[marker_index + 1]
            except (ValueError, IndexError):
                continue
            direction_term = location_by_alias.get(candidate, candidate)
            direction_field = field
            break

        results: list[KnowledgeDocument] = []
        for point in points:
            if not point.payload:
                continue
            text = str(point.payload.get("text", "")).casefold()
            directional_match = direction_field and f"{direction_field}: {direction_term}" in text
            identifier_match = any(re.search(rf"(?<![a-z0-9]){re.escape(term)}(?![a-z0-9])", text) for term in terms)
            if not (directional_match or (direction_field is None and identifier_match)):
                continue
            results.append(KnowledgeDocument(
                source_id=str(point.payload["sourceId"]),
                source_type=str(point.payload["sourceType"]),
                text=str(point.payload["text"]),
                content_version=str(point.payload["contentVersion"]),
            ))
            if len(results) >= limit:
                break
        return results

    def rebuild(self, documents: list[KnowledgeDocument]) -> None:
        self.replace(documents)


class OllamaAnswerModel:
    """Minimal Ollama HTTP adapter; no provider SDK or agent framework needed."""

    def __init__(self, *, base_url: str = "http://ollama:11434", model: str = "qwen3:8b") -> None:
        self._url = f"{base_url.rstrip('/')}/api/chat"
        self._model = model

    def answer(self, question: str, evidence: list[KnowledgeDocument], context: list[AdvisorContextItem], conversation: list[AdvisorConversationTurn]) -> AdvisorAnswer:
        evidence_text = "\n".join(f"[{item.source_id}] {item.text}" for item in evidence)
        context_text = "\n".join(f"{item.key}: {item.value}" for item in context)
        system = (
            "You are the AI Travel Advisor for Christopher Columbus Travel. "
            "Answer only from the supplied evidence and confirmed context. "
            "Never invent availability, dates, prices, policy, or order facts. "
            "If evidence is insufficient, return state uncertain or no-answer. "
            "Return JSON only with keys state, answer, uncertaintyReason. "
            "state must be answered, uncertain, no-answer, or handover."
        )
        payload = {
            "model": self._model,
            "stream": False,
            "keep_alive": "10m",
            "think": False,
            "options": {"temperature": 0},
            "format": "json",
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": f"Conversation so far:\n{format_conversation(conversation)}\n\nQuestion: {question}\nConfirmed context:\n{context_text}\nEvidence:\n{evidence_text}"},
            ],
        }
        request = Request(self._url, data=json.dumps(payload).encode(), headers={"Content-Type": "application/json"})
        try:
            with urlopen(request, timeout=60) as response:
                body = json.loads(response.read().decode())
        except (OSError, URLError, TimeoutError) as exc:
            raise AdvisorUnavailable("the local Ollama model is unavailable") from exc
        try:
            generated = json.loads(body["message"]["content"])
            state = AdvisorState(generated["state"])
            return AdvisorAnswer(
                state=state,
                answer=str(generated.get("answer", "")),
                uncertaintyReason=generated.get("uncertaintyReason"),
                evidence=[AdvisorEvidence(sourceId=item.source_id, sourceType=item.source_type, excerpt=item.text) for item in evidence],
            )
        except (KeyError, TypeError, ValueError, json.JSONDecodeError) as exc:
            raise AdvisorUnavailable("the local model returned an invalid advisor response") from exc

    def stream_answer(self, question: str, evidence: list[KnowledgeDocument], context: list[AdvisorContextItem], conversation: list[AdvisorConversationTurn]) -> Iterator[str]:
        evidence_text = "\n".join(f"[{item.source_id}] {item.text}" for item in evidence)
        context_text = "\n".join(f"{item.key}: {item.value}" for item in context)
        system = (
            "You are the AI Travel Advisor for Christopher Columbus Travel. "
            "Answer only from the supplied evidence and confirmed context. "
            "Never invent availability, dates, prices, policy, or order facts. "
            "Return only the concise customer-facing answer as plain text; do not return JSON, labels, or markdown metadata."
        )
        payload = {
            "model": self._model,
            "stream": True,
            "keep_alive": "10m",
            "think": False,
            "options": {"temperature": 0},
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": f"Conversation so far:\n{format_conversation(conversation)}\n\nQuestion: {question}\nConfirmed context:\n{context_text}\nEvidence:\n{evidence_text}"},
            ],
        }
        request = Request(self._url, data=json.dumps(payload).encode(), headers={"Content-Type": "application/json"})
        try:
            with urlopen(request, timeout=60) as response:
                for line in response:
                    if not line.strip():
                        continue
                    event = json.loads(line.decode())
                    chunk = event.get("message", {}).get("content", "")
                    if chunk:
                        yield str(chunk)
                    if event.get("done"):
                        return
        except (OSError, URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise AdvisorUnavailable("the local Ollama model is unavailable") from exc


class AdvisorService:
    def __init__(self, index: KnowledgeIndex, model: AnswerModel) -> None:
        self._index = index
        self._model = model

    def answer(self, question: AdvisorQuestion) -> AdvisorAnswer:
        documents = self._index.search(question.message, limit=8)
        if not documents:
            return AdvisorAnswer(
                state=AdvisorState.NO_ANSWER,
                answer="I could not find approved travel information for that question.",
                uncertaintyReason="No approved source matched the question.",
            )
        answer = self._model.answer(question.message, documents, question.confirmed_context, question.conversation)
        if answer.state in {AdvisorState.UNCERTAIN, AdvisorState.NO_ANSWER, AdvisorState.HANDOVER, AdvisorState.FAILED}:
            return answer.model_copy(update={"evidence": []})
        return answer

    def stream_answer(self, question: AdvisorQuestion) -> Iterator[dict[str, object]]:
        documents = self._index.search(question.message, limit=8)
        if not documents:
            yield {
                "type": "complete",
                "state": AdvisorState.NO_ANSWER.value,
                "answer": "I could not find approved travel information for that question.",
                "evidence": [],
                "uncertaintyReason": "No approved source matched the question.",
            }
            return
        try:
            for chunk in self._model.stream_answer(question.message, documents, question.confirmed_context, question.conversation):
                yield {"type": "chunk", "text": chunk}
        except AdvisorUnavailable:
            yield {"type": "complete", "state": AdvisorState.FAILED.value, "answer": "", "evidence": []}
            return
        yield {
            "type": "complete",
            "state": AdvisorState.ANSWERED.value,
            "answer": "",
            "evidence": [
                {"sourceId": item.source_id, "sourceType": item.source_type, "excerpt": item.text}
                for item in documents
            ],
            "uncertaintyReason": "",
        }


def format_conversation(conversation: list[AdvisorConversationTurn]) -> str:
    """Render bounded frontend session memory without treating it as evidence."""
    if not conversation:
        return "(no previous messages)"
    return "\n".join(f"{turn.role}: {turn.content}" for turn in conversation)


def product_documents(product_repository, partner_repository) -> list[KnowledgeDocument]:
    """Create bounded explanatory records with hierarchy and all attributes."""
    page = product_repository.list(EntityKind.TOURISTIC_PRODUCT_ITEM, type_filter=None, page=PageRequest(limit=100))
    documents: list[KnowledgeDocument] = []
    for product in page.items:
        properties = product.properties.model_dump(by_alias=True, exclude_none=True)
        attributes = " ".join(f"{key}: {value}" for key, value in properties.items())
        hierarchy_context = build_product_search_text(product_repository, partner_repository, product.entity_id)
        text = f"{hierarchy_context} {attributes}".strip()
        documents.append(KnowledgeDocument(product.entity_id, "catalogue-product", text, hashlib.sha256(text.encode()).hexdigest()))
    return documents


def glossary_documents(path: str | Path) -> list[KnowledgeDocument]:
    """Load the approved glossary table without indexing customer context."""
    documents: list[KnowledgeDocument] = []
    for line in Path(path).read_text(encoding="utf-8").splitlines():
        if not line.startswith("|") or line.startswith("| Term") or line.startswith("|---"):
            continue
        columns = [part.strip() for part in line.strip("|").split("|")]
        if len(columns) >= 3:
            text = f"{columns[0]}: {columns[1]} Context: {columns[2]}"
            documents.append(KnowledgeDocument(f"glossary:{columns[0]}", "glossary", text, hashlib.sha256(text.encode()).hexdigest()))
    return documents


def create_default_advisor_service(documents: list[KnowledgeDocument] | None = None) -> AdvisorService:
    index = QdrantKnowledgeIndex(os.environ.get("CCT_ADVISOR_INDEX_PATH", "/var/lib/cct/advisor-index"))
    if documents:
        index.rebuild(documents)
    model = OllamaAnswerModel(
        base_url=os.environ.get("CCT_OLLAMA_URL", "http://ollama:11434"),
        model=os.environ.get("CCT_OLLAMA_MODEL", "qwen3:8b"),
    )
    return AdvisorService(index, model)
