# Requirements Engineering Workflow

- Status: accepted
- Owner: Requirements
- Last reviewed: 2026-07-29

Use this workflow when defining or materially changing stakeholder intent or system requirements.

## Required context

Read the [documentation context map](../../README.md), [artifact lifecycle](artifact-lifecycle.md), glossary, relevant actors and sources, existing specifications, applicable decisions, and open questions. Load only the additional architecture, test, operations, or management context needed for the slice.

## Procedure

1. State the requirements slice, affected IDs, evidence, and intended outcome.
2. Separate facts, assumptions, proposals, decisions, and open questions.
3. Update each statement in its authoritative artifact; link rather than duplicate.
4. Add acceptance examples and relevant alternative, error, and boundary behavior.
5. Reconcile terminology, rules, business objects, quality concerns, constraints, UX, and direct links among affected artifacts.
6. Request independent Test review and other lifecycle reviews when risk warrants them.
7. Resolve findings or record the unresolved issue with an owner and resolution condition.
8. Run `npm run harness:validate` and apply the definition of done before proposing acceptance.

Each material finding states evidence, affected stable IDs, severity, confidence, proposed action, and accountable owner or escalation need. Requirements accepts, rejects with rationale, requests evidence, or escalates each material requirements finding. An agent does not approve material stakeholder intent without the required authority.

A requirements slice is ready for acceptance when its outcome and scope are clear, terminology agrees with the glossary, relevant behavior is covered, assumptions and open questions are owned, Test has challenged testability and evidence, direct links reach the relevant source evidence, and skipped checks or residual risks are explicit.
