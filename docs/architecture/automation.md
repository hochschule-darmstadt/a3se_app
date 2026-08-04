# Conversational, Workflow, and Multi-Agent Automation

- Status: draft
- Owner: Requirements/Architecture
- Last reviewed: 2026-08-04

Chatbots, workflow automation, and multi-agent systems must arise from a clear user or operational goal; do not add an LLM merely to satisfy a technology checklist.

For each proposed automation, define its goal, users, boundaries, non-AI fallback, inputs, outputs, tools, permissions, data classification, workflow and state model, failure and retry behavior, evaluation evidence, human oversight, and relevant security, privacy, cost, latency, availability, monitoring, audit, shutdown, and recovery concerns.

Runtime multi-agent designs must define responsibility, shared state, negotiation, termination, and evaluation. The repository's lifecycle agent responsibilities do not imply runtime product agents.

## Product-agent integration

[DR-0010](../governance/decisions/0010-adopt-python-centered-modular-technology-stack.md) selects a Python modular backend so conversational travel advice, booking assistance, and fulfilment support can initially reuse in-process module interfaces. A product agent shall invoke controlled tools backed by provided module operations; it shall not receive unrestricted database credentials or arbitrary write-query execution.

Read-oriented graph exploration shall use authorised query operations or controlled projections with bounded relationship types, path depth, result size, execution time, actor permissions, and audit records. Commands that change orders, stock, persons, partners, or products shall pass through the owning module's validation, authorisation, transaction, and audit behaviour. Deployment may later isolate an AI component without changing these logical tool contracts.
