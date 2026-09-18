# DR-0023: Product-level location-aware catalogue search

- Status: proposed
- Date: 2026-09-08
- Deciders: Product stakeholder / Implementation
- Supersedes: DR-0015 in part

## Context

The Customer portal must find every relevant travel product by a location or
theme. Raw product properties are inconsistent: flights may contain only IATA
codes, while accommodation, transfers, and activities may inherit location
context through a product and supplier chain. The Customer journey also needs
to show each product once and expose the dates on which matching stock is
sellable.

## Decision drivers

- Keep the MVP understandable and avoid a location lookup service.
- Search across all product families using one backend-owned projection.
- Avoid exposing stock-item pagination details as duplicate customer products.
- Keep authoritative availability and booking confirmation in the backend.

## Considered options

- Introduce a dedicated location service and search engine now. Rejected for the
  MVP because it adds infrastructure and governance before the domain location
  vocabulary is stable.
- Search arbitrary product and organisation properties directly per request.
  Rejected because it cannot reliably resolve codes such as `LIM`, can confuse
  supplier location with service location, and makes result aggregation costly.
- Generate a redundant StockItem `searchText` projection and expose a
  product-level catalogue-search endpoint. Accepted for the MVP.

## Decision

1. Location data may be redundantly stored as a code and human-readable name
   in seed/product data; no lookup service is introduced now.
2. StockItem creation and update generate `searchText` from the represented
   product, its product ancestry, relevant location terms, and supplier
   context. The same generation path is used for seeded and staff-created
   StockItems.
3. `GET /catalogue-search` accepts location/theme `search`, inclusive
   `serviceDateFrom`/`serviceDateTo`, and a `travellers` party-size criterion
   (default 1). Only stock with enough `remainingCapacity` for the requested
   party is matched. It returns one result per product, with matching
   sellable `availableDates`, indicative price, and product type/display
   projections.
4. The Customer portal groups product results by product type and lets the user
   select one available date. Departure region is not part of the Customer
   search contract.

## Consequences

### Positive

- `Lima`, `Peru`, and `LIM` can find flights, accommodation, transfers, and
  activities consistently.
- Product cards are not duplicated once per dated stock record.
- Search fields remain available for Staff-created stock without manual
  synchronisation work.

### Negative and risks

- Redundant location terms can become stale when product or supplier data
  changes; stock search fields must be regenerated on affected mutations.
- Full-text matching is intentionally simple and may produce broad matches.
- Only whole-party remaining-capacity filtering is applied; package
  compatibility and final pricing are not solved by this search projection.

## Validation and revisit triggers

Validate with seeded searches for `Lima`, `Peru`, and `LIM` across flight,
accommodation, transfer, and activity products, including date-range results
and date selection. Revisit when synonym management, geospatial search,
multi-service itinerary matching, or catalogue volume requires a dedicated
location/search capability.

## Links

- [Frontend architecture](../../architecture/software-architecture/frontend-architecture.md)
- [Customer wireframes](../../requirements/ux/wireframes/wireframes.md)
- [DR-0015](0015-frontend-thin-slice-testing-i18n-and-catalog-listing.md)
