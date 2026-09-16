"""Free-text planning adapter for the bounded LangGraph travel workflow.

Intent is accumulated over the whole conversation: every customer turn may
contribute or correct a field, so a later "some time in January" replaces the
dates stated earlier while an earlier "5 days" still applies.  The adapter
never books anything; it proposes client-side draft actions that the browser
applies to My Travel until the customer orders.
"""

from __future__ import annotations

import re
from collections import Counter
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Sequence

from cct.resource_management.repository_ports import EntityRepositoryPort
from cct.resource_management.touristic_product_management.search import LOCATION_TERMS

from .advisor import AdvisorAction, AdvisorConversationTurn
from .travel_agent import CapacityUnit, ComponentKind, ItineraryComponent, ItineraryDiagnostic, TravelIntent
from .travel_agent_workflow import TravelAgentWorkflow

MONTHS = {name: index for index, name in enumerate(("january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"), 1)}
MONTH_NAMES = tuple(MONTHS)
# Customers write "Jan 2027" as readily as "January 2027".
MONTH_ABBREVIATIONS = {name[:3]: index for name, index in MONTHS.items()} | {"sept": 9}
MONTH_TERMS = MONTHS | MONTH_ABBREVIATIONS


def _unambiguous_location_codes() -> dict[str, str]:
    """Map location aliases to codes, dropping aliases shared by two places.

    ``LOCATION_TERMS`` also carries country names ("Germany" for BER, FRA and
    MUC).  Those cannot identify a departure airport, so they are excluded
    instead of silently resolving to whichever entry happens to come last.
    """
    aliases = [(alias.casefold(), code) for code, terms in LOCATION_TERMS.items() for alias in (code, *terms)]
    occurrences = Counter(alias for alias, _code in aliases)
    return {alias: code for alias, code in aliases if occurrences[alias] == 1}


LOCATION_CODES = _unambiguous_location_codes()
PARTNER_QUESTION = "What is the name of your travel partner?"
DATE_QUESTION = (
    "When would you like to travel? Exact dates such as 2027-01-04 to 2027-01-09 work, "
    "and so does an open month such as January 2027."
)
_ISO_DATE = r"(\d{4}-\d{2}-\d{2})"
_DATE_RANGE = re.compile(_ISO_DATE + r"\s*(?:-|–|—|until|till|through|to)\s*" + _ISO_DATE)
_SINGLE_DATE = re.compile(_ISO_DATE)
_DAY_RANGE = re.compile(r"\b(\d{1,2})\s*(?:-|–|to)\s*(\d{1,2})\s*days?\b")
_DAYS = re.compile(r"\b(\d{1,2})[\s-]*days?\b")
_MONTH = re.compile(r"\b(" + "|".join(sorted(MONTH_TERMS, key=len, reverse=True)) + r")\b\.?(?:\s+(20\d{2}))?")
_PERSON_COUNT = re.compile(r"\b(\d{1,2})\s+(?:travell?ers?|persons?|people|adults?)\b")
_PERSON_WORDS = {"one": 1, "two": 2, "three": 3, "four": 4}
_PERSON_WORD_COUNT = re.compile(r"\b(" + "|".join(_PERSON_WORDS) + r")\s+(?:travell?ers?|persons?|people|adults?)\b")
_BUDGET = re.compile(r"(?:eur|€)\s*([\d,.]+)|([\d,.]+)\s*(?:eur|€)")
_DESTINATION = re.compile(r"\b(?:to|in)\s+([a-z][a-z '-]*?)(?=\s+(?:in|on|for|from/to|from|with|including|incl\.?|and)\b|\s*,|[.;!?]|$)")
_ORIGIN = re.compile(r"\bfrom(/to)?\s+([a-z][a-z .'-]*?)(?=\s+(?:to|in|on|for|with|and)\b|\s*,|[.;!?]|$)")
_THEME = re.compile(r"\b(?:with|including|incl\.?)\s+([a-z]{4,})\b")
_NAME = re.compile(r"^\s*([^\W\d_][^\W\d_'-]*)\s+([^\W\d_][^\W\d_' -]*)\s*$", re.UNICODE)
# Words that follow "to"/"in" but never name a place the catalogue sells.
_NON_DESTINATIONS = set(MONTH_TERMS) | {"me", "you", "us", "day", "days", "travel", "order"}


@dataclass(frozen=True, slots=True)
class PlanningRequest:
    """Everything the conversation has established about one travel wish."""

    intent: TravelIntent
    window_start: date | None = None
    window_end: date | None = None
    window_label: str | None = None
    destination_code: str | None = None
    origin_text: str | None = None
    partner_name: tuple[str, str] | None = None
    theme: str | None = None


def _location_match(text: str) -> tuple[str, str] | None:
    """Resolve the longest matching location alias inside free text."""
    normalized = text.casefold().strip(" .,;:!?")
    for alias in sorted(LOCATION_CODES, key=len, reverse=True):
        if re.search(rf"(?<![a-z]){re.escape(alias)}(?![a-z])", normalized):
            return alias, LOCATION_CODES[alias]
    return None


def _location_code(text: str) -> str | None:
    match = _location_match(text)
    return match[1] if match else None


def _month_window(lower: str, today: date) -> tuple[date, date, str] | None:
    """Interpret a bare month as an open search window, not a fixed date."""
    match = _MONTH.search(lower)
    if not match:
        return None
    month = MONTH_TERMS[match.group(1)]
    if match.group(2):
        year = int(match.group(2))
    else:
        year = today.year if month >= today.month else today.year + 1
    start = date(year, month, 1)
    end = date(year + month // 12, month % 12 + 1, 1) - timedelta(days=1)
    return start, end, f"{MONTH_NAMES[month - 1].capitalize()} {year}"


def _duration(lower: str) -> tuple[int, int] | None:
    range_match = _DAY_RANGE.search(lower)
    if range_match:
        return int(range_match.group(1)), int(range_match.group(2))
    days_match = _DAYS.search(lower)
    return (int(days_match.group(1)), int(days_match.group(1))) if days_match else None


def _explicit_dates(text: str) -> tuple[date | None, date | None]:
    range_match = _DATE_RANGE.search(text)
    if range_match:
        return date.fromisoformat(range_match.group(1)), date.fromisoformat(range_match.group(2))
    single = _SINGLE_DATE.search(text)
    return (date.fromisoformat(single.group(1)), None) if single else (None, None)


def _destination_text(lower: str) -> str | None:
    match = _DESTINATION.search(lower)
    if not match:
        return None
    value = re.split(r"\s+[-–—]\s+", match.group(1).strip())[0].strip()
    known = _location_match(value)
    if known:
        # "to Lima some time in January" must yield the place, not the whole
        # phrase: the phrase is also the catalogue search term.
        return known[0]
    words = value.split()
    if not words or len(words) > 3 or any(word in _NON_DESTINATIONS for word in words):
        # "in January", "to me", "in 5 days" are time or pronoun phrases, not
        # places; treating them as destinations discarded the real one.
        return None
    return value


def _parse_fields(text: str, today: date) -> dict[str, object]:
    """Extract the fields one message states; absent fields stay unset.

    A value of ``None`` is meaningful here: it retracts what an earlier message
    of the same conversation established.
    """
    lower = text.casefold()
    fields: dict[str, object] = {}
    destination = _destination_text(lower)
    if destination:
        fields["destination"] = destination
    origin_match = _ORIGIN.search(lower)
    if origin_match:
        fields["origin_text"] = origin_match.group(2).strip()
    count_match = _PERSON_COUNT.search(lower) or _PERSON_WORD_COUNT.search(lower)
    if count_match:
        value = count_match.group(1)
        fields["traveller_count"] = int(value) if value.isdigit() else _PERSON_WORDS[value]
    budget_match = _BUDGET.search(lower)
    if budget_match:
        budget_text = next(value for value in budget_match.groups() if value)
        fields["budget_amount"] = float(budget_text.replace(",", "").rstrip("."))
    theme_match = _THEME.search(lower)
    if theme_match:
        fields["theme"] = theme_match.group(1)
    duration = _duration(lower)
    if duration:
        fields["min_days"], fields["max_days"] = duration
    start, end = _explicit_dates(text)
    window = _month_window(lower, today)
    if start:
        # Exact dates replace an open month and, unless this message restates
        # one, the duration stated earlier.
        fields.update({"start_date": start, "end_date": end, "window": None})
        if end and not duration:
            fields.update({"min_days": None, "max_days": None})
    elif window:
        # An open month replaces exact dates given earlier.
        fields.update({"window": window, "start_date": None, "end_date": None})
    return fields


def _answers_to(turns: Sequence[AdvisorConversationTurn], marker: str) -> tuple[str, ...]:
    """Return the customer replies that directly answered one advisor question.

    Short replies such as "Berlin" or "Hannelore Stremme" carry no keyword of
    their own; only the question they answer gives them meaning.
    """
    return tuple(
        current.content
        for previous, current in zip(turns, turns[1:])
        if previous.role == "advisor" and marker in previous.content.casefold() and current.role == "customer"
    )


def _partner_name(turns: Sequence[AdvisorConversationTurn]) -> tuple[str, str] | None:
    """Return the partner name the customer supplied, from any earlier turn."""
    found: tuple[str, str] | None = None
    for answer in _answers_to(turns, "travel partner"):
        match = _NAME.match(answer)
        if match:
            found = (match.group(1), match.group(2).strip())
    return found


def build_planning_request(turns: Sequence[AdvisorConversationTurn], today: date | None = None) -> PlanningRequest:
    """Accumulate every customer turn of the conversation into one request."""
    today = today or date.today()
    merged: dict[str, object] = {}
    for turn in turns:
        if turn.role == "customer":
            merged.update(_parse_fields(turn.content, today))
    window = merged.get("window")
    origin_text = merged.get("origin_text")
    origin_code = _location_code(str(origin_text)) if origin_text else None
    if not origin_code:
        for answer in _answers_to(turns, "depart from"):
            origin_code = _location_code(answer) or origin_code
            origin_text = answer if origin_code else origin_text
    destination = merged.get("destination")
    intent = TravelIntent(
        origin_code=origin_code,
        return_code=origin_code,
        destination=str(destination) if destination else None,
        start_date=merged.get("start_date"),  # type: ignore[arg-type]
        end_date=merged.get("end_date"),  # type: ignore[arg-type]
        min_days=merged.get("min_days"),  # type: ignore[arg-type]
        max_days=merged.get("max_days"),  # type: ignore[arg-type]
        traveller_count=int(merged.get("traveller_count", 1) or 1),
        budget_amount=merged.get("budget_amount"),  # type: ignore[arg-type]
    )
    return PlanningRequest(
        intent=intent,
        window_start=window[0] if window else None,  # type: ignore[index]
        window_end=window[1] if window else None,  # type: ignore[index]
        window_label=window[2] if window else None,  # type: ignore[index]
        destination_code=_location_code(str(destination)) if destination else None,
        origin_text=str(origin_text) if origin_text else None,
        partner_name=_partner_name(turns),
        theme=str(merged["theme"]) if merged.get("theme") else None,
    )


def extract_travel_intent(message: str, today: date | None = None) -> TravelIntent:
    """Extract the supported planning fields of a single message."""
    return build_planning_request((AdvisorConversationTurn(role="customer", content=message),), today).intent


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
    destination_code = destination_code or (_location_code(intent.destination) if intent.destination else None)
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


def _travel_period(intent: TravelIntent) -> str:
    return f"{intent.start_date:%Y-%m-%d} to {intent.end_date:%Y-%m-%d}"


def compose_travel(
    message: str,
    conversation: list[AdvisorConversationTurn],
    stock_repository: EntityRepositoryPort,
    today: date | None = None,
) -> tuple[str, TravelIntent, tuple[AdvisorAction, ...], tuple[object, ...]]:
    """Compose a client-side draft proposal; never reserve, book, or order."""
    turns = (*conversation, AdvisorConversationTurn(role="customer", content=message))
    request = build_planning_request(turns, today)
    intent = request.intent
    question = _next_question(request)
    if question:
        return question, intent, (), ()
    if not request.destination_code:
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
    for attempt in attempts:
        candidate_result = workflow.run(
            intent=attempt,
            candidates=build_internal_candidates(attempt, pool, destination_code=request.destination_code),
        )
        diagnostics = candidate_result.get("diagnostics", ())
        if not diagnostics:
            result, selected_intent = candidate_result, attempt
            break
        # When no date in the window works, report the closest attempt rather
        # than whichever date happened to be tried last.
        if not result or len(diagnostics) < len(result.get("diagnostics", ())):
            result, selected_intent = candidate_result, attempt
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
        f"I added a draft for {(selected_intent.destination or '').title()}, {_travel_period(selected_intent)}, "
        f"for {selected_intent.traveller_count} traveller(s) to My Travel. "
        "Nothing is reserved yet - please review the components and order when they are right.",
        selected_intent,
        actions,
        (),
    )
