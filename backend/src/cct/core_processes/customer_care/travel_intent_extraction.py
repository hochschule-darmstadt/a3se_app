"""Language interpretation for the AI travel agent.

The local model reads the whole conversation and fills a fixed JSON schema.
Its output is raw, untrusted interpretation: the planner validates, grounds,
and normalises every field before it influences a catalogue search.  Like the
database, the model is a required dependency: when it is unavailable the
compose service fails with ``AdvisorUnavailable`` (HTTP 503).
"""

from __future__ import annotations

import json
import os
import re
from collections import Counter
from datetime import date
from typing import Protocol, Sequence
from urllib.error import URLError
from urllib.request import Request, urlopen

from pydantic import BaseModel, ConfigDict, Field, ValidationError

from cct.resource_management.touristic_product_management.search import LOCATION_TERMS

from .advisor import AdvisorConversationTurn, AdvisorUnavailable, format_conversation


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


def location_match(text: str) -> tuple[str, str] | None:
    """Resolve the longest matching location alias inside free text."""
    normalized = text.casefold().strip(" .,;:!?")
    for alias in sorted(LOCATION_CODES, key=len, reverse=True):
        if re.search(rf"(?<![a-z]){re.escape(alias)}(?![a-z])", normalized):
            return alias, LOCATION_CODES[alias]
    return None


def location_code(text: str) -> str | None:
    match = location_match(text)
    return match[1] if match else None


class ExtractedTravelFields(BaseModel):
    """Planning facts as interpreted from the conversation, not yet trusted.

    Every field is optional: absent means the customer has not (or no longer)
    stated it.  Values are deliberately loose so a slightly malformed model
    answer is normalised by the planner instead of failing the whole turn.
    """

    model_config = ConfigDict(extra="ignore")

    destination: str | None = Field(default=None, description="Place the customer wants to travel to, as an English place name.")
    origin: str | None = Field(default=None, description="City the customer wants to depart from and return to.")
    start_date: str | None = Field(default=None, description="Exact arrival date as YYYY-MM-DD, only if the customer fixed a day.")
    end_date: str | None = Field(default=None, description="Exact return/checkout date as YYYY-MM-DD, only if the customer fixed a day.")
    travel_month: int | None = Field(default=None, description="Month 1-12 when the customer gave an open month instead of exact dates.")
    travel_year: int | None = Field(default=None, description="Year of travel_month, only if the customer stated it.")
    min_days: int | None = Field(default=None, description="Shortest acceptable trip length in days.")
    max_days: int | None = Field(default=None, description="Longest acceptable trip length in days.")
    traveller_count: int | None = Field(default=None, description="Number of travellers including the customer.")
    budget_amount: float | None = Field(default=None, description="Total budget in EUR.")
    theme: str | None = Field(default=None, description="One English keyword for the desired activity, e.g. adventure.")
    partner_given_name: str | None = Field(default=None, description="Given name of the travel partner, only as the customer wrote it.")
    partner_family_name: str | None = Field(default=None, description="Family name of the travel partner, only as the customer wrote it.")


def response_schema() -> dict:
    """JSON schema with every field required (nullable).

    Ollama constrains generation by the schema; optional properties may simply
    be skipped, which live runs showed dropping stated destinations and dates.
    Requiring each key makes the model decide on every fact explicitly.
    """
    schema = ExtractedTravelFields.model_json_schema()
    schema["required"] = list(schema["properties"])
    return schema


class TravelIntentExtractor(Protocol):
    def extract(self, turns: Sequence[AdvisorConversationTurn], today: date) -> ExtractedTravelFields: ...


_EXTRACTION_INSTRUCTIONS = """\
You extract travel planning facts for a tour operator from a conversation.
Return JSON matching the schema. Use null for every fact the customer has not stated.

Rules:
- Only the customer's statements are facts. Advisor turns only explain what a short customer reply answers (e.g. "Berlin" after "Which city would you like to depart from?").
- The customer may correct earlier statements; the latest statement wins. A retracted fact becomes null.
- Never guess or invent names, places, dates, counts, or budgets.
- start_date and end_date only when the customer named a specific day (e.g. "2027-01-04", "4 January", "next Monday"); resolve it against today's date into YYYY-MM-DD. Never derive exact dates from a month, season, or trip length.
- An open period ("some time in January", "im Februar") is travel_month (and travel_year only if stated) with start_date and end_date null. For a season use its first month (spring = March, summer = June, autumn = September, winter = December).
- If the customer gives exact start and end dates, set them, clear travel_month/travel_year, and omit min_days/max_days unless a trip length was stated after those dates.
- Trip length: "5 days" gives min_days=max_days=5, "a week" gives 7, "5 to 7 days" gives 5 and 7.
- traveller_count includes the customer: "my wife and I" or "two persons" is 2.
- Write place names in English (e.g. "Lissabon" -> "Lisbon"). When the customer means one of these known places, use exactly this name: {known_places}.
- theme is null unless the customer named a kind of activity; then give it as one English keyword.
- Before answering, check each field against the conversation: destination, origin, dates or month, trip length, travellers, budget, partner name.
"""


# Canonical city names only; the planner still grounds the model's choice in
# the customer's own words before resolving it to a location code.
_KNOWN_PLACES = ", ".join(terms[0] for terms in LOCATION_TERMS.values())


class OllamaTravelIntentExtractor:
    """Structured-output extraction through the local Ollama chat endpoint."""

    def __init__(self, *, base_url: str = "http://ollama:11434", model: str = "qwen3:8b", timeout: float = 60) -> None:
        self._url = f"{base_url.rstrip('/')}/api/chat"
        self._model = model
        self._timeout = timeout

    def extract(self, turns: Sequence[AdvisorConversationTurn], today: date) -> ExtractedTravelFields:
        payload = {
            "model": self._model,
            "stream": False,
            "keep_alive": "10m",
            "think": False,
            "options": {"temperature": 0},
            "format": response_schema(),
            "messages": [
                {"role": "system", "content": _EXTRACTION_INSTRUCTIONS.format(known_places=_KNOWN_PLACES)},
                {"role": "user", "content": f"Today is {today:%Y-%m-%d} ({today:%A}).\n\nConversation:\n{format_conversation(list(turns))}"},
            ],
        }
        request = Request(self._url, data=json.dumps(payload).encode(), headers={"Content-Type": "application/json"})
        try:
            with urlopen(request, timeout=self._timeout) as response:
                body = json.loads(response.read().decode())
        except (OSError, URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise AdvisorUnavailable("the local Ollama model is unavailable") from exc
        try:
            return ExtractedTravelFields.model_validate_json(body["message"]["content"])
        except (KeyError, TypeError, ValidationError) as exc:
            raise AdvisorUnavailable("the local model returned invalid travel fields") from exc


def create_default_travel_intent_extractor() -> TravelIntentExtractor:
    return OllamaTravelIntentExtractor(
        base_url=os.environ.get("CCT_OLLAMA_URL", "http://ollama:11434"),
        model=os.environ.get("CCT_OLLAMA_MODEL", "qwen3:8b"),
    )
