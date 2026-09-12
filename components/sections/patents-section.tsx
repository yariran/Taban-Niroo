"use client";

import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import { TechRef } from "@/components/ui/tech-ref";
import { useLocale } from "@/components/locale-link";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsText } from "@/lib/cms-resolve";
import { PATENT_CARDS, pickLocale } from "@/lib/i18n/section-copy";
import { pageHeadingScale } from "@/lib/i18n/type-scale";
import { cn } from "@/lib/utils";

/**
 * Patents section — the registered outcome of the R&D story.
 *
 * The three patents listed below are the ones formally documented in the
 * 2025-2026 Company Profile and the General Product Range catalogue. Do
 * not add unregistered products to this list and do not change the
 * titles — they are used verbatim across brand collateral. That is also
 * why the CMS slot (`blog.patents`) exposes only the header fields and
 * never `items`: the cards are brand collateral, not editable copy.
 *
 * Kept intentionally compact (single-row grid) so it sits between the
 * "Why Taban Niroo?" narrative and the testimonial without adding a
 * heavy block to the homepage rhythm. On `/blog` it closes the R&D
 * chapter: overview → shed profile → hybrid → what got registered.
 */
export function PatentsSection({ cms }: { cms?: ContentBlock } = {}) {
  const locale = useLocale();
  const patents = pickLocale(PATENT_CARDS, locale);
  const registeredLabel = locale === "fa" ? "ثبت‌شده" : "Registered";
  const patentLabel = locale === "fa" ? "ثبت اختراع" : "Patent";

  const eyebrow = cmsText(cms, "eyebrow", "Patents & Innovation");
  const title = cmsText(cms, "title", "Three patents.");
  const titleLine2 = cmsText(cms, "titleLine2", "One engineering culture.");
  const lead = cmsText(
    cms,
    "body",
    "Innovations developed in-house, registered, and already deployed on live transmission and distribution networks.",
  );

  return (
    <section
      id="patents"
      className="border-y border-border/50 bg-muted/10 dark:border-white/[0.06] dark:bg-white/[0.015]"
      aria-labelledby="patents-heading"
    >
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
            <div className="max-w-2xl">
              <RevealBlock delayMs={40} durationMs={650} distance={12}>
                <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                  {eyebrow}
                </p>
              </RevealBlock>
              <span id="patents-heading" className="sr-only">
                {`${title} ${titleLine2}`}
              </span>
              {/* `splitLines` splits on "|" — join the two CMS lines with it
                  so an editor never has to know about the delimiter. */}
              <RevealText
                as="h2"
                splitLines
                delayMs={120}
                stepMs={65}
                durationMs={1050}
                className={cn(
                  "mt-4 font-medium tracking-tight text-brand-navy",
                  pageHeadingScale(locale),
                )}
              >
                {`${title} | ${titleLine2}`}
              </RevealText>
            </div>
            <RevealBlock
              delayMs={320}
              durationMs={900}
              distance={20}
              className="max-w-sm"
            >
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {lead}
              </p>
            </RevealBlock>
          </div>

          {/* Patent cards */}
          <RevealBlock
            stagger={140}
            delayMs={260}
            durationMs={950}
            distance={34}
            className="mt-16 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-3 md:gap-6"
          >
            {patents.map((patent) => (
              <article
                key={patent.id}
                className="flex flex-col rounded-2xl border border-border/50 bg-card/90 p-8 shadow-elevate transition-colors duration-300 hover:border-border md:p-10 dark:border-white/[0.08] dark:bg-card/50 dark:hover:border-white/[0.14]"
              >
                <div className="flex items-center justify-between border-b border-border/60 pb-4 dark:border-white/[0.08]">
                  <span className="font-mono text-xs tracking-widest text-brand-burgundy">
                    {patentLabel} {patent.id}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {registeredLabel}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-medium tracking-tight text-brand-navy md:text-2xl">
                  <TechRef className="font-medium font-sans">
                    {patent.title}
                  </TechRef>
                </h3>
                <p className="mt-1 text-xs uppercase tracking-widest text-brand-burgundy">
                  {patent.subtitle}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {patent.description}
                </p>
              </article>
            ))}
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
