# Conversational, Workflow, and Multi-Agent Automation

- Status: draft
- Owner: Product/Engineering
- Last reviewed: 2026-07-22

This area governs chatbots, workflow automation, and multi-agent systems. Features must arise from a clear user or operational goal; do not add an LLM merely to satisfy a technology checklist.

For each automation document:

- goal, users, boundaries, and non-AI fallback;
- inputs, outputs, tools, permissions, and data classification;
- workflow/state model and failure/retry behavior;
- model/provider selection criteria and portability;
- evaluation dataset, success measures, and human oversight;
- prompt-injection, data leakage, unsafe action, cost, latency, and availability risks;
- monitoring, auditability, and shutdown/recovery behavior.

Multi-agent designs must define responsibility, shared state, negotiation, termination, and evaluation. The repository's engineering agent roles are not automatically runtime product agents.
