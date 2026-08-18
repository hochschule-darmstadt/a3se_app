import { Stack, Text, Title } from "@mantine/core";
import { useParams } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, DataTable, ResourceCard, StatusBanner } from "@cct/ui";
import { useApiQuery } from "@cct/api-client";

import { apiClient } from "../api";
import { StaffShell } from "../lib/shell";

type OrgaRoleResponse = components["schemas"]["OrgaRoleResponse"];

export function meta() {
  return [{ title: "Organisation detail — CCT Staff" }];
}

/** Read-only organisation detail: properties plus assigned roles (e.g. `partner/supplier/airline`). */
export default function OrganisationDetailRoute() {
  const { organisationId } = useParams();

  const organisationQuery = useApiQuery(
    ["organisations", organisationId],
    () =>
      apiClient.GET("/organisations/{organisation_id}", {
        params: { path: { organisation_id: organisationId as string } },
      }),
    { enabled: Boolean(organisationId) }
  );
  const rolesQuery = useApiQuery(
    ["organisations", organisationId, "roles"],
    () =>
      apiClient.GET("/organisations/{organisation_id}/roles", {
        params: { path: { organisation_id: organisationId as string } },
      }),
    { enabled: Boolean(organisationId) }
  );

  if (!organisationId) {
    return (
      <StaffShell title="Organisation detail">
        <StatusBanner kind="error" title="No organisation specified" />
      </StaffShell>
    );
  }

  if (organisationQuery.status === "pending" || rolesQuery.status === "pending") {
    return (
      <StaffShell title="Organisation detail">
        <StatusBanner kind="loading" title="Loading organisation…" />
      </StaffShell>
    );
  }

  if (organisationQuery.status === "error") {
    return (
      <StaffShell title="Organisation detail">
        <ApiErrorBanner error={organisationQuery.error} onRetry={() => organisationQuery.refetch()} />
      </StaffShell>
    );
  }

  if (rolesQuery.status === "error") {
    return (
      <StaffShell title="Organisation detail">
        <ApiErrorBanner error={rolesQuery.error} onRetry={() => rolesQuery.refetch()} />
      </StaffShell>
    );
  }

  const organisation = organisationQuery.data;

  return (
    <StaffShell title={organisation.properties.name}>
      <Stack gap="md">
        <Title order={1}>{organisation.properties.name}</Title>
        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
          Read-only
        </Text>
        <ResourceCard
          title={organisation.properties.name}
          subtitle={organisation.properties.addressLocalityName ?? undefined}
          badge={organisation.entityId}
          details={[
            { label: "Entity ID", value: organisation.entityId },
            { label: "Name", value: organisation.properties.name },
            { label: "Locality", value: organisation.properties.addressLocalityName ?? "—" },
          ]}
        />

        <div>
          <Title order={2}>Roles</Title>
          <DataTable<OrgaRoleResponse>
            caption={`Roles for ${organisation.properties.name}`}
            rowKey={(row) => row.entityId}
            rows={rolesQuery.data}
            emptyMessage="No roles assigned."
            columns={[
              { key: "entityId", header: "Entity ID", render: (row) => row.entityId },
              { key: "type", header: "Type", render: (row) => row.type },
            ]}
          />
        </div>
      </Stack>
    </StaffShell>
  );
}
