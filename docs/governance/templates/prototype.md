# Prototype / Proof of Concept

- Status: draft
- Owner: Implementation
- Last reviewed: YYYY-MM-DD

Use this template to specify one bounded prototype or proof of concept before implementation planning. Replace instructional text and placeholders with evidence-supported content. The artifact is the authoritative charter and evidence index for the selected prototype: it defines what will be exercised, why, under which restrictions, and how the architecture and technology result will later be reviewed.

The charter does not replace the complete use-case specification, UX, Software Architecture, Logical Entity Model, Technology, Security and Privacy Architecture, implementation plan, implementation, tests, delivery evidence, or accountable approval. The selected business behavior and UX are fixed representative inputs. The prototype validates only declared architecture and technology hypotheses, including technical-security and delivery mechanisms; it does not validate whether the product behavior itself is correct and does not establish production readiness.

Assign stable local identifiers such as `POC-HYP-NNN` to hypotheses and `POC-SC-NNN` to evidence scenarios. Preserve an identifier while its meaning continues; retire rather than reuse it when the meaning changes.

## Purpose and lifecycle

State whether this is an exploratory prototype, technical proof of concept, evolutionary implementation seed, or another evidenced form. Describe the decision or uncertainty it addresses, the intended environment, whether the result is disposable or expected to evolve, and the accountable approval point.

Record the lifecycle status and authority of material inputs. Draft inputs may support a draft prototype when their uncertainty and the resulting limits are explicit.

## Selected use case and slice

| Concern | Definition and evidence |
|---|---|
| Target actor goal | Link the stable catalog entry and individual detailed use-case specification. |
| Primary and supporting actors | Link authoritative actor identities and state their role in this slice. |
| Prototype trigger | State the condition at which the selected slice begins. |
| Prototype outcome | State the observable point at which this slice succeeds, fails, or hands off. |
| Included scenario steps and extensions | Link exact use-case steps, extensions, guarantees, and acceptance examples. |
| Required context and information | Identify only the business context and information needed by the slice and link their authority. |
| Representativeness | Explain which architecture or technology concerns, including technical security and delivery mechanisms, make this fixed representative slice useful. |
| Detailed-specification readiness | State whether the full actor goal is sufficiently specified and identify any active `specify-use-case` handoff. |

The slice is delivery and validation scope, not a redefinition of the complete actor goal. State explicitly which parts of the full use case remain unimplemented without declaring them globally out of scope.

## Prototype hypotheses

| ID | Falsifiable hypothesis | Driver and source | Evidence required | Decision enabled |
|---|---|---|---|---|
| `POC-HYP-NNN` | Statement that this bounded prototype can support, reject, or leave inconclusive | Architecture, entity realization, technology, technical security, or delivery-mechanism evidence | Observable result and suitable verification | Continue, revise, reject, defer, or investigate |

Do not claim to validate a quality that the prototype will not measure under representative conditions.

## Scope

### Included behavior

Describe the coherent normal, alternative, error, denied, cancellation, boundary, and recovery behavior used as fixed implementation and technical-review input. Preserve the applicable success and minimal guarantees.

### Excluded behavior

List adjacent use cases, integrations, actors, rules, qualities, environments, and lifecycle stages deliberately excluded. Explain any exclusion needed to prevent the prototype from being mistaken for a complete product or production implementation.

## Provisional prototype treatments

| Concern | Prototype treatment | Real, production-like, simulated, stubbed, fixture-driven, reduced, or deferred | Authoritative question that remains open | Replacement or reconsideration trigger |
|---|---|---|---|---|
| Business rule, data, identity, integration, quality, or operational concern | Exact bounded treatment | Classification | Link or named owner | Evidence or decision required |

Prototype treatments enable learning; they do not become requirements or accepted architecture by implementation alone. Prefer synthetic fixtures and replaceable boundaries where authoritative behavior remains unknown.

## UX realization

| Destination, frame, state, or pattern | Included interaction responsibility | Use-case trace | Validation need or limitation |
|---|---|---|---|
| Direct UX identifier or link | Information, action, state, feedback, recovery, and accessibility expectation | Scenario, extension, guarantee, or acceptance example | Review, browser, accessibility, or usability evidence |

Link UX artifacts rather than copying their complete content. Record any intentional prototype deviation and route material UX changes to their owning artifact.

## Solution realization

### Modules, layers, and contracts

Describe the owning and participating modules, internal layer responsibilities, provided interfaces, required ports, collaboration, consistency boundary, and prohibited dependencies exercised by the slice. Do not turn a module automatically into a package, process, service, schema, or deployment unit.

### Logical entities and incremental data

Identify the logical entities and value structures created, consulted, changed, or referenced. Describe only the minimum incremental physical-data scope and migration expectation needed to test the hypotheses. Keep table, key, column, index, mapping, and query design in implementation unless one is itself an accepted constraint or hypothesis.

### Technology and execution baseline

| Concern | Selected prototype mechanism and usage boundary | Production difference or unresolved decision | Validation evidence |
|---|---|---|---|
| UI, backend, protocol, persistence, migration, build, test, packaging, integration, or local dependency | Link the Technology authority and state the permitted slice-specific use | Explicit limitation | Build, startup, integration, compatibility, or execution evidence |

Describe the smallest reproducible local or review environment. Do not present it as Deployment Architecture or production topology.

## Security and privacy profile

State whether the prototype is isolated, externally exposed, disposable, or intended to evolve.

| Concern | Permitted prototype treatment | Prohibited behavior | Production difference or residual threat | Required evidence |
|---|---|---|---|---|
| Data, identity, authorization, network, secret, integration, logging, dependency, migration, testing, disposal, or evolution concern | Synthetic, isolated, mocked, reduced, real, or deferred treatment | Boundary that must not be crossed | Unvalidated control or unresolved obligation | Test, inspection, configuration, scan, or review |

Require the positive and denied scenarios needed to exercise the selected slice. Synthetic data and isolation do not establish production security, privacy, or compliance.

## Evidence scenarios

| ID | Authoritative source | Preconditions and stimulus | Expected observable result | Minimum evidence | Environment and data constraints |
|---|---|---|---|---|---|
| `POC-SC-NNN` | Use-case step, extension, guarantee, acceptance example, architecture rule, control objective, technology plan, or delivery need | Bounded scenario | Externally meaningful result | Automated test, database assertion, browser review, architecture check, build output, inspection, or manual review | Safe environment and synthetic data |

Cover normal, alternative, error, denied, boundary, and recovery behavior proportionately. Failure injection must be confined to test infrastructure or an explicitly isolated development-only mechanism.

## Delivery and execution constraints

State the expected clean-build, migration, startup, packaging, CI/CD, dependency, test, review, and evidence-capture path. Identify unavailable capabilities and whether their absence makes a hypothesis inconclusive or blocks implementation.

Do not prescribe a production release or external mutation without explicit authority.

## Completion and abort criteria

### Ready for review

List the implementation and evidence conditions that must hold before technical review begins. Include applicable scenario coverage, reproducibility, traceability, module and security checks, data constraints, implementation conformance to fixed UX inputs, and known limitations.

### Abort or re-specify

List contradictions, unsafe conditions, missing authority, unavailable evidence, dependency failures, or scope expansion that require implementation to stop and return to prototype specification or another owning artifact.

Passing automated checks is necessary where specified but is not equivalent to prototype approval.

## Implementation-planning input routing

This section is the bounded input contract for implementation planning, whether performed through `plan-implementation` or directly within the optional `implement-prototype` assignment for a stronger model capable of the combined complexity. Link exact authoritative identifiers, headings, or rows instead of copying their content or listing whole artifacts by default.

| Planning concern or boundary | Exact authoritative source and anchor | Why it constrains this slice | Consult when |
|---|---|---|---|
| Behavior, UX, module, entity, technology, security, environment, test, delivery, or another material concern | Direct link plus stable use-case step, acceptance example, wireframe, module, entity, control, profile, or named section | Slice-specific relevance without restating the source | At planning start, before the dependent increment is planned, or only for continuation/correction |

At planning start, route only the charter sections, Technical Foundation record, target execution baseline, and repository state needed to establish readiness and the executable path. Route additional sources immediately before their dependent planning boundary. Mark prior plans, implementation evidence, or review history as continuation- or correction-only; they are not default inputs to an initial plan.

The broad **Sources and related artifacts** bibliography below supports traceability and later review. It is not an instruction to load every listed artifact during planning.

## Planned evidence and implementation handoff

| Evidence or deliverable | Expected location or form | Owning task | Status |
|---|---|---|---|
| Implementation plan, executable result, source, tests, migrations, configuration, build output, architecture report, security evidence, or delivery log | Link or intended repository location | Individual delivery task, the selected `implement-prototype` alternative, `review-prototype`, or another owner | planned, available, missing, or superseded |

Record the selected implementation path. The optional `implement-prototype` assignment directly owns planning, test creation, implementation, and authorized delivery execution; it retains the same durable plan and evidence locations and the subsequent separate Prototype review.

This section indexes evidence; it does not duplicate source code, generated reports, or raw logs.

## Prototype review record

Complete this section through `review-prototype` after implementation evidence exists. Review only declared architecture and technology hypotheses and their technical completion criteria. Do not pre-populate successful conclusions during specification and do not reinterpret the review as validation of product behavior or UX correctness.

| Hypothesis or criterion | Result | Evidence | Limitations and residual risk | Required feedback or decision |
|---|---|---|---|---|
| `POC-HYP-NNN`, evidence scenario, or completion criterion | supported, rejected, inconclusive, not run, or not applicable | Direct link | What the evidence cannot establish | Continue, revise, reject, defer, or reactivate an owning artifact |

Record the accountable approval decision separately from the reviewer's recommendation.

## Assumptions and open questions

| Type | Statement | Affected hypothesis, scenario, or scope | Owner | Validation, resolution, or expiry condition |
|---|---|---|---|---|
| Assumption, open question, dependency, or residual risk | Material uncertainty | Direct local identifier or link | Accountable role or workflow | Required evidence, decision, or event |

## Cross-artifact handoffs

| Owning artifact or workflow | Required clarification or change | Affected slice, hypothesis, or scenario | Trigger and completion evidence |
|---|---|---|---|
| Use Cases, UX, Software Architecture, Entities, Technology, Security, Deployment, Implementation, Test, CI/CD, Operations, Backlog, Risk, or Decision Records | Exact handoff without redefining the target artifact | Direct identifiers or links | Owner, condition, and expected evidence |

## Validation status

Record:

- selection rationale and detailed-use-case readiness;
- slice-to-use-case and scenario-to-acceptance-example traceability;
- hypothesis-to-evidence coverage;
- included, excluded, provisional, real, mocked, and deferred distinctions;
- UX, module, entity, technology, data, security, and delivery alignment;
- completion, abort, technical-review, and feedback semantics;
- precise implementation-planning routing to the minimum authoritative anchors and phase-appropriate history;
- stable local identifiers and valid direct links;
- repository validation, skipped checks, input limitations, and residual uncertainty.

## Sources and related artifacts

Link directly to the Product Vision, glossary, actors, Domain Landscape, selected use-case catalog entry and detailed specification, neighboring use cases, Business Objects and rules, functional and non-functional requirements, constraints, exclusions, source evidence, navigation, wireframes, design system, Software Architecture, Logical Entity Model, Technology, Security and Privacy Architecture, Deployment Architecture, Technical Foundation record, implementation guidance, test strategy and scenarios, CI/CD, operations, risks, decisions, workflow, and definition of done used by the declared scope. This is a traceability bibliography; use **Implementation-planning input routing** to identify the smaller planning working set.
