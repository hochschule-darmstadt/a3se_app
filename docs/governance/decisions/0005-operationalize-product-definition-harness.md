# ADR-0005: Operationalize the product-definition harness

- Status: accepted
- Date: 2026-07-27
- Deciders: project owner and engineering
- Supersedes: none

## Context

The repository had clear artifact locations, stable-ID namespaces, role charters, and completion principles, but agents still needed human interpretation to determine artifact authority, promotion, coherent product-definition scope, and structural validity.

## Decision

Before product definition begins:

- define artifact authority, statement types, lifecycle transitions, product-definition slices, and change propagation in one workflow artifact;
- provide an operational Product Definition Playbook for the current phase;
- reserve stable identifiers only for real artifacts rather than placeholder rows;
- align artifact owners with the accepted five-role operating model;
- validate relative links, stable IDs, placeholder misuse, and ADR index consistency with `npm run harness:validate`.

Automate objective integrity rules while retaining product meaning, evidence sufficiency, and semantic consistency as accountable human and specialist judgments. Defer other role playbooks and technology-specific checks until their lifecycle phases require them.

## Consequences

### Positive

- Product-definition work has a repeatable entry point, output model, review gate, and handoff.
- Specification authority is separated explicitly from delivery planning.
- Structural defects can be detected before they spread through generated artifacts.
- The harness remains small and phase-appropriate.

### Negative and risks

- The lifecycle introduces additional governance that must remain concise.
- The validator depends on current Markdown table conventions and must evolve deliberately when formats change.
- Automated success does not establish semantic correctness.

## Validation and revisit triggers

Run `npm run harness:validate` for documentation changes. Revisit when new artifact types, ID namespaces, status transitions, or delivery and implementation formats are introduced.

## Links

- [Artifact Authority and Lifecycle](../workflow/artifact-lifecycle.md)
- [Product Definition Playbook](../agents/product-definition-playbook.md)
- [Continuous Specification Alignment](../workflow/continuous-spec-alignment.md)
- [Definition of Done](../workflow/definition-of-done.md)
