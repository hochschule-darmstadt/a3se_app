import { toApiError, type ApiClient, type ApiError, type components } from "@cct/api-client";

type StockItemResponse = components["schemas"]["StockItemResponse"];

export type AvailabilityResult =
  | { readonly status: "available"; readonly date: string; readonly stockItem: StockItemResponse }
  | { readonly status: "alternative"; readonly date: string; readonly stockItem: StockItemResponse }
  | { readonly status: "unavailable" };

/** How many days beyond the requested date are tried before giving up (inclusive of the requested date, this is the count of *additional* days). */
export const ALTERNATIVE_DATE_WINDOW_DAYS = 7;

/** `date` (`YYYY-MM-DD`) plus `offsetDays`, computed in UTC to avoid local-timezone drift. */
export function addDays(date: string, offsetDays: number): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  parsed.setUTCDate(parsed.getUTCDate() + offsetDays);
  return parsed.toISOString().slice(0, 10);
}

/** The deterministic seeded stock item id for one unit of `productId` on `date` (DR-0014). */
export function stockItemId(productId: string, date: string): string {
  return `STK-${productId}-${date}-U1`;
}

/** Resolve the real sequential stock ID from the product/date projection. */
export async function findStockItem(apiClient: ApiClient, productId: string, date: string): Promise<StockItemResponse | null> {
  const { data, error, response } = await apiClient.GET("/stock-items", {
    params: { query: { productId, serviceDateFrom: date, serviceDateTo: date, limit: 100 } },
  });
  if (!response.ok || !data) throw toApiError(error, response) as ApiError;
  return data.items.find((item) => item.productId === productId && item.properties.serviceDate === date) ?? null;
}

/** Resolves the actual available dates for a product in the search criteria window. */
export async function findAvailableDates(
  apiClient: ApiClient,
  productId: string,
  serviceDateFrom: string,
  serviceDateTo: string,
): Promise<string[]> {
  const { data, error, response } = await apiClient.GET("/stock-items", {
    params: { query: { productId, serviceDateFrom, serviceDateTo, limit: 100 } },
  });
  if (!response.ok || !data) throw toApiError(error, response) as ApiError;
  return data.items
    .filter((item) => item.productId === productId)
    .map((item) => item.properties.serviceDate)
    .sort();
}

/**
 * The date-specific availability check resolves stock through the API's
 * product/date filters, trying the requested date first and then up to
 * {@link ALTERNATIVE_DATE_WINDOW_DAYS} following days. The frontend never
 * infers a stock ID from product/date values because IDs are immutable opaque
 * references owned by the backend.
 */
export async function checkAvailability(
  apiClient: ApiClient,
  productId: string,
  requestedDate: string
): Promise<AvailabilityResult> {
  for (let offset = 0; offset <= ALTERNATIVE_DATE_WINDOW_DAYS; offset += 1) {
    const date = addDays(requestedDate, offset);
    const data = await findStockItem(apiClient, productId, date);
    if (data) return { status: offset === 0 ? "available" : "alternative", date, stockItem: data };
  }
  return { status: "unavailable" };
}
