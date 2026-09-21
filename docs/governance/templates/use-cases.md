# Use-case Catalog

- Status: draft
- Owner: Requirements
- Last reviewed: YYYY-MM-DD

Use this template for the authoritative overview of actor-goal use cases. Use the separate [use-case.md](use-case.md) template with `specify-use-case` for one individual Cockburn-style specification.

## Purpose and scope

State the system under consideration, the covered product or operational scope, and any explicit exclusions or deferred areas.

## How to read this catalog

- Each use case represents one goal of one primary actor and has exactly one primary subdomain.
- Supporting actors assist the interaction without owning its central goal.
- Participating subdomains supply or consume business facts without owning the central outcome.
- Use `UC-NNN` as the stable identifier. Preserve an identifier when wording changes without changing the actor goal; retire identifiers rather than reusing them.
- The catalog is authoritative for the overview. Individual Cockburn-style specifications, where present, are separate linked artifacts.

## Use-case landscape

Embed the rendered `use-case-landscape.svg` here and link its authoritative sibling source `use-case-landscape.puml` directly below it. Replace these filenames only when the repository's established naming convention requires another name.

Keep the PlantUML source authoritative and regenerate the SVG after every semantic or layout change. Show the overall domain, strategic groups, primary subdomains, contained use cases, and participating actors. Order groups Core, Supporting, then Generic; order subdomains and use cases by stable identifier. Use solid actor associations for primary actors and dashed associations for supporting actors, explain these styles once in a legend, and repeat actor symbols locally when that improves traceability without changing actor identity.

## Use-case catalog

| ID | Actor goal | Primary actor | Supporting actors | Primary subdomain | Participating subdomains | Status |
|---|---|---|---|---|---|---|
| UC-NNN | Verb-object goal with an observable business result | ACT-NNN | ACT-NNN or None | SD-NNN | SD-NNN or None | proposed |

## Coverage by subdomain

| Primary subdomain | Use cases | Coverage summary or explicit gap |
|---|---|---|
| SD-NNN Subdomain name | UC-NNN | Covered responsibilities, exclusions, deferrals, or unresolved gaps |

## Coverage by actor

| Actor | Primary use cases | Supporting participation | Coverage summary or explicit gap |
|---|---|---|---|
| ACT-NNN Actor name | UC-NNN | UC-NNN or None | Covered goals, exclusions, deferrals, or unresolved gaps |

## Boundary validation observations

Record material findings about goal boundaries, primary-subdomain ownership, participating subdomains, external responsibilities, overlaps, or gaps. Link to the authoritative domain or actor artifact when a finding requires a change there.

## Catalog evolution

| Use case | Change | Predecessor or successor | Rationale and evidence |
|---|---|---|---|
| UC-NNN | Renamed, split, merged, remapped, or retired | UC-NNN or None | Why the change preserves or replaces the actor goal |

## Retired use cases

Retain retired identifiers and never reuse them.

| ID | Former actor goal | Retirement reason | Successor use cases | Status |
|---|---|---|---|---|
| UC-NNN | Former verb-object goal | Why this goal no longer belongs in the active catalog | UC-NNN or None | retired |

## Alternatives and rejected candidates

| Candidate | Disposition | Rationale and evidence |
|---|---|---|
| Candidate goal | Rejected, merged, split, or deferred | Why it is not a distinct cataloged actor goal at present |

## Assumptions and open questions

| Type | Statement | Affected use cases | Owner | Resolution condition |
|---|---|---|---|---|
| Assumption or open question | Unconfirmed statement or unresolved issue | UC-NNN or All | Accountable role | Evidence, decision, or event needed to resolve it |

## Cross-artifact handoffs

| Target artifact or workflow | Required clarification or change | Evidence | Status |
|---|---|---|---|
| Product Vision, glossary, actors, domains, business objects, rules, requirements, UX, architecture, or decisions | Precise handoff without silently changing the owning artifact | Source or finding | open |

## Sources and related artifacts

- [Product Vision](../../requirements/vision.md)
- [Domain glossary](../../requirements/glossary.md)
- [Domain Landscape](../../requirements/domains/domains.md)
- [Actors](../../requirements/actors.md)
- [Scope exclusions](../../requirements/scope-exclusions.md)
- [Constraints and assumptions](../../requirements/constraints.md)
- Add direct links to evidence, decisions, business objects, requirements, and any individual use-case specifications that materially support this catalog.
