# DR-0022: Add an active execution state to Travel Orders

- Status: accepted
- Date: 2026-09-08
- Deciders: Product stakeholder; Requirements; Architecture
- Supersedes: none

## Context

The accepted order status set contains `order/reserved`, `order/paid`,
`order/fulfilled`, and `order/cancelled`. `order/fulfilled` means that ordered
travel has been delivered, while UC-013 and UC-002 require the system to
support assistance and coordination during travel. The status set therefore
cannot distinguish travel in progress from travel completed.

## Decision drivers

- make the operational state of an ongoing journey visible;
- preserve the existing namespaced status convention and API shape;
- keep the change reversible while transition guards remain future work.

## Considered options

- Add `order/active` to the existing status value set. Small, compatible with
  the current CRUD contract, and sufficient for the current Staff slice.
- Introduce separate commercial/payment and execution status properties.
  More expressive for multi-service orders, but broader than the current
  scope and requires additional lifecycle rules.

## Decision

Add `order/active`, meaning that at least one ordered travel service is
underway and the order remains operationally active. The current lifecycle
vocabulary is `reserved`, `paid`, `active`, `fulfilled`, and `cancelled`.
This change does not introduce transition guards or redefine payment,
settlement, refund, or partial-fulfilment behavior.

## Consequences

### Positive

- Staff and API consumers can distinguish in-travel orders from completed
  orders.
- Active-travel use cases have a corresponding order-level state.

### Negative and risks

- A single order-level state is not sufficient to represent different
  execution states of individual services in a multi-service itinerary.
- Existing transition behavior remains unconstrained until future requirements
  define valid transitions and exceptions.

## Validation and revisit triggers

Validate that the generated API contract, Staff status filter/editor, seeded
synthetic data, and focused API/UI tests all accept and display
`order/active`. Revisit when service-level execution, partial fulfilment, or
formal transition rules are specified.

## Links

- [TERM-005 orderStatusCode](../../architecture/entity-model/terminology.md)
- [UC-002 Obtain Ongoing Travel Assistance](../../requirements/use-cases/uc-002-obtain-ongoing-travel-assistance.md)
- [UC-013 Coordinate Active Travel](../../requirements/use-cases/uc-013-coordinate-active-travel.md)
- [DR-0013 Shared resource CRUD API and OpenAPI contract](0013-shared-resource-crud-api-and-openapi-contract.md)
