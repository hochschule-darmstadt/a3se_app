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

/** Sorts type options alphabetically by their displayed label. Every type Select in the app uses a flat, alphabetical list -- no grouping/family separators (stakeholder direction, 2026-08-21). */
export function sortTypeOptionsAlphabetically<T extends { label: string }>(options: T[]): T[] {
  return [...options].sort((a, b) => a.label.localeCompare(b.label));
}

export const CATALOGUE_ROOT_TYPE_OPTIONS: { value: CatalogueRootType; label: string }[] = sortTypeOptionsAlphabetically(
  [
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
  ].map((value) => ({ value: value as CatalogueRootType, label: typeLabel(value) }))
);

export const CATALOGUE_ROOT_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  CATALOGUE_ROOT_TYPE_OPTIONS.map((option) => [option.value, option.label])
);

/** The two structural-child TouristicProductItem types: not creatable as catalogue roots, only as a named parent's component (TERM-004). */
export type StructuralChildType = "product/airline/flight/seat" | "product/accommodation/room-type/room";

export const STRUCTURAL_CHILD_TYPE_OPTIONS: { value: StructuralChildType; label: string }[] = sortTypeOptionsAlphabetically(
  ["product/airline/flight/seat", "product/accommodation/room-type/room"].map((value) => ({
    value: value as StructuralChildType,
    label: typeLabel(value),
  }))
);

/** The one product type each structural-child type must nest under (CONTAINS), enforced server-side in create_product. */
export const STRUCTURAL_CHILD_PARENT_TYPE: Record<StructuralChildType, CatalogueRootType> = {
  "product/airline/flight/seat": "product/airline/flight",
  "product/accommodation/room-type/room": "product/accommodation/room-type",
};

export function isStructuralChildType(type: string): type is StructuralChildType {
  return type in STRUCTURAL_CHILD_PARENT_TYPE;
}

export type ProductType = CatalogueRootType | StructuralChildType;

/** Every creatable type: catalogue roots (optionally link a supplier) plus structural children (require a matching-typed parent). */
export const CREATABLE_TYPE_OPTIONS: { value: ProductType; label: string }[] = sortTypeOptionsAlphabetically([
  ...CATALOGUE_ROOT_TYPE_OPTIONS,
  ...STRUCTURAL_CHILD_TYPE_OPTIONS,
]);

/**
 * The type options addable as a component of `parentType`. A parent type with
 * its own structural-child type (flight -> seat, room-type -> room) accepts
 * only that one specific type -- e.g. a room-type's only addable component is
 * `product/accommodation/room-type/room`, not an arbitrary catalogue-root
 * type. Every other parent type keeps the existing package-bundling
 * behaviour (any catalogue-root type may be nested as a component, WF-Q-004).
 */
export function addableComponentTypeOptions(parentType: string): { value: ProductType; label: string }[] {
  const structuralChild = STRUCTURAL_CHILD_TYPE_OPTIONS.find(
    (option) => STRUCTURAL_CHILD_PARENT_TYPE[option.value] === parentType
  );
  return structuralChild ? [structuralChild] : CATALOGUE_ROOT_TYPE_OPTIONS;
}

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
