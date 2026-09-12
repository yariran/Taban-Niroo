"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/body-scroll-lock";
import { stripLocalePrefix } from "@/lib/i18n";
import { getDictionarySync } from "@/lib/i18n/dictionary-catalog";
import { useLocale } from "@/components/locale-link";

const STORAGE_KEY = "tn-intro-v2";
const HOLD_MS = 1900;
const EXIT_MS = 750;
/** Absolute ceiling — unlock even if timers are throttled in a background tab. */
const CEILING_MS = HOLD_MS + EXIT_MS + 2000;

type Phase = "in" | "out" | "done";

declare global {
  interface Window {
    /**
     * Documented e2e / automation flag. Prefer `?tn_intro=skip` on the URL;
     * this mirror exists for init-scripts that cannot rewrite the first hop.
     */
    __TN_INTRO_SKIP__?: boolean;
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function alreadySeen(): boolean {
  if (
    typeof document !== "undefined" &&
    document.documentElement.dataset.tnIntro === "done"
  ) {
    return true;
  }
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
  if (typeof document !== "undefined") {
    document.documentElement.dataset.tnIntro = "done";
  }
}

/**
 * Skip without playing the plate.
 * - `prefers-reduced-motion`
 * - already seen this session
 * - `?tn_intro=skip` (documented test/automation flag)
 * - `window.__TN_INTRO_SKIP__ === true` (same flag, init-script form)
 */
export function shouldSkipIntro(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return true;
  if (alreadySeen()) return true;
  if (window.__TN_INTRO_SKIP__ === true) return true;
  try {
    if (new URLSearchParams(window.location.search).get("tn_intro") === "skip") {
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

/** Brand plate on first home visit (works with /en and /fa). */
export function SiteIntro() {
  const pathname = usePathname() || "/";
  const locale = useLocale();
  const dict = getDictionarySync(locale);
  const { pathname: bare } = stripLocalePrefix(pathname);
  const isHome = bare === "/";
  const isAdmin = pathname.startsWith("/admin");

  // SSR defaults to "in" on home; client layout-effect corrects skips before paint.
  const [phase, setPhase] = useState<Phase>(() =>
    !isHome || isAdmin ? "done" : "in",
  );

  const lockedRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);
  const skipRef = useRef(false);

  // Sync skip / reduced-motion before first paint so we never flash-lock.
  useLayoutEffect(() => {
    if (!isHome || isAdmin || shouldSkipIntro()) {
      skipRef.current = true;
      if (isHome && !isAdmin) markSeen();
      setPhase("done");
      return;
    }
    skipRef.current = false;
  }, [isHome, isAdmin, pathname]);

  useEffect(() => {
    const release = () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;
      unlockBodyScroll();
    };

    const acquire = () => {
      if (lockedRef.current) return;
      lockBodyScroll();
      lockedRef.current = true;
    };

    if (skipRef.current || !isHome || isAdmin || shouldSkipIntro()) {
      if (isHome && !isAdmin) markSeen();
      setPhase("done");
      release();
      return () => {
        release();
      };
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (exitTimerRef.current != null) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      markSeen();
      release();
      setPhase("done");
    };

    setPhase("in");

    try {
      acquire();
    } catch (err) {
      release();
      throw err;
    }

    const holdTimer = window.setTimeout(() => {
      if (finished) return;
      setPhase("out");
      exitTimerRef.current = window.setTimeout(() => {
        finish();
      }, EXIT_MS);
    }, HOLD_MS);

    const ceilingTimer = window.setTimeout(() => {
      finish();
    }, CEILING_MS);

    const onIntent = () => {
      finish();
    };

    window.addEventListener("keydown", onIntent);
    window.addEventListener("wheel", onIntent, { passive: true });
    window.addEventListener("touchstart", onIntent, { passive: true });
    window.addEventListener("pointerdown", onIntent);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(ceilingTimer);
      if (exitTimerRef.current != null) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      window.removeEventListener("keydown", onIntent);
      window.removeEventListener("wheel", onIntent);
      window.removeEventListener("touchstart", onIntent);
      window.removeEventListener("pointerdown", onIntent);
      if (lockedRef.current) markSeen();
      release();
    };
  }, [isHome, isAdmin, pathname]);

  if (phase === "done") return null;

  return (
    <div
      data-site-intro
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center overflow-hidden",
        "bg-brand-navy-deep",
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        phase === "out"
          ? "pointer-events-none -translate-y-[4%] opacity-0"
          : "translate-y-0 opacity-100",
      )}
      role="presentation"
      aria-hidden={phase === "out"}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_80%,rgb(var(--accent-volt)/0.14),transparent_55%)]"
        aria-hidden
      />

      <div
        className={cn(
          "relative z-10 flex max-w-3xl flex-col px-6",
          "animate-[intro-fade-up_0.8s_var(--ease-entrance)_both]",
        )}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand-orange">
          {dict.intro.kicker}
        </p>
        <p className="font-hero-slogan mt-4 text-[clamp(2.5rem,10vw,5.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em] text-brand-cream">
          {dict.brand}
        </p>
        <div
          className="mt-6 h-px w-40 origin-left bg-brand-orange animate-[intro-volt_1s_var(--ease-entrance)_0.35s_both]"
          aria-hidden
        />
        <p className="type-cinema mt-5 max-w-sm text-[clamp(1rem,2vw,1.25rem)] text-brand-cream/75">
          {dict.intro.line}
        </p>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          {dict.intro.spec}
        </p>
      </div>
    </div>
  );
}
