import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/lib/i18n";
import {
  getDictionarySync,
  type Dictionary,
} from "@/lib/i18n/dictionary-catalog";

export type { Dictionary };

/** Prefer middleware header, then cookie, then default. */
export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const fromHeader = h.get("x-locale")?.trim() ?? "";
  if (isLocale(fromHeader)) return fromHeader;

  try {
    const jar = await cookies();
    const fromCookie = jar.get(LOCALE_COOKIE)?.value?.trim() ?? "";
    if (isLocale(fromCookie)) return fromCookie;
  } catch {
    /* cookies() unavailable in some static contexts */
  }

  return DEFAULT_LOCALE;
}

export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  const loc = locale ?? (await getLocale());
  return getDictionarySync(loc);
}
