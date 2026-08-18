import "@mantine/core/styles.css";

import { Button, Group } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { CustomerUiProvider, MockAuthProvider, SUPPORTED_LOCALES, type Locale } from "@cct/ui";
import { type ReactNode, useMemo, useState } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { queryClient } from "./api";
import { LocaleContext, useLocale, useT } from "./i18n";

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

/**
 * Persistent, always-visible locale toggle (FR-002 structural-readiness
 * evidence, DR-0015): cycles the app between `en-GB` (authored British
 * English) and the generated `en-XP` pseudo-locale, proving no route
 * hard-codes English strings into layout.
 */
function LocaleBar() {
  const { locale, setLocale } = useLocale();
  const t = useT();
  const nextLocale: Locale = locale === "en-GB" ? "en-XP" : "en-GB";
  return (
    <Group justify="flex-end" p="xs" component="div">
      <Button
        variant="subtle"
        size="compact-sm"
        onClick={() => setLocale(nextLocale)}
        aria-label={t("locale.toggle")}
      >
        {locale === "en-GB" ? t("locale.toggle.en-XP") : t("locale.toggle.en-GB")}
      </Button>
    </Group>
  );
}

/** Customer application shell; business behavior is added by feature issues. */
export default function CustomerApplication() {
  const [locale, setLocale] = useState<Locale>(SUPPORTED_LOCALES[0] ?? "en-GB");
  const localeValue = useMemo(() => ({ locale, setLocale }), [locale]);

  return (
    <QueryClientProvider client={queryClient}>
      <CustomerUiProvider>
        <MockAuthProvider>
          <LocaleContext.Provider value={localeValue}>
            <LocaleBar />
            <Outlet />
          </LocaleContext.Provider>
        </MockAuthProvider>
      </CustomerUiProvider>
    </QueryClientProvider>
  );
}

/** Route-level fallback kept separate from feature-specific error handling. */
export function ErrorBoundary() {
  return <main role="alert">The customer application could not be loaded.</main>;
}
