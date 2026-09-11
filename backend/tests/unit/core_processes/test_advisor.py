"""Unit evidence for grounded advisor state handling."""

from unittest import TestCase

from cct.core_processes.customer_care.advisor import (
    AdvisorAnswer,
    AdvisorEvidence,
    AdvisorQuestion,
    AdvisorService,
    AdvisorState,
    KnowledgeDocument,
)


class FakeIndex:
    def __init__(self, documents):
        self.documents = documents

    def search(self, query: str, *, limit: int):
        return self.documents[:limit]


class FakeModel:
    def __init__(self, answer):
        self.answer_value = answer

    def answer(self, question, evidence, context, conversation):
        return self.answer_value.model_copy(update={"evidence": [
            AdvisorEvidence(sourceId=item.source_id, sourceType=item.source_type, excerpt=item.text)
            for item in evidence
        ]})


class AdvisorServiceTest(TestCase):
    def setUp(self):
        self.documents = [KnowledgeDocument("PRD-000001", "catalogue-product", "Quiet coastal walking trip", "v1")]

    def test_answered_result_keeps_grounding_evidence(self):
        service = AdvisorService(
            FakeIndex(self.documents),
            FakeModel(AdvisorAnswer(state=AdvisorState.ANSWERED, answer="The catalogue includes a coastal walking trip.")),
        )

        result = service.answer(AdvisorQuestion(message="Tell me about coastal walking"))

        self.assertEqual(AdvisorState.ANSWERED, result.state)
        self.assertEqual("PRD-000001", result.evidence[0].source_id)

    def test_no_match_is_not_presented_as_an_answer(self):
        service = AdvisorService(FakeIndex([]), FakeModel(AdvisorAnswer(state=AdvisorState.ANSWERED, answer="invented")))

        result = service.answer(AdvisorQuestion(message="Tell me unrelated facts"))

        self.assertEqual(AdvisorState.NO_ANSWER, result.state)
        self.assertEqual([], result.evidence)

    def test_uncertain_result_drops_evidence_from_customer_projection(self):
        service = AdvisorService(
            FakeIndex(self.documents),
            FakeModel(AdvisorAnswer(state=AdvisorState.UNCERTAIN, answer="I cannot confirm that.", uncertaintyReason="Conflicting sources")),
        )

        result = service.answer(AdvisorQuestion(message="Is this definitely available?"))

        self.assertEqual(AdvisorState.UNCERTAIN, result.state)
        self.assertEqual([], result.evidence)
