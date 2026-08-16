"use client";

import Image from "next/image";
import { useRef } from "react";
import { PollutionPerformanceSection } from "@/components/sections/pollution-performance-section";
import { BlurReveal } from "@/components/ui/blur-reveal";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsText } from "@/lib/cms-resolve";
import { SITE_IMAGES } from "@/lib/site-images";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { useScrollScene } from "@/lib/use-scroll-scene";

type Criterion = {
  number: string;
  title: string;
  description: string;
};

/**
 * The six IEC/TS 60815-3 shed-profile criteria, kept verbatim from
 * `PollutionPerformanceSection` so the cinematic and static renderings never
 * drift. CMS items override them the same way.
 */
const CRITERIA: readonly Criterion[] = [
  {
    number: "01",
    title: "Alternating shed classification",
    description:
      "Verifying shed overhang differences meet the standard's thresholds for effective self-cleaning.",
  },
  {
    number: "02",
    title: "Spacing versus shed overhang (s/p)",
    description:
      "Ensuring shed geometry avoids the risk of shed-to-shed arcing.",
  },
  {
    number: "03",
    title: "Minimum distance between sheds",
    description:
      "One of the most critical checks in profile evaluation — insufficient spacing can negate the benefit of added creepage distance entirely.",
  },
  {
    number: "04",
    title: "Creepage versus clearance (l/d)",
    description:
      "A localised check against arc bridging in deep, narrow sections of the profile.",
  },
  {
    number: "05",
    title: "Shed angle",
    description:
      "Balanced to allow effective natural washing without compromising creepage performance.",
  },
  {
    number: "06",
    title: "Creepage factor (CF)",
    description:
      "A global density check confirming the design meets pollution severity class requirements across SPS Class a through e.",
  },
];

/**
 * Act II — the pinned criteria runway.
 *
 * One held image under a slow Ken Burns push, with the six IEC criteria
 * advancing through it one frame at a time. This is the page's storytelling
 * engine: the reader stops moving through a list and instead watches a single
 * scene resolve, which is what makes the reference sites feel cinematic.
 *
 * Under `prefers-reduced-motion` this collapses entirely to the existing
 * `PollutionPerformanceSection`, so every criterion stays in the DOM, in
 * order, with no runway and no video-style motion.
 */
export function RnDCinemaCriteria({ cms }: { cms?: ContentBlock } = {}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const { band } = useScrollScene(trackRef, { disabled: reduceMotion });

  const cmsItems =
    cms?.items?.filter((i) => i.label.trim() && i.body?.trim()) ?? [];
  const criteria: readonly Criterion[] =
    cmsItems.length > 0
      ? cmsItems.map((i, idx) => ({
          number: String(idx + 1).padStart(2, "0"),
          title: i.label,
          description: i.body!.trim(),
        }))
      : CRITERIA;

  const title = cmsText(cms, "title", "Every shed profile,");
  const titleLine2 = cmsText(
    cms,
    "titleLine2",
    "calculated against IEC 60815-3",
  );

  // Reduced motion: hand the whole act back to the verified static section.
  if (reduceMotion) {
    return <PollutionPerformanceSection cms={cms} />;
  }

  /**
   * Runway budget: an opening title beat, then one equal band per criterion.
   * Each frame fades in, holds, and fades out before the next arrives, so two
   * frames are never legible at once.
   */
  const intro = band(0.02, 0.1);
  const frameSpan = 0.86 / criteria.length;
  const framesStart = 0.12;

  return (
    <section
      className="relative bg-brand-navy-deep"
      aria-labelledby="pollution-cinema-heading"
    >
      <h2 id="pollution-cinema-heading" className="sr-only">
        {title} {titleLine2}
      </h2>

      <div
        ref={trackRef}
        className="relative"
        style={{ height: `${120 + criteria.length * 70}vh` }}
      >
        <div className="sticky top-0 h-screen min-h-[100dvh] isolate overflow-hidden">
          {/* Held plate — slow push for the length of the runway.
              `.cine-grade` sets `position: relative`, so it nests inside the
              absolutely-positioned wrapper rather than sharing an element
              with it (which would collapse the plate to zero height). */}
          <div
            className="absolute inset-0 will-change-transform"
            style={{ transform: `scale(${1.04 + intro * 0.06})` }}
            aria-hidden
          >
            <div className="cine-grade h-full w-full">
              <Image
                src={SITE_IMAGES.philosophyLongRod}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                quality={82}
              />
            </div>
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-brand-navy-deep/72"
            aria-hidden
          />
          <div className="grain-layer" aria-hidden />

          {/* Opening title beat */}
          <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-20">
            <div
              className="mx-auto w-full max-w-6xl"
              style={{ opacity: 1 - band(0.1, 0.16) }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-orange md:text-[11px]">
                {cmsText(cms, "eyebrow", "Pollution performance engineering")}
              </p>
              <BlurReveal
                as="p"
                splitBy="char"
                className="type-cinema mt-6 max-w-4xl text-[clamp(1.8rem,5vw,4rem)] text-brand-cream"
              >
                {`${title} ${titleLine2}`}
              </BlurReveal>
            </div>
          </div>

          {/* Criterion frames */}
          {criteria.map((criterion, i) => {
            const start = framesStart + i * frameSpan;
            const enter = band(start, start + frameSpan * 0.28);
            const exit =
              i === criteria.length - 1
                ? 0
                : band(start + frameSpan * 0.78, start + frameSpan);
            const opacity = enter * (1 - exit);

            return (
              <div
                key={criterion.number}
                className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-20"
                style={{
                  opacity,
                  visibility: opacity > 0.02 ? "visible" : "hidden",
                }}
                aria-hidden={opacity <= 0.5}
              >
                <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-12 md:items-baseline md:gap-10">
                  <p className="font-mono text-[clamp(2.5rem,7vw,5rem)] font-light leading-none text-brand-orange md:col-span-3">
                    {criterion.number}
                  </p>
                  <div className="md:col-span-9">
                    <h3 className="type-cinema text-[clamp(1.5rem,3.6vw,2.75rem)] text-brand-cream">
                      {criterion.title}
                    </h3>
                    <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-brand-cream/70 md:text-base">
                      {criterion.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Runway position — which of the six frames is on screen. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center gap-2 px-6"
            aria-hidden
          >
            {criteria.map((c, i) => {
              const start = framesStart + i * frameSpan;
              const on = band(start, start + frameSpan * 0.28) > 0.5;
              return (
                <span
                  key={c.number}
                  className="h-px w-8 transition-colors duration-300"
                  style={{
                    backgroundColor: on
                      ? "var(--brand-orange)"
                      : "rgb(243 238 230 / 0.22)",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
