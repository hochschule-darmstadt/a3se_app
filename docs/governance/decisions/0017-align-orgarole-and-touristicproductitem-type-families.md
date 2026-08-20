# DR-0017: Align OrgaRole and TouristicProductItem type-identifier families

- Status: accepted
- Date: 2026-08-20
- Deciders: architecture and requirements
- Supersedes: none

## Context

Issue #31's follow-up work (see [terminology.md](../../architecture/entity-model/terminology.md) TERM-009) already consolidated the `hotel`/`accommodation` duplication (`product/hotel/*` → `product/accommodation/*`, `partner/supplier/hotel` → `partner/supplier/accommodation`) and aligned the flight family (`product/flight` → `product/airline/flight`, `product/flight/seat` → `product/airline/seat`) with the existing `partner/supplier/airline` OrgaRole family, establishing the intended pattern: every `product/<family>/<type>` TouristicProductItem family segment should read identically to its supplying `OrgaRole`'s family segment.

That pass left two inconsistencies unresolved:

1. **Family-name mismatch.** OrgaRole's water-transport supplier role is `partner/supplier/water-transport`, but the corresponding TouristicProductItem family remained `product/water/*` (`product/water/day-boat`, `product/water/cruise`). The `<family>` segment did not match exactly, unlike airline/accommodation/mobility/experience/protection, where it already did.
2. **Unnested structural children.** `product/airline/seat` and `product/accommodation/room` are structural children -- created and read only as `CONTAINS` children of `product/airline/flight` and `product/accommodation/room-category` respectively (TERM-004: "not a catalogue-root type... identified by their parent"). Both nonetheless sat as flat siblings of their parent type in the identifier namespace, rather than nested one level under it, so the identifier string did not reflect the actual composition.

Separately, `product/accommodation/room-category`'s own name blocked (1)-style consistency for its child: nesting a `room` child under `room-category` reads awkwardly, and would leave the parent labelled `-category` while its child was not.

## Decision drivers

- AGENTS.md rule 3/8: don't let a naming inconsistency silently stand once identified; keep one authoritative, consistent identifier scheme rather than accumulating ad hoc exceptions.
- The TERM-009 precedent from issue #31 already established that a family-name or structural mismatch discovered after the fact is worth a deprecation-and-rename pass, not a permanent exception, when the mismatch is easy to fix and has few current consumers (a synthetic PoC seed catalog, not production data).
- Symmetry cost: every other family (airline, accommodation, mobility, experience, protection) already had a matching `<family>` segment between its `OrgaRole` and its `TouristicProductItem`s; leaving `water`/`water-transport` as the one exception would make the naming rule harder to state and easier to violate again.
- Renaming `stock/*` identifiers to match would additionally touch Inventory (VIEW-S-007) and Order Management, which is out of scope for a naming-consistency pass; the existing `stock/flight/seat` precedent (left as-is when `product/flight/seat` became `product/airline/seat`) shows the project already accepts this kind of scoped, partial rename with the mismatch named as residual risk rather than silently left unstated.

## Considered options

- **Leave both inconsistencies as-is.** Rejected: the `product/hotel/*`/`product/flight` precedent already treated this class of mismatch as worth fixing; leaving `water`/`water-transport` unresolved after fixing every sibling family would be an unexplained, arbitrary exception with no compensating benefit.
- **Rename the product family to `water` → keep OrgaRole as `partner/supplier/water`, i.e. shorten the OrgaRole side instead of the product side.** Rejected: `partner/supplier/water` reads ambiguously (drinking water? plumbing?) compared to the descriptive `water-transport`, which was deliberately chosen for the OrgaRole in TERM-002's original definition ("Supplier role for cruises, ferries, or day boats").
- **Also rename every `partner/supplier/<family>` OrgaRole type to `organisation/<family>` (dropping `supplier`), not just fixing the `water` mismatch.** Accepted, in addition to the family-name and nesting fixes below. Every currently defined OrgaRole is in fact a supplier role (Partner Management, per TERM-002, defines no other OrgaRole kind yet), so the `supplier` segment carries no disambiguating information today; dropping it makes the `<family>` segment line up as a plain, exact, visually comparable match against `product/<family>/<type>` (`organisation/airline` vs `product/airline/flight`) instead of requiring the reader to skip past an extra segment (`partner/supplier/airline` vs `product/airline/flight`). If a future non-supplier partner role is introduced (WF-Q-012, currently unconfirmed), it can occupy a sibling `organisation/<non-supplier-family>` or a differently named OrgaRole kind at that time; this decision does not foreclose that.
- **Nest `product/airline/seat` and `product/accommodation/room` as `product/airline/flight/seat` and `product/accommodation/room-type/room`.** Accepted: matches the actual `CONTAINS` parent-child relationship exactly, and required renaming `product/accommodation/room-category` to `product/accommodation/room-type` first (so the parent is `room-type`, its child is `room-type/room`, without the awkward `room-category`/`room-category/room` reading or a `-category` vs plain-`room` naming split).
- **Rename `stock/*` identifiers to match in the same pass.** Rejected for now, consistent with the existing `stock/flight/seat` precedent: scope creep into Inventory/Order Management is unwarranted for a naming-consistency fix with no functional defect. Tracked as a named follow-up (see terminology.md's "Limitations and unresolved work").

## Decision

Adopt the pattern:

- **OrgaRole:** `organisation/<family>` (`organisation/airline`, `organisation/accommodation`, `organisation/mobility`, `organisation/water-transport`, `organisation/experience`, `organisation/protection`), replacing every `partner/supplier/<family>` identifier.
- **TouristicProductItem:** `product/<family>/<type>[/<subtype>]`, where `<family>` is required to match the connected OrgaRole's family segment exactly, and a structural child (created/read only as a `CONTAINS` child of one specific parent type) is nested one level under its parent type's identifier rather than sitting as a flat sibling.

Concretely:

| Old | New |
|---|---|
| `partner/supplier/airline` | `organisation/airline` |
| `partner/supplier/accommodation` | `organisation/accommodation` |
| `partner/supplier/mobility` | `organisation/mobility` |
| `partner/supplier/water-transport` | `organisation/water-transport` |
| `partner/supplier/experience` | `organisation/experience` |
| `partner/supplier/protection` | `organisation/protection` |
| `product/water/day-boat` | `product/water-transport/day-boat` |
| `product/water/cruise` | `product/water-transport/cruise` |
| `product/airline/seat` | `product/airline/flight/seat` |
| `product/accommodation/room-category` | `product/accommodation/room-type` |
| `product/accommodation/room` | `product/accommodation/room-type/room` |

`person/customer` and `person/traveller` (PersonRole) already conform to this pattern and are unchanged. Every `stock/*` identifier is explicitly left unrenamed; see terminology.md's "Limitations and unresolved work" for the resulting `stock/*`/`product/*` naming mismatch, tracked as a follow-up.

## Consequences

### Positive

- Every OrgaRole/TouristicProductItem family segment now matches exactly and reads consistently, closing the last exception the issue #31 follow-up left open.
- Structural-child identifiers now reflect the real `CONTAINS` composition, matching how `displayName`/`lifecycleStatusCode` (TERM-004) already describe catalogue-root vs. structural-child types differently.
- `TERM-009`'s deprecation table documents the mapping so a reader tracing an old identifier from prior scenarios, screenshots, or issue discussions can find its replacement without guessing.

### Negative and risks

- `stock/water/day-boat`, `stock/water/cruise`, and `stock/accommodation/room-category` now read inconsistently against their renamed `product/*` counterparts (`product/water-transport/*`, `product/accommodation/room-type`), compounding the existing `stock/flight/seat` mismatch. This is accepted, named residual risk, not an oversight.
- Every backend contract, seed-data file, generated OpenAPI client, and frontend reference to the renamed identifiers had to change in the same commit to avoid an inconsistent mid-migration state; this rename touches more files than a typical terminology fix because the identifiers are used as Pydantic `Literal` discriminators, seed JSON `type` values, and generated TypeScript union members throughout the stack.
- Any external document, screenshot, or stakeholder note referencing the old identifiers by name is now stale; none is known to exist outside this repository's own docs, which were updated in the same change.

## Links

- [Flexible Entity-model Terminology](../../architecture/entity-model/terminology.md) (TERM-002, TERM-009, "Limitations and unresolved work")
- [Logical Entity Model](../../architecture/entity-model/entity-model.md)
- Issue #31 (Touristic product catalogue) and its tree-view follow-up, which established the `product/hotel/*`→`product/accommodation/*` and `product/flight`→`product/airline/flight` precedent this record extends
