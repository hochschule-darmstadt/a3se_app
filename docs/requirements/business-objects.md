# Business Objects

- Status: accepted
- Owner: Requirements
- Last reviewed: 2026-07-31

Business objects describe the coarse-grained concepts that carry business meaning across the tour operator cycle. Each object has one authoritative owning bounded context; other contexts may use identifiers, projections, or exchanged representations without becoming co-owners.

This conceptual inventory does not define database tables, API schemas, implementation classes, or complete lifecycle rules. Refine attributes, invariants, events, privacy needs, and relationships only when supported by requirements evidence.

| Business object | Definition | Owning bounded context | Core responsibilities | Key relationships |
|---|---|---|---|---|
| Customer | Person or party that selects, orders, and pays for travel | Customer Management | Maintain the authoritative customer identity and customer record | May place Travel Orders and receive Sales Offers |
| Travel Product | Maintained travel offering that can be presented or used when composing travel | Travel Product Management | Maintain the product definition, validity, and availability inputs | Uses Travel Services; may be presented in a Sales Offer |
| Travel Service | Independently maintained travel-related service that can be selected as a Travel Component | Travel Product Management | Maintain the service definition and information needed for selection and availability | Provided by a Supplier; used by Travel Products, Itineraries, and Travel Orders |
| Itinerary | Ordered sequence of travel legs, stays, locations, and related Travel Components | Travel Product Design | Maintain a coherent composition during package or individual travel design | Composed from Travel Services; may become part of a Sales Offer and Travel Order |
| Supplier | External party that provides a Travel Service directly | Procurement | Identify the providing party and connect it to procurement terms and capacity | Provides Travel Services and participates in supplier settlement |
| Sales Offer | Commercial proposal presented to a Customer for an orderable travel composition at a Sale Price | Sales | Preserve the offered composition, price, validity, and commercial conditions | Refers to a Customer, Itinerary, Travel Products, and Travel Services; may lead to a Travel Order |
| Travel Order | Central business record for travel ordered by a Customer | Order Management | Maintain the order lifecycle and connect reservations, payment, documents, execution, and settlement | Results from an accepted Sales Offer and coordinates the ordered Itinerary and reservations |

The Customer Interaction and Travel Execution bounded contexts participate in the lifecycle of these objects but do not introduce another coarse-grained core object at this stage. Their context-specific interaction and execution state can be refined when use cases and lifecycle requirements justify it.
