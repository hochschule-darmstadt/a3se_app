import { Card, Container, Stack, Text, Title } from "@mantine/core";
import { toApiError, type ApiError } from "@cct/api-client";
import { ApiErrorBanner, StatusBanner, useMockActor } from "@cct/ui";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { apiClient } from "../api";
import { useT } from "../i18n";
import { CustomerShell } from "../lib/shell";

export default function MyOrders() {
  const t = useT();
  const { actor } = useMockActor();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  useEffect(() => { if (!actor) navigate(`/sign-in?${new URLSearchParams({ returnTo: "/my-orders" })}`, { replace: true }); }, [actor, navigate]);
  const query = useQuery({ queryKey: ["my-orders", actor?.personId], enabled: Boolean(actor), queryFn: async () => {
    const roles = await apiClient.GET("/persons/{person_id}/roles", { params: { path: { person_id: actor?.personId ?? "" } } });
    if (!roles.response.ok || !roles.data) throw toApiError(roles.error, roles.response);
    const customer = roles.data.find((role) => role.type === "person/customer");
    if (!customer) throw { kind: "validation", title: "Missing customer role", detail: "The signed-in person is not a customer." };
    const orders = await apiClient.GET("/orders", { params: { query: { customerRoleId: customer.entityId, limit: 100 } } });
    if (!orders.response.ok || !orders.data) throw toApiError(orders.error, orders.response);
    const selectedId = params.get("detail");
    if (!selectedId) return { orders: orders.data, detail: null };
    const detail = await apiClient.GET("/orders/{order_id}/detail", { params: { path: { order_id: selectedId } } });
    if (!detail.response.ok || !detail.data) throw toApiError(detail.error, detail.response);
    return { orders: orders.data, detail: detail.data };
  } });
  if (!actor) return null;
  return <CustomerShell breadcrumbs={[{ label: "Travel portal", to: "/" }, { label: t("orders.heading") }]}>
    <Container size="md" py="xl"><Stack gap="lg"><Title order={1}>{t("orders.heading")}</Title>
      {params.get("placed") ? <StatusBanner kind="success" title={`Order ${params.get("placed")} confirmed`} /> : null}
      {query.isPending ? <StatusBanner kind="loading" title="Loading orders…" /> : null}
      {query.isError ? <ApiErrorBanner error={query.error as unknown as ApiError} onRetry={() => query.refetch()} /> : null}
      {query.data?.orders.items.length === 0 ? <StatusBanner kind="empty" title={t("orders.empty")} /> : null}
      {query.data?.orders.items.map((order) => <Card key={order.entityId} withBorder onClick={() => setParams({ detail: order.entityId })} style={{ cursor: "pointer" }}>
        <Title order={2}>{order.entityId}</Title><Text>{order.properties.orderStatusCode.replace("order/", "")}</Text>
        <Text>{order.positionCount} position(s)</Text><Text>{order.serviceDateFrom ?? "–"}{order.serviceDateTo && order.serviceDateTo !== order.serviceDateFrom ? ` – ${order.serviceDateTo}` : ""}</Text>
      </Card>)}
      {query.data?.detail ? <Card withBorder><Title order={2}>Order details</Title>
        <Text>Customer: {query.data.detail.customerDisplayName}</Text>
        {query.data.detail.positions.map((position) => <Text key={position.positionId}>{position.productId} · {position.travellers.map((item) => item.displayName).join(", ")}</Text>)}
      </Card> : null}
    </Stack></Container>
  </CustomerShell>;
}
