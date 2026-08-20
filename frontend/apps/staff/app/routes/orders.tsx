import { Select, Stack, Title } from "@mantine/core";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, CursorPager, DataTable, StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { useCursorPage } from "../lib/use-cursor-page";
import { StaffShell } from "../lib/shell";

type OrderResponse = components["schemas"]["OrderResponse"];

const STATUS_FILTER_OPTIONS = [
  { value: "order/reserved", label: "Reserved" },
  { value: "order/paid", label: "Paid" },
  { value: "order/fulfilled", label: "Fulfilled" },
  { value: "order/cancelled", label: "Cancelled" },
];

export function meta() {
  return [{ title: "Orders — CCT Staff" }];
}

/** S-005: server-paginated orders list with client-side sort/filter over the currently-fetched page. */
export default function OrdersRoute() {
  const navigate = useNavigate();
  const page = useCursorPage<OrderResponse>(["orders"], (cursor) =>
    apiClient.GET("/orders", { params: { query: { cursor, limit: 20 } } })
  );

  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const rows = useMemo(() => {
    let items = statusFilter
      ? page.items.filter((order) => order.properties.orderStatusCode === statusFilter)
      : page.items;
    if (sortKey) {
      items = [...items].sort((a, b) => {
        const left = sortKey === "orderNumber" ? a.properties.orderNumber : a.properties.orderStatusCode;
        const right = sortKey === "orderNumber" ? b.properties.orderNumber : b.properties.orderStatusCode;
        const comparison = left.localeCompare(right);
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }
    return items;
  }, [page.items, sortKey, sortDirection, statusFilter]);

  function handleSortChange(key: string) {
    if (sortKey === key) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  return (
    <StaffShell breadcrumbs={[{ label: "Orders" }]}>
      <Stack gap="sm">
        <Title order={1}>Orders</Title>
        <Select
          label="Filter by status"
          placeholder="All statuses"
          data={STATUS_FILTER_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
          clearable
        />

        {page.status === "pending" ? <StatusBanner kind="loading" title="Loading orders…" /> : null}
        {page.status === "error" && page.error ? (
          <ApiErrorBanner error={page.error} onRetry={page.refetch} />
        ) : null}
        {page.status === "success" ? (
          <>
            <DataTable<OrderResponse>
              caption="Orders"
              rowKey={(row) => row.entityId}
              rows={rows}
              emptyMessage="No orders to display."
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              onRowActivate={(row) => navigate(`/orders/${row.entityId}`)}
              columns={[
                { key: "orderNumber", header: "Order number", sortable: true, render: (row) => row.properties.orderNumber },
                { key: "orderStatusCode", header: "Status", sortable: true, render: (row) => row.properties.orderStatusCode },
                { key: "entityId", header: "ID", render: (row) => row.entityId },
              ]}
            />
            <CursorPager
              hasPrevious={page.hasPrevious}
              hasNext={page.hasNext}
              onPrevious={page.onPrevious}
              onNext={page.onNext}
              loading={page.isFetching}
            />
          </>
        ) : null}
      </Stack>
    </StaffShell>
  );
}
