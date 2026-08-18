# DR-0016: Confirm the DR-0010 technology profile with explicit residual risk

- Status: accepted
- Date: 2026-08-18
- Deciders: project owner and architecture
- Supersedes: none

## Context

DR-0010 selected React Router v7/Vite/Mantine, Python/FastAPI/Pydantic, and Neo4j Community Edition conditionally: each selection stated it "remains selected only if" or "if the proof of concept reveals no showstopper." Issue #13 required the PoC to close that condition with a documented technology confirmation or an explicit revisit, backed by an evidence matrix containing no unsubstantiated `passed` result.

The [PoC evidence matrix](../../test/poc-evidence-matrix.md) records that criterion-by-criterion. The thin-slice journey, module/architecture boundaries, the OpenAPI/Pydantic contract layer, seeded-data inspection, i18n structural readiness, and the Staff-grid decision (DS-Q-003) are evidenced. A concentrated set of criteria that DR-0010 itself named as validation scope and revisit triggers were not exercised at all: the controlled agent-tool boundary, Neo4j transactional stock reservation and rollback under concurrency, Neo4j backup/restore/upgrade/observability/least-privilege evidence, and NFR-001/NFR-002 performance measurement. None of these failed — none was attempted — so DR-0010's showstopper conditions ("cannot be demonstrated") are not triggered, but they are also not discharged.

## Decision drivers

- #13's acceptance evidence forbids an unsubstantiated `passed` result; it does not require every criterion to be closed before a confirmation can be recorded, provided residual risk is explicit.
- Continuing to hold the whole technology profile "conditional" indefinitely blocks the phase-gate review (#17) and downstream MVP work (#23) without new information being produced.
- The untested items are concentrated exactly where DR-0010 already flagged the highest uncertainty (Neo4j Community Edition's operational ceiling; an agent-facing tool boundary that does not yet exist in any form), so silently treating them as passed would misstate risk to later work.

## Considered options

- **Reopen DR-0010 entirely and evaluate alternatives now.** Rejected: no criterion has actually failed; reopening on the basis of untested (not failed) criteria would discard a working, evidenced thin slice without new information.
- **Confirm DR-0010 unconditionally.** Rejected: would assert `passed` for agent-tooling, concurrency/rollback, backup/restore, and NFR-001/NFR-002 criteria that were never exercised, violating #13's evidence-matrix rule.
- **Confirm DR-0010 conditionally, carrying the untested criteria forward as explicit residual risk with named follow-up work and DR-0010's original revisit triggers left active for exactly those items.** Accepted.

## Decision

Confirm the DR-0010 technology profile — React Router v7/Vite/Mantine, Python/FastAPI/Pydantic, Neo4j Community Edition, and the modular-monolith structure — for continued use in iterative delivery (#23 and later), on the following basis:

1. No PoC criterion was exercised and found to fail. No showstopper condition in DR-0010 is triggered.
2. The following criteria remain **open**, are **not** treated as passed, and stay tracked as residual risk against the same DR-0010 revisit triggers until closed by follow-up work:
   - a controlled agent-facing tool boundary (product search/availability) with no unrestricted database credentials;
   - Neo4j transactional Stock Item reservation under concurrent attempts, with no overbooking, and rollback of failed order/reservation;
   - Neo4j backup, restore, upgrade feasibility, observability, and least-privilege operation on Community Edition;
   - NFR-001/NFR-002 measurement under a documented representative load;
   - NFR-003 licence inventory for the frontend stack;
   - responsive-breakpoint (PC/tablet/mobile) test evidence;
   - CI automation of any existing test suite (unit, architecture, Vitest, Playwright e2e).
3. Because the agent-tool boundary and the concurrency/rollback behaviour are core to why Neo4j and the Python-centred stack were chosen at all (DR-0010's decision drivers), this confirmation is explicitly conditional on that follow-up work being scheduled, not indefinitely deferred. It is not a closed, unconditional re-acceptance of DR-0010.

## Consequences

### Positive

- Iterative delivery is not blocked on validation work with no evidenced risk of failure.
- Residual risk is named and owned rather than silently absorbed into "PoC complete."
- DR-0010's original revisit triggers remain active for exactly the untested items, so a future failure there still reopens the technology decision rather than requiring a new decision record to notice it.

### Negative and risks

- The technology profile is now in production-track use (#23 onward) while its highest-uncertainty items (Neo4j Community Edition operational ceiling, concurrent transaction behaviour, agent-tool boundary) remain unvalidated. If any later proves infeasible, rework may touch code already built on top of it.
- No committed timeline exists yet for closing the open items; without one, "explicit residual risk" can drift into de facto permanent deferral, which would defeat the purpose of this record.

## Validation and revisit triggers

Unchanged from DR-0010 for the open items above: a required paid-edition capability, inability to safely achieve backup/recovery/availability/access-control/audit on Community Edition, inability to demonstrate correct concurrent stock allocation or order transactions, missed performance targets, or an unenforceable module/agent boundary all still reopen the selection.

Follow-up implementation issues for the open items in this record shall be created and scoped separately, per #17's phase-gate process; this record does not authorize that implementation itself.

## Links

- [PoC evidence matrix](../../test/poc-evidence-matrix.md)
- [DR-0010: Python-centred modular technology stack](0010-adopt-python-centered-modular-technology-stack.md)
- [DR-0013](0013-shared-resource-crud-api-and-openapi-contract.md), [DR-0014](0014-deterministic-seed-data-and-compose-seeding.md), [DR-0015](0015-frontend-thin-slice-testing-i18n-and-catalog-listing.md)
- Issue #13 (Implement proof of concept) and issue #17 (Validate the lifecycle harness) in the repository's GitHub issue tracker
