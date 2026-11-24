"use client";

import { LocaleLink, useLocale } from "@/components/locale-link";
import { RevealWords, RevealUp } from "@/components/ui/reveal-words";
import { getDictionarySync } from "@/lib/i18n/dictionary-catalog";

/**
 * 404 copy block.
 *
 * Split out of `app/not-found.tsx` so the page itself stays a Server
 * Component (it renders the async `SiteHeader`) while the copy still
 * reads the locale off the URL — a 404 under `/fa/...` keeps its
 * prefix, which a hardcoded `/en` link used to throw away.
 */
export function NotFoundCopy() {
  const dict = getDictionarySync(useLocale());

  return (
    <>
      <p className="text-xs uppercase tracking-widest text-muted-foreground tabular">
        404
      </p>
      <h1 className="mt-4 max-w-md font-hero-slogan text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
        <RevealWords as="span">{dict.ui.notFoundTitle}</RevealWords>
      </h1>
      <RevealUp className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {dict.ui.notFoundBody}
      </RevealUp>
      <LocaleLink
        href="/"
        className="mt-10 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-burgundy"
      >
        {dict.ui.backToHome}
      </LocaleLink>
    </>
  );
}
