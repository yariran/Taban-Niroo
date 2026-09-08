"use client";

import { useCallback, useEffect, useState } from "react";
import { LocaleLink, useLocale } from "@/components/locale-link";
import { getDictionarySync } from "@/lib/i18n/dictionary-catalog";

const STORAGE_KEY = "tn:consent:v1";

export function CookieConsent() {
  const locale = useLocale();
  const dict = getDictionarySync(locale);
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
            <p className="font-medium text-foreground">{dict.cookie.body}</p>
            <p className="mt-1 text-muted-foreground">
              <LocaleLink
                href="/privacy"
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                {dict.footer.privacy}
              </LocaleLink>
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={decline}
              className="touch-target inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-background/50 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/60 dark:border-white/[0.08]"
            >
              {dict.cookie.decline}
            </button>
            <button
              type="button"
              onClick={accept}
              className="touch-target inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-burgundy"
            >
              {dict.cookie.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
