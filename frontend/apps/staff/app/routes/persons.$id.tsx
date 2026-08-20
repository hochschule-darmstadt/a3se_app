import { useParams } from "react-router";

import { useApiQuery } from "@cct/api-client";
import { StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { PersonDetailPanel } from "../lib/person-detail-panel";
import { StaffShell } from "../lib/shell";

export function meta() {
  return [{ title: "Person detail — CCT Staff" }];
}

/**
 * Standalone direct-link route for one person (e.g. linked from an order's
 * traveller column). The persons list (`persons.tsx`) shows the same
 * `PersonDetailPanel` inline as a master-detail right pane instead of
 * navigating here, per stakeholder review of the #29 phase 2 build.
 */
export default function PersonDetailRoute() {
  const { personId } = useParams();

  const personQuery = useApiQuery(
    ["persons", personId],
    () => apiClient.GET("/persons/{person_id}", { params: { path: { person_id: personId as string } } }),
    { enabled: Boolean(personId) }
  );

  if (!personId) {
    return (
      <StaffShell breadcrumbs={[{ label: "Customers and travellers", to: "/persons" }, { label: "Person detail" }]}>
        <StatusBanner kind="error" title="No person specified" />
      </StaffShell>
    );
  }

  const label = personQuery.data
    ? `${personQuery.data.properties.givenName} ${personQuery.data.properties.familyName}`
    : "Person detail";

  return (
    <StaffShell breadcrumbs={[{ label: "Customers and travellers", to: "/persons" }, { label }]}>
      <PersonDetailPanel personId={personId} />
    </StaffShell>
  );
}
