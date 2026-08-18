import { MantineProvider } from "@mantine/core";
import type { PropsWithChildren } from "react";

import { customerTheme, staffTheme } from "./theme.js";

/** Provides the shared customer-facing design profile (DS-PRO-001). */
export function CustomerUiProvider({ children }: PropsWithChildren) {
  return <MantineProvider theme={customerTheme}>{children}</MantineProvider>;
}

/** Provides the compact staff-facing design profile (DS-PRO-002). */
export function StaffUiProvider({ children }: PropsWithChildren) {
  return (
    <MantineProvider defaultColorScheme="light" theme={staffTheme}>
      {children}
    </MantineProvider>
  );
}

export { designTokens, customerTheme, staffTheme } from "./theme.js";
export { translate, SUPPORTED_LOCALES } from "./i18n.js";
export type { Locale } from "./i18n.js";
export { MockAuthProvider, useMockActor } from "./auth.js";
export type { MockActor } from "./auth.js";
export {
  StatusBanner,
  ApiErrorBanner,
  FormErrorSummary,
  DataTable,
  CursorPager,
  ResourceCard,
  OfferSummary,
  AppShellLayout,
} from "./components.js";
export type { DataTableColumn, ResourceCardProps, OfferSummaryProps, AppShellLayoutProps } from "./components.js";
