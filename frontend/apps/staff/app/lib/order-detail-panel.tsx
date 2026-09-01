import { Badge, Button, Group, Select, Stack, Text, Title } from "@mantine/core";
import { useQueries } from "@tanstack/react-query";
import { type FormEvent, useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router";
import type { components } from "@cct/api-client";
import { useApiMutation, useApiQuery } from "@cct/api-client";
import { ApiErrorBanner, CctIcon, StatusBanner } from "@cct/ui";
import { apiClient, queryClient } from "../api";
type OrderProperties = components["schemas"]["OrderHeaderProperties"];
type OrderPositionDetail = components["schemas"]["OrderPositionDetail"];
type StockItem = components["schemas"]["StockItemResponse"];
const STATUSES = ["order/reserved", "order/paid", "order/fulfilled", "order/cancelled"].map(value => ({ value, label: value.replace("order/", "").replace(/^./, c => c.toUpperCase()) }));
export function Chip({ to, children }: { readonly to: string; readonly children: ReactNode }) { return <Badge component={Link} to={to} variant="light" size="lg" tt="none"><Group gap={4} wrap="nowrap"><CctIcon.order size={16} aria-hidden />{children}</Group></Badge>; }
export function Row({ label, children }: { readonly label: string; readonly children: ReactNode }) { return <Group align="flex-start"><Text fw={500} size="sm" w={150}>{label}</Text><Group gap="xs" style={{ flex: 1 }}>{children}</Group></Group>; }

/**
 * The three direction-preserving chip hierarchies for one order/position
 * (WF-015): service (stock/product/ancestors/supplier), customer, and one
 * row per traveller -- each traveller on its own row rather than every
 * traveller's chips crowded into a single row, so a position with several
 * travellers stays scannable. Shared by the order detail panel's per-position
 * list and the standalone position detail panel.
 */
export function PositionHierarchies({
  orderId,
  customerRoleId,
  customerPersonId,
  customerDisplayName,
  position,
  stock,
}: {
  readonly orderId: string;
  readonly customerRoleId: string | null;
  readonly customerPersonId: string | null;
  readonly customerDisplayName: string | null;
  readonly position: OrderPositionDetail;
  readonly stock: StockItem | undefined;
}) {
  return (
    <Stack gap={6}>
      <Row label="Service hierarchy">
        <Chip to={`/orders?detail=${encodeURIComponent(orderId)}`}>{position.positionId}</Chip>
        {stock ? (
          <>
            <Chip to={`/stock-items?detail=${encodeURIComponent(stock.entityId)}`}>{stock.productDisplayNameChain.join(" · ")} · {stock.properties.serviceDate}</Chip>
            <Chip to={`/products?detail=${encodeURIComponent(stock.productId)}`}>{stock.productDisplayNameChain.join(" · ")}</Chip>
            {stock.productAncestors.map(a => <Chip key={a.entityId} to={`/products?detail=${encodeURIComponent(a.entityId)}`}>{a.displayNameChain.join(" · ")}</Chip>)}
            {stock.supplierRole && stock.supplierOrganisationId ? <Chip to={`/organisations?detail=${encodeURIComponent(stock.supplierOrganisationId)}`}>{stock.supplierRole.displayNameChain.join(" · ")}</Chip> : null}
            {stock.supplierOrganisationId && stock.supplierDisplayName ? <Chip to={`/organisations?detail=${encodeURIComponent(stock.supplierOrganisationId)}`}>{stock.supplierDisplayName}</Chip> : null}
          </>
        ) : <Text size="sm">No stock allocated</Text>}
      </Row>
      <Row label="Customer hierarchy">
        <Chip to={`/orders?detail=${encodeURIComponent(orderId)}`}>Order {orderId}</Chip>
        {customerRoleId && customerDisplayName ? <Chip to={`/persons?detail=${encodeURIComponent(customerPersonId!)}`}>{customerDisplayName} · customer</Chip> : <Text size="sm">No customer assigned</Text>}
      </Row>
      {position.travellers.length === 0 ? (
        <Row label="Traveller hierarchy"><Text size="sm">No traveller assigned</Text></Row>
      ) : (
        position.travellers.map(t => (
          <Row key={t.roleId} label="Traveller hierarchy">
            <Chip to={`/persons?detail=${encodeURIComponent(t.personId)}&role=${encodeURIComponent(t.roleId)}`}>{t.displayName} · traveller</Chip>
            <Chip to={`/persons?detail=${encodeURIComponent(t.personId)}`}>{t.displayName}</Chip>
          </Row>
        ))
      )}
    </Stack>
  );
}
export function OrderDetailPanel({ orderId, positionHref }: { readonly orderId: string; readonly positionHref?: (positionId: string) => string }) {
  const query = useApiQuery(["orders", orderId, "detail"], () => apiClient.GET("/orders/{order_id}/detail", { params: { path: { order_id: orderId } } }));
  const positions = query.data?.positions ?? [];
  const stockQueries = useQueries({ queries: positions.map(position => ({ queryKey: ["stock-items", position.stockItemId], enabled: Boolean(position.stockItemId), queryFn: async () => { const { data, error } = await apiClient.GET("/stock-items/{stock_item_id}", { params: { path: { stock_item_id: position.stockItemId! } } }); if (error) throw error; return data as StockItem; } })) });
  const [editing, setEditing] = useState(false); const [status, setStatus] = useState<OrderProperties["orderStatusCode"]>("order/reserved");
  useEffect(() => { if (query.data) setStatus(query.data.order.properties.orderStatusCode); }, [query.data]);
  const update = useApiMutation((next: OrderProperties["orderStatusCode"]) => apiClient.PUT("/orders/{order_id}", { params: { path: { order_id: orderId } }, body: { properties: { orderStatusCode: next } } }));
  function save(event: FormEvent) { event.preventDefault(); update.mutate(status, { onSuccess: () => { setEditing(false); void queryClient.invalidateQueries({ queryKey: ["orders"] }); } }); }
  if (query.status === "pending") return <StatusBanner kind="loading" title="Loading order…" />;
  if (query.status === "error") return <ApiErrorBanner error={query.error} onRetry={() => query.refetch()} />;
  const detail = query.data;
  return <Stack gap="md"><Group justify="space-between" align="flex-start"><Group gap="xs"><CctIcon.order size={28} aria-hidden /><Title order={1}>Order {detail.order.entityId}</Title></Group><Badge>{detail.order.properties.orderStatusCode.replace("order/", "")}</Badge></Group>
    {editing ? <form aria-label="Edit order" onSubmit={save}><Stack gap="xs"><Select label="Order status" data={STATUSES} value={status} onChange={value => setStatus(value as typeof status)} allowDeselect={false}/><Group><Button type="submit" loading={update.isPending}>Save changes</Button><Button variant="default" onClick={() => setEditing(false)}>Cancel changes</Button></Group>{update.isError ? <ApiErrorBanner error={update.error}/> : null}</Stack></form> : <Stack gap={6}><Row label="ID"><Text size="sm">{detail.order.entityId}</Text></Row><Row label="Type"><Text size="sm">{detail.order.type}</Text></Row><Row label="Customer hierarchy"><Chip to={`/orders?detail=${encodeURIComponent(orderId)}`}>Order {detail.order.entityId}</Chip>{detail.customerRoleId && detail.customerDisplayName ? <Chip to={`/persons?detail=${encodeURIComponent(detail.customerPersonId!)}&role=${encodeURIComponent(detail.customerRoleId)}`}>{detail.customerDisplayName} · customer</Chip> : <Text size="sm">No customer assigned</Text>}{detail.customerPersonId && detail.customerDisplayName ? <Chip to={`/persons?detail=${encodeURIComponent(detail.customerPersonId)}`}>{detail.customerDisplayName}</Chip> : null}</Row><Group mt="xs"><Button onClick={() => setEditing(true)}>Edit order</Button></Group></Stack>}
    <div><Title order={2}>Positions</Title><Stack gap="xs" mt="xs">{positions.length === 0 ? <StatusBanner kind="empty" title="This order has no positions."/> : positions.map((position, index) => { const stock = stockQueries[index]?.data; const label = stock ? `${stock.productDisplayNameChain.join(" · ")} · ${stock.properties.serviceDate}` : position.positionId; return <Row key={position.positionId} label="Position"><Chip to={positionHref?.(position.positionId) ?? `/orders?detail=${encodeURIComponent(orderId)}&position=${encodeURIComponent(position.positionId)}`}>{label}</Chip></Row>; })}</Stack></div>
  </Stack>;
}
