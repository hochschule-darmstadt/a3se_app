import { Button, Group, SimpleGrid, Stack, Title } from "@mantine/core";
import { Link } from "react-router";

import { CctIcon, ResourceCard } from "@cct/ui";

import { NAV_LINKS, StaffShell } from "../lib/shell";

export function meta() {
  return [{ title: "CCT Staff" }];
}

/**
 * Description text per area, keyed by the {@link NAV_LINKS} route. Matches
 * the reviewed wireframe (docs/requirements/ux/wireframes/staff-wireframes.html
 * #view-s-001, issue #28 phase 1).
 */
const AREA_DESCRIPTIONS: Record<string, string> = {
  "/persons": "Find customer accounts and traveller records.",
  "/products": "Maintain bookable product definitions and versions.",
  "/organisations": "Maintain fulfilment parties and relationships.",
  "/stock-items": "Review availability and allocate or procure capacity.",
  "/orders": "Prepare services, payments, documents and assistance.",
};

/**
 * VIEW-S-001: staff portal home, entry point only. Five tiles link to the
 * five managed-data areas, mirroring the sidebar; no dashboard content
 * (a "work queue" widget was proposed and explicitly deferred in issue #28
 * phase 1 -- no evidenced use case, needs cross-area order/assistance data).
 */
export default function StaffHome() {
  const areaLinks = NAV_LINKS.filter((link) => link.to !== "/");

  return (
    <StaffShell breadcrumbs={[{ label: "Staff Portal Home" }]}>
      <Stack gap="lg">
        <Group gap="xs"><CctIcon.home size={28} aria-hidden /><Title order={1}>CCT Staff Portal</Title></Group>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {areaLinks.map((link) => {
            const Icon = link.icon;
            return (
              <ResourceCard
                key={link.to}
                title={link.label}
                subtitle={AREA_DESCRIPTIONS[link.to]}
                icon={Icon ? <Icon size={24} aria-hidden /> : null}
                action={
                  <Button component={Link} to={link.to} variant="light">
                    Manage
                  </Button>
                }
              />
            );
          })}
        </SimpleGrid>
      </Stack>
    </StaffShell>
  );
}
