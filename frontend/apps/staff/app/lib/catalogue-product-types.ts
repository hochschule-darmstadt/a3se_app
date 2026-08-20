import { propertyDisplayEntries, type PropertyDisplayEntry } from "./property-display";

/** Catalogue-root TouristicProductItem types (entity-model TERM-002). Excludes product/airline/flight/seat and product/accommodation/room-type/room, which are structural children shown only under their parent's component tree, not created directly from the catalogue list. */
export type CatalogueRootType =
  | "product/airline/flight"
  | "product/accommodation/room-type"
  | "product/mobility/transfer"
  | "product/mobility/rail"
  | "product/mobility/coach"
  | "product/mobility/vehicle-rental"
  | "product/water-transport/day-boat"
  | "product/water-transport/cruise"
  | "product/experience/guided-tour"
  | "product/experience/activity"
  | "product/protection/travel";

/** Strips the "product/" prefix so a type identifier reads as its own namespaced-path label (e.g. "airline/flight", "accommodation/room"), matching every family/subtype consistently -- no "hotel" vs "accommodation" or "flight" vs "airline/flight" mismatch. Works for any type, including structural children (product/airline/flight/seat, product/accommodation/room-type/room) not in the catalogue-root list below. */
export function typeLabel(type: string): string {
  return type.startsWith("product/") ? type.slice("product/".length) : type;
}

/** The family (first path segment) a type belongs to, e.g. "airline" for "product/airline/flight". */
export function typeFamily(type: string): string {
  return typeLabel(type).split("/")[0] ?? type;
}

export const CATALOGUE_ROOT_TYPE_OPTIONS: { value: CatalogueRootType; label: string }[] = [
  "product/airline/flight",
  "product/accommodation/room-type",
  "product/mobility/transfer",
  "product/mobility/rail",
  "product/mobility/coach",
  "product/mobility/vehicle-rental",
  "product/water-transport/day-boat",
  "product/water-transport/cruise",
  "product/experience/guided-tour",
  "product/experience/activity",
  "product/protection/travel",
].map((value) => ({ value: value as CatalogueRootType, label: typeLabel(value) }));

export const CATALOGUE_ROOT_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  CATALOGUE_ROOT_TYPE_OPTIONS.map((option) => [option.value, option.label])
);

/** The same options grouped by family, for a Select that reads as a hierarchy rather than a flat list. */
export function groupTypeOptions<T extends { value: string; label: string }>(options: T[]): { group: string; items: T[] }[] {
  const groups = new Map<string, T[]>();
  for (const option of options) {
    const group = typeFamily(option.value);
    const items = groups.get(group) ?? [];
    items.push(option);
    groups.set(group, items);
  }
  return Array.from(groups.entries()).map(([group, items]) => ({ group, items }));
}

export const CATALOGUE_ROOT_TYPE_GROUPED_OPTIONS = groupTypeOptions(CATALOGUE_ROOT_TYPE_OPTIONS);

export const ROOM_CATEGORY_TYPE: CatalogueRootType = "product/accommodation/room-type";

export function isAirlineFlightType(type: string): type is "product/airline/flight" {
  return type === "product/airline/flight";
}

export function isRoomCategoryType(type: string): boolean {
  return type === ROOM_CATEGORY_TYPE;
}

export type RoomTypeCode =
  | "room/single"
  | "room/double"
  | "room/twin"
  | "room/triple"
  | "room/family"
  | "room/adjoining"
  | "room/suite"
  | "room/cabin";

export const ROOM_TYPE_OPTIONS: { value: RoomTypeCode; label: string }[] = [
  { value: "room/single", label: "Single" },
  { value: "room/double", label: "Double" },
  { value: "room/twin", label: "Twin" },
  { value: "room/triple", label: "Triple" },
  { value: "room/family", label: "Family" },
  { value: "room/adjoining", label: "Adjoining" },
  { value: "room/suite", label: "Suite" },
  { value: "room/cabin", label: "Cabin" },
];

export const ROOM_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  ROOM_TYPE_OPTIONS.map((option) => [option.value, option.label])
);

export type LifecycleStatusCode = "product/draft" | "product/active" | "product/retired";

export const LIFECYCLE_STATUS_OPTIONS: { value: LifecycleStatusCode; label: string }[] = [
  { value: "product/draft", label: "Draft" },
  { value: "product/active", label: "Active" },
  { value: "product/retired", label: "Retired" },
];

export const LIFECYCLE_STATUS_LABEL: Record<string, string> = Object.fromEntries(
  LIFECYCLE_STATUS_OPTIONS.map((option) => [option.value, option.label])
);

/** Narrows the properties union (which includes structural-child shapes without displayName/lifecycleStatusCode) for catalogue-root display. */
export function catalogueProperties(properties: unknown): { displayName?: string | null; lifecycleStatusCode?: LifecycleStatusCode } {
  return properties as { displayName?: string | null; lifecycleStatusCode?: LifecycleStatusCode };
}

/** Best-effort catalogue label: displayName (WF-Q-013) if set, else the type's own namespaced-path label plus the entityId. */
export function productDisplayLabel(entityId: string, type: string, displayName?: string | null): string {
  if (displayName) return displayName;
  return `${typeLabel(type)} (${entityId})`;
}

/** Every property on a product beyond the ones the detail view already shows as its title/badge (`displayName`, `lifecycleStatusCode`); see `propertyDisplayEntries`. */
export function productPropertyEntries(properties: unknown): PropertyDisplayEntry[] {
  return propertyDisplayEntries(properties, {
    skipKeys: ["displayName", "lifecycleStatusCode"],
    valueLabels: { roomTypeCode: ROOM_TYPE_LABEL },
  });
}
