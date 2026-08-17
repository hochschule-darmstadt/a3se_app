# Test-data Source Verification

- Status: proposed
- Owner: Test/Requirements
- Last reviewed: 2026-08-17

## Verified reference data

On 2026-08-17 the official [IATA Airline and Airport Code Search](https://www.iata.org/en/publications/directories/code-search/) was used as the authoritative individual-code source. The scenario airport set is:

| Country | City / airport | IATA code |
|---|---|---|
| Germany | Berlin Brandenburg | BER |
| Germany | Frankfurt | FRA |
| Germany | Munich | MUC |
| Peru | Lima | LIM |
| Peru | Cusco | CUZ |
| Brazil | São Paulo–Guarulhos | GRU |
| Brazil | Rio de Janeiro–Galeão | GIG |
| Argentina | Buenos Aires–Ezeiza | EZE |
| Chile | Santiago | SCL |
| Chile | Punta Arenas | PUQ |
| Colombia | Bogotá | BOG |
| Ecuador | Quito | UIO |

The synthetic airline designators `0Q` and `1Q` returned no assigned airline in the same official search on that date. They are test-only, must always be labelled fictitious and non-operational, and must be rechecked before a seeded dataset is published or regenerated because assignments can change.

## Evidence limitations

IATA's public search is interactive and does not provide a versioned bulk snapshot. This record therefore states the source and observation date rather than copying controlled reference data. It is sufficient for proposed test data, not evidence of perpetual availability or permission to operate. A reviewer must repeat the searches before acceptance. Airline schedules, hotels, prices, and services are intentionally fictional; the scenarios assert no real route operation or commercial availability.
