# Cross-cutting Functional Requirements

- Status: draft
- Owner: Requirements
- Last reviewed: 2026-08-21

This catalog is authoritative only for required behavior that applies across multiple use cases. Actor goals, interaction steps, alternatives, and guarantees remain in the [use-case specifications](use-cases/use-cases.md). Do not restate them here.

Each requirement has one stable `FR-` identifier, one atomic and testable normative statement, direct evidence, explicit applicability, and linked acceptance evidence. Use the normative terms defined in [Requirements Language](../governance/standards/requirements-language.md).

| ID | Requirement | Applies to | Source/evidence | Acceptance criterion | Priority | Status |
|---|---|---|---|---|---|---|
| FR-001 | Customer, staff, and supplier interactions SHALL present user-facing content in British English. | [Interaction modules](../architecture/software-architecture/software-architecture.md) | Stakeholder direction, 2026-08-01; scope clarification, 2026-08-03 | Representative content in each interaction context conforms to British English spelling and usage. | not assigned | accepted |
| FR-002 | Customer, staff, and supplier interactions SHALL permit an additional interaction language to be introduced without changing domain rules or use-case definitions. | [Interaction modules](../architecture/software-architecture/software-architecture.md) | Stakeholder direction, 2026-08-01; scope clarification, 2026-08-03 | Representative interactions can be presented in a synthetic second language while producing the same domain outcome as their British English versions. | not assigned | accepted |
| FR-003 | Customer, staff, and supplier interactions SHALL be provided through web user interfaces. | [Interaction modules](../architecture/software-architecture/software-architecture.md) | Stakeholder direction, 2026-08-01 | Every supported customer, staff, and supplier interaction can be completed through a web browser. | not assigned | accepted |
| FR-004 | The Customer Interaction web user interface SHALL adapt its presentation and controls for PC, tablet, and mobile form factors without removing required customer capabilities. | [Customer Interaction module](../architecture/software-architecture/software-architecture.md) | Stakeholder direction, 2026-08-01 | Every supported customer interaction can be completed at representative PC, tablet, and mobile viewport sizes without loss of content or required actions. | not assigned | accepted |
| FR-005 | Customer Interaction SHALL permit a Customer to seek advice, search, review travel information, compose Individual Travel, and obtain plausibility or availability results without registering or signing in. | [UC-001](use-cases/uc-001-seek-travel-advice.md), [UC-003](use-cases/uc-003-compose-individual-travel.md), [UC-005](use-cases/uc-005-obtain-plausible-itinerary.md), [UC-009](use-cases/uc-009-obtain-availability-confirmation.md) | Stakeholder direction, 2026-08-14 | A Customer can complete each listed outcome in a new browser context without a Customer account, while any unconfirmed context remains distinguishable from a customer record. | not assigned | accepted |
| FR-006 | Customer Interaction SHALL require a successfully authenticated Customer account before presenting a Sales Offer or customer-specific customer-record, order, payment, or Travel Document information. | [UC-008](use-cases/uc-008-receive-sales-offer.md), [UC-010](use-cases/uc-010-accept-sales-offer.md), [UC-012](use-cases/uc-012-receive-travel-documents.md), [UC-014](use-cases/uc-014-maintain-customer-record.md), [UC-016](use-cases/uc-016-place-travel-order.md), [UC-018](use-cases/uc-018-pay-for-travel.md) | Stakeholder direction, 2026-08-14 | Anonymous access to each protected outcome is withheld; successful registration or sign-in permits the authorized Customer to continue to the intended outcome. | not assigned | accepted |
| FR-007 | When registration or sign-in interrupts an in-progress customer journey, Customer Interaction SHALL preserve the last confirmed journey context and return the Customer to the intended destination after successful authentication. | [UC-008](use-cases/uc-008-receive-sales-offer.md), [UC-014](use-cases/uc-014-maintain-customer-record.md) | Stakeholder direction, 2026-08-14 | After successful registration or sign-in from a request for a Sales Offer, the same confirmed composition is used to present the offer without requiring the Customer to repeat confirmed inputs. | not assigned | accepted |
| FR-008 | Customer Interaction SHALL provide customer advice exclusively through an Automated Travel Advisor presented as an AI chatbot that can answer questions and invoke supported customer-journey capabilities through authorized system operations. | [UC-001](use-cases/uc-001-seek-travel-advice.md), [UC-002](use-cases/uc-002-obtain-ongoing-travel-assistance.md), [UC-003](use-cases/uc-003-compose-individual-travel.md) | Stakeholder direction, 2026-08-14 | In representative advice conversations, the chatbot can answer a travel question and can perform at least one supported action, such as applying search criteria or revising a composition; no separate automated advice form or non-conversational advice channel is presented. | not assigned | accepted |
| FR-009 | When the Automated Travel Advisor invokes a capability, Customer Interaction SHALL distinguish a proposed action, an action awaiting customer input or authorization, an action in progress, a confirmed result, and a failed or uncertain result. | [UC-001](use-cases/uc-001-seek-travel-advice.md), [UC-002](use-cases/uc-002-obtain-ongoing-travel-assistance.md), [UC-003](use-cases/uc-003-compose-individual-travel.md) | Stakeholder direction, 2026-08-14; existing use-case minimal guarantees | A test conversation exercises each state without an unconfirmed or failed action being represented as completed, and preserves the last confirmed journey context. | not assigned | accepted |
| FR-010 | Person Management, Partner Management, and Touristic Product Management SHALL expose a computed `displayName` for each entity covered by the [display-name rules](#display-name-and-chain-rules-fr-010fr-014). | `Person`, `PersonRole`, `Organisation`, `OrgaRole`, and every current `TouristicProductItem` type | Stakeholder direction, issue #50, 2026-08-21 | Each rule-table example returns the stated value, including every coded room and role value. | not assigned | accepted |
| FR-011 | Resource write operations SHALL reject `displayName` and `displayNameChain`, and persistence SHALL store neither derived value. | Resource modules covered by FR-010 | Stakeholder direction, issue #50, 2026-08-21 | Create/update requests containing either derived field fail validation; a reset database seeded from the corrected source contains neither derived key. | not assigned | accepted |
| FR-012 | Resource read operations SHALL expose `displayNameChain` as the canonical root-to-entity sequence specified below and SHALL derive it from current source properties and relationships on every read. | Resource modules covered by FR-010 | Stakeholder direction, issue #50, 2026-08-21 | Changing a source name or ancestor changes the next read's chain without a derived-property write; the flight-seat example yields the stated ordered sequence. | not assigned | accepted |
| FR-013 | When a display name or canonical chain cannot be computed because required source data is absent or the ownership graph is cyclic or ambiguous, the read operation SHALL report an explicit invalid-graph error and SHALL NOT substitute an entity identifier. | Resource modules covered by FR-010 | Stakeholder direction, issue #50, 2026-08-21; no-silent-fallback constraint | Missing flight supplier/designator, missing role owner, multiple product parents, and a product cycle each produce the specified error outcome. | not assigned | accepted |
| FR-014 | VIEW-S-003 SHALL use the same complete display-name chain for each catalogue result title and its detail-view primary heading, and catalogue search SHALL match every textual chain component. | [UC-015](use-cases/uc-015-maintain-travel-products-and-services.md), VIEW-S-003 | Stakeholder direction, issue #50, 2026-08-21; #31 tree-view review | A nested product reached through unfiltered expansion or a filtered match has an identical chain title in list and detail, and is found through organisation, role, ancestor, or own display text. | not assigned | accepted |
| FR-015 | Staff create operations SHALL return an immutable server-generated identifier in the approved prefixed format; create requests SHALL not require an identifier. | Staff resource create operations | Issue #57; DR-0021, 2026-08-31 | Each generated root ID has its registered prefix and six decimal digits; seeded identifiers remain readable and valid. | high | proposed |
| FR-016 | An order header identifier SHALL be the sole order identifier, and order positions SHALL use a child suffix without consuming the order sequence. | Order Management | Issue #57; DR-0021, 2026-08-31 | No order API, model, seed, or UI contract contains a separate order-number field; generated positions follow `<order-id>-Pnn`. | high | proposed |

Add an entry only when the same behavior genuinely governs at least two use cases. Otherwise, specify the behavior once in its owning use case.

## Display-name and chain rules (FR-010–FR-014)

`displayName` is a non-unique presentation label, never an identifier. Composition trims source strings and inserts exactly one separator; it does not otherwise rewrite a person's or organisation's spelling. Type-derived labels use British English. The en dash (`–`) joins route endpoints and the UI joins `displayNameChain` components with a middle dot surrounded by spaces (` · `).

| Entity/type | `displayName` rule |
|---|---|
| `Person` | `givenName + " " + familyName` |
| `person/customer` | `Customer` |
| `person/traveller` | `Traveller` |
| `Organisation` | `name` |
| `organisation/airline` | `Airline` |
| `organisation/accommodation` | `Accommodation` |
| `organisation/mobility` | `Mobility` |
| `organisation/water-transport` | `Water transport` |
| `organisation/experience` | `Experience` |
| `organisation/protection` | `Protection` |
| `product/airline/flight` | Supplying role's `airlineDesignator` immediately followed by `flightNumber`, then one space and `departureLocationCode`–`arrivalLocationCode`, for example `CA501 BER–LIM` |
| `product/airline/flight/seat` | `seatNumber` |
| `product/accommodation/room-type` | `room/single` → `Single room`; `room/double` → `Double room`; `room/twin` → `Twin room`; `room/triple` → `Triple room`; `room/family` → `Family room`; `room/adjoining` → `Adjoining rooms`; `room/suite` → `Suite`; `room/cabin` → `Cabin` |
| `product/accommodation/room-type/room` | `roomNumber` |
| Every other current `product/*` type | Required stored `name` |

The product `name` property is optional for flight, room-type, seat, and room types because their display labels come from specific properties; it is required for every other current product type. The corrected seed source preserves every former product `displayName` value as `name`, including values that become non-authoritative for a type-specific computation. Existing prototype databases are reset and reseeded; no in-place migration is supported.

Canonical chains are:

- `Person`: `[person display name]`; `PersonRole`: `[person display name, role display name]`.
- `Organisation`: `[organisation display name]`; `OrgaRole`: `[organisation display name, role display name]`.
- `TouristicProductItem`: when the catalogue root has a supplier, `[organisation display name, OrgaRole display name, root product display name, ..., selected product display name]`; without a supplier, the sequence begins with the root product. A nested product inherits only its catalogue root's supplier context.

Each role has exactly one owning person or organisation. Each nested product has exactly one parent and the `CONTAINS` ancestry is acyclic. More than one owner/parent/supplier or a cycle is an invalid graph under FR-013. A supplier is otherwise optional, but every flight in a multi-leg product uses its own supplying `organisation/airline` role and `airlineDesignator`; a flight without one cannot satisfy its display-name rule and is invalid for a display-bearing read. Only the catalogue root's organisation and role prefix the chain, while each nested flight's own supplier determines that flight component's airline code.

The shared API representation is proposed as two read-only response fields: `displayName: string` and `displayNameChain: string[]`. An ordered array keeps the chain's semantics independent of visual punctuation; VIEW-S-003 joins the returned components with ` · `. Both collection and detail responses use the same backend computation. Requests retain strict `extra="forbid"` validation, so neither derived field is writable.

### Acceptance examples

- `Person(givenName="Ada", familyName="Lovelace")` returns `displayName="Ada Lovelace"` and `displayNameChain=["Ada Lovelace"]` without persisting either derived key.
- A seat `12A` beneath flight 501 supplied by Condorleaf Air's `organisation/airline` role returns `displayNameChain=["Condorleaf Air", "Airline", "CA501 BER–LIM", "12A"]`, rendered as `Condorleaf Air · Airline · CA501 BER–LIM · 12A`.
- A `room/double` product and child room `204` return `Double room` and `204` as their respective display names and preserve root-first ordering in both chains.
- Renaming a named transfer changes its own and every descendant's next computed chain without persisting a derived field.
- Two distinct entities may have the same display name; stable entity identifiers continue to distinguish them in links and operations.

### Accepted scope boundary

Issue #50 says “every entity object,” while the stakeholder-supplied rule set covers parties, roles, and products only. The 2026-08-21 Phase 1 checkpoint accepted FR-010's stated applicability: `StockItem` and `OrderItem` are outside this change rather than receiving speculative labels; in particular, `order/position` has no descriptive property from which to compute one.
