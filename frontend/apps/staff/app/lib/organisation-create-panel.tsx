import { Button, Group, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { type FormEvent, useState } from "react";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, FormErrorSummary, StatusBanner } from "@cct/ui";
import { useApiMutation } from "@cct/api-client";

import { apiClient, queryClient } from "../api";
import { SUPPLIER_ROLE_TYPE_OPTIONS, type SupplierRoleType } from "./supplier-roles";

type OrganisationResponse = components["schemas"]["OrganisationResponse"];
type OrgaRoleResponse = components["schemas"]["OrgaRoleResponse"];

function generateEntityId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function isAirline(type: SupplierRoleType): type is "partner/supplier/airline" {
  return type === "partner/supplier/airline";
}

export interface OrganisationCreatePanelProps {
  /** Called once the organisation (and, if it succeeded, its initial role) exists. */
  readonly onCreated: (organisationId: string) => void;
  readonly onCancel: () => void;
}

/**
 * S-004 create flow (issue #30): a new Organisation plus its required
 * initial supplier role, as one guided form, mirroring `PersonCreatePanel`
 * (issue #29). If the organisation is created but the role fails, the
 * organisation record already exists (it is not rolled back), so this
 * offers a retry for just the role rather than presenting a false failure.
 */
export function OrganisationCreatePanel({ onCreated, onCancel }: OrganisationCreatePanelProps) {
  const [name, setName] = useState("");
  const [locality, setLocality] = useState("");
  const [roleType, setRoleType] = useState<SupplierRoleType>("partner/supplier/hotel");
  const [airlineDesignator, setAirlineDesignator] = useState("");
  const [validationErrors, setValidationErrors] = useState<readonly string[]>([]);
  const [createdOrganisationId, setCreatedOrganisationId] = useState<string | null>(null);

  const organisationMutation = useApiMutation<
    OrganisationResponse,
    { entityId: string; properties: OrganisationResponse["properties"] }
  >(({ entityId, properties }) => apiClient.POST("/organisations", { body: { entityId, properties } }));

  const roleMutation = useApiMutation<OrgaRoleResponse, { organisationId: string }>(({ organisationId }) => {
    const entityId = generateEntityId("ROLE");
    const role = isAirline(roleType)
      ? { type: roleType, properties: { airlineDesignator, roleStatusCode: "role/active" as const } }
      : { type: roleType, properties: { roleStatusCode: "role/active" as const } };
    return apiClient.POST("/organisations/{organisation_id}/roles", {
      params: { path: { organisation_id: organisationId } },
      body: { entityId, role },
    });
  });

  function submitRole(organisationId: string) {
    roleMutation.mutate(
      { organisationId },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["organisations"] });
          onCreated(organisationId);
        },
      }
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation: string[] = [];
    if (!name.trim()) validation.push("Enter a name.");
    if (isAirline(roleType) && !airlineDesignator.trim()) validation.push("Enter an airline designator.");
    setValidationErrors(validation);
    if (validation.length > 0) return;

    const organisationId = generateEntityId("ORG");
    organisationMutation.mutate(
      { entityId: organisationId, properties: { name: name.trim(), addressLocalityName: locality.trim() || null } },
      {
        onSuccess: () => {
          setCreatedOrganisationId(organisationId);
          submitRole(organisationId);
        },
      }
    );
  }

  return (
    <Stack gap="md">
      <Title order={1}>Create organisation</Title>
      <Text size="sm" c="dimmed">
        Creates an Organisation plus its initial supplier role. Add further roles from the organisation's detail view.
      </Text>

      <form onSubmit={handleSubmit} aria-label="Create organisation and initial role" noValidate>
        <Stack gap="xs">
          <FormErrorSummary errors={validationErrors} />
          <TextInput label="Name" required value={name} onChange={(event) => setName(event.currentTarget.value)} />
          <TextInput label="Locality" value={locality} onChange={(event) => setLocality(event.currentTarget.value)} />
          <Select
            label="Initial role"
            data={SUPPLIER_ROLE_TYPE_OPTIONS}
            value={roleType}
            onChange={(value) => setRoleType((value as SupplierRoleType) ?? "partner/supplier/hotel")}
            allowDeselect={false}
          />
          {isAirline(roleType) ? (
            <TextInput
              label="Airline designator"
              required
              value={airlineDesignator}
              onChange={(event) => setAirlineDesignator(event.currentTarget.value)}
            />
          ) : null}

          <Group>
            <Button type="submit" loading={organisationMutation.isPending || roleMutation.isPending}>
              Create organisation
            </Button>
            <Button variant="default" onClick={onCancel}>
              Cancel
            </Button>
          </Group>

          {organisationMutation.isError ? <ApiErrorBanner error={organisationMutation.error} /> : null}
          {createdOrganisationId && roleMutation.isError ? (
            <Stack gap="xs">
              <StatusBanner
                kind="conflict"
                title="Organisation created, but the initial role could not be added"
                description="The organisation record was saved. Retry adding the role, or open the organisation to add it from there."
              />
              <Group>
                <Button variant="light" loading={roleMutation.isPending} onClick={() => submitRole(createdOrganisationId)}>
                  Retry adding role
                </Button>
                <Button variant="subtle" onClick={() => onCreated(createdOrganisationId)}>
                  Open organisation
                </Button>
              </Group>
            </Stack>
          ) : null}
        </Stack>
      </form>
    </Stack>
  );
}
