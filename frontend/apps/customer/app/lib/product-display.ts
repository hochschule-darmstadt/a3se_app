import type { components } from "@cct/api-client";

type ProductResponse = components["schemas"]["ProductResponse"];

/**
 * `ProductResponse` carries no free-text name/title field (the entity model
 * has none, see `docs/architecture/entity-model/terminology.md`); this
 * derives a readable label from the type-specific properties instead of
 * inventing a "name" the backend does not provide.
 */
export function productTitle(product: ProductResponse): string {
  const properties = product.properties as Record<string, unknown>;
  switch (product.type) {
    case "product/flight": {
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
