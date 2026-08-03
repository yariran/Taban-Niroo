import { jsonError } from "@/lib/api/response";
import type { NextResponse } from "next/server";

/**
 * Reject cross-site cookie-authenticated mutations (basic CSRF defence).
 * Compares Origin/Referer host to this request's host (same deployment).
 * Optional bypass: `x-cms-internal` matching `CMS_INTERNAL_KEY`.
 */
export function assertCmsMutationOrigin(
  request: Request,
): NextResponse | null {
  const internalKey = process.env.CMS_INTERNAL_KEY?.trim();
  if (
    internalKey &&
    request.headers.get("x-cms-internal") === internalKey
  ) {
    return null;
  }

  let allowedHost: string;
  try {
    allowedHost = new URL(request.url).host;
  } catch {
    return null;
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host === allowedHost) return null;
    } catch {
      /* fall through */
    }
    return jsonError(403, "Forbidden origin.", { code: "csrf_origin" });
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      if (new URL(referer).host === allowedHost) return null;
    } catch {
      /* fall through */
    }
    return jsonError(403, "Forbidden referer.", { code: "csrf_referer" });
  }

  // No Origin/Referer: allow in development (curl); block in production.
  if (process.env.NODE_ENV !== "production") return null;
  return jsonError(403, "Missing origin.", { code: "csrf_missing" });
}
