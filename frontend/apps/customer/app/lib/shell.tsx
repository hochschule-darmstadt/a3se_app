import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router";

import { CustomerShell as UiCustomerShell, useMockActor, type BreadcrumbItem } from "@cct/ui";

function renderLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link to={to}>{children}</Link>;
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

  const userMenu = actor
    ? {
        label: actor.displayName,
        items: [
          {
            label: "Sign out",
            onSelect: () => {
              signOut();
              navigate("/");
            },
          },
        ],
      }
    : {
        label: "Guest · Sign in",
        items: [{ label: "Sign in", onSelect: () => navigate("/sign-in") }],
      };

  return (
    <UiCustomerShell breadcrumbs={breadcrumbs} linkComponent={renderLink} userMenu={userMenu}>
      {children}
    </UiCustomerShell>
  );
}
