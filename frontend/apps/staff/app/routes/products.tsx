import { Button, Grid, Group, Select, Stack, TextInput, Title } from "@mantine/core";
import { useEffect, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, CursorPager, StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { useAllPages } from "../lib/use-cursor-page";
import { ProductCreatePanel } from "../lib/product-create-panel";
import { ProductDetailPanel } from "../lib/product-detail-panel";
import { breadcrumbLabel, buildChildrenIndex, matchesSearchTerm, type ProductTreeEntry } from "../lib/catalogue-tree";
import { ProductTreeList } from "../lib/product-tree-list";
import { LIFECYCLE_STATUS_OPTIONS, catalogueProperties, sortTypeOptionsAlphabetically, typeLabel } from "../lib/catalogue-product-types";
import { StaffShell } from "../lib/shell";
import { STAFF_VIEW_PARAM, patchStaffViewState, readStaffViewOption, readStaffViewPage, staffViewHref } from "../lib/staff-view-state";

type RightPane = { readonly mode: "none" } | { readonly mode: "detail"; readonly productId: string } | { readonly mode: "create" };

type ProductResponse = components["schemas"]["ProductResponse"];

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
  const [searchParams, setSearchParams] = useSearchParams();
  const supplierRoleId = searchParams.get("supplierRoleId");
  const allProducts = useAllPages<ProductResponse>(["products", "supplier", supplierRoleId], (cursor) =>
    apiClient.GET("/products", { params: { query: { cursor, limit: 50, supplierRoleId: supplierRoleId || undefined } } })
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

  const childrenByParentId = useMemo(() => buildChildrenIndex(entries), [entries]);

  // Every type actually present in the DB, not a hardcoded list -- so a
  // newly seeded/created type is never silently missing from the filter.
  const typeOptions = useMemo(() => {
    const types = Array.from(new Set(allProducts.items.map((product) => product.type)));
    return sortTypeOptionsAlphabetically(types.map((value) => ({ value, label: typeLabel(value) })));
  }, [allProducts.items]);

  const search = searchParams.get(STAFF_VIEW_PARAM.search) ?? "";
  const type = readStaffViewOption(searchParams, STAFF_VIEW_PARAM.type, typeOptions.map((option) => option.value));
  const lifecycle = readStaffViewOption(searchParams, STAFF_VIEW_PARAM.status, LIFECYCLE_STATUS_OPTIONS.map((option) => option.value));
  const detailId = searchParams.get(STAFF_VIEW_PARAM.detail);
  const rightPane: RightPane = searchParams.get(STAFF_VIEW_PARAM.panel) === "create"
    ? { mode: "create" }
    : detailId ? { mode: "detail", productId: detailId } : { mode: "none" };

  function updateView(patch: Parameters<typeof patchStaffViewState>[1], replace = false) {
    setSearchParams(patchStaffViewState(searchParams, patch), { replace });
  }

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
      .map((entry) => ({ entry, breadcrumb: breadcrumbLabel(entry) }))
      .filter(({ entry, breadcrumb }) => !term || matchesSearchTerm(entry, term, breadcrumb))
      .map(({ entry, breadcrumb }) => ({ product: entry.product, breadcrumb }));
  }, [entries, search, type, lifecycle]);

  const loading = allProducts.status === "pending" || !ancestorsLoaded;

  // Client-side pagination over the already-fetched top-level matches: the
  // tree needs every product's full ancestor chain in memory anyway to
  // compute search/filter matches and the children index, so there is no
  // cheaper server page to fetch here -- this instead caps how many rows
  // render at once, which is what actually removes the need to scroll.
  const PAGE_SIZE = 20;
  const page = Math.min(readStaffViewPage(searchParams), Math.max(0, Math.ceil(matches.length / PAGE_SIZE) - 1));
  const pagedMatches = useMemo(() => matches.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE), [matches, page]);
  const listCaption = `Products · ${matches.length === 0 ? 0 : page * PAGE_SIZE + 1}–${Math.min(matches.length, (page + 1) * PAGE_SIZE)} of ${matches.length}`;

  useEffect(() => {
    if (ancestorsLoaded && pagedMatches.length === 1 && !detailId && searchParams.get(STAFF_VIEW_PARAM.panel) !== "create") {
      updateView({ [STAFF_VIEW_PARAM.detail]: pagedMatches[0]!.product.entityId }, true);
    }
  }, [ancestorsLoaded, pagedMatches, detailId, searchParams]);

  return (
    <StaffShell breadcrumbs={[{ label: "Touristic product catalogue" }]}>
      <Stack gap="sm" style={{ height: "calc(100vh - 104px)" }}>
        <Group justify="space-between" align="center">
          <Title order={1}>Touristic product catalogue</Title>
          <Button onClick={() => updateView({ [STAFF_VIEW_PARAM.panel]: "create", [STAFF_VIEW_PARAM.detail]: null })}>Create product</Button>
        </Group>

        {/*
          Each column scrolls independently (its own scrollbar next to its own
          content), rather than the whole page scrolling with the browser's
          scrollbar far off to the right and the detail pane faked into place
          via `position: sticky`. The list's search/filter bar and the tree's
          table header both stay outside/pinned within the list's own scroll
          area, matching the fixed left-nav/header chrome elsewhere in the app.
        */}
        <Grid gutter="xl" style={{ flex: 1, minHeight: 0 }}>
          <Grid.Col span={{ base: 12, md: 7 }} style={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
            <Stack gap="sm" style={{ flex: "0 0 auto" }}>
              <Group align="flex-end">
                <TextInput
                  label="Search"
                  placeholder="Anything: supplier, product name, or ID"
                  value={search}
                  onChange={(event) => updateView({ [STAFF_VIEW_PARAM.search]: event.currentTarget.value, [STAFF_VIEW_PARAM.page]: null }, true)}
                  style={{ flex: 1 }}
                />
                <Select
                  label="Type"
                  data={[{ value: "all", label: "All" }, ...typeOptions]}
                  value={type}
                  onChange={(value) => updateView({ [STAFF_VIEW_PARAM.type]: value === "all" ? null : value, [STAFF_VIEW_PARAM.page]: null }, true)}
                  allowDeselect={false}
                />
                <Select
                  label="Lifecycle"
                  data={LIFECYCLE_OPTIONS}
                  value={lifecycle}
                  onChange={(value) => updateView({ [STAFF_VIEW_PARAM.status]: value === "all" ? null : value, [STAFF_VIEW_PARAM.page]: null }, true)}
                  allowDeselect={false}
                />
              </Group>

              {allProducts.status === "pending" ? <StatusBanner kind="loading" title="Loading products…" /> : null}
              {allProducts.status === "error" && allProducts.error ? (
                <ApiErrorBanner error={allProducts.error} onRetry={allProducts.refetch} />
              ) : null}
              {loading && allProducts.status === "success" ? <StatusBanner kind="loading" title="Loading catalogue hierarchy…" /> : null}
            </Stack>

            {!loading && allProducts.status === "success" ? (
              <div style={{ flex: "1 1 auto", overflowY: "auto", minHeight: 0 }}>
                <ProductTreeList
                  matches={pagedMatches}
                  childrenByParentId={childrenByParentId}
                  selectedId={rightPane.mode === "detail" ? rightPane.productId : null}
                  onSelect={(productId) => updateView({ [STAFF_VIEW_PARAM.detail]: productId, [STAFF_VIEW_PARAM.panel]: null })}
                  emptyMessage="No products match these filters."
                  caption={listCaption}
                />
              </div>
            ) : null}
            {!loading && allProducts.status === "success" && matches.length > PAGE_SIZE ? (
              <div style={{ flex: "0 0 auto" }}>
                <CursorPager
                  hasPrevious={page > 0}
                  hasNext={(page + 1) * PAGE_SIZE < matches.length}
                  onPrevious={() => updateView({ [STAFF_VIEW_PARAM.page]: page - 1 })}
                  onNext={() => updateView({ [STAFF_VIEW_PARAM.page]: page + 1 })}
                />
              </div>
            ) : null}
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }} style={{ height: "100%", overflowY: "auto" }}>
            {rightPane.mode === "detail" ? (
              <ProductDetailPanel
                productId={rightPane.productId}
                productHref={(productId) => staffViewHref("/products", searchParams, {
                  [STAFF_VIEW_PARAM.detail]: productId,
                  [STAFF_VIEW_PARAM.panel]: null,
                })}
                organisationHref={(organisationId, roleId) => {
                  const href = staffViewHref("/organisations", new URLSearchParams(), {
                    [STAFF_VIEW_PARAM.detail]: organisationId,
                  });
                  return roleId ? `${href}#role-${roleId}` : href;
                }}
              />
            ) : rightPane.mode === "create" ? (
              <ProductCreatePanel
                onCreated={(productId) => updateView({ [STAFF_VIEW_PARAM.detail]: productId, [STAFF_VIEW_PARAM.panel]: null })}
                onCancel={() => updateView({ [STAFF_VIEW_PARAM.panel]: null })}
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
