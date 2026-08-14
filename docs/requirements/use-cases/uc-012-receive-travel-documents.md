# Receive Travel Documents

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-012](use-cases.md)
- Owning domain: Customer Care
- Primary actor: [Customer](../actors.md)
- Supporting actors: [Traveler](../actors.md); [Travel Advisor](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-08-14

## Goal and scope

Enable the Customer to obtain Travel Documents needed to undertake or evidence ordered travel.

## Preconditions

an order with evaluable document release conditions and an authenticated Customer account.

## Trigger

The Customer documents become eligible or are requested.

## Main success scenario

1. The Customer initiates the use case and identifies its subject.
2. The system retrieves the relevant confirmed context and checks authorization.
3. The system obtains and validates the information needed for the requested outcome.
4. The system performs the responsibilities owned by Customer Care and coordinates required modules.
5. The Customer reviews or confirms the resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-3. Required context, authority, or information is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 4. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 5. The primary actor rejects or changes the result | Preserve the confirmed baseline and return the affected information for revision. |

## Success guarantee

authorized access to current required documents with auditable issuance.

## Minimal guarantee

documents are not exposed or falsely reported delivered.

## Policies and information

Travel Order, document type, version, recipient, conditions, issuance, delivery outcome.

Detailed policies and stated gaps require stakeholder confirmation.

## Applicable cross-cutting requirements

- [FR-006](../functional-requirements.md): authenticated access to Travel Documents

## Use-case-specific quality and compliance considerations

preserve confidentiality, integrity, accessibility, and permitted retrieval.

## Acceptance example

```gherkin
Scenario: Receive Travel Documents
  Given the Customer has satisfied all release conditions
  When the Customer a required document is issued
  Then the Customer the authorized recipient can obtain it and delivery is recorded
```
