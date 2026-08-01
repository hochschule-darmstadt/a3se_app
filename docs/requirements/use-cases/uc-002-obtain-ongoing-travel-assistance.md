# Obtain Ongoing Travel Assistance

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-002](use-cases.md)
- Owning bounded context: Customer Interaction
- Primary actor: [Traveler](../actors.md)
- Supporting actors: [Customer](../actors.md); [Travel Advisor](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-07-31

## Goal and scope

Enable the Traveler to continue assistance during or after travel without restarting the relationship.

## Preconditions

an identifiable interaction or Travel Order and authorized access.

## Trigger

The Traveler requests help during or after travel.

## Main success scenario

1. The Traveler initiates the use case and identifies its subject.
2. The system retrieves the relevant confirmed context and checks authorization.
3. The system obtains and validates the information needed for the requested outcome.
4. The system performs the responsibilities owned by Customer Interaction and coordinates required participants.
5. The Traveler reviews or confirms the resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-3. Required context, authority, or information is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 4. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 5. The primary actor rejects or changes the result | Preserve the confirmed baseline and return the affected information for revision. |

## Success guarantee

assistance or a context-preserving handover.

## Minimal guarantee

the request and unresolved urgency remain visible without unauthorized disclosure.

## Policies and information

Travel Order reference, execution state, interaction history, authorization, request, outcome.

Detailed policies and stated gaps require stakeholder confirmation.

## Applicable cross-cutting requirements

- [FR-001 through FR-004](../functional-requirements.md): interaction language, language extensibility, web delivery, and responsive customer interaction
- [NFR-002](../non-functional-requirements.md): conversational response time

## Use-case-specific quality and compliance considerations

acknowledge urgent needs promptly and never imply unconfirmed resolution.

## Acceptance example

```gherkin
Scenario: Obtain Ongoing Travel Assistance
  Given the Traveler has an active travel order and prior interaction
  When the Traveler reports a disruption
  Then the Traveler receives contextual help or a clear handover
```
