# Place a Travel Order

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-016](use-cases.md)
- Owning subdomain: Sales
- Primary actor: [Customer](../actors.md)
- Supporting actors: [Traveler](../actors.md); [Travel Advisor](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-07-31

## Goal and scope

Enable the Customer to create the central Travel Order from an accepted Sales Offer.

## Preconditions

a valid offer explicitly accepted by an authorized Customer.

## Trigger

The Customer Sales passes the acceptance for order placement.

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

exactly one identifiable Travel Order ready for downstream work.

## Minimal guarantee

no duplicate order is created and acceptance evidence is preserved.

## Policies and information

Customer, Travelers, accepted offer, Itinerary, price, conditions, reference, status.

Detailed policies and stated gaps require stakeholder confirmation.

## Use-case-specific quality and compliance considerations

make creation atomic to the Customer, idempotent, attributable, and auditable.

## Acceptance example

```gherkin
Scenario: Place a Travel Order
  Given the Customer has accepted a valid offer with mandatory information
  When the Customer the acceptance is submitted more than once
  Then the Customer the same order is returned without duplication
```
