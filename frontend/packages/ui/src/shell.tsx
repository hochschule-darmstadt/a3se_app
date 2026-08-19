import { AppShell, Badge, Breadcrumbs, Burger, Button, Group, Menu, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type ReactNode, useState } from "react";

/**
 * DS-CMP-001 / WF-012 shared shell chrome: two profile shells (`CustomerShell`,
 * `StaffShell`) composed from the same small primitives (logo, breadcrumbs,
 * user-icon menu) rather than one shell with conditional structure, because
 * the profiles differ structurally -- staff has a sidebar and no footer,
 * customer has no sidebar and has a footer.
 */

export interface BreadcrumbItem {
  readonly label: string;
  readonly to?: string;
}

/** Lets the UI package stay router-agnostic: callers inject their framework's `Link`. */
export type ShellLinkComponent = (props: { to: string; children: ReactNode }) => ReactNode;

export interface ShellUserMenuItem {
  readonly label: string;
  readonly onSelect: () => void;
}

export interface ShellUserMenuProps {
  /** Visible, accessible label for the trigger, e.g. "Casey Example" or "Staff user (mocked)". */
  readonly label: string;
  /** Omit or pass an empty list for a non-interactive placeholder (e.g. staff, until login exists). */
  readonly items?: readonly ShellUserMenuItem[];
}

const MAIN_CONTENT_ID = "shell-main-content";

/** Visible-on-focus skip link (DS-FND-004): off-screen until it receives keyboard focus. */
function SkipLink() {
  const [focused, setFocused] = useState(false);
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={
        focused
          ? { position: "fixed", top: 8, left: 8, zIndex: 1000, background: "#fff", padding: "0.75rem 1rem", border: "2px solid #000" }
          : { position: "absolute", left: -9999, top: "auto", width: 1, height: 1, overflow: "hidden" }
      }
    >
      Skip to main content
    </a>
  );
}

/** Text-only placeholder mark: the final CCT logo asset (issue #24) is integrated in a later, separate change. */
function ShellLogo() {
  return (
    <Badge variant="outline" size="lg" radius="sm" aria-hidden="true">
      CCT
    </Badge>
  );
}

function ShellBreadcrumbs({ items, linkComponent: Link }: { items: readonly BreadcrumbItem[]; linkComponent: ShellLinkComponent }) {
  if (items.length === 0) return null;
  return (
    <Breadcrumbs component="nav" aria-label="Breadcrumb" mb="md">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast || !item.to) {
          return (
            <Text key={item.label} fw={isLast ? 700 : undefined} aria-current={isLast ? "page" : undefined}>
              {item.label}
            </Text>
          );
        }
        return <span key={item.label}>{Link({ to: item.to, children: item.label })}</span>;
      })}
    </Breadcrumbs>
  );
}

function ShellUserMenu({ label, items }: ShellUserMenuProps) {
  if (!items || items.length === 0) {
    return (
      <Text size="sm" fw={500}>
        {label}
      </Text>
    );
  }
  return (
    <Menu position="bottom-end" withArrow>
      <Menu.Target>
        <Button variant="subtle" size="compact-sm">
          {label}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {items.map((item) => (
          <Menu.Item key={item.label} onClick={item.onSelect}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

export interface CustomerShellProps {
  readonly breadcrumbs?: readonly BreadcrumbItem[];
  readonly linkComponent: ShellLinkComponent;
  readonly userMenu: ShellUserMenuProps;
  /** Composition point for the persistent AI travel advisor rail (DS-CMP-009); not populated by this shell. */
  readonly advisorRail?: ReactNode;
  readonly children: ReactNode;
}

/** DS-CMP-001 customer profile: header + footer, no sidebar; reserves advisor context in an `aside` landmark. */
export function CustomerShell({ breadcrumbs = [], linkComponent, userMenu, advisorRail, children }: CustomerShellProps) {
  return (
    <AppShell
      header={{ height: 64 }}
      footer={{ height: "auto" }}
      aside={advisorRail ? { width: 340, breakpoint: "md" } : undefined}
      padding="md"
    >
      <SkipLink />
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <ShellLogo />
            <Text fw={700}>Christopher Columbus Travel</Text>
          </Group>
          <ShellUserMenu {...userMenu} />
        </Group>
      </AppShell.Header>
      <AppShell.Main id={MAIN_CONTENT_ID}>
        <ShellBreadcrumbs items={breadcrumbs} linkComponent={linkComponent} />
        {children}
      </AppShell.Main>
      {advisorRail ? (
        <AppShell.Aside p="md" aria-label="Persistent AI travel advisor">
          {advisorRail}
        </AppShell.Aside>
      ) : null}
      <AppShell.Footer p="md">
        <Stack gap={4}>
          <Group gap="lg" component="nav" aria-label="Legal">
            <Text size="sm">Imprint (placeholder)</Text>
            <Text size="sm">Privacy notice (placeholder)</Text>
            <Text size="sm">Terms and conditions (placeholder)</Text>
          </Group>
          <Text size="xs" c="dimmed">
            CCT is a fictitious company created for this project; imprint and legal content are placeholders pending
            stakeholder/legal review, not real legal text.
          </Text>
        </Stack>
      </AppShell.Footer>
    </AppShell>
  );
}

export interface StaffShellNavLink {
  readonly label: string;
  readonly to: string;
}

export interface StaffShellProps {
  readonly navLinks: readonly StaffShellNavLink[];
  readonly breadcrumbs?: readonly BreadcrumbItem[];
  readonly linkComponent: ShellLinkComponent;
  readonly userMenu: ShellUserMenuProps;
  readonly children: ReactNode;
}

/** DS-CMP-001 staff profile: header + persistent sidebar, no footer. */
export function StaffShell({ navLinks, breadcrumbs = [], linkComponent, userMenu, children }: StaffShellProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell header={{ height: 64 }} navbar={{ width: 220, breakpoint: "sm", collapsed: { mobile: !opened } }} padding="md">
      <SkipLink />
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label="Toggle staff areas navigation"
              aria-expanded={opened}
            />
            <ShellLogo />
            <Text fw={700}>CCT Staff</Text>
          </Group>
          <ShellUserMenu {...userMenu} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm" aria-label="Staff areas">
        <Stack gap={4}>
          {navLinks.map((link) => (
            <div key={link.to}>{linkComponent({ to: link.to, children: link.label })}</div>
          ))}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main id={MAIN_CONTENT_ID}>
        <ShellBreadcrumbs items={breadcrumbs} linkComponent={linkComponent} />
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
