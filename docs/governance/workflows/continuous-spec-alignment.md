# Continuous Specification Alignment

- Status: proposed
- Owner: Management
- Last reviewed: 2026-08-05

Continuous Specification Alignment keeps stakeholder intent, requirements, architecture, decisions, acceptance examples, tests, implementation, and operations mutually consistent throughout delivery.

Artifact authority, status transitions, and requirements slices are defined in [Artifact Authority and Lifecycle](artifact-lifecycle.md).

## Alignment loop

1. Detect a change in intent, evidence, behavior, or constraints.
2. Identify affected artifacts through stable IDs and links.
3. Update authoritative sources and derived artifacts in one change where practical.
4. Validate structural integrity (links, IDs, schemas) and semantic consistency (terms, rules, examples, behavior).
5. Obtain independent review proportional to impact.
6. Record unresolved divergence explicitly with an owner and due condition.

For a cross-layer feature, “affected artifacts” includes every layer that owns
part of the observable behavior. In particular, when a capability crosses the
HTTP boundary, inspect and update both the backend architecture and frontend
architecture documents. This applies even when one side is only a client-side
state owner or presentation boundary. For agent features, explicitly trace
the model/workflow, API contract, client state/action handling, user review
surface, and final user-authorized mutation path.

## Initial checks

- No duplicate or orphaned stable IDs.
- Relative links resolve.
- Accepted requirements have acceptance evidence.
- Business terms have one authoritative definition in their applicable domain or module context.
- Decision-record status, identity, index, and supersession links agree.
- Changed behavior has corresponding specification and test changes, or a recorded rationale.
- Cross-layer behavior has a frontend/backend ownership check; neither
  architecture document is omitted merely because the other layer contains
  the primary business logic.

Automate these checks incrementally after document formats stabilize. Automation supports judgment; it cannot decide whether stakeholder intent and system behavior are semantically aligned.

Run the current structural checks with:

```powershell
npm run harness:validate
```
