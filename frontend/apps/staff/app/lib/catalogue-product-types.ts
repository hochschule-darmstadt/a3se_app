import { propertyDisplayEntries, type PropertyDisplayEntry } from "./property-display";

/** Supported root TouristicProductItem types (entity-model TERM-002). */
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

/** Strips the "product/" prefix for compact selector labels. */
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

export type ProductType = CatalogueRootType;

/** Every creatable type is a supported root product type. */
export const CREATABLE_TYPE_OPTIONS: { value: ProductType; label: string }[] = CATALOGUE_ROOT_TYPE_OPTIONS;

/**
 * Product composition remains available for package products; flight and
 * accommodation capacity is represented by StockItem rather than child products.
 */
export function addableComponentTypeOptions(parentType: string): { value: ProductType; label: string }[] {
  return CATALOGUE_ROOT_TYPE_OPTIONS;
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

/** Narrows the properties union for catalogue lifecycle display. */
export function catalogueProperties(properties: unknown): { name?: string | null; lifecycleStatusCode?: LifecycleStatusCode } {
  return properties as { name?: string | null; lifecycleStatusCode?: LifecycleStatusCode };
}

/** Every property beyond source name and lifecycle, which have dedicated controls/presentation. */
export function productPropertyEntries(properties: unknown, type?: string): PropertyDisplayEntry[] {
  return propertyDisplayEntries(properties, {
    skipKeys: ["name", "lifecycleStatusCode"],
    valueLabels: { roomTypeCode: ROOM_TYPE_LABEL },
    valueFormatters: type === "product/airline/flight"
      ? {
          scheduledDepartureLocalTime: (value) => String(value).slice(0, 5),
          scheduledArrivalLocalTime: (value) => String(value).slice(0, 5),
        }
      : undefined,
    orderKeys: type === "product/airline/flight"
      ? [
          "flightNumber",
          "departureLocationCode",
          "scheduledDepartureLocalTime",
          "arrivalLocationCode",
          "scheduledArrivalLocalTime",
        ]
      : undefined,
  });
}
