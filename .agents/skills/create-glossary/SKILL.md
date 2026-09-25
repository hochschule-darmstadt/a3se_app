---
name: create-glossary
description: Interview stakeholders and domain experts to create or materially refine the repository's authoritative glossary of domain terminology after the Product Vision has established the product surface and evidence. Reconcile only meaning-preserving editorial impacts in the Product Vision and hand off material product-intent changes. Use when domain meanings, distinctions, synonyms, or context-specific uses are the primary concern.
---

# Create Domain Glossary

Develop a precise, evidence-aware domain glossary collaboratively with the user. Within the Product Vision–glossary pair, the glossary is the sole semantic primary artifact of this workflow. The Product Vision and its linked source evidence supply terminology candidates and context; this workflow may repair the Product Vision editorially but must hand material product-intent changes back to a Product Vision workflow.

The user's instructions take precedence over this skill. Authorization to create or refine a glossary does not authorize material changes to product intent, detailed requirements, domain models, architecture, implementation, or unrelated project artifacts.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md`.
2. Read `docs/README.md` and follow its requirements reading path.
3. Read the authoritative Product Vision, the existing glossary, all source evidence linked from relevant capability areas or terminology handoffs, business domains, business objects, actors, use cases, applicable decisions, the requirements workflow, artifact authority and lifecycle, requirements-language guidance, and the definition of done.
4. Load only additional architecture, test, operations, or management context that is relevant to the terminology under discussion.

The initial glossary workflow requires at least a draft Product Vision that establishes the coarse product capability areas and links the available detailed evidence. If it does not exist, do not create a glossary from decontextualized sources; report the missing prerequisite and hand the work to `create-product-vision`.

Preserve the repository's established glossary location and compatible structure. If no glossary exists after the prerequisite is satisfied, create it from the canonical [Domain Glossary template](../../../docs/governance/templates/glossary.md), replacing its instructional text and placeholders with the available evidence and current review metadata.

Treat stakeholder statements and identified sources as evidence. Product Vision wording identifies product context and candidates but does not establish their domain meaning. Existing marketing material, product labels, implementation behavior, and agent-generated definitions are not accepted domain meaning by themselves.

For a revision, begin with the requested or evidence-driven terminology delta, preserve unaffected confirmed definitions, and do not rephrase entries merely for stylistic novelty. If the user requests only an alignment assessment, report findings without writing unless they also authorize changes.

## Preserve semantic ownership and vocabulary boundaries

- Include vocabulary that domain experts use to describe concepts in the problem domain, such as tour operation and travel sales. Seasonal-planning, procurement, travel-product, sales, travel-order, payment, customer-care, and other business-process terms qualify when their meaning exists independently of the project or a particular software implementation; for example, stock service, travel component, or travel order.
- Do not include product names, software-component names, product-capability labels, or terms whose primary purpose is to describe the project, its acceptance, or the delivery process. Their necessary meaning belongs in the Product Vision or another authoritative artifact.
- Do not turn the glossary into a feature list, product catalog, business-object catalog, data dictionary, requirements catalog, or domain model. Link to those artifacts when the distinction matters.
- When a term has different meanings in different domain contexts, record context-specific meanings instead of forcing a false global definition.
- Include only terms whose explicit definition materially improves shared understanding. Do not collect every noun or commonplace word.
- The glossary is authoritative for domain meaning. The Product Vision remains authoritative for product intent, outcomes, principles, capability areas, boundaries, named product capabilities, and transformation intent. Link rather than duplicate.
- This workflow may make a meaning-preserving editorial repair to the Product Vision only when it is required for consistency and indisputably does not change product intent, scope, capability boundaries, authority, or lifecycle status. Otherwise identify the exact affected Vision statement and hand the change to `create-product-vision`.

## Establish and preserve candidate coverage

Before asking term-definition questions, derive a visible candidate inventory from the Product Vision's capability areas, its linked source evidence and terminology handoffs, the existing glossary, and relevant specifications. Follow links to detailed evidence; do not require every candidate or feature-level detail to be repeated in the concise Product Vision. Proactively look for domain-bearing concepts and distinctions whose interpretation affects the intended product surface or shared understanding.

Group the candidates into coherent terminology slices. For each candidate or closely related cluster, show its source context and a preliminary boundary classification such as include, exclude, or uncertain. Make clear that this classification is not stakeholder-approved. Ask the user to confirm or correct the intended coverage before beginning detailed term questions; a user-supplied candidate list establishes coverage directly unless the user says it is illustrative or incomplete.

If the user does not narrow the assignment, the working scope includes all material domain-term candidates found in the current Product Vision, its linked evidence, and relevant specifications. A terminology slice is only a unit for sequencing, confirmation, and review; completing one slice does not silently remove the remaining candidates from scope.

Maintain the inventory throughout the interview. Give every candidate an explicit disposition: unresolved, ready to write, written, excluded with its authoritative destination and rationale, or owned open question. Add newly discovered candidates and expose them to the user rather than silently expanding or dropping scope. Persist unresolved candidates, their evidence, owner, affected artifacts, and resolution condition in linked source evidence or the repository's authoritative open-question location so later runs do not depend on chat history; do not add an unresolved candidate to the glossary definition table merely to preserve it.

## Interview before drafting

Tell the user that domain-language discovery is beginning and that the glossary will be updated only after the understanding threshold is met.

After establishing candidate coverage, ask the highest-value unresolved terminology question next. Prefer one focused question per turn. After each answer, update the working inventory and continue with the next highest-value unresolved question. Do not repeat an already evidenced and resolved question unless new evidence conflicts with it. Do not interpret confirmation of one definition or one terminology slice as completion of the overall glossary assignment.

For each material domain term, clarify only what is needed:

- the definition a domain expert would recognize;
- the context or contexts in which it applies;
- boundaries, important distinctions, examples, and counterexamples;
- accepted synonyms, discouraged synonyms, homonyms, and original-language terms where relevant;
- relationships to already defined terms without turning the discussion into detailed domain modeling;
- source evidence and the accountable authority for the meaning.

Classify each material statement as a fact, assumption, proposal, decision, or open question. Challenge circular definitions, vague language, implementation-led definitions, conflicting usage, and false synonyms. Do not invent domain meaning or silently choose among stakeholder interpretations.

When a proposed definition would change the interpretation of the Product Vision, identify the exact affected statement and discuss the impact. A terminology clarification does not approve changed product intent, scope, target users, capability areas, principles, or success measures.

## Determine readiness

Assess readiness at two levels: readiness to write the current terminology slice and readiness to complete the overall assignment. A slice is ready to write when:

- each material term in the selected glossary slice has a recognizable domain meaning and explicit context, or remains a persistently recorded owned open question;
- important boundaries, collisions, synonyms, and context-specific meanings are visible;
- proposed definitions are supported by stakeholder input or identified evidence;
- product, software, capability, project, acceptance, and delivery-process terms have been excluded from the domain glossary and retained or proposed for their proper authoritative destination;
- material impacts on the Product Vision have been identified and classified as editorial or requiring a Product Vision handoff;
- no material contradiction or assumption remains hidden.

Do not redefine or narrow a slice after interviewing begins merely to declare it ready. The overall assignment is complete only when every candidate in the agreed coverage has an explicit disposition and no material contradiction or assumption remains hidden.

Do not demand an exhaustive vocabulary beyond the agreed coverage. Work in coherent, reviewable terminology slices, but after writing one ready slice continue with the next unresolved candidate. Stop before the inventory is complete only when the user explicitly narrows the scope or asks to stop; keep a new or materially changed glossary in `draft` and expose the remaining candidates and gaps.

## Confirm the understanding

When the current slice appears ready, present a concise synthesis of:

- domain terms to add, change, deprecate, or distinguish by context;
- evidence, assumptions, and unresolved meanings;
- candidates excluded because they are product or delivery-process vocabulary and their proposed authoritative destination;
- meaning-preserving editorial Product Vision changes, if any;
- exact Product Vision statements requiring a material product-intent decision and therefore a handoff;
- known conflicts or limitations.

Ask the user to confirm or correct the synthesis before writing. Do not silently turn the agent's synthesis into approved domain meaning or product intent.

After writing a confirmed slice, state that the update is partial, identify the remaining candidate slices, and resume with the next highest-value unresolved question unless the overall assignment is complete or the user has asked to stop.

## Create or update the glossary and evidence

After confirmation:

1. Update the authoritative domain glossary as the primary artifact.
2. Create or update the source evidence or authoritative open-question records needed to preserve provenance, unresolved candidates, and cross-artifact handoffs.
3. Write repository artifacts in English unless repository instructions say otherwise; retain an original-language term when it resolves ambiguity for domain experts.
4. Preserve required metadata and use the canonical glossary format: one alphabetically ordered definition table with the columns `Term`, `Definition`, `Context`, and `Synonyms to avoid`, plus links to supporting evidence and unresolved terminology work. Do not create intermediate category headings or split definitions into multiple tables. Keep each term cell as plain text; do not add HTML anchors or other per-term anchor markup. Prefer concise, non-circular definitions in domain language, with explicit context and material distinctions.
5. Preserve facts, assumptions, proposals, decisions, and open questions as distinct statement types according to repository conventions.
6. Keep a new or materially changed glossary in `draft` unless the accountable authority explicitly approves another lifecycle state. Preserve its existing lifecycle status when no semantic change occurred. Never change the Product Vision status solely because this workflow ran.
7. Do not assign requirement identifiers to glossary terms or candidates unless the repository explicitly requires glossary identifiers.
8. Remove product names, software components, product-capability labels, and project, acceptance, and delivery-process terminology from the glossary when confirmed to be misplaced. Apply only meaning-preserving editorial repairs needed to retain already established wording in the Product Vision; hand any material addition or change of product intent to `create-product-vision`.
9. Apply Product Vision edits only when they are meaning-preserving consequences of a confirmed definition, such as terminology or link corrections. Do not change product intent, scope, capability areas, target users, principles, or success measures; record the exact proposed change as a handoff instead.
10. Link directly and relatively between the Product Vision, glossary, source evidence, open questions, and other authoritative artifacts. Do not duplicate full definitions.
11. Reconcile only artifacts affected by the terminology change. Do not create detailed requirements, domain models, architecture, implementation, or roadmap content unless the user separately requests it.

## Validate and report

Critically compare the glossary, evidence, and any editorial Product Vision repairs with the discussion. Check that definitions are domain-focused, non-circular, context-aware, and used consistently; excluded product and project vocabulary has a stated authoritative destination; no terminology change silently changed product intent; and links and identifiers remain valid.

After any editorial secondary-artifact repair, rebuild the candidate and impact view. Do not claim full alignment while a material Product Vision handoff or unowned terminology conflict remains unresolved. A repeated run with unchanged evidence and intent should produce no semantic or stylistic churn.

Run the repository's documentation validation command when it is available. If configured validation tooling is missing, do not rebuild it as part of this workflow; perform feasible checks manually and report the skipped automated check as a limitation.

Report the changed files, terminology added or changed, source-evidence changes, editorial Product Vision repairs, material Product Vision handoffs, validation performed and its result, remaining assumptions and open questions, the resulting alignment state, and any skipped check or residual limitation. Do not present a partial slice as completion: list the unresolved candidate inventory until the overall completion condition is met.
