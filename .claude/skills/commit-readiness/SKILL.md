---
name: commit-readiness
description: Before committing or opening a PR in this repository, determine and run the proportionate subset of harness:validate, architecture:validate, diagrams:validate, and affected frontend/backend build or test scripts per commit-workflow.md, then report a pass/fail/skipped-with-reason summary. Use whenever the user asks to commit, prepare a PR, or check whether a change is ready to commit.
---

# Commit readiness

Wraps [commit-workflow.md](../../../docs/governance/workflows/commit-workflow.md) step 4 ("run proportionate checks") and the [definition of done](../../../docs/governance/workflows/definition-of-done.md)'s check-passing criterion. It does not replace human/agent judgment about scope, review, or evidence — it only ensures the right mechanical checks actually run before a commit is proposed.

## Procedure

1. Inspect the pending change (`git status`, `git diff`) to determine what changed: documentation under `docs/` or `AGENTS.md`, architecture diagrams under `docs/architecture/software-architecture/`, other diagram sources, frontend code, backend code, or the generated API client.
2. Select the proportionate check set — do not run everything unconditionally:
   - Any Markdown or stable-ID change anywhere in the repo → `npm run harness:validate`.
   - Any change under `docs/architecture/software-architecture/` (modules, `.puml` sequences, `.drawio`) → `npm run architecture:validate`.
   - Any change to `.puml`/`.mmd`/`.bpmn`/`.dsl` diagram sources elsewhere → `npm run diagrams:validate`.
   - Any change under `frontend/` → `npm run frontend:typecheck` and `npm run frontend:test` for the affected workspace(s).
   - Any change under `backend/` → `npm run backend:check`.
   - Any change to the OpenAPI contract or generated client → `npm run api-client:validate`.
3. Run the selected commands. Do not claim a check passed without running it (per `commit-workflow.md`: "Do not claim tests or reviews that did not run").
4. Report a short table: check, ran/skipped, result. For each skipped check, state why it does not apply. For each failure, stop and surface it — do not propose the commit until it is fixed or the residual risk is explicitly recorded.
5. Only after all proportionate checks pass (or their skip is justified) proceed with staging and committing per `commit-workflow.md`.
