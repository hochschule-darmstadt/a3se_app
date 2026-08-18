/**
 * Minimal FR-002 language-extensibility demonstration.
 *
 * No second interaction language has been authored or accepted anywhere in
 * `docs/requirements` yet -- only FR-001 (British English) is accepted.
 * Rather than inventing unauthorised business content in a second real
 * language, this thin slice proves the UI is *structured* for it with a
 * generated pseudo-locale (`en-XP`): every string is the same English text
 * wrapped and diacritic-substituted, a standard extensibility/hard-coded-
 * string smoke test. Real localisation content remains a recorded open item
 * (see the frontend testing/i18n decision record).
 */
export type Locale = "en-GB" | "en-XP";

export const SUPPORTED_LOCALES: readonly Locale[] = ["en-GB", "en-XP"];

const PSEUDO_MAP: Record<string, string> = {
  a: "å", e: "é", i: "î", o: "ö", u: "ü",
  A: "Å", E: "É", I: "Î", O: "Ö", U: "Ü",
};

function pseudoLocalize(text: string): string {
  const transformed = text.replace(/[aeiouAEIOU]/g, (ch) => PSEUDO_MAP[ch] ?? ch);
  return `⸨${transformed}⸩`;
}

/**
 * Looks up `key` in the shared dictionary and renders it for `locale`.
 * `en-GB` returns the authored string verbatim; `en-XP` pseudo-localizes it.
 * An unknown key returns the key itself (visibly wrong, never a thrown error)
 * so a missing translation is obvious in manual/automated review.
 */
export function translate(dictionary: Record<string, string>, key: string, locale: Locale): string {
  const value = dictionary[key] ?? key;
  return locale === "en-XP" ? pseudoLocalize(value) : value;
}
