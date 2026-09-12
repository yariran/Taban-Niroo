"use client";

import { CountUp } from "@/components/ui/count-up";
import { RevealBlock } from "@/components/ui/reveal-text";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { Beat } from "@/components/ui/beat";
import { BEAT, EVIDENCE } from "@/lib/motion-roles";
import type { ContentBlock } from "@/lib/cms-content";
import { resolveKpis } from "@/lib/home-kpis";

/**
 * Proof band — the first thing under the hero.
 *
 * Four equal metric cells in a bordered table: same padding, same value
 * line box, same label track. Ranges ("6–1000 kV") share the figure size
 * with counted integers so the row reads as one instrument panel, not four
 * mismatched posters.
 *
 * Reads `home.proof`, falling back to `home.whyTaban` — see `resolveKpis`.
 * Renders dark in both themes so the opening stays one cinematic frame.
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

      <Beat className="relative px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 id="proof-heading" className="sr-only">
            Taban Niroo by the numbers
          </h2>

          {/*
            `dir="ltr"` because this string is hardcoded English with no
            dictionary key behind it. `BlurReveal` splits text into per-word
            spans, and inside the Persian page's RTL container those spans
            lay out right-to-left without this wrapper.
          */}
          <div dir="ltr">
            <BlurReveal
              as="p"
              delayMs={BEAT.headline}
              className="type-hig-lede max-w-2xl text-brand-cream"
            >
              Twenty-nine years of composite insulation, proven on energised
              networks.
            </BlurReveal>
          </div>

          <div data-parallax="1.08" className="mt-10 md:mt-14">
            <RevealBlock
              as="dl"
              delayMs={BEAT.group}
              distance={EVIDENCE.distance}
              durationMs={EVIDENCE.duration}
              stagger={EVIDENCE.stagger}
              className="grid grid-cols-2 overflow-hidden border border-white/14 md:grid-cols-4"
            >
              {kpis.map((kpi, index) => (
                <div
                  key={kpi.label}
                  className={[
                    "flex min-h-[9.5rem] flex-col justify-between gap-5 p-5 sm:min-h-[10.5rem] sm:p-6 md:min-h-[11.5rem] md:gap-6 md:p-7 lg:p-8",
                    "border-white/14",
                    /* Mobile 2×2: east edge on col 1, south edge on row 1. */
                    index % 2 === 0 ? "border-e" : "",
                    index < 2 ? "border-b md:border-b-0" : "",
                    /* Desktop 1×4: east edge on every cell but the last. */
                    "md:border-e md:last:border-e-0",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <dt className="type-hig-label min-h-[2.75em] text-brand-orange">
                    {kpi.label}
                  </dt>
                  <dd
                    className={[
                      "flex min-h-[2.75rem] items-end text-brand-cream tabular-nums",
                      "font-[300] tracking-[var(--hig-track-display)] leading-none",
                      /*
                        Range metrics take their own step down the scale.

                        One size for every cell is the better idea and it was
                        tried here, but it does not survive the arithmetic.
                        "6–1000 kV" sets about 4.8x its own font size, and the
                        tightest cell the grid ever produces is at `md`: four
                        columns inside the section's own `md:px-12` leave just
                        112px of content width after `p-7`. That caps a single
                        shared size at ~23px — a caption, not a headline
                        figure. At the 46px the counted values want, the range
                        needs 222px and wrapped to two lines, which is worse
                        than a size difference: three cells showed one line and
                        one showed two, and the row stopped reading as a row.

                        So: counted integers keep the large step, ranges get
                        the smaller one, and `whitespace-nowrap` guarantees the
                        thing the cell exists to guarantee. `items-end` still
                        hangs every value from one baseline, which is what
                        actually carries the instrument-panel reading — the
                        shared baseline, not the shared size.

                        The range clamp is sized for HEADROOM, not for a fit.
                        `nowrap` converts an overflow into text spilling out of
                        the cell rather than wrapping inside it, so a value
                        that merely fits is a trap — the first CMS edit or font
                        swap breaks it. Measured against the painted glyphs,
                        every breakpoint now keeps 18-29% slack: 89px in 112 at
                        `md`, 119 in 168 at `lg`, 167 in 224 at the
                        `max-w-6xl` ceiling, 184 in 224 once the cap bites.
                      */
                      "whitespace-nowrap",
                      kpi.value
                        ? "text-[clamp(1.15rem,2.4vw,2.375rem)]"
                        : "text-[clamp(1.65rem,3.4vw,2.85rem)]",
                    ].join(" ")}
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
