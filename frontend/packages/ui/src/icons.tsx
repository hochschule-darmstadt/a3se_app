import { IconBuilding, IconHeadset, IconHome, IconLuggage, IconPackages, IconTicket, IconUser } from "@tabler/icons-react";
import type { ComponentType } from "react";

/**
 * DS-CMP-011 iconography: Tabler Icons (`@tabler/icons-react`), matching
 * Mantine's own stroke-width/corner-radius visual language rather than a
 * hand-authored set. Consumers must render these `aria-hidden` alongside a
 * required visible text label -- the icon is never the sole accessible name.
 */
export const CctIcon = {
  home: IconHome,
  person: IconUser,
  catalogue: IconLuggage,
  supplier: IconBuilding,
  inventory: IconPackages,
  order: IconTicket,
  /** Not yet wired into a route: reserved for VIEW-C-007/S-006 once built. */
  assistance: IconHeadset,
} as const satisfies Record<string, ComponentType<{ size?: number | string; "aria-hidden"?: boolean }>>;

export type CctIconName = keyof typeof CctIcon;
