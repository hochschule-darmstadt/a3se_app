# Actors

- Status: accepted
- Owner: Requirements
- Last reviewed: 2026-08-14

Actors are stable human roles, external parties, or external systems that interact with the tour operator information system. Assignment identifies the domains in which an actor participates; it does not imply software-module or information ownership.

| ID | Actor | Type | Goals and responsibilities | Domains | Notes |
|---|---|---|---|---|---|
| ACT-001 | Customer | External business actor | Explore travel, refine an individual composition, register or sign in before receiving a sales offer, accept an offer, place a travel order, pay, and obtain assistance before, during, and after travel | Touristic Product Design; Sales; Customer Care | The customer may also be a traveler, but the roles can differ |
| ACT-002 | Traveler | External business actor | Provide traveler-specific details, undertake the ordered travel, receive relevant documents and assistance, and communicate travel-related needs | Customer Care | A travel order may involve one or more travelers who are not the customer |
| ACT-003 | Travel Advisor | Internal human role | Receive handovers and assist customers with travel exploration, composition, ordering, exceptions, and continuity across the travel lifecycle | Touristic Product Design; Sales; Customer Care | The Automated Travel Advisor is system behaviour, not this actor; customer advice starts in that AI chatbot and may be handed to this human role |
| ACT-004 | Seasonal Planner | Internal human role | Plan seasonal offerings and the capacity needed to support them | Season Planning; Touristic Product Design | Distinct from the purchaser who negotiates and obtains capacity |
| ACT-005 | Purchaser | Internal human role | Negotiate procurement terms, obtain stock services, and maintain supplier relationships | Procurement; Season Planning | Uses demand from planning without owning seasonal planning |
| ACT-006 | Supplier | External business party or system | Provide travel services, confirm procured capacity, fulfil ordered services, and participate in settlement | Procurement; Customer Care | Examples include hotels and airlines; interaction may be human or system-to-system |

## Retired actors

| ID | Actor | Retirement reason | Status |
|---|---|---|---|
| ACT-007 | Intermediary | The actor existed only for customer-time on-demand sourcing, which is excluded by [SE-002](scope-exclusions.md). The identifier is retained and shall not be reused. | deprecated |

Stakeholders who influence the system without directly interacting with it belong in stakeholder-management or source-evidence artifacts rather than this actor catalog.
