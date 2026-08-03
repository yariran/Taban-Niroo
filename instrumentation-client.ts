import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() || "";
const isProd = process.env.NODE_ENV === "production";

Sentry.init({
  dsn: dsn || undefined,
  enabled: Boolean(dsn),
  environment:
    process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || "development",
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || undefined,
  tracesSampleRate: isProd ? 0.12 : 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: dsn && isProd ? 0.2 : 0,
  sendDefaultPii: false,
  enableLogs: false,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  beforeSend(event) {
    const msg = event.exception?.values?.[0]?.value ?? event.message ?? "";
    if (/ResizeObserver loop|Loading chunk \d+ failed|AbortError/i.test(msg)) {
      return null;
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
