"use client";

import { BlurReveal } from "@/components/ui/blur-reveal";
import { RevealWords, RevealUp } from "@/components/ui/reveal-words";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsText } from "@/lib/cms-resolve";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Act I — the opening frame of the R&D page.
 *
 * Replaces the plain text hero with a held shot of the factory floor and the
 * page thesis pulling into focus over it. Carries exactly the same
 * `blog.hero` CMS fields as the hero it replaces, so nothing the client can
 * edit is lost and `/admin` needs no change.
 *
 * Under `prefers-reduced-motion` it falls back to that original text hero:
 * same copy, same heading level, no video, no focus-pull.
 */
export function RnDCinemaOpening({ cms }: { cms?: ContentBlock } = {}) {
  const reduceMotion = usePrefersReducedMotion();

  const eyebrow = cmsText(cms, "eyebrow", "Blog – R&D");
  const title1 = cmsText(cms, "title", "Research, testing,");
  const title2 = cmsText(cms, "titleLine2", "and field experience.");
  const body = cmsText(
    cms,
    "body",
    "Taban Niroo’s Research & Development team focuses on the design and development of products that deliver additional value under demanding electrical and environmental conditions. Our work is guided by IEC standards and continuous feedback from the field.",
  );

  if (reduceMotion) {
    return (
      <section className="bg-background">
        <div className="px-6 pt-28 pb-20 md:px-12 md:pt-32 md:pb-24 lg:px-20 lg:pt-36 lg:pb-28">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-hero-slogan text-brand-heading text-3xl font-bold uppercase tracking-tight md:text-4xl lg:text-5xl">
            <RevealWords as="span" className="block">
              {title1}
            </RevealWords>
            <RevealWords as="span" className="block" delay={140}>
              {title2}
            </RevealWords>
          </h1>
          <RevealUp
            as="p"
            delay={420}
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {body}
          </RevealUp>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative isolate flex h-[100svh] min-h-[34rem] flex-col justify-end overflow-hidden bg-brand-navy-deep"
      aria-labelledby="rnd-opening-heading"
    >
      {/* `.cine-grade` sets `position: relative`, so it must sit *inside* the
          absolutely-positioned wrapper — putting both on one element collapses
          it to zero height and the plate never renders. */}
      <div className="absolute inset-0" aria-hidden>
        <div className="cine-grade h-full w-full">
          <video
            className="h-full w-full object-cover"
            src="/videos/industrial.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-navy-deep/75 via-brand-navy-deep/40 to-brand-navy-deep"
        aria-hidden
      />
      <div className="grain-layer" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 md:px-12 md:pb-24 lg:px-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-orange md:text-[11px]">
          {eyebrow}
        </p>
        <h1
          id="rnd-opening-heading"
          className="type-cinema mt-6 max-w-4xl text-[clamp(2rem,5.5vw,4.25rem)] text-brand-cream"
        >
          <BlurReveal as="span" splitBy="char" className="block">
            {title1}
          </BlurReveal>
          <BlurReveal as="span" splitBy="char" delayMs={320} className="block">
            {title2}
          </BlurReveal>
        </h1>
        <BlurReveal
          as="p"
          delayMs={620}
          className="mt-8 max-w-2xl text-[15px] leading-relaxed text-brand-cream/70 md:text-base"
        >
          {body}
        </BlurReveal>
      </div>
    </section>
  );
}
