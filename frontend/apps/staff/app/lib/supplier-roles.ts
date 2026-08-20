export type SupplierRoleType =
  | "partner/supplier/airline"
  | "partner/supplier/hotel"
  | "partner/supplier/accommodation"
  | "partner/supplier/mobility"
  | "partner/supplier/water-transport"
  | "partner/supplier/experience"
  | "partner/supplier/protection";

/** The `partner/supplier/*` role types entity-model terminology TERM-002 currently defines. No generic non-supplier `partner/partner` type exists yet (WF-Q-012). */
export const SUPPLIER_ROLE_TYPE_OPTIONS: { value: SupplierRoleType; label: string }[] = [
  { value: "partner/supplier/airline", label: "Airline" },
  { value: "partner/supplier/hotel", label: "Hotel" },
  { value: "partner/supplier/accommodation", label: "Accommodation" },
  { value: "partner/supplier/mobility", label: "Mobility" },
  { value: "partner/supplier/water-transport", label: "Water transport" },
  { value: "partner/supplier/experience", label: "Experience" },
  { value: "partner/supplier/protection", label: "Protection" },
];

export const SUPPLIER_ROLE_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  SUPPLIER_ROLE_TYPE_OPTIONS.map((option) => [option.value, option.label])
);
