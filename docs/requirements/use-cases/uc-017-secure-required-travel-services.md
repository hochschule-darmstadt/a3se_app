# Secure Required Travel Services

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-017](use-cases.md)
- Owning bounded context: Order Management
- Primary actor: [Customer](../actors.md)
- Supporting actors: [Travel Advisor](../actors.md); [Supplier](../actors.md); [Intermediary](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-07-31

## Goal and scope

Enable the Customer to obtain coherent reservations for every service required by a Travel Order.

## Preconditions

an order with exact services and sourcing routes.

## Trigger

The Customer requires its services to be committed or held.

## Main success scenario

1. The Customer initiates the use case and identifies its subject.
2. The system retrieves the relevant confirmed context and checks authorization.
3. The system obtains and validates the information needed for the requested outcome.
4. The system performs the responsibilities owned by Order Management and coordinates required participants.
5. The Customer reviews or confirms the resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-3. Required context, authority, or information is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 4. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 5. The primary actor rejects or changes the result | Preserve the confirmed baseline and return the affected information for revision. |

## Success guarantee

all required services consistently committed and linked.

## Minimal guarantee

attempts and partial results remain auditable and are not reported secured.

## Policies and information

Travel Order, services, sourcing routes, reservations, validity, attempts, results, releases.

Detailed policies and stated gaps require stakeholder confirmation.

## Quality and compliance considerations

tolerate uncertain external outcomes and prevent or reconcile duplicates.

## Acceptance example

```gherkin
Scenario: Secure Required Travel Services
  Given the Customer has an order with all services and sourcing routes
  When the Customer each service is successfully committed
  Then the Customer the order is marked fully secured with linked reservations
```
