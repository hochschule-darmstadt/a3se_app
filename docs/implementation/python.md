# Python

- Status: accepted
- Owner: Implementation
- Last reviewed: 2026-08-05

This guide supplements [Clean Code](clean-code.md). Python is selected for the modular backend and initial product-agent orchestration.

## Implementation rules

- Packages shall be organised by accepted architecture module, not as global controller, service, model, and repository folders.
- Domain and application packages shall not import FastAPI, Pydantic transport models, Neo4j driver types, or agent-framework types.
- Public functions, methods, attributes, and module interfaces shall have complete type annotations. Ambiguous identifiers, money, time, quantities, and states shall use explicit domain types.
- PEP 8 naming and layout shall be followed and enforced automatically. Import-time side effects, mutable default arguments, wildcard imports, and hidden global service locators are prohibited.
- Asynchronous code shall be used for genuinely asynchronous I/O and remain asynchronous through the call path. Blocking work shall not run on the event loop.
- External resources shall use explicit lifetime management. Exception chaining shall preserve causes while boundary translation protects internal details.

## Documentation notation

- Public modules, classes, functions, methods, and module interfaces shall use PEP 257 docstrings.
- Multi-line docstrings shall consistently use the selected project convention with sections equivalent to `Args`, `Returns`, `Raises`, `Yields`, and `Examples` where applicable.
- Docstrings shall document semantics, invariants, side effects, transactions, concurrency, and authorisation; they shall not repeat type annotations.
- Functions and methods with non-obvious caller obligations or guaranteed outcomes shall additionally document their preconditions and postconditions explicitly. Preconditions shall state what must already be true before the call; postconditions shall state the guaranteed state or result after successful completion. These conditions shall link to the owning invariant or requirement where applicable and shall not merely repeat type annotations.
- Internal functions and methods covered by the cross-technology documentation rule shall use the same PEP 257 docstring convention as public code.

## Verification

The backend gate shall include formatting, linting, strict static type analysis, unit and integration tests, architecture checks, and package build or import validation.

## Primary references

- [PEP 8](https://peps.python.org/pep-0008/)
- [PEP 257](https://peps.python.org/pep-0257/)
- [Python typing](https://docs.python.org/3/library/typing.html)
