import { NextResponse } from "next/server";
import { productionEnvReady } from "@/lib/env-check";
import { cmsPasswordConfigured } from "@/lib/cms-auth";
import { blobConfigured } from "@/lib/cms-store";
import { upstashConfigured } from "@/lib/rate-limit";

/**
 * Lightweight health probe for ops / uptime checks.
 *
 * Public response is intentionally minimal — no env key names — so the
 * endpoint cannot be used for configuration reconnaissance. Full detail
 * is available only when `HEALTH_DETAIL_KEY` matches the `x-health-key`
 * header (for internal monitors).
 */
export async function GET(request: Request) {
  const env = productionEnvReady();
  const isProd = process.env.NODE_ENV === "production";
  const criticalOk = isProd ? env.ok : cmsPasswordConfigured();
  const status = criticalOk ? "ok" : "degraded";

  const detailKey = process.env.HEALTH_DETAIL_KEY?.trim();
  const provided = request.headers.get("x-health-key")?.trim();
  const allowDetail = Boolean(detailKey && provided && provided === detailKey);

  const body: Record<string, unknown> = {
    status,
    ts: new Date().toISOString(),
  };

  if (allowDetail) {
    body.checks = {
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
    if (isProd && !env.ok) {
      body.missing = env.missing;
    }
  }

  return NextResponse.json(body, {
    status: criticalOk ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
