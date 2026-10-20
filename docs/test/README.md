# Test

- Status: proposed
- Owner: Test
- Last reviewed: 2026-10-20

This area defines independent test design and evidence across the lifecycle. Testing challenges ambiguity, edge cases, abuse cases, quality outcomes, and consistency with accepted requirements and architecture.

- [test-scenarios/](test-scenarios/): authoritative scenario set, reusable catalogs, and source-verification evidence
- [poc-evidence-matrix.md](poc-evidence-matrix.md): issue #13 proof-of-concept acceptance criteria recorded as passed/failed/open

Acceptance examples belong in or link from their owning requirements. Test evidence links directly back to the requirements it validates.

Use [Create Test Strategy](../../.agents/skills/create-test-strategy/SKILL.md) to establish the reusable test baseline and [Create Tests](../../.agents/skills/create-tests/SKILL.md) for a prepared implementation-plan increment. [Review Prototype](../../.agents/skills/review-prototype/SKILL.md) assesses technical hypotheses; [Review Slice](../../.agents/skills/review-slice/SKILL.md) assesses regular Slice acceptance claims. Their [templates](../governance/templates/README.md) and [Agent Workflows](../governance/workflows/agent-workflows/agent-workflows.md) define the records and handoffs. Existing PoC reports retain their historical scope.
