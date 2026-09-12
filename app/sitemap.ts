import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { SITE_CONTENT_REVISION, hreflangAlternates } from "@/lib/seo";
import { getAllProductSlugsAsync } from "@/lib/cms-products";
import { getAllPublishedPosts } from "@/lib/cms-blog";
import { LOCALES, withLocale } from "@/lib/i18n";

/**
 * Dynamic XML sitemap — static/product routes for both locales with
 * hreflang alternates; blog posts only under their own `locale`.
 */
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
      const languages = hreflangAlternates(route.path);
      entries.push({
        url: `${base}${withLocale(route.path, locale)}`,
        lastModified: revised,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            en: `${base}${languages.en}`,
            "fa-IR": `${base}${languages["fa-IR"]}`,
            "x-default": `${base}${languages["x-default"]}`,
          },
        },
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
        alternates: {
          languages: {
            en: `${base}${languages.en}`,
            "fa-IR": `${base}${languages["fa-IR"]}`,
            "x-default": `${base}${languages["x-default"]}`,
          },
        },
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
