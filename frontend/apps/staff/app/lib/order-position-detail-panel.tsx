import { Badge, Group, Stack, Text, Title } from "@mantine/core";
import { useApiQuery } from "@cct/api-client";
import { ApiErrorBanner, CctIcon, StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { PositionHierarchies, Row } from "./order-detail-panel";

/**
 * Standalone detail for one order/position (VIEW-S-005 follow-up): reuses
 * the order detail's own `.../detail` fetch (same React Query cache key, so
 * selecting a position after already viewing its order is instant) and the
 * shared `PositionHierarchies` chip rendering, matching the order detail
 * panel's per-position block but as its own right-pane view, mirroring how
 * selecting a product-tree child opens that child's own detail rather than
 * staying on the parent's.
 */
export function OrderPositionDetailPanel({
  orderId,
  positionId,
}: {
  readonly orderId: string;
  readonly positionId: string;
}) {
  const query = useApiQuery(["orders", orderId, "detail"], () =>
    apiClient.GET("/orders/{order_id}/detail", { params: { path: { order_id: orderId } } })
  );
  const position = query.data?.positions.find((candidate) => candidate.positionId === positionId);
  const stockQuery = useApiQuery(
    ["stock-items", position?.stockItemId],
    () => apiClient.GET("/stock-items/{stock_item_id}", { params: { path: { stock_item_id: position!.stockItemId! } } }),
    { enabled: Boolean(position?.stockItemId) }
  );

  if (query.status === "pending") return <StatusBanner kind="loading" title="Loading position…" />;
  if (query.status === "error") return <ApiErrorBanner error={query.error} onRetry={() => query.refetch()} />;
  if (!position) return <StatusBanner kind="error" title="Position not found" description={`No position ${positionId} on this order.`} />;

  const detail = query.data;
  const stock = stockQuery.data;
  const label = stock ? `${stock.productDisplayNameChain.join(" · ")} · ${stock.properties.serviceDate}` : position.positionId;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <Group gap="xs"><CctIcon.inventory size={28} aria-hidden /><Title order={1}>{label}</Title></Group>
        {position.stockItemId ? null : <Badge color="orange">Unresolved</Badge>}
      </Group>
      <Row label="ID"><Text size="sm">{position.positionId}</Text></Row>
      <PositionHierarchies
        orderId={orderId}
        customerRoleId={detail.customerRoleId}
        customerPersonId={detail.customerPersonId}
        customerDisplayName={detail.customerDisplayName}
        position={position}
        stock={stock}
      />
    </Stack>
  );
}
