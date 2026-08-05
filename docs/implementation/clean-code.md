# Clean Code

- Status: accepted
- Owner: Implementation
- Last reviewed: 2026-08-05

## Purpose and authority

These rules apply to production code, proof-of-concept code, tests, scripts, generated artifacts, and configuration unless a narrower rule explicitly says otherwise. Technology guides define how to realise them idiomatically. Requirements, accepted architecture, and decision records take precedence.

Normative terms use the meanings defined in [requirements terminology](../requirements/README.md): `shall` is mandatory, `should` is the expected choice unless a justified exception exists, and `may` permits an option.

## Structure and dependencies

- Code shall follow the accepted modules, interfaces, layer direction, and acyclic dependency rules of the [software architecture](../architecture/software-architecture/software-architecture.md).
- A module shall expose a small public application interface. Its domain internals, persistence adapters, transport adapters, and implementation types shall remain private.
- Cross-module access shall use the owning module's interface, identifiers, projections, or exchanged representations. Code shall not import another module's internals or access its storage directly.
- Business rules shall remain independent of UI, transport, database, and agent frameworks.
- Generated code shall be identifiable, reproducible, and never edited by hand.

## Readability and design

- Names shall use the project glossary and express business intent. Abbreviations, vague containers such as `data` or `manager`, and names that encode an obsolete implementation shall be avoided.
- A function, class, component, or module shall have one coherent responsibility and operate at one level of abstraction.
- Side effects, state changes, ownership, and transaction boundaries shall be explicit. Hidden global state and import-time behaviour are prohibited.
- Guard clauses should make invalid and exceptional paths visible. Boolean parameters with unclear call-site meaning and unexplained literal values shall be replaced by named concepts.
- Duplication of stable knowledge shall be removed. Superficially similar code shall not be unified when its business rules or change reasons differ.
- Optimisation shall follow measured evidence. A necessary non-obvious optimisation shall document its evidence and trade-off.

## Types, contracts, and validation

- Public and module boundaries shall use explicit types and contracts. Money, currency, time, identifiers, quantities, lifecycle states, and other domain concepts shall not degrade into ambiguous primitives.
- Untrusted input shall be validated at its trust boundary. Domain invariants shall also be protected by the owning module and not rely solely on a UI or transport check.
- Flexible properties shall use the versioned definitions, vocabularies, types, and validators specified by the [entity model](../architecture/entity-model/entity-model.md); an unrestricted key/value map is not a valid domain contract.
- Nullability, optionality, defaults, units, time zones, and inclusive or exclusive boundaries shall be explicit.

## Errors and observability

- Validation, business-rule, authorisation, concurrency, and infrastructure failures shall remain distinguishable and shall be translated only at an appropriate boundary.
- Code shall not swallow failures, expose internal details to clients, or use exceptions as ordinary branch control.
- Logs shall be structured and useful for correlating an operation across boundaries. Secrets, credentials, payment data, and unnecessary personal data shall not be logged.
- Significant state changes and product-agent tool calls shall produce the audit evidence required by the architecture and requirements.

## Code documentation

- Public APIs and module interfaces shall document purpose, inputs, outputs, errors, side effects, authorisation, transaction or concurrency semantics, and important invariants where applicable.
- Every function and method shall be documented when its contract, behaviour, constraints, side effects, or rationale are not completely evident from its name, type signature, and implementation. Internal functions shall receive the same level of documentation whenever they contain knowledge needed for safe maintenance or correct reuse.
- Non-obvious algorithms, business rules, workarounds, and performance choices shall explain *why* they exist and link to the authoritative requirement, decision, or issue.
- Examples shall be provided for contracts whose correct use is not evident from their signature. Examples shall use synthetic data.
- Comments shall not paraphrase obvious code or compensate for poor naming. Stale documentation is a defect and shall be changed with the code.
- Technology-specific guides define the required native notation. Architecture and business facts shall be linked, not duplicated in code comments.

## Tests and change safety

- Tests shall cover observable behaviour, normal and alternative paths, boundary values, failures, and relevant concurrency. They shall not primarily assert private implementation structure.
- A defect fix shall include a regression test where automated reproduction is feasible.
- Tests shall be deterministic, isolated, readable, and use synthetic data. Time, randomness, external services, and concurrency shall be controlled explicitly.
- Module-boundary, API-contract, persistence-integration, accessibility, and architecture tests shall be added where those risks exist.
- A change shall update affected specifications, generated contracts, examples, and validation evidence in the same change.

## Dependencies, configuration, and security

- Dependencies shall be necessary, maintained, version-controlled through a reproducible lock mechanism, and permitted by NFR-003. Mandatory paid features are prohibited.
- Configuration shall be typed, validated at startup, environment-specific, and separate from code. Secrets shall never be committed or exposed to browser code.
- External input, files, URLs, queries, and agent operations shall be treated as untrusted. Least privilege and allow-listing shall be applied at every boundary.

## Required quality gate

A change shall pass the configured formatter, linter, static type checks, automated tests, architecture and contract checks, dependency and licence checks, security checks, build, and documentation-link validation. The repository definition of done remains authoritative for the complete gate.

A suppression or exception shall be local, explain the reason, identify the owning issue where follow-up is needed, and be reviewable. Project-wide weakening of a rule requires a recorded decision.
