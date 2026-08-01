# Coordinate Active Travel

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-013](use-cases.md)
- Owning bounded context: Travel Execution
- Primary actor: [Traveler](../actors.md)
- Supporting actors: [Customer](../actors.md); [Travel Advisor](../actors.md); [Supplier](../actors.md); [Intermediary](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-07-31

## Goal and scope

Enable the Traveler to respond to events and coordinate relevant parties during travel.

## Preconditions

an active Travel Order and authorized Traveler.

## Trigger

The Traveler reports a need or an execution event arrives.

## Main success scenario

1. The Traveler initiates the use case and identifies its subject.
2. The system retrieves the relevant confirmed context and checks authorization.
3. The system obtains and validates the information needed for the requested outcome.
4. The system performs the responsibilities owned by Travel Execution and coordinates required participants.
5. The Traveler reviews or confirms the resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-3. Required context, authority, or information is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 4. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 5. The primary actor rejects or changes the result | Preserve the confirmed baseline and return the affected information for revision. |

## Success guarantee

a resolved or actively owned event with confirmed information communicated.

## Minimal guarantee

receipt and ownership remain visible; unconfirmed changes are not final.

## Policies and information

Travel Order, affected services, event, urgency, parties, decisions, changes, communications.

Detailed policies and stated gaps require stakeholder confirmation.

## Use-case-specific quality and compliance considerations

acknowledge time-critical events and distinguish assistance from emergency services.

## Acceptance example

```gherkin
Scenario: Coordinate Active Travel
  Given the Traveler reports a disruption affecting active travel
  When the Traveler responsible parties confirm a resolution
  Then the Traveler the change is recorded and actionable information is communicated
```
