import { Button, Group, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { type FormEvent, useState } from "react";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, FormErrorSummary, StatusBanner } from "@cct/ui";
import { useApiMutation } from "@cct/api-client";

import { apiClient, queryClient } from "../api";
import { PAYMENT_METHOD_OPTIONS, type PaymentMethodCode } from "./payment-methods";

type PersonResponse = components["schemas"]["PersonResponse"];
type PersonRoleResponse = components["schemas"]["PersonRoleResponse"];
type RoleType = "person/customer" | "person/traveller";

const ROLE_TYPE_OPTIONS: { value: RoleType; label: string }[] = [
  { value: "person/customer", label: "Customer" },
  { value: "person/traveller", label: "Traveller" },
];

function generateEntityId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export interface PersonCreatePanelProps {
  /** Called once the person (and, if it succeeded, its initial role) exists. */
  readonly onCreated: (personId: string) => void;
  readonly onCancel: () => void;
}

/**
 * S-002 create flow (UC-014): a new Person plus its required initial role,
 * as one guided form. If the person is created but the role fails, the
 * person record already exists (it is not rolled back) so this offers a
 * retry for just the role rather than presenting a false failure. Used both
 * as the persons list's inline right-pane create mode (stakeholder review,
 * 2026-08-20: creation should sit in the same pane as viewing/editing,
 * not a separate page) and by the standalone `/persons/new` route.
 */
export function PersonCreatePanel({ onCreated, onCancel }: PersonCreatePanelProps) {
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [locality, setLocality] = useState("");
  const [roleType, setRoleType] = useState<RoleType>("person/customer");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<readonly string[]>([]);
  const [createdPersonId, setCreatedPersonId] = useState<string | null>(null);

  const personMutation = useApiMutation<PersonResponse, { entityId: string; properties: PersonResponse["properties"] }>(
    ({ entityId, properties }) => apiClient.POST("/persons", { body: { entityId, properties } })
  );
  const roleMutation = useApiMutation<PersonRoleResponse, { personId: string }>(({ personId }) => {
    const entityId = generateEntityId("ROLE");
    if (roleType === "person/customer") {
      return apiClient.POST("/persons/{person_id}/roles", {
        params: { path: { person_id: personId } },
        body: {
          entityId,
          role: {
            type: "person/customer",
            properties: { paymentMethodCode: paymentMethod as PaymentMethodCode | null, roleStatusCode: "role/active" },
          },
        },
      });
    }
    return apiClient.POST("/persons/{person_id}/roles", {
      params: { path: { person_id: personId } },
      body: { entityId, role: { type: "person/traveller", properties: { roleStatusCode: "role/active" } } },
    });
  });

  function submitRole(personId: string) {
    roleMutation.mutate(
      { personId },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["persons"] });
          onCreated(personId);
        },
      }
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation: string[] = [];
    if (!givenName.trim()) validation.push("Enter a given name.");
    if (!familyName.trim()) validation.push("Enter a family name.");
    setValidationErrors(validation);
    if (validation.length > 0) return;

    const personId = generateEntityId("PER");
    personMutation.mutate(
      {
        entityId: personId,
        properties: {
          givenName: givenName.trim(),
          familyName: familyName.trim(),
          addressLocalityName: locality.trim() || null,
        },
      },
      {
        onSuccess: () => {
          setCreatedPersonId(personId);
          submitRole(personId);
        },
      }
    );
  }

  return (
    <Stack gap="md">
      <Title order={1}>Create person</Title>
      <Text size="sm" c="dimmed">
        Creates a Person plus its initial customer or traveller role. Add further roles from the person's detail view.
      </Text>

      <form onSubmit={handleSubmit} aria-label="Create person and initial role" noValidate>
        <Stack gap="xs">
          <FormErrorSummary errors={validationErrors} />
          <TextInput label="Given name" required value={givenName} onChange={(event) => setGivenName(event.currentTarget.value)} />
          <TextInput label="Family name" required value={familyName} onChange={(event) => setFamilyName(event.currentTarget.value)} />
          <TextInput label="Locality" value={locality} onChange={(event) => setLocality(event.currentTarget.value)} />
          <Select
            label="Initial role"
            data={ROLE_TYPE_OPTIONS}
            value={roleType}
            onChange={(value) => setRoleType((value as RoleType) ?? "person/customer")}
            allowDeselect={false}
          />
          {roleType === "person/customer" ? (
            <Select
              label="Payment method"
              placeholder="None"
              data={PAYMENT_METHOD_OPTIONS}
              value={paymentMethod}
              onChange={setPaymentMethod}
              clearable
            />
          ) : null}

          <Group>
            <Button type="submit" loading={personMutation.isPending || roleMutation.isPending}>
              Create person
            </Button>
            <Button variant="default" onClick={onCancel}>
              Cancel
            </Button>
          </Group>

          {personMutation.isError ? <ApiErrorBanner error={personMutation.error} /> : null}
          {createdPersonId && roleMutation.isError ? (
            <Stack gap="xs">
              <StatusBanner
                kind="conflict"
                title="Person created, but the initial role could not be added"
                description="The person record was saved. Retry adding the role, or open the person to add it from there."
              />
              <Group>
                <Button variant="light" loading={roleMutation.isPending} onClick={() => submitRole(createdPersonId)}>
                  Retry adding role
                </Button>
                <Button variant="subtle" onClick={() => onCreated(createdPersonId)}>
                  Open person
                </Button>
              </Group>
            </Stack>
          ) : null}
        </Stack>
      </form>
    </Stack>
  );
}
