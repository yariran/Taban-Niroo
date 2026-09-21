"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LOCALES,
  isLocalePubliclyEnabled,
  swapLocalePath,
  type Locale,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Ultra-minimal locale control — Apple-style: only the *other* language
 * as quiet text. No pill, no globe, no dual chip.
 *
 * When FA is parked, tapping «فارسی» swaps the label in place to «به زودی».
 * Same typography as the idle locale link so the header chrome never shifts.
 */
function usePathWithExtras(): string {
  const pathname = usePathname() || "/";
  const [extras, setExtras] = useState({ search: "", hash: "" });

  useEffect(() => {
    const sync = () => {
      setExtras({
        search: window.location.search,
        hash: window.location.hash,
      });
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [pathname]);

  return `${pathname}${extras.search}${extras.hash}`;
}

const labelClass = (onDarkHero: boolean, className?: string, muted = false) =>
  cn(
    "shrink-0 text-[11px] font-medium leading-none tracking-wide",
    "transition-opacity duration-200",
    "focus-visible:outline-none focus-visible:opacity-100",
    onDarkHero
      ? muted
        ? "cursor-pointer text-white/70 hover:text-white"
        : "text-white/70 hover:text-white"
      : muted
        ? "cursor-pointer text-muted-foreground hover:text-foreground"
        : "text-muted-foreground hover:text-foreground",
    className,
  );

function ParkedPersianControl({
  onDarkHero,
  className,
}: {
  onDarkHero: boolean;
  className?: string;
}) {
  const [soon, setSoon] = useState(false);

  useEffect(() => {
    if (!soon) return;
    const t = window.setTimeout(() => setSoon(false), 2400);
    return () => window.clearTimeout(t);
  }, [soon]);

  return (
    <button
      type="button"
      lang="fa"
      className={labelClass(onDarkHero, className, true)}
      aria-label="نسخه فارسی به زودی"
      aria-pressed={soon}
      onClick={() => setSoon((v) => !v)}
    >
      {soon ? "به زودی" : "فارسی"}
    </button>
  );
}

export function LanguageSwitcher({
  className,
  onDarkHero = false,
  onNavigate,
}: {
  className?: string;
  onDarkHero?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname() || "/";
  const current = usePathWithExtras();
  const activeLocale = ((): Locale => {
    const seg = pathname.split("/")[1];
    return LOCALES.includes(seg as Locale) ? (seg as Locale) : "en";
  })();

  const target: Locale = activeLocale === "en" ? "fa" : "en";
  const label = target === "fa" ? "فارسی" : "English";
  const aria =
    target === "fa" ? "Switch to Persian" : "Switch to English";
  const enabled = isLocalePubliclyEnabled(target);

  if (!enabled) {
    return (
      <ParkedPersianControl onDarkHero={onDarkHero} className={className} />
    );
  }

  return (
    <Link
      href={swapLocalePath(current, target)}
      hrefLang={target === "fa" ? "fa-IR" : "en"}
      lang={target}
      onClick={onNavigate}
      aria-label={aria}
      className={labelClass(onDarkHero, className)}
    >
      {label}
    </Link>
  );
}
