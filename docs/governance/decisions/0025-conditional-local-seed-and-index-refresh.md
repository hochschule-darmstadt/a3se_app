# DR-0025: Refresh local seed data and advisor index from persisted fingerprints

- Status: accepted
- Date: 2026-09-11
- Deciders: project owner and engineering
- Supersedes: DR-0014 in part (ordinary local startup behavior)

## Context

The local API previously required a separate seed operation and rebuilt the
advisor index on every API start. That made normal startup slow while also
making it easy to run the API against an empty graph or a stale index. The
seed JSON files, glossary, and the code that interprets them are available in
the local Compose environment.

## Decision

Persist a JSON manifest in the `advisor-state` volume. It stores separate
SHA-256-derived fingerprints for seed inputs and logic, and for advisor-index
inputs and logic, plus the embedding model and index schema version.

- First startup, an empty graph, a seed fingerprint change, or
  `CCT_FORCE_SEED=1` resets and reseeds the disposable local graph.
- A seed refresh always rebuilds the advisor index.
- An index-only fingerprint change rebuilds the index without reseeding.
- Unchanged fingerprints reuse the existing local Qdrant collection.
- The explicit `seed` and `seed-reset` jobs remain available and always
  reseed/rebuild, which is useful after an intentional local reset.

The logic fingerprints include the relevant source files, so changes to seed
or index implementation are detected without relying only on file timestamps.
The embedding model and index schema are explicit manifest inputs so changing
either also invalidates the index.

## Consequences and limitations

This removes the normal repeated seed/index wait while preserving deterministic
recovery after relevant changes. It is deliberately a local-development
mechanism, not a migration system or a distributed freshness protocol. A seed
fingerprint change is destructive to the disposable graph and can remove
staff-created local records. Staff edits to products do not currently update
the manifest or index, so the explicit rebuild script remains necessary for
those edits. The manifest and Qdrant collection are separate persisted
volumes; manually deleting only one can leave inconsistent state. The API
detects an empty graph and a missing Qdrant collection, but operators should
reset the related local volumes together when repairing storage.

## Links

- [Local development runbook](../../operations/local-development.md)
- [Implemented backend advisor architecture](../../architecture/software-architecture/backend-architecture.md#22-ai-travel-advisor-implemented-backend)
- [DR-0014](0014-deterministic-seed-data-and-compose-seeding.md)
- [Issue #46](https://github.com/hochschule-darmstadt/a3se_app/issues/46)
