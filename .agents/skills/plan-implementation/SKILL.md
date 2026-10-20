---
name: plan-implementation
description: Create, refine, correct, or align an executable implementation plan for one reviewed Prototype Charter or Slice Manifest by translating fixed scope and accepted technical constraints into ordered test, code, migration, configuration, and evidence increments. Use after specification and the applicable Technical Foundation are ready; do not redefine requirements or architecture, write tests or product code, operate CI/CD, perform review, estimate without an accepted basis, or plan multiple unrelated scopes together.
---

# Plan Implementation

Produce one implementation plan that both Prototype and ordinary Slice delivery can execute. The plan decides sequence and ordinary realization details within fixed authoritative boundaries. It does not become a substitute for those boundaries.

Authorization to plan permits read-only repository inspection and writing the plan and meaning-preserving evidence links. It does not authorize source, test, migration, pipeline, or environment changes.

## Preserve authority

- A reviewed Prototype Charter or Slice Manifest owns the delivery scope, fixed behavior, constraints, claims, and evidence obligations.
- Architecture, entities, technology, security, deployment, test strategy, and CI/CD own their respective boundaries.
- The Technical Foundation record and executable repository state establish available mechanisms.
- The Implementation Plan owns ordered increments, verified realization areas, ordinary internal choices, dependencies, and planned evidence.
- `create-tests`, `create-code`, and `operate-ci-cd` own execution and raw results. The applicable `review-*` skill owns review conclusions.

When a choice would change an accepted boundary or affect multiple future scopes, route it to the owning artifact or a Decision Record instead of hiding it in the plan.

## Load only the working set

Read repository instructions, documentation routing, workflow, Definition of Done, the canonical Implementation Plan template, the complete governing Charter or Manifest, and the current plan when one exists. Follow its input-routing or authoritative-anchor links only as needed for the named boundary.

Inspect the current Technical Foundation and relevant source paths before naming files or commands. Load prior implementation or review evidence only for continuation, correction, or alignment. A bibliography is not a request to read the entire repository.

## Select the operating mode

- **Initial:** create the first plan for one reviewed scope.
- **Continuation:** resume named ready or incomplete increments using recorded state.
- **Correction:** revise increments after a verified planning or implementation finding.
- **Alignment:** reconcile the plan with an accepted change in scope, baseline, or Technical Foundation.

On repeated invocation, update the existing plan for the scope. Preserve stable increment and decision identifiers while their meaning continues; mark replaced content superseded rather than creating a competing plan.

## Establish planning readiness

Confirm:

- exactly one governing Prototype Charter or Slice Manifest is identified and reviewed for planning;
- fixed versus ordinary implementation choices are explicit;
- relevant Technical Foundation mechanisms are usable or named gaps are accepted;
- the current repository state and affected realization areas can be inspected;
- behavior, UX, architecture, entity, technology, security, environment, test, and delivery sources do not materially contradict one another;
- each required result has a feasible evidence destination.

If safe execution would require inventing a requirement, architecture boundary, technology selection, security rule, test policy, or CI/CD mechanism, mark the exact blocker and hand it to the owner.

## Build an executable sequence

Decompose the scope into the smallest independently checkable `IP-INC-NNN` increments. For every increment state:

1. the observable outcome and fixed source anchors;
2. verified affected components or files, without guessing nonexistent paths;
3. unit- and integration-test responsibilities to create first;
4. bounded product code, migration, configuration, or fixture work;
5. accepted commands, observations, and evidence destinations;
6. prerequisites, rollback or reset needs, and stop conditions.

Order increments to expose risk early while preserving a diagnosable repository. Include data compatibility, failure and denied paths, configuration, and operational visibility when the scope requires them. Do not prescribe broad refactors or speculative abstractions unrelated to the scope.

A concise generic commerce example is acceptable when it clarifies the format: an `IP-INC` for placing an order may first add unit tests for total calculation, then an integration test for persistence, then the minimum application and migration changes, followed by the named local verification gate. The example never supplies missing business rules.

## Map evidence and decisions

Map every in-scope hypothesis, acceptance claim, scenario, or completion criterion to planned unit, integration, CI/CD, inspection, demonstration, or human-review evidence. Avoid duplicate coverage unless risk justifies it.

Record ordinary choices as `IP-DEC-NNN` entries with rationale, alternatives, preserved constraints, and reconsideration triggers. Distinguish observed repository facts, accepted decisions, proposals, and assumptions.

## Write and review the plan

Use `docs/implementation/prototype-implementation-plan.md` for a Prototype by default. Use `docs/implementation/slices/SL-NNN-<slug>-implementation-plan.md` for a Slice unless the repository establishes another collection. Follow the topic-growth rules and preserve compatible user-authored structure.

Before marking a plan ready, present or record a concise synthesis of scope, sequence, high-risk increments, choices, evidence mapping, and blockers. A ready plan must tell `create-tests` where to start without deciding missing authoritative behavior.

## Validate and report

Check scope traceability, increment dependency order, test-before-code responsibilities, migration and reset safety, Technical Foundation compatibility, evidence coverage, stable identifiers, direct links, repository validation, and unresolved authority gaps.

Report the mode, plan location and status, ready increments, ordinary decisions, blockers and owners, affected realization areas, evidence path, and exact next handoff. Do not claim that planned work is implemented, tested, accepted, or production-ready.
