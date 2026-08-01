# Prepare Ordered Travel

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-011](use-cases.md)
- Owning bounded context: Travel Execution
- Primary actor: [Travel Advisor](../actors.md)
- Supporting actors: [Traveler](../actors.md); [Supplier](../actors.md); [Intermediary](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-07-31

## Goal and scope

Enable the Travel Advisor to coordinate confirmed services and information so ordered travel can proceed.

## Preconditions

an identifiable Travel Order, services, and Travelers.

## Trigger

The Travel Advisor the order reaches preparation or a dependency changes.

## Main success scenario

1. The Travel Advisor initiates the use case and identifies its subject.
2. The system retrieves the relevant confirmed context and checks authorization.
3. The system obtains and validates the information needed for the requested outcome.
4. The system performs the responsibilities owned by Travel Execution and coordinates required participants.
5. The Travel Advisor reviews or confirms the resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-3. Required context, authority, or information is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 4. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 5. The primary actor rejects or changes the result | Preserve the confirmed baseline and return the affected information for revision. |

## Success guarantee

completed or explicitly managed preparation dependencies.

## Minimal guarantee

unresolved dependencies and changes remain visible.

## Policies and information

Travel Order, Travelers, reservations, confirmations, deadlines, exceptions, readiness.

Detailed policies and stated gaps require stakeholder confirmation.

## Use-case-specific quality and compliance considerations

restrict traveler information and prioritize urgent blockers.

## Acceptance example

```gherkin
Scenario: Prepare Ordered Travel
  Given the Travel Advisor has an order with identified preparation dependencies
  When the Travel Advisor completes all required information and confirmations
  Then the Travel Advisor the order is reported ready for documents and execution
```
