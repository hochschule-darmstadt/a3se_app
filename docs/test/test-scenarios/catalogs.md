# Reusable Test-data Catalogs

- Status: proposed
- Owner: Test/Requirements
- Last reviewed: 2026-08-17

## Taxonomy and rules

Catalog names are stable synthetic fixtures; entity IDs use system-wide prefixes and six-digit sequences. Supplier categories are `airline`, `accommodation`, `mobility`, `water`, `experience`, and `protection`; product entity IDs use `PRD`. Every scenario-used item is defined below. Each represented category also has exactly ten explicit reserve entries, none consumed by `TS-001`–`TS-015`. Names do not identify operating businesses.

## Scenario-used suppliers

| ID | Organisation name | OrgaRole type | Notes |
|---|---|---|---|
| ORG-000001 | Condorleaf Air | `organisation/airline` | Fictional, non-operational; synthetic designator `CA` |
| ORG-000002 | Blue Pampa Airways | `organisation/airline` | Fictional, non-operational; synthetic designator `BP` |
| ORG-000003 | Southlight Stays | `organisation/accommodation` | Fictional accommodation group |
| ORG-000004 | Meridian Groundways | `organisation/mobility` | Fictional transfer, coach, rail, and rental supplier |
| ORG-000005 | Pelican Passage | `organisation/water-transport` | Fictional boat and cruise supplier |
| ORG-000006 | Andes & Atlantic Guides | `organisation/experience` | Fictional guided-tour/activity supplier |
| ORG-000007 | Safepath Travel Cover | `organisation/protection` | Fictional protection supplier; no real policy |

## Scenario-used products

| IDs | Supplier | Type | Definition |
|---|---|---|---|
| PRD-000001…PRD-000018 | ORG-000001/02 | `product/flight` | The flight sequences written in the corresponding `TS-nnn`; each leg has departure/arrival IATA code, local times, complete airline-designated flight number (for example `CA509`), and supplier designator. |
| PRD-000029…PRD-000043 | ORG-000003 | `product/accommodation/room-type` | Corresponding destination stay; capacity and room count follow its scenario constraints. |
| PRD-000054…PRD-000068 | ORG-000004 | `product/mobility/transfer`, `/rail`, `/coach`, or `/vehicle-rental` | Ground component described in the corresponding scenario. PRD-000061 is rail, PRD-000063 rental, PRD-000064 coach; others are transfers. |
| PRD-000079…PRD-000081 | ORG-000005 | `product/water-transport/day-boat` or `product/water-transport/cruise` | PRD-000079 and PRD-000081 are day boats; PRD-000080 is the Rio–Buenos Aires cruise. |
| PRD-000092…PRD-000106 | ORG-000006 | `product/experience/guided-tour` or `product/experience/activity` | Guided or activity component and capacity constraint in the corresponding scenario. |
| PRD-000117…PRD-000120 | ORG-000007 | `product/protection/travel` | Synthetic travel-protection variants for the referenced traveller group. |

## Ten unused supplier entries per category

| Category | Additional supplier IDs and names |
|---|---|
| airline | ORG-000011 Alderwing Air; ORG-000012 Brisa Meridian; ORG-000013 Copper Kite; ORG-000014 Estuary Air; ORG-000015 Fjordleaf Aviation; ORG-000016 Golden Tern; ORG-000017 Horizon Quipu; ORG-000018 Indigo Pampas; ORG-000019 Juniper Condor; ORG-000020 Kestrel Sur |
| accommodation | ORG-000021 Amber Courtyard; ORG-000022 Bramble House; ORG-000023 Cloudstep Lodges; ORG-000024 Dune Lantern; ORG-000025 Estrella Rooms; ORG-000026 Fern Plaza; ORG-000027 Granite Patio; ORG-000028 Harbour Loom; ORG-000029 Indigo Terrace; ORG-000030 Jacaranda Rest |
| mobility | ORG-000031 Atlas Shuttle; ORG-000032 Birch Roadways; ORG-000033 Cobalt Transit; ORG-000034 Delta Wheels; ORG-000035 Ember Rail; ORG-000036 Fieldstone Coaches; ORG-000037 Green Mile Hire; ORG-000038 Highplain Transfer; ORG-000039 Iris Mobility; ORG-000040 Juno Routes |
| water | ORG-000041 Albatross Wake; ORG-000042 Bayleaf Voyages; ORG-000043 Current & Cove; ORG-000044 Dolphin Passage; ORG-000045 Estuary Sail; ORG-000046 Foamline Cruises; ORG-000047 Gullwater; ORG-000048 Harbour Finch; ORG-000049 Island Thread; ORG-000050 Juniper Wake |
| experience | ORG-000051 Altitude Stories; ORG-000052 Barrio Walks; ORG-000053 Canopy Compass; ORG-000054 Desert Lantern; ORG-000055 Estuary Encounters; ORG-000056 Forest Notebook; ORG-000057 Glacier Steps; ORG-000058 Heritage Thread; ORG-000059 Island Lens; ORG-000060 Jungle Almanac |
| protection | ORG-000061 Amber Shield; ORG-000062 Borderless Cover; ORG-000063 Compass Guard; ORG-000064 Departure Safe; ORG-000065 Evergreen Assist; ORG-000066 Farway Cover; ORG-000067 Globe Shelter; ORG-000068 Horizon Help; ORG-000069 Itinerary Guard; ORG-000070 Journey Safeguard |

## Ten unused product entries per category

| Category | Additional product IDs and names |
|---|---|
| flight | PRD-000019 Atlantic Connector; ORG-000022 Andes Link; ORG-000023 Pampa Hopper; ORG-000024 Pacific Arc; ORG-000025 Equator Link; ORG-000026 Patagonia Shuttle; ORG-000027 Amazon Connector; ORG-000028 Southern Cross; ORG-000029 Coastal Link; ORG-000030 Capital Pair |
| accommodation | PRD-000044 Courtyard Double; ORG-000022 Family Loft; ORG-000023 Riverside Twin; ORG-000024 Garden Triple; ORG-000025 City Single; ORG-000026 Harbour Suite; ORG-000027 Mountain Family; ORG-000028 Patio Double; ORG-000029 Forest Cabin; ORG-000030 Plaza Twin |
| mobility | PRD-000069 Airport Shared Transfer; ORG-000022 Private City Transfer; ORG-000023 Intercity Rail; ORG-000024 Overnight Coach; ORG-000025 Compact Rental; PRD-000073 SUV Rental; ORG-000027 Accessible Van; ORG-000028 Child-seat Transfer; ORG-000029 Harbour Shuttle; ORG-000030 Station Transfer |
| water | PRD-000082 Bay Day Boat; ORG-000022 River Launch; ORG-000023 Coastal Cruise; ORG-000024 Island Ferry; ORG-000025 Wildlife Skiff; ORG-000026 Lake Crossing; ORG-000027 Sunset Sail; ORG-000028 Channel Cruise; ORG-000029 Harbour Boat; ORG-000030 Estuary Passage |
| experience | PRD-000107 Historic Centre Walk; ORG-000022 Market Workshop; ORG-000023 Mountain Day Hike; ORG-000024 Museum Guide; ORG-000025 Wildlife Excursion; ORG-000026 Food Trail; ORG-000027 Cycling Tour; ORG-000028 Archaeology Visit; ORG-000029 Coastal Hike; ORG-000030 Family Nature Activity |
| protection | PRD-000121 Basic Cancellation; ORG-000022 Premium Cancellation; ORG-000023 Family Medical; ORG-000024 Adventure Medical; ORG-000025 Baggage Delay; ORG-000026 Connection Protection; ORG-000027 Cruise Protection; ORG-000028 Rental Excess; ORG-000029 Multi-city Cover; ORG-000030 Long-stay Cover |

Reserve entries are discovery fixtures, not sellable inventory. A future seed specification must materialize them as organisations/products only unless separate stock rules authorize more.

Issue #12's [seed data](../../../backend/scripts/seed/README.md) materializes every ID in this document -- reserve entries as `Organisation`/`TouristicProductItem` only, exactly as required above.
