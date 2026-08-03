# Secure Required Travel Services

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-017](use-cases.md)
- Owning subdomain: Sales
- Primary actor: [Customer](../actors.md)
- Supporting actors: [Travel Advisor](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-08-03

## Goal and scope

Enable the Customer to obtain coherent allocations from pre-procured capacity for every service required by a Travel Order.

## Preconditions

an order with exact services backed by sufficient pre-procured capacity.

## Trigger

The Customer requires stock capacity to be allocated to its services.

## Main success scenario

1. The Customer initiates the use case and identifies its subject.
2. The system retrieves the relevant confirmed context and checks authorization.
3. The system obtains and validates the information needed for the requested outcome.
4. The system performs the responsibilities owned by Sales and coordinates required modules.
5. The Customer reviews or confirms the resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-3. Required context, authority, or information is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 4. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 5. The primary actor rejects or changes the result | Preserve the confirmed baseline and return the affected information for revision. |

## Success guarantee

all required services consistently allocated from pre-procured capacity and linked.

## Minimal guarantee

allocation attempts and partial results remain auditable and are not reported secured.

## Policies and information

Travel Order, services, stock capacity, reservations, validity, allocation attempts, results, releases.

Detailed policies and stated gaps require stakeholder confirmation.

## Use-case-specific quality and compliance considerations

prevent over-allocation and prevent or reconcile duplicate allocation attempts.

## Acceptance example

```gherkin
Scenario: Secure Required Travel Services
  Given the Customer has an order whose services have sufficient pre-procured capacity
  When capacity is allocated to each service
  Then the Customer the order is marked fully secured with linked reservations
```
