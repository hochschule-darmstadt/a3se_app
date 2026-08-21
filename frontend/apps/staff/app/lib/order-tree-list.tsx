import { Badge, Group, Table, Text, UnstyledButton } from "@mantine/core";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";

import type { components } from "@cct/api-client";
import { useApiQuery } from "@cct/api-client";
import { StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { typeLabel } from "./catalogue-product-types";

type Order = components["schemas"]["OrderSummaryResponse"];
type StockItem = components["schemas"]["StockItemResponse"];

export interface OrderTreeListProps {
  readonly orders: readonly Order[];
  readonly selectedId: string | null;
  readonly onSelect: (orderId: string) => void;
  readonly selectedPositionId: string | null;
  readonly onSelectPosition: (orderId: string, positionId: string) => void;
  readonly emptyMessage: string;
  readonly caption: string;
}

/**
 * VIEW-S-005 tree view, mirroring the product catalogue's `ProductTreeList`
 * (issue #31 follow-up): each order/header row is the root, each order/
 * position it contains expands (lazily, via the existing `.../detail`
 * endpoint) as a child row -- the same "+"/child-row pattern, not a
 * recursive depth, since a position never has children of its own.
 */
export function OrderTreeList({ orders, selectedId, onSelect, selectedPositionId, onSelectPosition, emptyMessage, caption }: OrderTreeListProps) {
  if (orders.length === 0) {
    return <StatusBanner kind="empty" title={emptyMessage} />;
  }

  return (
    <Table striped highlightOnHover captionSide="top" role="treegrid" aria-label="Orders tree" style={{ tableLayout: "fixed" }}>
      <Table.Caption>{caption}</Table.Caption>
      <colgroup>
        <col style={{ width: "45%" }} />
        <col style={{ width: "25%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "15%" }} />
      </colgroup>
      <Table.Thead style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "var(--mantine-color-body)" }}>
        <Table.Tr>
          <Table.Th>Order / position</Table.Th>
          <Table.Th>Customer</Table.Th>
          <Table.Th>Type / status</Table.Th>
          <Table.Th>Positions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {orders.map((order) => (
          <OrderTreeRow
            key={order.entityId}
            order={order}
            selectedId={selectedId}
            onSelect={onSelect}
            selectedPositionId={selectedPositionId}
            onSelectPosition={onSelectPosition}
          />
        ))}
      </Table.Tbody>
    </Table>
  );
}

function OrderTreeRow({
  order,
  selectedId,
  onSelect,
  selectedPositionId,
  onSelectPosition,
}: {
  readonly order: Order;
  readonly selectedId: string | null;
  readonly onSelect: (orderId: string) => void;
  readonly selectedPositionId: string | null;
  readonly onSelectPosition: (orderId: string, positionId: string) => void;
}) {
  const [expanded, setExpanded] = useState(selectedId === order.entityId && Boolean(selectedPositionId));
  const hasPositions = order.positionCount > 0;
  const selected = selectedId === order.entityId;
  const label = `Order ${order.properties.orderNumber}`;

  const detailQuery = useApiQuery(
    ["orders", order.entityId, "detail"],
    () => apiClient.GET("/orders/{order_id}/detail", { params: { path: { order_id: order.entityId } } }),
    { enabled: expanded }
  );
  const positions = detailQuery.data?.positions ?? [];
  const stockQueries = useQueries({
    queries: positions.map((position) => ({
      queryKey: ["stock-items", position.stockItemId],
      enabled: expanded && Boolean(position.stockItemId),
      queryFn: async () => {
        const { data, error } = await apiClient.GET("/stock-items/{stock_item_id}", {
          params: { path: { stock_item_id: position.stockItemId! } },
        });
        if (error) throw error;
        return data as StockItem;
      },
    })),
  });

  return (
    <>
      <Table.Tr
        role="row"
        aria-level={1}
        aria-selected={selected}
        aria-expanded={hasPositions ? expanded : undefined}
        bg={selected ? "var(--mantine-color-blue-0)" : undefined}
        onClick={() => onSelect(order.entityId)}
        style={{ cursor: "pointer" }}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(order.entityId);
          }
        }}
      >
        <Table.Td style={{ overflow: "hidden" }}>
          <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
            {hasPositions ? (
              <UnstyledButton
                aria-label={expanded ? `Collapse ${label}` : `Expand ${label}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setExpanded((value) => !value);
                }}
                w={16}
                ta="center"
                fw={700}
              >
                {expanded ? "−" : "+"}
              </UnstyledButton>
            ) : (
              <span style={{ display: "inline-block", width: 16, flexShrink: 0 }} />
            )}
            <Text size="sm" truncate style={{ minWidth: 0 }}>{label}</Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text size="sm" c="dimmed" truncate>{order.customerDisplayName ?? "—"}</Text>
        </Table.Td>
        <Table.Td>
          <Badge size="sm">{order.properties.orderStatusCode.replace("order/", "")}</Badge>
        </Table.Td>
        <Table.Td>
          <Text size="sm">
            {order.positionCount}
            {order.unresolvedPositionCount ? ` (${order.unresolvedPositionCount} unresolved)` : ""}
          </Text>
        </Table.Td>
      </Table.Tr>
      {expanded
        ? positions.map((position, index) => {
            const stock = stockQueries[index]?.data;
            const positionSelected = selectedPositionId === position.positionId;
            const positionLabel = stock ? `${stock.productDisplayNameChain.join(" · ")} · ${stock.properties.serviceDate}` : position.positionId;
            return (
              <Table.Tr
                key={position.positionId}
                role="row"
                aria-level={2}
                aria-selected={positionSelected}
                bg={positionSelected ? "var(--mantine-color-blue-0)" : undefined}
                onClick={() => onSelectPosition(order.entityId, position.positionId)}
                style={{ cursor: "pointer" }}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectPosition(order.entityId, position.positionId);
                  }
                }}
              >
                <Table.Td style={{ overflow: "hidden" }}>
                  <Group gap="xs" wrap="nowrap" style={{ paddingLeft: 20, minWidth: 0 }}>
                    <span style={{ display: "inline-block", width: 16, flexShrink: 0 }} />
                    <Text size="sm" truncate style={{ minWidth: 0 }}>{positionLabel}</Text>
                  </Group>
                </Table.Td>
                <Table.Td />
                <Table.Td>
                  {stock ? (
                    <Text size="sm" c="dimmed" truncate>{typeLabel(stock.productType)}</Text>
                  ) : position.stockItemId ? null : (
                    <Badge size="sm" color="orange">Unresolved</Badge>
                  )}
                </Table.Td>
                <Table.Td />
              </Table.Tr>
            );
          })
        : null}
    </>
  );
}
