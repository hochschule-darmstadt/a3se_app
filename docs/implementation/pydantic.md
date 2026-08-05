# Pydantic

- Status: accepted
- Owner: Implementation
- Last reviewed: 2026-08-05

This guide supplements [Clean Code](clean-code.md) and [Python](python.md). Pydantic is selected for trust, transport, product-agent tool, and exchanged-representation contracts.

## Implementation rules

- Contract models shall be separate from domain entities unless a deliberate review proves that their lifecycle and invariants are identical.
- Input, output, command, event, agent-tool, and persistence projections shall use separate models when their allowed fields or trust differ.
- Strict validation shall be used where coercion could change business meaning, including identifiers, money, dates, quantities, states, and controlled property values.
- Field validators shall handle local structural rules. Model validators may handle cross-field consistency. Validators shall not perform I/O, authorisation, orchestration, or persistence.
- Command models should reject unknown fields. Optionality and defaults shall reflect the contract rather than compensate for missing client data.
- Aliases shall represent an explicit external vocabulary or compatibility need. Serialisation modes and version changes shall be intentional.
- Flexible properties shall be validated against the applicable versioned property definitions and controlled vocabularies before reaching a module operation.

## Documentation notation

Models and non-obvious fields shall provide descriptions, constraints, examples, units, vocabulary references, and deprecation information through docstrings and schema metadata. Generated JSON Schema is the machine-readable documentation and shall not be hand edited.

## Verification

Each contract shall test accepted examples and rejection of wrong types, unknown values, missing mandatory properties, forbidden extras, and violated cross-field constraints.

## Primary references

- [Pydantic models](https://docs.pydantic.dev/latest/concepts/models/)
- [Pydantic validators](https://docs.pydantic.dev/latest/concepts/validators/)
- [Pydantic strict mode](https://docs.pydantic.dev/latest/concepts/strict_mode/)
