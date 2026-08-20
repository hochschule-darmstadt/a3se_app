import { Button, Grid, Group, Select, Stack, TextInput, Title } from "@mantine/core";
import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { useAllPages } from "../lib/use-cursor-page";
import { ProductCreatePanel } from "../lib/product-create-panel";
import { ProductDetailPanel } from "../lib/product-detail-panel";
import { breadcrumbLabel, buildChildrenIndex, matchesSearchTerm, rootOf, type ProductTreeEntry } from "../lib/catalogue-tree";
import { ProductTreeList } from "../lib/product-tree-list";
import { LIFECYCLE_STATUS_OPTIONS, catalogueProperties, groupTypeOptions, typeLabel } from "../lib/catalogue-product-types";
import { StaffShell } from "../lib/shell";

type RightPane = { readonly mode: "none" } | { readonly mode: "detail"; readonly productId: string } | { readonly mode: "create" };

type ProductResponse = components["schemas"]["ProductResponse"];
type OrgaRoleResponse = components["schemas"]["OrgaRoleResponse"];
type OrganisationResponse = components["schemas"]["OrganisationResponse"];

const LIFECYCLE_OPTIONS = [{ value: "all", label: "All" }, ...LIFECYCLE_STATUS_OPTIONS];

export function meta() {
  return [{ title: "Products — CCT Staff" }];
}

/**
 * S-003 tree view (VIEW-S-003 follow-up, stakeholder direction after
 * reviewing the flat #31 catalogue): fetches every product plus, per
 * product, its ancestor chain (GET .../ancestors), so a search can match
 * anything from the supplying organisation down to a leaf component, and
 * every matched row can show the breadcrumb "up to the supplier" as its
 * title. Only the roots of that chain carry a supplier (stakeholder
 * decision), resolved via GET .../supplier and, from there, GET
 * organisations/roles/{roleId}/organisation. Matches become top-level tree
 * rows; each expands ("+") to its own children, lazily, to any depth.
 */
export default function ProductsRoute() {
  const allProducts = useAllPages<ProductResponse>(["products"], (cursor) =>
    apiClient.GET("/products", { params: { query: { cursor, limit: 50 } } })
  );

  const ancestorQueries = useQueries({
    queries: allProducts.items.map((product) => ({
      queryKey: ["products", product.entityId, "ancestors"],
      queryFn: async () => {
        const { data } = await apiClient.GET("/products/{product_id}/ancestors", {
          params: { path: { product_id: product.entityId } },
        });
        return (data ?? []) as ProductResponse[];
      },
    })),
  });

  const entries: ProductTreeEntry[] = useMemo(
    () => allProducts.items.map((product, index) => ({ product, ancestors: ancestorQueries[index]?.data ?? [] })),
    [allProducts.items, ancestorQueries]
  );
  const ancestorsLoaded = ancestorQueries.every((query) => query.status !== "pending");

  const rootIds = useMemo(() => Array.from(new Set(entries.map((entry) => rootOf(entry).entityId))), [entries]);

  const supplierQueries = useQueries({
    queries: rootIds.map((rootId) => ({
      queryKey: ["products", rootId, "supplier"],
      queryFn: async () => {
        const { data } = await apiClient.GET("/products/{product_id}/supplier", { params: { path: { product_id: rootId } } });
        return (data ?? null) as OrgaRoleResponse | null;
      },
      enabled: ancestorsLoaded,
    })),
  });
  const supplierByRootId = useMemo(() => {
    const map = new Map<string, OrgaRoleResponse | null>();
    rootIds.forEach((rootId, index) => map.set(rootId, supplierQueries[index]?.data ?? null));
    return map;
  }, [rootIds, supplierQueries]);
  const suppliersLoaded = supplierQueries.every((query) => query.status !== "pending");

  const roleIds = useMemo(
    () => Array.from(new Set(Array.from(supplierByRootId.values()).flatMap((role) => (role ? [role.entityId] : [])))),
    [supplierByRootId]
  );

  const organisationQueries = useQueries({
    queries: roleIds.map((roleId) => ({
      queryKey: ["organisations", "roles", roleId, "organisation"],
      queryFn: async () => {
        const { data } = await apiClient.GET("/organisations/roles/{role_id}/organisation", { params: { path: { role_id: roleId } } });
        return (data ?? null) as OrganisationResponse | null;
      },
      enabled: suppliersLoaded,
    })),
  });
  const organisationByRoleId = useMemo(() => {
    const map = new Map<string, OrganisationResponse | null>();
    roleIds.forEach((roleId, index) => map.set(roleId, organisationQueries[index]?.data ?? null));
    return map;
  }, [roleIds, organisationQueries]);

  const childrenByParentId = useMemo(() => buildChildrenIndex(entries), [entries]);

  // Every type actually present in the DB, not a hardcoded list -- so a
  // newly seeded/created type is never silently missing from the filter.
  const typeOptions = useMemo(() => {
    const types = Array.from(new Set(allProducts.items.map((product) => product.type))).sort();
    return groupTypeOptions(types.map((value) => ({ value, label: typeLabel(value) })));
  }, [allProducts.items]);

  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("all");
  const [lifecycle, setLifecycle] = useState<string>("all");
  const [rightPane, setRightPane] = useState<RightPane>({ mode: "none" });

  const matches = useMemo(() => {
    const term = search.trim().toLowerCase();
    const isFiltered = term.length > 0 || type !== "all" || lifecycle !== "all";
    return entries
      .filter((entry) => {
        // Unfiltered: show only tree roots (children reached via "+"), so the
        // default view is a real tree, not every product flattened. Filtered
        // (search/type/lifecycle): surface a match at any depth as its own
        // top-level row, per stakeholder direction -- selecting a child-level
        // type (e.g. accommodation/room) should jump straight to it.
        if (!isFiltered) return entry.ancestors.length === 0;
        if (type !== "all" && entry.product.type !== type) return false;
        if (lifecycle !== "all" && catalogueProperties(entry.product.properties).lifecycleStatusCode !== lifecycle) return false;
        return true;
      })
      .map((entry) => ({ entry, breadcrumb: breadcrumbLabel(entry, supplierByRootId, organisationByRoleId) }))
      .filter(({ entry, breadcrumb }) => !term || matchesSearchTerm(entry, term, breadcrumb))
      .map(({ entry, breadcrumb }) => ({ product: entry.product, breadcrumb }));
  }, [entries, search, type, lifecycle, supplierByRootId, organisationByRoleId]);

  const loading = allProducts.status === "pending" || !ancestorsLoaded;

  return (
    <StaffShell breadcrumbs={[{ label: "Touristic product catalogue" }]}>
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Title order={1}>Touristic product catalogue</Title>
          <Button onClick={() => setRightPane({ mode: "create" })}>Create product draft</Button>
        </Group>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="sm">
              <Group align="flex-end">
                <TextInput
                  label="Search"
                  placeholder="Anything: supplier, product name, or ID"
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  style={{ flex: 1 }}
                />
                <Select
                  label="Type"
                  data={[{ group: "All", items: [{ value: "all", label: "All" }] }, ...typeOptions]}
                  value={type}
                  onChange={(value) => setType(value ?? "all")}
                  allowDeselect={false}
                />
                <Select
                  label="Lifecycle"
                  data={LIFECYCLE_OPTIONS}
                  value={lifecycle}
                  onChange={(value) => setLifecycle(value ?? "all")}
                  allowDeselect={false}
                />
              </Group>

              {allProducts.status === "pending" ? <StatusBanner kind="loading" title="Loading products…" /> : null}
              {allProducts.status === "error" && allProducts.error ? (
                <ApiErrorBanner error={allProducts.error} onRetry={allProducts.refetch} />
              ) : null}
              {loading && allProducts.status === "success" ? <StatusBanner kind="loading" title="Loading catalogue hierarchy…" /> : null}
              {!loading && allProducts.status === "success" ? (
                <ProductTreeList
                  matches={matches}
                  childrenByParentId={childrenByParentId}
                  selectedId={rightPane.mode === "detail" ? rightPane.productId : null}
                  onSelect={(productId) => setRightPane({ mode: "detail", productId })}
                  emptyMessage="No products match these filters."
                />
              ) : null}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }} style={{ position: "sticky", top: 88, alignSelf: "flex-start", maxHeight: "calc(100vh - 104px)", overflowY: "auto" }}>
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
