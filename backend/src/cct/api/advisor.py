"""HTTP adapter for the grounded Automated Travel Advisor."""

from __future__ import annotations

from typing import Annotated

import json
from collections.abc import Iterator

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, ConfigDict, Field

from cct.core_processes.customer_care.advisor import AdvisorAction, AdvisorAnswer, AdvisorConversationTurn, AdvisorQuestion, AdvisorService, AdvisorState
from cct.core_processes.customer_care.travel_agent import ItineraryComponent, ItineraryDiagnostic, TravelIntent, validate_itinerary
from cct.core_processes.customer_care.travel_agent_planner import compose_travel
from cct.core_processes.customer_care.travel_agent_workflow import TravelAgentWorkflow
from cct.core_processes.customer_care.travel_intent_extraction import TravelIntentExtractor
from cct.resource_management.repository_ports import EntityRepositoryPort

from .dependencies import get_advisor_service, get_stock_repository, get_travel_intent_extractor
from .schemas import ErrorResponse

router = APIRouter(prefix="/advisor", tags=["advisor"])
AdvisorServiceDependency = Annotated[AdvisorService, Depends(get_advisor_service)]
StockRepositoryDependency = Annotated[EntityRepositoryPort, Depends(get_stock_repository)]
TravelIntentExtractorDependency = Annotated[TravelIntentExtractor, Depends(get_travel_intent_extractor)]


class ItineraryValidationRequest(BaseModel):
    """Deterministic validation input for the agent workflow."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    intent: TravelIntent
    components: list[ItineraryComponent]


class ItineraryValidationResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    valid: bool
    diagnostics: list[ItineraryDiagnostic]


class TravelAgentPlanRequest(BaseModel):
    """Client composition plus authoritative candidate projections."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    intent: TravelIntent
    current_components: list[ItineraryComponent] = Field(default_factory=list, alias="currentComponents")
    candidates: list[ItineraryComponent] = Field(default_factory=list)
    selected_candidate_ids: list[str] = Field(default_factory=list, alias="selectedCandidateIds")


class TravelAgentPlanResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, serialize_by_alias=True)

    status: str
    question: str | None = None
    diagnostics: list[ItineraryDiagnostic] = Field(default_factory=list)
    actions: list[AdvisorAction] = Field(default_factory=list)


class TravelAgentQuestion(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    message: str = Field(min_length=1, max_length=2000)
    conversation: list[AdvisorConversationTurn] = Field(default_factory=list, max_length=20)
    # Keep the compose endpoint compatible with the customer advisor request
    # envelope. Composition currently uses only the conversation, but the
    # confirmed context must remain part of the validated contract so the UI
    # does not receive a misleading generic failure.
    confirmed_context: list[dict[str, str]] = Field(default_factory=list, alias="confirmedContext", max_length=20)


@router.post(
    "/answer",
    response_model=AdvisorAnswer,
    operation_id="answerAdvisorQuestion",
    responses={422: {"model": ErrorResponse}, 503: {"model": ErrorResponse}},
)
def answer_advisor_question(question: AdvisorQuestion, service: AdvisorServiceDependency) -> AdvisorAnswer:
    return service.answer(question)


@router.post(
    "/validate-itinerary",
    response_model=ItineraryValidationResponse,
    operation_id="validateAdvisorItinerary",
    responses={422: {"model": ErrorResponse}},
)
def validate_advisor_itinerary(request: ItineraryValidationRequest) -> ItineraryValidationResponse:
    """Validate the browser's composition without creating or holding a draft."""
    diagnostics = validate_itinerary(request.intent, tuple(request.components))
    return ItineraryValidationResponse(
        valid=not diagnostics,
        diagnostics=diagnostics,
    )


@router.post(
    "/plan",
    response_model=TravelAgentPlanResponse,
    operation_id="planAdvisorTravel",
    responses={422: {"model": ErrorResponse}},
)
def plan_advisor_travel(request: TravelAgentPlanRequest) -> TravelAgentPlanResponse:
    """Run the graph and return local draft actions; never persists a draft."""
    selected_ids = set(request.selected_candidate_ids)
    workflow = TravelAgentWorkflow(
        selector=lambda _intent, candidates: tuple(item for item in candidates if item.component_id in selected_ids),
    )
    result = workflow.run(
        intent=request.intent,
        current_components=tuple(request.current_components),
        candidates=tuple(request.candidates),
    )
    return TravelAgentPlanResponse(
        status=str(result.get("status", "failed-or-uncertain")),
        question=result.get("question"),
        diagnostics=list(result.get("diagnostics", ())),
        actions=list(result.get("actions", ())),
    )


@router.post(
    "/compose",
    response_model=AdvisorAnswer,
    operation_id="composeAdvisorTravel",
    responses={422: {"model": ErrorResponse}, 503: {"model": ErrorResponse}},
)
def compose_advisor_travel(
    question: TravelAgentQuestion,
    stock_repository: StockRepositoryDependency,
    extractor: TravelIntentExtractorDependency,
) -> AdvisorAnswer:
    """Extract and compose a request through internal stock and LangGraph."""
    answer, _intent, actions, diagnostics = compose_travel(question.message, question.conversation, stock_repository, extractor=extractor)
    return AdvisorAnswer(
        state=AdvisorState.ANSWERED if not diagnostics else AdvisorState.UNCERTAIN,
        answer=answer,
        actions=list(actions),
        uncertaintyReason="; ".join(item.message for item in diagnostics) if diagnostics else None,
    )


def _stream_events(question: AdvisorQuestion, service: AdvisorService) -> Iterator[str]:
    for event in service.stream_answer(question):
        yield json.dumps(event) + "\n"


@router.post(
    "/answer/stream",
    operation_id="streamAdvisorAnswer",
    responses={422: {"model": ErrorResponse}, 503: {"model": ErrorResponse}},
)
def stream_advisor_answer(question: AdvisorQuestion, service: AdvisorServiceDependency) -> StreamingResponse:
    return StreamingResponse(_stream_events(question, service), media_type="application/x-ndjson")
