import { NextResponse } from "next/server";
import { productionEnvReady } from "@/lib/env-check";
import { cmsPasswordConfigured } from "@/lib/cms-auth";
import { blobConfigured } from "@/lib/cms-store";
import { upstashConfigured } from "@/lib/rate-limit";

/**
 * Lightweight health probe for ops / uptime checks.
 * Does not expose secrets — only boolean capability flags.
 */
export async function GET() {
  const env = productionEnvReady();
  const checks = {
    cmsAuth: cmsPasswordConfigured(),
    cmsSessionSecret: Boolean(
      process.env.CMS_SESSION_SECRET?.trim() &&
        process.env.CMS_SESSION_SECRET.trim().length >= 16,
    ),
    blob: blobConfigured(),
    upstash: upstashConfigured(),
    resend: Boolean(
      process.env.RESEND_API_KEY?.trim() &&
        process.env.RESEND_FROM_EMAIL?.trim(),
    ),
    siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim()),
  };

  const isProd = process.env.NODE_ENV === "production";
  const criticalOk = isProd
    ? env.ok
    : checks.cmsAuth;

  const status = criticalOk ? "ok" : "degraded";

  return NextResponse.json(
    {
      status,
      ts: new Date().toISOString(),
      checks,
      ...(isProd && !env.ok ? { missing: env.missing } : {}),
    },
    {
      status: criticalOk ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
