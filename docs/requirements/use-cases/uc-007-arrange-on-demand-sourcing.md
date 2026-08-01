# Arrange On-demand Sourcing

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-007](use-cases.md)
- Owning bounded context: Procurement
- Primary actor: [Purchaser](../actors.md)
- Supporting actors: [Intermediary](../actors.md); [Supplier](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-07-31

## Goal and scope

Enable the Purchaser to establish commercial access to Travel Services sourced when demand arises.

## Preconditions

an identified service need and sourcing party.

## Trigger

The Purchaser starts or revises a sourcing arrangement.

## Main success scenario

1. The Purchaser initiates the use case and identifies its subject.
2. The system retrieves the relevant confirmed context and checks authorization.
3. The system obtains and validates the information needed for the requested outcome.
4. The system performs the responsibilities owned by Procurement and coordinates required participants.
5. The Purchaser reviews or confirms the resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-3. Required context, authority, or information is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 4. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 5. The primary actor rejects or changes the result | Preserve the confirmed baseline and return the affected information for revision. |

## Success guarantee

an active arrangement with explicit commercial and operational limits.

## Minimal guarantee

an unconfirmed arrangement is not evidence of availability.

## Policies and information

sourcing party, services, price terms, validity, access method, limits, status.

Detailed policies and stated gaps require stakeholder confirmation.

## Use-case-specific quality and compliance considerations

protect commercial terms and credentials; technology remains undecided.

## Acceptance example

```gherkin
Scenario: Arrange On-demand Sourcing
  Given the Purchaser has agreed service scope with an intermediary
  When the Purchaser confirms access and commercial conditions
  Then the Purchaser the arrangement becomes available for later sourcing
```
