"""The unified advisor graph routes on LLM interpretation, never browser keywords."""

from datetime import date
from unittest import TestCase

from cct.core_processes.customer_care.advisor import AdvisorQuestion, AdvisorState
from cct.core_processes.customer_care.advisor_workflow import AdvisorWorkflow
from cct.core_processes.customer_care.travel_intent_extraction import ExtractedTravelFields


class ScriptedExtractor:
    def __init__(self, request_kind: str) -> None:
        self.fields = ExtractedTravelFields(request_kind=request_kind)  # type: ignore[arg-type]
        self.seen: tuple | None = None

    def extract(self, turns, today: date) -> ExtractedTravelFields:
        self.seen = tuple(turns)
        return self.fields


class AdvisorWorkflowTest(TestCase):
    def test_routes_a_non_keyword_narrative_to_composition_from_model_classification(self) -> None:
        extractor = ScriptedExtractor("compose")
        workflow = AdvisorWorkflow(extractor=extractor, retrieve=lambda _question: [])

        state = workflow.route(AdvisorQuestion(
            message="I will travel to Peru in June 2027 with my husband for three weeks from Frankfurt to Lima.",
            isAuthenticated=True,
        ))

        self.assertEqual("compose", state["route"])
        self.assertEqual("compose", state["extracted_fields"].request_kind)
        self.assertEqual("I will travel to Peru in June 2027 with my husband for three weeks from Frankfurt to Lima.", extractor.seen[-1].content)  # type: ignore[index]

    def test_routes_advice_to_grounded_answer(self) -> None:
        workflow = AdvisorWorkflow(extractor=ScriptedExtractor("advice"), retrieve=lambda _question: [])

        state = workflow.route(AdvisorQuestion(message="What is included in the Lima city tour?"))

        self.assertEqual("rag", state["route"])

    def test_unauthenticated_composition_does_not_invoke_stock_composition(self) -> None:
        workflow = AdvisorWorkflow(extractor=ScriptedExtractor("compose"), retrieve=lambda _question: [])

        state = workflow.route(AdvisorQuestion(message="Plan a trip to Lima"))

        self.assertEqual(AdvisorState.NO_ANSWER, state["answer"].state)
