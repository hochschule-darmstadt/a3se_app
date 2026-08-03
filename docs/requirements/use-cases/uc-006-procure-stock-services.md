# Procure Stock Services

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-006](use-cases.md)
- Owning subdomain: Procurement
- Primary actor: [Purchaser](../actors.md)
- Supporting actors: [Supplier](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-07-31

## Goal and scope

Enable the Purchaser to secure Travel Service capacity in advance under known commercial terms.

## Preconditions

an identified need, Supplier, and purchasing authority.

## Trigger

The Purchaser initiates advance capacity acquisition.

## Main success scenario

1. The Purchaser initiates the use case and identifies its subject.
2. The system retrieves the relevant confirmed context and checks authorization.
3. The system obtains and validates the information needed for the requested outcome.
4. The system performs the responsibilities owned by Procurement and coordinates required modules.
5. The Purchaser reviews or confirms the resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-3. Required context, authority, or information is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 4. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 5. The primary actor rejects or changes the result | Preserve the confirmed baseline and return the affected information for revision. |

## Success guarantee

confirmed Stock Service capacity and terms.

## Minimal guarantee

proposed or disputed capacity is not committed stock.

## Policies and information

Supplier, service, quantity, validity, Purchase Price, conditions, commitment, provenance.

Detailed policies and stated gaps require stakeholder confirmation.

## Use-case-specific quality and compliance considerations

make commercial commitment changes attributable and auditable.

## Acceptance example

```gherkin
Scenario: Procure Stock Services
  Given the Purchaser has authority and a supplier offer
  When the Purchaser agrees quantity, validity, and terms with the supplier
  Then the Purchaser the capacity is recorded as committed stock
```
