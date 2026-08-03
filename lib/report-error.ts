/**
 * Error reporting — prefers @sentry/nextjs when a DSN is configured.
 * Without a DSN this is a no-op beyond console.error — safe for local/dev.
 */

type ReportContext = Record<string, unknown>;

function getDsn(): string | null {
  return (
    process.env.SENTRY_DSN?.trim() ||
    process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() ||
    null
  );
}

export async function reportError(
  error: unknown,
  context: ReportContext = {},
): Promise<void> {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Unknown error";

  console.error("[reportError]", message, context);

  if (!getDsn()) return;

  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.withScope((scope) => {
      scope.setExtras(context);
      scope.setTag(
        "runtime",
        typeof window === "undefined" ? "server" : "browser",
      );
      if (error instanceof Error) {
        Sentry.captureException(error);
      } else {
        Sentry.captureMessage(message, "error");
      }
    });
  } catch (err) {
    console.error("[reportError] Sentry capture failed", err);
  }
}
