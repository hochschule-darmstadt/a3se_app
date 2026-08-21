import { Button, Grid, Group, Select, Stack, TextInput, Title } from "@mantine/core";
import { useSearchParams } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, CursorPager, DataTable, StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { CREATABLE_TYPE_OPTIONS } from "../lib/catalogue-product-types";
import { StaffShell } from "../lib/shell";
import { STAFF_VIEW_PARAM, patchStaffViewState, readStaffViewOption } from "../lib/staff-view-state";
import { StockCreatePanel } from "../lib/stock-create-panel";
import { StockDetailPanel } from "../lib/stock-detail-panel";
import { useCursorPage } from "../lib/use-cursor-page";

type StockItem = components["schemas"]["StockItemResponse"];
type RightPane = { readonly mode: "none" } | { readonly mode: "detail"; readonly stockItemId: string } | { readonly mode: "create" };
const AVAILABILITY_OPTIONS = ["available", "held", "allocated", "shortfall", "withdrawn", "expired"].map((value) => ({ value, label: value[0]!.toUpperCase() + value.slice(1) }));
const PRODUCT_TYPE_OPTIONS = CREATABLE_TYPE_OPTIONS.map((option) => ({ value: option.value, label: option.label }));

export function meta() { return [{ title: "Inventory — CCT Staff" }]; }

/** VIEW-S-007: server-filtered inventory list with the shared staff split-pane interaction pattern. */
export default function StockItemsRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get(STAFF_VIEW_PARAM.search) ?? "";
  const fromDate = searchParams.get(STAFF_VIEW_PARAM.fromDate) ?? "";
  const toDate = searchParams.get(STAFF_VIEW_PARAM.toDate) ?? "";
  const availability = readStaffViewOption(searchParams, STAFF_VIEW_PARAM.status, AVAILABILITY_OPTIONS.map((option) => option.value));
  const productType = readStaffViewOption(searchParams, STAFF_VIEW_PARAM.type, PRODUCT_TYPE_OPTIONS.map((option) => option.value));
  const detailId = searchParams.get(STAFF_VIEW_PARAM.detail);
  const rightPane: RightPane = searchParams.get(STAFF_VIEW_PARAM.panel) === "create" ? { mode: "create" } : detailId ? { mode: "detail", stockItemId: detailId } : { mode: "none" };

  function updateView(patch: Parameters<typeof patchStaffViewState>[1], replace = false) {
    setSearchParams(patchStaffViewState(searchParams, patch), { replace });
  }

  const page = useCursorPage<StockItem>(["stock-items", "filtered", search, fromDate, toDate, availability, productType], (cursor) => apiClient.GET("/stock-items", { params: { query: {
    cursor, limit: 20,
    search: search.trim() || undefined,
    serviceDateFrom: fromDate || undefined,
    serviceDateTo: toDate || undefined,
    availabilityState: availability === "all" ? undefined : availability as never,
    productType: productType === "all" ? undefined : productType,
  } } }));

  return <StaffShell breadcrumbs={[{ label: "Inventory" }]}>
    <Stack gap="sm" style={{ height: "calc(100vh - 104px)" }}>
      <Group justify="space-between" align="center"><Title order={1}>Inventory</Title><Group><Button onClick={() => updateView({ [STAFF_VIEW_PARAM.panel]: "create", [STAFF_VIEW_PARAM.detail]: null })}>Add stock entry</Button><Button variant="default" disabled title="Supplier negotiation is deferred from this MVP">Request supplier capacity</Button></Group></Group>
      <Grid gutter="xl" style={{ flex: 1, minHeight: 0 }}>
        <Grid.Col span={{ base: 12, md: 7 }} style={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <Stack gap="sm" style={{ flex: "0 0 auto" }}>
            <Group align="flex-end">
              <TextInput label="Search" placeholder="Product, supplier, chain text, or ID" value={search} onChange={(event) => updateView({ [STAFF_VIEW_PARAM.search]: event.currentTarget.value }, true)} style={{ flex: 1 }} />
              <TextInput label="From" type="date" value={fromDate} onChange={(event) => updateView({ [STAFF_VIEW_PARAM.fromDate]: event.currentTarget.value }, true)} />
              <TextInput label="To" type="date" value={toDate} onChange={(event) => updateView({ [STAFF_VIEW_PARAM.toDate]: event.currentTarget.value }, true)} />
            </Group>
            <Group align="flex-end">
              <Select label="State" data={[{ value: "all", label: "All" }, ...AVAILABILITY_OPTIONS]} value={availability} onChange={(value) => updateView({ [STAFF_VIEW_PARAM.status]: value === "all" ? null : value }, true)} allowDeselect={false} />
              <Select searchable label="Product type" data={[{ value: "all", label: "All" }, ...PRODUCT_TYPE_OPTIONS]} value={productType} onChange={(value) => updateView({ [STAFF_VIEW_PARAM.type]: value === "all" ? null : value }, true)} allowDeselect={false} style={{ flex: 1 }} />
            </Group>
            {page.status === "pending" ? <StatusBanner kind="loading" title="Loading inventory…" /> : null}
            {page.status === "error" && page.error ? <ApiErrorBanner error={page.error} onRetry={page.refetch} /> : null}
          </Stack>
          {page.status === "success" ? <div style={{ flex: "1 1 auto", overflowY: "auto", minHeight: 0 }}><DataTable<StockItem> caption="Availability by service" rowKey={(row) => row.entityId} rows={page.items} emptyMessage="No stock entries match these filters." onRowActivate={(row) => updateView({ [STAFF_VIEW_PARAM.detail]: row.entityId, [STAFF_VIEW_PARAM.panel]: null })} isRowSelected={(row) => rightPane.mode === "detail" && row.entityId === rightPane.stockItemId} columns={[
            { key: "service", header: "Service", render: (row) => `${row.properties.serviceDate} · ${row.productDisplayNameChain.join(" · ")}` },
            { key: "date", header: "Service date", render: (row) => row.properties.serviceDate },
            { key: "available", header: "Available", render: (row) => row.availableQuantity },
            { key: "held", header: "Held", render: (row) => row.properties.heldQuantity },
            { key: "allocated", header: "Allocated", render: (row) => row.properties.allocatedQuantity },
            { key: "state", header: "State", render: (row) => row.availabilityState },
          ]} /></div> : null}
          {page.status === "success" ? <div style={{ flex: "0 0 auto" }}><CursorPager hasPrevious={page.hasPrevious} hasNext={page.hasNext} onPrevious={page.onPrevious} onNext={page.onNext} loading={page.isFetching} /></div> : null}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }} style={{ height: "100%", overflowY: "auto" }}>
          {rightPane.mode === "detail" ? <StockDetailPanel stockItemId={rightPane.stockItemId} /> : rightPane.mode === "create" ? <StockCreatePanel onCreated={(id) => updateView({ [STAFF_VIEW_PARAM.detail]: id, [STAFF_VIEW_PARAM.panel]: null })} onCancel={() => updateView({ [STAFF_VIEW_PARAM.panel]: null })} /> : <StatusBanner kind="info" title="No stock entry selected" description="Select a stock entry from the list to view its details, or add one." />}
        </Grid.Col>
      </Grid>
    </Stack>
  </StaffShell>;
}
