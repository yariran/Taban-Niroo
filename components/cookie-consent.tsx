"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "tn:consent:v1";

/**
 * Lightweight cookie / analytics consent banner.
 *
 * The site only ships Vercel's first-party Web Analytics, so a heavy
 * GDPR consent manager is overkill — but the banner is still required
 * for transparency and to give visitors the chance to opt out before
 * any analytics ping fires. The banner persists choices in localStorage
 * (per-browser) so it never re-appears for returning visitors.
 *
 * UX choices on purpose:
 *  • Slides up from the bottom 600 ms after first paint so it doesn't
 *    fight the hero entrance.
 *  • Requires an explicit Accept or Decline — never auto-accepts on scroll.
 *  • Honours `prefers-reduced-motion` (disables slide).
 *  • Renders nothing during SSR so it never causes layout shift.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const persist = useCallback((value: "accept" | "decline") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
      window.dispatchEvent(new Event("tn:consent"));
    } catch {
      // Storage may be disabled — silent fail.
    }
  }, []);

  const accept = useCallback(() => {
    persist("accept");
    setAnimating(false);
    window.setTimeout(() => setVisible(false), 320);
  }, [persist]);

  const decline = useCallback(() => {
    persist("decline");
    setAnimating(false);
    window.setTimeout(() => setVisible(false), 320);
  }, [persist]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    setReduceMotion(reduced);

    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private browsing — fail open: don't show banner.
      return;
    }
    if (stored) return;

    const showTimer = window.setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));
    }, 600);

    return () => {
      window.clearTimeout(showTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie & analytics notice"
      data-animate={reduceMotion ? "off" : animating ? "in" : "out"}
      className="cookie-consent-shell pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-center px-4 pb-[max(1rem,var(--sab))] sm:px-6 sm:pb-[max(1.5rem,var(--sab))]"
    >
      <div className="pointer-events-auto w-full max-w-3xl rounded-2xl border border-border/80 bg-background/95 px-5 py-4 text-foreground shadow-elevate backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 dark:border-white/[0.08] dark:supports-[backdrop-filter]:bg-background/70 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="text-[13px] leading-relaxed text-foreground/85 sm:text-sm">
            <p className="font-medium text-foreground">
              We use cookies for first-party analytics.
            </p>
            <p className="mt-1 text-muted-foreground">
              Anonymous page-view stats only — no profiling.{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Read the privacy notice
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={decline}
              className="touch-target inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-background/50 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/60 dark:border-white/[0.08]"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={accept}
              className="touch-target inline-flex min-h-11 items-center justify-center rounded-full bg-brand-navy px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-burgundy"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
