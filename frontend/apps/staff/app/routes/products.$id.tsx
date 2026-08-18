import { Stack, Text, Title } from "@mantine/core";
import { Link, useParams } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, DataTable, ResourceCard, StatusBanner } from "@cct/ui";
import { useApiQuery } from "@cct/api-client";

import { apiClient } from "../api";
import { StaffShell } from "../lib/shell";

type ProductComponentResponse = components["schemas"]["ProductComponentResponse"];

export function meta() {
  return [{ title: "Product detail — CCT Staff" }];
}

/** Read-only product detail: properties plus the recursive component tree. */
export default function ProductDetailRoute() {
  const { productId } = useParams();

  const productQuery = useApiQuery(
    ["products", productId],
    () => apiClient.GET("/products/{product_id}", { params: { path: { product_id: productId as string } } }),
    { enabled: Boolean(productId) }
  );
  const componentsQuery = useApiQuery(
    ["products", productId, "components"],
    () =>
      apiClient.GET("/products/{product_id}/components", {
        params: { path: { product_id: productId as string } },
      }),
    { enabled: Boolean(productId) }
  );

  if (!productId) {
    return (
      <StaffShell title="Product detail">
        <StatusBanner kind="error" title="No product specified" />
      </StaffShell>
    );
  }

  if (productQuery.status === "pending" || componentsQuery.status === "pending") {
    return (
      <StaffShell title="Product detail">
        <StatusBanner kind="loading" title="Loading product…" />
      </StaffShell>
    );
  }

  if (productQuery.status === "error") {
    return (
      <StaffShell title="Product detail">
        <ApiErrorBanner error={productQuery.error} onRetry={() => productQuery.refetch()} />
      </StaffShell>
    );
  }

  if (componentsQuery.status === "error") {
    return (
      <StaffShell title="Product detail">
        <ApiErrorBanner error={componentsQuery.error} onRetry={() => componentsQuery.refetch()} />
      </StaffShell>
    );
  }

  const product = productQuery.data;

  return (
    <StaffShell title={product.entityId}>
      <Stack gap="md">
        <Title order={1}>{product.entityId}</Title>
        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
          Read-only
        </Text>
        <ResourceCard
          title={product.entityId}
          subtitle={product.type}
          badge={product.type}
          details={[
            { label: "Entity ID", value: product.entityId },
            { label: "Type", value: product.type },
          ]}
        />

        <div>
          <Title order={2}>Components</Title>
          <DataTable<ProductComponentResponse>
            caption={`Components of ${product.entityId}`}
            rowKey={(row) => row.entityId}
            rows={componentsQuery.data}
            emptyMessage="This product has no components."
            columns={[
              {
                key: "entityId",
                header: "Entity ID",
                render: (row) => <Link to={`/products/${row.entityId}`}>{row.entityId}</Link>,
              },
              { key: "type", header: "Type", render: (row) => row.type },
              {
                key: "parentProductId",
                header: "Parent product",
                render: (row) =>
                  row.parentProductId ? <Link to={`/products/${row.parentProductId}`}>{row.parentProductId}</Link> : "—",
              },
            ]}
          />
        </div>
      </Stack>
    </StaffShell>
  );
}
