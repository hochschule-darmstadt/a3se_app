export type SupplierRoleType =
  | "organisation/airline"
  | "organisation/accommodation"
  | "organisation/mobility"
  | "organisation/water-transport"
  | "organisation/experience"
  | "organisation/protection";

/** The `organisation/*` OrgaRole types entity-model terminology TERM-002 currently defines. `partner/supplier/hotel` was removed as an unused duplicate of `organisation/accommodation` (naming-consistency cleanup); the whole family was later renamed from `partner/supplier/<family>` to `organisation/<family>` for symmetry with `product/<family>/<type>` (DR-0017). No generic non-supplier `partner/partner` type exists yet (WF-Q-012). */
export const SUPPLIER_ROLE_TYPE_OPTIONS: { value: SupplierRoleType; label: string }[] = [
  { value: "organisation/airline", label: "Airline" },
  { value: "organisation/accommodation", label: "Accommodation" },
  { value: "organisation/mobility", label: "Mobility" },
  { value: "organisation/water-transport", label: "Water transport" },
  { value: "organisation/experience", label: "Experience" },
  { value: "organisation/protection", label: "Protection" },
];

export const SUPPLIER_ROLE_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  SUPPLIER_ROLE_TYPE_OPTIONS.map((option) => [option.value, option.label])
);
