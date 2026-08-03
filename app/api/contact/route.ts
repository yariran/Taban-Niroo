import {
  escapeHtml,
  rateLimit,
  singleLine,
} from "@/lib/rate-limit";
import { parseJsonBody } from "@/lib/api/parse";
import { jsonError, jsonOk, jsonTooMany } from "@/lib/api/response";
import { contactSchema } from "@/lib/schemas/cms";
import { absoluteUrl } from "@/lib/seo";

/**
 * Hardened contact endpoint.
 *
 *  • Zod schema validation
 *  • Honeypot (`_hp`) + submit-time guard (`_t`)
 *  • Rate limit with Retry-After
 *  • Header-injection defang via singleLine + escapeHtml
 *  • No fake success when Resend is missing (503)
 */

const MIN_SUBMIT_MS = 1000;

export async function POST(request: Request) {
  const limited = await rateLimit(request, "contact");
  if (!limited.ok) {
    return jsonTooMany(
      "Too many submissions. Please try again in a few minutes.",
      limited.retryAfterSec,
    );
  }

  const parsed = await parseJsonBody(request, contactSchema);
  if (!parsed.ok) return parsed.response;

  const raw = parsed.data;

  if (typeof raw._hp === "string" && raw._hp.trim().length > 0) {
    console.warn("[contact] rejected", { reason: "honeypot" });
    return jsonOk({ ok: true, delivered: false });
  }

  const t = Number(raw._t);
  if (Number.isFinite(t) && t > 0 && Date.now() - t < MIN_SUBMIT_MS) {
    console.warn("[contact] rejected", { reason: "submit-too-fast" });
    return jsonOk({ ok: true, delivered: false });
  }

  const name = singleLine(raw.name);
  const email = singleLine(raw.email);
  const company = singleLine(raw.company ?? "");
  const message = raw.message.trim();
  const productRef = singleLine(raw.productRef ?? "");

  if (!name || !email || message.length < 10) {
    return jsonError(400, "Please check your submission.", {
      code: "validation_error",
    });
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim() ?? "info@taban-niroo.com";

  if (!resendKey || !from) {
    console.error("[contact] RESEND_API_KEY / RESEND_FROM_EMAIL not configured");
    return jsonError(
      503,
      "Messaging is temporarily unavailable. Please email info@taban-niroo.com.",
      { code: "messaging_unavailable" },
    );
  }

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
    ${
      productRef
        ? `<p><strong>Product ref:</strong> ${escapeHtml(productRef)} (<a href="${escapeHtml(absoluteUrl(`/products/${productRef}`))}">${escapeHtml(productRef)}</a>)</p>`
        : ""
    }
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: productRef
          ? `[Taban Niroo] Quote · ${productRef} · ${name}`
          : `[Taban Niroo website] Message from ${name}`,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[contact] Resend error", res.status, errText);
      return jsonError(
        502,
        "Could not send message. Please try again or email us directly.",
        { code: "upstream_error" },
      );
    }

    return jsonOk({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] Resend network error", err);
    const { reportError } = await import("@/lib/report-error");
    await reportError(err, { route: "contact" });
    return jsonError(502, "Network error. Please try again.", {
      code: "network_error",
    });
  }
}
