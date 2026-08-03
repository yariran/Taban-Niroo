import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { SITE_CONTENT_REVISION } from "@/lib/seo";
import { getAllProductSlugsAsync } from "@/lib/cms-products";
import { getPublishedPosts } from "@/lib/cms-blog";

/**
 * Dynamic XML sitemap.
 *
 * Static routes are listed explicitly so we can give each one a
 * meaningful `priority` / `changeFrequency`. Product detail pages and
 * published blog posts come from the CMS (with code fallbacks).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const revised = SITE_CONTENT_REVISION;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: revised,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/about`,
      lastModified: revised,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/products`,
      lastModified: revised,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${base}/projects`,
      lastModified: revised,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: revised,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${base}/privacy`,
      lastModified: revised,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: revised,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/imprint`,
      lastModified: revised,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const [slugs, posts] = await Promise.all([
    getAllProductSlugsAsync(),
    getPublishedPosts(),
  ]);

  const productRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/products/${slug}`,
    lastModified: revised,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/blog`,
      lastModified: revised,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.55,
    })),
  ];

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
