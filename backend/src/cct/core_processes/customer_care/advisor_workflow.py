"""LangGraph routing for grounded advice and client-draft travel composition."""

from __future__ import annotations

from datetime import date
from typing import Callable, Literal, TypedDict

from langgraph.graph import END, START, StateGraph

from .advisor import AdvisorAnswer, AdvisorQuestion, AdvisorState, KnowledgeDocument
from .travel_intent_extraction import ExtractedTravelFields, TravelIntentExtractor


class AdvisorWorkflowState(TypedDict, total=False):
    question: AdvisorQuestion
    extracted_fields: ExtractedTravelFields
    answer: AdvisorAnswer
    route: str
    documents: list[KnowledgeDocument]


class AdvisorWorkflow:
    """Classify every advisor turn before routing it to an authorised capability.

    The classifier is the local model's structured interpretation of the whole
    conversation.  It is deliberately the graph's first node: browser keyword
    matching must not decide whether a customer request becomes an action.
    """

    def __init__(
        self,
        *,
        extractor: TravelIntentExtractor,
        retrieve: Callable[[AdvisorQuestion], list[KnowledgeDocument]],
    ) -> None:
        self._extractor = extractor
        self._retrieve = retrieve
        builder = StateGraph(AdvisorWorkflowState)
        builder.add_node("classify_intent", self._classify_intent)
        builder.add_node("retrieve_grounded_context", self._retrieve_grounded_context)
        builder.add_node("prepare_composition", self._prepare_composition)
        builder.add_edge(START, "classify_intent")
        builder.add_conditional_edges("classify_intent", self._route_after_classification)
        builder.add_edge("retrieve_grounded_context", END)
        builder.add_edge("prepare_composition", END)
        self.graph = builder.compile()

    def _classify_intent(self, state: AdvisorWorkflowState) -> dict[str, object]:
        question = state["question"]
        turns = (*question.conversation, {"role": "customer", "content": question.message})
        # Pydantic validates the injected current turn at the existing boundary.
        from .advisor import AdvisorConversationTurn

        fields = self._extractor.extract(
            tuple(AdvisorConversationTurn.model_validate(turn) for turn in turns),
            date.today(),
        )
        return {"extracted_fields": fields}

    @staticmethod
    def _route_after_classification(state: AdvisorWorkflowState) -> Literal["retrieve_grounded_context", "prepare_composition"]:
        return "prepare_composition" if state["extracted_fields"].request_kind == "compose" else "retrieve_grounded_context"

    def _retrieve_grounded_context(self, state: AdvisorWorkflowState) -> dict[str, object]:
        # Generation runs after this graph node so its content can remain
        # streamed on the already-open HTTP response.
        return {"route": "rag", "documents": self._retrieve(state["question"])}

    @staticmethod
    def _prepare_composition(state: AdvisorWorkflowState) -> dict[str, object]:
        if not state["question"].is_authenticated:
            return {"answer": AdvisorAnswer(
                state=AdvisorState.NO_ANSWER,
                answer="Please sign in before I can propose or compose travel. Your conversation will be kept so you can continue afterwards.",
            )}
        return {"route": "compose"}

    def route(self, question: AdvisorQuestion) -> AdvisorWorkflowState:
        """Classify and authorise a turn before the selected branch executes."""
        return self.graph.invoke({"question": question})
