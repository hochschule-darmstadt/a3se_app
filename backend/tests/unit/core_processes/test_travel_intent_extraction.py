"""Evidence that model-extracted travel fields are validated, not trusted."""

import json
from datetime import date
from unittest import TestCase
from unittest.mock import patch

from cct.core_processes.customer_care.advisor import AdvisorConversationTurn, AdvisorUnavailable
from cct.core_processes.customer_care.travel_agent_planner import PARTNER_QUESTION, build_planning_request, compose_travel
from cct.core_processes.customer_care.travel_intent_extraction import ExtractedTravelFields, OllamaTravelIntentExtractor

TODAY = date(2026, 9, 16)


def _customer(*contents: str) -> list[AdvisorConversationTurn]:
    return [AdvisorConversationTurn(role="customer", content=content) for content in contents]


class ScriptedExtractor:
    """Stands in for the model: returns fixed fields and records its input."""

    def __init__(self, **fields: object) -> None:
        self.fields = ExtractedTravelFields.model_validate(fields)
        self.seen: list[tuple[tuple[AdvisorConversationTurn, ...], date]] = []

    def extract(self, turns, today):
        self.seen.append((tuple(turns), today))
        return self.fields


class UnusedStockRepository:
    def list_catalogue_stock_matches(self, **_kwargs):
        raise AssertionError("incomplete intent must not query stock")


class FakeResponse:
    def __init__(self, body: dict) -> None:
        self._body = json.dumps(body).encode()

    def read(self) -> bytes:
        return self._body

    def __enter__(self):
        return self

    def __exit__(self, *_exc) -> None:
        return None


class NormalisationTest(TestCase):
    def test_free_wording_becomes_a_complete_request(self) -> None:
        turns = _customer("My wife Ada Kern and I want a week in Rio in March, leaving from Munich, under 4000 euros")
        extractor = ScriptedExtractor(
            destination="Rio de Janeiro", origin="Munich", travel_month=3, min_days=7, max_days=7,
            traveller_count=2, budget_amount=4000, partner_given_name="Ada", partner_family_name="Kern",
        )

        request = build_planning_request(turns, extractor, TODAY)

        self.assertEqual("GIG", request.destination_code)
        self.assertEqual("MUC", request.intent.origin_code)
        self.assertEqual((date(2027, 3, 1), date(2027, 3, 31), "March 2027"), (request.window_start, request.window_end, request.window_label))
        self.assertEqual((7, 7, 2, 4000), (request.intent.min_days, request.intent.max_days, request.intent.traveller_count, request.intent.budget_amount))
        self.assertEqual(("Ada", "Kern"), request.partner_name)
        self.assertEqual(TODAY, extractor.seen[0][1])

    def test_values_the_customer_never_wrote_are_dropped(self) -> None:
        request = build_planning_request(
            _customer("two persons to lima please"),
            ScriptedExtractor(destination="Cusco", origin="Berlin", traveller_count=2, partner_given_name="Maria", partner_family_name="Lopez"),
            TODAY,
        )

        self.assertIsNone(request.intent.destination)
        self.assertIsNone(request.intent.origin_code)
        # Traveller identity is never invented by the model.
        self.assertIsNone(request.partner_name)

    def test_past_and_malformed_dates_are_missing_rather_than_trusted(self) -> None:
        request = build_planning_request(
            _customer("to lima from berlin, 2025-01-04 to 2027-02-30"),
            ScriptedExtractor(destination="Lima", origin="Berlin", start_date="2025-01-04", end_date="2027-02-30", travel_month=13),
            TODAY,
        )

        self.assertIsNone(request.intent.start_date)
        self.assertIsNone(request.intent.end_date)
        self.assertIsNone(request.window_start)

    def test_implausible_year_is_replaced_by_the_next_matching_month(self) -> None:
        request = build_planning_request(_customer("lima in january"), ScriptedExtractor(destination="Lima", travel_month=1, travel_year=2031), TODAY)

        self.assertEqual(date(2027, 1, 1), request.window_start)

    def test_exact_dates_override_a_contradicting_trip_length(self) -> None:
        request = build_planning_request(
            _customer("lima, 5 days, 2027-01-04 to 2027-01-10"),
            ScriptedExtractor(destination="Lima", start_date="2027-01-04", end_date="2027-01-10", min_days=5, max_days=5),
            TODAY,
        )

        self.assertEqual((date(2027, 1, 4), date(2027, 1, 10)), (request.intent.start_date, request.intent.end_date))
        self.assertIsNone(request.window_start)
        self.assertIsNone(request.intent.min_days)

    def test_dates_padded_into_an_open_month_are_searched_as_that_month(self) -> None:
        request = build_planning_request(
            _customer("two people to quito next spring from munich for 8-10 days"),
            ScriptedExtractor(destination="Quito", start_date="2027-03-01", end_date="2027-03-31", travel_month=3, travel_year=2027, min_days=8, max_days=10),
            TODAY,
        )

        self.assertIsNone(request.intent.start_date)
        self.assertEqual("March 2027", request.window_label)
        self.assertEqual((8, 10), (request.intent.min_days, request.intent.max_days))

    def test_a_past_month_rolls_forward_to_the_next_year(self) -> None:
        request = build_planning_request(_customer("lima in march"), ScriptedExtractor(destination="Lima", travel_month=3, travel_year=2026), TODAY)

        self.assertEqual("March 2027", request.window_label)

    def test_compose_asks_the_next_question_from_model_fields(self) -> None:
        answer, intent, actions, _diagnostics = compose_travel(
            "Wir sind zu zweit und wollen nach Lima",
            [],
            UnusedStockRepository(),  # type: ignore[arg-type]
            ScriptedExtractor(destination="Lima", traveller_count=2),
            TODAY,
        )

        self.assertEqual(PARTNER_QUESTION, answer)
        self.assertEqual("lima", intent.destination)
        self.assertEqual((), actions)


class OllamaExtractorTest(TestCase):
    def test_requests_schema_output_for_the_whole_conversation(self) -> None:
        captured = {}

        def fake_urlopen(request, timeout):
            captured["payload"] = json.loads(request.data.decode())
            return FakeResponse({"message": {"content": json.dumps({"destination": "Lima", "traveller_count": 2, "unexpected": "ignored"})}})

        turns = [
            AdvisorConversationTurn(role="customer", content="to lima"),
            AdvisorConversationTurn(role="advisor", content="Which city would you like to depart from?"),
            AdvisorConversationTurn(role="customer", content="Berlin"),
        ]
        with patch("cct.core_processes.customer_care.travel_intent_extraction.urlopen", fake_urlopen):
            fields = OllamaTravelIntentExtractor(base_url="http://model").extract(turns, TODAY)

        self.assertEqual(("Lima", 2), (fields.destination, fields.traveller_count))
        payload = captured["payload"]
        # Every key is required so the model cannot silently skip a stated fact.
        self.assertEqual(set(ExtractedTravelFields.model_fields), set(payload["format"]["required"]))
        self.assertIn("Rio de Janeiro", payload["messages"][0]["content"])
        self.assertEqual(0, payload["options"]["temperature"])
        self.assertIn("Today is 2026-09-16", payload["messages"][1]["content"])
        self.assertIn("advisor: Which city would you like to depart from?", payload["messages"][1]["content"])

    def test_invalid_model_output_is_reported_as_unavailable(self) -> None:
        response = FakeResponse({"message": {"content": "not json"}})
        with patch("cct.core_processes.customer_care.travel_intent_extraction.urlopen", lambda request, timeout: response):
            with self.assertRaises(AdvisorUnavailable):
                OllamaTravelIntentExtractor().extract(_customer("to lima"), TODAY)
