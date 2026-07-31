# Seek Travel Advice

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-001](use-cases.md)
- Owning bounded context: Customer Interaction
- Primary actor: [Customer](../actors.md)
- Supporting actors: [Traveler](../actors.md); [Travel Advisor](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-07-31

## Goal and scope

Enable the Customer to express and iteratively refine travel goals while preserving confirmed context.

## Preconditions

access to an interaction channel.

## Trigger

The Customer asks for travel advice.

## Main success scenario

1. The Customer initiates the use case and identifies its subject.
2. The system retrieves the relevant confirmed context and checks authorization.
3. The system obtains and validates the information needed for the requested outcome.
4. The system performs the responsibilities owned by Customer Interaction and coordinates required participants.
5. The Customer reviews or confirms the resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-3. Required context, authority, or information is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 4. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 5. The primary actor rejects or changes the result | Preserve the confirmed baseline and return the affected information for revision. |

## Success guarantee

relevant advice and a resumable confirmed context.

## Minimal guarantee

unconfirmed preferences are not treated as agreed.

## Policies and information

travel goals, constraints, preferences, open questions, handover state.

Detailed policies and stated gaps require stakeholder confirmation.

## Quality and compliance considerations

distinguish advice from a committed Sales Offer; provide human handover.

## Acceptance example

```gherkin
Scenario: Seek Travel Advice
  Given the Customer stated an initial travel idea
  When the Customer refines goals and constraints
  Then the Customer receives relevant options or an explanation that none fit
```
