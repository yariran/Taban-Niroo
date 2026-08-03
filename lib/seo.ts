import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Shared SEO helpers — keep revision dates honest; bump when content
 * on static routes materially changes.
 */
export const SITE_CONTENT_REVISION = new Date("2026-07-26T00:00:00.000Z");

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

type PageSocialInput = {
  title: string;
  description: string;
  /** Path only, e.g. `/about`. */
  path: string;
  imageUrl?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

/**
 * Full social + canonical metadata so Next.js shallow-merge cannot leak
 * the homepage Open Graph title/url onto child routes.
 */
export function pageSocial({
  title,
  description,
  path,
  imageUrl,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex,
}: PageSocialInput): Metadata {
  const ogTitle = title.includes("Taban Niroo")
    ? title
    : `${title} | Taban Niroo`;
  const images = imageUrl
    ? [{ url: imageUrl, alt: imageAlt ?? title }]
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      type,
      siteName: "Taban Niroo",
      locale: "en_US",
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
