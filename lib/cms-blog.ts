import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import {
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
} from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/get-dictionary";

export type BlogPostStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  status: BlogPostStatus;
  publishedAt: string | null;
  updatedAt: string;
  /**
   * Posts are per-locale documents (not translations of each other).
   * Missing field → treated as `en` for legacy manifests.
   */
  locale: Locale;
};

export type BlogManifest = {
  version: 1;
  updatedAt: string;
  posts: BlogPost[];
};

const PATHNAME = "cms/blog.json";

function emptyManifest(): BlogManifest {
  return { version: 1, updatedAt: new Date().toISOString(), posts: [] };
}

function normalizePost(raw: BlogPost & { locale?: string }): BlogPost {
  const locale =
    raw.locale && isLocale(raw.locale) ? raw.locale : DEFAULT_LOCALE;
  return { ...raw, locale };
}

export async function readBlogManifest(): Promise<BlogManifest> {
  const manifest = await readCmsJson(PATHNAME, emptyManifest());
  return {
    ...manifest,
    posts: (manifest.posts ?? []).map((p) =>
      normalizePost(p as BlogPost & { locale?: string }),
    ),
  };
}

export async function writeBlogManifest(
  posts: BlogPost[],
): Promise<BlogManifest> {
  const manifest: BlogManifest = {
    version: 1,
    updatedAt: new Date().toISOString(),
    posts: posts.map((p) => normalizePost(p)),
  };
  await writeCmsJson(PATHNAME, manifest);
  return manifest;
}

async function resolveLocale(locale?: Locale): Promise<Locale> {
  if (locale && isLocale(locale)) return locale;
  try {
    return await getLocale();
  } catch {
    return DEFAULT_LOCALE;
  }
}

export async function getPublishedPosts(
  locale?: Locale,
): Promise<BlogPost[]> {
  try {
    const loc = await resolveLocale(locale);
    const { posts } = await readBlogManifest();
    return posts
      .filter((p) => p.status === "published" && p.locale === loc)
      .sort((a, b) =>
        (b.publishedAt ?? b.updatedAt).localeCompare(
          a.publishedAt ?? a.updatedAt,
        ),
      );
  } catch {
    return [];
  }
}

/** All published posts across locales (sitemap). */
export async function getAllPublishedPosts(): Promise<BlogPost[]> {
  try {
    const { posts } = await readBlogManifest();
    return posts
      .filter((p) => p.status === "published")
      .sort((a, b) =>
        (b.publishedAt ?? b.updatedAt).localeCompare(
          a.publishedAt ?? a.updatedAt,
        ),
      );
  } catch {
    return [];
  }
}

export async function getPostBySlug(
  slug: string,
  locale?: Locale,
): Promise<BlogPost | undefined> {
  const posts = await getPublishedPosts(locale);
  return posts.find((p) => p.slug === slug);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
