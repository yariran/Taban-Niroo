"use client";

import { useEffect } from "react";
import { LocaleLink, useLocale } from "@/components/locale-link";
import { getDictionarySync } from "@/lib/i18n/dictionary-catalog";

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
  const dict = getDictionarySync(useLocale());

  useEffect(() => {
    console.error("[route-error]", error);
    void import("@/lib/report-error").then(({ reportError }) =>
      reportError(error, { boundary: "route", digest: error.digest }),
    );
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
          {dict.ui.errorEyebrow}
        </p>

        <h1 className="mt-6 font-medium leading-[1.05] tracking-tight text-[clamp(2.25rem,6vw,3.5rem)]">
          {dict.ui.errorTitle}
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
          {dict.ui.errorBody}
        </p>

        {/* `/80` measured 3.75:1 light on 10.5px — under 4.5. This is the
            error screen: the one place a reader most needs the reference
            code to be legible. */}
        {error?.digest && (
          <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            {dict.ui.errorReference}{" "}
            <span className="tabular">{error.digest}</span>
          </p>
        )}

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-burgundy"
          >
            {dict.ui.retry}
          </button>
          <LocaleLink
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground"
          >
            {dict.ui.goHome}
          </LocaleLink>
          <LocaleLink
            href="/contact"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {dict.ui.contactSupport}
          </LocaleLink>
        </div>
      </div>
    </main>
  );
}
