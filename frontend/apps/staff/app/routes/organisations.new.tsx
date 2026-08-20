import { useNavigate } from "react-router";

import { OrganisationCreatePanel } from "../lib/organisation-create-panel";
import { StaffShell } from "../lib/shell";

export function meta() {
  return [{ title: "Create organisation — CCT Staff" }];
}

/**
 * Standalone direct-link create route. The organisations list
 * (`organisations.tsx`) shows the same `OrganisationCreatePanel` inline as
 * the right pane's create mode instead of navigating here, mirroring
 * `PersonCreateRoute` (issue #29 phase 2).
 */
export default function OrganisationCreateRoute() {
  const navigate = useNavigate();

  return (
    <StaffShell breadcrumbs={[{ label: "Suppliers and partners", to: "/organisations" }, { label: "Create organisation" }]}>
      <OrganisationCreatePanel
        onCreated={(organisationId) => navigate(`/organisations/${organisationId}`)}
        onCancel={() => navigate("/organisations")}
      />
    </StaffShell>
  );
}
