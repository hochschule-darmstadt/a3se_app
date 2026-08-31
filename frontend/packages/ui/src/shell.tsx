import { AppShell, Burger, Button, Group, Menu, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type ComponentType, type ReactNode, useState } from "react";

import cctWordmarkDark from "./assets/cct-wordmark-dark.svg";
import { CctIcon } from "./icons.js";
import { designTokens } from "./theme.js";

type IconComponent = ComponentType<{ size?: number | string; "aria-hidden"?: boolean }>;

/**
 * DS-CMP-001 / WF-012 shared shell chrome: two profile shells (`CustomerShell`,
 * `StaffShell`) composed from the same small primitives (logo,
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
const NAV_BACKGROUND = designTokens.colour.navigationStrong;

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

function ShellBreadcrumbs({ items, linkComponent: Link }: { items: readonly BreadcrumbItem[]; linkComponent: ShellLinkComponent }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: "var(--mantine-spacing-md)" }}>
      <Group gap={4}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Group key={item.label} gap={4} wrap="nowrap">
              {index > 0 ? (
                <Text c="dimmed" aria-hidden="true">
                  /
                </Text>
              ) : null}
              {isLast || !item.to ? (
                <Text fw={isLast ? 700 : undefined} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </Text>
              ) : (
                Link({ to: item.to, children: item.label })
              )}
            </Group>
          );
        })}
      </Group>
    </nav>
  );
}

function ShellUserMenu({ label, items }: ShellUserMenuProps) {
  if (!items || items.length === 0) {
    return (
      <Group gap={6} wrap="nowrap">
        <CctIcon.person size={18} color="white" aria-hidden />
        <Text size="sm" fw={500} c="white">
          {label}
        </Text>
      </Group>
    );
  }
  return (
    <Menu position="bottom-end" withArrow>
      <Menu.Target>
        <Button variant="white" size="compact-sm" leftSection={<CctIcon.person size={16} aria-hidden />}>
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
      header={{ height: 72 }}
      footer={{ height: "auto" }}
      aside={advisorRail ? { width: 340, breakpoint: "md" } : undefined}
      padding="md"
      styles={{ main: { backgroundColor: designTokens.colour.surfaceCanvas } }}
    >
      <SkipLink />
      <AppShell.Header style={{ backgroundColor: NAV_BACKGROUND, border: 0 }}>
        <Group h="100%" px="md" justify="space-between">
          <img src={cctWordmarkDark} alt="Christopher Columbus Travel" height={34} />
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
  readonly icon?: IconComponent;
}

export interface StaffShellProps {
  readonly navLinks: readonly StaffShellNavLink[];
  readonly linkComponent: ShellLinkComponent;
  readonly userMenu: ShellUserMenuProps;
  readonly children: ReactNode;
}

/**
 * `.cct-shell-navlink` styling mirrors the reviewed staff wireframe's sidebar
 * (`docs/requirements/ux/wireframes/wireframes.css` `.shell-sidebar a`):
 * padded targets, a visible hover/focus treatment, and a distinct
 * current-page state driven by the `aria-current="page"` the caller's router
 * `NavLink` sets -- not by colour alone (weight changes too, DS-FND-001).
 */
const NAV_LINK_STYLES = `
  .cct-shell-navlink a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: var(--mantine-radius-md);
    color: #fff;
    text-decoration: none;
  }
  .cct-shell-navlink a:hover,
  .cct-shell-navlink a:focus-visible {
    background: rgba(255, 255, 255, 0.14);
  }
  .cct-shell-navlink a[aria-current="page"] {
    background: rgba(255, 255, 255, 0.22);
    font-weight: 700;
  }
`;

/** DS-CMP-001 staff profile: header + persistent sidebar, no footer. */
export function StaffShell({ navLinks, linkComponent, userMenu, children }: StaffShellProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 72 }}
      navbar={{ width: 220, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
      styles={{ main: { backgroundColor: designTokens.colour.surfaceCanvas } }}
    >
      <style>{NAV_LINK_STYLES}</style>
      <SkipLink />
      <AppShell.Header style={{ backgroundColor: NAV_BACKGROUND, border: 0 }}>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              color="white"
              aria-label="Toggle staff areas navigation"
              aria-expanded={opened}
            />
            <img src={cctWordmarkDark} alt="Christopher Columbus Travel" height={34} />
            <Text fw={700} c="white">
              Staff Portal
            </Text>
          </Group>
          <ShellUserMenu {...userMenu} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm" aria-label="Staff areas" style={{ backgroundColor: NAV_BACKGROUND, border: 0 }}>
        <Stack gap={4} className="cct-shell-navlink">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <div key={link.to}>
                {linkComponent({
                  to: link.to,
                  children: (
                    <>
                      {Icon ? <Icon size={18} aria-hidden /> : null}
                      <span>{link.label}</span>
                    </>
                  ),
                })}
              </div>
            );
          })}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main id={MAIN_CONTENT_ID}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
