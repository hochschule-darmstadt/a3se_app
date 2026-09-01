import { Badge, Button, Group, Stack, Text, TextInput, Title } from "@mantine/core";
import { type FormEvent, useEffect, useState } from "react";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, CctIcon, FormErrorSummary, StatusBanner } from "@cct/ui";
import { useApiMutation, useApiQuery } from "@cct/api-client";

import { apiClient, queryClient } from "../api";
import { SUPPLIER_ROLE_TYPE_LABEL, SUPPLIER_ROLE_TYPE_OPTIONS, type SupplierRoleType } from "./supplier-roles";
import { propertyDisplayEntries } from "./property-display";
import { IncomingReferenceLinks } from "./incoming-reference-links";

type OrganisationResponse = components["schemas"]["OrganisationResponse"];
type OrgaRoleResponse = components["schemas"]["OrgaRoleResponse"];

function isAirline(type: string): type is "organisation/airline" {
  return type === "organisation/airline";
}

function roleRequestBody(type: SupplierRoleType, properties: { airlineDesignator?: string; roleStatusCode: "role/active" | "role/inactive" }) {
  if (isAirline(type)) {
    return { type, properties: { airlineDesignator: properties.airlineDesignator ?? "", roleStatusCode: properties.roleStatusCode } };
  }
  return { type, properties: { roleStatusCode: properties.roleStatusCode } };
}

/**
 * S-004 detail (issue #30): Organisation's shared fields, edited separately
 * from each OrgaRole's role-specific fields, per the entity model. Roles are
 * deactivated/reactivated via `roleStatusCode` (PUT), not deleted (WF-Q-011).
 * Used both as the master-detail right pane on the organisations list and as
 * the standalone `/organisations/:id` route's content, mirroring
 * `PersonDetailPanel` (issue #29 phase 2).
 */
export function OrganisationDetailPanel({ organisationId }: { readonly organisationId: string }) {
  const organisationQuery = useApiQuery(
    ["organisations", organisationId],
    () => apiClient.GET("/organisations/{organisation_id}", { params: { path: { organisation_id: organisationId } } }),
    { enabled: Boolean(organisationId) }
  );
  const rolesQuery = useApiQuery(
    ["organisations", organisationId, "roles"],
    () => apiClient.GET("/organisations/{organisation_id}/roles", { params: { path: { organisation_id: organisationId } } }),
    { enabled: Boolean(organisationId) }
  );

  const [editingOrganisation, setEditingOrganisation] = useState(false);
  const [name, setName] = useState("");
  const [locality, setLocality] = useState("");
  const [organisationValidationErrors, setOrganisationValidationErrors] = useState<readonly string[]>([]);

  useEffect(() => {
    setEditingOrganisation(false);
  }, [organisationId]);

  useEffect(() => {
    if (organisationQuery.data) {
      setName(organisationQuery.data.properties.name);
      setLocality(organisationQuery.data.properties.addressLocalityName ?? "");
    }
  }, [organisationQuery.data]);

  const organisationMutation = useApiMutation<OrganisationResponse, OrganisationResponse["properties"]>((properties) =>
    apiClient.PUT("/organisations/{organisation_id}", { params: { path: { organisation_id: organisationId } }, body: { properties } })
  );

  function handleOrganisationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation: string[] = [];
    if (!name.trim()) validation.push("Enter a name.");
    setOrganisationValidationErrors(validation);
    if (validation.length > 0) return;

    organisationMutation.mutate(
      { name: name.trim(), addressLocalityName: locality.trim() || null },
      {
        onSuccess: () => {
          setEditingOrganisation(false);
          void queryClient.invalidateQueries({ queryKey: ["organisations", organisationId] });
          void queryClient.invalidateQueries({ queryKey: ["organisations"] });
        },
      }
    );
  }

  if (organisationQuery.status === "pending" || rolesQuery.status === "pending") {
    return <StatusBanner kind="loading" title="Loading organisation…" />;
  }

  if (organisationQuery.status === "error") {
    return <ApiErrorBanner error={organisationQuery.error} onRetry={() => organisationQuery.refetch()} />;
  }

  if (rolesQuery.status === "error") {
    return <ApiErrorBanner error={rolesQuery.error} onRetry={() => rolesQuery.refetch()} />;
  }

  const organisation = organisationQuery.data;
  const roles = rolesQuery.data;
  const existingRoleTypes = new Set(roles.map((role) => role.type));
  const addableTypes = SUPPLIER_ROLE_TYPE_OPTIONS.filter((option) => !existingRoleTypes.has(option.value));

  return (
    <Stack gap="md">
      <Group gap="xs"><CctIcon.supplier size={28} aria-hidden /><Title order={1}>{organisation.properties.name}</Title></Group>

      {editingOrganisation ? (
        <form onSubmit={handleOrganisationSubmit} aria-label="Edit organisation" noValidate>
          <Stack gap="xs">
            <FormErrorSummary errors={organisationValidationErrors} />
            <TextInput label="Name" required value={name} onChange={(event) => setName(event.currentTarget.value)} />
            <TextInput label="Locality" value={locality} onChange={(event) => setLocality(event.currentTarget.value)} />
            <Group>
              <Button type="submit" loading={organisationMutation.isPending}>
                Update organisation details
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setEditingOrganisation(false);
                  setName(organisation.properties.name);
                  setLocality(organisation.properties.addressLocalityName ?? "");
                }}
              >
                Cancel changes
              </Button>
            </Group>
            {organisationMutation.isError ? <ApiErrorBanner error={organisationMutation.error} /> : null}
          </Stack>
        </form>
      ) : (
        <Stack gap={6}>
          <Group>
            <Text fw={500} size="sm" w={160}>ID</Text>
            <Text size="sm">{organisation.entityId}</Text>
          </Group>
          {propertyDisplayEntries(organisation.properties, { skipKeys: ["name"] }).map(({ key, label, value }) => (
            <Group key={key}>
              <Text fw={500} size="sm" w={160}>{label}</Text>
              <Text size="sm">{value}</Text>
            </Group>
          ))}
          <Group mt="xs">
            <Button onClick={() => setEditingOrganisation(true)}>Edit organisation</Button>
          </Group>
        </Stack>
      )}

      <div>
        <Title order={2}>Roles</Title>
        {roles.length === 0 ? <StatusBanner kind="empty" title="No roles assigned." /> : null}
        <Stack gap="sm" mt="xs">
          {roles.map((role) => (
            <RoleCard key={role.entityId} organisationId={organisationId} role={role} />
          ))}
        </Stack>

        {addableTypes.length > 0 ? (
          <Group mt="sm">
            {addableTypes.map((option) => (
              <AddRoleButton key={option.value} organisationId={organisationId} roleType={option.value} label={option.label} />
            ))}
          </Group>
        ) : null}
      </div>
    </Stack>
  );
}

function RoleCard({ organisationId, role }: { readonly organisationId: string; readonly role: OrgaRoleResponse }) {
  const [editing, setEditing] = useState(false);
  const [airlineDesignator, setAirlineDesignator] = useState(
    isAirline(role.type) ? (role.properties as { airlineDesignator?: string }).airlineDesignator ?? "" : ""
  );

  const isActive = role.properties.roleStatusCode === "role/active";
  const label = SUPPLIER_ROLE_TYPE_LABEL[role.type] ?? role.type;

  const updateMutation = useApiMutation<
    OrgaRoleResponse,
    { airlineDesignator?: string; roleStatusCode: "role/active" | "role/inactive" }
  >((properties) =>
    apiClient.PUT("/organisations/{organisation_id}/roles/{role_id}", {
      params: { path: { organisation_id: organisationId, role_id: role.entityId } },
      body: { role: roleRequestBody(role.type as SupplierRoleType, properties) },
    })
  );

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: ["organisations", organisationId, "roles"] });
    void queryClient.invalidateQueries({ queryKey: ["organisations"] });
  }

  function handleStatusToggle() {
    updateMutation.mutate(
      {
        airlineDesignator: isAirline(role.type) ? (role.properties as { airlineDesignator?: string }).airlineDesignator : undefined,
        roleStatusCode: isActive ? "role/inactive" : "role/active",
      },
      { onSuccess: invalidate }
    );
  }

  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateMutation.mutate(
      { airlineDesignator, roleStatusCode: role.properties.roleStatusCode },
      {
        onSuccess: () => {
          setEditing(false);
          invalidate();
        },
      }
    );
  }

  return (
    <Stack
      id={`role-${role.entityId}`}
      gap="xs"
      p="sm"
      style={{ border: "1px solid var(--mantine-color-gray-4)", borderRadius: 8, scrollMarginTop: 88 }}
    >
      <Group justify="space-between">
        <Group gap="xs">
          <Text fw={700}>{label}</Text>
          <Badge color={isActive ? "green" : "gray"}>{isActive ? "Active" : "Inactive"}</Badge>
        </Group>
        <Text size="xs" c="dimmed">
          {role.entityId}
        </Text>
      </Group>

      {editing ? (
        <form onSubmit={handleEditSubmit} aria-label={`Edit ${label} role`} noValidate>
          <Stack gap="xs">
            {isAirline(role.type) ? (
              <TextInput
                label="Airline designator"
                required
                value={airlineDesignator}
                onChange={(event) => setAirlineDesignator(event.currentTarget.value)}
              />
            ) : (
              <Text size="sm" c="dimmed">
                No {label.toLowerCase()}-specific properties are defined yet.
              </Text>
            )}
            <Group>
              <Button type="submit" size="compact-sm" loading={updateMutation.isPending}>
                Update {label.toLowerCase()}
              </Button>
              <Button size="compact-sm" variant="default" onClick={() => setEditing(false)}>
                Cancel changes
              </Button>
            </Group>
          </Stack>
        </form>
      ) : (
        <>
          {propertyDisplayEntries(role.properties, { skipKeys: ["roleStatusCode"] }).map(({ key, label: propertyLabel, value }) => (
            <Text size="sm" key={key}>
              {propertyLabel}: {value}
            </Text>
          ))}
          <IncomingReferenceLinks kind="orga-role" entityId={role.entityId} countKeys={["products"]} targetPath="/products" targetParam="supplierRoleId" />
          <Group>
            <Button size="compact-sm" onClick={() => setEditing(true)}>
              Edit {label.toLowerCase()}
            </Button>
            <Button size="compact-sm" variant="default" loading={updateMutation.isPending} onClick={handleStatusToggle}>
              {isActive ? "Deactivate" : "Reactivate"} {label.toLowerCase()}
            </Button>
          </Group>
        </>
      )}
      {updateMutation.isError ? <ApiErrorBanner error={updateMutation.error} /> : null}
    </Stack>
  );
}

function AddRoleButton({
  organisationId,
  roleType,
  label,
}: {
  readonly organisationId: string;
  readonly roleType: SupplierRoleType;
  readonly label: string;
}) {
  const [open, setOpen] = useState(false);
  const [airlineDesignator, setAirlineDesignator] = useState("");

  const createMutation = useApiMutation<OrgaRoleResponse, void>(() => {
    return apiClient.POST("/organisations/{organisation_id}/roles", {
      params: { path: { organisation_id: organisationId } },
      body: { role: roleRequestBody(roleType, { airlineDesignator, roleStatusCode: "role/active" }) },
    });
  });

  if (!open) {
    return (
      <Button variant="default" onClick={() => setOpen(true)}>
        Add {label.toLowerCase()} role
      </Button>
    );
  }

  return (
    <form
      aria-label={`Add ${label} role`}
      onSubmit={(event) => {
        event.preventDefault();
        createMutation.mutate(undefined, {
          onSuccess: () => {
            setOpen(false);
            void queryClient.invalidateQueries({ queryKey: ["organisations", organisationId, "roles"] });
            void queryClient.invalidateQueries({ queryKey: ["organisations"] });
          },
        });
      }}
    >
      <Stack gap="xs" p="sm" style={{ border: "1px dashed var(--mantine-color-gray-5)", borderRadius: 8 }}>
        <Text fw={700}>Add {label.toLowerCase()} role</Text>
        {isAirline(roleType) ? (
          <TextInput
            label="Airline designator"
            required
            value={airlineDesignator}
            onChange={(event) => setAirlineDesignator(event.currentTarget.value)}
          />
        ) : null}
        <Group>
          <Button type="submit" size="compact-sm" loading={createMutation.isPending}>
            Add role
          </Button>
          <Button size="compact-sm" variant="default" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </Group>
        {createMutation.isError ? <ApiErrorBanner error={createMutation.error} /> : null}
      </Stack>
    </form>
  );
}
