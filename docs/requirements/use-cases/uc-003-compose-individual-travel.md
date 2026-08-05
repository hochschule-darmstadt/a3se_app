# Compose Individual Travel

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-003](use-cases.md)
- Owning domain: Touristic Product Design
- Primary actor: [Customer](../actors.md)
- Supporting actors: [Traveler](../actors.md); [Travel Advisor](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-08-05

## Goal and scope

Enable the Customer to assemble an individual Itinerary from Travel Services around confirmed needs.

## Preconditions

sufficient travel goals to begin composition.

## Trigger

The Customer asks to create or revise individual travel.

## Main success scenario

1. The Customer initiates the use case and identifies its subject.
2. The system retrieves the relevant confirmed context and checks authorization.
3. The system obtains and validates the information needed for the requested outcome.
4. The system performs the responsibilities owned by Touristic Product Design and coordinates required modules.
5. The Customer reviews or confirms the resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-3. Required context, authority, or information is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 4. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 5. The primary actor rejects or changes the result | Preserve the confirmed baseline and return the affected information for revision. |

## Success guarantee

a reviewable Itinerary ready for plausibility checking.

## Minimal guarantee

the last confirmed composition remains recoverable.

## Policies and information

Individual Travel, Itinerary, Travel Components, constraints, assumptions, gaps.

Detailed policies and stated gaps require stakeholder confirmation.

## Use-case-specific quality and compliance considerations

make every component and assumption understandable and revisable.

## Acceptance example

```gherkin
Scenario: Compose Individual Travel
  Given the Customer has confirmed dates, destinations, travelers, and constraints
  When the Customer selects compatible services
  Then the Customer receives a reviewable itinerary with unresolved gaps identified
```
