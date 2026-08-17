# Reusable Test-data Catalogs

- Status: proposed
- Owner: Test/Requirements
- Last reviewed: 2026-08-17

## Taxonomy and rules

Catalog IDs are stable synthetic identifiers. Supplier categories are `airline`, `accommodation`, `mobility`, `water`, `experience`, and `protection`; product IDs use `FLT`, `ACC`, `MOB`, `WTR`, `EXP`, and `OTH`. Every scenario-used item is defined below. Each represented category also has exactly ten explicit reserve entries, none consumed by `TS-001`–`TS-015`. Names do not identify operating businesses.

## Scenario-used suppliers

| ID | Organisation name | OrgaRole type | Notes |
|---|---|---|---|
| SUP-AIR-01 | Condorleaf Air | `partner/supplier/airline` | Fictional, non-operational; synthetic designator `0Q` |
| SUP-AIR-02 | Blue Pampa Airways | `partner/supplier/airline` | Fictional, non-operational; synthetic designator `1Q` |
| SUP-ACC-01 | Southlight Stays | `partner/supplier/accommodation` | Fictional accommodation group |
| SUP-MOB-01 | Meridian Groundways | `partner/supplier/mobility` | Fictional transfer, coach, rail, and rental supplier |
| SUP-WTR-01 | Pelican Passage | `partner/supplier/water-transport` | Fictional boat and cruise supplier |
| SUP-EXP-01 | Andes & Atlantic Guides | `partner/supplier/experience` | Fictional guided-tour/activity supplier |
| SUP-OTH-01 | Safepath Travel Cover | `partner/supplier/protection` | Fictional protection supplier; no real policy |

## Scenario-used products

| IDs | Supplier | Type | Definition |
|---|---|---|---|
| FLT-01…FLT-15 | SUP-AIR-01/02 | `product/flight` | The flight sequences written in the corresponding `TS-nnn`; each leg has departure/arrival IATA code, local times, numeric flight number, and supplier designator. |
| ACC-01…ACC-15 | SUP-ACC-01 | `product/accommodation/room-category` | Corresponding destination stay; capacity and room count follow its scenario constraints. |
| MOB-01…MOB-15 | SUP-MOB-01 | `product/mobility/transfer`, `/rail`, `/coach`, or `/vehicle-rental` | Ground component described in the corresponding scenario. MOB-08 is rail, MOB-10 rental, MOB-11 coach; others are transfers. |
| WTR-01…WTR-03 | SUP-WTR-01 | `product/water/day-boat` or `product/water/cruise` | WTR-01 and WTR-03 are day boats; WTR-02 is the Rio–Buenos Aires cruise. |
| EXP-01…EXP-15 | SUP-EXP-01 | `product/experience/guided-tour` or `product/experience/activity` | Guided or activity component and capacity constraint in the corresponding scenario. |
| OTH-01…OTH-04 | SUP-OTH-01 | `product/protection/travel` | Synthetic travel-protection variants for the referenced traveller group. |

## Ten unused supplier entries per category

| Category | Additional supplier IDs and names |
|---|---|
| airline | SUP-AIR-11 Alderwing Air; 12 Brisa Meridian; 13 Copper Kite; 14 Estuary Air; 15 Fjordleaf Aviation; 16 Golden Tern; 17 Horizon Quipu; 18 Indigo Pampas; 19 Juniper Condor; 20 Kestrel Sur |
| accommodation | SUP-ACC-11 Amber Courtyard; 12 Bramble House; 13 Cloudstep Lodges; 14 Dune Lantern; 15 Estrella Rooms; 16 Fern Plaza; 17 Granite Patio; 18 Harbour Loom; 19 Indigo Terrace; 20 Jacaranda Rest |
| mobility | SUP-MOB-11 Atlas Shuttle; 12 Birch Roadways; 13 Cobalt Transit; 14 Delta Wheels; 15 Ember Rail; 16 Fieldstone Coaches; 17 Green Mile Hire; 18 Highplain Transfer; 19 Iris Mobility; 20 Juno Routes |
| water | SUP-WTR-11 Albatross Wake; 12 Bayleaf Voyages; 13 Current & Cove; 14 Dolphin Passage; 15 Estuary Sail; 16 Foamline Cruises; 17 Gullwater; 18 Harbour Finch; 19 Island Thread; 20 Juniper Wake |
| experience | SUP-EXP-11 Altitude Stories; 12 Barrio Walks; 13 Canopy Compass; 14 Desert Lantern; 15 Estuary Encounters; 16 Forest Notebook; 17 Glacier Steps; 18 Heritage Thread; 19 Island Lens; 20 Jungle Almanac |
| protection | SUP-OTH-11 Amber Shield; 12 Borderless Cover; 13 Compass Guard; 14 Departure Safe; 15 Evergreen Assist; 16 Farway Cover; 17 Globe Shelter; 18 Horizon Help; 19 Itinerary Guard; 20 Journey Safeguard |

## Ten unused product entries per category

| Category | Additional product IDs and names |
|---|---|
| flight | FLT-21 Atlantic Connector; 22 Andes Link; 23 Pampa Hopper; 24 Pacific Arc; 25 Equator Link; 26 Patagonia Shuttle; 27 Amazon Connector; 28 Southern Cross; 29 Coastal Link; 30 Capital Pair |
| accommodation | ACC-21 Courtyard Double; 22 Family Loft; 23 Riverside Twin; 24 Garden Triple; 25 City Single; 26 Harbour Suite; 27 Mountain Family; 28 Patio Double; 29 Forest Cabin; 30 Plaza Twin |
| mobility | MOB-21 Airport Shared Transfer; 22 Private City Transfer; 23 Intercity Rail; 24 Overnight Coach; 25 Compact Rental; 26 SUV Rental; 27 Accessible Van; 28 Child-seat Transfer; 29 Harbour Shuttle; 30 Station Transfer |
| water | WTR-21 Bay Day Boat; 22 River Launch; 23 Coastal Cruise; 24 Island Ferry; 25 Wildlife Skiff; 26 Lake Crossing; 27 Sunset Sail; 28 Channel Cruise; 29 Harbour Boat; 30 Estuary Passage |
| experience | EXP-21 Historic Centre Walk; 22 Market Workshop; 23 Mountain Day Hike; 24 Museum Guide; 25 Wildlife Excursion; 26 Food Trail; 27 Cycling Tour; 28 Archaeology Visit; 29 Coastal Hike; 30 Family Nature Activity |
| protection | OTH-21 Basic Cancellation; 22 Premium Cancellation; 23 Family Medical; 24 Adventure Medical; 25 Baggage Delay; 26 Connection Protection; 27 Cruise Protection; 28 Rental Excess; 29 Multi-city Cover; 30 Long-stay Cover |

Reserve entries are discovery fixtures, not sellable inventory. A future seed specification must materialize them as organisations/products only unless separate stock rules authorize more.
