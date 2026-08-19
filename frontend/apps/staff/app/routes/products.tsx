import { Stack, Title } from "@mantine/core";
import { useNavigate } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, CursorPager, DataTable, StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { useCursorPage } from "../lib/use-cursor-page";
import { StaffShell } from "../lib/shell";

type ProductResponse = components["schemas"]["ProductResponse"];

export function meta() {
  return [{ title: "Products — CCT Staff" }];
}

/** S-003: read-only, server-paginated products list. */
export default function ProductsRoute() {
  const navigate = useNavigate();
  const page = useCursorPage<ProductResponse>(["products"], (cursor) =>
    apiClient.GET("/products", { params: { query: { cursor, limit: 20 } } })
  );

  return (
    <StaffShell breadcrumbs={[{ label: "Touristic product catalogue" }]}>
      <Stack gap="sm">
        <Title order={1}>Products</Title>

        {page.status === "pending" ? <StatusBanner kind="loading" title="Loading products…" /> : null}
        {page.status === "error" && page.error ? <ApiErrorBanner error={page.error} onRetry={page.refetch} /> : null}
        {page.status === "success" ? (
          <>
            <DataTable<ProductResponse>
              caption="Products"
              rowKey={(row) => row.entityId}
              rows={page.items}
              emptyMessage="No products to display."
              onRowActivate={(row) => navigate(`/products/${row.entityId}`)}
              columns={[
                { key: "entityId", header: "Entity ID", render: (row) => row.entityId },
                { key: "type", header: "Type", render: (row) => row.type },
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
