import type { ContentBlock, ContentItem, SiteContent } from "@/lib/cms-content-types";
import { emptySiteContent } from "@/lib/cms-content-types";
import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import {
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
} from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/get-dictionary";

const STRING_KEYS = [
  "eyebrow",
  "title",
  "titleLine2",
  "titleLine3",
  "body",
  "ctaLabel",
  "ctaHref",
  "ctaLabel2",
  "ctaHref2",
] as const satisfies readonly (keyof ContentBlock)[];

function pathnameFor(locale: Locale): string {
  return `cms/site-content.${locale}.json`;
}

/** Legacy single-file path (pre Phase 2). */
const LEGACY_PATHNAME = "cms/site-content.json";

function logMissing(path: string, locale: Locale) {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[i18n] missing ${locale} content → using en: ${path}`);
  }
}

function mergeItems(
  primary: ContentItem[] | undefined,
  fallback: ContentItem[] | undefined,
): ContentItem[] | undefined {
  if (primary && primary.length > 0) return primary;
  return fallback;
}

function mergeBlock(
  primary: ContentBlock | undefined,
  fallback: ContentBlock | undefined,
  path: string,
  locale: Locale,
): ContentBlock | undefined {
  if (!primary && !fallback) return undefined;
  if (!primary) {
    if (fallback) logMissing(path, locale);
    return fallback;
  }
  if (!fallback) return primary;

  const out: ContentBlock = { ...fallback };

  for (const key of STRING_KEYS) {
    const raw = primary[key];
    if (typeof raw === "string" && raw.trim()) {
      out[key] = raw.trim();
    } else if (raw !== undefined && typeof raw === "string" && !raw.trim()) {
      logMissing(`${path}.${key}`, locale);
      // keep fallback
    }
  }

  if (primary.image != null && String(primary.image).trim()) {
    out.image = String(primary.image).trim();
  }

  out.items = mergeItems(primary.items, fallback.items);

  return out;
}

function mergePage(
  primary: Record<string, ContentBlock | undefined> | undefined,
  fallback: Record<string, ContentBlock | undefined> | undefined,
  page: string,
  locale: Locale,
): Record<string, ContentBlock | undefined> {
  const keys = new Set([
    ...Object.keys(primary ?? {}),
    ...Object.keys(fallback ?? {}),
  ]);
  const out: Record<string, ContentBlock | undefined> = {};
  for (const key of keys) {
    out[key] = mergeBlock(
      primary?.[key],
      fallback?.[key],
      `${page}.${key}`,
      locale,
    );
  }
  return out;
}

/** Deep-merge locale content onto English; never leave empty when en exists. */
export function mergeSiteContent(
  primary: SiteContent,
  fallback: SiteContent,
  locale: Locale,
): SiteContent {
  if (locale === DEFAULT_LOCALE) return primary;

  return {
    version: 1,
    updatedAt: primary.updatedAt || fallback.updatedAt,
    home: mergePage(primary.home, fallback.home, "home", locale) as SiteContent["home"],
    about: mergePage(primary.about, fallback.about, "about", locale),
    projects: mergePage(primary.projects, fallback.projects, "projects", locale),
    contact: mergePage(primary.contact, fallback.contact, "contact", locale),
    products: mergePage(primary.products, fallback.products, "products", locale),
    blog: mergePage(primary.blog, fallback.blog, "blog", locale),
    legal: mergePage(primary.legal, fallback.legal, "legal", locale),
    footer: mergeBlock(primary.footer, fallback.footer, "footer", locale),
  };
}

async function readLocaleFile(locale: Locale): Promise<SiteContent> {
  const empty = emptySiteContent();
  let data = await readCmsJson(pathnameFor(locale), empty);

  // Migrate: bare site-content.json counts as English if en file is empty.
  if (
    locale === DEFAULT_LOCALE &&
    !hasAnyContent(data) &&
    hasAnyContent(await readCmsJson(LEGACY_PATHNAME, emptySiteContent()))
  ) {
    data = await readCmsJson(LEGACY_PATHNAME, empty);
  }

  return data;
}

function hasAnyContent(content: SiteContent): boolean {
  if (content.footer && Object.keys(content.footer).length > 0) return true;
  for (const page of [
    content.home,
    content.about,
    content.projects,
    content.contact,
    content.products,
    content.blog,
    content.legal,
  ]) {
    if (!page) continue;
    for (const block of Object.values(page)) {
      if (block && Object.keys(block).length > 0) return true;
    }
  }
  return false;
}

export async function readSiteContent(
  locale: Locale = DEFAULT_LOCALE,
): Promise<SiteContent> {
  return readLocaleFile(locale);
}

export async function writeSiteContent(
  content: SiteContent,
  locale: Locale = DEFAULT_LOCALE,
): Promise<SiteContent> {
  const next: SiteContent = {
    ...content,
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  await writeCmsJson(pathnameFor(locale), next);
  return next;
}

/**
 * Public site content for a locale.
 * `fa` merges onto `en` so missing Persian strings never render empty.
 */
export async function getSiteContent(
  locale?: Locale,
): Promise<SiteContent> {
  try {
    const loc =
      locale && isLocale(locale) ? locale : await getLocale();
    const primary = await readLocaleFile(loc);
    if (loc === DEFAULT_LOCALE) return primary;
    const en = await readLocaleFile(DEFAULT_LOCALE);
    return mergeSiteContent(primary, en, loc);
  } catch (err) {
    console.error("[cms-content] getSiteContent", err);
    return emptySiteContent();
  }
}

export type {
  ContentBlock,
  ContentItem,
  SiteContent,
} from "@/lib/cms-content-types";
export { emptySiteContent, blockHasContent } from "@/lib/cms-content-types";
