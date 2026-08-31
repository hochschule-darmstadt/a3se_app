# Repository Instructions for AI Agents

## Mission

Build a tour operator business information system while demonstrating disciplined AI assistance across the complete software lifecycle, not merely rapid code generation. Treat requirements, models, decisions, tests, infrastructure, operational evidence, and code as one evolving product specification.

## Current phase

The project continues in requirements engineering while implementing the accepted technology profile in [DR-0010](docs/governance/decisions/0010-adopt-python-centered-modular-technology-stack.md) and its validation conditions. Do not introduce a new or changed technology choice without a recorded decision authorizing it. Prefer clarifying the business problem, terminology, workflows, rules, risks, and quality needs.

## Required working behavior

1. Read [docs/README.md](docs/README.md), then follow only the reading path relevant to the task.
2. Check the glossary and existing decisions before introducing a business or technical term.
3. Distinguish facts, assumptions, proposals, and decisions. Never silently turn an assumption into a requirement.
4. Give every requirement a stable identifier. Preserve identifiers when wording changes; retire rather than reuse them.
5. Record consequential choices as decision records (DRs). Technology choices are governed by accepted decisions; revisit the selected profile only when its recorded triggers or new evidence justify it.
6. Update affected specifications, diagrams, acceptance examples, and cross-artifact links in the same change as the behavior they describe.
7. Use established notations and standards listed in [docs/governance/standards/notations.md](docs/governance/standards/notations.md). Do not invent a DSL when a suitable standard exists.
8. Keep documents concise, link rather than duplicate, and name one authoritative location for each fact.
9. Surface contradictions and unresolved questions explicitly. Do not resolve material business questions without stakeholder evidence.
10. Preserve user work and keep changes scoped to the assigned task.
11. Critically validate AI-generated artifacts. Record material limitations, rejected output, human decisions, and validation evidence when they affect engineering decisions; do not present AI output as inherently correct.
12. Write repository artifacts in English. Translate non-English sources by domain meaning, retaining the original term only when it is needed to resolve ambiguity.
13. Follow the topic growth strategy in [docs/README.md](docs/README.md): begin with `topic.md`; when it needs independently reviewable parts or supporting assets, grow it into `topic/README.md`, the authoritative `topic/topic.md`, and constituent files. The routing README declares and links the same-named topic document. Every directory must contain a `README.md`.

## Definition of done

A change is complete only when its acceptance evidence is present, links and identifiers remain valid, relevant specifications agree, and the checks in [docs/governance/workflows/definition-of-done.md](docs/governance/workflows/definition-of-done.md) pass.

## Agent collaboration

Specialist agents are advisory unless explicitly delegated authority. They work from the same evidence, report findings with severity and confidence, and negotiate temporary conflicts in the active session under the orchestrator. Persist only consequential outcomes or unresolved work in the appropriate authoritative project artifact or external task system. No agent may silently overwrite another agent's unresolved decision.

## Security and privacy

Use synthetic examples. Do not add secrets, personal data, customer booking data, or production credentials. Escalate uncertainty involving safety, legal obligations, payments, identity, or privacy.
