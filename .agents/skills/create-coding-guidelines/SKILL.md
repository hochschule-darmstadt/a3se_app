---
name: create-coding-guidelines
description: Collaboratively create, refine, correct, or assess project- and technology-specific coding guidelines derived from governing specifications, the selected stack, and repository evidence, with implementation patterns, library references, optional quality skills, and verification criteria. Use when concrete coding guidance is missing or needs alignment; do not redefine requirements, architecture, technology choices, test policy, or delivery gates, implement product code or tool configuration, or install skills and dependencies.
---

# Create Coding Guidelines

Translate governing engineering decisions into concrete guidance for consistent implementation and code review. Combine general principles with conventions, patterns, examples, and verification rules for the project's selected technologies. Generic advice alone is not a complete project guideline.

Create a reviewable documentation artifact, not a new technical baseline or an implementation change. The user's instructions take precedence. Authorization covers the requested guidelines, illustrative documentation examples, and directly affected documentation links. It does not authorize product changes, framework selection, dependency or skill installation, harness activation, tool configuration, pipeline changes, or external execution.

## Preserve authority

- Requirements and UX own product behavior, terminology, constraints, and measurable quality outcomes.
- Software Architecture and the Logical Entity Model own modules, contracts, dependency direction, information semantics, and integrity boundaries.
- Technology owns the selected languages, runtimes, frameworks, libraries, tools, usage boundaries, and compatibility policy. Dependency manifests and lockfiles own exact resolved versions.
- Security and Privacy Architecture owns control objectives and security responsibilities. Deployment Architecture owns environments and runtime boundaries.
- The Test Strategy owns assurance policy, test-level responsibilities, review authority, evidence semantics, and readiness gates. CI/CD owns the verification and delivery contract.
- Existing general Clean Code guidance retains its authority. Coding Guidelines own the additional project-specific conventions, implementation patterns, code examples, reference-use instructions, and verification mapping.
- Technical Foundation and the owning implementation workflows provide executable configurations, scripts, checks, and product code. Harness configuration owns skill activation and model setup.

Link governing facts rather than restating them as new coding rules. A guideline may explain how an accepted constraint is realized, but cannot change it. Route contradictory specifications or a needed change in scope, technology, security, testing, or gates to its owner.

## Load a bounded context

Read applicable repository instructions, [the context map](../../../docs/README.md), the [implementation reading path](../../../docs/implementation/README.md), relevant lifecycle and definition-of-done guidance, and the canonical [Coding Guidelines template](../../../docs/governance/templates/coding-guidelines.md).

Then load only the inputs needed for the requested language, module, layer, or concern:

1. Current coding guidelines, applicable [Clean Code guidance](../../../docs/implementation/clean-code.md), glossary terms, and existing decisions.
2. Governing Architecture, Technology, Security, Test Strategy, CI/CD, and Technical Foundation sections; relevant requirements or Slice anchors where they constrain coding practices.
3. Representative implementation and test code, manifests, lockfiles, compiler and formatter configuration, lint and static-analysis rules, check scripts, and code-review findings.
4. Library source references, official documentation, and existing approved examples relevant to the selected versions and patterns.

Distinguish accepted rules, existing habits, scaffold defaults, proposals, and observed defects. Existing code supplies evidence of practice; it does not automatically establish a desirable convention. Missing implementation is not a blocker for an initial draft, but limits what examples and executable checks can be claimed.

Preserve an established authoritative guideline location. Where only general Clean Code guidance exists, supplement it with `docs/implementation/coding-guidelines.md` by default. Do not create a competing rule catalog. Apply the repository's topic-growth strategy if independently reviewable language guides or examples later justify it.

## Select mode and scope

- **Initial draft:** derive the minimum useful rules for the selected stack and current delivery scope.
- **Refinement or correction:** change named rules or patterns after new decisions, implementation evidence, or review findings.
- **Alignment assessment:** report gaps or conflicts without editing unless writing is requested.

State the modules, languages, layers, code categories, and concerns in scope. On repeat invocation, read the current rules, examples, verification mappings, exceptions, and open questions first. Preserve stable identifiers and unaffected content.

Use relevant decided baselines before making their coding implications normative. A provisional technology choice supports visibly provisional guidance. If a material choice is unresolved, draft the supported parts and route that gap rather than inventing a stack or imposing a preferred tool.

## Identify the actual gaps

For each candidate rule, ask what the governing artifacts already establish and what additional implementation choice remains. Prefer a direct reference when a requirement, architectural dependency rule, security control, or test policy already says everything needed.

Create only rules that materially guide implementation or review in this project. Resolve consequential trade-offs with the user, such as competing error models, public API conventions, dependency policies, or differing module practices. Make routine editorial and traceability decisions autonomously. Create the requested draft within the authorized scope; keep unresolved proposals visible instead of adding a separate blanket permission step.

Cover these concerns where applicable:

### Code conventions

Specify concrete naming, formatting, file and function organization, documentation, and native language or framework idioms. Use domain terminology and the accepted module structure. Reference formatter configuration for exact mechanical settings rather than maintaining a conflicting prose copy.

Separate genuine project rules from configurable preferences. Do not invent line-count, complexity, coverage, or performance thresholds without an accepted rationale and a practical verification method.

### Anti-slop rules

Make undesirable generated-code behavior observable: speculative extension points, unnecessary wrappers, unjustified dependencies, duplicated knowledge, hidden fallback behavior, swallowed errors, misleading comments, or unjustified suppressions. Derive the applicable rules from current constraints and demonstrated risks.

Favor the smallest complete solution and reuse of existing or native capabilities where they fit. Simplicity does not justify removing required validation, security, accessibility, error handling, or independent tests. Do not equate fewer lines with better code or merge superficially similar code whose responsibilities differ.

### Implementation patterns

Show how agreed architecture, security, and test intent are realized in the selected stack: boundaries and types, validation, error translation, resource lifetime, state and effects, concurrency, and test seams as relevant. Include concise approved or clearly proposed examples using synthetic data.

Inspect actual APIs and versions before writing examples. Use current primary documentation or matching library sources when local evidence is insufficient; distinguish an illustrative snippet from compiled or executed evidence. Avoid turning the guidelines into another architecture specification or a complete application tutorial.

### Library and example references

Identify where agents can consult version-matched library sources, tests, official documentation, and project examples when an API or implementation pattern is unfamiliar. State the reference's version or revision and how compatibility with the project's dependency is established; expose mismatches or unknown provenance.

Treat external source snapshots as reference material with separate ownership. Specify their intended read-only use and keep application imports on normal package dependencies. Propose a missing reference source as a handoff; do not clone repositories, vendor code, or change build/search configuration as part of authoring guidelines. Retrieval should be relevant to the uncertainty, not a mandatory full-library read for every coding task.

### Quality-focused skills

Reference available, approved skills only where their procedures help apply or review a specific guideline. State the useful invocation condition and relevant rule IDs. Mark an unavailable candidate as a proposal rather than assuming it is installed.

The rule remains understandable and verifiable without a particular skill. A natural-language skill can guide behavior but is not a deterministic quality gate. Installation, activation, permissions, and model selection belong to the owning harness work.

### Rule verification

Give each normative coding rule a stable `CG-NNN` identifier, scoped to the authoritative guideline catalog, unless an established convention already applies. Preserve IDs across wording changes and retire rather than reuse them. Use the repository's normative language; keep observations and proposals distinct from obligations.

For every rule, record scope, rationale and governing source, expected compliance, and a verification mapping:

- **Automated:** link the exact existing compiler, formatter, linter, static/security check, architecture check, or test that can establish the stated condition.
- **Human review:** state an explicit observable review criterion when semantic judgment is required.
- **Combined:** explain what the automated result covers and what the reviewer must still decide.

Distinguish configured checks from planned checks and unavailable capability. Link source-controlled entry points and configuration rather than copying commands or claiming a tool catches more than it does. Keep blocking and exception policy aligned with the Test Strategy and CI/CD. Record a scoped exception's reason, accountable owner, impact, and review or expiry condition using existing governance.

## Write and hand off

Use the canonical template proportionately. Keep the document concise, readable during implementation, and limited to evidenced project additions. Use lifecycle metadata; keep new or materially changed rules in `draft` unless accountable authority explicitly establishes another status. Requested drafting is not acceptance.

Link the guideline from the implementation reading path. Repair only directly affected documentation links within the requested scope. Record rule status and preserve valid existing decisions, exceptions, and references on refinement.

Hand off missing work precisely:

- technology selection or version-policy changes to `create-technology`;
- shared formatter, compiler, linter, reference-access, or check mechanisms to `create-technical-foundation`;
- changed verification orchestration or delivery contracts to `create-ci-cd`, and routine execution of the accepted path to `operate-ci-cd`;
- assurance policy and gate changes to `create-test-strategy`;
- planned test or product-code changes to `create-tests`, `create-code`, or `plan-implementation` as appropriate;
- skill activation or installation to the owning harness workflow.

Give each material gap an owner, affected rule or pattern, and resolution condition. Do not make a requested guideline draft depend on unrelated repository cleanup.

## Validate and report

Check that rules add useful coding detail, agree with governing artifacts, and do not duplicate another authority. Confirm that examples and references fit the selected technologies and evidenced versions, each normative rule has a verification path, optional skills are accurately described, and planned mechanisms are clearly distinguished from configured ones.

Validate direct links, stable rule identifiers, lifecycle metadata, and applicable repository documentation checks. Do not execute application builds, product tests, delivery pipelines, or new example code merely to author the guidelines; identify any separately needed executable validation in the handoff.

Report the mode, scope, changed files, lifecycle state, principal additions, rules inherited by reference, example and version-evidence limits, verification coverage, unresolved choices, and owner-specific handoffs. Do not present draft guidance or passing structural checks as demonstrated code quality, acceptance, or production readiness.
