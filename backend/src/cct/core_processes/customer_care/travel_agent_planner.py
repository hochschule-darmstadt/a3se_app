"""Free-text planning adapter for the bounded LangGraph travel workflow.

A ``TravelIntentExtractor`` (the local model) interprets the whole
conversation.  This adapter treats that output as untrusted: it grounds names
and places in what the customer actually wrote,
validates dates and bounds, and derives search windows deterministically.  The
adapter never books anything; it proposes client-side draft actions that the
browser applies to My Travel until the customer orders.
"""

from __future__ import annotations

import re
from calendar import monthrange
from dataclasses import dataclass
from datetime import date, timedelta
from itertools import product as cross_product
from typing import Sequence

from cct.resource_management.repository_ports import EntityRepositoryPort

from .advisor import AdvisorAction, AdvisorConversationTurn
from .travel_agent import CapacityUnit, ComponentKind, ItineraryComponent, ItineraryDiagnostic, TravelIntent
from .travel_agent_workflow import TravelAgentWorkflow
from .travel_intent_extraction import (
    LOCATION_CODE_GROUPS,
    ExtractedTravelFields,
    TravelIntentExtractor,
    location_code,
    location_group_match,
    location_match,
    location_name,
)

MONTH_NAMES = ("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
PARTNER_QUESTION = "What is the name of your travel partner?"
DATE_QUESTION = (
    "When would you like to travel? Exact dates such as 2027-01-04 to 2027-01-09 work, "
    "and so does an open month such as January 2027."
)
_NAME_PART = re.compile(r"^[^\W\d_][^\W\d_' -]*$", re.UNICODE)
_THEME = re.compile(r"^[a-z][a-z -]{2,39}$")
# Travel is planned at most this far ahead; later years are misreadings.
_MAX_YEARS_AHEAD = 2


@dataclass(frozen=True, slots=True)
class PlanningRequest:
    """Everything the conversation has established about one travel wish."""

    intent: TravelIntent
    window_start: date | None = None
    window_end: date | None = None
    window_label: str | None = None
    destination_codes: tuple[str, ...] = ()
    origin_text: str | None = None
    partner_name: tuple[str, str] | None = None
    theme: str | None = None


def _customer_words(turns: Sequence[AdvisorConversationTurn]) -> set[str]:
    return {word for turn in turns if turn.role == "customer" for word in re.findall(r"[^\W\d_]+", turn.content.casefold())}


def _aliases_of(code: str) -> tuple[str, ...]:
    return tuple(alias for alias, codes in LOCATION_CODE_GROUPS.items() if codes == (code,))


def _customer_named(code: str, words: set[str]) -> bool:
    """Did the customer write this very place, rather than only its country?"""
    return any(word in words for alias in _aliases_of(code) for word in re.findall(r"[^\W\d_]{3,}", alias))


def _grounded(value: str, words: set[str], *, codes: Sequence[str] = ()) -> bool:
    """Accept a model value only if the customer wrote part of it.

    Aliases of a resolved location count too, so "Rio" grounds
    "Rio de Janeiro".  Ungrounded values are dropped rather than trusted.
    """
    candidates = [value, *(alias for code in codes for alias in _aliases_of(code))]
    return any(word in words for candidate in candidates for word in re.findall(r"[^\W\d_]{3,}", candidate.casefold()))


def _place(value: str | None, words: set[str]) -> tuple[str | None, str | None]:
    """Return a grounded place text and its unambiguous location code."""
    text, codes = _destination_place(value, words)
    return text, codes[0] if len(codes) == 1 else None


def _destination_place(value: str | None, words: set[str]) -> tuple[str | None, tuple[str, ...]]:
    """Return a grounded place text and every location code it can mean.

    A country destination such as "Peru" covers several airports; each is a
    candidate the planner tries, preferring one the customer named themselves.
    """
    text = (value or "").strip(" .,;:!?")
    if not text or len(text) > 100:
        return None, ()
    match = location_group_match(text)
    codes = match[1] if match else ()
    if not _grounded(text, words, codes=codes):
        return None, ()
    ordered = sorted(codes, key=lambda code: not _customer_named(code, words))
    # The resolved alias is also the catalogue search term: "Lima, Peru"
    # must search for "lima", not the whole phrase.
    return (match[0] if match else text.casefold()), tuple(ordered)


def _iso_date(value: str | None, today: date) -> date | None:
    try:
        parsed = date.fromisoformat((value or "").strip())
    except ValueError:
        return None
    return parsed if today <= parsed <= date(today.year + _MAX_YEARS_AHEAD, 12, 31) else None


def _month_window(month: int | None, year: int | None, today: date) -> tuple[date, date, str] | None:
    """Interpret an open month as a search window that is not in the past."""
    if not month or not 1 <= month <= 12:
        return None
    if not year or not today.year <= year <= today.year + _MAX_YEARS_AHEAD or (year, month) < (today.year, today.month):
        # A missing, implausible, or already past year means the next such month.
        year = today.year if month >= today.month else today.year + 1
    end = date(year, month, monthrange(year, month)[1])
    return date(year, month, 1), end, f"{MONTH_NAMES[month - 1]} {year}"


def _duration(fields: ExtractedTravelFields) -> tuple[int | None, int | None]:
    values = [value for value in (fields.min_days, fields.max_days) if value and 1 <= value <= 365]
    return (min(values), max(values)) if values else (None, None)


def _partner(fields: ExtractedTravelFields, words: set[str]) -> tuple[str, str] | None:
    """Accept a partner name only as the customer wrote it: identity is never invented."""
    given, family = (fields.partner_given_name or "").strip(), (fields.partner_family_name or "").strip()
    parts = (given, family)
    if not all(part and len(part) <= 100 and _NAME_PART.match(part) for part in parts):
        return None
    if not all(word in words for part in parts for word in re.findall(r"[^\W\d_]+", part.casefold())):
        return None
    return given, family


def normalise_travel_fields(fields: ExtractedTravelFields, turns: Sequence[AdvisorConversationTurn], today: date) -> PlanningRequest:
    """Validate extracted fields into a planning request; invalid facts become missing."""
    words = _customer_words(turns)
    destination, destination_codes = _destination_place(fields.destination, words)
    origin_text, origin_code = _place(fields.origin, words)
    start, end = _iso_date(fields.start_date, today), _iso_date(fields.end_date, today)
    if start and fields.travel_month == start.month:
        # Exact dates plus the open month containing them contradict the
        # extraction contract; live runs showed the model padding "next
        # spring" into a whole month of dates.  Searching the month is safe,
        # fixing invented dates is not.
        start = end = None
    if not start or (end and end <= start):
        end = None
    window = None if start else _month_window(fields.travel_month, fields.travel_year, today)
    min_days, max_days = _duration(fields)
    if start and end and min_days and not min_days <= (end - start).days <= (max_days or min_days):
        # Exact dates are more specific than a trip length stated before them.
        min_days = max_days = None
    count = fields.traveller_count if fields.traveller_count and 1 <= fields.traveller_count <= 20 else 1
    budget = fields.budget_amount if fields.budget_amount and fields.budget_amount > 0 else None
    theme = (fields.theme or "").strip().casefold()
    intent = TravelIntent(
        origin_code=origin_code,
        return_code=origin_code,
        destination=destination,
        start_date=start,
        end_date=end,
        min_days=min_days,
        max_days=max_days,
        traveller_count=count,
        budget_amount=budget,
    )
    return PlanningRequest(
        intent=intent,
        window_start=window[0] if window else None,
        window_end=window[1] if window else None,
        window_label=window[2] if window else None,
        destination_codes=destination_codes,
        origin_text=origin_text,
        partner_name=_partner(fields, words),
        theme=theme if _THEME.match(theme) else None,
    )


def build_planning_request(
    turns: Sequence[AdvisorConversationTurn],
    extractor: TravelIntentExtractor,
    today: date | None = None,
) -> PlanningRequest:
    """Interpret the whole conversation into one validated request."""
    today = today or date.today()
    fields = extractor.extract(turns, today)
    return normalise_travel_fields(fields, turns, today)



def _product_properties(product) -> dict[str, object]:
    return product.properties.model_dump(by_alias=True, exclude_none=True)


def _stock_components(stock, product, *, kind: ComponentKind, location: str | None = None, from_code: str | None = None, to_code: str | None = None, end_date: date | None = None, capacity_unit: CapacityUnit | None = None) -> ItineraryComponent:
    props = stock.properties
    projection = _product_properties(product)
    if kind is ComponentKind.TRANSPORT and projection.get("flightNumber") and from_code and to_code:
        display_name_chain = ("Flight", f"{projection['flightNumber']} {from_code}–{to_code}")
    elif kind is ComponentKind.ACCOMMODATION:
        room_labels = {
            "room/single": "Single room",
            "room/double": "Double room",
            "room/twin": "Twin room",
            "room/triple": "Triple room",
            "room/family": "Family room",
            "room/adjoining": "Adjoining rooms",
            "room/suite": "Suite",
        }
        display_name_chain = (room_labels.get(str(projection.get("roomTypeCode")), str(projection.get("roomTypeCode", "Accommodation"))),)
    else:
        display_name_chain = tuple(str(value) for value in projection.get("name", "").split(" ") if value) or (product.entity_id,)
    return ItineraryComponent(
        component_id=stock.entity_id, product_id=product.entity_id,
        display_name_chain=display_name_chain,
        kind=kind, location_code=location, from_code=from_code, to_code=to_code,
        service_date=props.service_date, end_date=end_date,
        unit_price=float(props.unit_price_amount), currency=props.currency_code,
        capacity_unit=capacity_unit, available_capacity=props.remaining_capacity,
    )


def _matches(repository: EntityRepositoryPort, *, search: str, start: date, end: date, product_type: str | None = None):
    return list(repository.list_catalogue_stock_matches(search=search, service_date_from=start, service_date_to=end, product_type=product_type))


def _take_units(matches, service_date: date, traveller_count: int, predicate) -> list[tuple[object, object]]:
    """Select one coherent stock service that can serve the whole party.

    The browser creates one client position per traveller from the returned
    action.  Consequently the selected stock item must have enough remaining
    capacity for the whole party; selecting two unrelated alternatives (for
    example two different outbound flights) would create an invalid itinerary.
    """
    eligible = [
        (stock, product)
        for stock, product in matches
        if stock.properties.service_date == service_date
        and stock.properties.remaining_capacity >= traveller_count
        and predicate(product)
    ]
    return eligible[:1]


@dataclass(frozen=True, slots=True)
class CandidatePool:
    """Dated stock for the whole search window, read once.

    An open month is checked arrival date by arrival date.  Reading the
    catalogue per candidate date would issue three graph queries for each day
    of the month; the search window is read once instead and every candidate
    date is then evaluated in memory.
    """

    flights: tuple[tuple[object, object], ...] = ()
    accommodation: tuple[tuple[object, object], ...] = ()
    activities: tuple[tuple[object, object], ...] = ()

    @classmethod
    def load(
        cls,
        stock_repository: EntityRepositoryPort,
        *,
        origin_code: str,
        destination: str,
        theme: str | None,
        start: date,
        end: date,
    ) -> "CandidatePool":
        return cls(
            flights=tuple(_matches(stock_repository, search=origin_code, start=start, end=end, product_type="product/airline/flight")),
            accommodation=tuple(_matches(stock_repository, search=destination, start=start, end=end, product_type="product/accommodation/room-type")),
            activities=tuple(_matches(stock_repository, search=theme or destination, start=start, end=end, product_type=None)),
        )


def build_internal_candidates(
    intent: TravelIntent,
    pool: CandidatePool,
    *,
    destination_code: str | None = None,
) -> tuple[ItineraryComponent, ...]:
    """Build a small complete candidate from internal dated stock only."""
    destination_code = destination_code or (location_code(intent.destination) if intent.destination else None)
    if not intent.start_date or not intent.end_date or not intent.origin_code or not destination_code:
        return ()
    start, end = intent.start_date, intent.end_date
    flight_matches = pool.flights
    accommodation_matches = pool.accommodation
    activity_matches = pool.activities
    components: list[ItineraryComponent] = []
    for stock, product in _take_units(
        flight_matches,
        start,
        intent.traveller_count,
        lambda p: _product_properties(p).get("departureLocationCode") == intent.origin_code
        and _product_properties(p).get("arrivalLocationCode") == destination_code,
    ):
        props = _product_properties(product)
        components.append(_stock_components(stock, product, kind=ComponentKind.TRANSPORT, from_code=str(props.get("departureLocationCode")), to_code=str(props.get("arrivalLocationCode")), capacity_unit=CapacityUnit.SEAT))
    for stock, product in _take_units(flight_matches, end, intent.traveller_count, lambda p: _product_properties(p).get("arrivalLocationCode") == intent.return_code and _product_properties(p).get("departureLocationCode") == destination_code):
        props = _product_properties(product)
        components.append(_stock_components(stock, product, kind=ComponentKind.TRANSPORT, from_code=str(props.get("departureLocationCode")), to_code=str(props.get("arrivalLocationCode")), capacity_unit=CapacityUnit.SEAT))
    for night_offset in range((end - start).days):
        night = start + timedelta(days=night_offset)
        units = _take_units(
            accommodation_matches,
            night,
            intent.traveller_count,
            lambda p: _product_properties(p).get("roomTypeCode") == "room/double",
        )
        if not units:
            units = _take_units(accommodation_matches, night, intent.traveller_count, lambda _p: True)
        components.extend(_stock_components(stock, product, kind=ComponentKind.ACCOMMODATION, location=destination_code, end_date=night + timedelta(days=1), capacity_unit=CapacityUnit.BED) for stock, product in units)
    activity_date = start + timedelta(days=min(2, max((end - start).days - 1, 0)))
    for stock, product in _take_units(activity_matches, activity_date, intent.traveller_count, lambda p: "experience" in (p.type or "") or "transport" in (p.type or "")):
        components.append(_stock_components(stock, product, kind=ComponentKind.ACTIVITY, location=destination_code, capacity_unit=CapacityUnit.SEAT))
    return tuple(components)


def _next_question(request: PlanningRequest) -> str | None:
    """Ask for one missing fact at a time, accepting open travel dates."""
    intent = request.intent
    if not intent.destination:
        return "Where would you like to travel to?"
    if intent.traveller_count > 1 and not request.partner_name:
        return PARTNER_QUESTION
    if not intent.origin_code:
        return "Which city would you like to depart from?"
    if not intent.start_date and not request.window_start:
        return DATE_QUESTION
    if not intent.end_date and not intent.min_days:
        return "How many days should the trip last?"
    return None


def _date_attempts(request: PlanningRequest) -> tuple[TravelIntent, ...]:
    """Expand the request into the arrival dates worth checking, in order.

    Exact dates give exactly one attempt.  An open month gives every arrival
    date of that month, preferring trips that also end inside the month, so
    "some time in January" is searched rather than refused.
    """
    intent = request.intent
    if intent.start_date and intent.end_date:
        return (intent,)
    duration = intent.min_days
    if not duration:
        return ()
    if intent.start_date:
        return (intent.model_copy(update={"end_date": intent.start_date + timedelta(days=duration)}),)
    if not request.window_start or not request.window_end:
        return ()
    inside: list[TravelIntent] = []
    overflowing: list[TravelIntent] = []
    for offset in range((request.window_end - request.window_start).days + 1):
        start = request.window_start + timedelta(days=offset)
        end = start + timedelta(days=duration)
        attempt = intent.model_copy(update={"start_date": start, "end_date": end})
        (inside if end <= request.window_end else overflowing).append(attempt)
    return tuple(inside + overflowing)


def _destination_label(destination: str | None, code: str) -> str:
    """Name the place the draft is actually for, and its country when asked for.

    A customer who asked for "Peru" gets "Lima, Peru": the composed draft is
    for one city, and saying which one keeps the answer honest.
    """
    city = location_name(code) or (destination or "").title()
    region = (destination or "").title()
    return city if region.casefold() in (city.casefold(), "") else f"{city}, {region}"


def _travel_period(intent: TravelIntent) -> str:
    return f"{intent.start_date:%Y-%m-%d} to {intent.end_date:%Y-%m-%d}"


def compose_travel(
    message: str,
    conversation: list[AdvisorConversationTurn],
    stock_repository: EntityRepositoryPort,
    extractor: TravelIntentExtractor,
    today: date | None = None,
    extracted_fields: ExtractedTravelFields | None = None,
) -> tuple[str, TravelIntent, tuple[AdvisorAction, ...], tuple[object, ...]]:
    """Compose a client-side draft proposal; never reserve, book, or order."""
    turns = (*conversation, AdvisorConversationTurn(role="customer", content=message))
    request = normalise_travel_fields(extracted_fields, turns, today or date.today()) if extracted_fields else build_planning_request(turns, extractor, today)
    intent = request.intent
    question = _next_question(request)
    if question:
        return question, intent, (), ()
    if not request.destination_codes:
        return (
            f"I do not have internal stock for {intent.destination} yet.",
            intent,
            (),
            (ItineraryDiagnostic(rule_id="DESTINATION-UNKNOWN", message=f"No internal destination matches {intent.destination}."),),
        )
    workflow = TravelAgentWorkflow(selector=lambda _intent, values: values)
    attempts = _date_attempts(request)
    if not attempts:
        return DATE_QUESTION, intent, (), ()
    pool = CandidatePool.load(
        stock_repository,
        origin_code=str(intent.origin_code),
        destination=str(intent.destination),
        theme=request.theme,
        start=min(attempt.start_date for attempt in attempts),  # type: ignore[type-var]
        end=max(attempt.end_date for attempt in attempts),  # type: ignore[type-var]
    )
    result: dict = {}
    selected_intent = intent
    selected_code = request.destination_codes[0]
    # A country destination covers several airports; each is tried for every
    # candidate date, in the order the customer's own words prefer.
    for attempt, destination_code in cross_product(attempts, request.destination_codes):
        candidate_result = workflow.run(
            intent=attempt,
            candidates=build_internal_candidates(attempt, pool, destination_code=destination_code),
        )
        diagnostics = candidate_result.get("diagnostics", ())
        if not diagnostics:
            result, selected_intent, selected_code = candidate_result, attempt, destination_code
            break
        # When no date in the window works, report the closest attempt rather
        # than whichever date happened to be tried last.
        if not result or len(diagnostics) < len(result.get("diagnostics", ())):
            result, selected_intent, selected_code = candidate_result, attempt, destination_code
    diagnostics = result.get("diagnostics", ())
    if result.get("status") == "awaiting-input" or not result:
        return str(result.get("question") or DATE_QUESTION), selected_intent, (), ()
    if diagnostics:
        searched = request.window_label or _travel_period(selected_intent)
        return (
            f"I could not compose a complete trip from internal stock for {searched}. "
            + " ".join(dict.fromkeys(item.message for item in diagnostics)),
            selected_intent,
            (),
            diagnostics,
        )
    actions = tuple(result.get("actions", ()))
    if request.partner_name:
        given_name, family_name = request.partner_name
        partner_name = f"{given_name} {family_name}"
        partner_id = "traveller-" + re.sub(r"[^a-z0-9]+", "-", partner_name.casefold()).strip("-")
        actions = (AdvisorAction(
            type="add-traveller",
            clientTravellerId=partner_id,
            displayName=partner_name,
            travellerKind="new",
            givenName=given_name,
            familyName=family_name,
        ), *actions)
    return (
        f"I added a draft for {_destination_label(selected_intent.destination, selected_code)}, {_travel_period(selected_intent)}, "
        f"for {selected_intent.traveller_count} traveller(s) to My Travel. "
        "Nothing is reserved yet - please review the components and order when they are right.",
        selected_intent,
        actions,
        (),
    )
