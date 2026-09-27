---
name: implement-prototype
description: Assess implementation readiness and autonomously realize a reviewed prototype or proof-of-concept slice as executable code, migrations, tests, configuration, local delivery, and raw verification evidence, asking the user only for material missing decisions. Use after a prototype charter defines a bounded slice and evaluation criteria; do not use it to select the slice, redefine authoritative requirements or architecture, evaluate hypotheses, approve the result, or claim production readiness.
---

# Implement Prototype

Realize one reviewed prototype or proof-of-concept charter as a bounded executable vertical slice. Begin with a short readiness check. Resolve ordinary, reversible implementation details autonomously; ask the user only when missing authority or a material choice would change behavior, scope, architecture, security, privacy, or the meaning of the intended evidence. Once ready, implement and verify the complete slice without requiring step-by-step orchestration.

The user's instructions take precedence. Authorization to implement the prototype permits the repository-local code, tests, migrations, configuration, and delivery work needed by the declared slice. It does not authorize a broader product implementation, global tool upgrades, production data or credentials, external deployment, changes to authoritative requirements, prototype evaluation, approval, or unrelated repository edits.

## Preserve artifact authority

- The prototype charter owns the selected slice, hypotheses, included and excluded behavior, provisional treatments, security restrictions, evidence scenarios, and completion or abort criteria.
- Requirements and use-case artifacts own product behavior, business rules, guarantees, and acceptance examples. UX artifacts own interaction intent and experience guidance.
- Software Architecture owns module responsibilities, dependency rules, contracts, consistency boundaries, and distribution strategy. The Logical Entity Model owns technology-neutral entity meaning and module ownership.
- Technology and Security Architecture own accepted mechanisms, usage boundaries, control objectives, and prototype restrictions.
- Implementation owns source layout, packages, APIs, persistence mappings, physical schemas, migrations, exact dependencies, executable configuration, and other realization details that remain within those constraints.
- Test and delivery artifacts own executable checks and raw run evidence. Prototype evaluation owns conclusions about hypotheses. Accountable authority owns approval.

Do not alter an owning specification merely to make the implementation pass. Record a precise handoff when code or tests expose a material gap or contradiction.

## Load the authoritative context

Before changing code:

1. Read every applicable `AGENTS.md`, the repository context map, lifecycle workflow, implementation guidance, continuous-alignment guidance, and definition of done.
2. Read the current prototype charter, especially the selected slice, hypotheses, scope, provisional treatments, evidence scenarios, security profile, completion criteria, abort criteria, and implementation handoff.
3. Read the linked detailed use-case specification, acceptance examples, business rules, glossary entries, actor definitions, relevant UX artifacts, constraints, exclusions, and decisions.
4. Read the relevant Software Architecture, Logical Entity Model, Technology, Security and Privacy Architecture, test guidance, CI/CD and local-execution guidance, and operational constraints.
5. Inspect the current repository structure, code, migrations, tests, dependency manifests, tool wrappers, runtime versions, configuration examples, and available local services before proposing additions.
6. Check the lifecycle status and authority of material inputs. A draft charter may support implementation only when its uncertainty is explicit and the requested experiment remains safe and meaningful.

Work from the current repository state. Preserve user-authored and unrelated changes, and do not assume an earlier implementation attempt still matches the current charter.

## Select the operating mode

- **Initial implementation:** create the first executable realization of the reviewed slice.
- **Continuation:** resume an incomplete implementation after rechecking the charter, code, evidence, and unresolved findings.
- **Correction:** repair a divergence or defect while preserving the agreed slice and authoritative behavior.
- **Readiness assessment:** determine whether autonomous implementation can begin, without changing code unless the user also authorizes implementation.
- **Evidence completion:** add missing tests, repeatable execution, or raw evidence for an already implemented slice without performing evaluation.

State the prototype, slice, mode, repository areas, environment, and evidence scenarios in scope. Do not infer implementation scope from existing code, a screen, database contents, or a branch name.

## Gate implementation readiness

Check that:

- the actor goal and slice boundary are stable enough to identify the start, observable outcome, and deliberately omitted behavior;
- relevant normal, alternative, error, denied, boundary, and recovery behavior is defined proportionately;
- each hypothesis has feasible evidence and the ready-for-evaluation criteria are testable;
- provisional, mocked, fixture-driven, real, and deferred treatments are distinguishable;
- required UX states, module responsibilities, logical entities, technology mechanisms, data constraints, and security restrictions are known;
- the local build, runtime, persistence, and review path is available or can be created within repository-local authority;
- no abort criterion, contradictory authority, unsafe data need, unavailable dependency, or unresolved central behavior makes implementation misleading.

Classify every gap before deciding whether to ask:

- **Authoritative fact available:** follow it.
- **Ordinary reversible implementation choice:** choose autonomously, keep it simple, and make it visible in code, tests, or implementation notes as appropriate.
- **Authorized prototype treatment:** implement it exactly as provisional and keep its limitation visible.
- **Non-blocking uncertainty:** continue only when a safe, replaceable treatment preserves the intended evidence; record the assumption and reconsideration trigger.
- **Material missing decision:** ask the user when the answer would change product behavior, slice scope, module or consistency boundaries, data meaning, identity or authorization, security or privacy exposure, a consequential technology choice, or whether a hypothesis can be evaluated.

Ask the smallest useful set of focused questions and explain which implementation or evidence decision each answer controls. Group closely related questions where practical. Do not ask the user to choose package names, endpoint shapes, table names, minor library configuration, or other ordinary realization details unless they are themselves accepted constraints or hypotheses.

After receiving the necessary answers, reload affected artifacts and proceed autonomously. If a required answer belongs in another authoritative artifact, record or initiate the corresponding handoff rather than treating the conversation alone as permanent specification.

## Plan the vertical slice

Before editing, map every included evidence scenario to the minimum implementation work needed across applicable boundaries:

- actor-facing interaction and feedback;
- application orchestration and module entry points;
- domain behavior and business-rule enforcement;
- module collaboration through the accepted dependency direction and contracts;
- persistence, migration, and transaction behavior;
- identity, authorization, validation, safe error handling, and logging;
- unit, integration, architecture, security, browser, and delivery checks;
- reproducible local build, startup, data setup, and review.

Prefer the smallest coherent implementation that can falsify the declared hypotheses. Do not reduce the slice so far that it bypasses a boundary or behavior the charter intends to test, and do not add adjacent capabilities merely because they are convenient.

## Implement autonomously

Implement the reviewed slice end to end, applying these constraints:

- Preserve module ownership and dependency rules. A direct in-process call is acceptable when the Software Architecture permits it; do not invent remote boundaries or unnecessary abstraction.
- Derive the minimum physical data model from the logical entities and exercised behavior. Add forward, reviewable migrations and required content migration; do not rewrite already applied migration history merely to make the current database convenient.
- Keep prototype-only fixtures, stubs, reduced controls, and adapters visibly provisional and replaceable. Do not encode an unresolved business assumption as if it were an accepted rule.
- Implement positive and denied behavior required by the security profile. Use synthetic data, safe errors, non-secret configuration examples, and the declared network and integration boundaries.
- Add tests with the behavior, not as an afterthought. Cover the evidence scenarios and guarantees at the narrowest reliable level, with integration or browser coverage where boundary behavior matters.
- Keep source code and repository artifacts in the repository language and follow existing formatting, structure, conventions, and established tool wrappers.
- Make incremental, scoped changes and inspect overlapping user work before editing it.

Do not silently weaken a test, acceptance example, security control, module rule, or completion criterion to obtain a passing result.

## Protect the local environment

Inspect existing runtimes, containers, package managers, wrappers, lockfiles, and compatible installed versions before adding anything. Prefer repository-scoped dependencies, project wrappers, containers, and pinned toolchains.

- Do not globally install, remove, or upgrade Java, Node.js, databases, package managers, frameworks, or other shared tools merely for this prototype.
- Do not replace a compatible existing version without evidence that the selected Technology baseline requires a different one.
- Keep new services isolated through repository configuration, explicit ports, named volumes, and synthetic data.
- Ask before an external deployment, account change, shared-service mutation, destructive database operation, or any action outside the authorized local/repository scope.

An autonomous run may execute normal repository-local builds, tests, migrations, and local services needed by the charter. Autonomy does not expand environmental or external authority.

## Verify and capture raw evidence

Run the checks required by the charter and affected definition of done. Depending on scope, establish evidence for:

- clean dependency resolution and build;
- unit, integration, architecture, migration, security, and browser tests;
- fresh-database migration and, where relevant, upgrade or content-migration behavior;
- startup, health, configuration, and reproducible local execution;
- expected UI states, accessibility checks, validation, feedback, and recovery;
- normal, alternative, error, denied, boundary, and recovery scenarios;
- module dependency and persistence boundaries;
- safe data, secret, logging, and network treatment;
- CI/CD or equivalent repeatable delivery execution available for the prototype.

Record exact commands, environment conditions, relevant versions, results, timestamps when useful, and links to durable reports or source locations. Distinguish current verified evidence from expected, skipped, unavailable, stale, or manually observed evidence. Never fabricate execution or report a check as passing because the code appears plausible.

## Handle findings and stopping conditions

Fix implementation defects within the reviewed charter autonomously and rerun affected checks. Route other findings according to ownership:

- unclear or contradictory behavior to the use case or requirement owner;
- interaction defects or missing states to the relevant UX artifact;
- module, contract, consistency, or distribution problems to Software Architecture;
- entity meaning or ownership problems to the Logical Entity Model;
- unsuitable mechanisms or compatibility problems to Technology;
- threat, identity, authorization, privacy, or control gaps to Security Architecture;
- infeasible hypotheses, misleading scope, or invalid provisional treatments to `specify-prototype`;
- delivery-path defects to CI/CD or operational ownership.

Stop and request direction when an abort criterion is met, safe progress requires new authority, the requested evidence cannot test the hypothesis, or continuing would embed a material unresolved decision. Do not treat repeated technical difficulty alone as authority to broaden or redefine the slice.

## Update the evidence index

After verification:

1. Update the current prototype charter's planned-evidence and implementation-handoff entries with direct links and accurate statuses.
2. Record implementation limitations, deviations, assumptions, skipped checks, and cross-artifact handoffs where the charter provides for them.
3. Add or update consequential decision records only when the choice is within implementation authority and meets the repository's decision threshold.
4. Keep raw logs and generated reports in their owning locations; link rather than duplicate them into the charter.
5. Leave the evaluation record unevaluated. Do not mark hypotheses supported or rejected, issue an approval recommendation, or change accountable approval state.
6. Preserve stable hypothesis and scenario identifiers and the charter's lifecycle semantics.

## Validate and report

Before concluding, compare the executable result with the current charter and authoritative inputs. Run repository validation and all proportionate implementation checks. Confirm that the slice is reproducible from documented repository state and that another evaluator can locate the executable result and evidence.

Report:

- what part of the slice was implemented and what remains deliberately excluded;
- code, migrations, tests, configuration, and delivery paths changed;
- exact checks run and their results;
- evidence now available for each relevant scenario or completion criterion;
- autonomous implementation choices and provisional treatments that remain non-authoritative;
- deviations, failed or skipped checks, residual risks, and targeted handoffs;
- whether the prototype is ready for `evaluate-prototype` or why it is not.

Never describe a completed implementation as an evaluated, accepted, secure, compliant, production-ready, or release-ready product.
