/**
 * Public i18n surface for the marketing site.
 * Implementation details live under `lib/i18n/`.
 */
export {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  FA_LOCALE_ENABLED,
  isLocale,
  isLocalePubliclyEnabled,
  stripLocalePrefix,
  withLocale,
  swapLocalePath,
  localeDirection,
  localeHtmlLang,
  localeOg,
  type Locale,
} from "@/lib/i18n/config";

export {
  t,
  tEn,
  isLocalizedObject,
  splitLocalized,
  joinLocalized,
  type LocalizedString,
} from "@/lib/i18n/localize";

import {
  withLocale,
  localeDirection,
  isLocale,
  DEFAULT_LOCALE,
  type Locale,
} from "@/lib/i18n/config";

/** Prompt alias — `dirFor('fa')` → `'rtl'`. */
export function dirFor(locale: Locale): "ltr" | "rtl" {
  return localeDirection(locale);
}

/** Resolve `[lang]` route params (SSG-safe). */
export async function localeFromParams(
  params: Promise<{ lang: string }>,
): Promise<Locale> {
  const { lang } = await params;
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

/**
 * Locale-aware href helper.
 * `localeHref('fa', '/products')` → `/fa/products`
 * Preserves hash; leaves `/admin` and absolute URLs alone.
 */
export function localeHref(lang: Locale, path: string): string {
  if (!path.startsWith("/")) return path;
  if (path.startsWith("/admin") || path.startsWith("/api") || path.startsWith("/_next")) {
    return path;
  }
  return withLocale(path, lang);
}
