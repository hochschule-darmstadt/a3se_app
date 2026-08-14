# Seek Travel Advice

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-001](use-cases.md)
- Owning domain: Sales
- Primary actor: [Customer](../actors.md)
- Supporting actors: [Traveler](../actors.md); [Travel Advisor](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-08-14

## Goal and scope

Enable the Customer to converse with the Automated Travel Advisor, receive answers, and ask it to take supported actions while preserving confirmed context. Structured search remains a separate discovery interaction and is not presented as advice.

## UX task-flow view

![UC-001 activity diagram](uc-001-seek-travel-advice.svg)

This proposed synchronized view follows the [activity-diagram standard](../../governance/standards/use-case-activity-diagrams.md) and belongs to the documented [pilot](activity-diagram-pilot.md). The textual scenario below remains authoritative.

## Preconditions

access to an interaction channel.

## Trigger

The Customer sends a message to the Automated Travel Advisor.

## Main success scenario

1. The Customer describes a goal, asks a question, or requests an action in the AI chatbot.
2. The Automated Travel Advisor retrieves the relevant confirmed context and checks the authority available for the requested information or action.
3. The Automated Travel Advisor answers the question or identifies the information, authorization, or customer decision needed before acting.
4. For an action request, the Automated Travel Advisor presents the intended action and any unresolved effect or required customer decision, then invokes only a supported, authorized system operation.
5. The system reports the operation as proposed, awaiting input or authorization, in progress, confirmed, failed, or uncertain; the Automated Travel Advisor does not infer success.
6. The Customer reviews the answer or resulting state and may continue the conversation, refine the goal, or request another action.
7. The system records confirmed outcomes, provenance, and unresolved next steps and makes the updated context available to subsequent customer views or a human handover.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-4. Required context, authority, information, or customer decision is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 4. The requested action is unsupported or outside the Automated Travel Advisor's authority | Explain the boundary and offer an available alternative or context-preserving human handover. |
| 4-5. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 6. The Customer rejects or changes the result | Preserve the confirmed baseline and continue the conversation from the affected information. |

## Success guarantee

relevant conversational advice or a confirmed supported action, with resumable context.

## Minimal guarantee

unconfirmed preferences and incomplete agent actions are not treated as agreed or completed.

## Policies and information

conversation, travel search criteria, matching Travel Products, travel goals, constraints, preferences, proposed and confirmed actions, action provenance, open questions, handover state.

Detailed policies and stated gaps require stakeholder confirmation.

## Applicable cross-cutting requirements

- [FR-001 through FR-005](../functional-requirements.md): interaction language, language extensibility, web delivery, responsive customer interaction, and anonymous exploration
- [FR-008 and FR-009](../functional-requirements.md): agentic AI-chat advice and explicit action states
- [NFR-002](../non-functional-requirements.md): conversational response time

## Use-case-specific quality and compliance considerations

distinguish answers and proposed actions from confirmed business outcomes and a committed Sales Offer; expose the Automated Travel Advisor's identity; provide context-preserving human handover. Which action classes require explicit confirmation remains unresolved and requires security, privacy, payment, and business review.

## Acceptance example

```gherkin
Scenario: Seek Travel Advice
  Given the Customer stated an initial travel idea
  When the Customer refines goals and constraints with the Automated Travel Advisor
  Then the Customer receives relevant options or an explanation that none fit in the same conversation

Scenario: Ask the Automated Travel Advisor to act
  Given the anonymous Customer has discussed destination, dates, and traveler criteria
  When the Customer asks the Automated Travel Advisor to search with those criteria
  Then the chatbot invokes the supported search operation
  And it identifies whether the search is in progress, confirmed, failed, or uncertain
  And a confirmed result is available in the Search Results view without requiring registration or sign-in
```
