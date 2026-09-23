---
name: create-product-vision
description: Interview the user rigorously to create or materially revise the repository's authoritative Product Vision, capture its evidence, and hand off domain-term and actor candidates without defining their authoritative catalogs. Use when product intent, target users, outcomes, capability areas, principles, scope, or success measures are the primary concern; do not use it for detailed requirements, domain models, architecture, implementation, or roadmaps.
---

# Create Product Vision

Develop a concise, evidence-aware Product Vision collaboratively with the user. Within the Product Vision–glossary pair, the Product Vision is the sole semantic primary artifact of this workflow. Capture detailed stakeholder statements as source evidence and identify domain terminology and interacting-role candidates for focused follow-up, but do not create or materially change the domain glossary or authoritative actor catalog, including during initial product discovery.

The user's instructions take precedence over this skill. Stay within the requested scope and do not treat authorization to create a Product Vision as authorization for unrelated product, glossary, architecture, implementation, or external-system changes.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md`.
2. Read `docs/README.md` and follow its requirements reading path.
3. Read the existing Product Vision, the canonical Product Vision template, the requirements glossary when present, relevant source evidence, actors, scope exclusions, constraints, open questions, applicable decisions, the requirements workflow, artifact authority and lifecycle, requirements-language guidance, and the definition of done.
4. Load only additional architecture, test, operations, or management context that is relevant to the vision.

Use `docs/governance/templates/product-vision.md` as the structural contract when it exists. If the repository declares a different canonical template, use that instead. If no template exists, preserve the structure of the authoritative Product Vision; if neither exists, propose a minimal structure before creating one.

Treat stakeholder statements and identified sources as evidence. Existing marketing material, source documents, implementation behavior, and agent-generated text are not accepted product intent by themselves.

For a new Product Vision, establish the product intent and evidence from the available context; do not create a bootstrap glossary. For a revision, begin with the requested or evidence-driven delta, preserve unaffected confirmed content, and do not rephrase material merely for stylistic novelty. If the user requests only an alignment assessment, report findings without writing unless they also authorize changes.

## Preserve semantic ownership

- The Product Vision defines product intent, target users and outcomes, principles, product boundaries, capability areas, named existing or proposed product capabilities, transformation and delivery-process intent, and proposed success measures.
- The actor catalog defines stable human roles and external participants that interact with the system. This workflow identifies evidenced actor candidates and their target-user context but does not assign `ACT-` identifiers or establish authoritative actor boundaries.
- The domain glossary defines the language domain experts use for concepts in the problem domain. Only a glossary-focused workflow may add, remove, rename, redefine, or materially change the context, distinctions, or synonyms of a glossary entry.
- This workflow may make a meaning-preserving editorial repair to an existing glossary only when it is required for consistency and indisputably does not change domain meaning, scope, authority, or lifecycle status. Otherwise identify the exact required change and hand it off to `create-glossary`.
- If no glossary exists, do not create one. A domain term mentioned or clarified during Product Vision discovery remains a candidate supported by evidence, not an authoritative definition.
- Product names, software-component names, product-capability labels, and terms used to describe modernization, migration, acceptance, or the delivery process belong in the Product Vision when needed to understand product intent.
- Link from the Product Vision to existing glossary definitions that materially aid understanding. Do not duplicate full definitions.

## Capture capability, terminology, and actor-candidate evidence

Make the Product Vision clear enough to communicate the intended product surface, outcomes, and material boundaries. Include capability areas when they help explain that surface; concise prose or bullets are acceptable, and a complete capability table is not required. Use enough detail to distinguish material capabilities without turning the vision into an exhaustive feature list, backlog, detailed requirement catalog, domain model, or architecture. Put finer-grained coverage in linked authoritative artifacts when that improves reviewability.

Retain substantive stakeholder wording, provenance, or detailed current-state and proposed capabilities as source evidence when those details are material and are not already preserved in an authoritative artifact. Link evidence where it helps reviewers trace consequential or uncertain statements. Do not create a parallel evidence catalog solely to populate template fields.

When discovery identifies unresolved domain terminology that needs follow-up, make the glossary handoff visible in the Vision or linked evidence. Preserve original wording, source context, relevant ambiguity or distinction, and the affected Vision statement where useful. Persist material unresolved candidates when a later glossary task would otherwise depend on chat history. Do not create candidate lists for established terms that already agree with the glossary, and do not propose a definition as if it were established domain meaning.

When discovery identifies a plausible interacting role whose boundary or interaction needs validation, make the actor handoff visible in the Vision or linked evidence. Capture the candidate role, context, hypothesized interaction, and uncertainty to the level needed for `create-actors` to continue without relying on chat history. Do not duplicate established actor definitions, assign an `ACT-` identifier, create the actor catalog, or decide a final role boundary. Beneficiaries and interested stakeholders are actor candidates only when direct interaction is evidenced or needs validation.

## Interview before drafting

Tell the user that Product Vision discovery is beginning and that the artifact will be drafted only after the understanding threshold is met.

Ask the highest-value unresolved question next. Prefer one focused question per turn; group questions only when they are tightly related or the user requests a faster questionnaire. Adapt every question to the repository evidence and the user's earlier answers rather than following a fixed checklist.

Ensure the interview establishes, where material:

- the triggering problem or opportunity;
- affected people or organisations, intended users, beneficiaries, and other stakeholders;
- the current situation and why it is inadequate;
- the outcomes users and stakeholders need;
- the product's intended identity, role, and distinguishing value;
- enough coarse capability coverage to understand the intended product surface and its material distinctions;
- representative scope-defining capabilities where they clarify intent or boundaries;
- the intended product boundary and explicit non-goals;
- product principles and the trade-offs they imply;
- useful proposed indicators of success, including direction, timeframe, baseline, and target when supported by evidence;
- material business, regulatory, organisational, temporal, safety, privacy, and other constraints;
- the evidence and accountable authority behind consequential statements.

Classify each material statement internally as a fact, assumption, proposal, decision, or open question. Challenge vague, contradictory, solution-led, unsupported, or untestable answers. Ask what ambiguous terms such as “simple”, “modern”, “efficient”, “secure”, or “user-friendly” mean in context. Separate desired outcomes and capability areas from detailed features and implementation choices. Never invent a target, baseline, constraint, stakeholder decision, or source.

While interviewing, ask about domain terminology only as far as needed to understand the vision and preserve the stakeholder's meaning as evidence. Identify context, important boundaries or distinctions, original wording, and authority without turning the answer into an authoritative glossary definition. Defer definition and broader terminology discovery to `create-glossary`.

Do not repeat an answered question unless new evidence conflicts with the answer. When the user does not know, record an open question instead of forcing a choice. Establish an owner and the evidence, authority, or event required to resolve every material open question. Periodically summarize the current understanding when the discussion becomes complex.

## Determine readiness

Continue the interview until:

- the Product Vision can communicate the intended outcome and scope clearly in a concise form; use supporting detail where it materially improves understanding or traceability;
- target users, problems, outcomes, value, principles, capability areas, and product boundaries form a coherent whole;
- the intended capability surface and its material distinctions are clear enough for the vision's purpose; use linked detail only where it improves understanding or traceability;
- no material contradiction remains hidden;
- every material assumption is acknowledged and has a validation condition;
- every unresolved material question that affects intent, scope, or a pending decision has an owner and resolution condition;
- proposed success measures are meaningful where known; do not require baselines, targets, or timeframes without evidence, and make a deferral explicit when a measure is material to a pending decision;
- architecture or implementation choices are not being presented as product intent without justification;
- domain terms material to interpreting the vision agree with the existing glossary or are retained as evidenced glossary candidates or owned open questions;
- product, software, modernization, governance, and delivery terms have not been misclassified as domain vocabulary.

Do not demand perfect knowledge. Non-blocking uncertainty may remain when it is explicit and owned. If the user asks to stop the interview early, comply, keep a new or materially changed Product Vision in `draft`, and make the resulting gaps visible.

## Confirm the understanding

When the readiness conditions appear satisfied, state that the interview is complete and present a concise synthesis of:

- understood product intent and capability areas;
- representative scope-defining or distinguishing capabilities;
- material decisions;
- remaining assumptions and open questions;
- known conflicts or limitations;
- source evidence to create or update;
- glossary candidates, their source context, and any unresolved terminological ambiguity.
- actor candidates, their hypothesized interaction, and the evidence or question to hand to `create-actors`.

Ask the user to confirm or correct the synthesis before writing the Product Vision. Do not silently turn the agent's synthesis into approved stakeholder intent or domain meaning.

## Create or update the Product Vision and evidence

After confirmation:

1. Update the authoritative Product Vision using the resolved template as a guide to coverage, not a mandatory layout. Keep the vision concise and use prose, bullets, or tables as best fits its scope.
2. Create or update supporting source evidence when material stakeholder statements, provenance, capability detail, terminology candidates, or uncertainty are not already preserved in an authoritative location and would otherwise be lost. Do not create supporting documents merely to fill template fields.
3. Do not create the domain glossary or make a semantic glossary change. Apply only explicitly meaning-preserving editorial glossary repairs that are necessary and within the user's requested scope; otherwise produce a glossary handoff.
4. Do not create the actor catalog or assign `ACT-` identifiers. Retain actor candidates and their evidence for `create-actors`; link existing authoritative actors when they already exist.
5. Keep product names, software components, product-capability labels, and modernization, migration, acceptance, and delivery-process terminology in the Product Vision. Define them there on first material use when needed for clarity; link purely organizational or lifecycle detail to its authoritative project artifact.
6. Write repository artifacts in English unless repository instructions say otherwise; retain original-language source wording when it resolves ambiguity.
7. Preserve required metadata and established headings; remove template instructions from completed artifacts.
8. Keep the vision concise, outcome-oriented, and independent of architecture and implementation. Include capability-area and representative-capability detail only to the extent needed to communicate its product surface.
9. Preserve facts, assumptions, proposals, decisions, and open questions as distinct statement types.
10. Keep a new or materially changed Product Vision in `draft` unless the accountable authority explicitly approves another lifecycle state. Preserve an existing lifecycle status when no semantic change occurred. Never change the glossary or actor-catalog status solely because this workflow ran.
11. Keep unapproved targets visibly proposed and never fabricate missing values. Record baseline, target, timeframe, and authority when supported; otherwise use a directional indicator or defer the detail without making the Vision a measurement plan.
12. Link directly and relatively to authoritative repository artifacts and source evidence. Link to the glossary and actor catalog rather than duplicating established definitions.
13. Summarize rather than duplicate detailed actor definitions, requirements, constraints, scope exclusions, domain definitions, or feature specifications.
14. Give stable identifiers only in their authoritative catalogs. Do not assign identifiers to vision placeholders, proposals, open questions, capability areas, glossary candidates, or actor candidates.
15. Reconcile affected source evidence, explicit exclusions, constraints, and consequential decisions in the same coherent change when repository rules require it. Treat necessary semantic glossary or actor-catalog changes as handoffs rather than applying them here.
16. Do not create detailed feature specifications, architecture, implementation, domain models, or roadmap content unless the user separately requests it.

## Validate and report

Critically compare the completed Product Vision and any supporting evidence with the interview and the existing glossary. Check that no statement changed meaning, no assumption became a fact, no proposal became a decision, the Vision communicates its intended product surface without becoming a backlog, established domain terminology remains consistent, links and identifiers remain valid, and affected artifacts do not contradict one another.

After any editorial secondary-artifact repair, repeat the impact check. Do not claim full alignment while a material semantic glossary handoff remains unresolved. A repeated run with unchanged evidence and intent should produce no semantic or stylistic churn.

Run the repository's documentation validation command when it is available. If configured validation tooling is missing, do not rebuild it as part of this workflow; perform the feasible checks manually and report the skipped automated check as a limitation.

Report changed files, validation performed and its result, material Vision changes, supporting evidence or candidate handoffs created or updated, affected statements, remaining material assumptions and open questions, alignment state, and skipped checks or residual limitations. Omit handoff categories that did not arise; do not manufacture candidates to complete a report checklist.
