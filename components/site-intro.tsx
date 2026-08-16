"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/body-scroll-lock";

const STORAGE_KEY = "tn-intro-seen";
const HOLD_MS = 1900;
const EXIT_MS = 750;

type Phase = "in" | "out" | "done";

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
 * Full-viewport brand plate on first home visit of a session.
 * Site renders underneath; this layer locks scroll, then fades away.
 * Skipped on admin, non-home routes, reduced-motion, and return visits.
 */
export function SiteIntro() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  /* Same initial value on server and client to avoid hydration mismatch.
     Return visits are hidden pre-paint via `html[data-tn-intro=done]` CSS
     (set by the inline script in layout), then cleared in the effect. */
  const [phase, setPhase] = useState<Phase>(() =>
    isHome && !isAdmin ? "in" : "done",
  );

  useEffect(() => {
    if (!isHome || isAdmin || alreadySeen() || prefersReducedMotion()) {
      if (isHome && !isAdmin && prefersReducedMotion()) markSeen();
      setPhase("done");
      return;
    }

    setPhase("in");
    lockBodyScroll();

    const hold = window.setTimeout(() => setPhase("out"), HOLD_MS);
    return () => {
      window.clearTimeout(hold);
      unlockBodyScroll();
    };
  }, [isHome, isAdmin]);

  useEffect(() => {
    if (phase !== "out") return;

    const end = window.setTimeout(() => {
      markSeen();
      unlockBodyScroll();
      setPhase("done");
    }, EXIT_MS);

    return () => window.clearTimeout(end);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      data-site-intro
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center overflow-hidden",
        "bg-[#F4F5F6] dark:bg-[#0A0B0D]",
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        phase === "out"
          ? "pointer-events-none -translate-y-[4%] opacity-0"
          : "translate-y-0 opacity-100",
      )}
      role="presentation"
      aria-hidden={phase === "out"}
    >
      <IntroPattern className="pointer-events-none absolute inset-0 text-[#C5C8CC] dark:text-[#2A2D32]" />

      <div
        className={cn(
          "relative z-10 flex items-center gap-3.5 px-6",
          "animate-[intro-mark-in_0.9s_var(--ease-entrance)_both]",
        )}
      >
        <span
          className="flex size-10 shrink-0 items-center justify-center bg-brand-navy-deep text-brand-cream dark:bg-brand-cream dark:text-brand-navy-deep sm:size-11"
          aria-hidden
        >
          <svg
            viewBox="0 0 32 32"
            className="size-5 sm:size-[1.35rem]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 8h18v3.2H18.4V24h-4.8V11.2H7V8Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="font-hero-slogan text-[1.35rem] font-semibold uppercase tracking-[0.14em] text-brand-navy-deep dark:text-brand-cream sm:text-[1.55rem] sm:tracking-[0.16em]">
          Taban Niroo
        </span>
      </div>
    </div>
  );
}

/** Soft interlocking curves — atmosphere only, not a product diagram. */
function IntroPattern({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.55">
        <path d="M-40 220 C 180 80, 320 420, 520 280 S 820 40, 980 220 S 1280 480, 1520 300" />
        <path d="M-60 480 C 160 340, 340 620, 560 500 S 860 280, 1040 460 S 1320 720, 1540 540" />
        <path d="M-20 720 C 200 580, 400 860, 640 720 S 960 500, 1180 680 S 1400 900, 1560 760" />
        <path d="M120 -40 C 280 120, 200 280, 380 360 S 700 280, 760 480 S 900 760, 1100 820" />
        <path d="M680 -20 C 820 140, 740 300, 900 400 S 1180 340, 1280 560 S 1360 820, 1480 880" />
        <path d="M40 900 C 220 760, 360 980, 560 860 S 880 640, 1020 820" />
      </g>
    </svg>
  );
}
