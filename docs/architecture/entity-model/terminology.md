# Flexible Entity-model Terminology

- Status: proposed
- Owner: Architecture/Requirements
- Last reviewed: 2026-08-17

## Purpose and authority

This catalog is authoritative for logical entity type identifiers, flexible property keys, datatypes, formats, value sets, and external vocabulary mappings. It governs the generic structures in the [logical entity model](entity-model.md) and its concrete object example. It does not prescribe Neo4j property names, JSON serialization, database constraints, or API schemas.

Terms use British English and lower camel case for property keys. Type identifiers and project-controlled coded values use lowercase slash-separated namespaces. An external standard remains authoritative for its codes; this document defines where the project uses them.

## TERM-001 Entity structure terms

| Term | Datatype | Description / usage | Owner and applicability | Requirement and validation | Source |
|---|---|---|---|---|---|
| `name` | string, 1–200 Unicode characters | Display name of an `Organisation`. It is not an identifier or airline designator. | Partner Management; `Organisation` | required; trim surrounding whitespace | OTA organisation/name concept; project logical key |
| `type` | namespaced code string | Selects the semantic contract for a role, product, stock, or order item. | Owning Resources module; `PersonRole`, `OrgaRole`, `TouristicProductItem`, `StockItem`, `OrderItem` | required; exactly one value from TERM-002 | Project extension needed by the accepted generic model |
| `properties` | map<string, typed value> | Holds only properties permitted by the selected `type`. It is a logical collection, not an unrestricted dictionary. | Owning Resources module; typed entities | required but may be empty; unique keys; reject unknown keys unless their versioned extension namespace is accepted | Project extension needed by the accepted generic model |

## TERM-002 Type identifiers

| Term | Datatype | Description / usage | Owner | Permitted/required properties | Source status |
|---|---|---|---|---|---|
| `person/customer` | namespaced code | Person role for the Customer who selects, orders, and pays. | Person Management | optional `paymentMethodCode` | Project identifier mapped to glossary Customer and OTA customer/payor concepts |
| `person/traveller` | namespaced code | Person role for a participant in travel. | Person Management | none yet | Project identifier mapped to glossary Traveler and OTA traveller/passenger concepts |
| `partner/supplier/airline` | namespaced code | Supplier role for an airline. | Partner Management | required `airlineDesignator` | Project identifier; IATA identifies the airline value |
| `partner/supplier/hotel` | namespaced code | Supplier role for an accommodation provider. | Partner Management | none yet | Project identifier mapped to OTA hotel/accommodation concepts |
| `product/flight` | namespaced code | Reusable scheduled flight definition. | Touristic Product Management | flight properties in TERM-004 | Project identifier mapped to OTA air itinerary concepts |
| `product/flight/seat` | namespaced code | Seat definition contained by a flight product. | Touristic Product Management | required `seatNumber` | Project identifier mapped to OTA seat concepts |
| `product/hotel/room-category` | namespaced code | Reusable category of hotel room. | Touristic Product Management | required `roomTypeCode`; optional `smokingPreferenceCode` | Project identifier mapped to OTA room-stay concepts |
| `product/hotel/room` | namespaced code | Individually identified hotel room within a category. | Touristic Product Management | required `roomNumber` | Project identifier mapped to OTA room concepts |
| `stock/flight/seat` | namespaced code | Sellable dated inventory for one flight seat. | Inventory | common stock properties in TERM-005 | Project identifier |
| `stock/hotel/room` | namespaced code | Sellable dated inventory for one hotel room/night. | Inventory | common stock properties in TERM-005 | Project identifier |
| `order/header` | namespaced code | Root of one Travel Order. | Order Management | required `orderNumber`, `orderStatusCode` | Project identifier mapped to glossary Travel Order |
| `order/position` | namespaced code | Ordered component contained by an order header. | Order Management | none yet; relationship identifies stock and traveller | Project identifier |

## TERM-003 Person and organisation properties

| Term | Datatype | Description / usage | Owner and applicability | Requirement and validation | Source |
|---|---|---|---|---|---|
| `givenName` | string, 1–100 Unicode characters | Personal given name; replaces ambiguous `firstName`. Synthetic examples only. | Person Management; `Person` | required for the present example; trim, preserve spelling | OTA PersonName/GivenName concept; project logical key |
| `familyName` | string, 1–100 Unicode characters | Family name; replaces `surname` to align with travel interchange terminology. | Person Management; `Person` | required for the present example | OTA PersonName/Surname concept; project key named for unambiguous English usage |
| `addressLocalityName` | string, 1–100 Unicode characters | Human-readable city/locality in a postal address. It is not an airport code. | Person or Partner Management; `Person`, `Organisation` | optional; do not infer country or airport | OTA Address/CityName concept; project logical key |
| `paymentMethodCode` | namespaced code | Customer's permitted payment method category; does not store credentials or account identifiers. | Person Management; `person/customer` | optional; current example `payment/paypal`; payment data remains unresolved | Project value set; no suitable freely adopted OTA/ISO code confirmed |
| `payment/paypal` | namespaced code | PayPal payment-method category for synthetic example only. | Person Management; `paymentMethodCode` | permitted example value; case-sensitive; no credential data | Project extension referencing a third-party service name, not an ISO code |

## TERM-004 Flight and accommodation properties

| Term | Datatype | Description / usage | Owner and applicability | Requirement and validation | Source |
|---|---|---|---|---|---|
| `airlineDesignator` | string, IATA two-character designator | Airline code used with schedules and flight numbers. Synthetic codes must be marked and verified unassigned. | Partner Management; `partner/supplier/airline` | required; IATA syntax and current assignment validation | IATA airline coding database/current assignment data |
| `flightNumber` | string, 1–4 decimal digits | Numeric flight number without airline designator; replaces generic `code`. | Touristic Product Management; `product/flight` | required; combine with supplying role's `airlineDesignator` for display | IATA scheduling convention; project logical key |
| `departureLocationCode` | string, IATA three-letter location identifier | Departure airport or eligible intermodal location. | Touristic Product Management; `product/flight` | required; current IATA code; must differ from arrival | IATA Airport and Location Coding Database |
| `arrivalLocationCode` | string, IATA three-letter location identifier | Arrival airport or eligible intermodal location. | Touristic Product Management; `product/flight` | required; current IATA code | IATA Airport and Location Coding Database |
| `scheduledDepartureLocalTime` | local time string, `hh:mm:ss` | Scheduled local departure time; replaces unexplained `STD`. Date and zone come from the operated service/location context. | Touristic Product Management; `product/flight` | required; ISO 8601-1 local time; no offset may be inferred | ISO 8601-1:2019; OTA schedule concept |
| `scheduledArrivalLocalTime` | local time string, `hh:mm:ss` | Scheduled local arrival time; replaces unexplained `STA`. | Touristic Product Management; `product/flight` | required; ISO 8601-1 local time; itinerary supplies date rollover | ISO 8601-1:2019; OTA schedule concept |
| `aircraftTypeDesignator` | string, 2–4 alphanumeric characters | Aircraft type used for an operated flight; replaces generic `aircraft`. | Touristic Product Management; `product/flight` | optional; value must exist in current ICAO Doc 8643 data | ICAO Doc 8643, 54th edition (2026), with current AIRAC data preferred |
| `seatNumber` | string, 1–4 uppercase alphanumeric characters | Carrier-facing seat designation such as `5A`. | Touristic Product Management; `product/flight/seat` | required; `^[1-9][0-9]{0,2}[A-Z]$` for current PoC | OTA seat concept; project restricted format |
| `roomTypeCode` | namespaced code | Project room-category value because no freely accessible, version-pinned OTA code list has yet been adopted. | Touristic Product Management; room category | required; current value `room/double` | Project extension mapped to OTA room-type concept |
| `room/double` | namespaced code | Room category intended for two occupants; does not guarantee bed configuration. | Touristic Product Management; `roomTypeCode` | permitted current example | Project extension; exact OTA mapping unresolved |
| `smokingPreferenceCode` | enum string | Smoking policy/preference for a room category. | Touristic Product Management; room category | optional; `nonSmoking`, `smoking`, or `unspecified` | Project value set mapped to OTA smoking-preference concept |
| `roomNumber` | string, 1–20 characters | Property-assigned room identifier; kept as string to preserve leading zeros and suffixes. | Touristic Product Management; `product/hotel/room` | required in current example | OTA room-number concept; project logical key |

## TERM-005 Stock and order properties

| Term | Datatype | Description / usage | Owner and applicability | Requirement and validation | Source |
|---|---|---|---|---|---|
| `serviceDate` | calendar date string, `YYYY-MM-DD` | Local date on which a stock service is delivered; replaces generic `date`. | Inventory; all current StockItem types | required; valid ISO calendar date | ISO 8601-1:2019 |
| `unitPriceAmount` | decimal | Sale price amount for one StockItem; replaces incomplete `price`. | Inventory; current StockItem types | required, >= 0, maximum scale follows currency minor unit | OTA Amount concept; project logical key |
| `currencyCode` | string, ISO 4217 alphabetic code | Currency of `unitPriceAmount`. | Inventory; current StockItem types | required whenever an amount exists; current example `EUR` | ISO 4217:2015 plus current Maintenance Agency list |
| `orderNumber` | string, 1–40 characters | Stable business-facing Travel Order reference; not a database identifier. | Order Management; `order/header` | required and unique in Order Management; current synthetic example `5766` | Project identifier mapped to OTA booking/order reference concept |
| `orderStatusCode` | namespaced code | Current Travel Order lifecycle status; replaces generic `status`. | Order Management; `order/header` | required; current example `order/paid`; transitions require separate rules | Project value set; no external lifecycle adopted |
| `order/paid` | namespaced code | Required customer payment has been recorded for the synthetic order example. | Order Management; `orderStatusCode` | permitted example; does not imply supplier settlement or completed travel | Project extension grounded in UC-018 and glossary |

## TERM-006 Vocabulary baseline and access limits

| Term | Datatype | Description / usage |
|---|---|---|
| OpenTravel 1.0 2024A | external specification baseline | Evaluated for travel concepts and naming. The downloadable XML specification is subject to OpenTravel terms; this repository records mappings and original logical terms, not copied schemas or code lists. OpenTravel 2.0's latest listed release is 2019A, so the more recent 1.0 2024A baseline is used for concept review only. |
| IATA current coding databases | maintained external code lists | Authoritative for airline designators and airport/location identifiers. Full structured current data is subscription-controlled; the official free search can verify individual codes. Persist the verification date with test evidence. |
| ICAO Doc 8643/54 (2026) | maintained external code list | Authoritative for aircraft type designators. The manual is paid and data download requires ICAO API registration; the searchable/current data service should be used during validation without copying the dataset. |
| ISO 8601-1:2019 | international standard, confirmed 2024 | Authoritative format baseline for dates and local times. Full standard text is paid; ISO's public abstract confirms scope and current status. |
| ISO 4217:2015 plus Maintenance Agency list | maintained external code list | Authoritative for alphabetic currency codes and minor units. ISO permits free use of the codes; current list is maintained by SIX on ISO's behalf. |
| ISO 3166-1:2020 plus Maintenance Agency list | maintained external code list | Adopt alpha-2 country codes when country properties are introduced. Not currently used by the object example. ISO permits free use of the codes. |
| ISO 639:2023 maintained code sets | maintained external code lists | Adopt Set 1 two-letter language identifiers when language properties are introduced. Not currently used by the object example. ISO permits free use of the codes. |
| ISO 80000-1:2022 | international standard | Governs quantity/unit notation when measured properties are introduced. No measured quantity is currently present. |

Primary source links: [OpenTravel downloads](https://opentravel.org/download-specs/), [IATA codes](https://www.iata.org/en/services/codes/), [IATA coding databases](https://www.iata.org/acd), [ICAO designators](https://www.icao.int/operational-safety/Designators-and-indicators), [ICAO Doc 8643](https://www.icao.int/operational-safety/doc-8643-aircraft-type-designators), [ISO 8601-1](https://www.iso.org/standard/70907.html), [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html), [ISO 3166](https://www.iso.org/iso-3166-country-codes.html), [ISO 639](https://www.iso.org/iso-639-language-code), and [ISO 80000-1](https://www.iso.org/standard/76921.html).

## TERM-007 Naming, versions, extensions, and deprecation

- Canonical keys are case-sensitive lower camel case. Codes are case-sensitive according to their authority; project codes are lowercase slash-separated.
- External codes are stored as codes, not copied descriptions. Validation records vocabulary name, edition/list version or verification date, and whether the code was current.
- Project identifiers occupy the explicit namespaces `person/`, `partner/`, `product/`, `stock/`, `order/`, `payment/`, and `room/`. They must never be presented as OTA, IATA, ICAO, or ISO codes.
- An external standard wins a naming/code conflict within its adopted scope. A project extension requires owner, definition, datatype, applicability, validation, rationale, and a non-conflicting namespace.
- Terms are never silently repurposed. Deprecation retains the stable TERM ID, identifies the replacement and migration condition, and prohibits new use.
- Vocabulary upgrades are reviewed one at a time. A changed external code list must not silently reinterpret stored historical data.

## TERM-008 Validation examples

| Example | Expected result | Rule |
|---|---|---|
| `departureLocationCode = FRA` | valid when verified current | IATA three-letter location identifier |
| `departureLocationCode = Frankfurt` | invalid | names are not codes |
| `aircraftTypeDesignator = B744` | valid when present in current Doc 8643 data | ICAO designator |
| `serviceDate = 2027-02-29` | invalid | 2027 is not a leap year |
| `unitPriceAmount = 500.00`, `currencyCode = EUR` | valid | non-negative amount and ISO currency |
| `unitPriceAmount = 500.00` without currency | invalid | amount requires currency |
| `roomNumber = 0215A` | valid | string preserves operational identifier |
| unknown property `airport = FRA` on `product/flight` | invalid | use the applicable canonical departure/arrival key |
| `orderStatusCode = paid` | invalid | project status must be namespaced `order/paid` |

## Limitations and unresolved work

- OpenTravel mappings are concept-level until the project can lawfully inspect and pin the applicable schema components and code lists; no claim of exact schema reuse is made.
- Full current IATA and ICAO datasets have access restrictions. Tests must record individual-code verification dates, and production integration would require a licensing/access decision.
- Address, payment, order lifecycle, room type, and smoking value sets need broader requirements before they can become exhaustive.
- Personal-data classification, retention, transliteration, multiple names/addresses, and international postal structures remain Security/Privacy and Requirements work.
- This catalog covers every key and coded value in the current object example. New scenario terms from issue #10 must extend this catalog before use.

## TERM-009 Reconciled object-example terms

| Term | Datatype | Description / usage |
|---|---|---|
| `firstName` → `givenName`; `surname` → `familyName` | deprecated key mapping | Original person labels replaced by canonical TERM-003 keys. |
| `address` → `addressLocalityName` | deprecated key mapping | The example contained only a locality, not a complete postal address. |
| `paymentMethod = payPal` → `paymentMethodCode = payment/paypal` | deprecated key/value mapping | Corrects casing and distinguishes the coded category from credentials. |
| `flightType` → `product/flight` | deprecated type mapping | Places the flight definition in the project type namespace. |
| `code = NL500` → `flightNumber = 500` | deprecated key/value mapping | Airline designator remains on the supplier role and is no longer duplicated ambiguously. |
| `origin` / `destination` → `departureLocationCode` / `arrivalLocationCode` | deprecated key mapping | States explicitly that values are IATA location identifiers. |
| `STD` / `STA` → `scheduledDepartureLocalTime` / `scheduledArrivalLocalTime` | deprecated key mapping | Removes unexplained abbreviations and records local-time semantics. |
| `aircraft = B747` → `aircraftTypeDesignator = B744` | deprecated key/value mapping | Uses an ICAO Doc 8643 designator; the example now specifies the aircraft variant. |
| airline `code` → `airlineDesignator` | deprecated key mapping | States that the value is an IATA airline designator. |
| `product/hotel/roomCategory` → `product/hotel/room-category` | deprecated type mapping | Applies the lowercase slash namespace convention. |
| `roomType = DBL` → `roomTypeCode = room/double` | deprecated key/value mapping | Distinguishes the project code from an unverified external code list. |
| `smoking = NSM` → `smokingPreferenceCode = nonSmoking` | deprecated key/value mapping | Replaces an unexplained abbreviation with the controlled TERM-004 value. |
| `number` → `roomNumber`; `seat` → `seatNumber` | deprecated key mapping | Removes entity-dependent ambiguity. |
| `date` → `serviceDate` | deprecated key mapping | Records the business meaning of the ISO date. |
| `price` → `unitPriceAmount` plus `currencyCode` | deprecated key mapping | Makes amount scope and currency explicit. |
| `status = paid` → `orderStatusCode = order/paid` | deprecated key/value mapping | Uses the controlled Order Management namespace. |

## AI-assisted validation record

AI inventoried the diagrams and proposed mappings. Critical review replaced ambiguous `code`, `date`, `price`, `status`, `STD`, and `STA`; rejected treating project type paths as external standard codes; corrected incomplete price semantics by requiring currency; and rejected copying restricted code lists. Stakeholder and independent Requirements/Architecture/Test/Security review remain required before acceptance.
