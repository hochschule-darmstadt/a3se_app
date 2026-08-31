# Cross-cutting Non-functional Requirements

- Status: draft
- Owner: Requirements
- Last reviewed: 2026-08-05

This catalog is authoritative for measurable quality and compliance outcomes that apply across multiple use cases. Classify quality requirements using ISO/IEC 25010 where applicable, but express every entry as a testable scenario rather than an adjective such as “fast,” “secure,” or “user-friendly.” Use the normative terms defined in [Requirements Language](../governance/standards/requirements-language.md).

Use cases reference applicable `NFR-` identifiers and do not repeat their normative statements. A concern unique to one actor-goal interaction remains in that use case unless stakeholders establish it as cross-cutting.

| ID | Characteristic | Condition and stimulus | Normative response | Measure | Applies to | Source/evidence | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| NFR-001 | Performance efficiency: time behaviour | Under the agreed normal operating load, a user initiates a non-conversational, system-controlled UI interaction. | The system SHALL display an acknowledgement or requested result within the target response time. | At least 80% of measured interactions complete within 1 second, measured from user submission until the first visible acknowledgement or result. | [Customer Interaction and Staff Interaction modules](../architecture/software-architecture/software-architecture.md) | Stakeholder acceptance, 2026-08-01; architecture refinement, 2026-08-03 | not assigned | accepted |
| NFR-002 | Performance efficiency: time behaviour | Under the agreed normal operating load, a customer submits a message to the automated conversational travel advisor. | The system SHALL begin displaying a content-bearing conversational response within the target response time; a typing or progress indicator alone does not satisfy the response. | At least 80% of measured interactions begin a content-bearing response within 3 seconds, measured from message submission. | [Customer Interaction module](../architecture/software-architecture/software-architecture.md); [UC-001](use-cases/uc-001-seek-travel-advice.md); [UC-002](use-cases/uc-002-obtain-ongoing-travel-assistance.md) | Stakeholder acceptance, 2026-08-01 | not assigned | accepted |
| NFR-003 | Cost constraint: software licensing and use | Whenever a library, framework, database, development tool, build tool, test tool, or operational software tool is selected or upgraded for a mandatory project workflow or runtime capability. | The selected software SHALL be legally usable for the project's intended development, testing, deployment, and commercial operation without licence, subscription, or usage fees. | The maintained dependency and tool inventory identifies the applicable licence and edition for every mandatory item; review confirms a cost of EUR 0 for the intended use and scale in every required environment. | Entire system and software lifecycle | Stakeholder requirement, 2026-08-03 | not assigned | accepted |
| NFR-004 | Reliability: concurrency and atomicity | Concurrent staff create requests target the same entity family, or a create transaction aborts after reserving an identifier. | The system SHALL commit unique correctly prefixed identifiers; an aborted transaction SHALL leave neither an entity nor a counter allocation that can collide with a later request. | Real Neo4j integration evidence shows no duplicate committed IDs and proves rollback/retry behavior. | Staff resource persistence | Issue #57; DR-0021, 2026-08-31 | high | proposed |

Every entry requires a measurable response and acceptance evidence before it can be accepted.

NFR-003 governs software rights and tool usage, not the consumption cost of required infrastructure such as compute, storage, networking, or separately contracted external business services. A nominally free edition fails NFR-003 if the intended scale or required capability would mandate a paid edition.

Verification question (owner: Test/Operations): define the normal operating-load profile, measurement environment, observation window, and treatment of failed or externally blocked interactions before verifying NFR-001 or NFR-002.
