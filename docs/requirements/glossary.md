# Glossary

- Status: accepted
- Owner: Requirements
- Last reviewed: 2026-08-14

The glossary defines the shared business vocabulary for the tour operator information system. Use each term according to its definition and context; do not assume that a term has the same meaning across contexts.

| Term | Definition | Context | Synonyms to avoid |
|---|---|---|---|
| Tour operator | Organization accountable to the customer for combining travel services into an offer and fulfilling the resulting travel, including when external parties provide components | Tour Operator enterprise | Travel agency, supplier |
| Customer | Person or party that selects, orders, and pays for travel | Tour Operator enterprise | Traveler, when the buyer and traveler differ |
| Customer account | Customer-controlled means of returning to customer-specific information and proving the identity required to access it | Customer Interaction | Customer record, login |
| Traveler | Person who participates in the travel and whose details may affect its composition and execution | Tour Operator enterprise | Customer, passenger |
| Tour operator cycle | Feedback loop from seasonal planning and purchasing through product design, sales, travel order management, payment, document issuance, settlement, and subsequent planning | Tour Operator enterprise | Booking process, trip lifecycle |
| Seasonal planner | Staff member who plans seasonal offerings and the capacity needed to support them | Season Planning | Purchaser |
| Seasonal offering | Set of travel products and prices planned for a defined sales or travel season | Season Planning | Travel, travel order |
| Travel product | Maintained travel offering that can be presented or used when composing travel | Touristic Product Design | Travel service, itinerary |
| Purchaser | Staff member who negotiates contracts, purchases capacity, and maintains supplier relationships | Procurement | Seasonal planner, supplier |
| Supplier | External party that provides a travel service directly, such as a hotel or airline | Procurement | Intermediary, tour operator |
| Intermediary | External party through which a tour operator may obtain on-demand travel services under a commercial agreement; this project excludes that capability under SE-002 | Procurement | Supplier, broker, aggregator |
| Stock service | Travel service capacity purchased in advance and held for later sale | Procurement | Inventory item, on-demand sourced service |
| Inventory | Managed view of pre-procured Travel Service capacity, its validity, availability, allocation, and provenance | Procurement; Sales | Product catalog, supplier list |
| On-demand sourced service | Travel service obtained from an external party in response to a customer order rather than purchased as advance capacity; retained to define the capability excluded by SE-002 | Procurement | Stock service, brokered service, purchased-on-demand service |
| Purchase price | Amount charged to the tour operator for a travel service | Procurement | Sale price |
| Package travel | Prearranged combination of travel services offered at a package level, typically using capacity purchased before a customer order | Touristic Product Design | Package trip, package tour |
| Individual travel | Customer-specific combination of travel services assembled around an individual itinerary | Touristic Product Design | Individual trip, custom trip, tailor-made trip |
| Travel service | Travel-related service that can be offered, selected, reserved, and delivered, such as a flight, hotel stay, transfer, rail or bus leg, rental car, insurance, entertainment, or local round trip | Tour Operator enterprise | Service without domain qualifier, travel component |
| Travel component | One travel service selected as part of a specific travel | Touristic Product Design | Travel service, when referring to the service independently of a specific travel |
| Itinerary | Ordered sequence of travel legs, stays, locations, and related services that makes up travel | Touristic Product Design | Product, travel order |
| Plausibility check | Evaluation that a customer-assembled combination of components is operationally coherent and allowed | Touristic Product Design | Availability check |
| Sale price | Amount charged to the customer for travel or a travel service | Sales | Purchase price |
| Sales offer | Commercial proposal presented to a customer for an orderable travel composition at a sale price | Sales | Seasonal offering, travel order |
| Travel advisor | Human staff member who assists a customer with travel selection, composition, ordering, exceptions, or handover | Sales; Customer Care | Automated travel advisor, travel agency |
| Automated travel advisor | AI chatbot within Customer Interaction that converses with a customer and can invoke authorized system capabilities to progress the customer journey | Sales; Customer Care | Travel advisor, when referring to a human; search form; general-purpose chatbot |
| Availability check | Verification that each required travel service can still be committed from internal capacity or an external party | Sales | Plausibility check, reservation |
| Reservation | Commitment or hold for one travel service required by a travel order | Order Management | Travel order |
| Travel order | Central business record connecting ordered travel to its customer, travelers, reservations, payment, documents, execution, and settlement activities | Order Management | Booking, reservation |
| Deposit | Initial customer payment whose receipt may enable later activities such as issuing travel documents | Order Management | Fee, full payment |
| Travel documents | Customer-facing documents needed to undertake or evidence ordered travel | Customer Care | Invoice, travel order |
| Supplier settlement | Reconciliation and payment of liabilities arising from pre-procured travel services obtained from suppliers | Procurement | Customer payment, travel order |
