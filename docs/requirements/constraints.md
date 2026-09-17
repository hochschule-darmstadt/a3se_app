# Constraints and Assumptions

- Status: draft
- Owner: Requirements/Architecture
- Last reviewed: 2026-09-17

| ID | Classification | Statement | Validation / review |
|---|---|---|---|
| ASM-001 | Business-model assumption | Each accommodation Organisation represents one individual hotel; hotel chains and their multi-property ownership are out of scope. Its locality is therefore presented with its name to distinguish the hotel in catalogue labels. | Revisit before supplier-chain or multi-property accommodation management is introduced. |
| ASM-002 | Search limitation | Airline Organisations have no locality in the seed data. This prevents an airline's home locality from being mistaken for a flight departure or arrival in the simplified location-aware search projection. | Revisit when flight endpoints and airline headquarters are represented separately in search. |
