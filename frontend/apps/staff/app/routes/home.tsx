import { List, ListItem, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router";

import { NAV_LINKS, StaffShell } from "../lib/shell";

export function meta() {
  return [{ title: "CCT Staff" }];
}

/** VIEW-S-001: staff navigation shell linking to every implemented staff area. */
export default function StaffHome() {
  return (
    <StaffShell title="CCT Staff">
      <Stack gap="sm">
        <Title order={1}>CCT Staff</Title>
        <Text>Staff Interaction — orders, persons, organisations, products and stock items.</Text>
        <List>
          {NAV_LINKS.map((link) => (
            <ListItem key={link.to}>
              <Link to={link.to}>{link.label}</Link>
            </ListItem>
          ))}
        </List>
      </Stack>
    </StaffShell>
  );
}
