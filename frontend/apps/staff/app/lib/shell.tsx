import type { ReactNode } from "react";
import { NavLink, useLocation, useNavigationType } from "react-router";

import { CctIcon, StaffShell as UiStaffShell, type BreadcrumbItem } from "@cct/ui";

/**
 * VIEW-S-001 primary navigation, shared by every route so the nav stays
 * identical everywhere. Labels match the reviewed staff wireframe
 * (docs/requirements/ux/wireframes/staff-wireframes.html, issue #27 phase 1)
 * rather than the underlying route/entity names below -- "Suppliers and
 * partners" over Organisations and "Inventory" over Stock items are an
 * approximate mapping onto entities from #22, not a confirmed rename of
 * those entities themselves. Icons are DS-CMP-011.
 */
export const NAV_LINKS = [
  { label: "Home", to: "/", icon: CctIcon.home },
  { label: "Suppliers and partners", to: "/organisations", icon: CctIcon.supplier },
  { label: "Touristic product catalogue", to: "/products", icon: CctIcon.catalogue },
  { label: "Customers and travellers", to: "/persons", icon: CctIcon.person },
  { label: "Orders", to: "/orders", icon: CctIcon.order },
  { label: "Inventory", to: "/stock-items", icon: CctIcon.inventory },
] as const;

function renderNavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink to={to} end={to === "/"}>
      {children}
    </NavLink>
  );
}

/**
 * Wraps every Staff route in the shared `StaffShell` (`@cct/ui`) with the
 * standing sidebar wired to React Router's `NavLink` (sets `aria-current`
 * on the active area, driving `@cct/ui`'s current-page sidebar styling).
 * The staff user-icon menu is a non-interactive placeholder: no staff login
 * exists yet (issue #27), so it must not imply a real session.
 */
export function StaffShell({ breadcrumbs, children }: { readonly breadcrumbs?: readonly BreadcrumbItem[]; readonly children: ReactNode }) {
  const location = useLocation();
  const navigationType = useNavigationType();

  return (
    <UiStaffShell
      navLinks={NAV_LINKS}
      linkComponent={renderNavLink}
      userMenu={{ label: "User" }}
      historyNavigationKey={location.key}
      historyAction={navigationType}
    >
      {children}
    </UiStaffShell>
  );
}
