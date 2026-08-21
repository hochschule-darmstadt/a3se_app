import { Button, Group, NumberInput, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import type { components } from "@cct/api-client";
import { useApiMutation } from "@cct/api-client";
import { ApiErrorBanner, CursorPager, DataTable, FormErrorSummary, StatusBanner } from "@cct/ui";

import { apiClient, queryClient } from "../api";
import { StaffShell } from "../lib/shell";
import { useCursorPage } from "../lib/use-cursor-page";

type StockItem = components["schemas"]["StockItemResponse"];
const STOCK_TYPES = [
  "stock/accommodation/room-category", "stock/experience/activity", "stock/experience/guided-tour",
  "stock/flight/seat", "stock/mobility/coach", "stock/mobility/rail", "stock/mobility/transfer",
  "stock/mobility/vehicle-rental", "stock/protection/travel", "stock/water/cruise", "stock/water/day-boat",
] as const;
const TYPE_OPTIONS = STOCK_TYPES.map((value) => ({ value, label: value.replace("stock/", "").replaceAll("/", " · ") }));

export function meta() { return [{ title: "Inventory — CCT Staff" }]; }

export default function StockItemsRoute() {
  const navigate = useNavigate();
  const page = useCursorPage<StockItem>(["stock-items"], (cursor) => apiClient.GET("/stock-items", { params: { query: { cursor, limit: 100 } } }));
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [state, setState] = useState<string | null>(null);
  const [productType, setProductType] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const rows = useMemo(() => page.items.filter((item) => {
    const haystack = `${item.entityId} ${item.productId} ${item.productDisplayNameChain.join(" ")} ${item.supplierDisplayName ?? ""}`.toLowerCase();
    return (!search.trim() || haystack.includes(search.trim().toLowerCase()))
      && (!fromDate || item.properties.serviceDate >= fromDate)
      && (!toDate || item.properties.serviceDate <= toDate)
      && (!state || item.availabilityState === state)
      && (!productType || item.productType === productType);
  }), [page.items, search, fromDate, toDate, state, productType]);

  return <StaffShell breadcrumbs={[{ label: "Inventory" }]}>
    <Stack gap="md">
      <Group justify="space-between"><div><Title order={1}>Inventory</Title><Text c="dimmed" size="sm">Pre-procured capacity by service and date.</Text></div><Group><Button onClick={() => setCreating(true)}>Add stock entry</Button><Button variant="default" disabled title="Supplier negotiation is deferred from this MVP">Request supplier capacity</Button></Group></Group>
      {creating ? <StockCreateForm onCancel={() => setCreating(false)} onCreated={(id) => navigate(`/stock-items/${id}`)} /> : null}
      <Group align="end" grow>
        <TextInput label="Product or supplier" value={search} onChange={(event) => setSearch(event.currentTarget.value)} />
        <TextInput label="From date" type="date" value={fromDate} onChange={(event) => setFromDate(event.currentTarget.value)} />
        <TextInput label="To date" type="date" value={toDate} onChange={(event) => setToDate(event.currentTarget.value)} />
        <Select label="State" clearable data={["available", "held", "allocated", "shortfall", "withdrawn", "expired"]} value={state} onChange={setState} />
        <Select label="Product type" searchable clearable data={TYPE_OPTIONS} value={productType} onChange={setProductType} />
      </Group>
      {page.status === "pending" ? <StatusBanner kind="loading" title="Loading inventory…" /> : null}
      {page.status === "error" && page.error ? <ApiErrorBanner error={page.error} onRetry={page.refetch} /> : null}
      {page.status === "success" ? <><DataTable<StockItem> caption="Availability by service" rowKey={(row) => row.entityId} rows={rows} emptyMessage="No stock entries match these filters." onRowActivate={(row) => navigate(`/stock-items/${row.entityId}`)} columns={[
        { key: "service", header: "Service", render: (row) => row.productDisplayNameChain.join(" · ") },
        { key: "supplier", header: "Supplier", render: (row) => row.supplierDisplayName ?? "—" },
        { key: "date", header: "Service date", render: (row) => row.properties.serviceDate },
        { key: "available", header: "Available", render: (row) => row.availableQuantity },
        { key: "held", header: "Held", render: (row) => row.properties.heldQuantity },
        { key: "allocated", header: "Allocated", render: (row) => row.properties.allocatedQuantity },
        { key: "state", header: "State", render: (row) => row.availabilityState },
      ]} /><CursorPager hasPrevious={page.hasPrevious} hasNext={page.hasNext} onPrevious={page.onPrevious} onNext={page.onNext} loading={page.isFetching} /></> : null}
    </Stack>
  </StaffShell>;
}

function StockCreateForm({ onCancel, onCreated }: { readonly onCancel: () => void; readonly onCreated: (id: string) => void }) {
  const [productId, setProductId] = useState(""); const [type, setType] = useState<(typeof STOCK_TYPES)[number]>(STOCK_TYPES[0]);
  const [serviceDate, setServiceDate] = useState(""); const [price, setPrice] = useState<string | number>(0); const [capacity, setCapacity] = useState<string | number>(1); const [errors, setErrors] = useState<string[]>([]);
  const mutation = useApiMutation<StockItem, void>(() => apiClient.POST("/stock-items", { body: { entityId: `STK-${crypto.randomUUID()}`, productId: productId.trim(), type, properties: { serviceDate, unitPriceAmount: String(price), currencyCode: "EUR", capacityQuantity: Number(capacity), heldQuantity: 0, allocatedQuantity: 0, inventoryStatusCode: "inventory/active" } } }));
  function submit(event: FormEvent) { event.preventDefault(); const next = [...(!productId.trim() ? ["Enter an existing product ID."] : []), ...(!serviceDate ? ["Choose a service date."] : []), ...(Number(capacity) < 0 ? ["Capacity cannot be negative."] : [])]; setErrors(next); if (next.length) return; mutation.mutate(undefined, { onSuccess: (item) => { void queryClient.invalidateQueries({ queryKey: ["stock-items"] }); onCreated(item.entityId); } }); }
  return <form aria-label="Add stock entry" onSubmit={submit} noValidate><Stack gap="xs"><Title order={2}>Add stock entry</Title><Text size="sm" c="dimmed">Records capacity already agreed with a supplier; it does not negotiate new capacity.</Text><FormErrorSummary errors={errors} /><Group grow><TextInput required label="Product ID" value={productId} onChange={(e) => setProductId(e.currentTarget.value)} /><Select required label="Stock type" data={TYPE_OPTIONS} value={type} onChange={(value) => setType((value as typeof type) ?? STOCK_TYPES[0])} /><TextInput required type="date" label="Service date" value={serviceDate} onChange={(e) => setServiceDate(e.currentTarget.value)} /><NumberInput required min={0} decimalScale={2} label="Unit sale price (EUR)" value={price} onChange={setPrice} /><NumberInput required min={0} label="Capacity" value={capacity} onChange={setCapacity} /></Group><Group><Button type="submit" loading={mutation.isPending}>Create stock entry</Button><Button variant="default" onClick={onCancel}>Cancel</Button></Group>{mutation.isError ? <ApiErrorBanner error={mutation.error} /> : null}</Stack></form>;
}
