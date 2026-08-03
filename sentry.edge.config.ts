import * as Sentry from "@sentry/nextjs";

const dsn =
  process.env.SENTRY_DSN?.trim() ||
  process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() ||
  "";

Sentry.init({
  dsn: dsn || undefined,
  enabled: Boolean(dsn),
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
  release: process.env.VERCEL_GIT_COMMIT_SHA || undefined,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 0,
  sendDefaultPii: false,
});
