# Maintain a Customer Record

- Status: proposed
- Owner: Requirements
- Catalog ID: [UC-014](use-cases.md)
- Owning domain: Customer Care
- Primary actor: [Customer](../actors.md)
- Supporting actors: [Travel Advisor](../actors.md)
- Source/evidence: [accepted use-case catalog](use-cases.md), [product vision](../vision.md), and [glossary](../glossary.md)
- Last reviewed: 2026-08-14

## Goal and scope

Enable the Customer to establish and update authoritative Customer information, including establishing the Customer account needed to return to protected information.

## Preconditions

an identifiable Customer or legitimate basis for a new record. Registration may start from an anonymous journey whose confirmed context must be preserved.

## Trigger

The Customer registers, or provides new or corrected information.

## Main success scenario

1. The Customer initiates the use case and identifies its subject.
2. The system retrieves the relevant confirmed context and checks authorization.
3. The system obtains and validates the minimum information and access proof needed for the requested outcome.
4. The system performs the responsibilities owned by Customer Care and coordinates required modules.
5. The Customer reviews or confirms the resulting state.
6. The system records the outcome, provenance, and unresolved next steps and communicates them to affected actors.

## Extensions

| Step/condition | Alternative or failure handling |
|---|---|
| 2-3. Required context, authority, or information is missing | Do not infer it; identify what is needed and preserve the last confirmed state. |
| 2-3. A registration identifier is already associated with an account | Do not disclose unrelated customer information; provide an account-recovery or sign-in path. |
| 4. A participating context or external party cannot complete its responsibility | Record the partial or uncertain result, avoid presenting success, and provide a retry, revision, or human-assistance path. |
| 5. The primary actor rejects or changes the result | Preserve the confirmed baseline and return the affected information for revision. |

## Success guarantee

validated current information with provenance and, for registration, a Customer account able to authenticate the Customer.

## Minimal guarantee

valid information and journey context are preserved and no unauthorized change occurs.

## Policies and information

identity and contact information, Customer account identifier and authentication state, provenance, consent, authorization, history. Credential mechanism and recovery policy remain undecided.

Detailed policies and stated gaps require stakeholder confirmation.

## Applicable cross-cutting requirements

- [FR-006 and FR-007](../functional-requirements.md): authenticated protected information and journey continuity

## Use-case-specific quality and compliance considerations

minimize and purpose-limit personal information; protect access secrets; avoid account enumeration; support correction and audit.

## Acceptance example

```gherkin
Scenario: Maintain a Customer Record
  Given the Customer is authorized to change a contact detail
  When the Customer submits a valid replacement
  Then the Customer the value and provenance are recorded for authorized purposes

Scenario: Register while requesting a Sales Offer
  Given an anonymous Customer has confirmed a plausible travel composition
  When the Customer provides valid registration information and proves control of the required access method
  Then a Customer account is established and the confirmed composition remains available
```
