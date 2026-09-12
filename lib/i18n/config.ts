export const LOCALES = ["en", "fa"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "tn_locale";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function stripLocalePrefix(pathname: string): {
  locale: Locale | null;
  pathname: string;
} {
  const parts = pathname.split("/");
  const maybe = parts[1] ?? "";
  if (!isLocale(maybe)) {
    return { locale: null, pathname };
  }
  const rest = "/" + parts.slice(2).join("/");
  const normalized = rest === "/" ? "/" : rest.replace(/\/$/, "") || "/";
  return { locale: maybe, pathname: normalized };
}

/**
 * Prefix a bare path with a locale segment.
 * Preserves `?query` and `#hash` when present on the input.
 */
export function withLocale(pathname: string, locale: Locale): string {
  const hashIndex = pathname.indexOf("#");
  const hash = hashIndex >= 0 ? pathname.slice(hashIndex) : "";
  const withoutHash =
    hashIndex >= 0 ? pathname.slice(0, hashIndex) : pathname;

  const qIndex = withoutHash.indexOf("?");
  const query = qIndex >= 0 ? withoutHash.slice(qIndex) : "";
  const pathOnly = qIndex >= 0 ? withoutHash.slice(0, qIndex) : withoutHash;

  const clean = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
  const prefixed = clean === "/" ? `/${locale}` : `/${locale}${clean}`;
  return `${prefixed}${query}${hash}`;
}

/**
 * Swap only the locale segment of a current URL (pathname ± search ± hash).
 * `/en/products/foo?ref=1#specs` + `fa` → `/fa/products/foo?ref=1#specs`
 */
export function swapLocalePath(
  currentPath: string,
  locale: Locale,
): string {
  const hashIndex = currentPath.indexOf("#");
  const hash = hashIndex >= 0 ? currentPath.slice(hashIndex) : "";
  const withoutHash =
    hashIndex >= 0 ? currentPath.slice(0, hashIndex) : currentPath;

  const qIndex = withoutHash.indexOf("?");
  const query = qIndex >= 0 ? withoutHash.slice(qIndex) : "";
  const pathOnly = qIndex >= 0 ? withoutHash.slice(0, qIndex) : withoutHash;

  const { pathname: bare } = stripLocalePrefix(pathOnly || "/");
  return withLocale(`${bare || "/"}${query}${hash}`, locale);
}

export function localeDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "fa" ? "rtl" : "ltr";
}

export function localeHtmlLang(locale: Locale): string {
  return locale === "fa" ? "fa" : "en";
}

export function localeOg(locale: Locale): string {
  return locale === "fa" ? "fa_IR" : "en_US";
}
