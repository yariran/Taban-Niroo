/** Production canonical origin — used when env is unset on Vercel/build. */
export const PRODUCTION_SITE_URL = "https://www.taban-niroo.com";

/**
 * Canonical site origin without trailing slash.
 * Used for sitemap, robots, OG URLs, and JSON-LD.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) return `https://${vercelHost.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}
