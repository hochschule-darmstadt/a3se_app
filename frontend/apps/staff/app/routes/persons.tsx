import { Badge, Button, Grid, Group, Select, Stack, TextInput, Title } from "@mantine/core";
import { useEffect, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, CursorPager, DataTable, StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { useAllPages } from "../lib/use-cursor-page";
import { PersonCreatePanel } from "../lib/person-create-panel";
import { PersonDetailPanel } from "../lib/person-detail-panel";
import { StaffShell } from "../lib/shell";
import { STAFF_VIEW_PARAM, patchStaffViewState, readStaffViewOption, readStaffViewPage } from "../lib/staff-view-state";

type RightPane = { readonly mode: "none" } | { readonly mode: "detail"; readonly personId: string } | { readonly mode: "create" };

type PersonResponse = components["schemas"]["PersonResponse"];
type PersonRoleResponse = components["schemas"]["PersonRoleResponse"];

const PAGE_SIZE = 20;

const ROLE_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "person/customer", label: "Customer" },
  { value: "person/traveller", label: "Traveller" },
];

const ROLE_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "role/active", label: "Active" },
  { value: "role/inactive", label: "Inactive" },
];

const ROLE_TYPE_LABEL: Record<string, string> = { "person/customer": "Customer", "person/traveller": "Traveller" };

export function meta() {
  return [{ title: "Persons — CCT Staff" }];
}

/**
 * S-002: fetches every person up front (see `useAllPages`) so name and
 * role-type/role-status filters apply across the whole collection, not just
 * one server page (stakeholder review, 2026-08-20, of an earlier
 * current-page-only version). Selecting a row shows its detail in the right
 * pane inline, matching the reviewed wireframe's list/detail split, instead
 * of navigating to a separate page.
 */
export default function PersonsRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const allPersons = useAllPages<PersonResponse>(["persons"], (cursor) =>
    apiClient.GET("/persons", { params: { query: { cursor, limit: 50 } } })
  );

  const search = searchParams.get(STAFF_VIEW_PARAM.search) ?? "";
  const roleType = readStaffViewOption(searchParams, STAFF_VIEW_PARAM.type, ROLE_TYPE_OPTIONS.map((option) => option.value));
  const roleStatus = readStaffViewOption(searchParams, STAFF_VIEW_PARAM.status, ROLE_STATUS_OPTIONS.map((option) => option.value));
  const detailId = searchParams.get(STAFF_VIEW_PARAM.detail);
  const rightPane: RightPane = searchParams.get(STAFF_VIEW_PARAM.panel) === "create"
    ? { mode: "create" }
    : detailId ? { mode: "detail", personId: detailId } : { mode: "none" };

  function updateView(patch: Parameters<typeof patchStaffViewState>[1], replace = false) {
    setSearchParams(patchStaffViewState(searchParams, patch), { replace });
  }

  const roleQueries = useQueries({
    queries: allPersons.items.map((person) => ({
      queryKey: ["persons", person.entityId, "roles"],
      queryFn: async () => {
        const { data } = await apiClient.GET("/persons/{person_id}/roles", {
          params: { path: { person_id: person.entityId } },
        });
        return (data ?? []) as PersonRoleResponse[];
      },
    })),
  });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return allPersons.items
      .map((person, index) => ({ person, roles: roleQueries[index]?.data ?? [] }))
      .filter(({ person, roles }) => {
        if (term) {
          const haystack = `${person.properties.givenName} ${person.properties.familyName} ${person.properties.addressLocalityName ?? ""}`.toLowerCase();
          if (!haystack.includes(term)) return false;
        }
        if (roleType !== "all" || roleStatus !== "all") {
          const matches = roles.some(
            (role) => (roleType === "all" || role.type === roleType) && (roleStatus === "all" || role.properties.roleStatusCode === roleStatus)
          );
          if (!matches) return false;
        }
        return true;
      });
  }, [allPersons.items, roleQueries, search, roleType, roleStatus]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const clampedPageIndex = Math.min(readStaffViewPage(searchParams), pageCount - 1);
  const pageRows = rows.slice(clampedPageIndex * PAGE_SIZE, clampedPageIndex * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
    if (allPersons.status === "success" && pageRows.length === 1 && !detailId && searchParams.get(STAFF_VIEW_PARAM.panel) !== "create") {
      updateView({ [STAFF_VIEW_PARAM.detail]: pageRows[0]!.person.entityId }, true);
    }
  }, [allPersons.status, pageRows, detailId, searchParams]);

  return (
    <StaffShell breadcrumbs={[{ label: "Customers and travellers" }]}>
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Title order={1}>Customers and travellers</Title>
          <Button onClick={() => updateView({ [STAFF_VIEW_PARAM.panel]: "create", [STAFF_VIEW_PARAM.detail]: null })}>Create person</Button>
        </Group>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="sm">
              <Group align="flex-end">
                <TextInput
                  label="Search"
                  placeholder="Given name, family name or locality"
                  value={search}
                  onChange={(event) => updateView({ [STAFF_VIEW_PARAM.search]: event.currentTarget.value, [STAFF_VIEW_PARAM.page]: null }, true)}
                />
                <Select label="Role type" data={ROLE_TYPE_OPTIONS} value={roleType} onChange={(value) => updateView({ [STAFF_VIEW_PARAM.type]: value === "all" ? null : value, [STAFF_VIEW_PARAM.page]: null }, true)} allowDeselect={false} />
                <Select
                  label="Role status"
                  data={ROLE_STATUS_OPTIONS}
                  value={roleStatus}
                  onChange={(value) => updateView({ [STAFF_VIEW_PARAM.status]: value === "all" ? null : value, [STAFF_VIEW_PARAM.page]: null }, true)}
                  allowDeselect={false}
                />
              </Group>

              {allPersons.status === "pending" ? <StatusBanner kind="loading" title="Loading persons…" /> : null}
              {allPersons.status === "error" && allPersons.error ? (
                <ApiErrorBanner error={allPersons.error} onRetry={allPersons.refetch} />
              ) : null}
              {allPersons.status === "success" ? (
                <>
                  <DataTable<{ person: PersonResponse; roles: readonly PersonRoleResponse[] }>
                    caption={`Persons · ${rows.length === 0 ? 0 : clampedPageIndex * PAGE_SIZE + 1}–${Math.min(rows.length, (clampedPageIndex + 1) * PAGE_SIZE)} of ${rows.length}`}
                    rowKey={(row) => row.person.entityId}
                    rows={pageRows}
                    emptyMessage="No persons match these filters."
                    onRowActivate={(row) => updateView({ [STAFF_VIEW_PARAM.detail]: row.person.entityId, [STAFF_VIEW_PARAM.panel]: null })}
                    isRowSelected={(row) => rightPane.mode === "detail" && row.person.entityId === rightPane.personId}
                    columns={[
                      {
                        key: "name",
                        header: "Person",
                        render: (row) => `${row.person.properties.givenName} ${row.person.properties.familyName}`,
                      },
                      {
                        key: "roles",
                        header: "Roles",
                        render: (row) =>
                          row.roles.length === 0 ? (
                            "—"
                          ) : (
                            <Group gap={4}>
                              {row.roles.map((role) => {
                                const active = role.properties.roleStatusCode === "role/active";
                                return (
                                  <Badge key={role.entityId} color={active ? "green" : "gray"}>
                                    {ROLE_TYPE_LABEL[role.type] ?? role.type}
                                    {active ? "" : " · inactive"}
                                  </Badge>
                                );
                              })}
                            </Group>
                          ),
                      },
                      { key: "locality", header: "Locality", render: (row) => row.person.properties.addressLocalityName ?? "—" },
                    ]}
                  />
                  <CursorPager
                    hasPrevious={clampedPageIndex > 0}
                    hasNext={clampedPageIndex < pageCount - 1}
                    onPrevious={() => updateView({ [STAFF_VIEW_PARAM.page]: clampedPageIndex - 1 })}
                    onNext={() => updateView({ [STAFF_VIEW_PARAM.page]: clampedPageIndex + 1 })}
                  />
                </>
              ) : null}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }} style={{ position: "sticky", top: 88, alignSelf: "flex-start", maxHeight: "calc(100vh - 104px)", overflowY: "auto" }}>
            {rightPane.mode === "detail" ? (
              <PersonDetailPanel personId={rightPane.personId} />
            ) : rightPane.mode === "create" ? (
              <PersonCreatePanel
                onCreated={(personId) => updateView({ [STAFF_VIEW_PARAM.detail]: personId, [STAFF_VIEW_PARAM.panel]: null })}
                onCancel={() => updateView({ [STAFF_VIEW_PARAM.panel]: null })}
              />
            ) : (
              <StatusBanner kind="info" title="No person selected" description="Select a person from the list to view their details, or create one." />
            )}
          </Grid.Col>
        </Grid>
      </Stack>
    </StaffShell>
  );
}
