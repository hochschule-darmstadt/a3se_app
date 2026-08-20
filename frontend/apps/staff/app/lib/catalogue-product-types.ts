/** Catalogue-root TouristicProductItem types (entity-model TERM-002). Excludes product/flight/seat and product/hotel/room, which are structural children shown only under their parent's component tree, not created directly from the catalogue list. */
export type CatalogueRootType =
  | "product/flight"
  | "product/hotel/room-category"
  | "product/accommodation/room-category"
  | "product/mobility/transfer"
  | "product/mobility/rail"
  | "product/mobility/coach"
  | "product/mobility/vehicle-rental"
  | "product/water/day-boat"
  | "product/water/cruise"
  | "product/experience/guided-tour"
  | "product/experience/activity"
  | "product/protection/travel";

export const CATALOGUE_ROOT_TYPE_OPTIONS: { value: CatalogueRootType; label: string }[] = [
  { value: "product/flight", label: "Flight" },
  { value: "product/hotel/room-category", label: "Hotel room category" },
  { value: "product/accommodation/room-category", label: "Accommodation room category" },
  { value: "product/mobility/transfer", label: "Mobility transfer" },
  { value: "product/mobility/rail", label: "Mobility rail" },
  { value: "product/mobility/coach", label: "Mobility coach" },
  { value: "product/mobility/vehicle-rental", label: "Vehicle rental" },
  { value: "product/water/day-boat", label: "Water day-boat" },
  { value: "product/water/cruise", label: "Water cruise" },
  { value: "product/experience/guided-tour", label: "Guided tour" },
  { value: "product/experience/activity", label: "Activity" },
  { value: "product/protection/travel", label: "Travel protection" },
];

export const CATALOGUE_ROOT_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  CATALOGUE_ROOT_TYPE_OPTIONS.map((option) => [option.value, option.label])
);

export const ROOM_CATEGORY_TYPES: readonly CatalogueRootType[] = [
  "product/hotel/room-category",
  "product/accommodation/room-category",
];

export function isFlightType(type: string): type is "product/flight" {
  return type === "product/flight";
}

export function isRoomCategoryType(type: string): boolean {
  return (ROOM_CATEGORY_TYPES as readonly string[]).includes(type);
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

/** Best-effort catalogue label: displayName (WF-Q-013) if set, else a type-derived fallback plus the entityId. */
export function productDisplayLabel(entityId: string, type: string, displayName?: string | null): string {
  if (displayName) return displayName;
  return `${CATALOGUE_ROOT_TYPE_LABEL[type] ?? type} (${entityId})`;
}
