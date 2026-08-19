import { Stack, Title } from "@mantine/core";
import { useNavigate } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, CursorPager, DataTable, StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { useCursorPage } from "../lib/use-cursor-page";
import { StaffShell } from "../lib/shell";

type PersonResponse = components["schemas"]["PersonResponse"];

export function meta() {
  return [{ title: "Persons — CCT Staff" }];
}

/** S-002: read-only, server-paginated persons list. Editing persons is out of scope for this pass. */
export default function PersonsRoute() {
  const navigate = useNavigate();
  const page = useCursorPage<PersonResponse>(["persons"], (cursor) =>
    apiClient.GET("/persons", { params: { query: { cursor, limit: 20 } } })
  );

  return (
    <StaffShell breadcrumbs={[{ label: "Persons" }]}>
      <Stack gap="sm">
        <Title order={1}>Persons</Title>

        {page.status === "pending" ? <StatusBanner kind="loading" title="Loading persons…" /> : null}
        {page.status === "error" && page.error ? <ApiErrorBanner error={page.error} onRetry={page.refetch} /> : null}
        {page.status === "success" ? (
          <>
            <DataTable<PersonResponse>
              caption="Persons"
              rowKey={(row) => row.entityId}
              rows={page.items}
              emptyMessage="No persons to display."
              onRowActivate={(row) => navigate(`/persons/${row.entityId}`)}
              columns={[
                { key: "entityId", header: "Entity ID", render: (row) => row.entityId },
                { key: "givenName", header: "Given name", render: (row) => row.properties.givenName },
                { key: "familyName", header: "Family name", render: (row) => row.properties.familyName },
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
