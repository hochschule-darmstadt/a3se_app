# AI-Assisted Re-Engineering

- Status: draft
- Owner: Architecture/Engineering/QA
- Last reviewed: 2026-07-22

Use a controlled evidence chain for brownfield work:

1. Inventory code, dependencies, data, interfaces, deployment, tests, and operational behavior.
2. Reverse-engineer current (`as-is`) architecture and behavior, with confidence and unknowns.
3. Identify problems, risks, constraints, and preservation requirements.
4. Perform impact analysis and define incremental restructuring options.
5. Select a target (`to-be`) design through ADRs.
6. Forward-engineer in reversible increments.
7. Validate behavior, quality, data migration, and operational outcomes against the baseline.

AI inference must not be confused with observed behavior. Machine-generated inventories such as SBOMs and SARIF findings may support analysis; runtime and stakeholder evidence remain necessary.
