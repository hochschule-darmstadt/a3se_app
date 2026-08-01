# Cross-cutting Non-functional Requirements

- Status: draft
- Owner: Requirements
- Last reviewed: 2026-08-01

This catalog is authoritative for measurable quality and compliance outcomes that apply across multiple use cases. Classify quality requirements using ISO/IEC 25010 where applicable, but express every entry as a testable scenario rather than an adjective such as “fast,” “secure,” or “user-friendly.” Use the normative terms defined in [Requirements Language](../governance/standards/requirements-language.md).

Use cases reference applicable `NFR-` identifiers and do not repeat their normative statements. A concern unique to one actor-goal interaction remains in that use case unless stakeholders establish it as cross-cutting.

| ID | Characteristic | Condition and stimulus | Normative response | Measure | Applies to | Source/evidence | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| NFR-001 | Performance efficiency: time behaviour | Under the agreed normal operating load, a user initiates a non-conversational, system-controlled UI interaction. | The system SHALL display an acknowledgement or requested result within the target response time. | At least 80% of measured interactions complete within 1 second, measured from user submission until the first visible acknowledgement or result. | [Customer Interaction, Staff Interaction, and Supplier Interaction](bounded-contexts/bounded-contexts.md) | Stakeholder acceptance, 2026-08-01 | not assigned | accepted |
| NFR-002 | Performance efficiency: time behaviour | Under the agreed normal operating load, a customer submits a message to the automated conversational travel advisor. | The system SHALL begin displaying a content-bearing conversational response within the target response time; a typing or progress indicator alone does not satisfy the response. | At least 80% of measured interactions begin a content-bearing response within 3 seconds, measured from message submission. | [Customer Interaction](bounded-contexts/bounded-contexts.md); [UC-001](use-cases/uc-001-seek-travel-advice.md); [UC-002](use-cases/uc-002-obtain-ongoing-travel-assistance.md) | Stakeholder acceptance, 2026-08-01 | not assigned | accepted |

Every entry requires a measurable response and acceptance evidence before it can be accepted.

Verification question (owner: Test/Operations): define the normal operating-load profile, measurement environment, observation window, and treatment of failed or externally blocked interactions before verifying NFR-001 or NFR-002.
