# Flexible Entity-model Terminology

- Status: proposed
- Owner: Architecture/Requirements
- Last reviewed: 2026-08-20

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
| `partner/supplier/accommodation` | namespaced code | Supplier role for an accommodation provider (hotel or otherwise). | Partner Management | none yet | Project identifier mapped to OpenTravel accommodation concepts |
| `partner/supplier/mobility` | namespaced code | Supplier role for transfers, rail, coaches, or rental vehicles. | Partner Management | none yet | Project extension grouping ground-transport concepts |
| `partner/supplier/water-transport` | namespaced code | Supplier role for cruises, ferries, or day boats. | Partner Management | none yet | Project extension mapped to OpenTravel cruise/activity concepts |
| `partner/supplier/experience` | namespaced code | Supplier role for guided tours and activities. | Partner Management | none yet | Project extension mapped to OpenTravel package/activity concepts |
| `partner/supplier/protection` | namespaced code | Supplier role for travel-protection products; it does not assert regulatory authorization. | Partner Management | none yet | Project extension mapped to OpenTravel insurance concepts |
| `product/airline/flight` | namespaced code | Reusable scheduled flight definition. | Touristic Product Management | flight properties in TERM-004 | Project identifier mapped to OTA air itinerary concepts; family aligned with `partner/supplier/airline` |
| `product/airline/seat` | namespaced code | Seat definition contained by a flight product. | Touristic Product Management | required `seatNumber` | Project identifier mapped to OTA seat concepts |
| `product/accommodation/room-category` | namespaced code | Reusable category of accommodation room (hotel or otherwise). | Touristic Product Management | required `roomTypeCode`; optional `smokingPreferenceCode` | Project identifier mapped to OTA room-stay/OpenTravel accommodation concepts |
| `product/accommodation/room` | namespaced code | Individually identified room within an accommodation room category. | Touristic Product Management | required `roomNumber` | Project identifier mapped to OTA room/OpenTravel accommodation concepts |
| `product/mobility/transfer` | namespaced code | Point-to-point ground transfer. | Touristic Product Management | none yet | Project extension mapped to OpenTravel ground-transport concepts |
| `product/mobility/rail` | namespaced code | Passenger rail service. | Touristic Product Management | none yet | Project extension mapped to OpenTravel rail concepts |
| `product/mobility/coach` | namespaced code | Scheduled or chartered coach service. | Touristic Product Management | none yet | Project extension mapped to OpenTravel ground-transport concepts |
| `product/mobility/vehicle-rental` | namespaced code | Time-bounded rental-vehicle service. | Touristic Product Management | none yet | Project extension mapped to OpenTravel vehicle-rental concepts |
| `product/water/day-boat` | namespaced code | Same-day passenger boat service or excursion. | Touristic Product Management | none yet | Project extension mapped to OpenTravel cruise/activity concepts |
| `product/water/cruise` | namespaced code | Multi-day cruise product. | Touristic Product Management | none yet | Project extension mapped to OpenTravel cruise concepts |
| `product/experience/guided-tour` | namespaced code | Guided visitor experience. | Touristic Product Management | none yet | Project extension mapped to OpenTravel package/activity concepts |
| `product/experience/activity` | namespaced code | Bookable visitor activity that need not include a guide. | Touristic Product Management | none yet | Project extension mapped to OpenTravel package/activity concepts |
| `product/protection/travel` | namespaced code | Travel-protection product definition; coverage and regulation remain unresolved. | Touristic Product Management | none yet | Project extension mapped to OpenTravel insurance concepts |
| `stock/flight/seat` | namespaced code | Sellable dated inventory for one flight seat. Predates the `product/airline/*` rename (issue #31 follow-up) and was left as-is: renaming it would touch Inventory (VIEW-S-007) and Order Management beyond this change's scope. | Inventory | common stock properties in TERM-005 | Project identifier |
| `stock/accommodation/room-category` | namespaced code | Sellable dated inventory for one accommodation room-category night. | Inventory | common stock properties in TERM-005 | Project identifier |
| `stock/mobility/transfer` | namespaced code | Sellable dated capacity for one ground-transfer service date. | Inventory | common stock properties in TERM-005 | Project identifier |
| `stock/mobility/rail` | namespaced code | Sellable dated capacity for one passenger-rail service date. | Inventory | common stock properties in TERM-005 | Project identifier |
| `stock/mobility/coach` | namespaced code | Sellable dated capacity for one coach service date. | Inventory | common stock properties in TERM-005 | Project identifier |
| `stock/mobility/vehicle-rental` | namespaced code | Sellable dated capacity for one rental-vehicle service date. | Inventory | common stock properties in TERM-005 | Project identifier |
| `stock/water/day-boat` | namespaced code | Sellable dated capacity for one day-boat service date. | Inventory | common stock properties in TERM-005 | Project identifier |
| `stock/water/cruise` | namespaced code | Sellable dated capacity for one cruise departure date. | Inventory | common stock properties in TERM-005 | Project identifier |
| `stock/experience/guided-tour` | namespaced code | Sellable dated capacity for one guided-tour service date. | Inventory | common stock properties in TERM-005 | Project identifier |
| `stock/experience/activity` | namespaced code | Sellable dated capacity for one bookable-activity service date. | Inventory | common stock properties in TERM-005 | Project identifier |
| `stock/protection/travel` | namespaced code | Sellable dated capacity for one travel-protection service date. | Inventory | common stock properties in TERM-005 | Project identifier |
| `order/header` | namespaced code | Root of one Travel Order. | Order Management | required `orderNumber`, `orderStatusCode` | Project identifier mapped to glossary Travel Order |
| `order/position` | namespaced code | Ordered component contained by an order header. | Order Management | none yet; relationship identifies stock and traveller | Project identifier |

## TERM-003 Person and organisation properties

| Term | Datatype | Description / usage | Owner and applicability | Requirement and validation | Source |
|---|---|---|---|---|---|
| `givenName` | string, 1–100 Unicode characters | Personal given name; replaces ambiguous `firstName`. Synthetic examples only. | Person Management; `Person` | required for the present example; trim, preserve spelling | OTA PersonName/GivenName concept; project logical key |
| `familyName` | string, 1–100 Unicode characters | Family name; replaces `surname` to align with travel interchange terminology. | Person Management; `Person` | required for the present example | OTA PersonName/Surname concept; project key named for unambiguous English usage |
| `addressLocalityName` | string, 1–100 Unicode characters | Human-readable city/locality in a postal address. It is not an airport code. | Person or Partner Management; `Person`, `Organisation` | optional; do not infer country or airport | OTA Address/CityName concept; project logical key |
| `paymentMethodCode` | namespaced code | Customer's permitted payment method category; does not store credentials or account identifiers. | Person Management; `person/customer` | optional; exactly one of the five permitted values below; payment data remains unresolved | Project value set; no suitable freely adopted OTA/ISO code confirmed |
| `payment/paypal` | namespaced code | PayPal payment-method category for synthetic example only. | Person Management; `paymentMethodCode` | permitted example value; case-sensitive; no credential data | Project extension referencing a third-party service name, not an ISO code |
| `payment/credit-card` | namespaced code | Credit/debit card payment-method category; no card number, scheme, or expiry is stored. | Person Management; `paymentMethodCode` | permitted example value | Project extension |
| `payment/sepa-direct-debit` | namespaced code | SEPA direct debit mandate category; no IBAN/mandate reference is stored. | Person Management; `paymentMethodCode` | permitted example value | Project extension referencing the SEPA scheme name |
| `payment/bank-transfer` | namespaced code | Manual bank-transfer payment-method category. | Person Management; `paymentMethodCode` | permitted example value | Project extension |
| `payment/invoice` | namespaced code | Pay-by-invoice payment-method category. | Person Management; `paymentMethodCode` | permitted example value | Project extension |
| `roleStatusCode` | namespaced code | Current `PersonRole`/`OrgaRole` lifecycle status; follows the `orderStatusCode` pattern (TERM-005). Deactivating a role (VIEW-S-002, VIEW-S-004) sets `role/inactive`; it does not delete the `Person`/`Organisation` or `PersonRole`/`OrgaRole` record. | Person Management; `person/customer`, `person/traveller`. Partner Management; `partner/supplier/airline` and the other `partner/supplier/*` types (issue #30, WF-Q-011) | required; defaults to `role/active` when omitted; the CRUD API's `PUT` is the only current transition mechanism, so any code may currently follow any other -- ordering/guard rules remain future requirements work, matching `orderStatusCode`'s unresolved scope | Project value set; no external lifecycle adopted |
| `role/active` | namespaced code | The role is currently in effect. | Person Management, Partner Management; `roleStatusCode` | permitted; default | Project extension |
| `role/inactive` | namespaced code | The role has been deactivated and is excluded by default from the "active" role-status filter. | Person Management, Partner Management; `roleStatusCode` | permitted | Project extension; issue #29, #30 |

## TERM-004 Flight and accommodation properties

| Term | Datatype | Description / usage | Owner and applicability | Requirement and validation | Source |
|---|---|---|---|---|---|
| `airlineDesignator` | string, IATA two-character designator | Airline code used with schedules and flight numbers. Synthetic codes must be marked and verified unassigned. | Partner Management; `partner/supplier/airline` | required; IATA syntax and current assignment validation | IATA airline coding database/current assignment data |
| `flightNumber` | string, 1–4 decimal digits | Numeric flight number without airline designator; replaces generic `code`. | Touristic Product Management; `product/airline/flight` | required; combine with supplying role's `airlineDesignator` for display | IATA scheduling convention; project logical key |
| `departureLocationCode` | string, IATA three-letter location identifier | Departure airport or eligible intermodal location. | Touristic Product Management; `product/airline/flight` | required; current IATA code; must differ from arrival | IATA Airport and Location Coding Database |
| `arrivalLocationCode` | string, IATA three-letter location identifier | Arrival airport or eligible intermodal location. | Touristic Product Management; `product/airline/flight` | required; current IATA code | IATA Airport and Location Coding Database |
| `scheduledDepartureLocalTime` | local time string, `hh:mm:ss` | Scheduled local departure time; replaces unexplained `STD`. Date and zone come from the operated service/location context. | Touristic Product Management; `product/airline/flight` | required; ISO 8601-1 local time; no offset may be inferred | ISO 8601-1:2019; OTA schedule concept |
| `scheduledArrivalLocalTime` | local time string, `hh:mm:ss` | Scheduled local arrival time; replaces unexplained `STA`. | Touristic Product Management; `product/airline/flight` | required; ISO 8601-1 local time; itinerary supplies date rollover | ISO 8601-1:2019; OTA schedule concept |
| `aircraftTypeDesignator` | string, 2–4 alphanumeric characters | Aircraft type used for an operated flight; replaces generic `aircraft`. | Touristic Product Management; `product/airline/flight` | optional; value must exist in current ICAO Doc 8643 data | ICAO Doc 8643, 54th edition (2026), with current AIRAC data preferred |
| `seatNumber` | string, 1–4 uppercase alphanumeric characters | Carrier-facing seat designation such as `5A`. | Touristic Product Management; `product/airline/seat` | required; `^[1-9][0-9]{0,2}[A-Z]$` for current PoC | OTA seat concept; project restricted format |
| `roomTypeCode` | namespaced code | Project room-category value because no freely accessible, version-pinned OTA code list has yet been adopted. | Touristic Product Management; room category | required; one of `room/single`, `room/double`, `room/twin`, `room/triple`, `room/family`, `room/adjoining`, `room/suite`, `room/cabin` | Project extension mapped to OTA room-type concept |
| `room/double` | namespaced code | Room category intended for two occupants; does not guarantee bed configuration. | Touristic Product Management; `roomTypeCode` | permitted value | Project extension; exact OTA mapping unresolved |
| `room/single` | namespaced code | Room category intended for one occupant. | Touristic Product Management; `roomTypeCode` | permitted value | Project extension; exact OTA mapping unresolved |
| `room/twin` | namespaced code | Room category with two separate beds. | Touristic Product Management; `roomTypeCode` | permitted value | Project extension; exact OTA mapping unresolved |
| `room/triple` | namespaced code | Room category intended for three occupants. | Touristic Product Management; `roomTypeCode` | permitted value | Project extension; exact OTA mapping unresolved |
| `room/family` | namespaced code | Room category intended for a family group, larger than triple occupancy. | Touristic Product Management; `roomTypeCode` | permitted value | Project extension; exact OTA mapping unresolved |
| `room/adjoining` | namespaced code | Two connected room categories bookable together for a family or group. | Touristic Product Management; `roomTypeCode` | permitted value | Project extension; exact OTA mapping unresolved |
| `room/suite` | namespaced code | Room category with a separate living area in addition to sleeping space. | Touristic Product Management; `roomTypeCode` | permitted value | Project extension; exact OTA mapping unresolved |
| `room/cabin` | namespaced code | Sleeping accommodation aboard a `product/water/cruise`, modelled with the same room-category properties. | Touristic Product Management; `roomTypeCode` | permitted value | Project extension; exact OTA mapping unresolved |
| `smokingPreferenceCode` | enum string | Smoking policy/preference for a room category. | Touristic Product Management; room category | optional; `nonSmoking`, `smoking`, or `unspecified` | Project value set mapped to OTA smoking-preference concept |
| `roomNumber` | string, 1–20 characters | Property-assigned room identifier; kept as string to preserve leading zeros and suffixes. | Touristic Product Management; `product/accommodation/room` | required in current example | OTA room-number concept; project logical key |
| `displayName` | string, 1–200 Unicode characters | Human-readable catalogue label. Closes WF-Q-013: no `TouristicProductItem` type previously carried a generic name/title, only type-specific fields (`flightNumber`, `roomTypeCode`) or none at all (`product/mobility/*`, `product/water/*`, `product/experience/*`, `product/protection/travel`). | Touristic Product Management; every catalogue-root type (not `product/airline/seat` or `product/accommodation/room`, which are structural children identified by their parent) | optional | Project extension; issue #31 |
| `lifecycleStatusCode` | namespaced code | Current catalogue-root product's lifecycle status; follows the `roleStatusCode` pattern (TERM-003). "Activate"/"retire" (VIEW-S-003) transition this status on the same record; there is no separate version-number/version-history mechanism (WF-Q-014). | Touristic Product Management; every catalogue-root type (not `product/airline/seat` or `product/accommodation/room`) | required; defaults to `product/draft` when omitted; the CRUD API's `PUT` is the only current transition mechanism | Project value set; no external lifecycle adopted; issue #31 |
| `product/draft` | namespaced code | The product definition is being prepared and is not offered for sale. | Touristic Product Management; `lifecycleStatusCode` | permitted; default | Project extension |
| `product/active` | namespaced code | The product definition is offered for sale. | Touristic Product Management; `lifecycleStatusCode` | permitted | Project extension |
| `product/retired` | namespaced code | The product definition has been withdrawn from future sale and is excluded by default from the "active" lifecycle filter. | Touristic Product Management; `lifecycleStatusCode` | permitted | Project extension; issue #31 |

## TERM-005 Stock and order properties

| Term | Datatype | Description / usage | Owner and applicability | Requirement and validation | Source |
|---|---|---|---|---|---|
| `serviceDate` | calendar date string, `YYYY-MM-DD` | Local date on which a stock service is delivered; replaces generic `date`. | Inventory; all current StockItem types | required; valid ISO calendar date | ISO 8601-1:2019 |
| `unitPriceAmount` | decimal | Sale price amount for one StockItem; replaces incomplete `price`. | Inventory; current StockItem types | required, >= 0, maximum scale follows currency minor unit | OTA Amount concept; project logical key |
| `currencyCode` | string, ISO 4217 alphabetic code | Currency of `unitPriceAmount`. | Inventory; current StockItem types | required whenever an amount exists; current example `EUR` | ISO 4217:2015 plus current Maintenance Agency list |
| `orderNumber` | string, 1–40 characters | Stable business-facing Travel Order reference; not a database identifier. | Order Management; `order/header` | required and unique in Order Management; current synthetic example `5766` | Project identifier mapped to OTA booking/order reference concept |
| `orderStatusCode` | namespaced code | Current Travel Order lifecycle status; replaces generic `status`. | Order Management; `order/header` | required; exactly one value from this row's four permitted codes; issue #21 introduces the CRUD API's `PUT` as the only current transition mechanism, so any code may currently follow any other -- ordering/guard rules remain future requirements work | Project value set; no external lifecycle adopted |
| `order/reserved` | namespaced code | Positions are allocated to stock and travellers but payment has not yet been recorded. | Order Management; `orderStatusCode` | permitted; precedes `order/paid` in the informal glossary "Reservation" concept | Project extension grounded in the glossary's Reservation concept |
| `order/paid` | namespaced code | Required customer payment has been recorded for the synthetic order example. | Order Management; `orderStatusCode` | permitted example; does not imply supplier settlement or completed travel | Project extension grounded in UC-018 and glossary |
| `order/fulfilled` | namespaced code | Ordered travel has been delivered to the traveller(s). | Order Management; `orderStatusCode` | permitted; does not imply supplier settlement | Project extension grounded in the glossary's "tour operator cycle" concept |
| `order/cancelled` | namespaced code | The Travel Order will not proceed. | Order Management; `orderStatusCode` | permitted; refund/settlement consequences remain future requirements work | Project extension; standard terminal lifecycle state |

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
| SPDX License List | maintained external identifier list | Authoritative for the machine-readable `imageLicenceCode` identifiers (TERM-010); free to use, no licence fee. |
| Creative Commons licence deeds | maintained external licence texts | Authoritative for the meaning and version of each `imageLicenceCode`/`imageLicenceVersion` pair; deeds and legal code are freely publishable. |
| WCAG 2.2 | international guideline (W3C) | Governs `imageAltText`'s non-text-content requirement; publicly available without licence fee. |

Primary source links: [OpenTravel downloads](https://opentravel.org/download-specs/), [IATA codes](https://www.iata.org/en/services/codes/), [IATA coding databases](https://www.iata.org/acd), [ICAO designators](https://www.icao.int/operational-safety/Designators-and-indicators), [ICAO Doc 8643](https://www.icao.int/operational-safety/doc-8643-aircraft-type-designators), [ISO 8601-1](https://www.iso.org/standard/70907.html), [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html), [ISO 3166](https://www.iso.org/iso-3166-country-codes.html), [ISO 639](https://www.iso.org/iso-639-language-code), [ISO 80000-1](https://www.iso.org/standard/76921.html), [SPDX License List](https://spdx.org/licenses/), [Creative Commons licences](https://creativecommons.org/licenses/), and [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

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
| unknown property `airport = FRA` on `product/airline/flight` | invalid | use the applicable canonical departure/arrival key |
| `orderStatusCode = paid` | invalid | project status must be namespaced `order/paid` |

## Limitations and unresolved work

- OpenTravel mappings are concept-level until the project can lawfully inspect and pin the applicable schema components and code lists; no claim of exact schema reuse is made.
- Full current IATA and ICAO datasets have access restrictions. Tests must record individual-code verification dates, and production integration would require a licensing/access decision.
- Address, payment, order lifecycle, room type, and smoking value sets need broader requirements before they can become exhaustive.
- Personal-data classification, retention, transliteration, multiple names/addresses, and international postal structures remain Security/Privacy and Requirements work.
- This catalog covers every key and coded value in the current object example and the type identifiers used by the issue #10 test-data catalog. Detailed properties for the newly introduced product families remain deliberately unresolved until their business rules are specified.
- TERM-010's `imageLicenceCode` value set (`CC0-1.0`, `CC-BY-4.0`, `CC-BY-SA-4.0`, `PDM-1.0`) covers only the licences issue #12's representative image research actually used; it is not a claim that other Creative Commons or public-domain licence variants are unsuitable, only that they are unneeded until a seeded image uses one.
- `stock/*` type identifiers now exist for every product family the accepted scenarios allocate order positions against, but their properties remain exactly the common set in TERM-005; family-specific stock properties (e.g. seat class, vehicle category, cabin deck) remain future requirements work.

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
| `product/hotel/room-category` / `product/hotel/room` → `product/accommodation/room-category` / `product/accommodation/room` | deprecated type mapping | The `hotel` family duplicated the always-used `accommodation` family (0 seed entries ever used `product/hotel/*`); consolidated on `accommodation` to remove the confusion between the two (VIEW-S-003 tree-view follow-up). |
| `partner/supplier/hotel` → `partner/supplier/accommodation` | deprecated type mapping | Same `hotel`/`accommodation` duplication on the Partner Management side; `partner/supplier/hotel` was defined but never seeded, so this is a removal, not a data migration. |
| `stock/hotel/room` → `stock/accommodation/room-category` | deprecated type mapping | Same cleanup for Inventory; `stock/hotel/room` was defined but never seeded. |
| `product/flight` → `product/airline/flight`; `product/flight/seat` → `product/airline/seat` | deprecated type mapping | Aligns the product family name with the existing `partner/supplier/airline` role family, so every product type reads as `<family>/<subtype>` consistently (VIEW-S-003 tree-view follow-up). |
| `roomType = DBL` → `roomTypeCode = room/double` | deprecated key/value mapping | Distinguishes the project code from an unverified external code list. |
| `smoking = NSM` → `smokingPreferenceCode = nonSmoking` | deprecated key/value mapping | Replaces an unexplained abbreviation with the controlled TERM-004 value. |
| `number` → `roomNumber`; `seat` → `seatNumber` | deprecated key mapping | Removes entity-dependent ambiguity. |
| `date` → `serviceDate` | deprecated key mapping | Records the business meaning of the ISO date. |
| `price` → `unitPriceAmount` plus `currencyCode` | deprecated key mapping | Makes amount scope and currency explicit. |
| `status = paid` → `orderStatusCode = order/paid` | deprecated key/value mapping | Uses the controlled Order Management namespace. |

## TERM-010 Image metadata properties

Added for issue #12 to cover the licensed portal images that seed data attaches to representative touristic resources. Applicable only where `imageUrl` is present; a product with no image simply omits every key in this row set (optional at the entity level, but internally consistent once used).

| Term | Datatype | Description / usage | Owner and applicability | Requirement and validation | Source |
|---|---|---|---|---|---|
| `imageUrl` | string, absolute HTTPS URL | Portal-displayable image location for a touristic resource. | Touristic Product Management; any `product/*` type | optional; scheme must be `https://`; other schemes rejected | Project extension; no suitable freely adopted OTA/ISO term confirmed |
| `imageSourcePageUrl` | string, absolute HTTPS URL | Page documenting the image's origin and licence, kept distinct from the image file itself so the licence can be re-verified. | Touristic Product Management; `imageUrl` present | required whenever `imageUrl` is present | Project extension |
| `imageCreatorCredit` | string, 0–200 Unicode characters | Creator/photographer credit, when supplied by the source. | Touristic Product Management; `imageUrl` present | optional; empty when the source supplies no credit | Project extension |
| `imageLicenceCode` | enum string | Machine-readable licence identifier. | Touristic Product Management; `imageUrl` present | required whenever `imageUrl` is present; one of `CC0-1.0`, `CC-BY-4.0`, `CC-BY-SA-4.0`, `CC-BY-SA-3.0`, `PDM-1.0` | SPDX License List identifiers; Creative Commons licence deeds |
| `imageLicenceVersion` | string, 1–10 characters | Licence version component, kept distinct from `imageLicenceCode` so a licence-family upgrade stays traceable. | Touristic Product Management; `imageUrl` present | required whenever `imageUrl` is present; e.g. `4.0`, `1.0` | Creative Commons/Public Domain versioning |
| `imageAttributionText` | string, 1–300 Unicode characters | Ready-to-display attribution line combining creator, source, and licence. | Touristic Product Management; `imageUrl` present | required whenever `imageUrl` is present | Project extension; Creative Commons attribution practice |
| `imageAltText` | string, 1–200 Unicode characters | Accessible description of the image content and portal context. Must describe the depicted subject, not be derived only from the image filename. | Touristic Product Management; `imageUrl` present | required whenever `imageUrl` is present | WCAG 2.2 non-text-content guidance |
| `imageVerifiedDate` | calendar date string, `YYYY-MM-DD` | Date the licence and source page were last confirmed current. | Touristic Product Management; `imageUrl` present | required whenever `imageUrl` is present; valid ISO calendar date | ISO 8601-1:2019 |

## AI-assisted validation record

AI inventoried the diagrams and proposed mappings. Critical review replaced ambiguous `code`, `date`, `price`, `status`, `STD`, and `STA`; rejected treating project type paths as external standard codes; corrected incomplete price semantics by requiring currency; and rejected copying restricted code lists. Stakeholder and independent Requirements/Architecture/Test/Security review remain required before acceptance.

Issue #12 (2026-08-18): AI inventoried every entity/property/coded value the accepted `test-scenarios.md`/`catalogs.md` catalogs require and found two gaps: (1) no `stock/*` type identifier existed for the mobility, water, experience, protection, or non-hotel-accommodation product families the scenarios' orders need to allocate against, so ten identifiers were added (TERM-002), each reusing the existing common stock properties in TERM-005 rather than inventing new ones, since no business rule yet justifies family-specific stock properties; (2) `roomTypeCode` had only one permitted value (`room/double`) while the scenarios and catalog reserve entries reference single/twin/triple/family/adjoining/suite/cabin rooms, so the value set was widened (TERM-004). No existing term was reinterpreted or deprecated. TERM-010 (image metadata) is a wholly new addition, not a reconciliation of prior content; its licence-code value set was deliberately kept to the four Creative Commons/public-domain identifiers issue #12's image research actually used, not a speculative exhaustive list. Rejected during this pass: treating a cruise cabin as a distinct product type (`product/water/cabin`) — modelling it as a `product/accommodation/room-category` nested under the cruise product via `CONTAINS`, with `roomTypeCode = room/cabin`, reuses the existing recursive-composition and room-category machinery instead of adding a parallel one; and giving licence codes a project-controlled `licence/` namespace — reusing external SPDX/Creative Commons identifiers directly avoids both a redundant project vocabulary and a TERM-007 namespace-list edit for values an external authority already defines. See DR-0014 for the full rationale and the seed-generation decisions built on these terms.

Issue #29 (2026-08-19): The VIEW-S-002 phase 1 wireframe proposed deactivating a `PersonRole` as a status change rather than a delete, but no status property existed on `PersonRole`. Added `roleStatusCode` (TERM-003) with `role/active`/`role/inactive` values, reusing `orderStatusCode`'s namespaced-code-plus-unconstrained-`PUT`-transition pattern (TERM-005) rather than inventing a second lifecycle mechanism. Defaults to `role/active` so every existing seed role and API caller that omits the field remains valid without a migration.

Issue #29 phase 2 stakeholder review (2026-08-20): `paymentMethodCode` had only one permitted value (`payment/paypal`); widened to five typical categories (`payment/credit-card`, `payment/sepa-direct-debit`, `payment/bank-transfer`, `payment/invoice`, alongside the existing `payment/paypal`) so the customer-role edit form reflects realistic payment options. Each remains a category label only, consistent with the existing "no credential data" constraint; no new stored payment data was introduced.
