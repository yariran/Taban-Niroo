"use client";

import { RevealBlock } from "@/components/ui/reveal-text";
import { RevealWords } from "@/components/ui/reveal-words";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { Beat } from "@/components/ui/beat";
import { BEAT, EVIDENCE, STATEMENT } from "@/lib/motion-roles";
import type { ContentBlock } from "@/lib/cms-content";
import { resolveKpis, type Kpi } from "@/lib/home-kpis";
import { cn } from "@/lib/utils";

/**
 * Proof band — editorial metrics under the hero.
 *
 * Motion phrase (same grammar as the rest of home):
 *   eyebrow  → evidence tick
 *   headline → statement word-lift (title card)
 *   lede     → blur focus-pull (cinematic plate)
 *   figures  → slower staggered settle (instrument readout, not a card grid)
 *
 * Reads `home.proof`, falling back to `home.whyTaban` — see `resolveKpis`.
 */

/** Figures need more air than `EVIDENCE` — large numbers read as statements. */
const FIGURE = {
  distance: 36,
  duration: 980,
  stagger: 110,
} as const;

/** Split a KPI into figure + optional unit (e.g. 6–1000 + kV). */
function figureParts(kpi: Kpi): { figure: string; unit?: string } {
  if (kpi.value) {
    const raw = kpi.value.replace(/-/g, "–").trim();
    const withUnit = raw.match(/^(.*?)\s*(kV)\s*$/i);
    if (withUnit) {
      return { figure: withUnit[1].trim(), unit: "kV" };
    }
    return { figure: raw };
  }
  if (kpi.prefix === "+" || kpi.suffix === "+") {
    return { figure: `+${kpi.to}` };
  }
  return { figure: `${kpi.prefix ?? ""}${kpi.to}${kpi.suffix ?? ""}` };
}

export function ProofBandSection({
  cms,
  legacy,
}: {
  cms?: ContentBlock;
  /** `home.whyTaban` — pre-split fallback source for the KPI items. */
  legacy?: ContentBlock;
} = {}) {
  const kpis = resolveKpis(cms, legacy);

  return (
    <section
      id="proof"
      className="relative overflow-hidden bg-brand-navy-deep"
      aria-labelledby="proof-heading"
    >
      <div className="grain-layer" aria-hidden />

      <Beat className="relative px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-36">
        <div className="mx-auto max-w-6xl">
          {/*
            Hardcoded English editorial copy (same stance as the previous
            lede). `dir="ltr"` keeps word reveals correct on the FA page.
          */}
          <header className="max-w-xl" dir="ltr">
            <RevealBlock
              delayMs={BEAT.first}
              durationMs={EVIDENCE.duration}
              distance={EVIDENCE.distance}
            >
              <p className="type-hig-label text-brand-orange">
                Engineering record
              </p>
            </RevealBlock>

            <span id="proof-heading" className="sr-only">
              +24 Years of Engineering
            </span>
            <RevealWords
              as="h2"
              delay={BEAT.headline}
              duration={STATEMENT.duration}
              stagger={72}
              className="type-hig-title mt-5 block text-brand-cream"
            >
              +24 Years of Engineering
            </RevealWords>

            <BlurReveal
              as="p"
              delayMs={BEAT.lede}
              durationMs={920}
              stepMs={36}
              blurPx={8}
              className="type-hig-lede mt-5 max-w-md text-brand-cream/65"
            >
              Proven on energised networks across markets.
            </BlurReveal>
          </header>

          <RevealBlock
            as="dl"
            delayMs={BEAT.group}
            distance={FIGURE.distance}
            durationMs={FIGURE.duration}
            stagger={FIGURE.stagger}
            className={cn(
              "mt-16 grid grid-cols-1 gap-y-12 sm:mt-20",
              "sm:grid-cols-2 sm:gap-x-16 sm:gap-y-16",
              "md:mt-24 md:gap-x-24 md:gap-y-20 lg:gap-x-32",
            )}
            dir="ltr"
          >
            {kpis.map((kpi) => {
              const { figure, unit } = figureParts(kpi);
              return (
                <div key={kpi.label} className="flex flex-col gap-3 sm:gap-3.5">
                  <dd
                    className={cn(
                      "type-hig-display flex items-baseline gap-[0.28em] text-brand-cream tabular-nums",
                      "text-[clamp(2rem,4.8vw,3rem)]",
                      "whitespace-nowrap",
                    )}
                  >
                    <span>{figure}</span>
                    {unit ? (
                      <span className="text-[0.38em] font-medium tracking-[0.06em] text-brand-cream/55">
                        {unit}
                      </span>
                    ) : null}
                  </dd>
                  <dt className="type-hig-label text-brand-orange/90">
                    {kpi.label}
                  </dt>
                </div>
              );
            })}
          </RevealBlock>
        </div>
      </Beat>

      <div className="voltage-flow" aria-hidden />
    </section>
  );
}
