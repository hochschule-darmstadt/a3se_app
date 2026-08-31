import { createContext, useContext } from "react";

import { translate, type Locale } from "@cct/ui";

/**
 * FR-002 language-extensibility demonstration (DR-0015): every user-facing
 * string in the Customer app is keyed here in British English (FR-001, the
 * base dictionary) and looked up through `translate()`, never hard-coded
 * inline, so the shared `en-XP` pseudo-locale can prove structural
 * readiness without asserting an unapproved second real language.
 */
export const dictionary: Record<string, string> = {
  "app.title": "Christopher Columbus Travel",
  "nav.home": "Home",
  "nav.search": "Search results",
  "locale.toggle": "Pseudo-locale preview",
  "locale.toggle.en-GB": "Show English (UK)",
  "locale.toggle.en-XP": "Show pseudo-locale",

  "home.heading": "Where would you like to go?",
  "home.intro": "Tell us your travel criteria and browse the seeded catalogue.",
  "home.origin.label": "Origin",
  "home.origin.placeholder": "e.g. Berlin",
  "home.destination.label": "Destination or region",
  "home.destination.placeholder": "e.g. Peru",
  "home.date.label": "Outbound date",
  "home.travellers.label": "Number of travellers",
  "home.submit": "Search the catalogue",
  "home.error.origin": "Enter an origin.",
  "home.error.destination": "Enter a destination or region.",
  "home.error.date": "Enter a valid outbound date.",
  "home.error.travellers": "Enter at least 1 traveller.",

  "results.heading": "Search results",
  "results.criteria.heading": "Your criteria",
  "results.criteria.note":
    "These criteria are shown for context only. The current catalogue API has no filter/search parameters (DR-0015), so every seeded product is listed below, not just ones matching your criteria.",
  "results.criteria.origin": "Origin",
  "results.criteria.destination": "Destination",
  "results.criteria.date": "Outbound date",
  "results.criteria.travellers": "Travellers",
  "results.loading": "Loading the product catalogueâ€¦",
  "results.empty": "No products are in the catalogue.",
  "results.error.title": "Could not load the catalogue",
  "results.viewDetail": "View details",
  "results.revise": "Revise criteria",

  "detail.heading": "Travel product",
  "detail.loading": "Loading product detailsâ€¦",
  "detail.error.title": "Could not load this product",
  "detail.back": "Back to results",
  "detail.requestedDate": "Requested date",
  "detail.checkingAvailability": "Checking availability for {date}â€¦",
  "detail.available": "Available on {date}",
  "detail.available.price": "Price",
  "detail.unavailable": "Not available on {date}",
  "detail.unavailable.description":
    "No stock exists for this product on the requested date.",
  "detail.alternative.found": "An alternative date is available: {date}.",
  "detail.alternative.select": "Use {date} instead",
  "detail.alternative.none":
    "No availability was found in the next 7 days either.",
  "detail.select": "Select this option",
  "detail.components.heading": "Included components",

  "compose.heading": "Compose your travel",
  "compose.summary.product": "Product",
  "compose.summary.date": "Date",
  "compose.travellers.label": "Party size",
  "compose.travellers.note":
    "This thin slice assigns the single seeded demonstration traveller role (PER-000001-TRAVELLER) to the order regardless of party size; additional travellers are captured for display only and are not yet individually modelled.",
  "compose.continue": "Continue to sign in",

  "signIn.heading": "Sign in",
  "signIn.notice":
    "Prototype placeholder: this is a mock identity for demonstration only, not real authentication. No credential is checked and no token is issued.",
  "signIn.displayName.label": "Display name",
  "signIn.error.displayName": "Enter a display name.",
  "signIn.submit": "Sign in",
  "signIn.register.submit": "Register and continue",
  "signIn.toggle.toRegister": "New customer? Register instead",
  "signIn.toggle.toSignIn": "Already have an identity? Sign in instead",
  "signIn.context": "Continuing your booking for {product} on {date}.",

  "offer.heading": "Your offer",
  "offer.status.draft": "Draft",
  "offer.position.label": "Selected product",
  "offer.total": "Total",
  "offer.pendingNote":
    "This offer is not yet a confirmed order. Submit it to create a real order.",
  "offer.submit": "Submit order",
  "offer.submitting": "Submittingâ€¦",

  "order.heading": "Order",
  "order.submitting": "Submitting your orderâ€¦",
  "order.success.title": "Order confirmed",
  "order.success.id.label": "Order ID",
  "order.success.number.label": "Order number",
  "order.success.description":
    "Keep this order ID; staff can look up your order in the Staff Interaction order list using it.",
  "order.error.conflict.title": "This stock item was just taken",
  "order.error.conflict.description":
    "Someone else may have booked the same stock in the meantime. Go back and choose another date or product.",
  "order.error.validation.title": "The order could not be validated",
  "order.error.retryable.title": "A temporary problem occurred",
  "order.retry": "Retry submission",
  "order.backToOffer": "Back to offer",
};

export const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>({ locale: "en-GB", setLocale: () => {} });

export function useLocale() {
  return useContext(LocaleContext);
}

/** Simple `{placeholder}` interpolation, exported for callers building a message from an already-translated string. */
export function format(text: string, values: Record<string, string>): string {
  return interpolate(text, values);
}

function interpolate(text: string, values?: Record<string, string>): string {
  if (!values) return text;
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
    text
  );
}

/**
 * Shorthand hook: `t("key")` or `t("key", { placeholder: "value" })`
 * translated into the app's current locale. Interpolation happens *before*
 * `en-XP` pseudo-localization is applied (via a one-entry lookup through the
 * shared `translate()`), so `{placeholder}` tokens are never mangled by the
 * vowel-substitution pass.
 */
export function useT() {
  const { locale } = useLocale();
  return (key: string, values?: Record<string, string>) => {
    const raw = dictionary[key] ?? key;
    const interpolated = interpolate(raw, values);
    return translate({ [key]: interpolated }, key, locale);
  };
}
