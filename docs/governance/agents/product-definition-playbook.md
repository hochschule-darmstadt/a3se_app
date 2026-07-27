# Product Definition Playbook

- Status: accepted
- Owner: Product
- Last reviewed: 2026-07-27

Use this playbook when defining or materially changing product intent.

## Required context

Read:

1. the [project context map](../../README.md);
2. the [artifact authority and lifecycle](../workflow/artifact-lifecycle.md);
3. vision, stakeholders, glossary, and relevant discovery sources;
4. existing accepted capabilities, use cases, rules, quality requirements, constraints, and traceability;
5. applicable decisions and open questions.

Load only the additional domain, UX, data, engineering, quality, or operations context required by the slice.

## Procedure

1. State the product-definition slice, affected IDs, evidence, and intended outcome.
2. Separate facts, assumptions, proposals, decisions, and open questions.
3. Update each fact in its authoritative artifact; link rather than duplicate.
4. Add acceptance examples and relevant alternative, error, and boundary behavior.
5. Reconcile terminology, business rules, information concepts, quality concerns, constraints, and traceability.
6. Request independent QA review and other role reviews when the operating model's risk triggers apply.
7. Resolve findings or record the unresolved issue with an owner and resolution condition.
8. Run `npm run harness:validate` and apply the definition of done before proposing acceptance.

## Review output

Each material finding states:

- evidence;
- affected stable IDs;
- severity: `critical`, `high`, `medium`, or `low`;
- confidence: `high`, `medium`, or `low`;
- proposed action;
- accountable owner or escalation need.

The Product role accepts, rejects with rationale, requests more evidence, or escalates each material product finding. Agents do not silently convert assumptions or source statements into accepted requirements.

## Completion and handoff

A product-definition slice is ready for acceptance when:

- its stakeholder outcome and scope are clear;
- terminology agrees with the glossary;
- normal, alternative, error, and boundary behavior are covered as relevant;
- material assumptions and open questions have owners and validation conditions;
- QA has independently challenged testability and acceptance evidence;
- traceability reaches source evidence and affected specification artifacts;
- skipped checks and residual risks are explicit.

After acceptance, delivery planning may create or reprioritize user stories without redefining the accepted specification.
