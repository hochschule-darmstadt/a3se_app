# DR-0027: Represent flight and room-type capacity without seat and room products

- Status: accepted
- Date: 2026-09-16
- Deciders: project owner
- Supersedes: DR-0020 in part (the seat and room stock types)

## Context

DR-0020 named every StockItem type after the lowest-level product it represents, including `stock/airline/flight/seat` and `stock/accommodation/room-type/room`. Commit `9832ea0` (issue #56, 2026-08-31) then removed the `product/airline/flight/seat` and `product/accommodation/room-type/room` product types, their `seatNumber` and `roomNumber` properties, and the per-unit stock model. Since then, one StockItem holds all capacity for one flight on one date, or one room type on one date. The [backend architecture](../../architecture/software-architecture/backend-architecture.md) recorded this convention, but no decision record did. The terminology catalog, requirements, and wireframes still described the old model. On 2026-09-16, the project owner confirmed that the documentation should follow the implemented model.

## Decision drivers

- Travel orders need traveller-based capacity, not identified seats or rooms.
- The MVP does not include seat or room assignment.
- The system should have one stored capacity figure rather than competing counters.

## Considered options

- Keep seat and room products and their stock types. This would allow seat or room assignment later, but it creates one StockItem per unit and every date.
- Store capacity on the flight or room-type product for each date (chosen). This fits traveller-based ordering, but individual seats or rooms cannot be identified.

## Decision

- `product/airline/flight` and `product/accommodation/room-type` are the stock-bearing products. They may own StockItems even though they are not leaf products. Every other product type may own stock only while it has no `CONTAINS` children.
- `product/airline/flight/seat`, `product/accommodation/room-type/room`, `seatNumber`, and `roomNumber` are retired.
- The stock types for these products are `stock/airline/flight` and `stock/accommodation/room-type`. The DR-0020 rule for every other family is unchanged: `stock/` followed by the product type's suffix.
- `capacityQuantity` is the purchased capacity. `remainingCapacity` is the stored source of truth and must not exceed `capacityQuantity`. `heldQuantity`, `allocatedQuantity`, and the `held` availability state are retired.
- Allocating a StockItem to an order position subtracts one unit from `remainingCapacity` for each traveller assigned to that position. Releasing it adds the same number back.

## Consequences

### Positive

- There is one StockItem per product and date, and capacity is counted in travellers.
- Only one capacity figure is stored.

### Negative and risks

- Seat or room assignment would need a new decision.
- Capacity is taken from travellers assigned at allocation time. Travellers added after allocation do not reduce `remainingCapacity`. The seed script and tests assign travellers first, but the API does not enforce this order.

## Validation and revisit triggers

Evidence: backend unit and API tests for inventory, orders, and seed generation. Revisit this decision if seat or room assignment becomes a requirement, or if staff need to add travellers after allocation.

## Links

- [DR-0020](0020-align-stockitem-types-with-product-leaves.md)
- [Flexible entity-model terminology](../../architecture/entity-model/terminology.md)
- [Backend architecture](../../architecture/software-architecture/backend-architecture.md)
- [Wireframes, INV-001 and INV-003](../../requirements/ux/wireframes/wireframes.md)
