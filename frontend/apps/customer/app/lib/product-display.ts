import type { components } from "@cct/api-client";

type ProductResponse = components["schemas"]["ProductResponse"];

/** Uses the backend-owned TERM-011 projection so customer and staff titles cannot drift. */
export function productTitle(product: ProductResponse): string {
  return product.displayName;
}

export function productBadge(product: ProductResponse): string {
  const segments = product.type.split("/");
  return capitalize(segments[segments.length - 1] ?? product.type);
}

function capitalize(value: string): string {
  return value.length === 0 ? value : value.charAt(0).toUpperCase() + value.slice(1).replaceAll("-", " ");
}
