# Pay for Travel

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-018](use-cases.md)
- Owning bounded context: Order Management
- Primary actor: [Customer](../actors.md)
- Supporting actors: [Travel Advisor](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-07-31

## Goal and scope

Enable the Customer to make a payment or Deposit and learn what activities may proceed.

## Preconditions

an order with an amount due and an authorized Customer.

## Trigger

The Customer chooses to make a payment.

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

a confirmed payment applied exactly once with visible effect.

## Minimal guarantee

failed or uncertain payment is not confirmed and duplicates are detectable.

## Policies and information

Travel Order, amount, currency, purpose, attempt reference, status, allocation, receipt.

Detailed policies and stated gaps require stakeholder confirmation.

## Use-case-specific quality and compliance considerations

protect sensitive data, ensure auditability, and communicate pending outcomes.

## Acceptance example

```gherkin
Scenario: Pay for Travel
  Given the Customer authorizes a deposit for an amount due
  When the Customer the payment is confirmed
  Then the Customer it is applied once, the balance updates, and a receipt is provided
```
