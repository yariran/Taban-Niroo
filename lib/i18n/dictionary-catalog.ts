import type { Locale } from "@/lib/i18n";
import { en, type Dictionary } from "@/lib/i18n/dictionaries/en";
import { fa } from "@/lib/i18n/dictionaries/fa";

const catalogs: Record<Locale, Dictionary> = { en, fa };

/** Safe for Client Components — no `next/headers`. */
export function getDictionarySync(locale: Locale): Dictionary {
  return catalogs[locale];
}

export type { Dictionary };
