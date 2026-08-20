import type { components } from "@cct/api-client";

type ProductResponse = components["schemas"]["ProductResponse"];

/**
 * Catalogue-root types carry an optional `displayName` (WF-Q-013,
 * entity-model terminology TERM-004) set by staff in VIEW-S-003; prefer it
 * so the customer portal and staff catalogue never show different titles
 * for the same product. Falls back to a type-specific derivation for
 * products without one, or for structural children (seats, rooms) that
 * have no `displayName` field at all.
 */
export function productTitle(product: ProductResponse): string {
  const properties = product.properties as Record<string, unknown>;
  const displayName = properties.displayName as string | null | undefined;
  if (displayName) return displayName;
  switch (product.type) {
    case "product/airline/flight": {
      const flightNumber = properties.flightNumber as string | undefined;
      const departure = properties.departureLocationCode as string | undefined;
      const arrival = properties.arrivalLocationCode as string | undefined;
      if (flightNumber && departure && arrival) {
        return `Flight ${flightNumber}: ${departure} → ${arrival}`;
      }
      return `Flight ${product.entityId}`;
    }
    case "product/accommodation/room-category": {
      const roomTypeCode = properties.roomTypeCode as string | undefined;
      const roomType = roomTypeCode?.replace("room/", "") ?? "room";
      return `${capitalize(roomType)} room`;
    }
    default:
      return humanizeType(product.type);
  }
}

export function productBadge(product: ProductResponse): string {
  const segments = product.type.split("/");
  return capitalize(segments[segments.length - 1] ?? product.type);
}

function humanizeType(type: string): string {
  return type
    .split("/")
    .map(capitalize)
    .join(" – ");
}

function capitalize(value: string): string {
  return value.length === 0 ? value : value.charAt(0).toUpperCase() + value.slice(1).replaceAll("-", " ");
}
