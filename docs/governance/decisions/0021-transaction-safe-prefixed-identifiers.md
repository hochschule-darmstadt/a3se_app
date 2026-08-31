# DR-0021: Use transaction-safe prefixed identifiers for staff-created entities

- Status: proposed
- Date: 2026-08-31
- Deciders: Management/Architecture
- Supersedes: none

## Decision

Staff create requests do not supply an identifier. The persistence adapter
allocates an immutable identifier from a per-entity-family counter in the same
Neo4j write transaction as creation. Generated root identifiers use the form
`<prefix>-<six-digit number>`: `PER`, `ROLE`, `ORG`, `OROLE`, `PRD`, `STK`, and
`ORD` identify Person, PersonRole, Organisation, OrgaRole, TouristicProductItem,
StockItem, and OrderItem respectively. Order positions use a per-order
`<order-id>-P<two-digit number>` sequence and do not consume the order counter.

Existing seeded identifiers remain valid through the explicit restore/save path.
Numbers are never reused after deletion; gaps are acceptable. Counter overflow
fails the transaction. Entity IDs are identifiers, not authorization secrets.

An order header ID is the sole order identifier; the former `orderNumber`
property is not part of the contract.

## Rationale and rejected alternatives

Per-family counters preserve readable prefixes without imposing one global
sequence. Client-generated UUIDs were rejected because they are not readable
staff references. A global sequence was rejected because it couples unrelated
entity families. Reusing deleted numbers was rejected because it undermines
immutable references. An in-place migration was rejected; a fresh seed is the
safe data transition for incompatible catalog data.

## Validation and residual risk

The repository implementation validates properties before opening the write
transaction, reserves the counter and creates the node atomically, and keeps
the existing uniqueness constraints as defense in depth. Real Neo4j
concurrency and rollback tests remain required before production acceptance;
the current local test environment lacks the pytest dependency.
