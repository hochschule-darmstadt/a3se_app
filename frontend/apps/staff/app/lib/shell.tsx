import type { ReactNode } from "react";
import { Link } from "react-router";

import { AppShellLayout } from "@cct/ui";

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

/** Wraps every Staff route in the shared `AppShellLayout` with the standing nav wired to React Router's `Link`. */
export function StaffShell({ title, children }: { readonly title: string; readonly children: ReactNode }) {
  return (
    <AppShellLayout title={title} navLinks={NAV_LINKS} linkComponent={renderNavLink}>
      {children}
    </AppShellLayout>
  );
}
