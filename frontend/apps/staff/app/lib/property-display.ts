export interface PropertyDisplayEntry {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

/**
 * Humanises a camelCase property key for display, e.g. "departureLocationCode"
 * -> "Departure location". The trailing "Code" is dropped (TERM-002/TERM-004
 * name every coded property that way, e.g. `paymentMethodCode`,
 * `roomTypeCode`) since it's an implementation detail, not part of the label.
 */
function humanizePropertyKey(key: string): string {
  const withoutCodeSuffix = key.endsWith("Code") ? key.slice(0, -"Code".length) : key;
  const spaced = withoutCodeSuffix.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Every property actually present on an entity (Person, Organisation,
 * PersonRole, OrgaRole, TouristicProductItem, ...), beyond whichever keys
 * the caller already surfaces elsewhere (e.g. a title or a status badge) --
 * so a room's `roomNumber`, a flight's `departureLocationCode`, an
 * organisation's `addressLocalityName`, etc. are all visible without
 * opening an edit form (those forms only cover a handful of well-known
 * fields; this covers whatever properties actually exist, on any type,
 * present or future). Used the same way across every staff detail panel so
 * "what does this record actually have" reads consistently everywhere.
 * Properties with no value (`null`, `undefined`, or `""`) are omitted
 * entirely rather than shown as a dash -- an unset optional field is not a
 * fact about the record worth a row of its own.
 */
export function propertyDisplayEntries(
  properties: unknown,
  options: {
    readonly skipKeys?: readonly string[];
    readonly valueLabels?: Readonly<Record<string, Record<string, string>>>;
    readonly valueFormatters?: Readonly<Record<string, (value: unknown) => string>>;
    readonly orderKeys?: readonly string[];
  } = {}
): PropertyDisplayEntry[] {
  const record = (properties ?? {}) as Record<string, unknown>;
  const skip = new Set(options.skipKeys ?? []);
  const order = new Map((options.orderKeys ?? []).map((key, index) => [key, index]));
  return Object.keys(record)
    .filter((key) => !skip.has(key))
    .filter((key) => record[key] !== null && record[key] !== undefined && record[key] !== "")
    .sort((left, right) => {
      const leftOrder = order.get(left);
      const rightOrder = order.get(right);
      if (leftOrder !== undefined || rightOrder !== undefined) {
        return (leftOrder ?? Number.MAX_SAFE_INTEGER) - (rightOrder ?? Number.MAX_SAFE_INTEGER);
      }
      return left.localeCompare(right);
    })
    .map((key) => {
      const raw = record[key];
      const value = options.valueFormatters?.[key]?.(raw) ?? options.valueLabels?.[key]?.[String(raw)] ?? String(raw);
      return { key, label: humanizePropertyKey(key), value };
    });
}
