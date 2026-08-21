# Shared UI Design System

- Status: proposed
- Owner: Requirements/UX
- Last reviewed: 2026-08-19

## Purpose, authority, and limits

This is the one authoritative design system for Customer Interaction and Staff Interaction. It defines shared semantic foundations and accessible interaction contracts with two presentation profiles. It is a requirements and proof-of-concept guide, not a published component package and not authority for new business behavior.

It consumes the [navigation maps](../navigation-maps/navigation-maps.md), [wireframes](../wireframes/wireframes.md), accepted [functional requirements](../../functional-requirements.md), and [DR-0010](../../../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md). Mantine is the implementation foundation; this specification owns product semantics rather than duplicating its catalogue. The bounded [structure review](../../sources/design-system-structure-review.md) informed organization only. The [comparison-portal review](../../sources/ab-in-den-urlaub-ux-review.md) informed customer hierarchy only; no third-party branding, assets, claims, taxonomy, exact values, or proprietary layouts are adopted.

The static [review catalogue](catalogue.html) uses synthetic content and no production dependencies. It demonstrates review coverage, not stakeholder acceptance or automated accessibility conformance.

## Foundations

Tokens use the `--ds-{category}-{role}` convention. Components consume semantic roles, never palette positions or unexplained raw values. Values are original proposals pending visual and accessibility evaluation.

### DS-FND-001 Colour

| Token | Value | Meaning |
|---|---:|---|
| `surface-canvas` | `#f4f7fb` | application background |
| `surface-panel` | `#ffffff` | principal content surface |
| `surface-subtle` | `#eaf1f8` | grouped or selected-neutral surface |
| `text-primary` / `text-muted` | `#17243d` / `#53627a` | principal and secondary text |
| `border-default` | `#c5d0dd` | boundaries and dividers |
| `action-primary` / `action-primary-hover` | `#d6531b` / `#ad3e0f` | high-priority action |
| `action-secondary` | `#087ea4` | discovery, links, secondary action |
| `navigation-strong` | `#132642` | persistent navigation |
| `status-info/success/warning/danger` | `#087ea4/#1c7c54/#996300/#b42318` | shared state meanings |
| `focus-ring` | `#ffbf47` | visible keyboard focus |
| `disabled-surface/text` | `#e2e8f0/#667085` | unavailable control |

Status always includes text, icon shape, or another non-colour cue. The exact contrast target remains unresolved under DS-Q-001.

### DS-FND-002 Typography

- `font-sans`: system UI stack. A hosted font is not required.
- `text-xs/sm/md/lg/xl/2xl`: 0.75/0.875/1/1.125/1.5/2rem, with at least 1.4 line height for body text.
- Headings use ordered semantic levels; visual size does not determine level.
- Prices and dense figures may use tabular numerals. All-caps is limited to short badges and never carries meaning alone.
- Customer presentation uses larger headings and relaxed measure. Staff labels may be compact without reducing body text below 0.875rem.

### DS-FND-003 Space, size, border, and elevation

- Space scale `1/2/3/4/6/8/12` maps to 0.25/0.5/0.75/1/1.5/2/3rem.
- Customer interactive targets are at least 2.75rem. Staff controls may be 2.25rem where density is evidenced; accessible naming and keyboard focus remain equivalent.
- Radius roles are `control` (0.5rem), `card` (0.75rem), and `pill` (999px); border roles are `default` (1px) and `emphasis` (2px).
- `elevation-raised` is restrained and reserved for overlays and customer discovery cards. Staff surfaces prefer borders.

### DS-FND-004 Focus, breakpoints, and motion

- Every interactive element has a 3px focus ring with 2px offset. Focus is never removed without an equal replacement.
- Customer review breakpoints align with wireframes: mobile below 700px, tablet 700–1099px, PC at least 1100px. They are exemplars, not new requirements beyond FR-004.
- Layout starts mobile-first. The advisor is a right rail on tablet/PC and a persistent labelled launcher/drawer on mobile; conversation and confirmed context survive the change (WF-011).
- Motion durations are `fast` 120ms and `standard` 200ms. Motion only clarifies state or spatial relation. Under `prefers-reduced-motion: reduce`, non-essential motion is effectively removed and progress remains textually expressed.

## Profiles

### DS-PRO-001 Customer

Comfortable, expressive, responsive, and travel-oriented. It uses shared dark navigation, blue/cyan discovery emphasis, a warm primary action, generous synthetic imagery, white panels, offer cards, compact status badges, and prominent search and price hierarchy. Content is reassuring but avoids unsupported promotional claims. Default panel gap is `space-6`; cards may use elevation.

### DS-PRO-002 Staff

Compact, restrained, keyboard-efficient, and data-dense. It reuses colour meanings, typography, focus, controls, validation, and feedback. Default panel gap is `space-3`; tables, stable list/detail/edit regions, persistent filters, and domain-labelled operations take precedence. Promotional cards, decorative imagery, and customer sales hierarchy are excluded where they impede work.

Profiles change presentation, never state meaning, accessible name, action semantics, or business outcome.

## Components and patterns

| ID | Contract and supported behavior | Mantine mapping | Evidence |
|---|---|---|---|
| DS-CMP-001 | **Page/app shell and navigation:** skip link; header (logo, page identity, user-icon menu) with nav/main landmarks, plus breadcrumb trail on deeper views. Staff additionally provides a persistent sidebar landmark for managed-area navigation and no footer; customer additionally provides a footer landmark (imprint/legal) and reserves the advisor context (`aside`), with no sidebar. Mobile retains all customer destinations. | `AppShell`, `NavLink`, `Burger`, landmarks | WF-001/005/011/012; all views |
| DS-CMP-002 | **Button and link:** primary, secondary, subtle, danger; default, hover, focus, disabled, loading. Links navigate; buttons act. Loading preserves an accessible label and prevents duplicates. | `Button`, `Anchor`, `Loader`; no wrapper by default | WF-002/007; all views |
| DS-CMP-003 | **Form and validation:** visible label, help, required cue, control, associated message. Invalid submission focuses a linked summary. Disabled and read-only remain distinct. | form controls, `Fieldset`, `Alert`, `useForm` | WF-008; C-001/011/012, S-002–005/007 |
| DS-CMP-004 | **Status and feedback:** loading, empty, unavailable, information, pending, success, error, uncertain. Live updates are polite unless urgent and never imply completion from submission alone. | `Alert`, `Notification`, `Badge`, `Loader`, `Skeleton` | WF-004, FR-009; customer and staff states |
| DS-CMP-005 | **Card:** one destination, product, offer, order summary, or portal entry; heading, facts, status, actions. Customer may use imagery/elevation; staff cards are limited to entry or small summaries. | `Card`, `Image`, `Group`, `Stack`, `Badge` | C-001/009/010, S-001 |
| DS-CMP-006 | **Data table:** caption, headers, row identity, selection distinct from activation, sort/filter/paging, loading/empty/error, horizontal overflow. Advanced grid keyboard behavior and virtualization remain PoC questions. | `Table`, `ScrollArea`, controls; no grid wrapper yet | WF-006/Q-005; S-002–005/007 |
| DS-CMP-007 | **List/detail/edit:** stable regions; visible selection; preserved filters/paging; cancel returns to the last stable selection; validation preserves edits; business actions use domain terms. In the staff portal, the active view, shareable filters, page, and open detail record are URL state: reload and browser back/forward restore that state. Record hyperlinks push a new URL while retaining the originating entry in browser history. Unsaved form input is excluded. Filter typing may replace the current history entry to avoid one back step per keystroke; selection, paging, and linked-record navigation create entries. Within a staff detail panel, hierarchy and component record links may use clickable `Badge` chips to distinguish compact navigation from inline prose links. A product hierarchy runs upward from the immediate product parent to its root product, supplying organisation role, and organisation; product, role, and component chips use each record's full display-name chain. Navigation restores focus according to the shared accessibility rules below. | composition of shell, table, panels and form primitives; `Badge`; React Router search parameters | WF-006/007; S-002–007; issues #51/#53 |
| DS-CMP-008 | **Offer/order summary:** identifier, itinerary/services, party context, price/currency, validity/status, conditions, availability provenance, explicit next action. Pending data is labelled; acceptance is not preselected. | product `OfferSummary` composition | C-003/004/005; UC-008/010/016/018 |
| DS-CMP-009 | **Advisor conversation:** labelled transcript, speakers, composer, send state, journey context. Mobile drawer manages focus and returns it to the launcher. | product `AdvisorConversation` composition | FR-008, NFR-002, WF-009/011; C-001/007 |
| DS-CMP-010 | **Advisor action:** action label, affected context, proposed/awaiting input or authorization/in progress/confirmed/failed or uncertain state, explanation, next action. Only confirmed results change confirmed context. | product `AdvisorAction` composition | FR-009, WF-010; C-001/002/007 |
| DS-CMP-011 | **Iconography:** a small, fixed set of seven icons from a standard library (not hand-authored), each `aria-hidden` and decorative alongside a required visible text label, never replacing it. Shared across profiles for the same concept -- person/account (staff "Customers and travellers"; customer and staff header user menu; VIEW-C-008), orders (staff "Orders"; customer VIEW-C-004/C-008), assistance (customer VIEW-C-007; staff VIEW-S-006, not yet wired -- no route exists for either view yet) -- plus staff-only icons for areas without a customer-facing equivalent (home, touristic product catalogue, suppliers and partners, inventory). Not a general-purpose icon system: added because these concepts already recur across both profiles' evidenced views, not speculatively. | Tabler Icons (`@tabler/icons-react`, MIT-licensed), matching Mantine's own stroke-width/corner-radius visual language; tree-shaken to the ~7 icons actually imported (`frontend/packages/ui/src/icons.tsx`), not the full set | WF-012; issue #27 ("user-icon menu"); VIEW-C-004/007/008; VIEW-S-001–007 |

### Shared content and accessibility rules

- Use glossary terms and domain-labelled verbs, not generic “OK”, “process”, or “save” when the business action can be named.
- Allow at least 30% text expansion to wrap without clipping or action loss.
- Preserve native semantics. Repeated or icon-only controls need object-specific accessible names.
- Manage focus after navigation, overlay opening/closing, validation failure, and confirmation. Escape closes a dismissible overlay and returns focus unless work would be lost.
- Every loading, empty, error, unavailable, pending, success, or uncertain state names a next step where one exists.

## Governance

### DS-GOV-001 Ownership and change path

Requirements/UX owns semantics and profiles; Implementation owns faithful Mantine realization; Test owns independent evidence. A proposal identifies the need, affected `DS-*` IDs, source view/requirement, both-profile impact, accessibility/localisation/responsive impact, Mantine reuse decision, and catalogue/test update. Material business or technology choices require a decision record.

Review order is evidence and terminology; semantic fit; accessible behavior and states; profile mapping; feasibility; catalogue and test evidence. Wording changes preserve IDs; retired IDs are never reused.

### DS-GOV-002 Admission, change, and deprecation

Add an item only when repeated across views, expressing stable product semantics/policy, or preventing material accessibility/consistency risk. One-off compositions remain local. Prefer Mantine primitives/theme configuration; wrap only stable semantics such as `AdvisorAction` and `OfferSummary`.

Deprecation records replacement, reason, consumers, and removal condition. Independent packaging, elaborate semantic versioning, dark mode, multiple brands, exhaustive icons/motion, and unevidenced components remain excluded.

| Date | Change | Evidence and state |
|---|---|---|
| 2026-08-17 | Proposed foundations, two profiles, ten evidenced contracts, governance, and catalogue. | Issue #16; stakeholder, accessibility, Test, and PoC review remain |
| 2026-08-19 | Refined DS-CMP-001's contract wording (ID unchanged) to name breadcrumbs and the customer footer landmark explicitly, reflecting the phase 1 shell wireframe refinement. | Issue #27 phase 1 (WF-012); reviewed and accepted by stakeholder direction, 2026-08-19 |
| 2026-08-19 | Implemented DS-CMP-001 as `CustomerShell`/`StaffShell` (`frontend/packages/ui/src/shell.tsx`), composed from shared logo/breadcrumb/user-menu primitives; every Customer and Staff route now plugs into its profile shell instead of owning header/footer/nav markup. | Issue #27 phase 2; frontend unit tests (`app/lib/shell.test.tsx` in both apps), typecheck, and build all pass; pending the issue's phase 2 human review checkpoint |
| 2026-08-19 | Applied DS-FND-001's `navigation-strong` token to the shell header (both profiles) and staff sidebar background, styled sidebar links with a visible hover/focus/current-page state (mirroring the reviewed wireframe), and integrated the real CCT logo (issue #24's `-dark` wordmark/acronym assets) in place of the initial text placeholder. Corrects gaps in the first phase-2 pass, flagged in review. | Issue #27 phase 2 follow-up; stakeholder direction, 2026-08-19, to integrate the logo now rather than via a separate issue |
| 2026-08-19 | Enlarged the wordmark/acronym text relative to the ring mark in `docs/requirements/ux/logo/*.svg` (stakeholder feedback: text read too small); switched the staff header to the same full wordmark the customer header uses, dropping the acronym lockup there, for cross-profile consistency; restored the "Home" sidebar entry the reviewed wireframe has and this implementation had dropped. | Issue #27 phase 2 follow-up; stakeholder direction, 2026-08-19 |
| 2026-08-19 | Proposed DS-CMP-011 Iconography, then implemented it with Tabler Icons (`@tabler/icons-react`) rather than a hand-authored set (stakeholder direction) -- not the "icon subsystem" the initial review rejected; that rejection was about prematurely standing up a whole separate subsystem section, per `design-system-structure-review.md`'s "deliberate simplification" principle, not a judgment against icons. Wired into the staff sidebar (all six areas) and both shells' header user menu; the assistance icon is reserved, unwired, since VIEW-C-007/S-006 have no route yet. | Stakeholder request, 2026-08-19; frontend typecheck/test/build all pass; DS-Q-006 closed by the library choice (see below) |
| 2026-08-20 | Changed the `StaffShell` header page-identity text from "Staff" to "Staff Portal" (`frontend/packages/ui/src/shell.tsx`) for clarity. | Issue #29 phase 2 stakeholder review, 2026-08-20 |
| 2026-08-21 | Extended DS-CMP-007 with the staff portal's reusable URL-state and native browser-history contract. The product catalogue implements filters, paging, selection, and related-product hyperlinks; Customers and travellers and Suppliers and partners reuse the same contract for their filters, paging, selection, and create panel. | Issue #51; automated URL round-trip and navigation tests |
| 2026-08-21 | Extended DS-CMP-007 with compact `Badge`-based record-link chips for hierarchy and component navigation in staff detail panels. The product catalogue presents the upward chain from immediate product parent through root product, supplying organisation role, and organisation, and uses the same full display-name-chain presentation for component links. | Issue #53 plus stakeholder clarification; automated rendering, ordering, and URL-state navigation tests; pending human review checkpoint |

## Review and validation record

The catalogue demonstrates both profiles; tokens; buttons/links; form validation; feedback; cards; data table/list-detail; offer/order and advisor states; responsive reflow; visible focus; semantic landmarks; text wrapping; and reduced-motion CSS. Intended render sizes are 1440×1000, 900×1000, and 390×844.

This does not prove assistive-technology compatibility, WCAG conformance, production Mantine behavior, real localization, backend integrity, staff-grid feasibility, or usability. AI generated the initial specification and examples; critical review rejected two systems, copied branding/assets, speculative components, dark mode, an icon subsystem, blanket wrappers, invented authorization, and treating submission as confirmation.

## Open questions and residual risks

| ID | Question / risk | Owner and resolution |
|---|---|---|
| DS-Q-001 | What exact contrast target and accessibility conformance level apply? | Requirements/Test; accepted measurable requirement |
| DS-Q-002 | What product name, logo, and owned imagery replace placeholders? | Stakeholder/UX; approved original identity and asset rights |
| DS-Q-003 | Does the staff PoC need an NFR-003-compliant grid beyond Mantine Table? | Implementation/Test; representative scale and keyboard test |
| DS-Q-004 | Which hypotheses need usability testing, and with whom? | Stakeholder Management/UX; accepted research plan |
| DS-Q-005 | Which advisor actions require confirmation, re-authentication, or handover? | NAV-Q-007; accepted Security/Privacy/Business policy |
| DS-Q-006 | *Resolved 2026-08-19.* Originally asked whether DS-CMP-011's icons would need the logo's hand-authored-and-similarity-reviewed process. Stakeholder direction sourced them from Tabler Icons (`@tabler/icons-react`, MIT-licensed, standard/widely recognized shapes) instead, which does not carry the logo's brand-originality concern. No small-size legibility check has been run against this project's specific rendering contexts. | Requirements/UX |
