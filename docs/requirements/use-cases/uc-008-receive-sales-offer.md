# Receive a Sales Offer

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-008](use-cases.md)
- Owning domain: Sales
- Primary actor: [Customer](../actors.md)
- Supporting actors: [Travel Advisor](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-08-14

## Goal and scope

Enable the Customer to receive an understandable, orderable composition with price, validity, and conditions.

## Preconditions

a sufficiently specified and plausible composition. The Customer may begin anonymously, but an authenticated Customer account is required before the Sales Offer is presented.

## Trigger

The Customer requests a Sales Offer.

## Main success scenario

1. The Customer initiates the use case and identifies its subject.
2. The system retrieves the relevant confirmed context and checks authorization, requiring the Customer to register or sign in if no authenticated Customer account is present.
3. The system obtains and validates the information needed for the requested outcome.
4. The system performs the responsibilities owned by Sales and coordinates required modules.
5. The Customer reviews or confirms the resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-3. Required context, authority, or information is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 2. The Customer has no authenticated Customer account | Preserve the confirmed composition, offer registration or sign-in, and resume this use case after successful authentication. Cancellation returns to the confirmed composition without presenting a Sales Offer. |
| 2. Registration or sign-in fails | Do not present a Sales Offer; explain the recoverable failure without disclosing whether an unrelated account exists and permit retry or cancellation. |
| 4. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 5. The primary actor rejects or changes the result | Preserve the confirmed baseline and return the affected information for revision. |

## Success guarantee

an authenticated Customer receives a versioned offer stating whether and until when it can be accepted.

## Minimal guarantee

an incomplete proposal is not represented as orderable, and no Sales Offer is presented without authenticated customer access.

## Policies and information

Customer, Customer account authentication state, Itinerary, services, Sale Price, validity, conditions, version, availability state.

Detailed policies and stated gaps require stakeholder confirmation.

## Applicable cross-cutting requirements

- [FR-005 through FR-007](../functional-requirements.md): anonymous exploration, authenticated protected information, and journey continuity

## Use-case-specific quality and compliance considerations

identify the accountable Tour Operator and clearly present price and conditions.

## Acceptance example

```gherkin
Scenario: Receive a Sales Offer
  Given the authenticated Customer has a plausible composition that can be priced
  When the Customer requests an offer
  Then the Customer receives a versioned offer with price, validity, conditions, and next action

Scenario: Resume an offer request after registration
  Given an anonymous Customer has a confirmed plausible composition
  When the Customer requests an offer and completes registration
  Then the same confirmed composition is used to present the Sales Offer
```
