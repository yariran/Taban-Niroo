"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LOCALES, swapLocalePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, string> = {
  en: "EN",
  fa: "فارسی",
};

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

/**
 * Path-preserving language control — swaps only the first locale segment.
 * Real `<Link>`s (crawlable / middle-clickable), not a JS-only button.
 */
export function LanguageSwitcher({
  className,
  onDarkHero = false,
  onNavigate,
}: {
  className?: string;
  onDarkHero?: boolean;
  /** e.g. close the mobile drawer after a locale tap */
  onNavigate?: () => void;
}) {
  const pathname = usePathname() || "/";
  const current = usePathWithExtras();
  const activeLocale = ((): Locale => {
    const seg = pathname.split("/")[1];
    return LOCALES.includes(seg as Locale) ? (seg as Locale) : "en";
  })();

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-full border px-1 py-0.5",
        "backdrop-blur-sm transition-colors",
        onDarkHero
          ? "border-white/20 bg-white/10"
          : "border-border/80 bg-background/60",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((code) => {
        const active = code === activeLocale;
        return (
          <Link
            key={code}
            href={swapLocalePath(current, code)}
            hrefLang={code === "fa" ? "fa-IR" : "en"}
            lang={code === "fa" ? "fa" : "en"}
            onClick={onNavigate}
            className={cn(
              "rounded-full px-2 py-1 text-[10px] font-medium leading-none transition-colors",
              code === "en" && "font-mono tracking-[0.14em]",
              code === "fa" && "font-fa text-[11px] tracking-normal",
              active
                ? onDarkHero
                  ? "bg-white/20 text-white"
                  : "bg-foreground/10 text-brand-navy"
                : onDarkHero
                  ? "text-white/50 hover:text-white/85"
                  : "text-muted-foreground hover:text-brand-burgundy",
            )}
            aria-current={active ? "true" : undefined}
            aria-label={
              code === "fa" ? "Switch to Persian" : "Switch to English"
            }
          >
            {LABELS[code]}
          </Link>
        );
      })}
    </div>
  );
}
