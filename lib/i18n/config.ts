export const LOCALES = ["en", "fa"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "tn_locale";

/**
 * Public Persian locale. Keep `false` to park `/fa` (redirects to EN) while
 * the language control still shows «فارسی». Flip to `true` to re-enable.
 */
export const FA_LOCALE_ENABLED = false;

/**
 * Persian blog. Blog posts are per-locale documents, not translations of each
 * other (`lib/cms-blog.ts`), and there are no Persian posts yet — so `/fa/blog`
 * renders its empty state. Keep `false` to drop the blog from Persian
 * navigation, the sitemap and the hreflang map while the route itself stays
 * reachable for anyone holding a link. Flip to `true` once FA posts exist.
 */
export const FA_BLOG_ENABLED = false;

export function isBlogEnabledForLocale(locale: Locale): boolean {
  if (locale === "fa") return FA_BLOG_ENABLED;
  return true;
}

function isBlogPath(barePath: string): boolean {
  return barePath === "/blog" || barePath.startsWith("/blog/");
}

/**
 * Locales a bare path is actually published in.
 *
 * Everything is bilingual except the blog, so an hreflang pointing at an
 * empty `/fa/blog` is the one case this guards against.
 */
export function localesForPath(barePath: string): Locale[] {
  if (!isBlogPath(barePath)) return [...LOCALES];
  return LOCALES.filter(isBlogEnabledForLocale);
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function isLocalePubliclyEnabled(locale: Locale): boolean {
  if (locale === "fa") return FA_LOCALE_ENABLED;
  return true;
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
