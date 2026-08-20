import { useNavigate } from "react-router";

import { PersonCreatePanel } from "../lib/person-create-panel";
import { StaffShell } from "../lib/shell";

export function meta() {
  return [{ title: "Create person — CCT Staff" }];
}

/**
 * Standalone direct-link create route. The persons list (`persons.tsx`)
 * shows the same `PersonCreatePanel` inline as the right pane's create mode
 * instead of navigating here, per stakeholder review of the #29 phase 2
 * build.
 */
export default function PersonCreateRoute() {
  const navigate = useNavigate();

  return (
    <StaffShell breadcrumbs={[{ label: "Customers and travellers", to: "/persons" }, { label: "Create person" }]}>
      <PersonCreatePanel
        onCreated={(personId) => navigate(`/persons/${personId}`)}
        onCancel={() => navigate("/persons")}
      />
    </StaffShell>
  );
}
