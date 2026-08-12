# Use-Case Activity Diagram Pilot

- Status: proposed
- Owner: Requirements/UX
- Last reviewed: 2026-08-12

This pilot applies the proposed [Use-Case Activity Diagram Standard](../../governance/standards/use-case-activity-diagrams.md) to representative authoritative [use-case specifications](use-cases.md). The resulting diagrams are requirements views and inputs to later UX design; they are not UX design outputs.

## Selection

The pilot deliberately samples three interaction characteristics:

| Use case | Pilot characteristic | UX questions exposed |
|---|---|---|
| [UC-001 Seek Travel Advice](uc-001-seek-travel-advice.md) | conversational iteration | confirmed context, missing information, revision, uncertainty, and human assistance |
| [UC-016 Place a Travel Order](uc-016-place-travel-order.md) | transactional happy path and idempotency boundary | authorization, validation, confirmation, duplicate prevention, and audit feedback |
| [UC-018 Pay for Travel](uc-018-pay-for-travel.md) | failure and recovery | sensitive input, pending or uncertain outcome, retry/revision/assistance, and visible effect |

## Review status and limitations

The pilot is proposed AI-assisted analysis pending stakeholder UX review. Review must confirm that the views expose the information needed for subsequent UX work without inventing behaviour or prematurely defining screens.

The diagrams intentionally retain the source specifications' generic actions and unresolved detailed policies. Generated additions such as payment-provider protocol steps, named UI controls, inferred order states, and assumed retry rules were rejected because current evidence does not authorize them.

Rollout to the other active use cases remains pending until the diagram standard and pilot are accepted. Omitted diagrams therefore represent a review gate, not a claim that those use cases would not benefit from a view.
