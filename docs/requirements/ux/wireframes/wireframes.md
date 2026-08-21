# Low-fidelity Wireframes

- Status: proposed
- Owner: Requirements
- Last reviewed: 2026-08-21

## MVP scope note (issue #32, VIEW-S-007)

Stakeholder authorization on 2026-08-21 accepted implementation without a separate Phase 1 checkpoint. The VIEW-S-007 MVP is governed by these stable view requirements:

| ID | Requirement | Classification |
|---|---|---|
| INV-001 | Inventory shall list pre-procured capacity with its linked TouristicProductItem, supplier context, service date, available, held, and allocated quantities, and derived availability state. | Accepted for issue #32; refines UC-006, UC-009, UC-017. |
| INV-002 | Staff shall query Inventory by date range, product or supplier display-chain text, availability state, and linked product type; filtering shall execute against the persisted collection rather than only the browser's current page. | Accepted interaction requirement; VIEW-S-007; stakeholder clarification 2026-08-21. |
| INV-003 | A Purchaser shall record a stock entry only for a lowest-level TouristicProductItem (for example a room or seat), with service date, sale price, currency, and capacity, and may later adjust those stock-owned values. | Accepted MVP boundary for UC-006; records already agreed capacity, not supplier negotiation. Parent room-type and flight records cannot directly own stock. |
| INV-004 | Allocation and release shall be initiated from an Order position, whose outgoing link refers to StockItem; VIEW-S-007 shall not expose order-allocation actions on a StockItem. | Accepted direction from the logical object model and UC-017; stakeholder clarification 2026-08-21. |
| INV-005 | Withdrawal and expiry shall preserve the StockItem and its allocation history; hard deletion is not exposed by VIEW-S-007. | Accepted audit-preservation rule. |

VIEW-S-007 follows the accepted staff managed-resource pattern: URL-backed filters and selection in a left list pane, with detail/edit or create mode in an independently scrolling right pane. It renders the graph hierarchy as linked Mantine Badge chips identical to Product detail: StockItem → lowest-level product → product ancestors → supplier role → organisation. Product and supplier are relationships represented by that hierarchy, not duplicated StockItem attributes. The entity details show its `type` and stock-owned values (date, quantity, state, and price). “Request supplier capacity” remains visible but disabled because negotiating or committing net-new capacity and supplier agreements require later business decisions. Availability state is derived as withdrawn/expired first, then shortfall for zero or negative availability, held when capacity is held, allocated when exhausted by allocation, and otherwise available. Withdrawal is the editable `inventoryStatusCode` value, not a separate detail action. A StockItem display name is `<product displayNameChain> · YYYY-MM-DD`, ordered root-to-leaf, in lists and detail headings. The create selector omits the stored `stock/` prefix in labels but retains `/` separators.

## MVP scope note (issue #29 phase 1)

VIEW-S-002's frame now shows Person (shared identity) and PersonRole (contextual customer/traveller role) as distinct entities per the [entity model](../../../architecture/entity-model/entity-model.md), reflecting UC-014. In scope: person search/list/detail; role-type and role-status filters; create a Person with an initial role; add a further role to an existing Person; edit Person's shared fields separately from a selected role's role-specific fields; deactivate a role (status change) rather than delete. Deferred: opening a live VIEW-S-006 advice workspace (shown only as a disabled placeholder entry point, since its conversational backing does not yet exist in the build sequence) and the UC-001/UC-002 conversational use cases themselves, which belong to the advisor issues later in the sequence, not staff CRUD.

## MVP scope note (issue #30 phase 1)

VIEW-S-004's frame now shows Organisation (shared identity) and OrgaRole (contextual supplier role, e.g. `organisation/accommodation`, `organisation/airline`, with role-specific properties) as distinct entities per the [entity model](../../../architecture/entity-model/entity-model.md), mirroring VIEW-S-002's Person/PersonRole split. In scope: organisation search/list/detail; role-type and relationship-status filters; create an Organisation with an initial role; add a further role to an existing Organisation; edit Organisation's shared fields separately from a selected role's role-specific fields; deactivate a role (status change) rather than delete. Deferred: the commercial procurement negotiation itself (UC-006: agree quantity, validity, and terms with a supplier), which belongs to #32's "Request supplier capacity" action, not this master-data view. This surfaces a requirements gap (WF-Q-011): unlike `PersonRole`, `OrgaRole` has no `roleStatusCode`-equivalent lifecycle-status property yet, so Phase 2 must add one — following the `roleStatusCode`/WF-Q-010 precedent — before "deactivate role" and the relationship-status filter can be built as specified. The frame also surfaces WF-Q-012: TERM-002 defines only `partner/supplier/*` role types, not a generic `partner/partner` type; the issue's "partner" filter option is deferred until a stakeholder confirms whether a non-supplier partner role is actually needed, rather than inventing one here.

## MVP scope note (issue #31 phase 1)

VIEW-S-003's frame now shows `TouristicProductItem`'s recursive composition explicitly: catalogue items list/detail with a type-driven create/edit form, a components table (rather than a flat list), lifecycle status, and a new `displayName` label. In scope: product search/list/detail; type and lifecycle filters, plus a supplier filter; create a type-selected draft, optionally as a component of a parent; edit a draft's shared and type-specific fields; activate/retire (lifecycle status change, not delete); view the recursive component tree. Two stakeholder decisions (issue #31 phase 1 review) resolve the open questions this issue's Phase 1 explicitly flagged: (1) UC-004 Package Travel bundling reuses the existing recursive `CONTAINS` structure — any product with components is a package, no dedicated `product/package` type; (2) UC-015's "activate a version" is lifecycle-status-only in MVP (WF-Q-014) — no version-number/version-history mechanism, so the low-fidelity "v3" label is dropped. This also surfaced WF-Q-013: no product type has a generic display name, so a shared `displayName` property is added to `ImageProperties`. Deferred: real bookable-date ranges and order/inventory counts shown as flavour text in the original low-fidelity frame, since neither is modeled on `TouristicProductItem` today.

## MVP scope note (issue #31 tree-view follow-up)

Stakeholder review of the #31 implementation found the flat catalogue table unusable at scale and asked for a tree view instead: each matched row shows a breadcrumb "up to the supplier" (organisation name, then the supplying role's type, then any intermediate ancestor labels, then the row's own label) as its title, with a "+" to lazily expand that row's own children to any depth. Unfiltered, only tree roots appear as top-level rows (children reached via "+"); a search or type/lifecycle filter surfaces a match at any depth as its own top-level row instead, so filtering by a child-level type (e.g. `accommodation/room`) jumps straight to it. Search matches anything in the breadcrumb (organisation, role, ancestor, or own name/ID); the separate Supplier field was removed as redundant. Two new backend capabilities were added to compute the breadcrumb: `GET /products/{id}/ancestors` (root-first CONTAINS parent chain) and `GET /organisations/roles/{id}/organisation` (reverse `HAS_ROLE` lookup, also closing the "can't link a role back to its Organisation" gap #31 shipped with). The type selector now also lists every type actually present in the DB (client-derived from the fetched collection, not a hardcoded list) grouped by family, and every type identifier's label is just its own namespaced path (e.g. `airline/flight`) for consistency.

This also prompted a naming-consistency cleanup: the `product/hotel/*` family was an unused duplicate of `product/accommodation/*` (0 seed entries ever used it) and was removed in favour of `accommodation`; the analogous unused duplicates `partner/supplier/hotel` and `stock/hotel/room` were removed too. `product/flight`/`product/flight/seat` were renamed to `product/airline/flight`/`product/airline/flight/seat` to align with the existing `organisation/airline` role family, so every product type now reads as `<family>/<subtype>` consistently. See terminology.md's TERM-002/TERM-009 for the full mapping.

Seed data was updated to match: every catalogue-root product now has a `displayName`, every root-level product has a `supplierRoleId` (already true before this pass), and `lifecycleStatusCode` defaults to `product/active` for the existing catalogue so the tree view has representative data — plus new `product/accommodation/room-type/room` and `product/airline/flight/seat` child instances under a sample of categories/flights to demonstrate expand-to-any-depth (including a 3-level chain).

**Known gap**: `staff-wireframes.html`'s VIEW-S-003 frame was not redrawn as a tree-view mockup for this follow-up (only the #31 phase-1 flat-table refinement is reflected there); the implementation above is the current source of truth for the interaction pattern until a diagramming pass catches the wireframe up (tracked by issue #48, continuous spec alignment).

## Display-name-chain proposal (issue #50 phase 1)

Issue #50 replaces #31's interim, stored product `displayName` and client-composed catalogue breadcrumb with the computed contract in [FR-010–FR-014](../../functional-requirements.md#display-name-and-chain-rules-fr-010fr-014). VIEW-S-003 renders the backend-provided ordered `displayNameChain` with ` · ` as both each result/tree-row title and the selected detail view's primary heading. Search continues to match organisation, role, product-ancestor, and selected-product text in that chain; filtering still surfaces a matching descendant as a top-level result, and unfiltered expansion retains the recursive tree behavior.

The Phase 1 audit found 182 products in `backend/scripts/seed/sources/products.json`: 130 carried `displayName`, none carried `name`, and none carried both. The corrected seed source renames those 130 values to `name` without loss. During Phase 2 review, the stakeholder confirmed that prototype databases are disposable, so adoption uses the existing reset-and-reseed workflow rather than an in-place migration script. The explicit Person/Partner/Product scope boundary remains accepted, and Phase 2 still has its separate review checkpoint.

## MVP scope note (product create/edit consistency pass, 2026-08-21)

Stakeholder direction: VIEW-S-003's separate "create product draft"/"edit draft"/"activate"/"retire" wording and its fragmented linking flows (a raw supplier-ID box only in the detail view, parent-linking only reachable by re-using the create form under "Components") read as inconsistent against VIEW-S-002/VIEW-S-004's combined-creation, inline-edit pattern. The create form now creates a product plus its one type-determined link in a single guided step, mirroring `PersonCreatePanel`/`OrganisationCreatePanel`: which kind of link a type takes is not a user choice but is determined by the selected type — catalogue-root types (flight, room-type, mobility/*, water-transport/*, experience/*, protection/travel) may optionally link a supplier OrgaRole by ID; the two structural-child types (`product/airline/flight/seat`, `product/accommodation/room-type/room`) require a parent product ID of one specific matching type, now validated server-side (existing/wrong-type checks in `create_product`) as well as client-side. This also closes a real gap: seats and rooms were previously excluded from the type selector entirely and could not be created through the UI at all, despite their property contracts (`SeatProperties`, `RoomProperties`) already existing. Existence/type checks happen at submit time, consistent with how the pre-existing detail-view supplier box already worked — not a proactive as-you-type lookup. Labels were renamed for consistency: "Create product draft" → "Create product", "Edit draft" → "Edit product", "Update draft" → "Save changes". The detail-view "Set supplier" box is unchanged — this pass only extended the top-level create form.

Follow-up refinement (same date, stakeholder review of the above): the Activate/Retire buttons were removed entirely; lifecycle status is now one of the three `LIFECYCLE_STATUS_OPTIONS` values (Draft/Active/Retired), editable as a single field alongside the type-specific fields in both the create form (previously not selectable at all — every product was created as `product/draft` with no way to choose otherwise) and the edit form (previously two separate always-visible buttons next to the edit toggle). "Add component" was also corrected: it previously always offered every catalogue-root type, including for parents that structurally require one specific child type — a room-type's only valid component (`product/accommodation/room-type/room`) was in fact missing from that list entirely, since structural-child types were excluded from every type selector before this pass. It now offers only the one type-compatible option when the parent type has a specific required structural child (flight → seat, room-type → room); every other parent type keeps the existing unrestricted package-bundling list. Every type `Select` across the view (create form, add-component, and the list's type filter) is now a flat, alphabetically-ordered list; the list's type filter no longer groups options by family (the grouping helper was removed as no longer used anywhere).

## Purpose and authority

These wireframes consume the stable views, traversal, classifications, and open questions in [navigation-maps.md](../navigation-maps/navigation-maps.md). They are reviewable interaction hypotheses, not accepted production design or new business requirements. The textual use cases remain authoritative for behaviour.

- [Customer wireframes](customer-wireframes.html) cover the complete proposed customer journey and demonstrate responsive reflow at PC, tablet, and mobile widths.
- [Staff wireframes](staff-wireframes.html) cover the resource-oriented staff portal, representative list/detail/edit modes, and contextual assistance.
- [Shared stylesheet](wireframes.css) is intentionally monochrome and low fidelity. It supplies layout and focus visibility, not branding.

## Shared interaction principles

| ID | Principle | Evidence or classification |
|---|---|---|
| WF-001 | Every frame exposes its stable `VIEW-*` identifier and a descriptive page heading. | Navigation-map traceability; proposed presentation |
| WF-002 | Navigation actions name their destination view ID in the prototype annotation. | Review aid; destination IDs are removed from production copy later |
| WF-003 | Confirmed context remains visible when sign-in or registration interrupts an offer request. | FR-007; UC-008 |
| WF-004 | Loading, empty, unavailable, validation, pending/error, and success examples do not present unconfirmed success. | Use-case extensions and minimal guarantees |
| WF-005 | Customer layouts reflow without removing capabilities at PC, tablet, or mobile widths. | FR-004 |
| WF-006 | Staff resource areas use consistent list/detail/edit structure, visible selection, filter state, paging, and keyboard-operable controls. | Issue #11 wireframe scope; proposed UX pattern |
| WF-007 | Business-significant staff actions retain domain labels rather than generic `Save` or CRUD terminology alone. | UC-004, UC-006, UC-011, UC-015, UC-017, UC-018 |
| WF-008 | Errors are associated with their fields or action summaries and focus can move to the summary after submission. | Proposed accessibility hypothesis; NAV-Q-005 remains open |
| WF-009 | Customer advice is available only through the visibly identified Automated Travel Advisor; the structured search is a search control, not an advice alternative. | FR-008; UC-001 |
| WF-010 | Agent messages expose proposed, awaiting-input/authorization, in-progress, confirmed, failed, and uncertain operation states alongside the affected journey context. | FR-009; UC-001 |
| WF-011 | The Automated Travel Advisor remains in a persistent right-hand rail beside customer journey views on PC and tablet; on mobile it collapses to a persistent launcher for a context-preserving chat drawer. | Stakeholder direction, 2026-08-14; proposed responsive presentation |
| WF-012 | Both profiles share one page-shell chrome (skip link; header with logo placeholder, page identity, and user-icon menu; `main` landmark). Staff additionally provides a persistent left sidebar (`nav`, no footer); customer additionally provides a footer (imprint/legal placeholders, no sidebar) and retains the advisor rail per WF-011. Breadcrumbs (`nav aria-label="Breadcrumb"`) appear on deeper views in both profiles, not on portal/area entry points. | Issue #27 phase 1; DS-CMP-001; proposed presentation |

## Coverage

### Customer

| Views | Wireframe coverage |
|---|---|
| VIEW-C-001, C-009, C-010, C-002 | Structured search, agentic AI-chat advice, visible tool/action state, results, empty/unavailable state, product detail, itinerary/composition, price indication, and revision |
| VIEW-C-011, C-012, C-003 | Sign-in, registration, validation, preserved composition, Sales Offer, conditions, and acceptance |
| VIEW-C-004, C-005, C-006, C-007, C-008 | Order outcome/summary, payment pending/error/success, document release, assistance/handover, and customer account |

The customer prototype includes a viewport selector for review and uses real CSS breakpoints: PC at 1100px or wider, tablet between 700px and 1099px, and mobile below 700px. These are review exemplars, not accepted device requirements beyond FR-004.

### Staff

| View | Representative coverage |
|---|---|
| VIEW-S-001 | Portal entry and five managed-data areas |
| VIEW-S-002 | Person/PersonRole list with role-type/role-status filters, selection, Person detail with per-role sub-panels, separate Person/role edit, role deactivation, combined person+initial-role creation, validation, loading, empty, error, paging, keyboard note |
| VIEW-S-003 | Tree-view product catalogue (breadcrumb-titled rows, lazy per-row expand to any depth, alphabetical DB-derived type filter, unified search) with lifecycle filter, selection, product detail with recursive component tree, inline edit including a lifecycle-status field (draft/active/retired, WF-Q-014, no separate buttons), combined product-plus-type-determined-link creation (optional supplier ID for catalogue-root types, required matching-typed parent ID for structural children, selectable lifecycle status), type-compatible "add component" list, validation, loading, empty, error, keyboard note — implementation is ahead of the low-fidelity frame here (see the tree-view follow-up and product create/edit consistency notes above) |
| VIEW-S-004 | Organisation/OrgaRole list with role-type/relationship-status filters, selection, Organisation detail with per-role sub-panels, separate Organisation/role edit, role deactivation, combined organisation+initial-role creation, validation, loading, empty, error, paging, keyboard note |
| VIEW-S-005 | Order list/detail and preparation, allocation, payment, document, and assistance actions |
| VIEW-S-006 | Contextual advice and handover workspace |
| VIEW-S-007 | Inventory list/detail, availability, allocation, and procurement actions |

## Shell refinement (issue #27 phase 1)

Both prototypes now apply a consistent page-shell chrome (WF-012) instead of ad hoc per-frame headers, refining DS-CMP-001 for issue #27. This is a wireframe-review refinement, not new business behaviour; the textual use cases and navigation maps remain authoritative.

- **Evidenced by prior artifacts**: the shared header/nav/main landmarks, skip link, and the persistent customer advisor rail (WF-011) were already accepted presentation; this refinement only reorganizes them into named shell regions.
- **Proposals pending stakeholder review**:
  - Staff sidebar destinations (Home, Customers and travellers, Touristic product catalogue, Suppliers and partners, Inventory, Orders) replace the former top jump-nav; the former jump-nav is retained only in the customer prototype, explicitly labelled a review aid (`.review-jump`), separate from shell chrome.
  - Breadcrumbs are shown on deeper views and omitted on the customer entry point (VIEW-C-001, C-009), per the issue's "decide per view" guidance. For staff, VIEW-S-001 also carries a one-item breadcrumb ("Staff Portal Home") rather than omitting it, per stakeholder decision on issue #28 phase 2: staff breadcrumbs are included on every view, on the hypothesis that they help deep drill-downs (e.g., order → advice/handover) even though the sidebar already conveys the current area; the customer entry-point omission remains open for stakeholder confirmation, not a settled decision.
  - The header user-icon menu is a static placeholder in both prototypes. The customer variant reads "Guest · Sign in" and would show the signed-in customer's name after VIEW-C-011/C-012 authentication. The staff variant reads "User" because no staff login exists yet (WF-Q-004); neither implies a real session.
  - The customer footer's imprint/legal links are placeholders with no destination and no real legal text, pending stakeholder/legal review (see WF-Q-002 and the open question below); the staff shell has no footer, per stakeholder direction recorded in issue #27.
  - The header logo is a monochrome text placeholder (`CCT`), consistent with the wireframes' no-branding purpose; the actual logo asset from issue #24 is integrated in a later, separate change.
- **Responsive behaviour**: the staff sidebar remains a fixed-width left column at PC width, becomes a horizontal wrapping bar above the main content at tablet width (below 1100px, reusing the existing breakpoint), and stays a horizontal bar at mobile width — no additional staff mobile requirement is inferred, consistent with the existing accessibility/responsive review note. The customer header and footer reflow to stacked, full-width content at mobile width (below 700px); the advisor rail's existing collapse-to-launcher behaviour (WF-011) is unchanged.
- **DS-CMP-001**: its contract already covered "header/nav/main/aside landmarks" and "page identity and current location" in principle; this refinement adds the footer landmark for the customer profile and breadcrumbs as the concrete expression of "current location," so the design system's contract description was updated (IDs unchanged) to name both explicitly.

## Navigation alignment and PoC thin slice

The annotated thin slice is `VIEW-C-001 → C-009 → C-010 → C-002 → C-011 or C-012 → C-003 → C-004 → S-005`. Customer payment and documents remain visible follow-on hypotheses. Staff review of the customer-created order begins in VIEW-S-005 and links to customer/traveler and inventory context without inventing module boundaries.

## Accessibility and responsive review

- Native headings, landmarks, links, buttons, labels, tables, fieldsets, and status regions provide a semantic review baseline.
- A visible skip link and focus indicator are included.
- Colour is not the only carrier of selected, warning, error, or success state.
- Mobile reflow changes columns and navigation presentation but retains every required action.
- Dense staff tables provide captions and remain horizontally scrollable at narrow widths; no mobile staff requirement is inferred.

## Hypotheses and unresolved questions

| ID | Question or hypothesis | Owner / resolution |
|---|---|---|
| WF-Q-001 | Structured search and the Automated Travel Advisor share VIEW-C-001; usability review must confirm that search is not mistaken for a second advice mechanism. | UX/Stakeholder review |
| WF-Q-002 | Sales Offer content, mandatory conditions, and exact acceptance confirmation need legal/business evidence. | Requirements/Legal stakeholder |
| WF-Q-003 | Registration fields, authentication factor, recovery, and session behaviour remain undefined. | NAV-Q-006; Security/Privacy |
| WF-Q-004 | Staff permissions may hide or disable resource actions; current frames show capability, not authorization. | Requirements/Security |
| WF-Q-005 | Data-grid component feasibility, virtualization, and detailed keyboard behaviour remain PoC questions. | Implementation/Test |
| WF-Q-006 | Supplier-facing interaction required by FR-003 remains outside these customer/staff wireframes. | NAV-Q-004; Requirements |
| WF-Q-007 | Which actions require preview, explicit confirmation, re-authentication, or mandatory human handover is unresolved; the frame demonstrates states without deciding the policy. | NAV-Q-007; Requirements/Security/Privacy/Business |
| WF-Q-008 | Exact customer footer imprint/legal-notice wording for the fictitious CCT: placeholder text or intentionally empty pending stakeholder confirmation. | Issue #27; Requirements/Legal stakeholder |
| WF-Q-009 | Whether staff breadcrumbs are needed given the sidebar already conveys location, or whether they add value for deep drill-downs (e.g., order → advice/handover); this refinement includes them as a hypothesis, not a decision. | Issue #27; Requirements/UX |
| WF-Q-010 | *Resolved 2026-08-19.* VIEW-S-002's "deactivate a role" action assumed a `roleStatusCode`-style property on PersonRole; issue #29 phase 2 added it (entity-model terminology TERM-003; `backend/src/cct/resource_management/person_management/models.py`), defaulting to `role/active` and transitioned via the existing `PUT` role endpoint, matching `orderStatusCode`'s precedent. The hard `DELETE` endpoint remains available but the staff frontend's "Deactivate"/"Reactivate" action always uses the status-changing `PUT`. | Issue #29 phase 2; Architecture/Requirements |
| WF-Q-011 | *Resolved 2026-08-20.* VIEW-S-004's "deactivate a role" action assumed a `roleStatusCode`-equivalent property on `OrgaRole`; issue #30 phase 2 added it (`OrgaRolePropertiesBase`, `backend/src/cct/resource_management/partner_management/models.py`), following the WF-Q-010/`roleStatusCode` precedent exactly, and extended `terminology.md`'s `roleStatusCode` entry to cover Partner Management. | Issue #30 phase 2; Architecture/Requirements |
| WF-Q-012 | TERM-002 defines only `partner/supplier/*` role-type identifiers, not a generic `partner/partner` (non-supplier partner) type. VIEW-S-004's role-type filter therefore lists only supplier subtypes; whether a non-supplier partner role is actually needed is unconfirmed and out of scope for issue #30 to invent. | Issue #30; Requirements |
| WF-Q-013 | No `TouristicProductItem` type carries a generic name/title property — only type-specific fields exist (`flightNumber`, `roomTypeCode`), and `product/mobility/*`, `product/water/*`, `product/experience/*`, and `product/protection/travel` have no descriptive properties at all beyond an optional image. Stakeholder decision (issue #31 phase 1): add an optional `displayName` to the shared `ImageProperties` base so every catalogue-root item can carry a human-readable label; issue #31 phase 2 must implement it and extend `terminology.md`. | Issue #31; Architecture/Requirements |
| WF-Q-014 | UC-015's "activate a version" implies version history, but no version-number or version-history mechanism exists for `TouristicProductItem`. Stakeholder decision (issue #31 phase 1): MVP scope is lifecycle status only (`draft`/`active`/`retired`, following the `roleStatusCode` pattern) — activating/retiring transitions the same mutable record; the wireframe's low-fidelity "v3" label is dropped. True multi-version history remains deferred, not built. | Issue #31; Requirements |

## AI-assisted validation record

AI generated the initial HTML/CSS frames from the navigation baseline and use cases. Stakeholder review replaced the initial advice text area with an exclusively AI-chat-based, agentic interaction and required the chatbot to both answer and act. Subsequent critical review added visible operation states and retained action authority and confirmation policy as unresolved rather than granting unrestricted capability. Review also rejected final branding, realistic personal data, framework-specific components, invented permissions, a separate error page for every failure, and generic CRUD labels for business actions. Synthetic records are used throughout. The frames require stakeholder, Test, accessibility, privacy, security, and implementation review before acceptance.

AI refined the frames again on 2026-08-19 for issue #27 phase 1, introducing a shared shell chrome, profile-specific sidebar/footer, and breadcrumbs (WF-012) without changing any accepted view boundary, transition, or business behaviour. This refinement is likewise unreviewed by stakeholders and is the input to the issue's phase 1 human review checkpoint, not an accepted shell.

AI refined VIEW-S-002 again on 2026-08-19 for issue #29 phase 1, replacing the flattened "customer" record with separate Person and PersonRole regions per UC-014 and the entity model, adding role-type/role-status filters, per-role edit/deactivate actions, and a combined person-plus-initial-role creation example, while deferring VIEW-S-006 to a disabled placeholder and leaving UC-001/UC-002's conversational scope to later advisor issues. This surfaced a requirements gap (WF-Q-010: no role-status property exists yet) rather than resolving it silently. The refinement is unreviewed by stakeholders and is the input to the issue's phase 1 human review checkpoint, not an accepted wireframe.

AI refined VIEW-S-004 on 2026-08-20 for issue #30 phase 1, mirroring VIEW-S-002's split: separate Organisation and OrgaRole regions per the entity model, role-type/relationship-status filters, per-role edit/deactivate actions, and a combined organisation-plus-initial-role creation example, while deferring the UC-006 procurement negotiation itself to #32. This surfaced two requirements gaps rather than resolving them silently: WF-Q-011 (no `roleStatusCode`-equivalent exists on `OrgaRole` yet, following the WF-Q-010 precedent) and WF-Q-012 (TERM-002 has no generic non-supplier `partner/partner` type, so the role-type filter offers only supplier subtypes). The refinement is unreviewed by stakeholders and is the input to the issue's phase 1 human review checkpoint, not an accepted wireframe.

AI refined VIEW-S-003 on 2026-08-20 for issue #31 phase 1, exposing `TouristicProductItem`'s recursive component structure and switching to a type-driven create/edit form. This issue's own Phase 1 text flagged two open questions rather than assuming answers, so both were put to explicit stakeholder review before drafting: (1) UC-004 Package Travel bundling reuses the existing recursive `CONTAINS` structure rather than a dedicated package type; (2) UC-015's "activate a version" is lifecycle-status-only (WF-Q-014) with no version-number/history mechanism, dropping the low-fidelity "v3" label. Drafting the frame surfaced a third, deeper gap not anticipated by the issue text — no product type carries a generic display name — which also went to stakeholder review before resolving as WF-Q-013 (add a shared `displayName` property). The refinement is unreviewed beyond that review and is the input to the issue's phase 1 human review checkpoint, not an accepted wireframe.
