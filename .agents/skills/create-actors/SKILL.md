---
name: create-actors
description: Collaboratively discover, refine, correct, or assess the stable human roles, external parties, systems, and devices that interact with a target system, and maintain the authoritative actor catalog. Use after product intent, domain language, and domain boundaries are sufficiently established; do not use it for personas, stakeholder management, permission design, organizational charts, use-case scenarios, architecture, or implementation.
---

# Create Actors

Develop an evidence-aware actor catalog collaboratively with the user. Treat every draft as a falsifiable current model that later use cases, business objects, domain analysis, or stakeholder evidence may refine or correct. Treat the user as a collaborative requirements and domain-design partner whose expertise may include the business domain, operations, product, use-case modeling, DDD, architecture, UX, and the legacy system.

The user's instructions take precedence over this skill. Authorization to analyze or document actors does not authorize changes to product intent, glossary meanings, domain boundaries, use cases, business objects, permissions, architecture, implementation, or unrelated artifacts.

## Preserve semantic ownership

- The Product Vision owns target users, beneficiaries, outcomes, product boundaries, and coarse actor candidates. It does not establish stable actor identities merely by naming a user group.
- The actor catalog owns stable interacting roles and external participants, their type, defining responsibility and authority, interaction boundary, distinguishing characteristics, and participation in subdomains.
- Stakeholder management owns parties with an interest in or influence on the product, including non-interacting stakeholders and engagement strategy.
- Use cases own specific actor goals and identify the primary and supporting actors for each interaction. Primary or supporting is a relationship to one use case, not an intrinsic actor type.
- The domain glossary owns the meaning of domain-expert terms used in actor names and definitions.
- The business-domains artifact owns subdomain responsibilities and boundaries. Actor participation does not imply that the actor or its information is owned by a subdomain.
- UX research owns personas, contexts of use, user journeys, and research-backed behavioral distinctions.
- Security and architecture own accounts, identities, authentication mechanisms, authorization roles, permissions, system components, interfaces, and technical trust boundaries.
- Source evidence supports analysis but is not accepted actor intent by itself.

Do not silently change an owning artifact to make an actor proposal fit. Apply a secondary-artifact edit only when it is meaning-preserving, necessary for consistency, and within the user's requested scope. Hand material changes to the owning workflow.

## Use actor terms precisely

- **Actor**: a stable human role, external party, external system, or device that directly interacts with the system under consideration.
- **Human role**: a role a person adopts for a business purpose; it is not an individual, named person, or permission bundle. A profession or job title qualifies only when it represents a distinct interaction responsibility.
- **External party**: an organization or party that interacts as a distinct participant where modeling only its internal human role would lose material responsibility or authority.
- **External system or device**: a system or device outside the system boundary that directly supplies, requests, or receives behavior relevant to an actor goal.
- **Actor candidate**: a provisional participant identified by Product Vision, evidence, domain analysis, or use-case discovery but not yet admitted to the authoritative catalog.
- **Actor generalization**: a justified relationship in which specialized actors inherit the interaction role of a broader actor; use it only when the shared role is stable and useful.

Do not equate any of the following without evidence:

- target user, beneficiary, stakeholder, persona, customer segment, job title, organization unit, or named person and actor without evidence of a distinct interaction role;
- actor and user account, identity record, authentication subject, authorization role, permission set, license, or subscription;
- external ecosystem and one external-system actor;
- internal software component, automated job, service, database, API, or domain object and actor;
- the same person performing several roles and one combined actor;
- an actor's participation in a subdomain and ownership of that subdomain or its information.

Name human actors as singular business roles recognized by domain experts. Use an external system's stable business identity rather than a vendor-specific component name when the concrete product is not itself material to the requirement.

## Load the authoritative context

Before asking substantive questions:

1. Read every applicable `AGENTS.md`.
2. Read the repository context map and follow its requirements and domain-modeling reading paths.
3. Read the authoritative Product Vision, domain glossary, business-domains artifact and diagrams, existing actor catalog, canonical actor template, use-case catalog and detailed specifications, business objects, domain rules, scope exclusions, constraints, stakeholder management, UX evidence, linked sources, applicable decisions, requirements workflow, artifact-lifecycle guidance, notation guidance, and definition of done when present.
4. Load only additional architecture, security, test, operations, or management context that materially informs the actor boundary.

The initial workflow requires product intent, domain language, and an overall system boundary sufficiently clear to distinguish an actor from a beneficiary, stakeholder, internal component, or adjacent-domain participant. A draft domain landscape should normally exist so actor participation can be tested against subdomains. If a material prerequisite is absent, identify the exact gap and hand it to the owning workflow rather than inventing it.

Use the repository's canonical actor template when one exists. Preserve the established location and compatible structure of an existing actor catalog. If neither exists, propose a minimal structure before creating one.

## Select the operating mode and baseline

Determine the mode from the user's request and existing artifacts. Ask only when materially ambiguous.

- **Initial draft:** turn target-user and participant candidates into the first reviewable actor catalog. It may remain incomplete when the user wants an early snapshot, provided its limitations and validation needs are explicit.
- **Refinement or correction:** reopen affected actor identities, boundaries, responsibilities, names, types, generalizations, or subdomain participation. Permit renaming, splitting, merging, adding, or retiring actors when evidence warrants it.
- **Alignment assessment:** evaluate the actor catalog against current vision, domains, use cases, business objects, glossary, stakeholder evidence, and system boundaries without writing unless the user authorizes changes.

For a refinement or correction, treat the current catalog as a baseline rather than unquestionable truth. Preserve unaffected content, identifiers, decisions, and lifecycle status. Avoid stylistic churn when meaning and evidence are unchanged.

## Establish the actor-analysis boundary

State provisionally:

- the system under consideration and its external boundary;
- target users, beneficiaries, and other participant candidates from the Product Vision;
- the subdomains and operational slice being analyzed;
- relevant adjacent organizations, systems, devices, and ecosystems;
- whether the aim is broad actor coverage or correction of a specific role boundary.

Ask the user to correct material coverage assumptions before detailed actor questions. Do not infer actors solely from screen labels, organization charts, access-control configurations, interface names, current accounts, or technical components.

## Build a candidate inventory

Create a visible working inventory from the Product Vision, glossary, domain landscape, source evidence, current actor catalog, stakeholder information, use cases, and UX research. On a later run, seed it with existing actors, IDs, lifecycle state, recorded uncertainties, and relevant relationships.

For each candidate record:

- provisional singular name and type;
- business purpose and coarse goals;
- defining responsibility, authority, or contribution;
- direct interaction with the system under consideration;
- participating subdomains;
- related target users, beneficiaries, stakeholders, personas, external systems, or roles;
- distinctions from overlapping candidates and whether one person may adopt multiple roles;
- representative primary or supporting use-case participation when available;
- source evidence, accountable expert, confidence, and status;
- plausible split, merge, generalization, exclusion, or externalization alternatives;
- disposition: unresolved, under analysis, ready to confirm, confirmed, rejected with rationale, or owned open question.

The inventory is an analytical aid, not the authoritative catalog. Do not assign a stable `ACT-NNN` identifier merely to preserve an unresolved candidate.

## Interview as a rigorous collaborative design partner

Tell the user that actor discovery, refinement, correction, or assessment is beginning. State that a fully proposed catalog will be written only after the understanding threshold is met, while an explicitly requested early draft may be written as a provisional snapshot after its current meaning and limitations are confirmed.

Ask the highest-value unresolved actor-boundary question next. Prefer one focused question per turn; group tightly related questions only when the user requests a faster questionnaire. Adapt questions to the evidence and preceding answers.

For each material candidate, establish only what is needed from the following:

- what business role or external responsibility makes the participant distinct;
- which outcomes or responsibilities motivate direct interaction;
- what the participant is authorized or accountable to decide, provide, request, or receive in business terms;
- where the participant crosses the system boundary and whether it is genuinely external;
- which subdomains and representative use cases it participates in;
- how it differs from similar roles, stakeholders, beneficiaries, personas, accounts, permission roles, systems, or devices;
- whether the same person or organization may adopt several actors, and under what business condition;
- whether specialization or generalization is materially useful;
- privacy, safety, regulatory, organizational, or trust-boundary considerations that affect the actor definition;
- evidence, accountable authority, and unresolved uncertainty.

Classify consequential statements as facts, assumptions, proposals, decisions, recommendations, or open questions. Challenge vague composite roles, actors defined only by a screen or permission, named individuals, organization-chart copies, unexamined “system” actors, internal components modeled as external, and actors whose only evidence is a legacy account type.

Do not force actor completeness before use-case discovery. When interaction details are not yet known, preserve a defensible draft actor and a validation condition. Use later use cases to refine the catalog rather than pretending the initial pass is final.

## Revise actors and preserve traceability

After material new evidence:

1. reconsider names, types, responsibilities, distinctions, and system-boundary placement;
2. split, merge, generalize, specialize, add, reject, or retire candidates as warranted;
3. update subdomain participation and links to use cases without importing scenario detail;
4. identify impacts on Product Vision target users, glossary terms, domains, use cases, business objects, stakeholder management, UX, security, or architecture;
5. explain material revisions before moving to the next question.

Use stable identifiers without letting them freeze a defective actor model:

- assign `ACT-NNN` only when a candidate enters the authoritative catalog;
- keep the ID for a rename or clarified boundary that preserves the same business interaction role;
- on a split, retain the original ID only for a clearly continuous role and assign new IDs to genuinely new roles; otherwise retire the original and assign new IDs to all successors;
- on a merge, retain an existing ID only when one role clearly continues and absorbs another; otherwise create a new ID and retire the predecessors;
- retire an actor whose interaction role no longer exists and never reuse its ID;
- record material predecessor and successor relationships and the evidence or decision behind the correction.

Keep the identifier as raw text such as `ACT-001` in the first catalog-table column when repository validation discovers definitions there.

## Validate actor coverage

Test the candidates against:

- every Product Vision target-user group and beneficiary;
- every cataloged use case's primary and supporting actors;
- every subdomain with direct human, organizational, system, or device interaction;
- representative normal, alternative, error, correction, and boundary scenarios;
- external interfaces or devices supported by actual requirements rather than implementation inference;
- stakeholder and UX evidence that distinguishes interacting roles from non-interacting interests or personas.

Every candidate should have an explicit disposition. A target user need not become an actor if it does not interact, and an external actor need not be a target user or beneficiary. Record unexplained gaps, duplicate roles, incompatible names, or boundary ambiguity as owned findings.

## Determine readiness

An early draft is ready when the system boundary and current candidate coverage are clear, every shown actor is visibly proposed or previously accepted, known gaps and validation needs are explicit, the user confirms the snapshot, and the catalog remains `draft`.

A reviewable actor catalog is ready when:

- every actor directly interacts with the system under consideration;
- each actor has a distinct business role, responsibility, or external contribution;
- actor names and meanings agree with the glossary;
- target users, beneficiaries, stakeholders, personas, permission roles, accounts, internal components, and actors are not conflated;
- subdomain participation is explicit without implying ownership;
- available use cases reference only cataloged actors, or unresolved candidates are visibly owned;
- overlaps, composite roles, missing external actors, and system-boundary questions are resolved or explicitly owned;
- stable IDs are unique and lifecycle changes preserve traceability;
- evidence and accountable authority are visible.

Do not demand perfect knowledge. External-system actors and role refinements may emerge during use-case or business-object analysis. Retain non-blocking uncertainty with an owner and resolution condition.

## Confirm the understanding

Before writing, present a concise synthesis containing:

- system boundary and analyzed slice;
- actors to add, retain, rename, split, merge, generalize, specialize, or retire;
- each actor's type, defining role, interaction boundary, participating subdomains, and representative use-case involvement;
- target-user candidates or stakeholders deliberately excluded from the actor catalog and why;
- coverage findings, material alternatives, and rejected candidates;
- facts, assumptions, recommendations, decisions, and open questions;
- exact handoffs required for Product Vision, glossary, domains, use cases, business objects, stakeholder management, UX, security, architecture, or decisions;
- known evidence limitations.

Ask the user to confirm or correct the synthesis as an accurate representation of the current understanding. Confirmation does not make the catalog complete, optimal, or accepted. Record the lifecycle status and accountable authority that actually apply.

## Create or update the actor artifacts

After confirmation:

1. Update the authoritative actor catalog using the canonical template.
2. Keep the catalog concise; place detailed research and interview evidence in linked source or UX artifacts.
3. Use stable actor identifiers consistently and preserve rename, split, merge, and retirement traceability.
4. Link Product Vision target users, subdomains, use cases, glossary terms, stakeholder evidence, constraints, and decisions rather than duplicating their content.
5. Keep a new or materially changed catalog in `draft` unless the accountable authority explicitly approves another status.
6. Maintain a retired-actors section; never delete or reuse a retired ID merely to make the active table tidy.
7. Apply only authorized, meaning-preserving secondary-artifact repairs. Produce precise handoffs for material changes owned elsewhere.
8. Do not create use-case scenarios, personas, journeys, permission matrices, account models, architecture, APIs, schemas, or implementation plans unless separately requested.

An actor-only diagram is optional and should be created only when hierarchy or system-boundary relationships are materially clearer graphically than in the catalog. Do not duplicate the Use-case Landscape's actor-to-goal associations in a second diagram.

## Validate and report

Critically compare the completed catalog with the confirmed synthesis and evidence. Verify names, types, identifiers, subdomain participation, use-case references, lifecycle state, and retired actors; confirm that no candidate was silently promoted and no actor became a permission role, persona, stakeholder, component, or data object.

Run repository documentation validation when available. If configured tooling is unavailable, do not rebuild or replace it; perform feasible manual checks and report the skipped validation and impact.

Report changed files, actor changes and lifecycle status, coverage findings, material alternatives, cross-artifact handoffs, validation performed, remaining assumptions and open questions, and residual limitations. Do not present a provisional catalog as exhaustive or accepted.
