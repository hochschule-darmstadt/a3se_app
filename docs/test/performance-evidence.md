# Performance Evidence

- Status: draft
- Owner: Test and Operations
- Last reviewed: 2026-09-09

This record supports issue [#55](https://github.com/hochschule-darmstadt/a3se_app/issues/55). Measurements are local development evidence, not a normal-load NFR-001 verification: Docker Compose, Neo4j Community Edition, synthetic seeded data, one request at a time, and no controlled concurrent-load profile.

## Baseline and change

The baseline used the seeded database with 25,550 dated `StockItem` records. Staff inventory's first `GET /stock-items?limit=20` request took approximately 2.6–2.8 seconds. A customer `GET /catalogue-search?search=Lima&serviceDateFrom=2027-01-01&serviceDateTo=2027-06-30&limit=100` request exceeded 30 seconds and timed out.

The customer search previously paged through matching StockItems and then issued a `REPRESENTS_PRODUCT` relationship read for each returned StockItem. The change adds a repository-side joined read that returns each matching sellable StockItem with its represented product in one Neo4j request, removing that API-level relationship fan-out. It also adds range indexes for `StockItem.serviceDate` and the stock capacity/status properties used by inventory predicates.

After the joined-read change, the same six-month Lima customer request completed in approximately 7.6 seconds and returned HTTP 200. After rebuilding with the schema indexes, it completed in approximately 4.35 seconds; the staff inventory request measured approximately 3.18 seconds. Cache warm-up, query compilation, and index creation were not isolated, so the improvement is attributed to the combined change rather than to the indexes alone.

The six-month interval is a stress case rather than a typical customer search. For a representative two-week interval, the post-change Lima query (`2027-04-01` through `2027-04-15`, `limit=100`) returned 51 product results in approximately 2.59 seconds. A repeat with `limit=20` returned in approximately 2.14 seconds. These timings are still above the one-second NFR-001 target, but the six-month stress result should not be used as the normal customer expectation.

## Interpretation and residual risk

The joined read materially improves the customer path, but the representative two-week measurement does not yet meet the NFR-001 target. The remaining cost is likely distributed across the flexible substring search over stock, product ancestry, supplier roles, and organisations, plus product-level display-name projection work. Staff product hierarchy loading still uses a bounded all-products read followed by per-product ancestor requests and remains a separate fan-out candidate. This is a measured optimization result, not proof that a particular index or search technology is the final solution.

Issue #55 must next compare the optimized Neo4j path with a dedicated indexed search projection. A vector store is not automatically required: semantic retrieval for #46/#47 should be evaluated separately from exact/full-text location and date filtering. Any additional search component must document update consistency from product/inventory writes, rebuild/replay behavior, operations, licensing, and before/after measurements.
