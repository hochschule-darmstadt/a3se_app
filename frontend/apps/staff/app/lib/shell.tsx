import type { ReactNode } from "react";
import { Link } from "react-router";

import { StaffShell as UiStaffShell, type BreadcrumbItem } from "@cct/ui";

/** VIEW-S-001 primary navigation, shared by every route so the nav stays identical everywhere. */
export const NAV_LINKS = [
  { label: "Orders", to: "/orders" },
  { label: "Persons", to: "/persons" },
  { label: "Organisations", to: "/organisations" },
  { label: "Products", to: "/products" },
  { label: "Stock items", to: "/stock-items" },
] as const;

function renderNavLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link to={to}>{children}</Link>;
}

/**
 * Wraps every Staff route in the shared `StaffShell` (`@cct/ui`) with the
 * standing sidebar wired to React Router's `Link`. The staff user-icon menu
 * is a non-interactive placeholder: no staff login exists yet (issue #27),
 * so it must not imply a real session.
 */
export function StaffShell({ breadcrumbs, children }: { readonly breadcrumbs?: readonly BreadcrumbItem[]; readonly children: ReactNode }) {
  return (
    <UiStaffShell
      navLinks={NAV_LINKS}
      breadcrumbs={breadcrumbs}
      linkComponent={renderNavLink}
      userMenu={{ label: "Staff user (mocked)" }}
    >
      {children}
    </UiStaffShell>
  );
}
