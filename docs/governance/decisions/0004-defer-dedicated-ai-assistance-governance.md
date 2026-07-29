# DR-0004: Defer dedicated AI-assistance governance

- Status: accepted
- Date: 2026-07-27
- Deciders: project owner and engineering
- Supersedes: DR-0003 in part

## Context

DR-0003 placed a draft AI-assistance policy in a dedicated Governance subtheme. The project does not currently need a separate authoritative area for this material, and retaining an unclear subtheme would work against the goal of a compact documentation structure.

## Decision

Remove the dedicated `governance/ai-assistance/` area for now. Keep applicable AI-review obligations in the repository instructions, definition of done, and the owning workflow, review, risk, or decision artifact rather than duplicating them in a separate policy.

## Consequences

- Governance navigation is simpler.
- AI-assisted work remains subject to existing validation and evidence requirements.
- A dedicated policy can be introduced later if concrete product, engineering, legal, or operational needs justify it.

## Validation and revisit triggers

Revisit when AI-specific obligations become difficult to locate, inconsistent across artifacts, or insufficient for a concrete risk.

## Links

- [Documentation information architecture](0003-organize-documentation-by-information-theme.md)
- [Definition of done](../workflows/definition-of-done.md)
- [Repository agent instructions](../../../AGENTS.md)
