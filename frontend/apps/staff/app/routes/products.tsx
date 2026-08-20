import { Badge, Button, Grid, Group, Select, Stack, TextInput, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, CursorPager, DataTable, StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { useAllPages } from "../lib/use-cursor-page";
import { ProductCreatePanel } from "../lib/product-create-panel";
import { ProductDetailPanel } from "../lib/product-detail-panel";
import {
  CATALOGUE_ROOT_TYPE_LABEL,
  CATALOGUE_ROOT_TYPE_OPTIONS,
  LIFECYCLE_STATUS_LABEL,
  LIFECYCLE_STATUS_OPTIONS,
  catalogueProperties,
  productDisplayLabel,
} from "../lib/catalogue-product-types";
import { StaffShell } from "../lib/shell";

type RightPane = { readonly mode: "none" } | { readonly mode: "detail"; readonly productId: string } | { readonly mode: "create" };

type ProductResponse = components["schemas"]["ProductResponse"];
type OrgaRoleResponse = components["schemas"]["OrgaRoleResponse"];

const PAGE_SIZE = 20;

const TYPE_OPTIONS = [{ value: "all", label: "All" }, ...CATALOGUE_ROOT_TYPE_OPTIONS];
const LIFECYCLE_OPTIONS = [{ value: "all", label: "All" }, ...LIFECYCLE_STATUS_OPTIONS];

export function meta() {
  return [{ title: "Products — CCT Staff" }];
}

/**
 * S-003 (issue #31): fetches every product up front (see `useAllPages`) so
 * name/type/lifecycle/supplier filters apply across the whole collection,
 * matching PersonsRoute (#29) and OrganisationsRoute (#30). Selecting a row
 * shows its detail in the right pane inline instead of navigating away.
 */
export default function ProductsRoute() {
  const allProducts = useAllPages<ProductResponse>(["products"], (cursor) =>
    apiClient.GET("/products", { params: { query: { cursor, limit: 50 } } })
  );

  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("all");
  const [lifecycle, setLifecycle] = useState<string>("all");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [rightPane, setRightPane] = useState<RightPane>({ mode: "none" });

  const supplierQueries = useQueries({
    queries: allProducts.items.map((product) => ({
      queryKey: ["products", product.entityId, "supplier"],
      queryFn: async () => {
        const { data } = await apiClient.GET("/products/{product_id}/supplier", {
          params: { path: { product_id: product.entityId } },
        });
        return (data ?? null) as OrgaRoleResponse | null;
      },
    })),
  });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const supplierTerm = supplierSearch.trim().toLowerCase();
    return allProducts.items
      .map((product, index) => ({ product, supplier: supplierQueries[index]?.data ?? null }))
      .filter(({ product, supplier }) => {
        if (term) {
          const label = productDisplayLabel(product.entityId, product.type, catalogueProperties(product.properties).displayName);
          if (!label.toLowerCase().includes(term) && !product.entityId.toLowerCase().includes(term)) return false;
        }
        if (type !== "all" && product.type !== type) return false;
        if (lifecycle !== "all" && catalogueProperties(product.properties).lifecycleStatusCode !== lifecycle) return false;
        if (supplierTerm && !(supplier?.entityId.toLowerCase().includes(supplierTerm))) return false;
        return true;
      });
  }, [allProducts.items, supplierQueries, search, type, lifecycle, supplierSearch]);

  useEffect(() => {
    setPageIndex(0);
  }, [search, type, lifecycle, supplierSearch]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const clampedPageIndex = Math.min(pageIndex, pageCount - 1);
  const pageRows = rows.slice(clampedPageIndex * PAGE_SIZE, clampedPageIndex * PAGE_SIZE + PAGE_SIZE);

  return (
    <StaffShell breadcrumbs={[{ label: "Touristic product catalogue" }]}>
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Title order={1}>Touristic product catalogue</Title>
          <Button onClick={() => setRightPane({ mode: "create" })}>Create product draft</Button>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="sm">
              <Group align="flex-end">
                <TextInput
                  label="Search"
                  placeholder="Name or entity ID"
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                />
                <Select label="Type" data={TYPE_OPTIONS} value={type} onChange={(value) => setType(value ?? "all")} allowDeselect={false} />
                <Select
                  label="Lifecycle"
                  data={LIFECYCLE_OPTIONS}
                  value={lifecycle}
                  onChange={(value) => setLifecycle(value ?? "all")}
                  allowDeselect={false}
                />
                <TextInput
                  label="Supplier"
                  placeholder="Supplier role entity ID"
                  value={supplierSearch}
                  onChange={(event) => setSupplierSearch(event.currentTarget.value)}
                />
              </Group>

              {allProducts.status === "pending" ? <StatusBanner kind="loading" title="Loading products…" /> : null}
              {allProducts.status === "error" && allProducts.error ? (
                <ApiErrorBanner error={allProducts.error} onRetry={allProducts.refetch} />
              ) : null}
              {allProducts.status === "success" ? (
                <>
                  <DataTable<{ product: ProductResponse; supplier: OrgaRoleResponse | null }>
                    caption={`Product definitions · ${rows.length === 0 ? 0 : clampedPageIndex * PAGE_SIZE + 1}–${Math.min(rows.length, (clampedPageIndex + 1) * PAGE_SIZE)} of ${rows.length}`}
                    rowKey={(row) => row.product.entityId}
                    rows={pageRows}
                    emptyMessage="No products match these filters."
                    onRowActivate={(row) => setRightPane({ mode: "detail", productId: row.product.entityId })}
                    isRowSelected={(row) => rightPane.mode === "detail" && row.product.entityId === rightPane.productId}
                    columns={[
                      {
                        key: "product",
                        header: "Product",
                        render: (row) => productDisplayLabel(row.product.entityId, row.product.type, catalogueProperties(row.product.properties).displayName),
                      },
                      { key: "type", header: "Type", render: (row) => CATALOGUE_ROOT_TYPE_LABEL[row.product.type] ?? row.product.type },
                      {
                        key: "lifecycle",
                        header: "Lifecycle",
                        render: (row) => {
                          const code = catalogueProperties(row.product.properties).lifecycleStatusCode;
                          const active = code === "product/active";
                          const retired = code === "product/retired";
                          return <Badge color={active ? "green" : retired ? "gray" : undefined}>{(code && LIFECYCLE_STATUS_LABEL[code]) ?? code ?? "—"}</Badge>;
                        },
                      },
                    ]}
                  />
                  <CursorPager
                    hasPrevious={clampedPageIndex > 0}
                    hasNext={clampedPageIndex < pageCount - 1}
                    onPrevious={() => setPageIndex((index) => Math.max(0, index - 1))}
                    onNext={() => setPageIndex((index) => Math.min(pageCount - 1, index + 1))}
                  />
                </>
              ) : null}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            {rightPane.mode === "detail" ? (
              <ProductDetailPanel productId={rightPane.productId} />
            ) : rightPane.mode === "create" ? (
              <ProductCreatePanel
                onCreated={(productId) => setRightPane({ mode: "detail", productId })}
                onCancel={() => setRightPane({ mode: "none" })}
              />
            ) : (
              <StatusBanner kind="info" title="No product selected" description="Select a product from the list to view its details, or create one." />
            )}
          </Grid.Col>
        </Grid>
      </Stack>
    </StaffShell>
  );
}
