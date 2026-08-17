# Entity Terminology Standards Review

- Status: proposed
- Owner: Architecture/Requirements
- Last reviewed: 2026-08-17

## Purpose and method

This review records the bounded external evidence used for issue #18 and the [authoritative terminology catalog](../../architecture/entity-model/terminology.md). Official publisher pages were inspected on 2026-08-17. Public summaries establish scope and maintenance status; they do not grant access to or permission to copy restricted specifications and datasets.

## Sources and disposition

| Source | Version/currentness evidence | Access limitation | Disposition |
|---|---|---|---|
| [OpenTravel specification downloads](https://opentravel.org/download-specs/) | 1.0 lists 2024A; 2.0 lists 2019A | download terms restrict modification and endorsement claims | Adopt concept mappings only; do not copy schemas or code lists. Evaluate exact components before implementation. |
| [IATA codes](https://www.iata.org/en/services/codes/) and [coding databases](https://www.iata.org/acd) | maintained airline, airport, and intermodal assignments; current database is continuously updated | full structured datasets require subscription; limited official lookup is public | Adopt airline designators and location identifiers; record individual-code verification date. |
| [ICAO designators](https://www.icao.int/operational-safety/Designators-and-indicators) and [Doc 8643](https://www.icao.int/operational-safety/doc-8643-aircraft-type-designators) | Doc 8643/54, 54th edition, 2026; online data follows AIRAC updates | manual is paid; downloads require ICAO API registration | Adopt aircraft type designators; validate through lawful current access without copying the list. |
| [ISO 8601-1:2019](https://www.iso.org/standard/70907.html) | confirmed current in 2024 | full text is paid; public abstract describes scope | Adopt calendar-date and local-time interchange formats. |
| [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html) | ISO 4217:2015 with Maintenance Agency updates | ISO permits free use of currency codes; full standard is paid | Adopt alphabetic currency codes and current minor-unit data. |
| [ISO 3166](https://www.iso.org/iso-3166-country-codes.html) | ISO 3166-1:2020 with Maintenance Agency updates | ISO permits free use; automated collection may be paid | Reserve alpha-2 codes for future country properties; no current diagram key requires one. |
| [ISO 639](https://www.iso.org/iso-639-language-code) | ISO 639:2023 with maintained code sets | ISO permits free use of language codes | Reserve Set 1 identifiers for future language properties. |
| [ISO 80000-1:2022](https://www.iso.org/standard/76921.html) | published 2022 | full text is paid | Use its quantity/unit principles when measured properties are introduced. |

## Rejected or limited conclusions

- Project type paths such as `product/flight` are not OTA codes; they are namespaced project semantics.
- Generic labels such as `code`, `date`, `price`, and `status` were rejected because they omit role or value context.
- No exhaustive OTA room, smoking, payment, or order-status code list is adopted without a lawfully accessible pinned version.
- IATA and ICAO lists are not copied into the repository. Test evidence verifies only the codes it uses.
- Vendor names and business lifecycle states are not misrepresented as ISO values.

## Limitations

The review did not purchase restricted standards or datasets and is not legal advice. Exact OTA schema mappings, production reference-data licensing, update distribution, and retention of historical code meanings require later decisions. Current terms remain proposed until stakeholder and independent lifecycle review.
