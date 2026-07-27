# Agentic Engineering Harness Review

- Status: draft
- Owner: Engineering
- Last reviewed: 2026-07-27

## Purpose

This document captures findings from a meta-level review of the repository harness for agentic software engineering. It evaluates the current structure for early-phase work such as ideation, requirements engineering, problem analysis, and business-oriented system design. It does not add or change product requirements.

## Scope

The review focused on:

- the repository context harness and document structure;
- early business and requirements artifacts;
- specialist-agent roles and collaboration guidance;
- engineering workflow, traceability, and decision practices;
- the current separation between specification artifacts and delivery/planning artifacts.

## Executive summary

The repository already provides a strong documentation-oriented harness for disciplined, AI-assisted engineering. Its main strengths are progressive context loading, explicit authoritative areas, stable identifier namespaces, separation of discovery from accepted requirements, and role-based review charters.

The main gap is not missing structure, but missing operationalization. The repository currently behaves more like an `agent-ready documentation architecture` than an `agent-operable engineering system`. In particular, the intended separation between specification and delivery is present implicitly, but not yet defined as an explicit artifact reference model for humans and agents.

## Findings

### 1. Substantial artifacts are already present

The repository already includes a coherent set of early-phase artifacts and guidance, especially in:

- `docs/README.md` as the context map and reading-path entry point;
- `docs/product/` for vision, stakeholders, glossary, personas, requirements, domain knowledge, UX, and data meaning;
- `docs/governance/agents/` for role charters and multi-agent collaboration;
- `docs/governance/workflow/` for workflow, continuous alignment, and definition of done;
- `docs/engineering/tooling/` for diagram and other engineering tools;
- `docs/governance/decisions/` for ADRs;
- `docs/engineering/automation/` for product and workflow automation design.

In addition, the discovery brief and discovery report derived from *Quasar Enterprise* provide the most content-rich current source for early requirements work.

### 2. The current form is disciplined and repository-friendly

The harness uses lightweight Markdown artifacts with explicit metadata fields such as status, owner, and review date. It also uses stable requirement namespaces such as `CAP-`, `UC-`, `US-`, `QR-`, `CON-`, and `BR-`.

This is well suited to agentic work because it:

- supports progressive loading of context;
- reduces ambiguity about authoritative locations;
- keeps artifacts reviewable in Git;
- enables later automation for consistency and traceability checks.

### 3. The repository is strong on structure, lighter on populated content

Many core artifacts are still template-like and sparsely filled. That is not a structural problem, but it matters for evaluating readiness.

The harness is therefore currently:

- strong as a process and information architecture;
- moderate as a usable body of business knowledge;
- still weak as a repeatable operational system for agent execution without additional human steering.

### 4. The separation between specification and delivery is partially present already

The repository already points in the right direction:

- use cases are positioned as the preferred form for complete actor-goal interactions;
- user stories are positioned as backlog-slicing and conversation artifacts;
- traceability exists as a separate concern;
- constraints, business rules, and quality requirements are modeled independently.

This is a good basis for preventing the common anti-pattern in which user stories become the only source of truth for both planning and specification.

### 5. The same separation is not yet explicit enough for agentic use

The intended separation between `Spec` and `Delivery/PM` is not yet written down as a short, explicit reference model that answers questions such as:

- Which artifact is authoritative for a business rule?
- Which artifact is authoritative for a user-goal interaction?
- Which artifact is only a planning or slicing object?
- How should changes propagate between these artifact classes?
- What may be reprioritized freely, and what requires specification maintenance?

This is a material improvement opportunity because humans can often compensate for this ambiguity informally, while agents generally cannot.

### 6. Specialist-agent roles exist, but mostly as charters rather than operational skills

The role definitions for domain, QA, UX, security, and architecture are directionally strong. They set quality expectations and review posture well.

However, they are not yet full operational playbooks. Missing elements include:

- mandatory inputs to read before acting;
- expected outputs and response structure;
- minimum review checklist per role;
- escalation conditions;
- completion criteria for a specialist review;
- explicit handoff expectations between orchestrator and specialists.

### 7. The harness supports disciplined specification work better than agile delivery integration

For requirements and domain discovery, the harness is already coherent. For agile incremental delivery, it still needs a clearer bridge between:

- product-level specification artifacts;
- slice-level planning artifacts;
- later implementation and test artifacts.

The missing concept here is a lightweight but explicit model for how a business slice moves from discovery to accepted specification to delivery planning and finally to implementation and validation.

## Assessment for agentic agile development

### What fits well

- Explicit authoritative locations reduce context drift.
- Stable identifiers support traceability and later automation.
- Discovery artifacts are separated from accepted requirements.
- Technology choices are intentionally deferred.
- Specialist review roles are defined.
- Diagram and ADR practices support durable engineering evidence.

### What does not fit well enough yet

- No explicit artifact reference model for `Spec` vs `Delivery`.
- No defined promotion path from discovery notes to accepted artifacts.
- No explicit policy for what constitutes a minimal deliverable business slice.
- No repository-local operational skills or playbooks for agent execution.
- Limited machine-checkable rules beyond structure and notation.

## Recommended improvements

### 1. Add an explicit artifact reference model

Document, in one short authoritative place, which artifact answers which question.

Recommended minimum model:

- `Capability`, `Use Case`, `Business Rule`, `Quality Requirement`, `Glossary`, and `Acceptance Example` are specification artifacts.
- `User Story`, `PBI`, `Task`, and Sprint-local work items are delivery/planning artifacts.
- `Traceability` links the two.
- `ADR` records consequential decisions.

### 2. Define a promotion path

Make the transition explicit from:

`source -> discovery report -> candidate artifact -> reviewed proposal -> accepted specification -> delivery item -> validation evidence`

This would reduce ambiguity about when a statement is only exploratory and when it becomes authoritative.

### 3. Define a minimal business slice policy

State what a coherent slice should contain during the current project phase.

For this repository, a useful early-phase slice would usually include:

- one business capability or slice of a capability;
- one use case or use-case fragment;
- affected business rules;
- relevant quality concerns or constraints;
- acceptance examples;
- open questions and assumptions;
- traceability links.

### 4. Turn agent charters into operational playbooks

Keep the charters, but add short execution guidance for each role covering:

- required reading;
- review scope;
- output schema;
- severity/confidence rules;
- promotion and escalation triggers.

### 5. Increase automation for harness integrity

Automate checks such as:

- duplicate or orphaned IDs;
- unresolved relative links;
- placeholder entries that remain in authoritative catalogs too long;
- accepted items lacking acceptance evidence;
- inconsistent status transitions;
- missing traceability links between related artifacts.

## External reference basis for future formalization

The following sources are suitable anchors when formalizing the harness policy:

- ISO/IEC/IEEE 29148:2018 for requirements engineering information items and lifecycle discipline.
- IIBA Business Analysis Standard / Requirements and Designs Life Cycle Management for tracing, maintaining, prioritizing, approving, and structuring requirements and designs.
- Scrum Guide 2020 for the distinction between product backlog work management and product specification.
- Agile Alliance guidance on user stories and the Three C's for understanding stories as delivery and conversation aids rather than complete specification artifacts.
- Alistair Cockburn's use-case guidance for stable, technology-independent actor-goal specifications.

## Recommended repository placement for meta-artifacts

Meta-artifacts should not all go into one folder. Their placement should depend on what they govern.

Recommended placement policy:

- `docs/governance/workflow/` for harness design, artifact models, workflow rules, and repository operating policies.
- `docs/governance/agents/` for role charters, orchestration rules, and specialist-agent operating contracts.
- the owning workflow, review, risk, or decision artifact for consequential reflections on AI assistance quality, risks, validation limits, and workflow learning.
- `docs/governance/decisions/` for accepted and consequential decisions about the harness itself when trade-offs need durable recording.

For the findings in this document, `docs/governance/workflow/` is the correct home because the content governs workflow and artifact responsibilities across roles.

## Open questions

- Should the repository define a dedicated artifact for `business slice`, or keep slices implicit through links between capabilities, use cases, stories, and acceptance examples?
- Should the specification/delivery reference model live in `docs/governance/workflow/` or be summarized in `docs/README.md` as a first-class navigation concept?
- Which parts of the harness should remain human-judgment-based, and which should become machine-checkable first?

## Suggested next step

Create a short authoritative `artifact reference model` document under `docs/governance/workflow/` and link it from the main context map and workflow guidance.
