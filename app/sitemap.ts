import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { SITE_CONTENT_REVISION, hreflangAlternates } from "@/lib/seo";
import { getAllProductSlugsAsync } from "@/lib/cms-products";
import { getAllPublishedPosts } from "@/lib/cms-blog";
import { LOCALES, localesForPath, withLocale } from "@/lib/i18n";

/**
 * Dynamic XML sitemap — static/product routes for both locales with
 * hreflang alternates; blog posts only under their own `locale`.
 */
/**
 * Absolute-ise an hreflang map.
 *
 * Built from whatever keys `hreflangAlternates` returned rather than a fixed
 * en / fa-IR / x-default triple: paths with no Persian edition omit `fa-IR`,
 * and hardcoding the key emitted `href="<base>undefined"` for them.
 */
function absolute(
  base: string,
  languages: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(languages).map(([key, path]) => [key, `${base}${path}`]),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const revised = SITE_CONTENT_REVISION;

  const bareStatic = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/products", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/projects", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/imprint", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" as const },
  ];

  const [slugs, posts] = await Promise.all([
    getAllProductSlugsAsync(),
    getAllPublishedPosts(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const route of bareStatic) {
      // `/blog` exists only where there are posts in that locale.
      if (!localesForPath(route.path).includes(locale)) continue;
      const languages = hreflangAlternates(route.path);
      entries.push({
        url: `${base}${withLocale(route.path, locale)}`,
        lastModified: revised,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages: absolute(base, languages) },
      });
    }
    for (const slug of slugs) {
      const bare = `/products/${slug}`;
      const languages = hreflangAlternates(bare);
      entries.push({
        url: `${base}${withLocale(bare, locale)}`,
        lastModified: revised,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: absolute(base, languages) },
      });
    }
  }

  for (const post of posts) {
    entries.push({
      url: `${base}${withLocale(`/blog/${post.slug}`, post.locale)}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }

  return entries;
}
