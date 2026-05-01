"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary.
 *
 * Catches errors thrown anywhere inside a route segment so the rest of
 * the app keeps a recognisable layout (background, type, accent
 * vocabulary) even when something fails. The visual design intentionally
 * avoids the "AI default" big red banner; instead it borrows the
 * editorial chrome used throughout the site (mono caps label · tabular
 * digest reference · pill CTAs).
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route-error]", error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-6 text-foreground"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 70% at 50% -10%, rgb(var(--accent-volt) / 0.08), transparent 50%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Error · interrupt
        </p>

        <h1 className="mt-6 font-medium leading-[1.05] tracking-tight text-[clamp(2.25rem,6vw,3.5rem)]">
          Something interrupted the signal.
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
          A part of this page failed to render. Our log already received the
          incident — you can retry, return to the homepage, or write to us
          directly.
        </p>

        {error?.digest && (
          <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground/80">
            Reference · <span className="tabular">{error.digest}</span>
          </p>
        )}

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Retry
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground"
          >
            Go to homepage
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
}
