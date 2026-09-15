"""Executable evidence for the LangGraph travel-composition workflow."""

from datetime import date
from unittest import TestCase

from cct.core_processes.customer_care.travel_agent import ComponentKind, ItineraryComponent, TravelIntent
from cct.core_processes.customer_care.travel_agent_workflow import TravelAgentWorkflow


class TravelAgentWorkflowTest(TestCase):
    def setUp(self) -> None:
        self.intent = TravelIntent(
            origin_code="FRA", return_code="FRA", destination="Peru",
            start_date=date(2027, 1, 4), end_date=date(2027, 1, 6),
            min_days=2, max_days=3, traveller_count=2,
        )
        self.components = (
            ItineraryComponent(
                component_id="flight-out", product_id="flight-product", kind=ComponentKind.TRANSPORT,
                from_code="FRA", to_code="LIM", service_date=date(2027, 1, 4),
                unit_price=400, currency="EUR", available_capacity=2,
            ),
            ItineraryComponent(
                component_id="hotel", product_id="hotel-product", kind=ComponentKind.ACCOMMODATION,
                location_code="LIM", service_date=date(2027, 1, 4), end_date=date(2027, 1, 6),
                unit_price=200, currency="EUR", available_capacity=2,
            ),
            ItineraryComponent(
                component_id="flight-back", product_id="flight-product", kind=ComponentKind.TRANSPORT,
                from_code="LIM", to_code="FRA", service_date=date(2027, 1, 6),
                unit_price=400, currency="EUR", available_capacity=2,
            ),
        )

    def test_graph_emits_client_actions_for_selected_authoritative_candidates(self) -> None:
        graph = TravelAgentWorkflow(selector=lambda _intent, candidates: candidates)
        result = graph.run(intent=self.intent, candidates=self.components)

        self.assertEqual("confirmed", result["status"])
        self.assertEqual(3, len(result["actions"]))
        self.assertTrue(all(action.type == "add-position" for action in result["actions"]))
        self.assertEqual("flight-product", result["actions"][0].product_id)

    def test_graph_does_not_emit_actions_for_invalid_composition(self) -> None:
        graph = TravelAgentWorkflow(selector=lambda _intent, candidates: candidates[:1])
        result = graph.run(intent=self.intent, candidates=self.components)

        self.assertEqual("failed-or-uncertain", result["status"])
        self.assertEqual((), result.get("actions", ()))
        self.assertTrue({item.rule_id for item in result["diagnostics"]} & {"ACCOMMODATION-COVERAGE", "END-TRANSPORT"})

    def test_graph_asks_for_missing_dates_without_searching_or_mutating(self) -> None:
        graph = TravelAgentWorkflow(selector=lambda _intent, _candidates: self.components)
        result = graph.run(intent=self.intent.model_copy(update={"start_date": None}), candidates=self.components)

        self.assertEqual("awaiting-input", result["status"])
        self.assertIn("arrival date", result["question"])
        self.assertEqual((), result.get("actions", ()))
