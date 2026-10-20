# Coding Guidelines

- Status: draft
- Owner: Implementation
- Last reviewed: YYYY-MM-DD

Use this template for concrete coding guidance derived from the project's governing specifications, selected stack, and repository evidence. Replace instructional text with supported project content. Retain only applicable concerns, link inherited rules instead of duplicating them, and keep proposed rules and unavailable checks visible.

## Scope and authority

State the modules, languages, layers, code categories, and lifecycle scope governed here. Identify the authoritative guideline catalog and any general Clean Code baseline it supplements.

Link Requirements, Architecture, Entities, Technology, Security, Test Strategy, CI/CD, and relevant decisions. Explain that these retain their authority; the guidelines add concrete implementation conventions, patterns, references, and verification mappings. Technical Foundation and implementation own executable mechanisms; harness configuration owns skill activation.

## Baseline and evidence

| Source or concern | Authoritative location | Status and applicability |
|---|---|---|
| Governing artifact, existing convention, representative code, configuration, dependency manifest, or decision | Direct link | Accepted constraint, observed practice, provisional choice, or unresolved gap; relevant module and technology scope |

Record the selected technology boundaries and link manifests or lockfiles for exact dependency versions. Do not copy a second dependency inventory. Distinguish established conventions from scaffold defaults and known defects.

## Coding rules

Use stable `CG-NNN` identifiers for normative rules unless the repository already establishes another scheme. Keep one atomic rule per ID; preserve IDs while their meaning continues and retire rather than reuse them. Follow repository normative language and keep proposed rules explicitly in draft.

| ID | Scope | Rule | Rationale and governing source | Status |
|---|---|---|---|---|
| `CG-NNN` | Language, module, layer, or code category | Responsible subject `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, or `MAY` perform an observable coding practice under a stated condition | Additional coding choice and direct authoritative anchor | draft, proposed, accepted, or deprecated |

Address applicable naming, formatting, organization, function responsibilities, documentation, language/framework idioms, and anti-slop concerns. Reference inherited architectural and security constraints. Avoid arbitrary thresholds, speculative dependencies, or universal bans unsupported by this project.

## Implementation patterns and examples

For each useful pattern, provide:

- applicable rule IDs, purpose, and scope;
- the governing architecture, security, or test anchor;
- a concise example using synthetic data and the selected technology;
- relevant error, resource, state, concurrency, or test-seam behavior;
- source and version evidence, and whether the example is illustrative, inspected, compiled, or executed.

Mark unvalidated examples clearly. Link existing approved examples when they already express the intended pattern. Required behavior, security, and tests remain intact when simplifying code.

## Library and example references

| Reference | Location | Version or revision evidence | When to consult it |
|---|---|---|---|
| Library source, tests, official documentation, or approved project example | Direct accessible path or primary URL | Match to the project's dependency; record unknowns or mismatches | Unfamiliar API, implementation pattern, or concrete uncertainty |

State intended read-only use of external source references and keep application imports on normal package dependencies. Record missing or outdated references as owned gaps rather than describing them as available.

## Quality-focused skills

| Available skill or explicitly proposed candidate | Rule IDs and contribution | Invocation condition | Availability and ownership |
|---|---|---|---|
| Direct skill reference | Rules the procedure helps apply or review | Concrete implementation or review situation | Approved and available, or proposed; activation belongs to the harness owner |

Keep this section optional. Rules remain understandable and verifiable without a particular skill; a natural-language instruction is not an executable check.

## Rule verification

| Rule ID | Method | Existing check or explicit review criterion | Expected compliance evidence | Mechanism state and owner |
|---|---|---|---|---|
| `CG-NNN` | automated, human review, or combined | Direct script/configuration/test reference or observable reviewer question | What establishes compliance and what remains outside the check | Configured, planned, or unavailable; owning workflow |

Map every normative rule. Link existing command entry points; do not maintain a second command catalog. Keep blocking and exception policy in the Test Strategy and CI/CD. Hand new executable configuration to Technical Foundation or the owning implementation work.

## Exceptions, open choices, and handoffs

| Rule or concern | Exception, gap, or decision needed | Owner | Scope, impact, and resolution or expiry condition |
|---|---|---|---|
| Rule ID, reference, pattern, or missing mechanism | Evidence-supported statement | Accountable authority or owning workflow | Bounded applicability, consequence, and required decision or work |

Use existing governance for consequential decisions and exceptions. Do not silently promote an observed habit, a proposed technology, or a draft rule to accepted policy.

## Sources and revision history

Link the authoritative artifacts, general guidance, decisions, code examples, manifests, configurations, library sources, and primary documentation actually used. Record material rule changes, retired identifiers, rationale, and affected implementation or verification work. Do not claim that documentation review proves code compliance.
