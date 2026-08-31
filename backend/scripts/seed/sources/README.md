# Seed Sources

Authoritative, reviewable seed facts, each directly traceable to a
`docs/test/test-scenarios/{test-scenarios.md,catalogs.md}` table (see
`../README.md` for the full package layout and `schema.py` for the shape
each file must satisfy).

- `persons.json`: `Person` + `PersonRole` (`person/traveller`,
  `person/customer`) for `PER-001`..`PER-035`.
- `organisations.json`: `Organisation` + one `OrgaRole` each for the 7
  scenario-used and 60 reserve suppliers.
- `products.json`: `TouristicProductItem` for the 70 used (including
  `FLT-01`'s recursive leg children) and 60 reserve catalog products.
- `orders.json`: `OrderItem` headers and positions for `ORD-001`..`ORD-015`,
  one position per catalog product each `TS-nnn` references.
