import { Badge, Button, Group, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { type FormEvent, useEffect, useState } from "react";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, FormErrorSummary, StatusBanner } from "@cct/ui";
import { useApiMutation, useApiQuery } from "@cct/api-client";

import { apiClient, queryClient } from "../api";
import { PAYMENT_METHOD_LABEL, PAYMENT_METHOD_OPTIONS, type PaymentMethodCode } from "./payment-methods";
import { propertyDisplayEntries } from "./property-display";
import { IncomingReferenceLinks } from "./incoming-reference-links";

type PersonResponse = components["schemas"]["PersonResponse"];
type PersonRoleResponse = components["schemas"]["PersonRoleResponse"];
type RoleType = "person/customer" | "person/traveller";

const ROLE_TYPE_LABEL: Record<string, string> = { "person/customer": "Customer", "person/traveller": "Traveller" };
const ADDABLE_ROLE_TYPES: { value: RoleType; label: string }[] = [
  { value: "person/customer", label: "Customer" },
  { value: "person/traveller", label: "Traveller" },
];

/**
 * S-002 detail (issue #29): Person's shared fields, edited separately from
 * each PersonRole's role-specific fields, per the entity model. Roles are
 * deactivated/reactivated via `roleStatusCode` (PUT), not deleted. Used both
 * as the master-detail right pane on the persons list (stakeholder review,
 * 2026-08-20: selecting a row must show details without navigating away)
 * and as the standalone `/persons/:id` route's content.
 */
export function PersonDetailPanel({ personId }: { readonly personId: string }) {
  const personQuery = useApiQuery(
    ["persons", personId],
    () => apiClient.GET("/persons/{person_id}", { params: { path: { person_id: personId } } }),
    { enabled: Boolean(personId) }
  );
  const rolesQuery = useApiQuery(
    ["persons", personId, "roles"],
    () => apiClient.GET("/persons/{person_id}/roles", { params: { path: { person_id: personId } } }),
    { enabled: Boolean(personId) }
  );

  const [editingPerson, setEditingPerson] = useState(false);
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [locality, setLocality] = useState("");
  const [personValidationErrors, setPersonValidationErrors] = useState<readonly string[]>([]);

  useEffect(() => {
    setEditingPerson(false);
  }, [personId]);

  useEffect(() => {
    if (personQuery.data) {
      setGivenName(personQuery.data.properties.givenName);
      setFamilyName(personQuery.data.properties.familyName);
      setLocality(personQuery.data.properties.addressLocalityName ?? "");
    }
  }, [personQuery.data]);

  const personMutation = useApiMutation<PersonResponse, PersonResponse["properties"]>((properties) =>
    apiClient.PUT("/persons/{person_id}", { params: { path: { person_id: personId } }, body: { properties } })
  );

  function handlePersonSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation: string[] = [];
    if (!givenName.trim()) validation.push("Enter a given name.");
    if (!familyName.trim()) validation.push("Enter a family name.");
    setPersonValidationErrors(validation);
    if (validation.length > 0) return;

    personMutation.mutate(
      { givenName: givenName.trim(), familyName: familyName.trim(), addressLocalityName: locality.trim() || null },
      {
        onSuccess: () => {
          setEditingPerson(false);
          void queryClient.invalidateQueries({ queryKey: ["persons", personId] });
          void queryClient.invalidateQueries({ queryKey: ["persons"] });
        },
      }
    );
  }

  if (personQuery.status === "pending" || rolesQuery.status === "pending") {
    return <StatusBanner kind="loading" title="Loading person…" />;
  }

  if (personQuery.status === "error") {
    return <ApiErrorBanner error={personQuery.error} onRetry={() => personQuery.refetch()} />;
  }

  if (rolesQuery.status === "error") {
    return <ApiErrorBanner error={rolesQuery.error} onRetry={() => rolesQuery.refetch()} />;
  }

  const person = personQuery.data;
  const roles = rolesQuery.data;
  const existingRoleTypes = new Set(roles.map((role) => role.type));
  const addableTypes = ADDABLE_ROLE_TYPES.filter((option) => !existingRoleTypes.has(option.value));

  return (
    <Stack gap="md">
      <Title order={1}>
        {person.properties.givenName} {person.properties.familyName}
      </Title>

      {editingPerson ? (
        <form onSubmit={handlePersonSubmit} aria-label="Edit person" noValidate>
          <Stack gap="xs">
            <FormErrorSummary errors={personValidationErrors} />
            <TextInput label="Given name" required value={givenName} onChange={(event) => setGivenName(event.currentTarget.value)} />
            <TextInput label="Family name" required value={familyName} onChange={(event) => setFamilyName(event.currentTarget.value)} />
            <TextInput label="Locality" value={locality} onChange={(event) => setLocality(event.currentTarget.value)} />
            <Group>
              <Button type="submit" loading={personMutation.isPending}>
                Update person details
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setEditingPerson(false);
                  setGivenName(person.properties.givenName);
                  setFamilyName(person.properties.familyName);
                  setLocality(person.properties.addressLocalityName ?? "");
                }}
              >
                Cancel changes
              </Button>
            </Group>
            {personMutation.isError ? <ApiErrorBanner error={personMutation.error} /> : null}
          </Stack>
        </form>
      ) : (
        <Stack gap={6}>
          <Group>
            <Text fw={500} size="sm" w={160}>ID</Text>
            <Text size="sm">{person.entityId}</Text>
          </Group>
          {propertyDisplayEntries(person.properties, { skipKeys: ["givenName", "familyName"] }).map(({ key, label, value }) => (
            <Group key={key}>
              <Text fw={500} size="sm" w={160}>{label}</Text>
              <Text size="sm">{value}</Text>
            </Group>
          ))}
          <Group mt="xs">
            <Button onClick={() => setEditingPerson(true)}>Edit person</Button>
          </Group>
        </Stack>
      )}

      <div>
        <Title order={2}>Roles</Title>
        {roles.length === 0 ? <StatusBanner kind="empty" title="No roles assigned." /> : null}
        <Stack gap="sm" mt="xs">
          {roles.map((role) => (
            <RoleCard key={role.entityId} personId={personId} role={role} />
          ))}
        </Stack>

        {addableTypes.length > 0 ? (
          <Group mt="sm">
            {addableTypes.map((option) => (
              <AddRoleButton key={option.value} personId={personId} roleType={option.value} label={option.label} />
            ))}
          </Group>
        ) : null}
      </div>
    </Stack>
  );
}

function RoleCard({ personId, role }: { readonly personId: string; readonly role: PersonRoleResponse }) {
  const [editing, setEditing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(
    role.type === "person/customer" ? (role.properties as { paymentMethodCode?: string | null }).paymentMethodCode ?? null : null
  );

  const isActive = role.properties.roleStatusCode === "role/active";

  const updateMutation = useApiMutation<
    PersonRoleResponse,
    { paymentMethodCode?: string | null; roleStatusCode: "role/active" | "role/inactive" }
  >((properties) => {
    if (role.type === "person/customer") {
      return apiClient.PUT("/persons/{person_id}/roles/{role_id}", {
        params: { path: { person_id: personId, role_id: role.entityId } },
        body: {
          role: {
            type: "person/customer",
            properties: {
              paymentMethodCode: (properties.paymentMethodCode ?? null) as PaymentMethodCode | null,
              roleStatusCode: properties.roleStatusCode,
            },
          },
        },
      });
    }
    return apiClient.PUT("/persons/{person_id}/roles/{role_id}", {
      params: { path: { person_id: personId, role_id: role.entityId } },
      body: { role: { type: "person/traveller", properties: { roleStatusCode: properties.roleStatusCode } } },
    });
  });

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: ["persons", personId, "roles"] });
    void queryClient.invalidateQueries({ queryKey: ["persons"] });
  }

  function handleStatusToggle() {
    updateMutation.mutate(
      {
        paymentMethodCode: role.type === "person/customer" ? (role.properties as { paymentMethodCode?: string | null }).paymentMethodCode ?? null : undefined,
        roleStatusCode: isActive ? "role/inactive" : "role/active",
      },
      { onSuccess: invalidate }
    );
  }

  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateMutation.mutate(
      { paymentMethodCode: paymentMethod, roleStatusCode: role.properties.roleStatusCode },
      {
        onSuccess: () => {
          setEditing(false);
          invalidate();
        },
      }
    );
  }

  return (
    <Stack gap="xs" p="sm" style={{ border: "1px solid var(--mantine-color-gray-4)", borderRadius: 8 }}>
      <Group justify="space-between">
        <Group gap="xs">
          <Text fw={700}>{ROLE_TYPE_LABEL[role.type] ?? role.type}</Text>
          <Badge color={isActive ? "green" : "gray"}>{isActive ? "Active" : "Inactive"}</Badge>
        </Group>
        <Text size="xs" c="dimmed">
          {role.entityId}
        </Text>
      </Group>

      {editing ? (
        <form onSubmit={handleEditSubmit} aria-label={`Edit ${ROLE_TYPE_LABEL[role.type] ?? role.type} role`} noValidate>
          <Stack gap="xs">
            {role.type === "person/customer" ? (
              <Select
                label="Payment method"
                placeholder="None"
                data={PAYMENT_METHOD_OPTIONS}
                value={paymentMethod}
                onChange={setPaymentMethod}
                clearable
              />
            ) : (
              <Text size="sm" c="dimmed">
                No traveller-specific properties are defined yet.
              </Text>
            )}
            <Group>
              <Button type="submit" size="compact-sm" loading={updateMutation.isPending}>
                Update {ROLE_TYPE_LABEL[role.type]?.toLowerCase() ?? "role"}
              </Button>
              <Button size="compact-sm" variant="default" onClick={() => setEditing(false)}>
                Cancel changes
              </Button>
            </Group>
          </Stack>
        </form>
      ) : (
        <>
          {propertyDisplayEntries(role.properties, { skipKeys: ["roleStatusCode"], valueLabels: { paymentMethodCode: PAYMENT_METHOD_LABEL } }).map(
            ({ key, label: propertyLabel, value }) => (
              <Text size="sm" key={key}>
                {propertyLabel}: {value}
              </Text>
            )
          )}
          <IncomingReferenceLinks kind="person-role" entityId={role.entityId} countKeys={[role.type === "person/customer" ? "customerOrders" : "travellerOrders"]} targetPath="/orders" targetParam={role.type === "person/customer" ? "customerRoleId" : "travellerRoleId"} />
          <Group>
            <Button size="compact-sm" onClick={() => setEditing(true)}>
              Edit {ROLE_TYPE_LABEL[role.type]?.toLowerCase() ?? "role"}
            </Button>
            <Button size="compact-sm" variant="default" loading={updateMutation.isPending} onClick={handleStatusToggle}>
              {isActive ? "Deactivate" : "Reactivate"} {ROLE_TYPE_LABEL[role.type]?.toLowerCase() ?? "role"}
            </Button>
          </Group>
        </>
      )}
      {updateMutation.isError ? <ApiErrorBanner error={updateMutation.error} /> : null}
    </Stack>
  );
}

function AddRoleButton({ personId, roleType, label }: { readonly personId: string; readonly roleType: RoleType; readonly label: string }) {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const createMutation = useApiMutation<PersonRoleResponse, void>(() => {
    if (roleType === "person/customer") {
      return apiClient.POST("/persons/{person_id}/roles", {
        params: { path: { person_id: personId } },
        body: {
          role: {
            type: "person/customer",
            properties: { paymentMethodCode: paymentMethod as PaymentMethodCode | null, roleStatusCode: "role/active" },
          },
        },
      });
    }
    return apiClient.POST("/persons/{person_id}/roles", {
      params: { path: { person_id: personId } },
      body: { role: { type: "person/traveller", properties: { roleStatusCode: "role/active" } } },
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
            void queryClient.invalidateQueries({ queryKey: ["persons", personId, "roles"] });
            void queryClient.invalidateQueries({ queryKey: ["persons"] });
          },
        });
      }}
    >
      <Stack gap="xs" p="sm" style={{ border: "1px dashed var(--mantine-color-gray-5)", borderRadius: 8 }}>
        <Text fw={700}>Add {label.toLowerCase()} role</Text>
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
