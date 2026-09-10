/** Returns the ISO date one day after the supplied ISO date. */
export function nextDay(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

/** Applies the customer portal's from-date behaviour to a staff date range. */
export function dateRangeFromChange(from: string): { from: string; to: string } {
  return { from, to: from ? nextDay(from) : "" };
}
