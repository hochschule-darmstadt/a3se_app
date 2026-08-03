# Maintain Travel Products and Services

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-015](use-cases.md)
- Owning subdomain: Season Planning
- Primary actor: [Seasonal Planner](../actors.md)
- Supporting actors: [Purchaser](../actors.md); [Supplier](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-07-31

## Goal and scope

Enable the Seasonal Planner to maintain reusable Travel Product and Travel Service definitions.

## Preconditions

authorized access and relevant source evidence.

## Trigger

The Seasonal Planner creates, revises, activates, or withdraws a definition.

## Main success scenario

1. The Seasonal Planner initiates the use case and identifies its subject.
2. The system retrieves the relevant confirmed context and checks authorization.
3. The system obtains and validates the information needed for the requested outcome.
4. The system performs the responsibilities owned by Season Planning and coordinates required modules.
5. The Seasonal Planner reviews or confirms the resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-3. Required context, authority, or information is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 4. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 5. The primary actor rejects or changes the result | Preserve the confirmed baseline and return the affected information for revision. |

## Success guarantee

an authorized version available for its effective period.

## Minimal guarantee

invalid or superseded data is not active and history remains intact.

## Policies and information

products, services, Supplier, descriptions, validity, availability inputs, relationships, provenance.

Detailed policies and stated gaps require stakeholder confirmation.

## Use-case-specific quality and compliance considerations

make changes attributable, versioned, effective-dated, and consistent.

## Acceptance example

```gherkin
Scenario: Maintain Travel Products and Services
  Given the Seasonal Planner updates a future product with confirmed service information
  When the Seasonal Planner validates and activates the definition
  Then the Seasonal Planner the new version applies without changing historical commitments
```
