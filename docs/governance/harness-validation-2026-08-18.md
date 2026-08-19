# Harness Validation Report — 2026-08-18

- Status: accepted
- Owner: Management
- Last reviewed: 2026-08-19

Independent review of the repository harness (root [AGENTS.md](../../AGENTS.md) and everything under `docs/`), performed for issue #17 as the Basic Concept phase-gate, after #13's proof of concept and its evidence ([PoC evidence matrix](../test/poc-evidence-matrix.md), [DR-0016](decisions/0016-poc-technology-confirmation-with-residual-risk.md)) were included in the sampled baseline. This report contains findings and options only. Per #17's scope, no harness, governance, tooling, skill, or product artifact is changed by this review; recommendations require explicit stakeholder decisions before implementation.

## Executive assessment

The harness is coherent and substantially more disciplined than a typical educational project: stable IDs are mechanically enforced, decision records are consistently structured and index-synced, the topic-growth pattern is followed correctly everywhere it's used, and cross-artifact links resolve cleanly across all 186 Markdown files. The PoC sampled in this baseline shows the process producing real, honestly-recorded evidence rather than rubber-stamped completion (DR-0015's own recorded test-defect discoveries, and the #13 evidence matrix's "open" — not fabricated "passed" — entries, are good signs of a working discipline, not merely good documentation).

The material weaknesses cluster in one place: **enforcement stops at the mechanical/structural layer**. `npm run harness:validate` and `architecture:validate` are real and effective for what they check, but nothing runs them automatically — there is no `.github/workflows/` directory, so every check, every test suite, and the Definition of Done itself depend entirely on a human or agent remembering to run them. Two documents that are treated as binding (`definition-of-done.md`, `commit-workflow.md`) are themselves still `Status: proposed`, an authority/status mismatch. And one accepted decision (DR-0008, epic/feature/story hierarchy) has sat `proposed` for three weeks and isn't reflected in the repository's actual GitHub labels.

None of these are severe on their own; together they describe a harness whose rules are well-designed but whose enforcement is currently aspirational in exactly the places — CI, DoD status, backlog hierarchy — that most need to survive contributor turnover or AI-agent handoff without relying on memory.

## Review criteria and sources

- The repository's own stated rules: [AGENTS.md](../../AGENTS.md), [docs/README.md](../README.md) context-hygiene and topic-growth rules, [definition-of-done.md](workflows/definition-of-done.md), [commit-workflow.md](workflows/commit-workflow.md).
- Mechanical ground truth: `npm run harness:validate`, `npm run architecture:validate`, executed read-only during this review (no repository state changed).
- git history as the record of what was actually reviewed/changed and when, compared against each document's own `Last reviewed` claim.
- GitHub's Spec Kit (constitution/spec/plan/tasks, feature-scoped, slash-command-driven) as one deliberately simpler reference point for calibration — general knowledge, not a repository artifact; noted briefly, not adopted as a benchmark of correctness.
- No claim in this report treats generic industry practice as automatically applicable to this project's size and educational purpose; findings are grounded in the repository's own stated rules and evidence.

## Inventory and validation coverage

129 substantive documents across seven lifecycle areas (`governance`, `requirements`, `architecture`, `implementation`, `test`, `operations`, `management`), 10 correctly-grown topics, 16 decision records, six lifecycle-agent charters, four governance standards, and seven canonical templates mirrored 1:1 by `.github/ISSUE_TEMPLATE/*.yml`.

Checks run (read-only, no repository state changed):

| Check | Command | Result |
|---|---|---|
| Harness integrity (links, IDs, topic-growth, DR index, issue templates) | `npm run harness:validate` | Pass — 186 Markdown files, 39 stable IDs, 16 decision records, no errors |
| Architecture/dependency rules | `npm run architecture:validate` | Pass |

What these checks cover: link existence (not anchor-fragment validity within a target file), stable-ID uniqueness/single-authoritative-source/no-placeholder-with-real-ID, topic-growth README declarations, decision-record index sync, issue-template/canonical-template alignment, module presence in diagrams, layer-direction and acyclicity of module dependencies.

What they do not cover, and which therefore rely entirely on human/agent judgment at PR time: Owner/Last-reviewed metadata presence or freshness, prose-level contradiction between documents, business-term consistency with the glossary, proportionality of security/privacy/accessibility treatment, and whether AI-generated content was actually critically reviewed (AGENTS.md rule 11) rather than just claimed to be.

## Findings

### High

**H1 — Documents the harness treats as binding are themselves `proposed`, not `accepted`.**
`docs/governance/workflows/definition-of-done.md` (Status: proposed, last reviewed 2026-07-21) is directly incorporated by AGENTS.md's "Definition of done" section as the binding completion gate for every change, and `commit-workflow.md` (also proposed) governs the change/commit procedure every contributor is expected to follow. Per docs/README.md's own status vocabulary, `proposed` means "coherent and awaiting approval" — not yet authoritative. A reader following the status vocabulary literally would not know whether to actually follow these documents.
*Consequence*: the project's own quality gate has ambiguous authority. *Confidence*: high (directly readable from the files). *Affected artifacts*: AGENTS.md, definition-of-done.md, commit-workflow.md. *Option*: accept both documents (status → `accepted`) now that they have been in continuous practical use since late July, or record explicitly why they remain intentionally provisional.

### Medium

**M1 — No CI automation exists; all checks and tests are manual.**
`.github/` contains only `ISSUE_TEMPLATE/`; there is no `.github/workflows/` directory. `harness:validate`, `architecture:validate`, `diagrams:validate`, and every frontend/backend test suite run only when a human or agent remembers to invoke them locally. DR-0015 already records this limitation for its own e2e/Compose run; this review confirms it is universal, not specific to that one suite. `commit-workflow.md` is honest that checks are "proportionate... where risk warrants it" rather than claiming automation, so no document overclaims — but the DoD's "relevant checks... passed" clause currently has no automated gate behind it anywhere.
*Consequence*: a change that skips a check is discoverable only by another contributor happening to notice, not by the repository itself. *Confidence*: high. *Option*: add a minimal CI workflow running `harness:validate` and `architecture:validate` on every PR — both are fast, deterministic, and already exist; this converts the highest-value, cheapest checks from aspirational to enforced without new tooling.

**M2 — DR-0008 (epic/feature/story backlog hierarchy) has been `proposed` for three weeks and isn't reflected in actual GitHub labels.**
DR-0008 is dated 2026-07-31 and still `proposed`. The repository's actual GitHub labels are `task`, `feature`, `bug`, `documentation`, `question`, `good first issue`, `help wanted`, `duplicate`, `invalid`, `wontfix` — there is no `epic` or `story` label. DR-0007 (accepted) already governs "work with GitHub Issues and a Project board" without this finer hierarchy. Practice (issues #2–#25 all appear to use `task`/`feature` only) has proceeded without waiting for DR-0008.
*Consequence*: a reader following docs/governance/decisions/README.md would expect an epic/feature/story hierarchy that doesn't exist in the tracker. *Confidence*: high (label list is directly checkable). *Option*: either accept DR-0008 and add the missing labels, or supersede/withdraw it as unneeded now that DR-0007's simpler model has proven sufficient in practice — this is itself a good candidate for the "at least one simplification option" this review is required to surface.

**M3 — Grown-topic routing READMEs inconsistently carry Status/Owner/Last-reviewed metadata.**
`entity-model`, `software-architecture`, `domains`, `use-cases`, and `project-management` routing READMEs omit the metadata triad (only prose + the "Topic document" link); `navigation-maps`, `wireframes`, `design-system`, `test-scenarios`, and `deployment-architecture` routing READMEs include it. Neither docs/README.md's context-hygiene rule nor `harness:validate` distinguishes "routing README" from "substantive document," so this is an unenforced, undocumented split.
*Consequence*: no functional harm (the authoritative document beside each README does carry metadata), but it's a small, free-standing inconsistency that erodes the "every substantive document begins with..." rule's clarity. *Confidence*: high. *Option*: either state explicitly that routing READMEs are exempt from the metadata triad (cheapest fix, one sentence in docs/README.md), or add the triad to the five missing READMEs for consistency.

**M4 — Decision records use a different metadata schema than the rest of the harness, undocumented as an exception.**
docs/README.md's context-hygiene rule requires "status, owner, and last-reviewed" on every substantive document; all 16 decision records instead use `Status/Date/Deciders/Supersedes` per their own template, with no Owner or Last-reviewed field. This looks deliberate (DRs are immutable point-in-time records, not living documents — a "last reviewed" field would be misleading) but is never stated as an intentional exception to the general rule.
*Consequence*: minor — a careful reader has to infer the exception rather than read it. *Confidence*: high. *Option*: add one sentence to docs/README.md's context-hygiene section or to decisions/README.md noting DRs intentionally use their own template instead of the general triad.

### Low

**L1 — `harness:validate` link checking stops at file existence; it does not verify anchor fragments resolve within the target file.**
A link like `file.md#some-heading` is confirmed to point at an existing file but not that `## Some Heading` actually exists in it. No broken examples were found in this review's sample, but the class of defect is undetectable by the current tooling.
*Confidence*: high (read directly from `tools/harness/validate.mjs`'s logic, corroborated by the inventory pass). *Option*: low priority given no evidence of actual breakage yet; worth a note for whoever next touches `validate.mjs`, not urgent enough for its own follow-up issue.

**L2 — Several documents' `Last reviewed` date lags their most recent git edit by one day**, e.g. files touched 2026-08-18 while still dated 2026-08-17. This is very likely benign same-day/next-day commit sequencing around the #22/#13/#17 work in this session, not neglect.
*Confidence*: medium (mechanical proxy — any commit touching a file trips it, including pure formatting). *Option*: none needed; noted only so it isn't mistaken for a pattern by a future reviewer re-running the same proxy.

## Strengths worth preserving

- **Mechanical stable-ID enforcement** (`harness:validate`): single-authoritative-source-per-prefix and no-placeholder-with-real-ID checks are exactly the kind of rule that decays silently without tooling, and here it doesn't.
- **Decision-record discipline**: every DR follows the same shape, the index stays in sync (verified, zero mismatches), and DRs are genuinely used to record reversals of direction (DR-0002/0003 deprecated, DR-0009 correcting DR-0006 in part) rather than only forward-looking choices — evidence the harness tolerates recorded mistakes rather than hiding them.
- **Evidence honesty under real pressure**: the sampled #13 PoC evidence and DR-0015 record genuine defects found and fixed (missing CORS middleware, test-locator bugs) and explicitly mark unattempted criteria as `open` rather than inflating them to `passed` — the harness's "no unsubstantiated passed result" rule visibly worked as intended in this review's own trace, not just on paper.
- **Topic-growth pattern**: all 10 grown topics correctly declare their topic document; no directory is missing a README.md.
- **Link discipline**: no broken links across 186 files; technology facts are stated once (DR-0010/DR-0016) and linked from implementation docs rather than restated.

## Simplification option

DR-0008's epic/feature/story hierarchy (M2) is the clearest candidate for removal rather than addition: it adds a third backlog tier that GitHub labels don't currently implement, that DR-0007 doesn't require, and that 24 issues' worth of practice has proceeded without. Superseding DR-0008 with a short record confirming `task`/`feature` (per DR-0007) as sufficient would remove a permanently-proposed, currently-fictional layer of ceremony at zero cost to traceability.

## Skill candidates

Evaluated against the candidate areas named in #17 (requirements changes, use-case synchronization, diagram creation/review, navigation maps, wireframes, design-system work, architecture decisions, deployment architecture, issue lifecycle, documentation validation, release/commit preparation).

| Candidate | Trigger / outcome | Why docs/scripts alone are insufficient | Recommendation |
|---|---|---|---|
| **Commit-readiness skill** (wraps `commit-workflow.md`) | Before committing/opening a PR, run the proportionate subset of `harness:validate`, `architecture:validate`, `diagrams:validate`, and affected build/test scripts, and summarize pass/fail/skipped-with-reason. | `commit-workflow.md` already states *which* checks are proportionate to run, but nothing currently ensures an agent or contributor actually selects and runs the right subset instead of guessing or skipping under time pressure — this is a repeatable, bounded, low-risk orchestration task that reduces a real, observed gap (M1). | **Introduce now** — low cost (wraps existing scripts, no new logic), directly targets M1 without waiting on CI, and is scoped narrowly enough not to duplicate `code-review`/`simplify` (installed skills that review diffs, not run structural validators). |
| **Continuous-spec-alignment skill** (wraps `continuous-spec-alignment.md`) | On a requirements or architecture change, walk declared cross-references (glossary, use cases, decisions, tests) and flag artifacts likely needing a matching update. | The workflow document already describes the propagation responsibility; the missing piece is discovery (which artifacts reference the changed one) — `harness:validate` checks link *existence*, not *staleness triggered by an upstream change*. | **Defer** — real value, but higher design cost (needs a reliable "what references this ID" traversal, which risks false positives/negatives that erode trust if wrong); revisit once the repository has enough post-PoC change volume to justify it. |
| **Diagram creation/review skill** | Author or update a `.puml`/`.mmd`/`.bpmn`/`.dsl` source and get it linted/rendered/version-checked in one step. | Largely redundant with existing `diagrams:doctor`/`diagrams:validate`/`diagrams:render` npm scripts, which already do exactly this — a skill would mostly restate documentation (explicitly excluded by #17's scope). | **Reject** — existing scripts are the right mechanism; no orchestration gap found. |
| **Issue-lifecycle skill** (epic/feature/story or task creation, phase-gate sequencing) | Create a correctly-templated, correctly-labeled, correctly-blocked GitHub issue. | Canonical templates and `.github/ISSUE_TEMPLATE/*.yml` already exist and are kept in sync by `harness:validate`; the labels a skill would need to apply (epic/story) don't currently exist (M2) — building this now would encode a decision (DR-0008) that isn't settled. | **Reject for now** — revisit only if DR-0008 is accepted and the label taxonomy actually exists. |
| **Documentation-validation skill** | Run `harness:validate` with friendlier diagnostics or auto-fix suggestions. | `harness:validate` already exists, is fast, and its output is already clear (file:line-style errors); a skill wrapping a single existing command with no added judgment would mostly restate documentation. | **Reject** — no orchestration or judgment gap; `npm run harness:validate` is already the right mechanism. |
| **Use-case/navigation-map/wireframe/design-system skills** | Author or update UX artifacts per their respective workflow docs. | Each already has a dedicated workflow document and standard notation; no evidence in this review that contributors are getting these wrong or that selective context-loading across multiple documents is currently a bottleneck. | **Reject for now** — no observed recurring error this review found; revisit if repeated review findings show otherwise. |

Only the commit-readiness skill clears the bar of "guided orchestration or repeatable tool use materially reduces error or effort" beyond what documentation already provides, and it does so by directly targeting a finding (M1) rather than restating a workflow document.

## GitHub Spec Kit comparison (calibration only)

Spec Kit's constitution → spec → plan → tasks sequence is feature-scoped and slash-command-driven, expecting a single durable constitution to gate each feature's later stages. This repository's requirements → architecture → decisions → test structure is broader: it spans the whole lifecycle (including operations, management, and independent test ownership) rather than one feature at a time, and it uses an open-ended, numbered decision-record ledger instead of one constitution document. Spec Kit does not natively provide this repository's stable-ID/glossary traceability or DR ledger; this repository does not have Spec Kit's lightweight, single-command feature-scaffolding flow. Neither structure is a strict subset of the other — Spec Kit is simpler because it is narrower in scope, not because this repository is over-built for the scope it actually covers. No adoption is recommended; this is calibration only, as scoped.

## Prioritized options for stakeholder discussion

1. **Accept `definition-of-done.md` and `commit-workflow.md`** (resolves H1) — low cost, both have been followed in practice since late July.
2. **Add a minimal CI workflow** running `harness:validate` and `architecture:validate` on PRs (resolves M1's highest-value gap) — low cost, both checks are already fast and deterministic; does not require adding frontend/backend test execution to CI in the same step.
3. **Resolve DR-0008**: either accept it and add `epic`/`story` labels, or supersede it with a short record confirming DR-0007's simpler `task`/`feature` model (resolves M2, and is this review's required simplification option).
4. **State the routing-README metadata exception and the DR metadata-schema exception explicitly** (resolves M3, M4) — trivial one-sentence edits to docs/README.md and decisions/README.md.
5. **Introduce the commit-readiness skill** (targets M1 from the contributor side, complements option 2 rather than replacing it).

## Checks run, limitations, and unresolved questions

**Checks run**: `npm run harness:validate`, `npm run architecture:validate` (both read-only, both passed). Frontend/backend build/test suites were not re-executed in this review (out of scope for a harness-focused audit; #13's evidence matrix already records their local-only status as a separate finding).

**Limitations**: staleness findings (L2, part of the Last-reviewed cross-check) use git-modification date as a mechanical proxy for "reviewed," which produces false positives for purely cosmetic edits — flagged as low-confidence throughout. Anchor-fragment link validity (L1) was checked only by sampling, not exhaustively, since `harness:validate` doesn't cover it. This review did not independently re-verify DR-0015's cited test counts (239 backend / 32 frontend tests), consistent with the same limitation already recorded in the #13 evidence matrix.

**Open questions carried into the stakeholder discussion**:
- Which cadence, if any, should a future harness review follow — recurring, or trigger-based only (e.g., before each phase gate)? This review takes no position; #17 explicitly leaves it open.
- Should this report's permanent home be a new `docs/governance/reviews/` area, or should single dated review files (as this one is) remain the pattern until volume justifies growing a directory? This review deliberately did not create a new permanent area, consistent with AGENTS.md's instruction not to introduce structure ahead of need; the stakeholder should confirm or override that choice.

## Stakeholder discussion agenda and decision table

| # | Item | Recommendation | Decision | Owner |
|---|---|---|---|---|
| 1 | Accept definition-of-done.md and commit-workflow.md | Accept | Accepted 2026-08-19 | Management |
| 2 | Add minimal CI (harness:validate + architecture:validate on PR) | Adopt | Adopted 2026-08-19 — [.github/workflows/harness-validate.yml](../../.github/workflows/harness-validate.yml) | Implementation/Architecture |
| 3 | DR-0008 epic/feature/story hierarchy | Supersede with simplification record (or accept + add labels) | Accepted 2026-08-19 — DR-0008 status set to accepted; `epic` and `story` GitHub labels added | Management |
| 4 | Document routing-README and DR metadata exceptions | Adopt (trivial edit) | Adopted 2026-08-19 — one sentence each in `docs/README.md` and `docs/governance/decisions/README.md` | Management |
| 5 | Commit-readiness skill | Introduce | Introduced 2026-08-19 — [.claude/skills/commit-readiness/SKILL.md](../../.claude/skills/commit-readiness/SKILL.md) | Implementation |
| 6 | Continuous-spec-alignment skill | Defer | Deferred | — |
| 7 | Diagram/documentation-validation/issue-lifecycle/UX skills | Reject (for now) | Rejected (for now) | — |
| 8 | Review report's permanent location and cadence | Open question — no recommendation | _pending_ | Management |

This issue's stakeholder discussion resolved items 1–5 on 2026-08-19 as recorded above. Item 8 remains open; item 6 stays deferred and item 7 stays rejected pending future evidence, consistent with the original recommendations. Implementation of the decided items (status changes, CI workflow, GitHub labels, documentation edits, and the commit-readiness skill) was carried out as part of recording these outcomes.

## Links

- Issue #17 (Validate the lifecycle harness) and issue #13 (Implement proof of concept) in the repository's GitHub issue tracker
- [AGENTS.md](../../AGENTS.md), [docs/README.md](../README.md)
- [PoC evidence matrix](../test/poc-evidence-matrix.md), [DR-0016](decisions/0016-poc-technology-confirmation-with-residual-risk.md)
- [definition-of-done.md](workflows/definition-of-done.md), [commit-workflow.md](workflows/commit-workflow.md), [workflows/README.md](workflows/README.md)
- [DR-0008](decisions/0008-adopt-epic-feature-story-backlog-hierarchy.md), [DR-0007](decisions/0007-govern-work-with-github-issues-and-project.md)
