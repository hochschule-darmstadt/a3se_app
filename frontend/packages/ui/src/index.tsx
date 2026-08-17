import { createTheme, MantineProvider } from "@mantine/core";
import type { PropsWithChildren } from "react";

const sharedTheme = createTheme({
  primaryColor: "oceanBlue",
  colors: {
    oceanBlue: [
      "#e8f7ff", "#d5edfa", "#aed8ef", "#83c3e5", "#62b1dc",
      "#4da6d8", "#3d9fd7", "#2e8bc0", "#207cad", "#006d98"
    ],
  },
  fontFamily: "Inter, system-ui, sans-serif",
  headings: { fontFamily: "Inter, system-ui, sans-serif" },
  radius: { md: "0.5rem" },
});

/** Provides the shared customer-facing design profile. */
export function CustomerUiProvider({ children }: PropsWithChildren) {
  return <MantineProvider theme={sharedTheme}>{children}</MantineProvider>;
}

/** Provides the compact staff-facing design profile over shared tokens. */
export function StaffUiProvider({ children }: PropsWithChildren) {
  return (
    <MantineProvider defaultColorScheme="light" theme={sharedTheme}>
      {children}
    </MantineProvider>
  );
}
