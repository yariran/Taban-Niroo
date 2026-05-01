"use client";

import { useEffect, useState } from "react";
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
 *  • Dismisses on click, scroll past 25% of the page, or accept/decline.
 *  • Honours `prefers-reduced-motion` (disables slide).
 *  • Renders nothing during SSR so it never causes layout shift.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

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
      // Allow the next frame to apply the entrance transition.
      requestAnimationFrame(() => setAnimating(true));
    }, 600);

    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.25) {
        accept();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(showTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const persist = (value: "accept" | "decline") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Storage may be disabled — silent fail.
    }
  };

  const accept = () => {
    persist("accept");
    setAnimating(false);
    window.setTimeout(() => setVisible(false), 320);
  };

  const decline = () => {
    persist("decline");
    setAnimating(false);
    window.setTimeout(() => setVisible(false), 320);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie & analytics notice"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-center px-4 pb-4 sm:px-6 sm:pb-6"
      style={{
        opacity: reduceMotion ? 1 : animating ? 1 : 0,
        transform: reduceMotion
          ? "translate3d(0, 0, 0)"
          : animating
            ? "translate3d(0, 0, 0)"
            : "translate3d(0, 24px, 0)",
        transition: reduceMotion
          ? "none"
          : "opacity 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="pointer-events-auto w-full max-w-3xl rounded-2xl border border-border/80 bg-background/95 px-5 py-4 text-foreground shadow-elevate backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 dark:border-white/[0.08] dark:supports-[backdrop-filter]:bg-background/70 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="text-[13px] leading-relaxed text-foreground/85">
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
              className="rounded-full border border-border bg-background/50 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-foreground/60 dark:border-white/[0.08]"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={accept}
              className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
