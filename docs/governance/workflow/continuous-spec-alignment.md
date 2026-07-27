# Continuous Specification Alignment

- Status: proposed
- Owner: Engineering
- Last reviewed: 2026-07-21

Continuous Spec Alignment keeps stakeholder intent, requirements, models, decisions, acceptance examples, tests, and implementation mutually consistent throughout delivery.

Artifact authority, status transitions, and product-definition slices are defined in [Artifact Authority and Lifecycle](artifact-lifecycle.md).

## Alignment loop

1. Detect a change in intent, evidence, behavior, or constraints.
2. Identify affected artifacts through stable IDs and links.
3. Update authoritative sources and derived artifacts in one change where practical.
4. Validate structural integrity (links, IDs, schemas) and semantic consistency (terms, rules, examples, behavior).
5. Obtain independent review proportional to impact.
6. Record unresolved divergence explicitly with an owner and due condition.

## Initial checks

- No duplicate or orphaned stable IDs.
- Relative links resolve.
- Accepted requirements have acceptance evidence.
- Business terms have one authoritative definition per bounded context.
- ADR status and supersession links agree.
- Changed behavior has corresponding specification and test changes, or a recorded rationale.

Automate these checks incrementally after document formats stabilize. Automation supports judgment; it cannot decide whether stakeholder intent and system behavior are semantically aligned.

Run the current structural checks with:

```powershell
npm run harness:validate
```
