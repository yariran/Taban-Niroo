"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  forwardRef,
  type ComponentProps,
} from "react";
import {
  DEFAULT_LOCALE,
  isLocale,
  localeHref,
  stripLocalePrefix,
  type Locale,
} from "@/lib/i18n";

function useLocalePath() {
  const pathname = usePathname() || "/";
  const { locale, pathname: bare } = stripLocalePrefix(pathname);
  return {
    locale: (locale ?? DEFAULT_LOCALE) as Locale,
    barePath: bare || "/",
  };
}

export function useLocale(): Locale {
  return useLocalePath().locale;
}

export function useBarePath(): string {
  return useLocalePath().barePath;
}

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  locale?: Locale;
};

/**
 * Locale-aware Link via `localeHref(lang, path)`.
 */
export const LocaleLink = forwardRef<HTMLAnchorElement, LocaleLinkProps>(
  function LocaleLink({ href, locale: localeProp, ...props }, ref) {
    const { locale: current } = useLocalePath();
    const locale = localeProp ?? current;

    let nextHref = href;
    if (
      typeof href === "string" &&
      href.startsWith("/") &&
      !href.startsWith("/admin") &&
      !href.startsWith("/api") &&
      !href.startsWith("/_next")
    ) {
      const { pathname: bare } = stripLocalePrefix(href);
      const path = isLocale(href.split("/")[1] ?? "") ? bare : href;
      nextHref = localeHref(locale, path || "/");
    }

    return <Link ref={ref} href={nextHref} {...props} />;
  },
);
