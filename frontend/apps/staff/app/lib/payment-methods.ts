export type PaymentMethodCode =
  | "payment/paypal"
  | "payment/credit-card"
  | "payment/sepa-direct-debit"
  | "payment/bank-transfer"
  | "payment/invoice";

/** The five `paymentMethodCode` categories Person Management currently permits (entity-model terminology TERM-003). */
export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethodCode; label: string }[] = [
  { value: "payment/paypal", label: "PayPal" },
  { value: "payment/credit-card", label: "Credit card" },
  { value: "payment/sepa-direct-debit", label: "SEPA direct debit" },
  { value: "payment/bank-transfer", label: "Bank transfer" },
  { value: "payment/invoice", label: "Invoice" },
];

export const PAYMENT_METHOD_LABEL: Record<string, string> = Object.fromEntries(
  PAYMENT_METHOD_OPTIONS.map((option) => [option.value, option.label])
);
