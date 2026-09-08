"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  DEFAULT_LOCALE,
  dirFor,
  isLocale,
  localeHtmlLang,
  type Locale,
} from "@/lib/i18n";

/**
 * Next soft-navigations do not remount `<html>` from the root layout, so
 * `lang` / `dir` (and body font class) would stick to the first locale.
 * Sync from the URL segment whenever the path changes.
 */
export function LocaleDocumentSync() {
  const pathname = usePathname() || "/";

  useEffect(() => {
    const seg = pathname.split("/")[1] ?? "";
    const locale: Locale = isLocale(seg) ? seg : DEFAULT_LOCALE;
    const html = document.documentElement;
    const body = document.body;

    html.lang = localeHtmlLang(locale);
    html.setAttribute("dir", dirFor(locale));

    if (locale === "fa") {
      body.classList.add("font-fa");
      body.classList.remove("font-sans");
    } else {
      body.classList.add("font-sans");
      body.classList.remove("font-fa");
    }
  }, [pathname]);

  return null;
}
