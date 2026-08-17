import "@mantine/core/styles.css";

import { CustomerUiProvider } from "@cct/ui";
import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

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

/** Customer application shell; business behavior is added by feature issues. */
export default function CustomerApplication() {
  return (
    <CustomerUiProvider>
      <Outlet />
    </CustomerUiProvider>
  );
}

/** Route-level fallback kept separate from feature-specific error handling. */
export function ErrorBoundary() {
  return <main role="alert">The customer application could not be loaded.</main>;
}
