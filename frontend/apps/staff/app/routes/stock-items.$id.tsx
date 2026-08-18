import { Stack, Text, Title } from "@mantine/core";
import { useParams } from "react-router";

import { ApiErrorBanner, ResourceCard, StatusBanner } from "@cct/ui";
import { useApiQuery } from "@cct/api-client";

import { apiClient } from "../api";
import { StaffShell } from "../lib/shell";

export function meta() {
  return [{ title: "Stock item detail — CCT Staff" }];
}

/** Read-only stock item detail. */
export default function StockItemDetailRoute() {
  const { stockItemId } = useParams();

  const stockItemQuery = useApiQuery(
    ["stock-items", stockItemId],
    () =>
      apiClient.GET("/stock-items/{stock_item_id}", {
        params: { path: { stock_item_id: stockItemId as string } },
      }),
    { enabled: Boolean(stockItemId) }
  );

  if (!stockItemId) {
    return (
      <StaffShell title="Stock item detail">
        <StatusBanner kind="error" title="No stock item specified" />
      </StaffShell>
    );
  }

  if (stockItemQuery.status === "pending") {
    return (
      <StaffShell title="Stock item detail">
        <StatusBanner kind="loading" title="Loading stock item…" />
      </StaffShell>
    );
  }

  if (stockItemQuery.status === "error") {
    return (
      <StaffShell title="Stock item detail">
        <ApiErrorBanner error={stockItemQuery.error} onRetry={() => stockItemQuery.refetch()} />
      </StaffShell>
    );
  }

  const stockItem = stockItemQuery.data;

  return (
    <StaffShell title={stockItem.entityId}>
      <Stack gap="md">
        <Title order={1}>{stockItem.entityId}</Title>
        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
          Read-only
        </Text>
        <ResourceCard
          title={stockItem.entityId}
          subtitle={stockItem.type}
          badge={stockItem.type}
          details={[
            { label: "Entity ID", value: stockItem.entityId },
            { label: "Type", value: stockItem.type },
            { label: "Service date", value: stockItem.properties.serviceDate },
            {
              label: "Unit price",
              value: `${stockItem.properties.unitPriceAmount} ${stockItem.properties.currencyCode}`,
            },
          ]}
        />
      </Stack>
    </StaffShell>
  );
}
