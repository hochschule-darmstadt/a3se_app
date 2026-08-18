import { Stack, Title, Text } from "@mantine/core";
import { useNavigate } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, CursorPager, DataTable, StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { useCursorPage } from "../lib/use-cursor-page";
import { StaffShell } from "../lib/shell";

type StockItemResponse = components["schemas"]["StockItemResponse"];

export function meta() {
  return [{ title: "Stock items — CCT Staff" }];
}

/**
 * S-007: read-only, server-paginated stock items list. The backend has no
 * filter-by-product query on `/stock-items` (a recorded contract gap — see
 * the issue #22 report), so this is a plain paginated list rather than a
 * filtered one; that is the expected UX for this thin slice, not a bug.
 */
export default function StockItemsRoute() {
  const navigate = useNavigate();
  const page = useCursorPage<StockItemResponse>(["stock-items"], (cursor) =>
    apiClient.GET("/stock-items", { params: { query: { cursor, limit: 20 } } })
  );

  return (
    <StaffShell title="Stock items">
      <Stack gap="sm">
        <Title order={1}>Stock items</Title>
        <Text size="sm" c="dimmed">
          No filter by product is available yet; browse pages to find an item.
        </Text>

        {page.status === "pending" ? <StatusBanner kind="loading" title="Loading stock items…" /> : null}
        {page.status === "error" && page.error ? <ApiErrorBanner error={page.error} onRetry={page.refetch} /> : null}
        {page.status === "success" ? (
          <>
            <DataTable<StockItemResponse>
              caption="Stock items"
              rowKey={(row) => row.entityId}
              rows={page.items}
              emptyMessage="No stock items to display."
              onRowActivate={(row) => navigate(`/stock-items/${row.entityId}`)}
              columns={[
                { key: "entityId", header: "Entity ID", render: (row) => row.entityId },
                { key: "type", header: "Type", render: (row) => row.type },
                { key: "serviceDate", header: "Service date", render: (row) => row.properties.serviceDate },
                {
                  key: "unitPriceAmount",
                  header: "Unit price",
                  render: (row) => `${row.properties.unitPriceAmount} ${row.properties.currencyCode}`,
                },
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
