import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import {
  LOCALES,
  localeOg,
  withLocale,
  type Locale,
} from "@/lib/i18n";
import { pageSeoCopy, type PageSeoKey } from "@/lib/seo-copy";

/**
 * Shared SEO helpers — keep revision dates honest; bump when content
 * on static routes materially changes.
 */
export const SITE_CONTENT_REVISION = new Date("2026-09-08T00:00:00.000Z");

export const ORGANIZATION_SAME_AS = [
  "https://www.taban-niroo.com",
  "https://www.linkedin.com/company/taban-niroo",
] as const;

/** Resolve a site-relative or absolute asset URL for metadata / JSON-LD. */
export function absoluteUrl(pathOrUrl: string, base = getSiteUrl()): string {
  const trimmed = pathOrUrl.trim();
  if (!trimmed) return base;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${base}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

/** Brand mark in titles — English catalogue voice vs Persian search brand. */
export function brandMark(locale: Locale): string {
  return locale === "fa" ? "تابان نیرو" : "Taban Niroo";
}

type PageSocialInput = {
  title: string;
  description: string;
  /** Bare path only, e.g. `/about` (no locale prefix). */
  path: string;
  locale?: Locale;
  imageUrl?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

/**
 * hreflang map: `en`, `fa-IR`, `x-default` (default → English tree).
 */
export function hreflangAlternates(barePath: string): Record<string, string> {
  const path = barePath || "/";
  return {
    en: withLocale(path, "en"),
    "fa-IR": withLocale(path, "fa"),
    "x-default": withLocale(path, "en"),
  };
}

/**
 * Full social + canonical metadata so Next.js shallow-merge cannot leak
 * the homepage Open Graph title/url onto child routes.
 */
export function pageSocial({
  title,
  description,
  path,
  locale = "en",
  imageUrl,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex,
}: PageSocialInput): Metadata {
  const brand = brandMark(locale);
  const ogTitle = title.includes(brand) ? title : `${title} | ${brand}`;
  const images = imageUrl
    ? [{ url: imageUrl, alt: imageAlt ?? title }]
    : undefined;

  const localized = withLocale(path || "/", locale);
  const languages = hreflangAlternates(path || "/");

  return {
    title,
    description,
    alternates: {
      canonical: localized,
      languages,
    },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: ogTitle,
      description,
      url: localized,
      type,
      siteName: brand,
      locale: localeOg(locale),
      alternateLocale: LOCALES.filter((l) => l !== locale).map(localeOg),
      ...(images ? { images } : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: ogTitle,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

/** Locale-aware page metadata from the independent SEO copy table. */
export function pageSocialFor(
  key: PageSeoKey,
  locale: Locale,
  extras?: Omit<Partial<PageSocialInput>, "title" | "description" | "path" | "locale">,
): Metadata {
  const copy = pageSeoCopy(key, locale);
  return pageSocial({
    title: copy.title,
    description: copy.description,
    path: copy.path,
    locale,
    ...extras,
  });
}

export type { PageSeoKey };
export { pageSeoCopy } from "@/lib/seo-copy";
