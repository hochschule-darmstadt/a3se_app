# Obtain Availability Confirmation

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-009](use-cases.md)
- Owning bounded context: Sales
- Primary actor: [Customer](../actors.md)
- Supporting actors: [Travel Advisor](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-08-03

## Goal and scope

Enable the Customer to learn whether sufficient pre-procured capacity remains available for every required Travel Service.

## Preconditions

a defined composition whose Travel Services are backed by pre-procured capacity.

## Trigger

The Customer asks to proceed or requests an Availability Check.

## Main success scenario

1. The Customer initiates the use case and identifies its subject.
2. The system retrieves the relevant confirmed context and checks authorization.
3. The system obtains and validates the information needed for the requested outcome.
4. The system performs the responsibilities owned by Sales and coordinates required participants.
5. The Customer reviews or confirms the resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-3. Required context, authority, or information is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 4. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 5. The primary actor rejects or changes the result | Preserve the confirmed baseline and return the affected information for revision. |

## Success guarantee

a time-bound result for the complete composition.

## Minimal guarantee

unchecked, stale, or partial results are not full confirmation.

## Policies and information

composition version, services, stock-capacity allocations, per-service results, time, validity, limitations.

Detailed policies and stated gaps require stakeholder confirmation.

## Use-case-specific quality and compliance considerations

state freshness and whether a result is informational or backed by a hold.

## Acceptance example

```gherkin
Scenario: Obtain Availability Confirmation
  Given the Customer has a composition backed by pre-procured capacity
  When the remaining stock capacity is checked for every service
  Then the Customer receives the complete result with time and limitations
```
