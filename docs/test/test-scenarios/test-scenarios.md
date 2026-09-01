# Test Scenarios

- Status: proposed
- Owner: Test
- Last reviewed: 2026-08-17

## Purpose and boundaries

`TS-001` through `TS-015` are the authoritative, coherent sample journeys for the prototype. They use synthetic people and organisations and fictitious commercial services. Real place names and airport identifiers are reference data only. The scenarios define reusable test data; they do not define source code, persistence, `StockItem` generation, or seeding mechanics. Those concerns belong to issues #12 and #13.

All journeys originate in Germany and visit South America. Dates are deliberately fixed in 2027 so later seeded runs are repeatable. The [catalog](catalogs.md) owns supplier and product definitions; scenarios reference catalog IDs rather than duplicating them.

## Scenario data

| ID | Travellers and customer | Style; dates | Itinerary and included catalog products | Constraints and expected outcome |
|---|---|---|---|---|
| TS-001 | `PER-000001` Ada Kern, solo adult/customer | budget; 6–15 Apr 2027 | BER–LIM–CUZ–LIM–BER; `PRD-000001`, `PRD-000029`, `PRD-000054`, `PRD-000092` | One checked bag; altitude-aware first day. One valid order for one traveller, with every component linked. |
| TS-002 | `PER-000002/003` Emil and Noor Brandt, adult couple; Emil customer | premium; 8–17 Jan | FRA–GIG–FRA; `PRD-000005`, `PRD-000030`, `PRD-000055`, `PRD-000093` | Double room, private transfer. One order with shared room and two traveller assignments. |
| TS-003 | `PER-000004/005/006/007` Lin and Mia Vogel with children Jan (9), Liv (6); Lin customer | family; 3–14 Aug | MUC–GRU–MUC; `PRD-000006`, `PRD-000031`, `PRD-000056`, `PRD-000094`, `PRD-000117` | Two adjoining rooms; child ages retained at departure. Four travellers, one customer, protection covers all four. |
| TS-004 | `PER-000008/009` Mara and Theo Winter, adult couple; Mara customer | adventure; 10–22 Nov | FRA–SCL–PUQ–SCL–FRA; `PRD-000007`, `PRD-000032`, `PRD-000057`, `PRD-000095` | Maximum guided group 12; cold-weather note. Multi-leg order is chronologically valid. |
| TS-005 | `PER-000010` Nils Urban, solo adult/customer | premium; 2–9 May | BER–EZE–BER; `PRD-000008`, `PRD-000033`, `PRD-000058`, `PRD-000096` | Late arrival requires transfer after 22:00. Transfer and hotel dates align with flight arrival. |
| TS-006 | `PER-000011/012/013` Sara and Uwe Roth with child Lio (12); Sara customer | family; 5–16 Jul | FRA–BOG–FRA; `PRD-000009`, `PRD-000034`, `PRD-000059`, `PRD-000097` | Triple occupancy and bilingual guide. Three traveller assignments; capacity is not exceeded. |
| TS-007 | `PER-000014/015` Cleo and Ivo Seidel, adult couple; Cleo customer | adventure; 12–24 Feb | MUC–UIO–MUC; `PRD-000010`, `PRD-000035`, `PRD-000060`, `PRD-000079`, `PRD-000098` | Day boat requires transfer connection and maximum 16 participants. Components form one feasible sequence. |
| TS-008 | `PER-000016` Jona Falk, solo adult/customer | budget; 1–11 Jun | FRA–LIM–CUZ–LIM–FRA; `PRD-000011`, `PRD-000036`, `PRD-000061`, `PRD-000099` | Rail baggage limit recorded; no inaccessible overnight connection. Rail and flights belong to the same journey. |
| TS-009 | `PER-000017/018/019/020` Pia and Tom Berg with children Zoe (15), Ole (10); Pia customer | premium; 18–31 Mar | FRA–GIG, coastal cruise to Buenos Aires, EZE–FRA; `PRD-000012`, `PRD-000037`, `PRD-000062`, `PRD-000080`, `PRD-000100` | Two cabins and two rooms; cruise disembarkation precedes return flight. Four travellers share one multi-city order. |
| TS-010 | `PER-000021` Ravi Blum, solo adult/customer | adventure; 4–18 Dec | MUC–SCL–PUQ–SCL–MUC; `PRD-000013`, `PRD-000038`, `PRD-000063`, `PRD-000101` | Driver eligibility and vehicle category SUV. Rental pickup/return and traveller assignment validate. |
| TS-011 | `PER-000022/023` Anja and Luis Kraft, adult couple; Anja customer | budget; 9–20 Sep | BER–GRU, coach to Rio, GIG–BER; `PRD-000014`, `PRD-000039`, `PRD-000064`, `PRD-000102` | One overnight coach; two separate hotel stays. Multi-city arrival and departure differ without a gap. |
| TS-012 | `PER-000024/025` Esra and Finn Haas, adult couple; Esra customer | premium; 7–21 Oct | FRA–BOG–GIG–FRA; `PRD-000015`, `PRD-000040`, `PRD-000065`, `PRD-000103`, `PRD-000118` | Private services and cancellation protection. Both destination stays and protection link to both travellers. |
| TS-013 | `PER-000026/027/028/029/030` Kim and Sam Wolf with children Ava (14), Ben (11), Evi (5); Kim customer | family; 20 Jul–2 Aug | MUC–LIM–MUC; `PRD-000016`, `PRD-000041`, `PRD-000066`, `PRD-000104`, `PRD-000119` | Family room plus twin room; child-friendly activity. Occupancy totals five and coverage includes all travellers. |
| TS-014 | `PER-000031` Oda Link, solo adult/customer | budget; 6–19 Nov | BER–EZE–SCL–BER; `PRD-000017`, `PRD-000042`, `PRD-000067`, `PRD-000105` | Surface transfer within Buenos Aires excluded explicitly. Multi-city flights and both stays remain valid. |
| TS-015 | `PER-000032/033/034/035` Vera and Yan Koch with children Max (8), Ida (3); Vera customer | family; 11–23 Apr | FRA–UIO–FRA; `PRD-000018`, `PRD-000043`, `PRD-000068`, `PRD-000081`, `PRD-000106`, `PRD-000120` | Child seat and minimum activity age 3. All services accept four travellers and required child equipment. |

## Coverage matrix

`X` means the scenario deliberately exercises the characteristic.

| ID | Solo | Couple | Family | Budget | Premium | Adventure | Multi-leg / city | Flight | Stay | Transfer / road / rail / rental | Boat / cruise | Guided / activity | Other |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| TS-001 | X | | | X | | | X | X | X | X | | X | |
| TS-002 | | X | | | X | | | X | X | X | | X | |
| TS-003 | | | X | | | | | X | X | X | | X | X |
| TS-004 | | X | | | | X | X | X | X | X | | X | |
| TS-005 | X | | | | X | | | X | X | X | | X | |
| TS-006 | | | X | | | | | X | X | X | | X | |
| TS-007 | | X | | | | X | | X | X | X | X | X | |
| TS-008 | X | | | X | | | X | X | X | X | | X | |
| TS-009 | | | X | | X | | X | X | X | X | X | X | |
| TS-010 | X | | | | | X | X | X | X | X | | X | |
| TS-011 | | X | | X | | | X | X | X | X | | X | |
| TS-012 | | X | | | X | | X | X | X | X | | X | X |
| TS-013 | | | X | | | | | X | X | X | | X | X |
| TS-014 | X | | | X | | | X | X | X | X | | X | |
| TS-015 | | | X | | | | | X | X | X | X | X | X |

Coverage includes Brazil, Argentina, Chile, Peru, Colombia, and Ecuador; urban, high-altitude, Patagonia, coast, and inland contexts; direct journey patterns, connections, open-jaw/multi-city routes, and stays from 7 to 14 nights.

## Entity-model mapping and validation hints

- Create one `Person` per `PER-*`; assign `person/traveller` to every participant and `person/customer` only to the named customer. The customer owns the future `order/header`.
- Create each `ORG-*` once as an `Organisation` with the applicable supplier `OrgaRole`. Create each referenced `PRD-*` product once as a reusable `TouristicProductItem`, owned by its supplier role. Product composition is recursive: journeys contain legs/services; accommodation products may contain room categories.
- Later work may instantiate dated `StockItem`s from products and `order/position`s from stock. This specification intentionally contains neither. Issue #12's [seed data](../../../backend/scripts/seed/README.md) does this, sourced from this document and [catalogs.md](catalogs.md).
- Validate referential integrity, traveller age on departure, occupancy/capacity, chronological continuity, airport codes, supplier ownership, and that every order position identifies its travellers.
- Flexible keys and values are governed by the [terminology catalog](../../architecture/entity-model/terminology.md). Scenario prose such as style and constraints is test intent, not permission to invent entity properties.

## Acceptance and review record

The set contains exactly 15 stable scenario IDs, all Germany-to-South-America, with synthetic identities and organizations. The matrix was independently reconciled against the rows; catalog references were checked for existence and each represented catalog category contains ten unused alternatives. Airport and airline-code evidence and limitations are recorded separately. Stakeholder acceptance and executable seeded-data validation remain outstanding.
