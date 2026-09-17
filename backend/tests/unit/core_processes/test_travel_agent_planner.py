"""Regression evidence for follow-up questions and client-draft composition."""

from datetime import date, time, timedelta
from decimal import Decimal
from unittest import TestCase

from cct.core_processes.customer_care.advisor import AdvisorConversationTurn
from cct.core_processes.customer_care.travel_agent_planner import compose_travel
from cct.resource_management.contracts import EntityKind
from cct.resource_management.default_registry import create_entity_registry

from .test_travel_intent_extraction import ScriptedExtractor

TODAY = date(2026, 9, 16)
REGISTRY = create_entity_registry()


def _entity(entity_kind: EntityKind, entity_id: str, type: str, properties: dict[str, object]):
    return REGISTRY.validate({"entityId": entity_id, "entityKind": entity_kind, "type": type, "properties": properties})


class LimaCatalogueRepository:
    """Minimal catalogue with exactly one sellable option per travel need."""

    calls: int

    def __init__(self, start: date, nights: int, origin_code: str = "BER") -> None:
        self.calls = 0
        self._products = {
            "outbound": _entity(EntityKind.TOURISTIC_PRODUCT_ITEM, "PRD-OUT", "product/airline/flight", {
                "flightNumber": "CA501", "departureLocationCode": origin_code, "arrivalLocationCode": "LIM",
                "scheduledDepartureLocalTime": time(8, 15), "scheduledArrivalLocalTime": time(18, 40),
            }),
            "inbound": _entity(EntityKind.TOURISTIC_PRODUCT_ITEM, "PRD-IN", "product/airline/flight", {
                "flightNumber": "CA602", "departureLocationCode": "LIM", "arrivalLocationCode": origin_code,
                "scheduledDepartureLocalTime": time(21, 30), "scheduledArrivalLocalTime": time(16, 5),
            }),
            "room": _entity(EntityKind.TOURISTIC_PRODUCT_ITEM, "PRD-ROOM", "product/accommodation/room-type", {
                "roomTypeCode": "room/double", "name": "Double Room",
            }),
        }
        self._start, self._nights = start, nights

    def _stock(self, key: str, service_date: date):
        product = self._products[key]
        stock_type = "stock/airline/flight" if key != "room" else "stock/accommodation/room-type"
        stock = _entity(EntityKind.STOCK_ITEM, f"STK-{key}-{service_date:%Y%m%d}", stock_type, {
            "serviceDate": service_date, "unitPriceAmount": Decimal("500.00"), "currencyCode": "EUR",
            "capacityQuantity": 4, "remainingCapacity": 4,
        })
        return stock, product

    def list_catalogue_stock_matches(self, *, search, service_date_from, service_date_to, product_type):
        self.calls += 1
        end = self._start + timedelta(days=self._nights)
        matches = []
        if product_type == "product/airline/flight":
            matches = [self._stock("outbound", self._start), self._stock("inbound", end)]
        elif product_type == "product/accommodation/room-type":
            matches = [self._stock("room", self._start + timedelta(days=offset)) for offset in range(self._nights)]
        return tuple(
            match for match in matches
            if service_date_from <= match[0].properties.service_date <= service_date_to
        )


def _turns(*contents: str) -> list[AdvisorConversationTurn]:
    """Build an alternating transcript ending with an advisor question."""
    roles = ("customer", "advisor")
    return [AdvisorConversationTurn(role=roles[index % 2], content=content) for index, content in enumerate(contents)]


class UnusedStockRepository:
    def list_catalogue_stock_matches(self, **_kwargs):
        raise AssertionError("incomplete intent must not query stock")


class TravelAgentPlannerTest(TestCase):
    def test_incomplete_intent_asks_for_dates_instead_of_reporting_success(self) -> None:
        conversation = _turns(
            "book a 5 day trip to lima, 2 persons, with adventure",
            "What is the name of your travel partner?",
            "Ada Kern",
            "Which city would you like to depart from?",
        )

        answer, intent, actions, diagnostics = compose_travel(
            "Frankfurt",
            conversation,
            UnusedStockRepository(),  # type: ignore[arg-type]
            ScriptedExtractor(
                destination="Lima", origin="Frankfurt", min_days=5, max_days=5, traveller_count=2,
                theme="adventure", partner_given_name="Ada", partner_family_name="Kern",
            ),
            TODAY,
        )

        self.assertEqual("lima", intent.destination)
        self.assertEqual("FRA", intent.origin_code)
        self.assertIn("When would you like to travel?", answer)
        self.assertNotIn("draft for None", answer)
        self.assertEqual((), actions)
        self.assertEqual((), diagnostics)

    def test_open_month_composes_client_actions_without_claiming_a_booking(self) -> None:
        conversation = _turns(
            "book a 5 day trip to lima, 2 persons, with adventure",
            "What is the name of your travel partner?",
            "Hannelore Stremme",
            "Which city would you like to depart from?",
            "Berlin",
            "When would you like to travel?",
        )

        repository = LimaCatalogueRepository(date(2027, 1, 1), 5)
        answer, intent, actions, diagnostics = compose_travel(
            "some time in january - feel free. should be 5 days",
            conversation,
            repository,  # type: ignore[arg-type]
            ScriptedExtractor(
                destination="Lima", origin="Berlin", travel_month=1, min_days=5, max_days=5, traveller_count=2,
                theme="adventure", partner_given_name="Hannelore", partner_family_name="Stremme",
            ),
            TODAY,
        )

        self.assertEqual((), diagnostics)
        # One read per component family for the whole window, not per arrival
        # date: scanning a month per date made the advisor appear to hang.
        self.assertEqual(3, repository.calls)
        self.assertEqual(date(2027, 1, 1), intent.start_date)
        self.assertEqual(date(2027, 1, 6), intent.end_date)
        self.assertNotRegex(answer, r"(?i)(booked|confirmed)")
        self.assertIn("Nothing is reserved yet", answer)
        self.assertEqual("add-traveller", actions[0].type)
        self.assertEqual("Hannelore Stremme", actions[0].display_name)
        # Two flights plus one room per night, proposed as client draft actions.
        self.assertEqual(7, sum(1 for action in actions if action.type == "add-position"))

    def test_country_destination_uses_stock_in_that_country(self) -> None:
        """A customer who names a country must not be told there is no stock.

        Live run: "a travel to Peru ... from Frankfurt to lima" was refused
        because "Peru" names two airports and resolved to none of them.
        """
        conversation = _turns(
            "book a travel to Peru in June 2027, together with my husband "
            "we want to stay 3 weeks go from Frankfurt to lima",
            "What is the name of your travel partner?",
        )

        repository = LimaCatalogueRepository(date(2027, 6, 1), 21, origin_code="FRA")
        answer, intent, actions, diagnostics = compose_travel(
            "Bernhard Humm",
            conversation,
            repository,  # type: ignore[arg-type]
            ScriptedExtractor(
                destination="Peru", origin="Frankfurt", travel_month=6, travel_year=2027,
                min_days=21, max_days=21, traveller_count=2,
                partner_given_name="Bernhard", partner_family_name="Humm",
            ),
            TODAY,
        )

        self.assertEqual((), diagnostics)
        self.assertNotIn("I do not have internal stock", answer)
        # The draft is for one city, so the answer says which one.
        self.assertIn("Lima, Peru", answer)
        self.assertEqual((date(2027, 6, 1), date(2027, 6, 22)), (intent.start_date, intent.end_date))
        self.assertEqual("Bernhard Humm", actions[0].display_name)
        # Two flights plus one room per night of the three weeks.
        self.assertEqual(23, sum(1 for action in actions if action.type == "add-position"))

    def test_an_unknown_destination_is_still_reported_as_missing_stock(self) -> None:
        answer, _intent, actions, diagnostics = compose_travel(
            "two weeks in Reykjavik from Berlin in March 2027, my partner Ada Kern comes along",
            [],
            UnusedStockRepository(),  # type: ignore[arg-type]
            ScriptedExtractor(
                destination="Reykjavik", origin="Berlin", travel_month=3, travel_year=2027,
                min_days=14, max_days=14, traveller_count=2,
                partner_given_name="Ada", partner_family_name="Kern",
            ),
            TODAY,
        )

        self.assertEqual("DESTINATION-UNKNOWN", diagnostics[0].rule_id)
        self.assertIn("I do not have internal stock for reykjavik yet.", answer)
        self.assertEqual((), actions)
