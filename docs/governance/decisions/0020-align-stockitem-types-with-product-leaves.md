# DR-0020: Align StockItem types with represented product leaves

- Status: accepted
- Date: 2026-08-21
- Deciders: stakeholder and architecture
- Supersedes: DR-0017's deferred StockItem naming exception

## Context

DR-0017 aligned organisation and product type families but explicitly deferred the corresponding Inventory rename. Inventory now links each StockItem strictly to a lowest-level TouristicProductItem, making the remaining mismatched suffixes misleading.

## Decision

Every StockItem type shall be `stock/` followed by the complete suffix of its represented lowest-level product type. Rename:

- `stock/flight/seat` to `stock/airline/flight/seat`
- `stock/accommodation/room-category` to `stock/accommodation/room-type/room`
- `stock/water/day-boat` to `stock/water-transport/day-boat`
- `stock/water/cruise` to `stock/water-transport/cruise`

Creation shall reject a StockItem type that does not match its represented product type. The PoC performs a full deterministic re-seed; no migration or legacy alias is provided.

## Consequences

- Product and stock families can be compared mechanically by replacing the root namespace.
- API contracts, registry entries, seeds, tests, diagrams, generated clients, and UI selectors change together.
- Historical DR-0014 and DR-0017 text retains the identifiers valid when those decisions were made.

## Links

- [DR-0017](0017-align-orgarole-and-touristicproductitem-type-families.md)
- [Flexible Entity-model Terminology](../../architecture/entity-model/terminology.md)
