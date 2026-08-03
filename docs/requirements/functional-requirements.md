# Cross-cutting Functional Requirements

- Status: draft
- Owner: Requirements
- Last reviewed: 2026-08-03

This catalog is authoritative only for required behavior that applies across multiple use cases. Actor goals, interaction steps, alternatives, and guarantees remain in the [use-case specifications](use-cases/use-cases.md). Do not restate them here.

Each requirement has one stable `FR-` identifier, one atomic and testable normative statement, direct evidence, explicit applicability, and linked acceptance evidence. Use the normative terms defined in [Requirements Language](../governance/standards/requirements-language.md).

| ID | Requirement | Applies to | Source/evidence | Acceptance criterion | Priority | Status |
|---|---|---|---|---|---|---|
| FR-001 | Customer, staff, and supplier interactions SHALL present user-facing content in British English. | [Customer Interaction and Staff Interaction](domains/domains.md); supplier-facing capabilities in the architecture | Stakeholder direction, 2026-08-01; scope clarification, 2026-08-03 | Representative content in each interaction context conforms to British English spelling and usage. | not assigned | accepted |
| FR-002 | Customer, staff, and supplier interactions SHALL permit an additional interaction language to be introduced without changing domain rules or use-case definitions. | [Customer Interaction and Staff Interaction](domains/domains.md); supplier-facing capabilities in the architecture | Stakeholder direction, 2026-08-01; scope clarification, 2026-08-03 | Representative interactions can be presented in a synthetic second language while producing the same domain outcome as their British English versions. | not assigned | accepted |
| FR-003 | Customer, staff, and supplier interactions SHALL be provided through web user interfaces. | [Customer Interaction and Staff Interaction](domains/domains.md); supplier-facing capabilities in the architecture | Stakeholder direction, 2026-08-01 | Every supported customer, staff, and supplier interaction can be completed through a web browser. | not assigned | accepted |
| FR-004 | The Customer Interaction web user interface SHALL adapt its presentation and controls for PC, tablet, and mobile form factors without removing required customer capabilities. | [Customer Interaction](domains/domains.md) | Stakeholder direction, 2026-08-01 | Every supported customer interaction can be completed at representative PC, tablet, and mobile viewport sizes without loss of content or required actions. | not assigned | accepted |

Add an entry only when the same behavior genuinely governs at least two use cases. Otherwise, specify the behavior once in its owning use case.
