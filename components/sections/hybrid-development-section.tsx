"use client";

import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsText } from "@/lib/cms-resolve";

/**
 * Hybrid insulator development — the porcelain-core / silicone-housing
 * chapter, in development since 2009.
 *
 * Three narrative sub-chapters (why the technology, how it scaled from
 * line post to station post, how it is recognised by standard) followed
 * by the spec-style benefit list. The standards references —
 * IEC/TS 62896 and the NRI national standard — are load-bearing claims;
 * do not soften or generalise them without a source.
 */

type Chapter = {
  title: string;
  body: string;
};

const CHAPTERS: readonly Chapter[] = [
  {
    title: "Why hybrid technology matters",
    body: "Conventional porcelain insulators are strong but pollution-vulnerable and prone to brittle failure. Standard composite insulators are lightweight and pollution-resistant but can't always match porcelain's mechanical rigidity under bending, torsion, and compression loads. Hybrid insulators are engineered to combine both — without the compromises of either technology alone.",
  },
  {
    title: "From line post to station post",
    body: "Our R&D team spent more than a year developing our original hybrid line post and pin insulator design, using electrical field simulation to optimize field distribution and minimize partial discharge risk around end fittings. That work has since been extended to hybrid solid-core station post insulators — engineered for HVAC air-insulated substation applications up to 420 kV, with electrical field analysis confirming safe field distribution at the critical fitting interfaces.",
  },
  {
    title: "Recognized by national standard",
    body: "Our hybrid post insulator design has passed the full range of electrical and mechanical type tests required under existing composite and porcelain post standards, along with long-term natural ageing and pollution performance testing. In Iran, hybrid insulator technology is recognized under a national standard developed by researchers at the Niroo Research Institute (NRI) — the same technical foundation reflected in the international IEC/TS 62896 standard specifically developed for hybrid insulators.",
  },
];

const IN_SERVICE =
  "Several of our hybrid post insulator installations are in service at 420 kV AC substations across a range of environmental conditions, and continue to perform reliably without the need for regular washing — a direct result of the pollution-resistant silicone housing combined with a mechanically robust porcelain core.";

const BENEFITS: readonly string[] = [
  "High & reliable mechanical strength",
  "Protected creepage distance",
  "Suitability for heavy pollution and dust environments",
  "No need for regular washing",
  "Long service life",
  "Lighter weight than conventional ceramic insulators at equivalent creepage distance",
];

export function HybridDevelopmentSection({ cms }: { cms?: ContentBlock } = {}) {
  const eyebrow = cmsText(cms, "eyebrow", "Hybrid insulator development");
  const title = cmsText(cms, "title", "More than a decade");
  const titleLine2 = cmsText(cms, "titleLine2", "of hybrid engineering");
  const lead = cmsText(
    cms,
    "body",
    "Taban Niroo was one of the first manufacturers to design and manufacture hybrid line post and pin-type insulators, in use since 2009. Hybrid insulators combine a porcelain core — delivering the mechanical strength, rigidity, and long-term dimensional stability porcelain is known for — with a silicone rubber housing, delivering the pollution resistance and hydrophobicity that porcelain alone cannot offer.",
  );

  const cmsItems =
    cms?.items?.filter((i) => i.label.trim() && i.body?.trim()) ?? [];
  const chapters: readonly Chapter[] =
    cmsItems.length > 0
      ? cmsItems.map((i) => ({ title: i.label, body: i.body!.trim() }))
      : CHAPTERS;

  return (
    <section className="bg-background" aria-labelledby="hybrid-heading">
      <div className="px-6 py-20 md:px-12 md:py-24 lg:px-20 lg:py-28">
        <div className="border-t border-border pt-12 md:pt-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
            {eyebrow}
          </p>

          <h2 id="hybrid-heading" className="mt-4 max-w-3xl">
            <RevealText
              as="span"
              className="block font-hero-slogan text-brand-heading text-3xl font-bold uppercase leading-[1.05] tracking-tight md:text-4xl lg:text-5xl"
            >
              {title}
            </RevealText>
            <RevealText
              as="span"
              delayMs={140}
              className="block font-hero-slogan text-brand-heading text-3xl font-bold uppercase leading-[1.05] tracking-tight md:text-4xl lg:text-5xl"
            >
              {titleLine2}
            </RevealText>
          </h2>

          <RevealBlock>
            <p className="mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:mt-10 md:text-lg">
              {lead}
            </p>
          </RevealBlock>

          <RevealBlock as="ul" className="mt-12 md:mt-16">
            {chapters.map((chapter) => (
              <li
                key={chapter.title}
                className="grid gap-3 border-t border-border py-8 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-12 md:py-10"
              >
                <h3 className="text-base font-medium text-brand-heading md:text-lg">
                  {chapter.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {chapter.body}
                </p>
              </li>
            ))}
          </RevealBlock>

          <RevealBlock>
            <p className="mt-4 max-w-3xl border-t border-border pt-10 text-base leading-relaxed text-muted-foreground md:pt-12 md:text-lg">
              {IN_SERVICE}
            </p>
          </RevealBlock>

          <p className="mt-14 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-burgundy md:mt-16">
            In short, our hybrid insulators offer
          </p>
          <RevealBlock
            as="ul"
            className="mt-6 grid border-t border-border sm:grid-cols-2 lg:grid-cols-3"
          >
            {BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="border-b border-border py-5 pe-6 text-sm leading-relaxed text-muted-foreground md:text-base"
              >
                {benefit}
              </li>
            ))}
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
