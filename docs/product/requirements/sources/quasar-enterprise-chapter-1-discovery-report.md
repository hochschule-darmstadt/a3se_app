# Quasar Enterprise, Chapter 1: Discovery Report

- Status: draft
- Owner: Product
- Last reviewed: 2026-07-22
- Source brief: [quasar-enterprise-chapter-1.md](quasar-enterprise-chapter-1.md)

## Scope of this report

This report consolidates business-facing findings from PDF pages 11-70 of *Quasar Enterprise*. It is an intermediate discovery artifact, not an accepted project specification. It does not create requirements, domain rules, or technology decisions by itself.

The source later shifts from business description into architecture method, platform discussion, and project planning. Those passages are only reflected here when they reveal a material business constraint or quality concern.

## Business context observed in the source

- The operator currently sells seasonally planned package travel built from pre-purchased hotel and flight capacity.
- The strategic change is to add premium individual trips that customers assemble from travel components such as hotel stays, flights, local transfers, rail or bus legs, rental cars, insurance, entertainment, and local round trips.
- The operator intends to remain the single accountable organizer toward the customer even when some services are procured on demand through intermediaries.
- The intended differentiator is package-tour-level fulfillment quality for individually assembled trips, with customer satisfaction as the strategic outcome.

## Candidate stakeholders and actors

| Candidate | Why the source suggests this role matters | Notes |
|---|---|---|
| Customer / traveler | Assembles, books, and pays for the trip; may also be the subject of post-sales care and satisfaction measurement | The source uses `Kunde` and `Reisender`; whether the buyer and traveler can differ is not yet clarified |
| Travel advisor / sales staff | Appears in service decomposition around manual support and exceptional pricing conversations | Scope for advisor-assisted sales remains open because individual trips are also described as internet-only |
| Customer account manager | Appears in service decomposition for customer-related support activities | May overlap with customer service or CRM roles in the project vocabulary |
| Product and purchasing staff | Plan seasons, negotiate contracts, maintain stock capacity, and manage supplier relationships | Important for both package travel and mixed sourcing |
| Supplier | Provides direct services such as hotel and flight inventory | Source examples emphasize hotels and airlines |
| Intermediary | Provides on-demand services under framework agreements | The source uses `Mittler`; `intermediary` is a candidate English term, not yet a glossary decision |
| Accounting / settlement staff | Handle liabilities, invoices, and settlement with suppliers and intermediaries | Needed because new creditors arise from intermediary sourcing |
| Reporting / quality management staff | Need customer satisfaction data to exclude poorly rated external services | Could remain a supporting business function rather than a primary actor |

## Candidate business capabilities

- Plan seasonal offerings and contracted capacity for package travel.
- Contract direct suppliers and intermediaries under terms that support both pre-purchased and on-demand sourcing.
- Assemble customer-specific trips from mixed stock and on-demand travel services.
- Price individual trips dynamically from component purchase prices plus a markup.
- Sell package travel through travel agency, internet, and call-center channels.
- Sell individual trips through an internet-first channel.
- Check availability across internal stock and external partners before commitment.
- Create and maintain a travel order as the backbone record for booking and downstream fulfillment.
- Produce customer documents and coordinate fulfillment after payment milestones.
- Settle liabilities with suppliers and intermediaries.
- Capture customer preferences and contact history for personalization.
- Measure satisfaction with sourced services and exclude poor performers from future offers.

## Candidate end-to-end workflows

### Existing package-travel cycle

1. Plan the season.
2. Purchase hotel and flight capacity in advance.
3. Build fixed offers and assign seasonal prices.
4. Sell through agency, internet, or call center.
5. Create a travel order and fulfill the trip.
6. Settle with suppliers and feed sales and fulfillment information into the next planning cycle.

### Candidate individual-trip cycle

1. Customer discovers the online offer and can assemble a trip from multiple service components.
2. The system recommends and filters components using customer preferences, history, and plausibility checks.
3. The offer price is calculated at sale time from component purchase prices plus a markup.
4. Availability is checked across internal stock and intermediary-provided services.
5. Booking creates or updates the customer record, creates the travel order, and commits service reservations.
6. Payment and deposit handling determine when travel documents are issued.
7. Post-sales fulfillment, supplier notification, settlement, and satisfaction capture continue against the travel order.

## Candidate business rules and information needs

| Theme | Candidate rule or information need | Notes |
|---|---|---|
| Product structure | An individual trip may combine pre-purchased stock services and on-demand sourced services | Source-backed candidate; not yet promoted to a rule catalog |
| Itinerary structure | Individual trips can extend beyond the classic outbound stay return pattern and may include multiple stays or locations | Important modeling input for itinerary and pricing |
| Sourcing time | On-demand services are purchased only when a customer books, using framework agreements with intermediaries | Suggests different reservation and settlement timing |
| Channel | The first individual-trip offering is limited to the internet channel | Treat as a candidate business constraint until stakeholders confirm it is not scenario-specific |
| Pricing | Individual-trip sale price is determined at sale time from component purchase prices plus a markup | Implies dynamic offer pricing instead of catalog pricing |
| Plausibility | Because customers assemble trips themselves, the system must check whether combinations are valid | Candidate basis for future functional requirements and acceptance examples |
| Booking record | The travel order remains the central record for fulfillment and settlement activities | Also a domain-model input |
| Documents | Travel documents are issued only after a deposit has been received | Derived from the service contract notes |
| Cancellation | Customer cancellation is only possible up to 30 days after booking and fees apply | Needs later validation against project-specific policy and law |
| Payment failure | Returned debit due to insufficient funds causes a fee | Also needs later validation against project-specific policy and law |
| Privacy-related consent | Customer consent is needed to store online search behavior for personalization | Requires later security and privacy analysis before acceptance |
| Supplier quality | Customer satisfaction with externally sourced services must be captured so poorly rated services can be excluded from future offers | Suggests a blacklist or similar supplier-quality mechanism |
| Core information objects | The source repeatedly relies on customer, product, travel order, supplier, travel service, purchase price, sale price, channel, and sourcing mode | Strong input for glossary and domain modeling |

## Candidate terminology proposals

| Source term | Candidate English term | Notes |
|---|---|---|
| `Pauschalreise` | package travel | Could also be `package trip` or `package tour`; glossary decision still open |
| `Individualreise` | individual trip | Could also be `custom trip`; keep wording provisional |
| `Premium-Individualreise` | premium individual trip | Source term, not a product decision for this repository |
| `Lagerleistung` | stock service | Means a service purchased in advance and held as inventory-like capacity |
| `Zukaufleistung` | on-demand sourced service | Alternative terms include `brokered service` or `purchased-on-demand service` |
| `Reiseauftrag` | travel order | Needs explicit glossary confirmation against alternatives such as booking or reservation |
| `Leistung` | travel service | Avoid the generic software term `service` without domain context |
| `Mittler` | intermediary | Could map to broker, aggregator, or reservation partner depending the business contract |
| `touristischer Kreislauf` | travel operations cycle | Candidate term for the planning to fulfillment feedback loop |

## Candidate domain boundaries

The source suggests the following business areas, without yet justifying final bounded-context decisions:

- Seasonal planning
- Supplier contracting and purchasing
- Product design and offer composition
- Sales and booking
- Travel order management
- Customer management
- Fulfillment and travel documents
- Supplier settlement and accounting
- Reporting and satisfaction management

The source also distinguishes customer channels such as travel agency, internet, and call center. That distinction is clearly relevant to behavior and constraints, but it should not be turned into accepted bounded contexts without project-specific evidence.

## Candidate quality concerns and constraints

- Premium individual trips depend on fulfillment quality comparable to package travel even when external partners provide some components.
- Individual-trip internet booking is business critical and should be treated as a high-reliability interaction.
- Personalization should use customer preferences and contact history rather than only generic catalog content.
- Booking crosses several dependent reservations, so failure handling and recovery must preserve a coherent customer outcome.
- Customer-facing quality depends partly on partner performance, so observability of supplier quality is a business need rather than only an operations concern.

## Explicit exclusions

This report intentionally does not promote the following source content into project decisions:

- product or vendor recommendations;
- Java, portal, ESB, BPM, CRM, or similar platform choices;
- scenario prioritization and migration-roadmap options;
- architecture-design rules that do not clearly express a business need;
- organization-specific governance or consulting-process advice.

## Open questions before promotion into authoritative catalogs

- Is internet-only sales for individual trips a lasting business rule, a first-release assumption, or only a scenario device in the source?
- Which English term should the project standardize for `Pauschalreise`, `Individualreise`, `Reiseauftrag`, `Leistung`, and `Mittler`?
- Is manual price negotiation part of the intended business process, or should the project assume fully system-calculated pricing for individual trips?
- What exact post-sales obligations must remain package-tour-grade when intermediary services are involved?
- How should customer satisfaction with sourced services affect future offers: blacklist only, ranking, recommendations, or procurement review?
- What legal and privacy obligations apply to search-history storage, cancellation fees, payment-failure fees, and organizer accountability?
