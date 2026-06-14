import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Content-Security-Policy.
 *
 * `'unsafe-inline'` on `script-src` is intentional: Next.js inlines a
 * very small bootstrap script, and we render `<script type="application/ld+json">`
 * blocks for SEO. The rest of the policy is strict (no `unsafe-eval`,
 * no remote `script-src` beyond Vercel's analytics).
 *
 * `data:` for `img-src` covers the inline noise SVG used by `.grain-layer`.
 * `frame-ancestors 'none'` + `X-Frame-Options: DENY` is the canonical
 * clickjacking defence.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Prefer this project as Turbopack root when multiple lockfiles exist. */
  turbopack: {
    root: __dirname,
  },
  /**
   * Image optimization. Next 16 ships AVIF/WebP encoders; the catalogue
   * photography is multi-MB JPG/PNG so leaving `unoptimized: true` would
   * have shipped tens of MB on every cold visit.
   */
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1600, 1920, 2400],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    /** Smaller default output on Vercel — faster complete decode on slow links. */
    qualities: [75, 80, 85],
  },
  async headers() {
    const baseHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    ];

    // CSP only in production — dev (Turbopack HMR) needs blob/eval freedoms.
    if (!isDev) {
      baseHeaders.push({ key: "Content-Security-Policy", value: csp });
    }

    /**
     * Long-cache the static asset extensions Next can't fingerprint
     * (everything in `/public`). Next 16's route source parser does
     * not accept regex non-capturing groups, so each extension is its
     * own rule. Order matters: more specific rules go first so the
     * blanket `/:path*` security headers below still apply.
     */
    const cacheControl = {
      key: "Cache-Control",
      value: "public, max-age=31536000, immutable",
    };
    const longCacheExts = [
      "webp",
      "avif",
      "jpg",
      "jpeg",
      "png",
      "svg",
      "woff",
      "woff2",
      "mp4",
      "webm",
    ];
    const cacheRules = longCacheExts.map((ext) => ({
      source: `/:path*.${ext}`,
      headers: [cacheControl],
    }));

    return [
      {
        source: "/:path*",
        headers: baseHeaders,
      },
      ...cacheRules,
    ];
  },
};

export default nextConfig;
