# Obtain Ongoing Travel Assistance

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-002](use-cases.md)
- Owning domain: Customer Care
- Primary actor: [Traveler](../actors.md)
- Supporting actors: [Customer](../actors.md); [Travel Advisor](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-08-14

## Goal and scope

Enable the Traveler to continue assistance through the Automated Travel Advisor during or after travel without restarting the relationship, with human handover when the AI chatbot cannot safely or successfully complete the need.

## Preconditions

an identifiable interaction or Travel Order and authorized access.

## Trigger

The Traveler sends a help request to the Automated Travel Advisor during or after travel.

## Main success scenario

1. The Traveler describes the need to the Automated Travel Advisor and identifies its subject.
2. The Automated Travel Advisor retrieves the relevant confirmed context and checks authorization.
3. The Automated Travel Advisor answers or obtains and validates the information needed for a requested action.
4. For a supported and authorized action, the Automated Travel Advisor invokes the responsible Customer Care capability and exposes its actual action state.
5. The Traveler reviews or confirms the answer or resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors; when the chatbot cannot complete the need, it provides a context-preserving human handover.

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
- [FR-008 and FR-009](../functional-requirements.md): agentic AI-chat advice and explicit action states
- [NFR-002](../non-functional-requirements.md): conversational response time

## Use-case-specific quality and compliance considerations

identify the AI chatbot, acknowledge urgent needs promptly, never imply unconfirmed resolution, and hand over when urgency or authority exceeds its supported operations.

## Acceptance example

```gherkin
Scenario: Obtain Ongoing Travel Assistance
  Given the Traveler has an active travel order and prior interaction
  When the Traveler reports a disruption
  Then the Traveler receives contextual help or a clear handover
```
