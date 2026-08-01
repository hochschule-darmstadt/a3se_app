# DR-0009: Preserve the authoritative document when growing topics

- Status: accepted
- Date: 2026-08-01
- Deciders: project owner and management
- Supersedes: DR-0006 in part

## Context

DR-0006 introduced topic growth from a single file into a same-named directory with a README and supporting files. Its wording allowed the routing README to be mistaken for the authoritative specification. That interpretation mixes navigation with subject matter, makes included diagrams appear to be separate reading obligations, and loses the stable same-named document inside the grown topic.

## Decision drivers

- one authoritative document for each topic;
- a concise routing README for every directory;
- a predictable reading path for humans and agents;
- diagrams embedded in the specification while their sources and renders remain adjacent supporting assets;
- stable topic naming before and after growth.

## Considered options

- Make `README.md` the authoritative topic document: fewer files, but mixes routing and specification responsibilities.
- Keep only constituent documents after growth: flexible, but removes one authoritative topic document and complicates reading paths.
- Preserve a same-named authoritative document and add a routing README: one extra small file, but keeps authority and navigation explicit.

## Decision

A topic begins as `topic.md`. When it grows, replace that path with a `topic/` directory containing:

- `README.md`, a concise routing page;
- `topic.md`, the authoritative topic specification;
- any constituent documents, diagram sources, generated renders, or other supporting assets.

The routing README declares a `Topic document` link to the same-named Markdown file and directs readers there. It does not duplicate the specification. The authoritative document embeds the derived images needed for normal review, so readers need not open diagram sources or rendered assets individually.

Multi-document collections that were not grown from one authoritative topic, such as standards, workflows, decisions, or source evidence, retain their collection README and do not require a same-named topic document.

## Consequences

### Positive

- Topic authority remains explicit and stable after growth.
- Directory navigation stays concise.
- Readers follow one specification rather than assembling meaning from assets.
- Structural validation can verify declared topic documents.

### Negative and risks

- Every grown topic contains both a README and a same-named Markdown file.
- Existing grown topics and links require migration to the clarified structure.
- Contributors must distinguish grown topics from multi-document collections.

## Validation and revisit triggers

Harness validation checks that every declared topic document exists and has the same basename as its containing directory. Revisit if the distinction between grown topics and collections remains ambiguous or creates recurring navigation errors.

## Links

- [Documentation context map](../../README.md)
- [DR-0006](0006-align-harness-with-lifecycle-terminology.md)
- [Definition of done](../workflows/definition-of-done.md)
