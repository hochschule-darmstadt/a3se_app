import { Stack, Text, Title } from "@mantine/core";
import { useParams } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, DataTable, ResourceCard, StatusBanner } from "@cct/ui";
import { useApiQuery } from "@cct/api-client";

import { apiClient } from "../api";
import { StaffShell } from "../lib/shell";

type PersonRoleResponse = components["schemas"]["PersonRoleResponse"];

export function meta() {
  return [{ title: "Person detail — CCT Staff" }];
}

/** Read-only person detail: properties plus assigned roles. Editing persons is out of scope for this pass. */
export default function PersonDetailRoute() {
  const { personId } = useParams();

  const personQuery = useApiQuery(
    ["persons", personId],
    () => apiClient.GET("/persons/{person_id}", { params: { path: { person_id: personId as string } } }),
    { enabled: Boolean(personId) }
  );
  const rolesQuery = useApiQuery(
    ["persons", personId, "roles"],
    () => apiClient.GET("/persons/{person_id}/roles", { params: { path: { person_id: personId as string } } }),
    { enabled: Boolean(personId) }
  );

  if (!personId) {
    return (
      <StaffShell breadcrumbs={[{ label: "Persons", to: "/persons" }, { label: "Person detail" }]}>
        <StatusBanner kind="error" title="No person specified" />
      </StaffShell>
    );
  }

  if (personQuery.status === "pending" || rolesQuery.status === "pending") {
    return (
      <StaffShell breadcrumbs={[{ label: "Persons", to: "/persons" }, { label: "Person detail" }]}>
        <StatusBanner kind="loading" title="Loading person…" />
      </StaffShell>
    );
  }

  if (personQuery.status === "error") {
    return (
      <StaffShell breadcrumbs={[{ label: "Persons", to: "/persons" }, { label: "Person detail" }]}>
        <ApiErrorBanner error={personQuery.error} onRetry={() => personQuery.refetch()} />
      </StaffShell>
    );
  }

  if (rolesQuery.status === "error") {
    return (
      <StaffShell breadcrumbs={[{ label: "Persons", to: "/persons" }, { label: "Person detail" }]}>
        <ApiErrorBanner error={rolesQuery.error} onRetry={() => rolesQuery.refetch()} />
      </StaffShell>
    );
  }

  const person = personQuery.data;

  return (
    <StaffShell breadcrumbs={[{ label: "Persons", to: "/persons" }, { label: `${person.properties.givenName} ${person.properties.familyName}` }]}>
      <Stack gap="md">
        <Title order={1}>
          {person.properties.givenName} {person.properties.familyName}
        </Title>
        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
          Read-only (editing persons is out of scope for this pass)
        </Text>
        <ResourceCard
          title={`${person.properties.givenName} ${person.properties.familyName}`}
          subtitle={person.properties.addressLocalityName ?? undefined}
          badge={person.entityId}
          details={[
            { label: "Entity ID", value: person.entityId },
            { label: "Given name", value: person.properties.givenName },
            { label: "Family name", value: person.properties.familyName },
            { label: "Locality", value: person.properties.addressLocalityName ?? "—" },
          ]}
        />

        <div>
          <Title order={2}>Roles</Title>
          <DataTable<PersonRoleResponse>
            caption={`Roles for ${person.properties.givenName} ${person.properties.familyName}`}
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
