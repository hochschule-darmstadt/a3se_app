import { Button, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router";

import { ResourceCard } from "@cct/ui";

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
    <StaffShell>
      <Stack gap="lg">
        <Title order={1}>CCT Staff</Title>
        <Text>Choose a managed-data area to continue.</Text>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {areaLinks.map((link) => (
            <ResourceCard
              key={link.to}
              title={link.label}
              subtitle={AREA_DESCRIPTIONS[link.to]}
              action={
                <Button component={Link} to={link.to} variant="light">
                  Manage
                </Button>
              }
            />
          ))}
        </SimpleGrid>
      </Stack>
    </StaffShell>
  );
}
