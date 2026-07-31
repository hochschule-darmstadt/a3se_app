# Glossary

- Status: accepted
- Owner: Requirements
- Last reviewed: 2026-07-31

The glossary defines the shared business vocabulary for the tour operator information system. Use each term according to its definition and context; do not assume that a term has the same meaning across contexts.

| Term | Definition | Context | Synonyms to avoid |
|---|---|---|---|
| Tour operator | Organization accountable to the customer for combining travel services into an offer and fulfilling the resulting travel, including when external parties provide components | Enterprise | Travel agency, supplier |
| Customer | Person or party that selects, orders, and pays for travel | Enterprise | Traveler, when the buyer and traveler differ |
| Traveler | Person who participates in the travel and whose details may affect its composition and execution | Enterprise | Customer, passenger |
| Tour operator cycle | Feedback loop from seasonal planning and purchasing through product design, sales, travel order management, payment, document issuance, settlement, and subsequent planning | Enterprise | Booking process, trip lifecycle |
| Seasonal planner | Staff member who plans seasonal offerings and the capacity needed to support them | Seasonal planning (candidate) | Purchaser |
| Seasonal offering | Set of travel products and prices planned for a defined sales or travel season | Seasonal planning (candidate) | Travel, travel order |
| Purchaser | Staff member who negotiates contracts, purchases capacity, and maintains supplier relationships | Product and purchasing (candidate) | Seasonal planner, supplier |
| Supplier | External party that provides a travel service directly, such as a hotel or airline | Product and purchasing (candidate) | Intermediary, tour operator |
| Intermediary | External party through which the tour operator obtains on-demand travel services under a commercial agreement | Product and purchasing (candidate) | Supplier, broker, aggregator |
| Stock service | Travel service capacity purchased in advance and held for later sale | Product and purchasing (candidate) | Inventory item, on-demand sourced service |
| On-demand sourced service | Travel service obtained from an external party in response to a customer order rather than purchased as advance capacity | Product and purchasing (candidate) | Stock service, brokered service, purchased-on-demand service |
| Purchase price | Amount charged to the tour operator for a travel service | Product and purchasing (candidate) | Sale price |
| Package travel | Prearranged combination of travel services offered at a package level, typically using capacity purchased before a customer order | Product design (candidate) | Package trip, package tour |
| Individual travel | Customer-specific combination of travel services assembled around an individual itinerary | Product design (candidate) | Individual trip, custom trip, tailor-made trip |
| Travel service | Travel-related service that can be offered, selected, reserved, and delivered, such as a flight, hotel stay, transfer, rail or bus leg, rental car, insurance, entertainment, or local round trip | Product design (candidate) | Service without domain qualifier, travel component |
| Travel component | One travel service selected as part of a specific travel | Product design (candidate) | Travel service, when referring to the service independently of a specific travel |
| Itinerary | Ordered sequence of travel legs, stays, locations, and related services that makes up travel | Product design (candidate) | Product, travel order |
| Plausibility check | Evaluation that a customer-assembled combination of components is operationally coherent and allowed | Product design (candidate) | Availability check |
| Sale price | Amount charged to the customer for travel or a travel service | Pricing (candidate) | Purchase price |
| Travel advisor | Human staff member or automated conversational agent that assists a customer with travel selection, composition, or ordering | Sales and travel ordering (candidate) | Travel agency, customer service agent |
| Availability check | Verification that each required travel service can still be committed from internal capacity or an external party | Sales and travel ordering (candidate) | Plausibility check, reservation |
| Reservation | Commitment or hold for one travel service required by a travel order | Sales and travel ordering (candidate) | Travel order |
| Travel order | Central business record connecting ordered travel to its customer, travelers, reservations, payment, documents, execution, and settlement activities | Travel order management (candidate) | Booking, reservation |
| Deposit | Initial customer payment whose receipt may enable later activities such as issuing travel documents | Payment (candidate) | Fee, full payment |
| Travel documents | Customer-facing documents needed to undertake or evidence ordered travel | Travel documentation (candidate) | Invoice, travel order |
| Supplier settlement | Reconciliation and payment of liabilities arising from travel services obtained from suppliers or intermediaries | Settlement (candidate) | Customer payment, travel order |
