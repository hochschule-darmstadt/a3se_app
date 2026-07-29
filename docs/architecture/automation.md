# Conversational, Workflow, and Multi-Agent Automation

- Status: draft
- Owner: Requirements/Architecture
- Last reviewed: 2026-07-29

Chatbots, workflow automation, and multi-agent systems must arise from a clear user or operational goal; do not add an LLM merely to satisfy a technology checklist.

For each proposed automation, define its goal, users, boundaries, non-AI fallback, inputs, outputs, tools, permissions, data classification, workflow and state model, failure and retry behavior, evaluation evidence, human oversight, and relevant security, privacy, cost, latency, availability, monitoring, audit, shutdown, and recovery concerns.

Runtime multi-agent designs must define responsibility, shared state, negotiation, termination, and evaluation. The repository's lifecycle agent responsibilities do not imply runtime product agents.
