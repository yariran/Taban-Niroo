"use client";

import { RevealBlock } from "@/components/ui/reveal-text";
import { RevealUp } from "@/components/ui/reveal-words";
import { Beat } from "@/components/ui/beat";
import { TechRef } from "@/components/ui/tech-ref";
import { useLocale } from "@/components/locale-link";
import { BEAT, EVIDENCE, STATEMENT } from "@/lib/motion-roles";
import type { ContentBlock } from "@/lib/cms-content-types";
import { cmsText } from "@/lib/cms-resolve";
import {
  ENGINEERING_FEATURES,
  ENGINEERING_PATENTS_BRIEF,
  ENGINEERING_PATENTS_HEADER,
  pickLocale,
} from "@/lib/i18n/section-copy";
import { pageHeadingScale } from "@/lib/i18n/type-scale";
import { cn } from "@/lib/utils";

export function EngineeringDetailSection({
  cms,
}: { cms?: ContentBlock } = {}) {
  const locale = useLocale();
  const features = pickLocale(ENGINEERING_FEATURES, locale);
  const patentsBrief = pickLocale(ENGINEERING_PATENTS_BRIEF, locale);
  const patentsHeader = pickLocale(ENGINEERING_PATENTS_HEADER, locale);

  const eyebrow = cmsText(cms, "eyebrow", "Engineering DNA");
  const title = cmsText(
    cms,
    "title",
    "The magical features | of silicone rubber.",
  );
  const titleForReveal = title.includes("|")
    ? title
    : title.replace(/\.\s+/, ". | ");
  const body = cmsText(
    cms,
    "body",
    "Two material-level advantages set silicone composite insulators apart from porcelain and glass — and drive every line of our product specification.",
  );

  return (
    <section
      id="engineering"
      className="bg-background"
      aria-labelledby="engineering-heading"
    >
      {/*
        Two beats, not one. This section is roughly two viewports tall and
        carries two separate sub-arguments (silicone properties / patents).
        On a single clock the lower group finishes animating far off
        screen. Repeating the same statement+evidence pair is also where
        the grammar becomes audible as a grammar rather than a one-off.

        It used to be three: a "Raw material — Three components. One
        product." bento grid sat between these two. That argument now has
        its own chapter, `materials-scrollytelling-section.tsx`, which
        tells the same three layers against a held cutaway instead of in
        three static tiles. Do not reintroduce it here — the page would
        state the same three ingredients twice, two viewports apart.
      */}
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <Beat>
          <div className="max-w-3xl">
            <RevealBlock
              delayMs={BEAT.first}
              durationMs={EVIDENCE.duration}
              distance={EVIDENCE.distance}
            >
              <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                {eyebrow}
              </p>
            </RevealBlock>
            <span id="engineering-heading" className="sr-only">
              {title.replace(/\s*\|\s*/g, " ")}
            </span>
            {/* `|` is the CMS author's line-break marker — kept as real
                block lines so the intended break survives. */}
            <RevealUp
              as="h2"
              delay={BEAT.headline}
              duration={STATEMENT.duration}
              distance={STATEMENT.distance}
              className={cn(
                "font-hero-slogan text-brand-heading mt-4 font-semibold uppercase tracking-tight",
                pageHeadingScale(locale),
              )}
            >
              {titleForReveal.split(/\s*\|\s*/).map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </RevealUp>
            <RevealBlock
              delayMs={BEAT.lede}
              durationMs={EVIDENCE.duration}
              distance={EVIDENCE.distance}
            >
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {body}
              </p>
            </RevealBlock>
          </div>

          <RevealBlock
            stagger={EVIDENCE.stagger}
            delayMs={BEAT.group}
            durationMs={EVIDENCE.duration}
            distance={EVIDENCE.distance}
            className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-5 md:gap-6"
          >
            {features.map((feature, i) => (
              <article
                key={feature.title}
                className={cn(
                  "rounded-2xl border p-8 transition-shadow duration-300 md:p-10",
                  /* Dimensional Layering: elevation encodes rank instead of
                     every card sharing one shadow. The lead claim sits a step
                     higher; the second reads as supporting evidence. */
                  i === 0
                    ? "md:col-span-3 border-border/60 bg-card shadow-elevate"
                    : "md:col-span-2 border-border/50 bg-card/70 shadow-card-rest",
                  "hover:shadow-card-hover dark:border-white/[0.08] dark:bg-card/50",
                )}
              >
                <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                  {feature.eyebrow}
                </p>
                <h3
                  className={cn(
                    "mt-4 font-medium tracking-tight text-brand-navy",
                    i === 0 ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
                  )}
                >
                  {feature.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </RevealBlock>
          </Beat>

          <Beat className="mt-24 md:mt-32">
            <div id="patents" className="flex flex-col gap-3 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <RevealBlock
                  delayMs={BEAT.first}
                  durationMs={EVIDENCE.duration}
                  distance={EVIDENCE.distance}
                >
                  <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                    {patentsHeader.eyebrow}
                  </p>
                </RevealBlock>
                <RevealUp
                  as="h3"
                  delay={BEAT.headline}
                  duration={STATEMENT.duration}
                  distance={STATEMENT.distance}
                  className="mt-3 text-2xl font-medium tracking-tight text-brand-navy md:text-3xl"
                >
                  {patentsHeader.title}
                </RevealUp>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                {patentsHeader.body}
              </p>
            </div>

            <RevealBlock
              stagger={EVIDENCE.stagger}
              delayMs={BEAT.group}
              durationMs={EVIDENCE.duration}
              distance={EVIDENCE.distance}
              /**
               * Swiss Modernism 2.0 — ui-ux-pro-max › styles.csv, to spec.
               *
               * Database values, verbatim:
               *   grid-template-columns: repeat(12, 1fr)  → grid-cols-12
               *   gap: 1rem (8px base unit)               → gap-4, 8px multiples
               *   --border-radius: 0px, "no decorations"  → no cards, rules only
               *   single accent only                      → the one gold
               *   font-family: Inter/Helvetica            → project body font
               *
               * This is the record's own "Best For: corporate sites,
               * professional services, documentation", and it is what the
               * --design-system generator picked for this product in the first
               * place. Editorial Grid / Magazine was the wrong call here: its
               * checklist wants pull quotes, drop caps, multi-column text and
               * large imagery — none of which a three-line patent register
               * has — and its record explicitly lists "short-form content"
               * under Do Not Use For.
               *
               * Column assignment (of 12): index 1-2 · title 3-8 · class 9-12.
               */
              className="mt-4 flex flex-col"
            >
              {patentsBrief.map((patent) => (
                <article
                  key={patent.id}
                  className="group grid grid-cols-12 items-baseline gap-4 border-b border-border py-6 transition-colors duration-300 hover:border-brand-burgundy md:py-8 dark:border-white/[0.08]"
                >
                  {/* This numeral replaced the old "Patent 01" caption, so it
                      is now the only thing carrying the register index — it
                      cannot be a ghost. A tint faint enough to look decorative
                      measured 1.1:1 against the page; these tones hold 5.8:1
                      in light and 6.3:1 in dark. */}
                  <span className="col-span-2 font-mono text-2xl tabular-nums text-muted-foreground transition-colors duration-300 group-hover:text-brand-burgundy md:text-4xl dark:text-white/55">
                    {patent.id}
                  </span>
                  <h4 className="col-span-10 text-lg font-medium tracking-tight text-brand-navy md:col-span-6 md:text-2xl">
                    <TechRef className="font-medium font-sans">
                      {patent.title}
                    </TechRef>
                  </h4>
                  <p className="col-span-10 col-start-3 text-xs uppercase tracking-widest text-brand-burgundy md:col-span-4 md:col-start-9 md:text-end">
                    {patent.subtitle}
                  </p>
                </article>
              ))}
            </RevealBlock>
          </Beat>
        </div>
      </div>
    </section>
  );
}
