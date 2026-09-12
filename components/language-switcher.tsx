"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LOCALES, swapLocalePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Ultra-minimal locale control — Apple-style: only the *other* language
 * as quiet text. No pill, no globe, no dual chip.
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

  return (
    <Link
      href={swapLocalePath(current, target)}
      hrefLang={target === "fa" ? "fa-IR" : "en"}
      lang={target}
      onClick={onNavigate}
      aria-label={aria}
      className={cn(
        "shrink-0 text-[11px] font-medium leading-none tracking-wide",
        "transition-opacity duration-200",
        "focus-visible:outline-none focus-visible:opacity-100",
        onDarkHero
          ? "text-white/70 hover:text-white"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {label}
    </Link>
  );
}
