import type { ReactNode } from "react";
import { Link, useLocation, useNavigate, useNavigationType } from "react-router";

import { Button } from "@mantine/core";
import { CctIcon, CustomerShell as UiCustomerShell, useMockActor, type BreadcrumbItem } from "@cct/ui";
import { useTravel } from "./travel";

function renderLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link to={to} style={{ color: "var(--mantine-color-blue-7)", fontWeight: 600, textDecoration: "none" }}>{children}</Link>;
}

/**
 * Wraps every Customer route in the shared `CustomerShell` (`@cct/ui`) with
 * the header user-icon menu wired to the PoC `MockAuthProvider` (issue #27):
 * "Guest" links to sign-in when signed out, and the signed-in actor's name
 * with a sign-out action once `useMockActor` has an actor. Neither implies
 * real authentication -- see `@cct/ui`'s `auth.tsx` for that boundary.
 */
export function CustomerShell({ breadcrumbs, children }: { readonly breadcrumbs?: readonly BreadcrumbItem[]; readonly children: ReactNode }) {
  const { actor, signOut } = useMockActor();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const travel = useTravel();

  const userMenu = actor
    ? {
        label: actor.displayName,
        items: [
          { label: "My orders", onSelect: () => navigate("/my-orders") },
          {
            label: "Sign out",
            onSelect: () => {
              travel.clear();
              window.sessionStorage.removeItem("cct.customer.advisor.conversation.v1");
              window.sessionStorage.removeItem("cct.customer.advisor.confirmed-context.v1");
              signOut();
              navigate("/");
            },
          },
        ],
      }
    : {
        label: "Guest · Sign in",
        items: [{
          label: "Sign in",
          onSelect: () => navigate(`/sign-in?${new URLSearchParams({ returnTo: `${location.pathname}${location.search}` }).toString()}`),
        }],
      };

  return (
    <UiCustomerShell breadcrumbs={breadcrumbs} linkComponent={renderLink} userMenu={userMenu}
      historyNavigationKey={location.key} historyAction={navigationType}
      headerAction={<Button component={Link} to="/travel" variant="white" size="compact-sm"
        leftSection={<CctIcon.travel size={16} aria-hidden />}>My travel ({travel.positions.length})</Button>}>
      {children}
    </UiCustomerShell>
  );
}
