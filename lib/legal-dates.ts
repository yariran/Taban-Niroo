import type { Locale } from "@/lib/i18n/config";

/**
 * Revision date shown on the three legal pages.
 *
 * One constant for all of them: they are revised together, and three copies
 * of the same string drifted apart is exactly the failure this avoids.
 *
 * The Persian form keeps the GREGORIAN date, written in Persian script and
 * digits, rather than converting to the Hijri-Shamsi calendar. A legal
 * "last revised" stamp has to match the English page exactly, and a silent
 * calendar conversion is the kind of thing that is hard to audit later. If
 * the client prefers «۱۱ فروردین ۱۴۰۵», change it here only.
 */
const LAST_UPDATED: Record<Locale, string> = {
  en: "31 March 2026",
  fa: "۳۱ مارس ۲۰۲۶",
};

export function legalLastUpdated(locale: Locale): string {
  return LAST_UPDATED[locale];
}
