# Accept a Sales Offer

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-010](use-cases.md)
- Owning subdomain: Sales
- Primary actor: [Customer](../actors.md)
- Supporting actors: [Travel Advisor](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-07-31

## Goal and scope

Enable the Customer to explicitly accept one Sales Offer version as the basis for a Travel Order.

## Preconditions

an identifiable valid offer available to an authorized Customer.

## Trigger

The Customer chooses to accept the offer.

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

recorded acceptance passed once to order placement.

## Minimal guarantee

no order is based on ambiguous, expired, or unconfirmed acceptance.

## Policies and information

Customer authorization, offer version, acceptance time, conditions, order-placement reference.

Detailed policies and stated gaps require stakeholder confirmation.

## Use-case-specific quality and compliance considerations

make acceptance explicit, attributable, and resistant to duplicate submission.

## Acceptance example

```gherkin
Scenario: Accept a Sales Offer
  Given the Customer is viewing a valid offer
  When the Customer explicitly accepts that exact version
  Then the Customer acceptance is recorded and order placement starts once
```
