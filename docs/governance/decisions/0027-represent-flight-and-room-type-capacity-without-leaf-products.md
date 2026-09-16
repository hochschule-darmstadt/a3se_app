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
- Each traveller on an order position that has allocated stock uses one unit of `remainingCapacity`, whether the traveller is assigned before or after allocation. Allocation subtracts one unit for each traveller already assigned. Assigning a traveller after allocation subtracts one more, or returns `409 stock_unavailable` without assigning if no capacity remains. Assigning the same traveller again changes nothing.
- Releasing stock, or deleting a position, returns one unit per assigned traveller.

## Consequences

### Positive

- There is one StockItem per product and date, and capacity is counted in travellers.
- Only one capacity figure is stored.

### Negative and risks

- Seat or room assignment would need a new decision.
- A single traveller cannot be removed from a position; only the whole position can be deleted.
- The capacity check and the capacity update are separate writes, so two simultaneous requests could both pass the check. Customer order placement already runs in one transaction; staff operations do not.

## Validation and revisit triggers

Evidence: backend unit and API tests for inventory, orders, and seed generation, including tests that capacity does not depend on assignment order, that reassigning a traveller or exceeding capacity is handled, and that deleting a position returns its capacity. Revisit this decision if seat or room assignment becomes a requirement, if staff need to remove a single traveller from a position, or if simultaneous staff edits cause capacity errors.

## Links

- [DR-0020](0020-align-stockitem-types-with-product-leaves.md)
- [Flexible entity-model terminology](../../architecture/entity-model/terminology.md)
- [Backend architecture](../../architecture/software-architecture/backend-architecture.md)
- [Wireframes, INV-001 and INV-003](../../requirements/ux/wireframes/wireframes.md)
