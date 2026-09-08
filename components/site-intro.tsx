"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/body-scroll-lock";
import { stripLocalePrefix } from "@/lib/i18n";
import { getDictionarySync } from "@/lib/i18n/dictionary-catalog";
import { useLocale } from "@/components/locale-link";

const STORAGE_KEY = "tn-intro-v2";
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

/** Brand plate on first home visit (works with /en and /fa). */
export function SiteIntro() {
  const pathname = usePathname() || "/";
  const locale = useLocale();
  const dict = getDictionarySync(locale);
  const { pathname: bare } = stripLocalePrefix(pathname);
  const isHome = bare === "/";
  const isAdmin = pathname.startsWith("/admin");

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
