import * as Sentry from "@sentry/nextjs";

const dsn =
  process.env.SENTRY_DSN?.trim() ||
  process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() ||
  "";
const isProd = process.env.NODE_ENV === "production";

Sentry.init({
  dsn: dsn || undefined,
  enabled: Boolean(dsn),
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
  release: process.env.VERCEL_GIT_COMMIT_SHA || undefined,
  tracesSampleRate: isProd ? 0.1 : 0,
  sendDefaultPii: false,
  beforeSend(event) {
    const msg = event.exception?.values?.[0]?.value ?? event.message ?? "";
    if (/ECONNRESET|socket hang up/i.test(msg)) return null;
    return event;
  },
});
