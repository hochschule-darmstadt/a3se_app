# DR-0018: Reduce TERM-010 image metadata to `imageUrl` only

- Status: accepted
- Date: 2026-08-21
- Deciders: stakeholder (product owner direction)
- Supersedes: DR-0014 (in part — TERM-010's image-metadata shape only; DR-0014's seed-generation decisions otherwise stand)

## Context

DR-0014 introduced TERM-010: eight image properties (`imageUrl`, `imageSourcePageUrl`, `imageCreatorCredit`, `imageLicenceCode`, `imageLicenceVersion`, `imageAttributionText`, `imageAltText`, `imageVerifiedDate`) attached to representative `product/*` catalogue items, gated by an all-or-nothing validator: every field required once `imageUrl` is present, all absent otherwise. The seed layer additionally rejected alt text that merely restated the image filename. The seven non-URL fields exist to carry Creative Commons/public-domain licence compliance (SPDX-identified licence, version, attribution line, creator credit, source page, verification date) and WCAG 2.2 accessible alt text for the Wikimedia Commons images issue #12's research selected.

The stakeholder directed that image metadata be reduced to the URL alone, across the Pydantic entity model, the seed schema and seed data, the generated OpenAPI/TypeScript contracts, and the affected tests.

## Decision drivers

- Explicit stakeholder direction, not an AI-initiated simplification.
- AGENTS.md rule 11: material limitations of an AI-assisted or stakeholder-directed change must be surfaced, not silently absorbed, when they affect an engineering or compliance decision.

## Considered options

- **Re-source the seed images as CC0/public-domain first, then simplify to URL-only**, avoiding any licence-compliance gap. Not selected: the stakeholder chose to proceed with the existing CC-BY-SA/CC0-sourced images and accept the tradeoff rather than delay on re-sourcing.
- **Keep the full eight-field shape.** Not selected: does not satisfy the stakeholder's direction to carry only the URL.
- **Drop to `imageUrl` only, accepting the licence-attribution gap as named residual risk.** Accepted.

## Decision

`ImageProperties` (backend Pydantic model), `ImageSeed` (seed schema), `images.py`'s `image_properties()` helper, and `sources/images.json` now carry only `imageUrl` (plus, for `ImageSeed`, the existing `productId` key). The all-or-nothing validator and the seed alt-text-not-derived-from-filename validator are removed, since both existed only to police the now-removed fields. The OpenAPI contract and generated TypeScript client were regenerated (`npm run api-client:generate`) to drop the seven fields from every `product/*` schema. TERM-010 in terminology.md was reduced to the single `imageUrl` row.

## Consequences

### Positive

- Simpler entity, seed, and contract shape; one property instead of eight, no cross-field validation to maintain.

### Negative and risks

- **Licence-compliance gap, accepted as known risk.** The seed images (Wikimedia Commons, CC-BY-SA-3.0/4.0 and CC0-1.0) require attribution or explicitly waive it; the fields that carried that attribution (`imageCreatorCredit`, `imageLicenceCode`, `imageAttributionText`, `imageSourcePageUrl`) no longer exist anywhere in the system. If these images are ever rendered to an end user, the licence terms are not being met by the stored data alone. This was flagged to the stakeholder before the change was made; the stakeholder chose to proceed rather than re-source the images or otherwise preserve attribution. Any future feature that actually displays these seed images must address attribution separately (re-source as CC0/public-domain, or reintroduce attribution data) before doing so.
- Accessible alt text (`imageAltText`) no longer exists; a future image-rendering feature has no accessible-description source and must add one.
- `imageVerifiedDate`'s re-verification trail is gone; there is no longer a recorded date confirming the licence/source page was last checked.
- Every backend contract, seed-data file, generated OpenAPI client, and test referencing the removed fields had to change in the same commit to avoid an inconsistent mid-migration state, mirroring DR-0017's precedent for cross-cutting field/identifier changes.

## Links

- [Flexible Entity-model Terminology](../../architecture/entity-model/terminology.md) (TERM-010, "AI-assisted validation record")
- [DR-0014: Deterministic seed data and compose seeding](0014-deterministic-seed-data-and-compose-seeding.md) — original TERM-010 rationale and seed-generation decisions, not otherwise revised
- Issue #12 (original TERM-010 introduction)
