---
name: specify-prototype
description: Collaboratively select and clarify a representative use-case slice, initiate or require sufficient detailed use-case specification, and create, refine, correct, or assess a prototype or proof-of-concept charter covering hypotheses, scope, provisional treatments, solution mapping, security restrictions, evidence, and completion criteria. Use before prototype implementation; do not use it to implement or evaluate the prototype, replace authoritative requirements, or claim production readiness.
---

# Specify Prototype

Develop an evidence-aware charter for one bounded prototype or proof of concept with the user. First establish which actor goal and coherent vertical slice should be exercised. Ensure that the complete actor goal is specified deeply enough to distinguish required behavior from prototype scope, initiating or reactivating `specify-use-case` when necessary. Then define what the prototype should validate, how it is constrained, and which evidence will support a later evaluation.

Treat the charter as a revisable plan. Later use-case detail, UX review, architecture refinement, implementation, tests, delivery evidence, or evaluation may refine or reject its assumptions. The user's instructions take precedence. Authorization to specify a prototype does not authorize implementation, dependency installation, infrastructure provisioning, production access, changes to authoritative product behavior, prototype evaluation, approval, or unrelated repository edits.

## Preserve artifact authority

- The use-case catalog owns the stable actor-goal identity, primary actor, supporting actors, primary subdomain, and portfolio-level coverage.
- The individual use-case specification owns the complete actor goal, main scenario, extensions, guarantees, policies, concerns, and acceptance examples. A prototype slice must not replace or narrow that full behavior.
- The prototype charter owns the selected delivery slice, validation hypotheses, prototype-only treatments, included and excluded behavior, solution mapping, security restrictions, intended evidence, and completion or abort criteria.
- UX artifacts own navigation, interaction frames, states, feedback, recovery, and experience guidance.
- Software Architecture owns modules, responsibilities, dependency rules, contracts, consistency boundaries, and distribution strategy.
- The Logical Entity Model owns technology-neutral entity meaning, relationships, integrity boundaries, and module ownership.
- Technology owns selected products and mechanisms and their usage boundaries. Security and Privacy Architecture owns threat treatment, control objectives, and the permitted prototype security profile.
- Implementation owns source layout, APIs, physical schemas, migrations, configuration, executable behavior, and exact dependencies.
- Test and delivery artifacts own executable verification and raw run evidence. Prototype evaluation owns the assessment of hypotheses and the approval recommendation. Accountable authority owns approval.

Do not alter an owning artifact merely to make the prototype easy to build. Record a precise handoff or reactivate the owning skill when the selected slice exposes a material defect or gap.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md`, the repository context map, the Basic Concept or applicable lifecycle workflow, artifact-lifecycle guidance, continuous-alignment guidance, and definition of done.
2. Read the canonical [Prototype / PoC template](../../../docs/governance/templates/prototype.md), the current prototype charter when one exists, and any prior prototype evidence or evaluation relevant to the requested scope.
3. Read the Product Vision, glossary, actor catalog, Domain Landscape, use-case catalog, relevant Business Objects and rules, constraints, exclusions, cross-cutting requirements, source evidence, and applicable decisions.
4. Read candidate individual use-case specifications, acceptance examples, neighboring use cases, and relevant navigation, wireframes, design-system guidance, and UX validation.
5. Read Software Architecture, the Logical Entity Model, Technology, Security and Privacy Architecture, Deployment Architecture, implementation guidance, test strategy, CI/CD capability, operational constraints, and dependency or source files only to the extent that they constrain or evidence this prototype.
6. Record the lifecycle status and authority of material inputs. Draft inputs may support a draft charter when uncertainty and validation needs remain explicit.

Preserve the established artifact location and compatible structure. In this repository, maintain the current charter at `docs/implementation/prototype.md` unless the user establishes another location or multiple independently reviewable prototypes require the topic to grow according to repository guidance.

## Select the operating mode

- **Initial specification:** select a representative slice and establish its first coherent prototype charter.
- **Refinement or correction:** reopen affected scope, hypotheses, provisional treatments, mappings, scenarios, restrictions, or criteria while preserving unaffected content and evidence.
- **Readiness assessment:** determine whether the selected slice and its inputs are sufficiently specified for implementation without writing unless changes are authorized.
- **Alignment assessment:** compare the charter with current requirements, UX, architecture, entities, technology, security, implementation, tests, or delivery evidence and report drift.
- **Early draft:** when explicitly requested, record a provisional charter despite incomplete inputs, keeping gaps visible and withholding an implementation-ready conclusion.

On repeated invocation, read the current charter and related evidence before proposing changes. Treat it as the baseline, not unquestionable truth. Preserve stable hypothesis and scenario identifiers while their meaning continues; retire rather than reuse them when meaning changes.

State the product, prototype, target actor goal, intended slice, operating mode, affected artifacts, and environment in scope. Do not infer scope from an existing demo, branch, screen, generated project, or partial implementation.

## Select and clarify the representative slice

Start with the actor goal, not a preferred technology or screen. Identify candidate cataloged use cases and compare them using evidence relevant to the prototype's purpose, such as:

- value and recognizability to a representative actor;
- ability to traverse meaningful UX, application, domain, persistence, and delivery boundaries;
- architecture, entity, technology, security, integration, or workflow uncertainty worth testing;
- presence of normal, alternative, denied, error, and recovery behavior;
- feasibility as one bounded implementation without requiring unrelated product scope;
- availability of sufficient evidence to avoid inventing central business behavior.

Propose the best-supported candidate and explain the trade-off. Confirm the selected actor goal and prototype purpose with the user before treating the choice as fixed unless the user already directed them explicitly.

Define the slice by its starting condition, observable outcome, included scenario steps and extensions, required data and context, touched modules and entities, and explicit exclusions. A slice may implement only part of a use case, but it must remain coherent and preserve the full use case's success and minimal guarantees for the behavior it exercises. Do not relabel omitted product behavior as globally out of scope.

## Ensure sufficient detailed use-case specification

Before finalizing the charter, assess whether the selected actor goal has an individual specification sufficient for slice design and evaluation. At minimum, verify:

- stable `UC-` identity, primary actor, goal, trigger, and boundary;
- a coherent main success scenario reaching an observable success guarantee;
- relevant alternative, error, authorization, cancellation, retry, and recovery extensions;
- a minimal guarantee protecting the actor and affected information when the goal fails;
- business information and ownership relevant to the slice;
- acceptance examples covering the behavior the prototype will exercise;
- explicit assumptions and open rules rather than invented answers.

If the catalog identity, actor, or subdomain is defective, reactivate `create-use-cases`. If the actor goal is cataloged but its individual detail is missing or inadequate, initiate or reactivate [`specify-use-case`](../specify-use-case/SKILL.md) in the appropriate initial, refinement, or correction mode. Pass it the target `UC-` identifier, the prototype purpose, the candidate slice, and the exact missing behavioral evidence. After that work completes, reload the resulting specification and reassess the slice.

Do not make the use-case specification describe only the prototype slice. The complete actor goal remains authoritative even when the prototype implements less. Do not use a wireframe, API, schema, or current implementation as a substitute for required behavioral detail.

When the user explicitly requests an early charter before sufficient detail exists, record the missing specification and affected hypotheses as blockers, assumptions, or handoffs. Such a charter may guide further analysis but must not be reported as ready for unattended implementation.

## Define prototype purpose and hypotheses

State whether the work is an exploratory prototype, technical proof of concept, evolutionary implementation seed, or another explicitly supported form. Do not assume that executable code is disposable or production-bound; record the intended lifecycle and reconsideration point.

Define a small set of falsifiable hypotheses. Cover only concerns the selected slice can materially exercise, for example:

- requirements-to-UX-to-test traceability and reviewability;
- module ownership, internal dependency rules, contracts, or consistency boundaries;
- logical entity sufficiency and incremental physical persistence;
- framework, database, integration, build, packaging, or delivery compatibility;
- a named UX, accessibility, performance, resilience, security, privacy, or operational uncertainty;
- the ability of the lifecycle method and toolchain to carry one vertical slice to reviewable evidence.

For every hypothesis state the observable evidence needed to support, reject, or leave it inconclusive. Do not claim to validate a quality that the prototype will not measure under representative conditions.

## Define scope and provisional treatments

Separate:

- included actor behavior and system outcomes;
- alternative, error, denied, cancellation, and recovery paths included for evidence;
- adjacent use cases and product capabilities deliberately excluded;
- real, production-like, simulated, stubbed, fixture-driven, reduced, or deferred mechanisms;
- prototype-only business-data choices needed to make an unresolved rule executable;
- conditions that require stopping or returning to an owning specification.

Every prototype-only treatment must identify the unresolved authoritative question and make its non-production meaning visible. Prefer synthetic fixtures and replaceable adapters to hard-coded behavior that could be mistaken for a business rule. Do not fabricate matching thresholds, authorization policy, identifiers, retention periods, legal bases, performance targets, or integration behavior.

## Map the slice to the intended solution

Describe enough solution realization to constrain implementation and test the hypotheses without performing implementation design prematurely:

- relevant UX destinations, frames, states, feedback, recovery, and accessibility expectations;
- owning and participating modules, layer responsibilities, provided interfaces, required ports, and prohibited coupling;
- logical entities and value structures created, consulted, changed, or referenced;
- consistency, transaction, idempotency, failure, and recovery expectations supported by evidence;
- selected technology mechanisms and their prototype usage boundaries;
- permitted local execution, packaging, data, identity, integration, and environment arrangement;
- the smallest incremental physical-data scope needed for the slice, clearly separated from the Logical Entity Model.

Leave endpoint paths, payload classes, table names, keys, indexes, packages, and exact code structure to implementation unless one is itself a hypothesis or accepted constraint. A prototype schema may evolve through forward migrations in later slices; it must not redefine logical meaning for implementation convenience.

## Apply the prototype security profile

Derive the applicable profile from Security and Privacy Architecture. State whether the prototype is isolated, externally exposed, disposable, or intended to evolve. Define:

- permitted data and explicit prohibition of production or personal data where applicable;
- identity and authorization treatment, including minimum positive and denied scenarios;
- environment and network exposure;
- permitted and prohibited external integrations;
- secrets and configuration handling;
- logging and safe-error limits;
- dependency, build, migration, test, and module-boundary checks;
- mocked controls, residual threats, disposal or evolution obligations, and production differences.

Synthetic data and isolation reduce consequence but do not prove production security or compliance. If a security mechanism is one of the hypotheses, do not mock that mechanism.

## Define evidence and decision criteria

Derive prototype scenarios from the selected use-case steps, extensions, guarantees, acceptance examples, architecture rules, security controls, and technology validation needs. Cover normal, alternative, error, denied, boundary, and recovery behavior proportionately.

For each scenario state:

- its stable local identifier and authoritative source;
- precondition and stimulus;
- expected observable result;
- minimum automated, manual, database, browser, architecture, build, security, or delivery evidence;
- environment and synthetic-data constraints.

Define separately:

- **completion criteria:** evidence required before evaluation can begin;
- **abort or re-specification criteria:** findings that make continued implementation misleading, unsafe, or unable to test the hypothesis;
- **evaluation semantics:** supported, rejected, or inconclusive hypotheses and who owns approval;
- **feedback routing:** which owning artifact or task receives each class of finding.

Passing tests does not equal approval. A successful prototype validates only its declared hypotheses and limitations.

## Determine readiness

An early draft is ready when the selected actor goal, candidate slice, intended purpose, major gaps, and next specification work are explicit enough not to mislead.

A charter is ready for prototype implementation when:

- the selected slice is coherent, bounded, and linked to a sufficiently detailed full use case;
- included and excluded behavior cannot reasonably be confused with the complete product scope;
- hypotheses are falsifiable and evidence is feasible within the declared environment;
- provisional treatments are visible, replaceable where appropriate, and do not masquerade as requirements;
- UX states, modules, entities, technology mechanisms, consistency needs, and security restrictions needed by the slice are justified or explicitly deferred;
- normal, alternative, error, denied, and recovery evidence is proportionate to the hypotheses and guarantees;
- completion, abort, evaluation, and feedback criteria are explicit;
- unresolved central behavior, unsafe data handling, unavailable dependencies, or contradictory authority does not make implementation irresponsible.

Do not require system-wide completeness. Do not declare readiness when the prototype could only proceed by silently deciding a material product, legal, safety, privacy, or security question.

## Confirm before writing

Present a concise synthesis of:

- selected actor goal and slice boundary;
- detailed-use-case readiness and any initiated handoff;
- prototype purpose and hypotheses;
- included and excluded behavior;
- provisional treatments;
- UX, module, entity, technology, data, and security mapping;
- evidence scenarios, completion and abort criteria;
- assumptions, open questions, decisions, and feedback routes.

Ask the user to confirm or correct the synthesis before material writes unless they explicitly request an immediate provisional draft. Confirmation means the charter reflects current understanding; it does not make the use case or prototype accepted, implemented, evaluated, secure, compliant, or production-ready.

## Create or update the prototype charter

After confirmation, or immediately for an explicitly requested provisional draft:

1. Create or update the authoritative prototype charter at the established repository location.
2. Use the canonical [Prototype / PoC template](../../../docs/governance/templates/prototype.md) while preserving compatible established structure and user-authored content.
3. Keep a new or materially changed charter in `draft` unless the accountable authority explicitly assigns another lifecycle state.
4. Preserve stable hypothesis and scenario identifiers whose meaning remains unchanged.
5. Link directly to the full use-case specification, acceptance examples, UX, architecture, entities, technology, security, test, delivery, decisions, and sources instead of duplicating their authority.
6. Initialize execution-evidence and evaluation sections as planned or not yet evaluated; do not fabricate results.
7. Apply only authorized, meaning-preserving secondary changes. Record material discrepancies as handoffs to the owning workflow.
8. Do not create application code, migrations, infrastructure, test implementations, dependency manifests, or evaluation conclusions unless separately authorized under their corresponding tasks.

## Validate and report

Compare the written charter with the confirmed synthesis and authoritative context. Validate:

- slice-to-use-case and scenario-to-acceptance-example traceability;
- hypothesis-to-evidence coverage;
- alignment with UX, module, entity, technology, consistency, and security boundaries;
- separation of authoritative behavior, provisional prototype treatment, and implementation choice;
- explicit production limitations and approval authority;
- stable identifiers, relative links, lifecycle status, repository structure, and definition-of-done checks.

Run repository validation when available. Report the changed charter and any index update, lifecycle status, selected slice, use-case specification initiated or reused, principal hypotheses and exclusions, readiness conclusion, validation results, handoffs, unresolved questions, and residual limitations. Never present an early charter as implementation-ready or a specified prototype as implemented, evaluated, accepted, secure, compliant, or production-ready.
