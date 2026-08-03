import { parseJsonBody } from "@/lib/api/parse";
import { jsonError, jsonOk, jsonTooMany } from "@/lib/api/response";
import { rateLimit, singleLine } from "@/lib/rate-limit";
import { newsletterSchema } from "@/lib/schemas/cms";

/**
 * Newsletter signup — only active when Resend + Audience are configured.
 */

const MIN_SUBMIT_MS = 800;

export async function POST(request: Request) {
  const limited = await rateLimit(request, "newsletter");
  if (!limited.ok) {
    return jsonTooMany(
      "Too many requests. Please try again in a few minutes.",
      limited.retryAfterSec,
    );
  }

  const parsed = await parseJsonBody(request, newsletterSchema);
  if (!parsed.ok) return parsed.response;

  const raw = parsed.data;

  if (typeof raw._hp === "string" && raw._hp.trim().length > 0) {
    return jsonOk({ ok: true, delivered: false });
  }
  const t = Number(raw._t);
  if (Number.isFinite(t) && t > 0 && Date.now() - t < MIN_SUBMIT_MS) {
    return jsonOk({ ok: true, delivered: false });
  }

  const email = singleLine(raw.email);
  if (!email) {
    return jsonError(400, "Please enter a valid email address.", {
      code: "validation_error",
    });
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();

  if (!resendKey || !audienceId) {
    console.error(
      "[newsletter] RESEND_API_KEY / RESEND_AUDIENCE_ID not configured",
    );
    return jsonError(503, "Newsletter signup is temporarily unavailable.", {
      code: "newsletter_unavailable",
    });
  }

  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
        }),
      },
    );

    // 409 = already subscribed — treat as success for UX.
    if (!res.ok && res.status !== 409) {
      const errText = await res.text().catch(() => "");
      console.error("[newsletter] Resend audience error", res.status, errText);
      return jsonError(502, "Could not save subscription. Please try again.", {
        code: "upstream_error",
      });
    }

    return jsonOk({ ok: true, delivered: true });
  } catch (err) {
    console.error("[newsletter] Resend network error", err);
    const { reportError } = await import("@/lib/report-error");
    await reportError(err, { route: "newsletter" });
    return jsonError(502, "Network error. Please try again.", {
      code: "network_error",
    });
  }
}
