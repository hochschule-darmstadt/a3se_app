# Business Objects

- Status: accepted
- Owner: Requirements
- Last reviewed: 2026-08-05

Business objects describe coarse concepts that carry meaning across the tour operator cycle. The [domain model](domains/domains.md) assigns their problem-space responsibility; the [logical data model](../architecture/data-model/data-model.md) refines them into generic, module-owned entities. Other modules may retain identifiers or representations without becoming co-owners.

This inventory does not define database tables, API schemas, implementation classes, or complete lifecycle rules.

| Business object | Definition | Primary domain responsibility | Core responsibilities | Key relationships |
|---|---|---|---|---|
| Customer | Person or party that selects, orders, and pays for travel | Sales; Customer Care | Maintain the customer role and information needed across sales and care | May place Travel Orders and receive Sales Offers |
| Traveler | Person who participates in ordered travel | Customer Care | Maintain the traveler role and travel-relevant information | Participates in Travel Orders and receives travel information |
| Travel Product | Maintained touristic offering that can be presented or used when composing travel | Season Planning; Touristic Product Design | Define reusable product structures and variants | Uses Travel Services and may be presented in a Sales Offer |
| Travel Service | Independently maintained travel-related service from which sellable stock can be procured | Procurement; Touristic Product Design | Define the service and connect it to suppliers and stock | Provided by a Supplier; represented by stock and order items |
| Itinerary | Ordered sequence of travel legs, stays, locations, and related travel components | Touristic Product Design | Maintain a coherent travel composition | Composed from Travel Products; may become part of a Sales Offer and Travel Order |
| Supplier | External organisation that provides a Travel Service directly | Procurement | Maintain the supplier relationship and link it to products and procured stock | Provides Travel Services and fulfils ordered components |
| Sales Offer | Commercial proposal presented to a Customer for an orderable composition and sale price | Sales | Preserve offered composition, price, validity, and conditions | Refers to Customer roles and touristic product items; may lead to a Travel Order |
| Travel Order | Central business record for travel ordered by a Customer | Sales; Customer Care | Preserve ordered components and connect customer/traveler roles to allocated stock | Results from an accepted Sales Offer and coordinates ordered components |

The generic Person/PersonRole, Organisation/OrgaRole, TouristicProductItem, StockItem, and OrderItem structures are architecture refinements, not replacements for this business vocabulary.
