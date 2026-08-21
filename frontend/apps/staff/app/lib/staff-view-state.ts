export const STAFF_VIEW_PARAM = {
  search: "q",
  type: "type",
  status: "status",
  page: "page",
  detail: "detail",
  panel: "panel",
  fromDate: "from",
  toDate: "to",
} as const;

export type StaffViewParam = (typeof STAFF_VIEW_PARAM)[keyof typeof STAFF_VIEW_PARAM];
export type StaffViewStatePatch = Partial<Record<StaffViewParam, string | number | null>>;

/** Applies the shared staff URL-state contract without mutating the current parameters. */
export function patchStaffViewState(current: URLSearchParams, patch: StaffViewStatePatch): URLSearchParams {
  const next = new URLSearchParams(current);
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === "" || value === 0) next.delete(key);
    else next.set(key, String(value));
  }
  return next;
}

export function staffViewHref(pathname: string, current: URLSearchParams, patch: StaffViewStatePatch): string {
  const query = patchStaffViewState(current, patch).toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function readStaffViewPage(searchParams: URLSearchParams): number {
  const value = Number(searchParams.get(STAFF_VIEW_PARAM.page));
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

export function readStaffViewOption(searchParams: URLSearchParams, key: StaffViewParam, allowed: readonly string[], fallback = "all"): string {
  const value = searchParams.get(key);
  return value && allowed.includes(value) ? value : fallback;
}
