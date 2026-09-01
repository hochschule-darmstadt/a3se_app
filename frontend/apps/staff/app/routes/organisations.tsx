import { Badge, Button, Grid, Group, Select, Stack, TextInput, Title } from "@mantine/core";
import { useEffect, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, CctIcon, CursorPager, DataTable, StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { useAllPages } from "../lib/use-cursor-page";
import { OrganisationCreatePanel } from "../lib/organisation-create-panel";
import { OrganisationDetailPanel } from "../lib/organisation-detail-panel";
import { SUPPLIER_ROLE_TYPE_LABEL, SUPPLIER_ROLE_TYPE_OPTIONS } from "../lib/supplier-roles";
import { StaffShell } from "../lib/shell";
import { STAFF_VIEW_PARAM, patchStaffViewState, readStaffViewOption, readStaffViewPage } from "../lib/staff-view-state";

type RightPane =
  | { readonly mode: "none" }
  | { readonly mode: "detail"; readonly organisationId: string }
  | { readonly mode: "create" };

type OrganisationResponse = components["schemas"]["OrganisationResponse"];
type OrgaRoleResponse = components["schemas"]["OrgaRoleResponse"];

const PAGE_SIZE = 20;

const ROLE_TYPE_OPTIONS = [{ value: "all", label: "All" }, ...SUPPLIER_ROLE_TYPE_OPTIONS];

const RELATIONSHIP_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "role/active", label: "Active" },
  { value: "role/inactive", label: "Inactive" },
];

export function meta() {
  return [{ title: "Organisations — CCT Staff" }];
}

/**
 * S-004 (issue #30): fetches every organisation up front (see `useAllPages`)
 * so name and role-type/relationship-status filters apply across the whole
 * collection, not just one server page, matching `PersonsRoute` (issue #29
 * phase 2). Selecting a row shows its detail in the right pane inline
 * instead of navigating to a separate page.
 */
export default function OrganisationsRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const allOrganisations = useAllPages<OrganisationResponse>(["organisations"], (cursor) =>
    apiClient.GET("/organisations", { params: { query: { cursor, limit: 50 } } })
  );

  const search = searchParams.get(STAFF_VIEW_PARAM.search) ?? "";
  const roleType = readStaffViewOption(searchParams, STAFF_VIEW_PARAM.type, ROLE_TYPE_OPTIONS.map((option) => option.value));
  const relationshipStatus = readStaffViewOption(searchParams, STAFF_VIEW_PARAM.status, RELATIONSHIP_STATUS_OPTIONS.map((option) => option.value));
  const detailId = searchParams.get(STAFF_VIEW_PARAM.detail);
  const rightPane: RightPane = searchParams.get(STAFF_VIEW_PARAM.panel) === "create"
    ? { mode: "create" }
    : detailId ? { mode: "detail", organisationId: detailId } : { mode: "none" };

  function updateView(patch: Parameters<typeof patchStaffViewState>[1], replace = false) {
    setSearchParams(patchStaffViewState(searchParams, patch), { replace });
  }

  const roleQueries = useQueries({
    queries: allOrganisations.items.map((organisation) => ({
      queryKey: ["organisations", organisation.entityId, "roles"],
      queryFn: async () => {
        const { data } = await apiClient.GET("/organisations/{organisation_id}/roles", {
          params: { path: { organisation_id: organisation.entityId } },
        });
        return (data ?? []) as OrgaRoleResponse[];
      },
    })),
  });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return allOrganisations.items
      .map((organisation, index) => ({ organisation, roles: roleQueries[index]?.data ?? [] }))
      .filter(({ organisation, roles }) => {
        if (term) {
          const haystack = `${organisation.properties.name} ${organisation.properties.addressLocalityName ?? ""}`.toLowerCase();
          if (!haystack.includes(term)) return false;
        }
        if (roleType !== "all" || relationshipStatus !== "all") {
          const matches = roles.some(
            (role) =>
              (roleType === "all" || role.type === roleType) &&
              (relationshipStatus === "all" || role.properties.roleStatusCode === relationshipStatus)
          );
          if (!matches) return false;
        }
        return true;
      });
  }, [allOrganisations.items, roleQueries, search, roleType, relationshipStatus]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const clampedPageIndex = Math.min(readStaffViewPage(searchParams), pageCount - 1);
  const pageRows = rows.slice(clampedPageIndex * PAGE_SIZE, clampedPageIndex * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
    if (allOrganisations.status === "success" && pageRows.length === 1 && !detailId && searchParams.get(STAFF_VIEW_PARAM.panel) !== "create") {
      updateView({ [STAFF_VIEW_PARAM.detail]: pageRows[0]!.organisation.entityId }, true);
    }
  }, [allOrganisations.status, pageRows, detailId, searchParams]);

  return (
    <StaffShell breadcrumbs={[{ label: "Suppliers and partners" }]}>
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Group gap="xs"><CctIcon.supplier size={28} aria-hidden /><Title order={1}>Suppliers and partners</Title></Group>
          <Button leftSection={<CctIcon.supplier size={18} aria-hidden />} onClick={() => updateView({ [STAFF_VIEW_PARAM.panel]: "create", [STAFF_VIEW_PARAM.detail]: null })}>Create organisation</Button>
        </Group>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="sm">
              <Group align="flex-end">
                <TextInput
                  label="Search"
                  placeholder="Name or locality"
                  value={search}
                  onChange={(event) => updateView({ [STAFF_VIEW_PARAM.search]: event.currentTarget.value, [STAFF_VIEW_PARAM.page]: null }, true)}
                />
                <Select label="Role type" data={ROLE_TYPE_OPTIONS} value={roleType} onChange={(value) => updateView({ [STAFF_VIEW_PARAM.type]: value === "all" ? null : value, [STAFF_VIEW_PARAM.page]: null }, true)} allowDeselect={false} />
                <Select
                  label="Relationship status"
                  data={RELATIONSHIP_STATUS_OPTIONS}
                  value={relationshipStatus}
                  onChange={(value) => updateView({ [STAFF_VIEW_PARAM.status]: value === "all" ? null : value, [STAFF_VIEW_PARAM.page]: null }, true)}
                  allowDeselect={false}
                />
              </Group>

              {allOrganisations.status === "pending" ? <StatusBanner kind="loading" title="Loading organisations…" /> : null}
              {allOrganisations.status === "error" && allOrganisations.error ? (
                <ApiErrorBanner error={allOrganisations.error} onRetry={allOrganisations.refetch} />
              ) : null}
              {allOrganisations.status === "success" ? (
                <>
                  <DataTable<{ organisation: OrganisationResponse; roles: readonly OrgaRoleResponse[] }>
                    caption={`Organisations · ${rows.length === 0 ? 0 : clampedPageIndex * PAGE_SIZE + 1}–${Math.min(rows.length, (clampedPageIndex + 1) * PAGE_SIZE)} of ${rows.length}`}
                    rowKey={(row) => row.organisation.entityId}
                    rows={pageRows}
                    emptyMessage="No organisations match these filters."
                    onRowActivate={(row) => updateView({ [STAFF_VIEW_PARAM.detail]: row.organisation.entityId, [STAFF_VIEW_PARAM.panel]: null })}
                    isRowSelected={(row) => rightPane.mode === "detail" && row.organisation.entityId === rightPane.organisationId}
                    columns={[
                      { key: "name", header: "Organisation", render: (row) => row.organisation.properties.name },
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
                                    {SUPPLIER_ROLE_TYPE_LABEL[role.type] ?? role.type}
                                    {active ? "" : " · inactive"}
                                  </Badge>
                                );
                              })}
                            </Group>
                          ),
                      },
                      { key: "locality", header: "Locality", render: (row) => row.organisation.properties.addressLocalityName ?? "—" },
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
              <OrganisationDetailPanel organisationId={rightPane.organisationId} />
            ) : rightPane.mode === "create" ? (
              <OrganisationCreatePanel
                onCreated={(organisationId) => updateView({ [STAFF_VIEW_PARAM.detail]: organisationId, [STAFF_VIEW_PARAM.panel]: null })}
                onCancel={() => updateView({ [STAFF_VIEW_PARAM.panel]: null })}
              />
            ) : (
              <StatusBanner kind="info" title="No organisation selected" description="Select an organisation from the list to view its details, or create one." />
            )}
          </Grid.Col>
        </Grid>
      </Stack>
    </StaffShell>
  );
}
