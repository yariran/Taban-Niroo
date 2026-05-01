import { NextResponse } from "next/server";

/**
 * Hardened contact endpoint.
 *
 *  • Honeypot field (`_hp`) — bots fill it, humans don't.
 *  • Submit-time guard (`_t`) — reject sub-second submissions.
 *  • In-process IP rate limit — 5 submissions / 10 minutes.
 *  • Manual validation — name/email/company/message length.
 *  • Reply-to spoof guard — strip any header injection from email field
 *    before it's sent into Resend (`reply_to`).
 *  • Structured rejection logs (no PII echoed back to caller).
 *
 * The Resend integration only runs when both `RESEND_API_KEY` and
 * `RESEND_FROM_EMAIL` are configured. Otherwise the endpoint returns
 * `{ ok: true, delivered: false }` so the marketing site stays
 * functional (e.g. on a fresh deploy without secrets).
 */

const MAX_NAME = 200;
const MAX_COMPANY = 200;
const MAX_MESSAGE = 8000;
const MIN_SUBMIT_MS = 1000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

type Bucket = { count: number; firstSeen: number };
const buckets = new Map<string, Bucket>();

function rateLimitOk(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket) {
    buckets.set(ip, { count: 1, firstSeen: now });
    return true;
  }
  if (now - bucket.firstSeen > RATE_LIMIT_WINDOW_MS) {
    buckets.set(ip, { count: 1, firstSeen: now });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) return false;
  bucket.count += 1;
  return true;
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "0.0.0.0";
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

/** Strip CR/LF + control chars to defang header-injection in Reply-To. */
function singleLine(s: string): string {
  return s.replace(/[\r\n\u0000-\u001F\u007F]/g, " ").trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Validation =
  | { ok: false; status: number; error: string; reason: string }
  | {
      ok: true;
      name: string;
      email: string;
      company: string;
      message: string;
    };

function validatePayload(body: unknown): Validation {
  if (!body || typeof body !== "object") {
    return {
      ok: false,
      status: 400,
      error: "Invalid payload.",
      reason: "non-object",
    };
  }
  const b = body as Record<string, unknown>;

  // Honeypot — must be empty.
  if (typeof b._hp === "string" && b._hp.trim().length > 0) {
    return {
      ok: false,
      status: 400,
      error: "Submission rejected.",
      reason: "honeypot",
    };
  }

  // Time-on-form — bots fill in milliseconds.
  const t = Number(b._t);
  if (Number.isFinite(t) && t > 0 && Date.now() - t < MIN_SUBMIT_MS) {
    return {
      ok: false,
      status: 400,
      error: "Please slow down and try again.",
      reason: "submit-too-fast",
    };
  }

  const name = singleLine(typeof b.name === "string" ? b.name : "");
  const email = singleLine(typeof b.email === "string" ? b.email : "");
  const company = singleLine(typeof b.company === "string" ? b.company : "");
  const message = (typeof b.message === "string" ? b.message : "").trim();

  if (!name || name.length > MAX_NAME) {
    return {
      ok: false,
      status: 400,
      error: "Please enter a valid name.",
      reason: "name",
    };
  }
  if (!email || !isValidEmail(email)) {
    return {
      ok: false,
      status: 400,
      error: "Please enter a valid email address.",
      reason: "email",
    };
  }
  if (company.length > MAX_COMPANY) {
    return {
      ok: false,
      status: 400,
      error: "Company name is too long.",
      reason: "company",
    };
  }
  if (!message || message.length < 10 || message.length > MAX_MESSAGE) {
    return {
      ok: false,
      status: 400,
      error: "Please enter a message (10–8000 characters).",
      reason: "message",
    };
  }

  return { ok: true, name, email, company, message };
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimitOk(ip)) {
    console.warn("[contact] rate-limited", { ip });
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const v = validatePayload(body);
  if (!v.ok) {
    console.warn("[contact] rejected", { ip, reason: v.reason });
    // Honeypot/timing rejections look like success to keep bots dumb.
    if (v.reason === "honeypot" || v.reason === "submit-too-fast") {
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json({ error: v.error }, { status: v.status });
  }

  const { name, email, company, message } = v;

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim() ?? "info@taban-niroo.com";

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
  `;

  if (resendKey && from) {
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
          subject: `[Taban Niroo website] Message from ${name}`,
          html,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("[contact] Resend error", res.status, errText);
        return NextResponse.json(
          {
            error:
              "Could not send message. Please try again or email us directly.",
          },
          { status: 502 },
        );
      }

      return NextResponse.json({ ok: true, delivered: true });
    } catch (err) {
      console.error("[contact] Resend network error", err);
      return NextResponse.json(
        { error: "Network error. Please try again." },
        { status: 502 },
      );
    }
  }

  console.info("[contact] (no RESEND_API_KEY) enquiry:", {
    name,
    email,
    company,
    messageLen: message.length,
  });

  return NextResponse.json({
    ok: true,
    delivered: false,
    hint: "Email delivery is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL on the server.",
  });
}
