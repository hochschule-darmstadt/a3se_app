import { Stack, Title } from "@mantine/core";
import { useNavigate } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, CursorPager, DataTable, StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { useCursorPage } from "../lib/use-cursor-page";
import { StaffShell } from "../lib/shell";

type OrganisationResponse = components["schemas"]["OrganisationResponse"];

export function meta() {
  return [{ title: "Organisations — CCT Staff" }];
}

/** S-004: read-only, server-paginated organisations list. */
export default function OrganisationsRoute() {
  const navigate = useNavigate();
  const page = useCursorPage<OrganisationResponse>(["organisations"], (cursor) =>
    apiClient.GET("/organisations", { params: { query: { cursor, limit: 20 } } })
  );

  return (
    <StaffShell title="Organisations">
      <Stack gap="sm">
        <Title order={1}>Organisations</Title>

        {page.status === "pending" ? <StatusBanner kind="loading" title="Loading organisations…" /> : null}
        {page.status === "error" && page.error ? <ApiErrorBanner error={page.error} onRetry={page.refetch} /> : null}
        {page.status === "success" ? (
          <>
            <DataTable<OrganisationResponse>
              caption="Organisations"
              rowKey={(row) => row.entityId}
              rows={page.items}
              emptyMessage="No organisations to display."
              onRowActivate={(row) => navigate(`/organisations/${row.entityId}`)}
              columns={[
                { key: "entityId", header: "Entity ID", render: (row) => row.entityId },
                { key: "name", header: "Name", render: (row) => row.properties.name },
                { key: "locality", header: "Locality", render: (row) => row.properties.addressLocalityName ?? "—" },
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
