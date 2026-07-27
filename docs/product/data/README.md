# Data Modeling and Governance

- Status: draft
- Owner: Domain/Data/Architecture
- Last reviewed: 2026-07-22

Progress from business meaning to implementation:

1. Conceptual model: domain concepts, relationships, ownership, and terminology.
2. Logical model: attributes, identifiers, cardinalities, integrity rules, lifecycle, and history needs.
3. Physical model: technology-specific schemas chosen only after an ADR.

Models must respect bounded contexts and information ownership. Link sensitive information to [data classification](../../engineering/security/data-classification.md), retention, privacy, and access requirements. AI-generated models require domain review; plausible entity names do not establish real business semantics.
