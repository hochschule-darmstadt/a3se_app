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

/**
 * The frontend workaround for the missing `/stock-items` filter (DR-0015):
 * constructs the deterministic stock item id per candidate date and probes
 * `GET /stock-items/{id}` directly, trying the requested date first and then
 * up to {@link ALTERNATIVE_DATE_WINDOW_DAYS} following days. A 404 on a
 * candidate date means "no stock that day" and moves to the next candidate;
 * any other failure is a genuine error and is thrown, never silently
 * swallowed as "unavailable".
 */
export async function checkAvailability(
  apiClient: ApiClient,
  productId: string,
  requestedDate: string
): Promise<AvailabilityResult> {
  for (let offset = 0; offset <= ALTERNATIVE_DATE_WINDOW_DAYS; offset += 1) {
    const date = addDays(requestedDate, offset);
    const id = stockItemId(productId, date);
    const { data, error, response } = await apiClient.GET("/stock-items/{stock_item_id}", {
      params: { path: { stock_item_id: id } },
    });
    if (response.ok && data) {
      return { status: offset === 0 ? "available" : "alternative", date, stockItem: data };
    }
    if (response.status !== 404) {
      throw toApiError(error, response) as ApiError;
    }
  }
  return { status: "unavailable" };
}
