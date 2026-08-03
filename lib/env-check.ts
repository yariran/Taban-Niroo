/**
 * Production env readiness checks for ops / `npm run check-env`.
 * Does not read secret values into logs — only presence.
 */

export type EnvCheck = {
  key: string;
  ok: boolean;
  required: boolean;
  hint: string;
};

export function getProductionEnvChecks(): EnvCheck[] {
  const has = (key: string) => Boolean(process.env[key]?.trim());

  return [
    {
      key: "CMS_ADMIN_PASSWORD",
      ok: has("CMS_ADMIN_PASSWORD"),
      required: true,
      hint: "Admin login will not work without this.",
    },
    {
      key: "CMS_SESSION_SECRET",
      ok: has("CMS_SESSION_SECRET") && (process.env.CMS_SESSION_SECRET?.length ?? 0) >= 16,
      required: true,
      hint: "Dedicated HMAC secret (≥16 chars) for CMS session cookies.",
    },
    {
      key: "BLOB_READ_WRITE_TOKEN",
      ok: has("BLOB_READ_WRITE_TOKEN"),
      required: true,
      hint: "Without Blob on Vercel, CMS data resets on every deploy.",
    },
    {
      key: "RESEND_API_KEY",
      ok: has("RESEND_API_KEY"),
      required: true,
      hint: "Contact form returns 503 without Resend.",
    },
    {
      key: "RESEND_FROM_EMAIL",
      ok: has("RESEND_FROM_EMAIL"),
      required: true,
      hint: "Verified sender address in Resend.",
    },
    {
      key: "UPSTASH_REDIS_REST_URL",
      ok: has("UPSTASH_REDIS_REST_URL"),
      required: true,
      hint: "Durable rate limits across serverless instances.",
    },
    {
      key: "UPSTASH_REDIS_REST_TOKEN",
      ok: has("UPSTASH_REDIS_REST_TOKEN"),
      required: true,
      hint: "Pair with UPSTASH_REDIS_REST_URL.",
    },
    {
      key: "NEXT_PUBLIC_SITE_URL",
      ok: has("NEXT_PUBLIC_SITE_URL"),
      required: true,
      hint: "Canonical origin for sitemap / OG / JSON-LD.",
    },
  ];
}

export function productionEnvReady(): {
  ok: boolean;
  missing: string[];
  checks: EnvCheck[];
} {
  const checks = getProductionEnvChecks();
  const missing = checks.filter((c) => c.required && !c.ok).map((c) => c.key);
  return { ok: missing.length === 0, missing, checks };
}
