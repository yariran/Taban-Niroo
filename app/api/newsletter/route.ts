import { NextResponse } from "next/server";

/**
 * Newsletter signup endpoint — quiet sibling of `/api/contact`.
 *
 *  • Honeypot field (`_hp`) — bots fill it, humans don't.
 *  • Submit-time guard (`_t`) — reject sub-second submissions.
 *  • In-process IP rate limit — 5 submissions / 10 minutes.
 *  • Manual email validation.
 *  • Single-line sanitation to defang header injection if the address
 *    is ever forwarded into a transactional email.
 *
 * The Resend integration only runs when both `RESEND_API_KEY` and
 * `RESEND_FROM_EMAIL` are configured. Otherwise the endpoint records
 * the lead via `console.info` and returns `{ ok: true, delivered: false }`
 * so the brochure site stays functional on a fresh deploy without
 * secrets. The marketing team can later swap in any provider by
 * editing this file alone — the client form never needs to change.
 */

const MIN_SUBMIT_MS = 800;
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

function singleLine(s: string): string {
  return s.replace(/[\r\n\u0000-\u001F\u007F]/g, " ").trim();
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimitOk(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  // Honeypot — silently accept to keep bots quiet.
  if (typeof b._hp === "string" && b._hp.trim().length > 0) {
    return NextResponse.json({ ok: true, delivered: false });
  }
  // Time-on-form gate.
  const t = Number(b._t);
  if (Number.isFinite(t) && t > 0 && Date.now() - t < MIN_SUBMIT_MS) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const email = singleLine(typeof b.email === "string" ? b.email : "");
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.NEWSLETTER_TO_EMAIL?.trim() ?? "info@taban-niroo.com";

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
          subject: `[Taban Niroo newsletter] New subscriber: ${email}`,
          text: `A visitor subscribed to the quarterly engineering brief:\n\n${email}\n\nIP: ${ip}`,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("[newsletter] Resend error", res.status, errText);
        return NextResponse.json(
          { error: "Could not save subscription. Please try again." },
          { status: 502 },
        );
      }

      return NextResponse.json({ ok: true, delivered: true });
    } catch (err) {
      console.error("[newsletter] Resend network error", err);
      return NextResponse.json(
        { error: "Network error. Please try again." },
        { status: 502 },
      );
    }
  }

  // No Resend configured — record locally so the lead is at least in
  // the server logs. The client still gets `ok: true` because the
  // address has been captured server-side; only delivery is deferred.
  console.info("[newsletter] subscriber (no RESEND_API_KEY):", { email, ip });
  return NextResponse.json({
    ok: true,
    delivered: false,
    hint: "Email delivery is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL on the server.",
  });
}
