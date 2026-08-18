import { Badge, Button, Group, Select, Stack, Text, Title } from "@mantine/core";
import { type FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, DataTable, StatusBanner } from "@cct/ui";
import { useApiMutation, useApiQuery } from "@cct/api-client";

import { apiClient, queryClient } from "../api";
import { StaffShell } from "../lib/shell";

type OrderHeaderProperties = components["schemas"]["OrderHeaderProperties"];
type OrderPositionDetail = components["schemas"]["OrderPositionDetail"];

const ORDER_STATUS_OPTIONS: { value: OrderHeaderProperties["orderStatusCode"]; label: string }[] = [
  { value: "order/reserved", label: "Reserved" },
  { value: "order/paid", label: "Paid" },
  { value: "order/fulfilled", label: "Fulfilled" },
  { value: "order/cancelled", label: "Cancelled" },
];

export function meta() {
  return [{ title: "Order detail — CCT Staff" }];
}

/**
 * Order detail (bounded relationship view): the editable header (status
 * only, per this pass's scope) plus each position's resolved
 * stock/product/supplier/traveller ids as links into their own detail
 * routes -- never raw graph traversal.
 */
export default function OrderDetailRoute() {
  const { orderId } = useParams();

  const orderQuery = useApiQuery(["orders", orderId], () =>
    apiClient.GET("/orders/{order_id}", { params: { path: { order_id: orderId as string } } })
  , { enabled: Boolean(orderId) });

  const detailQuery = useApiQuery(["orders", orderId, "detail"], () =>
    apiClient.GET("/orders/{order_id}/detail", { params: { path: { order_id: orderId as string } } })
  , { enabled: Boolean(orderId) });

  const mutation = useApiMutation<
    components["schemas"]["OrderResponse"],
    OrderHeaderProperties["orderStatusCode"]
  >((orderStatusCode) =>
    apiClient.PUT("/orders/{order_id}", {
      params: { path: { order_id: orderId as string } },
      body: {
        properties: {
          orderNumber: orderQuery.data!.properties.orderNumber,
          orderStatusCode,
        },
      },
    })
  );

  const [statusValue, setStatusValue] = useState<string | null>(null);

  useEffect(() => {
    if (orderQuery.data) {
      setStatusValue(orderQuery.data.properties.orderStatusCode);
    }
  }, [orderQuery.data]);

  if (!orderId) {
    return (
      <StaffShell title="Order detail">
        <StatusBanner kind="error" title="No order specified" />
      </StaffShell>
    );
  }

  if (orderQuery.status === "pending" || detailQuery.status === "pending") {
    return (
      <StaffShell title="Order detail">
        <StatusBanner kind="loading" title="Loading order…" />
      </StaffShell>
    );
  }

  if (orderQuery.status === "error") {
    return (
      <StaffShell title="Order detail">
        <ApiErrorBanner error={orderQuery.error} onRetry={() => orderQuery.refetch()} />
      </StaffShell>
    );
  }

  if (detailQuery.status === "error") {
    return (
      <StaffShell title="Order detail">
        <ApiErrorBanner error={detailQuery.error} onRetry={() => detailQuery.refetch()} />
      </StaffShell>
    );
  }

  const order = orderQuery.data;
  const positions = detailQuery.data.positions;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!statusValue) return;
    mutation.mutate(statusValue as OrderHeaderProperties["orderStatusCode"], {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
      },
    });
  }

  return (
    <StaffShell title={`Order ${order.properties.orderNumber}`}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={1}>Order {order.properties.orderNumber}</Title>
          <Badge>{order.properties.orderStatusCode}</Badge>
        </Group>

        <Stack gap={4}>
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">
            Read-only
          </Text>
          <Group>
            <Text fw={500}>Order number</Text>
            <Text>{order.properties.orderNumber}</Text>
          </Group>
          <Group>
            <Text fw={500}>Entity ID</Text>
            <Text>{order.entityId}</Text>
          </Group>
        </Stack>

        <form onSubmit={handleSubmit} aria-label="Edit order status">
          <Stack gap="xs">
            <Select
              label="Order status"
              data={ORDER_STATUS_OPTIONS}
              value={statusValue}
              onChange={setStatusValue}
              allowDeselect={false}
            />
            <Group>
              <Button type="submit" loading={mutation.isPending}>
                Save status
              </Button>
            </Group>
            {mutation.isError ? <ApiErrorBanner error={mutation.error} /> : null}
            {mutation.isSuccess ? <StatusBanner kind="success" title="Order status updated" /> : null}
          </Stack>
        </form>

        <div>
          <Title order={2}>Positions</Title>
          <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb="xs">
            Read-only
          </Text>
          <DataTable<OrderPositionDetail>
            caption={`Positions for order ${order.properties.orderNumber}`}
            rowKey={(row) => row.positionId}
            rows={positions}
            emptyMessage="This order has no positions."
            columns={[
              { key: "positionId", header: "Position", render: (row) => row.positionId },
              {
                key: "product",
                header: "Product",
                render: (row) => (row.productId ? <Link to={`/products/${row.productId}`}>{row.productId}</Link> : "—"),
              },
              {
                key: "stockItem",
                header: "Stock item",
                render: (row) => (row.stockItemId ? <Link to={`/stock-items/${row.stockItemId}`}>{row.stockItemId}</Link> : "—"),
              },
              {
                key: "supplier",
                header: "Supplier",
                render: (row) =>
                  row.supplierOrganisationId ? (
                    <Link to={`/organisations/${row.supplierOrganisationId}`}>{row.supplierOrganisationId}</Link>
                  ) : (
                    "—"
                  ),
              },
              {
                key: "traveller",
                header: "Traveller",
                render: (row) =>
                  row.travellerPersonId ? <Link to={`/persons/${row.travellerPersonId}`}>{row.travellerPersonId}</Link> : "—",
              },
            ]}
          />
        </div>
      </Stack>
    </StaffShell>
  );
}
