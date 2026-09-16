"""Regression evidence for free-text travel-intent extraction and prompts."""

from unittest import TestCase

from cct.core_processes.customer_care.advisor import AdvisorConversationTurn
from cct.core_processes.customer_care.travel_agent_planner import compose_travel, extract_travel_intent


class UnusedStockRepository:
    def list_catalogue_stock_matches(self, **_kwargs):
        raise AssertionError("incomplete intent must not query stock")


class TravelAgentPlannerTest(TestCase):
    def test_extracts_to_destination_person_count_and_exact_duration(self) -> None:
        intent = extract_travel_intent("book a 5 day trip to lima, 2 persons, with adventure")

        self.assertEqual("lima", intent.destination)
        self.assertEqual(2, intent.traveller_count)
        self.assertEqual(5, intent.min_days)
        self.assertEqual(5, intent.max_days)

    def test_incomplete_intent_asks_for_dates_instead_of_reporting_success(self) -> None:
        conversation = [
            AdvisorConversationTurn(role="customer", content="book a 5 day trip to lima, 2 persons, with adventure"),
            AdvisorConversationTurn(role="advisor", content="What is the name of your travel partner?"),
        ]

        answer, intent, actions, diagnostics = compose_travel(
            "Ada Kern",
            conversation,
            UnusedStockRepository(),  # type: ignore[arg-type]
        )

        self.assertEqual("lima", intent.destination)
        self.assertIn("arrival date", answer)
        self.assertIn("departure date", answer)
        self.assertNotIn("draft for None", answer)
        self.assertEqual((), actions)
        self.assertEqual((), diagnostics)
