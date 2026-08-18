import { createTheme, type MantineThemeOverride } from "@mantine/core";

/**
 * Colour/typography/space tokens transcribed from
 * `docs/requirements/ux/design-system/design-system.md` DS-FND-001..003.
 * Kept as one small map (not a generated design-token pipeline) because the
 * design system is still `status: proposed` -- values are expected to move.
 */
export const designTokens = {
  colour: {
    surfaceCanvas: "#f4f7fb",
    surfacePanel: "#ffffff",
    surfaceSubtle: "#eaf1f8",
    textPrimary: "#17243d",
    textMuted: "#53627a",
    borderDefault: "#c5d0dd",
    actionPrimary: "#d6531b",
    actionPrimaryHover: "#ad3e0f",
    actionSecondary: "#087ea4",
    navigationStrong: "#132642",
    statusInfo: "#087ea4",
    statusSuccess: "#1c7c54",
    statusWarning: "#996300",
    statusDanger: "#b42318",
    focusRing: "#ffbf47",
  },
  radius: { control: "0.5rem", card: "0.75rem" },
} as const;

const sharedColors: MantineThemeOverride["colors"] = {
  actionPrimary: [
    "#fdece3", "#fad3bd", "#f3b18c", "#eb8c58", "#e26f2f",
    "#d6531b", "#c14814", "#ad3e0f", "#94330b", "#7a2807",
  ],
  actionSecondary: [
    "#e2f4fb", "#c3e7f4", "#94d3e9", "#5fbcdc", "#33a7d0",
    "#0f95c5", "#0c86b4", "#087ea4", "#066b8b", "#045670",
  ],
};

const sharedFocus = {
  focusRing: designTokens.colour.focusRing,
};

/** DS-PRO-001: comfortable, expressive, generous spacing, warm primary action. */
export const customerTheme = createTheme({
  primaryColor: "actionPrimary",
  colors: sharedColors,
  fontFamily: "Inter, system-ui, sans-serif",
  headings: { fontFamily: "Inter, system-ui, sans-serif" },
  radius: { md: designTokens.radius.control, lg: designTokens.radius.card },
  defaultRadius: "md",
  spacing: { xs: "0.5rem", sm: "0.75rem", md: "1rem", lg: "1.5rem", xl: "2rem" },
  other: { ...sharedFocus, panelGap: "1.5rem", cardElevation: true },
});

/** DS-PRO-002: compact, restrained, keyboard-efficient, data-dense. */
export const staffTheme = createTheme({
  primaryColor: "actionSecondary",
  colors: sharedColors,
  fontFamily: "Inter, system-ui, sans-serif",
  headings: { fontFamily: "Inter, system-ui, sans-serif" },
  radius: { md: designTokens.radius.control, lg: designTokens.radius.card },
  defaultRadius: "md",
  spacing: { xs: "0.375rem", sm: "0.5rem", md: "0.75rem", lg: "1rem", xl: "1.5rem" },
  other: { ...sharedFocus, panelGap: "0.75rem", cardElevation: false },
});
