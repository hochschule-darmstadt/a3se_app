# Christopher Columbus Travel Logo

- Status: proposed
- Owner: Requirements/UX
- Last reviewed: 2026-08-19

## Purpose and authority

This is the authoritative record for issue #24: the Christopher Columbus Travel (CCT) logo identity. The stakeholder selected **Concept A — Waypoint** on 2026-08-19 (see [Decision](#decision)); this document now specifies that identity's assets and usage rules. It remains `proposed` rather than `accepted` because the full validation evidence #24 requires (accessibility/contrast measurement, visual regression, independent similarity review) has not run — see [Residual risks](#residual-risks-and-deferred-work).

It consumes the accepted [design system](../design-system/design-system.md) (colour, typography, space, and focus foundations) and treats Mantine/the frontend UI package as the eventual implementation target, without selecting new technology here.

## Concepts considered

Three original, hand-authored vector concepts were compared — see the [review page](review.html) for light/dark, monochrome, favicon-size (32px/16px), and wordmark renderings of each, and a self-assessment table against #24's selection criteria. Rejected concepts B and C remain in the repository ([concept-b-horizon.svg](concept-b-horizon.svg), [concept-c-monogram.svg](concept-c-monogram.svg)) as the review record; they are not used elsewhere.

| ID | Concept | Source | Rationale summary | Outcome |
|---|---|---|---|---|
| LOGO-CPT-A | Waypoint | [concept-a-waypoint.svg](concept-a-waypoint.svg) | Open ring with a waypoint dot; abstract wayfinding motif, strongest at small sizes. | **Selected** |
| LOGO-CPT-B | Horizon route | [concept-b-horizon.svg](concept-b-horizon.svg) | Rising route line to a destination dot; forward-looking journey motif. | Rejected |
| LOGO-CPT-C | CT monogram | [concept-c-monogram.svg](concept-c-monogram.svg) | Literal C+T initials with a destination-dot accent; most distinctive, needs the most refinement for small-size legibility. | Rejected |

All three deliberately avoided historical portraiture, ship silhouettes, or other imagery that could read as triumphalist/colonial, per #24's explicit brand-review requirement — none references Christopher Columbus's historical image directly; each was an abstract wayfinding or initials mark instead.

## Decision

**Concept A — Waypoint — selected by the stakeholder on 2026-08-19.** The open-ring-plus-waypoint-dot mark is now the CCT identity. An additional acronym lockup (mark + "CCT") was requested alongside the full wordmark (mark + "Christopher Columbus Travel") and the icon-only mark — see [Assets](#assets).

### Selected identity at a glance

<img src="cct-mark-light.svg" width="56" height="56" alt="CCT mark"> &nbsp;&nbsp;
<img src="cct-acronym-light.svg" width="140" alt="CCT acronym lockup"> &nbsp;&nbsp;
<img src="cct-wordmark-light.svg" width="260" alt="Christopher Columbus Travel wordmark">

*(rendered on a light background — see the [review page](review.html) for dark-surface and monochrome renderings, since this file's own background isn't guaranteed light in every viewer)*

## Assets

All files are repository-owned SVG (plus PNG icon fallbacks), require no external runtime requests, and live in this directory.

| Preview | File | Purpose | Dimensions / view box |
|---|---|---|---|
| <img src="cct-mark-light.svg" width="28" height="28" alt=""> | [cct-mark.svg](cct-mark.svg) | Compact icon-only mark; `currentColor` ink + `--logo-accent` CSS variable (falls back to `currentColor`, giving single-colour use for free). Recommended for frontend/CSS-driven contexts. | `0 0 64 64` |
| <img src="cct-mark-light.svg" width="28" height="28" alt=""> | [cct-mark-light.svg](cct-mark-light.svg) | Compact mark, colours baked in, for light surfaces / non-CSS contexts. | `0 0 64 64` |
| <img src="cct-mark-dark.svg" width="28" height="28" alt="" style="background:#132642"> | [cct-mark-dark.svg](cct-mark-dark.svg) | Compact mark, colours baked in, for dark surfaces. | `0 0 64 64` |
| <img src="cct-mark-mono.svg" width="28" height="28" alt=""> | [cct-mark-mono.svg](cct-mark-mono.svg) | Compact mark, single colour (`currentColor` for both ring and dot). | `0 0 64 64` |
| <img src="cct-wordmark-light.svg" width="120" alt=""> | [cct-wordmark.svg](cct-wordmark.svg) / [-light](cct-wordmark-light.svg) / [-dark](cct-wordmark-dark.svg) | Full wordmark: mark + "Christopher Columbus Travel". | `0 0 480 64` |
| <img src="cct-acronym-light.svg" width="70" alt=""> | [cct-acronym.svg](cct-acronym.svg) / [-light](cct-acronym-light.svg) / [-dark](cct-acronym-dark.svg) | Compact acronym lockup: mark + "CCT" — requested as an additional variant between the icon-only mark and the full wordmark. | `0 0 160 64` |
| <img src="favicon.svg" width="24" height="24" alt=""> | [favicon.svg](favicon.svg) | Browser-tab favicon (SVG, scales natively). Copy of `cct-mark-light.svg`. | `0 0 64 64` |
| <img src="favicon-32.png" width="24" height="24" alt=""> | [favicon-16.png](favicon-16.png), [favicon-32.png](favicon-32.png) | Raster favicon fallback for browsers without SVG-favicon support. | 16×16, 32×32 |
| <img src="apple-touch-icon-180.png" width="24" height="24" alt=""> | [apple-touch-icon-180.png](apple-touch-icon-180.png) | iOS home-screen icon convention. | 180×180 |
| <img src="icon-192.png" width="24" height="24" alt=""> | [icon-192.png](icon-192.png), [icon-512.png](icon-512.png) | PWA-manifest icon convention. | 192×192, 512×512 |

PNG icons were rasterized from `cct-mark-light.svg` (full colour, transparent background) with no manual retouching.

## Usage rules

- **Clear space**: keep at least the accent dot's diameter (1/6 of the mark's height) of empty space clear on every side of the mark, wordmark, and acronym lockup.
- **Minimum size**: mark alone, 16px (favicon minimum); wordmark, 140px wide (below which "Travel" becomes hard to read at normal screen density); acronym lockup, 72px wide.
- **Backgrounds**: use `-light` variants on light surfaces (`surface-canvas`/`surface-panel`), `-dark` variants on `navigation-strong`/dark surfaces, and `-mono` only where a true single-colour reproduction is required (print, watermarks).
- **Prohibited**: do not recolour the ring or accent dot to non-brand hues; do not stretch non-uniformly; do not rotate the mark; do not add drop shadows, gradients, or outlines; do not place the `-light` variant on a low-contrast light background or `-dark` on a low-contrast dark one.

## Provenance and similarity review

AI (this repository's coding agent) authored all three concepts as original vector geometry (arcs, lines, and circles composed directly in SVG) — no AI-generated raster image was used as a source, and no existing logo, stock mark, or font asset was traced or copied. A bounded web search (not a trademark/legal clearance) for `travel agency logo "open ring" waypoint dot icon brand` returned only generic logo-marketplace inspiration pages, no specific matching mark. A search for `"Christopher Columbus Travel" company logo` found unrelated real companies named "Columbus Travel" (Ecuador, Ohio, Galapagos) but no visual match to this mark or evidence any of them uses a similar open-ring identity. This is a reasonable-effort project review per #24, not a legal trademark clearance.

## Residual risks and deferred work

- **Accent-token reuse**: the accent dot uses the design system's `action-primary` token (`#d6531b`), normally reserved for "high-priority interaction." Using it as a static brand accent blurs that semantic meaning; Requirements/UX should confirm this is acceptable or introduce a dedicated brand-accent token before wide reuse.
- **Typeface**: wordmark/acronym text uses the design system's system-UI sans stack, not a custom brand typeface — not yet explicitly confirmed as the permanent brand typography choice.
- **No measured contrast/accessibility check**: legibility at small sizes was checked visually (see the [review page](review.html) render), not via automated contrast or accessibility tooling.
- **No visual-regression evidence**: no automated screenshot-diff test exists yet; would need to be added once the mark is integrated into the frontend.
- **Similarity review is bounded**: see [Provenance and similarity review](#provenance-and-similarity-review) — a web search, not a trademark search.
- **Application integration is out of scope for #24** (see its Scope boundaries) and is not yet tracked by a separate issue after #26 was removed; a follow-up issue should be created before this identity is wired into the Customer/Staff shells (#27) when that work is prioritized.
- **`.ico` format not produced** — modern browsers accept SVG/PNG favicons; legacy `.ico` support can be added later if evidenced as needed.

## Links

- Issue #24 (Create the Christopher Columbus Travel logo)
- [Review page](review.html)
- [Design system](../design-system/design-system.md)
