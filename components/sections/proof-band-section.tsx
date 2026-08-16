"use client";

import { CountUp } from "@/components/ui/count-up";
import { RevealBlock } from "@/components/ui/reveal-text";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { Beat } from "@/components/ui/beat";
import { BEAT, EVIDENCE } from "@/lib/motion-roles";
import type { ContentBlock } from "@/lib/cms-content";
import { resolveKpis } from "@/lib/home-kpis";
import { cn } from "@/lib/utils";

/**
 * Proof band — the first thing under the hero.
 *
 * The four headline metrics used to sit inside "Why Taban Niroo?" at position
 * ten of the home feed, behind `HomeDeferred`'s dynamic imports, which meant a
 * first-time visitor met the company's strongest credibility signal only after
 * a long scroll. They now land immediately after the hero.
 *
 * Reads `home.proof`, falling back to `home.whyTaban` for payloads saved
 * before the two were split apart — see `resolveKpis`. The client edits
 * these numbers in exactly one place in `/admin` either way.
 *
 * Renders dark in both themes — same choice the hero's first scene makes — so
 * the opening of the page reads as one continuous cinematic frame rather than
 * a dark hero followed by an abrupt light band.
 */
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

      {/* Exaggerated Minimalism asks for "extreme negative space" and sets
          --spacing-huge: 8rem. lg padding is now exactly that. */}
      <Beat className="relative px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 id="proof-heading" className="sr-only">
            Taban Niroo by the numbers
          </h2>

          <BlurReveal
            as="p"
            delayMs={BEAT.headline}
            className="type-cinema max-w-2xl text-[clamp(1.15rem,2.4vw,1.9rem)] text-brand-cream/85"
          >
            Twenty-nine years of composite insulation, proven on energised
            networks.
          </BlurReveal>

          {/*
            The numbers lean forward while the grain layer behind them
            stays put — that contrast is the depth cue. `data-parallax`
            sits on this wrapper alone: `useElementParallax` writes
            `style.transform`, so it must never share a node with a
            component that also writes one.
          */}
          <div data-parallax="1.08" className="mt-10 md:mt-14">
            <RevealBlock
              as="dl"
              delayMs={BEAT.group}
              distance={EVIDENCE.distance}
              durationMs={EVIDENCE.duration}
              stagger={EVIDENCE.stagger}
              className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/12 pt-10 md:grid-cols-4 md:gap-x-8 md:pt-12"
            >
              {kpis.map((kpi) => (
                <div key={kpi.label} className="flex min-w-0 flex-col">
                  {/*
                    Range metrics ("6-1000 kV") are several times wider than a
                    counted integer, so they get their own step down the scale
                    and are allowed to wrap. At the numeric size they overflow
                    the grid column and collide with the next metric.
                  */}
                  <dd
                    className={cn(
                      // `min-h` matches the numeric line box and `items-end`
                      // bottom-aligns the stepped-down range value with it, so
                      // every label sits on one line across the row.
                      //
                      // Exaggerated Minimalism (ui-ux-pro-max › styles.csv):
                      // font-weight 900 and letter-spacing -0.05em, applied
                      // verbatim. Inter is loaded as a variable font in
                      // app/layout.tsx (no `weight` array), so 900 is real
                      // here — Oswald would not have it, it stops at 700.
                      //
                      // The record's --type-giant is clamp(3rem, 10vw, 12rem).
                      // The upper half of that range does NOT fit this layout
                      // and is deliberately not used: measured against the
                      // 264px column this grid gives each metric at 1440px,
                      // "+80" at 900 weight runs 300px at 10vw (144px) and
                      // 400px at 12rem (192px). 120px is the largest that
                      // clears it, so the ceiling is 7.5rem. The 3rem floor is
                      // the record's own.
                      "order-1 flex min-h-[clamp(3rem,8vw,7.5rem)] items-end font-black tracking-[-0.05em] text-brand-cream tabular-nums",
                      kpi.value
                        ? // Range metrics ("6-1000 kV") are ~5x the width of a
                          // counted integer, so they take their own step down
                          // the scale. They must NOT wrap: this row's whole
                          // job is four values hung from one baseline, and a
                          // two-line metric pushes its own label out of line
                          // with the other three — the single thing that made
                          // the band look accidental. `2.6vw` is measured: at
                          // the 264px column this grid gives each metric at
                          // 1440px, "6-1000 kV" sets to 246px, and the 1.4rem
                          // floor clears the 148px column at 375px.
                          "whitespace-nowrap text-[clamp(1.4rem,2.6vw,2.75rem)]"
                        : "whitespace-nowrap text-[clamp(3rem,8vw,7.5rem)]",
                      // Must come last: tailwind-merge treats the arbitrary
                      // `text-[clamp(…)]` above as a font-size/line-height pair
                      // and drops an earlier `leading-*`.
                      "leading-none",
                    )}
                  >
                    {kpi.value ?? (
                      <CountUp
                        to={kpi.to}
                        prefix={kpi.prefix}
                        suffix={kpi.suffix}
                        duration={1500}
                      />
                    )}
                  </dd>
                  <dt className="order-2 mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-orange md:text-[11px]">
                    {kpi.label}
                  </dt>
                </div>
              ))}
            </RevealBlock>
          </div>
        </div>
      </Beat>

      <div className="voltage-flow" aria-hidden />
    </section>
  );
}
