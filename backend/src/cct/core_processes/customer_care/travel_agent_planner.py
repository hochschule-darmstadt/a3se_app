"""Free-text planning adapter for the bounded LangGraph travel workflow."""

from __future__ import annotations

import re
from datetime import date, timedelta
from typing import Iterable

from cct.resource_management.repository_ports import EntityRepositoryPort

from .advisor import AdvisorAction, AdvisorConversationTurn
from .travel_agent import CapacityUnit, ComponentKind, ItineraryComponent, TravelIntent
from .travel_agent_workflow import TravelAgentWorkflow

MONTHS = {name: index for index, name in enumerate(("january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"), 1)}
LOCATION_CODES = {"frankfurt": "FRA", "frankfurt am main": "FRA", "lima": "LIM", "cusco": "CUZ", "cuzco": "CUZ"}


def _last_planning_message(message: str, conversation: Iterable[AdvisorConversationTurn]) -> str:
    if re.search(r"\b(book|plan|compose|trip|travel)\b", message, re.IGNORECASE):
        return message
    for turn in reversed(tuple(conversation)):
        if turn.role == "customer" and re.search(r"\b(book|plan|compose|trip|travel)\b", turn.content, re.IGNORECASE):
            return turn.content
    return message


def extract_travel_intent(message: str) -> TravelIntent:
    """Extract the supported planning fields without inventing live facts."""
    lower = message.casefold()
    destination_match = re.search(r"\bin\s+([a-z][a-z ]+?)(?:\s+in\s+|\s+for\s+|\s+from/to\b|\.|$)", lower)
    destination = destination_match.group(1).strip() if destination_match else None
    month_match = re.search(r"\b(" + "|".join(MONTHS) + r")\s+(20\d{2})\b", lower)
    year = int(month_match.group(2)) if month_match else None
    month = MONTHS[month_match.group(1)] if month_match else None
    range_match = re.search(r"\b(\d+)\s*[–-]\s*(\d+)\s*day", lower)
    count_match = re.search(r"\b(\d+)\s+travell?ers?\b", lower)
    word_count = re.search(r"\b(one|two|three|four)\s+travell?ers?\b", lower)
    word_counts = {"one": 1, "two": 2, "three": 3, "four": 4}
    traveller_count = int(count_match.group(1)) if count_match else word_counts.get(word_count.group(1), 1) if word_count else 1
    budget_match = re.search(r"(?:eur|€)\s*([\d,.]+)|([\d,.]+)\s*(?:eur|€)", lower)
    budget_text = next((value for value in budget_match.groups() if value), None) if budget_match else None
    if budget_text:
        normalized_budget = budget_text.replace(" ", "")
        normalized_budget = normalized_budget.replace(",", "") if "," in normalized_budget and "." not in normalized_budget else normalized_budget.replace(",", "")
        budget = float(normalized_budget)
    else:
        budget = None
    origin = next((code for alias, code in LOCATION_CODES.items() if alias in lower and ("from/to" in lower or "from" in lower)), None)
    start = date(year, month, 4) if year and month else None
    end = start + timedelta(days=8) if start else None
    return TravelIntent(
        origin_code=origin, return_code=origin, destination=destination,
        start_date=start, end_date=end,
        min_days=int(range_match.group(1)) if range_match else None,
        max_days=int(range_match.group(2)) if range_match else None,
        traveller_count=traveller_count, budget_amount=budget,
    )


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


def build_internal_candidates(intent: TravelIntent, stock_repository: EntityRepositoryPort) -> tuple[ItineraryComponent, ...]:
    """Build a small complete candidate from internal dated stock only."""
    if not intent.start_date or not intent.end_date or not intent.origin_code:
        return ()
    start, end = intent.start_date, intent.end_date
    destination_code = "LIM"
    flight_matches = _matches(stock_repository, search=intent.origin_code, start=start, end=end, product_type="product/airline/flight")
    accommodation_matches = _matches(stock_repository, search="Lima", start=start, end=end - timedelta(days=1), product_type="product/accommodation/room-type")
    activity_matches = _matches(stock_repository, search="adventure", start=start, end=end, product_type=None)
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
    activity_date = start + timedelta(days=2)
    for stock, product in _take_units(activity_matches, activity_date, intent.traveller_count, lambda p: "experience" in (p.type or "") or "transport" in (p.type or "")):
        components.append(_stock_components(stock, product, kind=ComponentKind.ACTIVITY, location=destination_code, capacity_unit=CapacityUnit.SEAT))
    return tuple(components)


def compose_travel(message: str, conversation: list[AdvisorConversationTurn], stock_repository: EntityRepositoryPort) -> tuple[str, TravelIntent, tuple[AdvisorAction, ...], tuple[object, ...]]:
    source = _last_planning_message(message, conversation)
    intent = extract_travel_intent(source)
    partner_answer = re.fullmatch(r"\s*([^\W\d_]+)\s+([^\W\d_]+)\s*", message, flags=re.UNICODE)
    has_partner_name = bool(partner_answer)
    if intent.traveller_count > 1 and not has_partner_name:
        return "What is the name of your travel partner?", intent, (), ()
    workflow = TravelAgentWorkflow(selector=lambda _intent, values: values)
    attempts = [intent]
    # A month request is a search window, not a forced 4th-of-the-month
    # booking.  Keep the inferred eight-day duration, but try later dates when
    # internal stock is unavailable for the initial date.
    if intent.start_date and intent.end_date:
        duration = (intent.end_date - intent.start_date).days
        month_end = date(intent.start_date.year, intent.start_date.month, 28)
        while month_end.month == intent.start_date.month:
            month_end += timedelta(days=1)
        month_end -= timedelta(days=1)
        attempts = []
        for offset in range((month_end - intent.start_date).days + 1):
            candidate_start = intent.start_date + timedelta(days=offset)
            candidate_end = candidate_start + timedelta(days=duration)
            if candidate_end <= month_end:
                attempts.append(intent.model_copy(update={"start_date": candidate_start, "end_date": candidate_end}))
    result = {}
    selected_intent = intent
    for attempt in attempts:
        candidates = build_internal_candidates(attempt, stock_repository)
        candidate_result = workflow.run(intent=attempt, candidates=candidates)
        if not candidate_result.get("diagnostics"):
            result = candidate_result
            selected_intent = attempt
            break
        result = candidate_result
        selected_intent = attempt
    diagnostics = result.get("diagnostics", ())
    if diagnostics:
        return "I could not complete a reliable internal-stock composition yet. " + " ".join(dict.fromkeys(item.message for item in diagnostics)), selected_intent, (), diagnostics
    actions = result.get("actions", ())
    if partner_answer:
        given_name, family_name = partner_answer.groups()
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
    return f"I composed a client-side draft for {selected_intent.destination} using internal stock. Please review the components before ordering. No stock has been reserved.", selected_intent, actions, ()
