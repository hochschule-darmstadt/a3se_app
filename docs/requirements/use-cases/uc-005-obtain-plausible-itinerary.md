# Obtain a Plausible Itinerary

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-005](use-cases.md)
- Owning domain: Touristic Product Design
- Primary actor: [Customer](../actors.md)
- Supporting actors: [Travel Advisor](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-08-05

## Goal and scope

Enable the Customer to determine whether an Itinerary is operationally coherent and allowed.

## Preconditions

sufficient timing, location, traveler, and component information.

## Trigger

The Customer requests a plausibility result.

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

a clear result for the evaluated Itinerary version.

## Minimal guarantee

an incomplete check is not mistaken for availability or commitment.

## Policies and information

Itinerary version, timing, locations, constraints, assumptions, results, blockers.

Detailed policies and stated gaps require stakeholder confirmation.

## Use-case-specific quality and compliance considerations

make results explainable and distinct from an Availability Check.

## Acceptance example

```gherkin
Scenario: Obtain a Plausible Itinerary
  Given the Customer has a sufficiently detailed itinerary
  When the Customer requests a plausibility check
  Then the Customer receives confirmation or specific blocking gaps and conflicts
```
