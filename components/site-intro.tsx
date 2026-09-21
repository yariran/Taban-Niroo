"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/body-scroll-lock";
import { stripLocalePrefix } from "@/lib/i18n";
import { getDictionarySync } from "@/lib/i18n/dictionary-catalog";
import { useLocale } from "@/components/locale-link";

const STORAGE_KEY = "tn-intro-v2";
/** Kill switch — set `true` to re-enable the cinematic brand intro. */
const INTRO_ENABLED = false;
/** Soft floor so the brand beat can land — not an artificial long hold. */
const MIN_MS = 850;
/** Prefer completing near this mark when critical assets are ready. */
const TARGET_MS = 1100;
const EXIT_MS = 560;
/** Absolute ceiling — unlock even if readiness stalls (e.g. background tab). */
const CEILING_MS = 2200;

const HERO_POSTER = "/images/taban-hero-poster.jpg";

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
  if (!INTRO_ENABLED) return true;
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

/** Probe the hero poster only — never the full hero video. */
function loadHeroPoster(): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    img.onload = done;
    img.onerror = done;
    img.src = HERO_POSTER;
    if (img.complete) done();
  });
}

function documentReadyWeight(): number {
  if (typeof document === "undefined") return 0;
  if (document.readyState === "complete") return 0.35;
  if (document.readyState === "interactive") return 0.22;
  return 0.08;
}

/**
 * Cinematic brand intro on first home visit (works with /en and /fa).
 * Progress tracks critical above-the-fold readiness — not the full page
 * or the hero video file.
 */
export function SiteIntro() {
  const pathname = usePathname() || "/";
  const locale = useLocale();
  const dict = getDictionarySync(locale);
  const { pathname: bare } = stripLocalePrefix(pathname);
  const isHome = bare === "/";
  const isAdmin = pathname.startsWith("/admin");

  // SSR defaults to "in" on home; client layout-effect corrects skips before paint.
  const [phase, setPhase] = useState<Phase>(() =>
    !INTRO_ENABLED || !isHome || isAdmin ? "done" : "in",
  );
  const [progress, setProgress] = useState(0);

  const lockedRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);
  const skipRef = useRef(false);
  const progressRef = useRef(0);

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
    let raf = 0;
    let posterReady = false;
    let fontsReady = false;
    let exitStarted = false;
    const startedAt = performance.now();

    const finish = () => {
      if (finished) return;
      finished = true;
      if (raf) cancelAnimationFrame(raf);
      if (exitTimerRef.current != null) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      markSeen();
      release();
      setPhase("done");
    };

    const beginExit = () => {
      if (finished || exitStarted) return;
      exitStarted = true;
      setProgress(1);
      progressRef.current = 1;
      setPhase("out");
      exitTimerRef.current = window.setTimeout(() => {
        finish();
      }, EXIT_MS);
    };

    setPhase("in");
    setProgress(0);
    progressRef.current = 0;

    try {
      acquire();
    } catch (err) {
      release();
      throw err;
    }

    void loadHeroPoster().then(() => {
      posterReady = true;
    });

    // Fonts are nice-to-have; never stall the intro on them.
    if (document.fonts?.ready) {
      void Promise.race([
        document.fonts.ready.then(() => {
          fontsReady = true;
        }),
        new Promise<void>((r) => {
          window.setTimeout(r, 280);
        }),
      ]);
    } else {
      fontsReady = true;
    }

    const onReadyState = () => {
      /* readiness re-read each frame */
    };
    document.addEventListener("readystatechange", onReadyState);

    const tick = (now: number) => {
      if (finished) return;

      const elapsed = now - startedAt;
      const ready =
        documentReadyWeight() +
        (posterReady ? 0.45 : 0) +
        (fontsReady ? 0.12 : 0);

      // Soft time curve so progress feels alive without inventing a long wait.
      const timeCurve = Math.min(1, elapsed / TARGET_MS);
      let target = Math.min(0.92, ready * 0.55 + timeCurve * 0.45);

      const criticalReady = posterReady && document.readyState !== "loading";
      const pastMin = elapsed >= MIN_MS;

      if (criticalReady && pastMin) {
        target = 1;
      } else if (elapsed >= TARGET_MS && criticalReady) {
        target = 1;
      }

      // If poster is stuck but DOM is ready past target window, still exit.
      if (elapsed >= TARGET_MS && document.readyState === "complete") {
        target = 1;
      }

      const current = progressRef.current;
      const next = current + (target - current) * 0.14;
      progressRef.current = next;
      setProgress(next);

      if (next >= 0.995 && target >= 1) {
        beginExit();
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const ceilingTimer = window.setTimeout(() => {
      beginExit();
      // Hard finish if exit animation is also starved.
      window.setTimeout(finish, EXIT_MS + 80);
    }, CEILING_MS);

    const onIntent = () => {
      beginExit();
      // Intent dismisses immediately after a short fade.
    };

    window.addEventListener("keydown", onIntent);
    window.addEventListener("wheel", onIntent, { passive: true });
    window.addEventListener("touchstart", onIntent, { passive: true });
    window.addEventListener("pointerdown", onIntent);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(ceilingTimer);
      if (exitTimerRef.current != null) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      document.removeEventListener("readystatechange", onReadyState);
      window.removeEventListener("keydown", onIntent);
      window.removeEventListener("wheel", onIntent);
      window.removeEventListener("touchstart", onIntent);
      window.removeEventListener("pointerdown", onIntent);
      if (lockedRef.current) markSeen();
      release();
    };
  }, [isHome, isAdmin, pathname]);

  if (phase === "done") return null;

  // Suggested beat: brand 0–30%, bar 30–90%, tagline 90–100%.
  const brandOpacity = Math.min(1, progress / 0.28);
  const brandY = (1 - brandOpacity) * 10;
  const barProgress = Math.min(1, Math.max(0, (progress - 0.28) / 0.62));
  const taglineOpacity =
    progress >= 0.88 ? Math.min(1, (progress - 0.88) / 0.1) : 0;
  const taglineY = (1 - taglineOpacity) * 6;

  return (
    <div
      data-site-intro
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center overflow-hidden",
        "bg-brand-navy-deep",
        "transition-[opacity,transform] duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        phase === "out"
          ? "pointer-events-none -translate-y-[3.5%] opacity-0"
          : "translate-y-0 opacity-100",
      )}
      role="presentation"
      aria-hidden={phase === "out"}
    >
      <div
        className="relative z-10 flex w-full max-w-[18rem] flex-col items-center px-6 sm:max-w-[22rem]"
        dir="ltr"
      >
        <p
          className="font-hero-slogan text-center text-[clamp(1.35rem,3.6vw,1.85rem)] font-semibold uppercase leading-none tracking-[0.08em] text-brand-cream"
          style={{
            opacity: brandOpacity,
            transform: `translate3d(0, ${brandY}px, 0)`,
          }}
        >
          {dict.brand}
        </p>

        <div
          className="mt-8 h-px w-full max-w-[11rem] overflow-hidden bg-brand-cream/15 sm:mt-9 sm:max-w-[13rem]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label="Loading"
        >
          <div
            className="h-full origin-left bg-brand-orange"
            style={{
              transform: `scaleX(${barProgress})`,
              opacity: brandOpacity > 0.4 ? 1 : 0.35,
            }}
          />
        </div>

        <p
          className="mt-5 font-mono text-[9px] uppercase tracking-[0.32em] text-brand-cream/55 sm:mt-6 sm:text-[10px] sm:tracking-[0.36em]"
          style={{
            opacity: taglineOpacity,
            transform: `translate3d(0, ${taglineY}px, 0)`,
          }}
        >
          {dict.intro.tagline}
        </p>
      </div>
    </div>
  );
}
