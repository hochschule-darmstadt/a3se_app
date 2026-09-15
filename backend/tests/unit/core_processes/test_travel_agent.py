from datetime import date
import unittest

from cct.core_processes.customer_care.travel_agent import (
    CapacityUnit,
    ComponentKind,
    ItineraryComponent,
    TravelIntent,
    elapsed_days,
    required_nights,
    validate_itinerary,
)


class TravelAgentTest(unittest.TestCase):
    def test_arrival_and_checkout_are_not_both_nights(self):
        start, checkout = date(2027, 1, 4), date(2027, 1, 12)
        self.assertEqual(8, elapsed_days(start, checkout))
        self.assertEqual(8, len(required_nights(start, checkout)))
        self.assertEqual(date(2027, 1, 11), required_nights(start, checkout)[-1])

    def test_missing_night_is_reported(self):
        intent = TravelIntent(start_date=date(2027, 1, 4), end_date=date(2027, 1, 12), traveller_count=2)
        components = (ItineraryComponent(component_id="ROOM", kind=ComponentKind.ACCOMMODATION,
            location_code="LIM", service_date=date(2027, 1, 4), end_date=date(2027, 1, 11),
            unit_price=100, currency="EUR", capacity_unit=CapacityUnit.BED, available_capacity=2),)
        rules = {item.rule_id for item in validate_itinerary(intent, components)}
        self.assertIn("ACCOMMODATION-COVERAGE", rules)

    def test_two_travellers_need_two_capacity_units(self):
        intent = TravelIntent(traveller_count=2)
        component = ItineraryComponent(component_id="SEAT", kind=ComponentKind.TRANSPORT,
            service_date=date(2027, 1, 4), unit_price=100, currency="EUR",
            capacity_unit=CapacityUnit.SEAT, available_capacity=1)
        self.assertIn("PERSON-CAPACITY", {item.rule_id for item in validate_itinerary(intent, (component,))})

    def test_start_and_end_transport_are_required_when_requested(self):
        intent = TravelIntent(origin_code="FRA", return_code="FRA")
        diagnostics = validate_itinerary(intent, ())
        self.assertEqual({"START-TRANSPORT", "END-TRANSPORT"}, {item.rule_id for item in diagnostics})


if __name__ == "__main__":
    unittest.main()
