# Repository Instructions for AI Agents

## Mission

Build a tour operator business information system while demonstrating disciplined, advanced AI-assisted software engineering. Treat requirements, models, decisions, tests, and code as one evolving product specification.

## Current phase

The project is in requirements engineering. Do not select a technology stack or introduce production code unless a recorded decision authorizes it. Prefer clarifying the business problem, terminology, workflows, rules, risks, and quality needs.

## Required working behavior

1. Read [docs/README.md](docs/README.md), then follow only the reading path relevant to the task.
2. Check the glossary and existing decisions before introducing a business or technical term.
3. Distinguish facts, assumptions, proposals, and decisions. Never silently turn an assumption into a requirement.
4. Give every requirement a stable identifier. Preserve identifiers when wording changes; retire rather than reuse them.
5. Record consequential choices as ADRs. Technology remains undecided until requirements justify a choice.
6. Update affected specifications, diagrams, acceptance examples, and traceability in the same change as the behavior they describe.
7. Use established notations and standards listed in [docs/specification/notations.md](docs/specification/notations.md). Do not invent a DSL when a suitable standard exists.
8. Keep documents concise, link rather than duplicate, and name one authoritative location for each fact.
9. Surface contradictions and unresolved questions explicitly. Do not resolve material business questions without stakeholder evidence.
10. Preserve user work and keep changes scoped to the assigned task.

## Definition of done

A change is complete only when its acceptance evidence is present, links and identifiers remain valid, relevant specifications agree, and the checks in [docs/engineering/definition-of-done.md](docs/engineering/definition-of-done.md) pass.

## Agent collaboration

Specialist agents are advisory unless explicitly delegated authority. They work from the same evidence, report findings with severity and confidence, and negotiate conflicts through the shared-state protocol in [docs/agents/operating-model.md](docs/agents/operating-model.md). No agent may silently overwrite another agent's unresolved decision.

## Security and privacy

Use synthetic examples. Do not add secrets, personal data, customer booking data, or production credentials. Escalate uncertainty involving safety, legal obligations, payments, identity, or privacy.
