"""Bounded LangGraph workflow for composing a client-owned My Travel draft.

The graph receives authoritative candidate projections from existing API/module
operations. It never receives a repository, database connection, raw query, or
final-order operation. Its output is a proposed local browser action list.
"""

from __future__ import annotations

from typing import Literal, Protocol, TypedDict

from langgraph.graph import END, START, StateGraph

from .advisor import AdvisorAction
from .travel_agent import ItineraryComponent, ItineraryDiagnostic, TravelIntent, validate_itinerary


class CandidateSelector(Protocol):
    def __call__(self, intent: TravelIntent, candidates: tuple[ItineraryComponent, ...]) -> tuple[ItineraryComponent, ...]: ...


class TravelAgentState(TypedDict, total=False):
    intent: TravelIntent
    current_components: tuple[ItineraryComponent, ...]
    candidates: tuple[ItineraryComponent, ...]
    selected_components: tuple[ItineraryComponent, ...]
    diagnostics: tuple[ItineraryDiagnostic, ...]
    actions: tuple[AdvisorAction, ...]
    status: str
    question: str


class TravelAgentWorkflow:
    """Compile and run the deterministic orchestration graph.

    Candidate selection is an explicit dependency so a future LLM can rank
    only returned API results. The default selector is intentionally inert: it
    selects nothing, preventing accidental composition from unreviewed data.
    """

    def __init__(self, selector: CandidateSelector | None = None) -> None:
        self._selector = selector or (lambda _intent, _candidates: ())
        builder = StateGraph(TravelAgentState)
        builder.add_node("check_intent", self._check_intent)
        builder.add_node("select_candidates", self._select_candidates)
        builder.add_node("validate_composition", self._validate_composition)
        builder.add_node("emit_client_actions", self._emit_client_actions)
        builder.add_edge(START, "check_intent")
        builder.add_conditional_edges("check_intent", self._route_after_intent)
        builder.add_edge("select_candidates", "validate_composition")
        builder.add_conditional_edges("validate_composition", self._route_after_validation)
        builder.add_edge("emit_client_actions", END)
        self.graph = builder.compile()

    @staticmethod
    def _check_intent(state: TravelAgentState) -> dict[str, object]:
        intent = state["intent"]
        missing: list[str] = []
        if not intent.destination:
            missing.append("destination")
        if not intent.start_date:
            missing.append("arrival date")
        if not intent.end_date:
            missing.append("departure date")
        if missing:
            return {"status": "awaiting-input", "question": f"Please provide: {', '.join(missing)}."}
        return {"status": "in-progress"}

    @staticmethod
    def _route_after_intent(state: TravelAgentState) -> Literal["select_candidates", END]:
        return END if state.get("status") == "awaiting-input" else "select_candidates"

    def _select_candidates(self, state: TravelAgentState) -> dict[str, object]:
        selected = self._selector(state["intent"], state.get("candidates", ()))
        return {"selected_components": tuple(selected)}

    @staticmethod
    def _validate_composition(state: TravelAgentState) -> dict[str, object]:
        components = tuple(state.get("current_components", ())) + tuple(state.get("selected_components", ()))
        diagnostics = validate_itinerary(state["intent"], components)
        return {"diagnostics": diagnostics, "status": "failed-or-uncertain" if diagnostics else "confirmed"}

    @staticmethod
    def _route_after_validation(state: TravelAgentState) -> Literal["emit_client_actions", END]:
        return "emit_client_actions" if not state.get("diagnostics") else END

    @staticmethod
    def _emit_client_actions(state: TravelAgentState) -> dict[str, object]:
        existing_ids = {item.component_id for item in state.get("current_components", ())}
        actions = tuple(
            AdvisorAction(
                type="add-position",
                stockItemId=item.component_id,
                productId=item.product_id or item.component_id,
                serviceDate=item.service_date.isoformat(),
                displayNameChain=list(item.display_name_chain),
                unitPriceAmount=f"{item.unit_price:.2f}",
                currencyCode=item.currency,
            )
            for item in state.get("selected_components", ())
            if item.component_id not in existing_ids
        )
        return {"actions": actions}

    def run(
        self,
        *,
        intent: TravelIntent,
        current_components: tuple[ItineraryComponent, ...] = (),
        candidates: tuple[ItineraryComponent, ...] = (),
    ) -> TravelAgentState:
        """Run a single stateless composition; no checkpoint or server draft is used."""

        return self.graph.invoke({
            "intent": intent,
            "current_components": current_components,
            "candidates": candidates,
        })

