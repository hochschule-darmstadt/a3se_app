# Agent Shared State

- Status: draft
- Owner: Orchestrator
- Last reviewed: 2026-07-21

This file defines the schema for durable coordination. For larger workloads, individual task records may live in a future `work/` directory. Chat history is not authoritative shared state.

## Active work

| Work ID | Goal | Owner | Inputs/affected IDs | Status | Output/evidence |
|---|---|---|---|---|---|

## Findings and conflicts

| Finding ID | Raised by | Claim and evidence | Severity/confidence | Affected IDs | Proposed action | Disposition/owner |
|---|---|---|---|---|---|---|

## Open decisions

| Decision ID | Question | Options/trade-offs | Accountable owner | Needed evidence | Due/status | Outcome link |
|---|---|---|---|---|---|---|

Allowed work status: `queued`, `in-progress`, `review`, `blocked`, `done`. A blocked item names the blocker and responsible owner.
