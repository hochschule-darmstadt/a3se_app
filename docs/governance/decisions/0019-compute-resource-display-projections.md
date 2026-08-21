# DR-0019: Compute resource display projections in the backend

- Status: accepted
- Date: 2026-08-21
- Deciders: requirements, architecture, and stakeholder at issue #50 Phase 1 checkpoint (accepted 2026-08-21)
- Supersedes: DR-0013 in part if accepted

## Context

Issue #31 temporarily stored a product `displayName` and assembled catalogue breadcrumbs in Staff Interaction through several resource calls. Issue #50 requires display names and contextual chains to be computed from current authoritative properties and relationships, never persisted, and shown consistently by collection and detail views. A durable contract is needed for ownership, transport shape, migration, and invalid graph behavior.

The seed audit found 182 products, of which 130 store `displayName`, none store `name`, and none store both. The current strict request contracts reject unknown properties, but the shared responses expose only persisted entity properties and therefore provide no common derived projection.

## Decision drivers

- one naming rule and one chain result for every consumer;
- derived values must reflect source edits immediately and never become stale persisted duplicates;
- Interaction modules must remain presentation consumers rather than duplicate cross-module business rules;
- chain ordering must remain semantic data rather than be coupled to one punctuation choice;
- incomplete, cyclic, or ambiguous graphs must fail visibly rather than receive plausible but misleading identifier fallbacks;
- the `displayName` to `name` seed correction must be lossless.

## Considered options

- Keep client-side composition over existing CRUD endpoints. Rejected: list/detail and customer/staff consumers can drift, and business rules would live in Interaction code.
- Add a catalogue-only breadcrumb endpoint. Rejected: it does not satisfy the common display-name contract and creates a second response shape beside normal resource reads.
- Persist computed names and chains. Rejected: ancestor, role, organisation, and property edits would require cross-aggregate fan-out updates and risk stale labels.
- Add computed fields to resource read responses and compose them through owning Resource services. Proposed: this keeps writes strict, makes the projection available to every consumer, and preserves module ownership.

## Decision

Every collection/detail response in the FR-010 scope includes read-only `displayName: string` and `displayNameChain: string[]`. Requests do not include either field and continue to reject extra keys. Resource services own label computation; a shared backend read-model composer obtains cross-module context through public owning-module service interfaces permitted by DR-0013. UI code joins the ordered chain with ` · ` and does not recompute its components.

Rename seeded product `displayName` to `name` before enabling the projection. All 130 known seed values are retained. Existing prototype databases are disposable and adopt the change through the existing reset-and-reseed workflow; no in-place migration is provided. For product types with a specific rule, the retained `name` remains source data but does not override that rule; for the otherwise unnamed product types, `name` is required and is the display source.

Reads report the existing API error envelope with a dedicated `invalid_entity_graph` type when required display source data is missing or canonical ownership is ambiguous/cyclic. The HTTP status is proposed as `409 Conflict`: the requested resource exists, but its stored graph cannot produce the promised representation. No entity-ID fallback is returned.

A supplier belongs to the individual product. For a multi-leg itinerary, each
nested flight uses its own airline supplier to compute its flight designator;
the root supplier alone contributes the organisation/role prefix to the chain.
This clarification was made from live Phase 2 evidence after the existing
four-leg seed itinerary exposed the earlier, incompatible root-only assumption.

## Consequences

### Positive

- Collection and detail labels share one backend contract and update immediately after source changes.
- The array transport preserves component boundaries for search, accessibility, and alternative presentation.
- The corrected seed retains existing authored text, and reset-and-reseed keeps the prototype adoption path simple.

### Negative and risks

- List projection may require additional graph reads; Phase 2 must measure and avoid per-row request amplification.
- Existing generated clients and every affected response test change.
- A malformed graph makes an otherwise readable resource response fail with 409 until data is repaired.
- `StockItem` and `OrderItem` remain outside FR-010 because the supplied rules do not cover them and `order/position` has no descriptive source property; the Phase 1 checkpoint explicitly accepted this scope boundary.

## Validation and revisit triggers

Validate every rule/value, corrected seed count, rejection of writable derived fields, source-edit freshness, nested chain ordering, list/detail equality, search by each component, and all named invalid-graph cases. Measure catalogue list query behavior with representative seed volume. Revisit the reset-and-reseed choice when a non-disposable environment exists. Revisit the response shape if another consumer needs structured component identifiers in addition to text, or if projection cost cannot meet NFR-001 without a dedicated read model/cache whose invalidation preserves freshness.

## Links

- [FR-010–FR-014](../../requirements/functional-requirements.md#display-name-and-chain-rules-fr-010fr-014)
- [Logical entity model](../../architecture/entity-model/entity-model.md#computed-presentation-identity)
- [Flexible entity-model terminology](../../architecture/entity-model/terminology.md)
- [VIEW-S-003 specification](../../requirements/ux/wireframes/wireframes.md#display-name-chain-proposal-issue-50-phase-1)
- [DR-0013](0013-shared-resource-crud-api-and-openapi-contract.md)
- GitHub issue #50
