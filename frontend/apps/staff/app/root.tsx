import "@mantine/core/styles.css";

import { StaffUiProvider } from "@cct/ui";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { queryClient } from "./api";

export function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-GB">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** Staff application shell; business behavior is added by feature issues. */
export default function StaffApplication() {
  return (
    <StaffUiProvider>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </StaffUiProvider>
  );
}

/** Route-level fallback kept separate from feature-specific error handling. */
export function ErrorBoundary() {
  return <main role="alert">The staff application could not be loaded.</main>;
}
