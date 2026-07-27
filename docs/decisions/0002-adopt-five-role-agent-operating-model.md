# ADR-0002: Adopt a five-role agent operating model

- Status: accepted
- Date: 2026-07-27
- Deciders: project owner and engineering
- Supersedes: none

## Context

The initial operating model defined separate product/domain, UX/accessibility, security/privacy, architecture, and QA specialist roles. It covered requirements review well but did not explicitly cover implementation or operations. The project needs a role model that stays simple while remaining applicable across the software lifecycle.

## Decision drivers

- clear accountability with few standing roles;
- coverage from requirements through implementation and operation;
- independent QA challenge;
- explicit security, privacy, accessibility, and reliability responsibilities;
- no premature technology or platform decisions;
- ability to activate dedicated specialists when risk requires them.

## Considered options

- Retain the initial specialist roles and add implementation and operations: comprehensive, but creates unnecessary role boundaries.
- Move UX/accessibility and security/privacy entirely into product/domain: simple, but incorrectly concentrates technical and operational security accountability in the product role.
- Use five lifecycle roles with cross-cutting security/privacy responsibilities: simple, complete, and preserves risk-based specialist escalation.

## Decision

Use five roles:

- Orchestrator;
- Product, including domain responsibilities, UX, accessibility, and product-side privacy;
- Engineering, including architecture, implementation, secure engineering, and technology guidance;
- QA;
- Operations, including reliability and operational security.

Security and privacy are cross-cutting responsibilities distributed among Product, Engineering, QA, and Operations. The orchestrator activates a dedicated specialist when risk or uncertainty requires independent expertise.

The roles exist before technologies or platforms are selected. Their charters remain technology-independent; specific coding, tooling, deployment, and operational rules are added only after accepted decisions establish them.

## Consequences

### Positive

- The role set covers the lifecycle with fewer boundaries.
- UX and accessibility remain close to product outcomes.
- Architecture and implementation share engineering accountability.
- Security and privacy remain explicit without requiring a standing role for every task.
- Implementation and operational concerns can be raised before stack selection without preselecting solutions.

### Negative and risks

- Broad roles require the orchestrator to assign bounded tasks carefully.
- Distributed security/privacy ownership could be overlooked unless the operating model and completion checks remain explicit.
- High-risk work still requires dedicated expertise and independent review.

## Validation and revisit triggers

Review the model when role boundaries repeatedly cause missed concerns, handoff delays, conflicting accountability, or excessive context; when regulatory or security exposure materially changes; or when delivery scale justifies additional permanent specialization.

## Links

- [Multi-agent operating model](../agents/operating-model.md)
- [Agent roles](../agents/README.md)
- [Engineering workflow](../engineering/workflow.md)
- [Technology stack guidance](../technology/README.md)
