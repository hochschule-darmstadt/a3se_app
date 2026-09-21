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

Make the Product Vision's capability areas collectively expose the intended product surface. For each material area, establish its intended contribution or outcome, representative capabilities, evidence and status, and material boundaries or open questions. The result must make intended feature families and candidate features derivable at a coarse level. Include scope-defining or distinguishing capabilities, but do not turn the vision into an exhaustive feature list, backlog, detailed requirement catalog, domain model, or architecture.

Retain substantive stakeholder wording and detailed current-state or proposed capabilities that do not belong in the concise Product Vision as source evidence with provenance and classification. Link that evidence from the relevant capability area rather than discarding or duplicating it.

Derive a visible glossary-candidate handoff from the Product Vision and its linked evidence. For each material candidate, retain the original wording and source context, the ambiguity or distinction that makes it relevant, and the Product Vision statement or capability area it affects. Persist unresolved candidates and stakeholder terminology statements in source evidence or the repository's authoritative open-question location so a later glossary task does not depend on chat history. Do not propose a definition as if it were established domain meaning.

Derive a separate visible actor-candidate handoff for people, organizations, external systems, or devices that appear to interact with the intended product. Retain the candidate role, target-user or stakeholder context, hypothesized interaction, evidence, and uncertainty. Do not assign an `ACT-` identifier, create the actor catalog, or decide a final role boundary. Beneficiaries and interested stakeholders remain candidates only when direct interaction is evidenced or needs validation.

## Interview before drafting

Tell the user that Product Vision discovery is beginning and that the artifact will be drafted only after the understanding threshold is met.

Ask the highest-value unresolved question next. Prefer one focused question per turn; group questions only when they are tightly related or the user requests a faster questionnaire. Adapt every question to the repository evidence and the user's earlier answers rather than following a fixed checklist.

Ensure the interview establishes, where material:

- the triggering problem or opportunity;
- affected people or organisations, intended users, beneficiaries, and other stakeholders;
- the current situation and why it is inadequate;
- the outcomes users and stakeholders need;
- the product's intended identity, role, and distinguishing value;
- the complete set of coarse capability areas needed to understand the intended product surface;
- representative scope-defining or distinguishing capabilities within each area;
- the intended product boundary and explicit non-goals;
- product principles and the trade-offs they imply;
- proposed indicators of success, including direction, timeframe, baseline, and target when supported;
- material business, regulatory, organisational, temporal, safety, privacy, and other constraints;
- the evidence and accountable authority behind consequential statements.

Classify each material statement internally as a fact, assumption, proposal, decision, or open question. Challenge vague, contradictory, solution-led, unsupported, or untestable answers. Ask what ambiguous terms such as “simple”, “modern”, “efficient”, “secure”, or “user-friendly” mean in context. Separate desired outcomes and capability areas from detailed features and implementation choices. Never invent a target, baseline, constraint, stakeholder decision, or source.

While interviewing, ask about domain terminology only as far as needed to understand the vision and preserve the stakeholder's meaning as evidence. Identify context, important boundaries or distinctions, original wording, and authority without turning the answer into an authoritative glossary definition. Defer definition and broader terminology discovery to `create-glossary`.

Do not repeat an answered question unless new evidence conflicts with the answer. When the user does not know, record an open question instead of forcing a choice. Establish an owner and the evidence, authority, or event required to resolve every material open question. Periodically summarize the current understanding when the discussion becomes complex.

## Determine readiness

Continue the interview until:

- every required template section can be supported by stakeholder input or identified evidence;
- target users, problems, outcomes, value, principles, capability areas, and product boundaries form a coherent whole;
- every material capability area states an intended contribution and representative capabilities or links to evidence that supplies the necessary detail;
- no material contradiction remains hidden;
- every material assumption is acknowledged and has a validation condition;
- every unresolved material question has an owner and resolution condition;
- proposed success measures are meaningful, or their deliberate deferral is explicit;
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

1. Update the authoritative Product Vision using the resolved template.
2. Create or update the source evidence needed to preserve detailed stakeholder statements, capability information, terminology candidates, provenance, and uncertainty that the concise vision only summarizes.
3. Do not create the domain glossary or make a semantic glossary change. Apply only explicitly meaning-preserving editorial glossary repairs that are necessary and within the user's requested scope; otherwise produce a glossary handoff.
4. Do not create the actor catalog or assign `ACT-` identifiers. Retain actor candidates and their evidence for `create-actors`; link existing authoritative actors when they already exist.
5. Keep product names, software components, product-capability labels, and modernization, migration, acceptance, and delivery-process terminology in the Product Vision. Define them there on first material use when needed for clarity; link purely organizational or lifecycle detail to its authoritative project artifact.
6. Write repository artifacts in English unless repository instructions say otherwise; retain original-language source wording when it resolves ambiguity.
7. Preserve required metadata and established headings; remove template instructions from completed artifacts.
8. Keep the vision concise, outcome-oriented, and independent of architecture and implementation while retaining the capability areas and representative capabilities needed to understand its product surface.
9. Preserve facts, assumptions, proposals, decisions, and open questions as distinct statement types.
10. Keep a new or materially changed Product Vision in `draft` unless the accountable authority explicitly approves another lifecycle state. Preserve an existing lifecycle status when no semantic change occurred. Never change the glossary or actor-catalog status solely because this workflow ran.
11. Keep unapproved targets visibly proposed and never fabricate missing values.
12. Link directly and relatively to authoritative repository artifacts and source evidence. Link to the glossary and actor catalog rather than duplicating established definitions.
13. Summarize rather than duplicate detailed actor definitions, requirements, constraints, scope exclusions, domain definitions, or feature specifications.
14. Give stable identifiers only in their authoritative catalogs. Do not assign identifiers to vision placeholders, proposals, open questions, capability areas, glossary candidates, or actor candidates.
15. Reconcile affected source evidence, explicit exclusions, constraints, and consequential decisions in the same coherent change when repository rules require it. Treat necessary semantic glossary or actor-catalog changes as handoffs rather than applying them here.
16. Do not create detailed feature specifications, architecture, implementation, domain models, or roadmap content unless the user separately requests it.

## Validate and report

Critically compare the completed Product Vision and evidence with the interview and the existing glossary. Check that no statement changed meaning, no assumption became a fact, no proposal became a decision, capability areas expose the intended product surface without becoming a backlog, established domain terminology remains consistent, links and identifiers remain valid, and affected artifacts do not contradict one another.

After any editorial secondary-artifact repair, repeat the impact check. Do not claim full alignment while a semantic glossary handoff remains unresolved. A repeated run with unchanged evidence and intent should produce no semantic or stylistic churn.

Run the repository's documentation validation command when it is available. If configured validation tooling is missing, do not rebuild it as part of this workflow; perform the feasible checks manually and report the skipped automated check as a limitation.

Report the changed files, validation performed and its result, capability-area changes, source-evidence changes, the complete glossary-candidate and actor-candidate handoffs, affected Vision statements, remaining assumptions and open questions, the resulting alignment state, and any skipped check or residual limitation.
