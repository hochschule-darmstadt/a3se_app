import { useParams } from "react-router";

import { useApiQuery } from "@cct/api-client";
import { StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { OrganisationDetailPanel } from "../lib/organisation-detail-panel";
import { StaffShell } from "../lib/shell";

export function meta() {
  return [{ title: "Organisation detail — CCT Staff" }];
}

/**
 * Standalone direct-link route for one organisation (e.g. linked from a
 * touristic product's supplier column). The organisations list
 * (`organisations.tsx`) shows the same `OrganisationDetailPanel` inline as a
 * master-detail right pane instead of navigating here, mirroring
 * `PersonDetailRoute` (issue #29 phase 2).
 */
export default function OrganisationDetailRoute() {
  const { organisationId } = useParams();

  const organisationQuery = useApiQuery(
    ["organisations", organisationId],
    () => apiClient.GET("/organisations/{organisation_id}", { params: { path: { organisation_id: organisationId as string } } }),
    { enabled: Boolean(organisationId) }
  );

  if (!organisationId) {
    return (
      <StaffShell breadcrumbs={[{ label: "Suppliers and partners", to: "/organisations" }, { label: "Organisation detail" }]}>
        <StatusBanner kind="error" title="No organisation specified" />
      </StaffShell>
    );
  }

  const label = organisationQuery.data?.properties.name ?? "Organisation detail";

  return (
    <StaffShell breadcrumbs={[{ label: "Suppliers and partners", to: "/organisations" }, { label }]}>
      <OrganisationDetailPanel organisationId={organisationId} />
    </StaffShell>
  );
}
