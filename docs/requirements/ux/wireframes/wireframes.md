# Low-fidelity Wireframes

- Status: proposed
- Owner: Requirements
- Last reviewed: 2026-08-19

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
| VIEW-S-002 | Customer/traveler list, filters, selection, detail/edit, validation, loading, empty, error, paging, keyboard note |
| VIEW-S-003 | Catalogue list/detail, version and activation actions |
| VIEW-S-004 | Supplier list/detail and procurement link |
| VIEW-S-005 | Order list/detail and preparation, allocation, payment, document, and assistance actions |
| VIEW-S-006 | Contextual advice and handover workspace |
| VIEW-S-007 | Inventory list/detail, availability, allocation, and procurement actions |

## Shell refinement (issue #27 phase 1)

Both prototypes now apply a consistent page-shell chrome (WF-012) instead of ad hoc per-frame headers, refining DS-CMP-001 for issue #27. This is a wireframe-review refinement, not new business behaviour; the textual use cases and navigation maps remain authoritative.

- **Evidenced by prior artifacts**: the shared header/nav/main landmarks, skip link, and the persistent customer advisor rail (WF-011) were already accepted presentation; this refinement only reorganizes them into named shell regions.
- **Proposals pending stakeholder review**:
  - Staff sidebar destinations (Home, Customers and travellers, Touristic product catalogue, Suppliers and partners, Inventory, Orders) replace the former top jump-nav; the former jump-nav is retained only in the customer prototype, explicitly labelled a review aid (`.review-jump`), separate from shell chrome.
  - Breadcrumbs are shown on deeper views and omitted on entry points (customer: VIEW-C-001, C-009; staff: VIEW-S-001), per the issue's "decide per view" guidance. This also proposes an answer to the staff open question below: staff breadcrumbs are included, on the hypothesis that they help deep drill-downs (e.g., order → advice/handover) even though the sidebar already conveys the current area; this remains open for stakeholder confirmation, not a settled decision.
  - The header user-icon menu is a static placeholder in both prototypes. The customer variant reads "Guest · Sign in" and would show the signed-in customer's name after VIEW-C-011/C-012 authentication. The staff variant is explicitly labelled "Staff user (mocked)" because no staff login exists yet (WF-Q-004); neither implies a real session.
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

## AI-assisted validation record

AI generated the initial HTML/CSS frames from the navigation baseline and use cases. Stakeholder review replaced the initial advice text area with an exclusively AI-chat-based, agentic interaction and required the chatbot to both answer and act. Subsequent critical review added visible operation states and retained action authority and confirmation policy as unresolved rather than granting unrestricted capability. Review also rejected final branding, realistic personal data, framework-specific components, invented permissions, a separate error page for every failure, and generic CRUD labels for business actions. Synthetic records are used throughout. The frames require stakeholder, Test, accessibility, privacy, security, and implementation review before acceptance.

AI refined the frames again on 2026-08-19 for issue #27 phase 1, introducing a shared shell chrome, profile-specific sidebar/footer, and breadcrumbs (WF-012) without changing any accepted view boundary, transition, or business behaviour. This refinement is likewise unreviewed by stakeholders and is the input to the issue's phase 1 human review checkpoint, not an accepted shell.
