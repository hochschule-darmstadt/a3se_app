import { Badge, Card, Container, Divider, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { toApiError, type ApiError } from "@cct/api-client";
import { ApiErrorBanner, StatusBanner, useMockActor } from "@cct/ui";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { apiClient } from "../api";
import { useT } from "../i18n";
import { CustomerShell } from "../lib/shell";

type StockItem = import("@cct/api-client").components["schemas"]["StockItemResponse"];
type StockQueryResult = ReturnType<typeof useQuery<StockItem>>;

function statusLabel(status: string) {
  return status.replace(/^order\//, "").replace(/^./, (letter) => letter.toUpperCase());
}

function dateRange(from: string | null, to: string | null) {
  if (!from) return "–";
  return to && to !== from ? `${from} – ${to}` : from;
}

function stockDateRange(stockQueries: readonly { data?: unknown }[]) {
  const dates = stockQueries
    .map((result) => (result.data as StockItem | undefined)?.properties.serviceDate)
    .filter((date): date is string => Boolean(date))
    .sort();
  return dateRange(dates[0] ?? null, dates.at(-1) ?? null);
}

export default function MyOrders() {
  const t = useT();
  const { actor } = useMockActor();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  useEffect(() => { if (!actor) navigate(`/sign-in?${new URLSearchParams({ returnTo: "/my-orders" })}`, { replace: true }); }, [actor, navigate]);
  const selectedId = params.get("detail");
  const query = useQuery({ queryKey: ["my-orders", actor?.personId, selectedId], enabled: Boolean(actor), queryFn: async () => {
    const roles = await apiClient.GET("/persons/{person_id}/roles", { params: { path: { person_id: actor?.personId ?? "" } } });
    if (!roles.response.ok || !roles.data) throw toApiError(roles.error, roles.response);
    const customer = roles.data.find((role) => role.type === "person/customer");
    if (!customer) throw { kind: "validation", title: "Missing customer role", detail: "The signed-in person is not a customer." };
    const orders = await apiClient.GET("/orders", { params: { query: { customerRoleId: customer.entityId, limit: 100 } } });
    if (!orders.response.ok || !orders.data) throw toApiError(orders.error, orders.response);
    if (!selectedId) return { orders: orders.data, detail: null };
    const detail = await apiClient.GET("/orders/{order_id}/detail", { params: { path: { order_id: selectedId } } });
    if (!detail.response.ok || !detail.data) throw toApiError(detail.error, detail.response);
    return { orders: orders.data, detail: detail.data };
  } });
  const positionStockQueries = useQueries({
    queries: (query.data?.detail?.positions ?? []).map((position) => ({
      queryKey: ["my-orders", selectedId, "stock", position.stockItemId],
      enabled: Boolean(position.stockItemId),
      queryFn: async () => {
        const result = await apiClient.GET("/stock-items/{stock_item_id}", { params: { path: { stock_item_id: position.stockItemId! } } });
        if (!result.response.ok || !result.data) throw toApiError(result.error, result.response);
        return result.data as StockItem;
      },
    })),
  }) as StockQueryResult[];
  if (!actor) return null;
  return <CustomerShell breadcrumbs={[{ label: "Travel portal", to: "/" }, { label: t("orders.heading") }]}>
    <Container size="lg" py="xl"><Stack gap="lg"><Title order={1}>{t("orders.heading")}</Title>
      {params.get("placed") ? <StatusBanner kind="success" title={`Order ${params.get("placed")} confirmed`} /> : null}
      {query.isPending ? <StatusBanner kind="loading" title="Loading orders…" /> : null}
      {query.isError ? <ApiErrorBanner error={query.error as unknown as ApiError} onRetry={() => query.refetch()} /> : null}
      {query.data?.orders.items.length === 0 ? <StatusBanner kind="empty" title={t("orders.empty")} /> : null}
      {query.data?.orders.items.length ? <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        <Stack gap="sm" component="section" aria-label="Order list">
          <Title order={2}>Your orders</Title>
          {query.data.orders.items.map((order) => {
            const selected = order.entityId === selectedId;
            return <Card key={order.entityId} withBorder shadow={selected ? "sm" : undefined} padding="lg" onClick={() => setParams({ detail: order.entityId })} style={{ cursor: "pointer", borderColor: selected ? "var(--mantine-color-blue-6)" : undefined }}>
              <Stack gap="xs">
                <Group justify="space-between" align="flex-start" wrap="nowrap"><div><Text size="sm" c="dimmed">{order.properties.orderNumber ? `Order ${order.properties.orderNumber}` : "Order"}</Text><Title order={3}>{order.entityId}</Title></div><Badge>{statusLabel(order.properties.orderStatusCode)}</Badge></Group>
                <Text size="sm">{dateRange(order.serviceDateFrom, order.serviceDateTo)}</Text>
                <Text size="sm" c="dimmed">{order.positionCount} {order.positionCount === 1 ? "position" : "positions"}{order.unresolvedPositionCount ? ` · ${order.unresolvedPositionCount} unresolved` : ""}</Text>
              </Stack>
            </Card>;
          })}
        </Stack>
        {query.data.detail ? <OrderDetail detail={query.data.detail} stockQueries={positionStockQueries} /> : <StatusBanner kind="info" title="Select an order" description="Choose an order to see its positions and travel details." />}
      </SimpleGrid> : null}
    </Stack></Container>
  </CustomerShell>;
}

function OrderDetail({ detail, stockQueries }: { readonly detail: import("@cct/api-client").components["schemas"]["OrderDetailResponse"]; readonly stockQueries: readonly StockQueryResult[] }) {
  const order = detail.order;
  const total = stockQueries.reduce((sum, result) => sum + (result.data ? Number(result.data.properties.unitPriceAmount) : 0), 0);
  return <Stack gap="md" component="section" aria-label="Selected order details">
    <Card withBorder padding="lg">
      <Group justify="space-between" align="flex-start"><div><Text size="sm" c="dimmed">Order details</Text><Title order={2}>{order.properties.orderNumber ? `Order ${order.properties.orderNumber}` : order.entityId}</Title><Text size="sm" c="dimmed">{order.entityId}</Text></div><Badge size="lg">{statusLabel(order.properties.orderStatusCode)}</Badge></Group>
      <Divider my="md" />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
        <DetailField label="Customer" value={detail.customerDisplayName ?? "Not assigned"} />
        <DetailField label="Travel dates" value={stockDateRange(stockQueries)} />
        <DetailField label="Positions" value={String(detail.positions.length)} />
        <DetailField label="Indicative total" value={stockQueries.some((result) => result.isPending) ? "Loading…" : `${total.toFixed(2)} EUR`} />
      </SimpleGrid>
    </Card>
    <div><Title order={2}>Order positions</Title><Stack gap="sm" mt="xs">
      {detail.positions.length === 0 ? <StatusBanner kind="empty" title="This order has no positions." /> : detail.positions.map((position, index) => <PositionCard key={position.positionId} position={position} stock={stockQueries[index]?.data as StockItem | undefined} loading={stockQueries[index]?.isPending ?? false} />)}
    </Stack></div>
  </Stack>;
}

function DetailField({ label, value }: { readonly label: string; readonly value: string }) {
  return <div><Text size="xs" fw={700} tt="uppercase" c="dimmed">{label}</Text><Text>{value}</Text></div>;
}

function PositionCard({ position, stock, loading }: { readonly position: import("@cct/api-client").components["schemas"]["OrderPositionDetail"]; readonly stock?: StockItem; readonly loading: boolean }) {
  const productName = stock?.productDisplayNameChain.join(" · ") ?? position.productId ?? "Product unavailable";
  return <Card withBorder padding="lg"><Stack gap="sm">
    <Group justify="space-between" align="flex-start"><div><Text size="sm" c="dimmed">Position {position.positionId}</Text><Title order={3}>{productName}</Title></div><Badge variant="light">{stock ? "Allocated" : position.stockItemId ? "Loading" : "Unresolved"}</Badge></Group>
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
      <DetailField label="Service date" value={stock?.properties.serviceDate ?? (loading ? "Loading…" : "Not available")} />
      <DetailField label="Price" value={stock ? `${stock.properties.unitPriceAmount} ${stock.properties.currencyCode}` : "Not available"} />
      <DetailField label="Product ID" value={position.productId ?? "Not available"} />
      <DetailField label="Stock reference" value={position.stockItemId ?? "Not allocated"} />
    </SimpleGrid>
    <div><Text size="xs" fw={700} tt="uppercase" c="dimmed">Travellers</Text>{position.travellers.length ? <Text>{position.travellers.map((traveller) => traveller.displayName).join(", ")}</Text> : <Text c="dimmed">No traveller assigned</Text>}</div>
    {stock?.availabilityState ? <Text size="sm" c="dimmed">Current inventory state: {stock.availabilityState}</Text> : null}
  </Stack></Card>;
}
