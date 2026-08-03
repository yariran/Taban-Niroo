import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Shared rate limiting for public + CMS mutation endpoints.
 *
 * Prefer Upstash Redis (works across Vercel serverless instances).
 * Falls back to an in-process Map only when Upstash env vars are missing
 * (local dev / misconfigured deploy) — that fallback is best-effort only.
 */

export type RateLimitScope =
  | "contact"
  | "newsletter"
  | "cms-login"
  | "cms-upload"
  | "cms-mutate";

type ScopeConfig = { max: number; windowMs: number; windowLabel: `${number} m` };

const SCOPES: Record<RateLimitScope, ScopeConfig> = {
  contact: { max: 5, windowMs: 10 * 60 * 1000, windowLabel: "10 m" },
  newsletter: { max: 5, windowMs: 10 * 60 * 1000, windowLabel: "10 m" },
  "cms-login": { max: 10, windowMs: 15 * 60 * 1000, windowLabel: "15 m" },
  "cms-upload": { max: 40, windowMs: 10 * 60 * 1000, windowLabel: "10 m" },
  "cms-mutate": { max: 120, windowMs: 10 * 60 * 1000, windowLabel: "10 m" },
};

type Bucket = { count: number; firstSeen: number };
const memoryBuckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { ok: true; remaining?: number }
  | { ok: false; retryAfterSec: number };

function memoryLimit(
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket) {
    memoryBuckets.set(key, { count: 1, firstSeen: now });
    return { ok: true, remaining: max - 1 };
  }
  if (now - bucket.firstSeen > windowMs) {
    memoryBuckets.set(key, { count: 1, firstSeen: now });
    return { ok: true, remaining: max - 1 };
  }
  if (bucket.count >= max) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((bucket.firstSeen + windowMs - now) / 1000),
    );
    return { ok: false, retryAfterSec };
  }
  bucket.count += 1;
  return { ok: true, remaining: max - bucket.count };
}

const upstashLimiters = new Map<RateLimitScope, Ratelimit | null>();

function getUpstashLimiter(scope: RateLimitScope): Ratelimit | null {
  if (upstashLimiters.has(scope)) {
    return upstashLimiters.get(scope) ?? null;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    upstashLimiters.set(scope, null);
    return null;
  }

  const cfg = SCOPES[scope];
  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(cfg.max, cfg.windowLabel),
    prefix: `taban-niroo:${scope}`,
    analytics: false,
  });
  upstashLimiters.set(scope, limiter);
  return limiter;
}

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "0.0.0.0";
}

export function upstashConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
}

/**
 * @param scope — bucket namespace so contact / login / upload don't collide
 */
export async function rateLimit(
  req: Request,
  scope: RateLimitScope,
): Promise<RateLimitResult> {
  const cfg = SCOPES[scope];
  const ip = clientIp(req);
  const key = `${scope}:${ip}`;
  const limiter = getUpstashLimiter(scope);

  if (limiter) {
    try {
      const result = await limiter.limit(key);
      if (result.success) {
        return { ok: true, remaining: result.remaining };
      }
      const retryAfterSec = Math.max(
        1,
        Math.ceil((result.reset - Date.now()) / 1000),
      );
      return { ok: false, retryAfterSec };
    } catch (err) {
      console.error("[rate-limit] Upstash error; falling back to memory", err);
      return memoryLimit(key, cfg.max, cfg.windowMs);
    }
  }

  // Production without Upstash: still rate-limit in-process, but much stricter
  // so a missing Redis config cannot become an open spam vector across instances.
  if (process.env.NODE_ENV === "production") {
    console.error(
      "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN unset in production — using strict in-memory fallback",
    );
    const strictMax = Math.max(1, Math.min(2, cfg.max));
    return memoryLimit(key, strictMax, cfg.windowMs);
  }

  return memoryLimit(key, cfg.max, cfg.windowMs);
}

/** @deprecated Prefer `rateLimit` for Retry-After support. */
export async function rateLimitOk(
  req: Request,
  scope: RateLimitScope,
): Promise<boolean> {
  const result = await rateLimit(req, scope);
  return result.ok;
}

export function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

/** Strip CR/LF + control chars to defang header-injection. */
export function singleLine(s: string): string {
  return s.replace(/[\r\n\u0000-\u001F\u007F]/g, " ").trim();
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
