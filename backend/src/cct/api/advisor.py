"""HTTP adapter for the grounded Automated Travel Advisor."""

from __future__ import annotations

from typing import Annotated

import json
from collections.abc import Iterator

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from cct.core_processes.customer_care.advisor import AdvisorAnswer, AdvisorQuestion, AdvisorService

from .dependencies import get_advisor_service
from .schemas import ErrorResponse

router = APIRouter(prefix="/advisor", tags=["advisor"])
AdvisorServiceDependency = Annotated[AdvisorService, Depends(get_advisor_service)]


@router.post(
    "/answer",
    response_model=AdvisorAnswer,
    operation_id="answerAdvisorQuestion",
    responses={422: {"model": ErrorResponse}, 503: {"model": ErrorResponse}},
)
def answer_advisor_question(question: AdvisorQuestion, service: AdvisorServiceDependency) -> AdvisorAnswer:
    return service.answer(question)


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
