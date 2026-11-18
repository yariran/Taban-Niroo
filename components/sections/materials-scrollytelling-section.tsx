"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Beat } from "@/components/ui/beat";
import { RevealBlock } from "@/components/ui/reveal-text";
import { RevealUp } from "@/components/ui/reveal-words";
import { BEAT, EVIDENCE, STATEMENT } from "@/lib/motion-roles";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import type { ContentBlock } from "@/lib/cms-content-types";
import { cmsText } from "@/lib/cms-resolve";
import { useLocale } from "@/components/locale-link";
import { MATERIALS_STEPS_COPY, pickLocale } from "@/lib/i18n/section-copy";
import { pageHeadingScale } from "@/lib/i18n/type-scale";
import { cn } from "@/lib/utils";
import styles from "./materials-scrollytelling.module.css";

/**
 * Materials — sticky scrollytelling.
 *
 * The stage holds; the numbered steps drive it. One layer of the cutaway is
 * live at a time, keyed to whichever step is nearest the viewport centre.
 *
 * ## Why this pattern here and not elsewhere
 *
 * It only earns its scroll cost when the content is genuinely sequential and
 * the visual is genuinely shared — here it is both: one part, three bonded
 * layers, and an interface argument that only makes sense after the three.
 * Applied to a list of unrelated cards it degrades into a slideshow that has
 * hijacked the scrollbar.
 *
 * ## Invariants
 *
 * 1. The sticky node must not sit under an ancestor carrying a transform —
 *    a translate keyframe on an ancestor drags the sticky subtree for the
 *    duration of the entrance. (`philosophy-section.tsx` shipped exactly
 *    this bug once; see its comment.) So the `<Beat>` below wraps the
 *    HEADER only: `Beat` itself is a bare div, but `RevealBlock` sets an
 *    inline transform on each direct child and must never enclose the stage.
 * 2. Scroll-driven layer switching runs on every viewport (including phones)
 *    unless the user prefers reduced motion. The stage sticks while the
 *    steps scroll, so the cutaway stays in view as each layer lights.
 * 3. Nearest-to-centre selection, not "first intersecting": the latter is
 *    unstable at both ends of the track, where no step is intersecting the
 *    trigger band. Same selection rule as `components/chapter-rail.tsx`.
 */

type Layer = "core" | "housing" | "fittings" | "junction";

type Step = {
  id: Layer;
  num: string;
  title: string;
  body: string;
  /** Stage readout label — short, mono, uppercase. */
  readout: string;
  specs: readonly { label: string; value: string }[];
};

const STEP_META: readonly Omit<Step, "title" | "body">[] = [
  {
    id: "core",
    num: "01",
    readout: "ECR CORE",
    specs: [
      { label: "Function", value: "Load path" },
      { label: "Grade", value: "ECR / FRP" },
      { label: "Failure mode addressed", value: "Brittle fracture" },
    ],
  },
  {
    id: "housing",
    num: "02",
    readout: "HTV SILICONE HOUSING",
    specs: [
      { label: "Function", value: "Insulation + shedding" },
      { label: "Property", value: "Hydrophobicity recovery" },
      { label: "Standard", value: "IEC 62217" },
    ],
  },
  {
    id: "fittings",
    num: "03",
    readout: "GALVANISED FITTINGS",
    specs: [
      { label: "Function", value: "Attachment + field control" },
      { label: "Protection", value: "Hot-dip galvanised" },
      { label: "Verified to", value: "420 kV" },
    ],
  },
  {
    id: "junction",
    num: "04",
    readout: "TRIPLE JUNCTION",
    specs: [
      { label: "Result", value: "No moisture ingress" },
      { label: "Eliminates", value: "PD pathway" },
      { label: "Standard", value: "IEC 61109" },
    ],
  },
];

function useMaterialsSteps(): readonly Step[] {
  const locale = useLocale();
  const copy = pickLocale(MATERIALS_STEPS_COPY, locale);
  return STEP_META.map((meta, i) => ({
    ...meta,
    title: copy[i]!.title,
    body: copy[i]!.body,
  }));
}
export function MaterialsScrollytellingSection({
  cms,
}: { cms?: ContentBlock } = {}) {
  const STEPS = useMaterialsSteps();
  const locale = useLocale();
  const eyebrow = cmsText(cms, "eyebrow", "Materials science");
  const title = cmsText(
    cms,
    "title",
    "Three layers. Thirty years on the line.",
  );
  const body = cmsText(
    cms,
    "body",
    "A composite insulator is not one material — it is three, bonded so that air and water never reach the interface.",
  );

  const reduceMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  /** Step centres in DOCUMENT space — see `measure` below. */
  const centresRef = useRef<number[]>([]);
  const activeRef = useRef(0);

  /** Reduced motion draws every layer lit and skips scroll driving. */
  const staticLayout = reduceMotion;
  const driving = !reduceMotion;

  /**
   * Step centres are measured once per layout change, not per scroll frame.
   *
   * The previous version read `getBoundingClientRect()` for all four steps
   * inside the scroll rAF. Three rAF callbacks already run per frame on this
   * page (Lenis writes the scroll position, the parallax engine reads rects
   * and writes transforms, this one read four more), so the frame alternated
   * read → write → read and forced a synchronous layout each time. Step
   * geometry only depends on the viewport, so cache it and let the scroll
   * path do arithmetic alone.
   */
  const measure = useCallback(() => {
    const y = window.scrollY;
    centresRef.current = stepRefs.current.map((node) => {
      if (!node) return Number.POSITIVE_INFINITY;
      const r = node.getBoundingClientRect();
      return r.top + y + r.height / 2;
    });
  }, []);

  const update = useCallback(() => {
    const centres = centresRef.current;
    if (centres.length === 0) return;
    const mid = window.scrollY + window.innerHeight / 2;

    let best = 0;
    let bestD = Number.POSITIVE_INFINITY;
    centres.forEach((c, i) => {
      const d = Math.abs(c - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });

    /**
     * Deadband. Exactly at a boundary the two neighbours are within a
     * fraction of a pixel of each other, and Lenis settles on fractional
     * scroll positions that dither either side of it. Without this, parking
     * on a boundary flips `active` back and forth and each flip restarts a
     * 500ms crossfade in the opposite direction — the stage visibly
     * trembles while the page is barely moving. The incumbent has to be
     * beaten by a clear margin before the stage switches.
     */
    const current = activeRef.current;
    const currentD = Math.abs((centres[current] ?? Infinity) - mid);
    if (best !== current && currentD - bestD < 24) return;

    activeRef.current = best;
    setActive(best);
  }, []);

  useEffect(() => {
    if (!driving) {
      activeRef.current = 0;
      setActive(0);
      return;
    }
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    /**
     * Steps are sized in `vh`, so `resize` covers nearly everything — but
     * this section is lazy-mounted and its web font and four renders land
     * after first paint, any of which can reflow the list without a resize
     * event. Re-measuring on the list's own box keeps the cache honest.
     */
    const list = stepRefs.current[0]?.parentElement;
    const ro = list ? new ResizeObserver(onResize) : null;
    if (list && ro) ro.observe(list);

    measure();
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [update, measure, driving]);

  const live = STEPS[active];
  /** Reduced motion draws every layer lit; otherwise exactly one is. */
  const on = (layer: Layer) => staticLayout || live.id === layer;

  return (
    <section
      id="materials"
      className="bg-background"
      aria-labelledby="materials-heading"
    >
      <div className="px-6 pt-20 md:px-12 md:pt-28 lg:px-20 lg:pt-32">
        <Beat className="mx-auto max-w-6xl">
          <RevealBlock
            delayMs={BEAT.first}
            durationMs={EVIDENCE.duration}
            distance={EVIDENCE.distance}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
              {eyebrow}
            </p>
          </RevealBlock>
          {/* The heading itself is split into reveal children, so the
              accessible name lives on a sibling — same pattern as
              `engineering-detail-section.tsx`. */}
          <span id="materials-heading" className="sr-only">
            {title}
          </span>
          <RevealUp
            as="h2"
            delay={BEAT.headline}
            duration={STATEMENT.duration}
            distance={STATEMENT.distance}
            className={cn(
              "mt-4 font-hero-slogan font-bold uppercase leading-[1.04] tracking-tight text-brand-heading",
              pageHeadingScale(locale),
            )}
          >
            {title}
          </RevealUp>
          <RevealBlock
            delayMs={BEAT.lede}
            durationMs={EVIDENCE.duration}
            distance={EVIDENCE.distance}
          >
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-muted-foreground md:text-lg">
              {body}
            </p>
          </RevealBlock>
        </Beat>
      </div>

      {/*
        No transform on this wrapper or anything above it — it is an ancestor
        of the sticky stage. See invariant 1.
      */}
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:px-12 md:pb-28 lg:px-20">
        <div
          className={cn(
            "grid gap-10 md:gap-12",
            !staticLayout &&
              "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start",
          )}
        >
          {/* ---------------- the stage that holds ---------------- */}
          <div
            className={cn(
              "order-first",
              !staticLayout && styles.stickyStage,
              !staticLayout &&
                // Stick below the fixed header on phones; full viewport
                // column on desktop. `top` must clear SiteHeader (~3.5–4rem).
                "sticky top-[4.25rem] z-[5] -mx-1 bg-background px-1 pb-3 pt-1 md:top-[4.75rem] lg:order-last lg:top-0 lg:mx-0 lg:flex lg:h-[100dvh] lg:items-center lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0",
            )}
          >
            <div
              className={cn(
                styles.stage,
                "cine-grade relative aspect-[16/9] max-h-[min(48vh,22rem)] w-full overflow-hidden rounded-[1.25rem] bg-brand-navy-deep shadow-elevate md:max-h-[min(52vh,26rem)] lg:max-h-none",
              )}
            >
              {/* technical grid, masked to centre — house vocabulary, not a gradient */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-[18%] [background-image:linear-gradient(rgb(154_160_168/7%)_1px,transparent_1px),linear-gradient(90deg,rgb(154_160_168/7%)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(circle_at_50%_45%,black,transparent_78%)]"
              />
              <div aria-hidden className="grain-layer" />

              {/*
                Four supplied renders of the same insulator, crossfaded.
                Each lights the layer its step is about: the ECR rod, the
                silicone sheds, both end fittings, and the two junction
                points. They are stacked rather than swapped so the metal
                body never blinks between beats.

                REGISTRATION IS LOAD-BEARING. The files must stay aligned
                to each other pixel for pixel; a crossfade is the one thing
                that makes a misregistered pair impossible to miss.

                This was wrong once and shipped. The earlier pass centred
                each render by its SOLID BOUNDING BOX, which looked right —
                all four boxes came out within a few px — but the box is set
                by the end fittings, and those differ per render. The shed
                stack, which is what the eye actually tracks, was still off:
                measured by cross-correlating the shed comb, core sat 26px
                and housing 13px to the right of junction, with up to 3px
                vertically. On the desktop stage that is ~9px of sideways
                travel, and because the sheds are a periodic comb of thin
                fins, two combs a few px out of phase beat against each
                other as the opacities cross. It does not read as a slide;
                it reads as the part vibrating in place. That was the bug.

                So the files in `public/images/insulator/` are registered
                ON THE SHED COMB, not the bounding box: integer-pixel
                translations only (no resampling) onto the shared 2000x640
                canvas.

                That pass fixed the horizontal axis and left the vertical
                one. It was verified with an ALPHA-MASK DISAGREEMENT scan,
                and that metric cannot register these renders: each one adds
                a gold glow around the layer it highlights, so the masks
                differ by 8-14% whatever the offset, and the minimum sits
                wherever the glow is — not where the part is. Scanning
                +/-14px moved junction's disagreement from 14.2% to 14.0%.
                A flat basin like that is not a measurement.

                Measure the COMB'S ALPHA MID-LINE instead — the midpoint
                between the first and last row carrying shed, over a fixed
                column window (x 560-1440) that excludes the end fittings,
                since those legitimately differ per render. On `-v3` that
                read core 315, housing 316, fittings 318, junction 320: the
                shed stack drifted 5px down across the four, ~1.3 CSS px on
                the desktop stage and 3 device px on a 2x display. Because
                the swap is a cut, the whole part appeared to tick downward
                at each layer change — reported as the stage shaking, and
                the reason this file has been edited for that symptom more
                than once.

                `-v4` shifts housing/fittings/junction up by 1/3/5px (core
                unchanged, re-encoded through the same settings so all four
                match). Comb mid is now 315 for all four; comb top spans
                88/87/88/89 and bottom 542/543/542/541, down from a 6px
                spread to 2px. What is left is shed DIAMETER, not position —
                the renders are not the same size, and no translation fixes
                that.

                If a render is ever re-exported, re-check the comb mid-line
                before committing it. Matching bounding boxes is not enough,
                and neither is alpha-mask overlap.

                The SVG callouts that used to live here went with the
                drawing: their leader lines were positioned against the old
                viewBox and would point at nothing on this artwork. The
                highlight itself is now what marks the layer.
              */}
              <div
                className="absolute inset-0"
                role="img"
                aria-label="Cutaway of a composite insulator: ECR core rod, HTV silicone housing, and hot-dip galvanized forged end fittings."
              >
                {STEPS.map((step) => (
                  <Image
                    key={step.id}
                    /*
                      `-v4` is the vertical registration pass, and the
                      suffix is the
                      point: Next's image optimiser keys its cache on the
                      SOURCE PATH, not the file's bytes or mtime. Re-saving
                      `core.webp` in place left every running dev server and
                      every CDN edge serving the old, misregistered render —
                      verified here, the optimiser still returned the 26px
                      offset from a file that no longer had it, even at a
                      width it had never served before. Bump the suffix
                      whenever these renders are re-exported.
                    */
                    src={`/images/insulator/${step.id}-v4.webp`}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1024px) 45vw, 92vw"
                    quality={92}
                    /*
                      All four load with the section, not on intersection.
                      They are stacked in one box, so a lazy sibling is
                      technically "in view" and still unloaded when the
                      crossfade reaches it — measured on mobile: the second
                      beat sat at opacity 1 with naturalWidth 0, i.e. an
                      empty stage. The set is ~570KB total and the section
                      is itself lazy-mounted, so fetching all four once it
                      mounts is the cheaper trade.
                    */
                    priority={step.id === "core"}
                    loading={step.id === "core" ? undefined : "eager"}
                    /*
                      THE SWAP IS A CUT, NOT A DISSOLVE. Exactly one render
                      is visible at any instant, and that is the whole point
                      — do not reintroduce `transition-opacity` here.

                      These four files are separate 3D renders, not one
                      render recoloured. Registration (see the note on the
                      stack below) got their shed combs onto the same x and
                      the same vertical extent, but the residual is ~1–2px
                      at display size and it is not removable by any single
                      transform: the renders disagree non-uniformly along
                      the body, so a global fit halves the error and then
                      stalls. Measured along four windows of the body, the
                      shed top edge still spreads 4–9 source px.

                      A dissolve makes that residual impossible to hide,
                      because for ~500ms BOTH shed combs are on screen at
                      partial opacity, 1–2px apart. On a stack of thin fins
                      that doubles every tip, and as the opacities cross the
                      doubling slides — which reads as the part trembling up
                      and down. It is only ever visible at a layer change,
                      which is exactly when the dissolve runs.

                      Cutting removes the superimposition entirely, so the
                      artefact cannot occur at any residual. What is left is
                      a single-frame silhouette change of 1–2px, with no
                      second copy on screen to measure it against — which is
                      why the cut reads as the highlight moving rather than
                      as the part moving.
                    */
                    className={cn(
                      "object-contain",
                      on(step.id) ? "opacity-100" : "opacity-0",
                    )}
                  />
                ))}
              </div>

              {!staticLayout && (
                <div className="absolute inset-x-4 bottom-3 z-[3] flex items-end justify-between gap-3 font-mono text-[10px] tracking-[0.1em] text-[#8A9099] md:inset-x-6 md:bottom-5 md:text-[11px]">
                  <span className="text-brand-orange">{live.readout}</span>
                  <span className="opacity-75">
                    {live.num} / {String(STEPS.length).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ---------------- the steps that scroll ---------------- */}
          <ol className="flex list-none flex-col p-0">
            {STEPS.map((s, i) => {
              const isOn = staticLayout || i === active;
              return (
                <li
                  key={s.id}
                  ref={(n) => {
                    stepRefs.current[i] = n;
                  }}
                  className={cn(
                    styles.step,
                    "flex flex-col justify-center border-t border-border py-8 first:border-t-0 first:pt-0",
                    !staticLayout &&
                      "min-h-[70vh] border-0 py-6 first:pt-6 lg:min-h-[78vh] lg:py-2 lg:first:pt-2",
                  )}
                  data-step-on={String(isOn)}
                  aria-current={driving && i === active ? "step" : undefined}
                >
                  {/*
                    Inactive steps step DOWN A COLOUR TIER; they are never
                    dimmed with opacity. Both tiers clear AA:

                      active   heading/value → --brand-heading / --foreground
                                               16.5:1 light · 17.7:1 dark
                      inactive heading/value → --muted-foreground
                                               5.8:1  light ·  7.5:1 dark

                    See `materials-scrollytelling.module.css` for why the
                    tier is applied there and not as `lg:` classes here —
                    short version: two of the three lost the cascade.

                    The number below keeps its Tailwind pair because its
                    states are gold ↔ muted rather than the shared
                    strong ↔ muted tier, and it was verified to apply.
                    Body copy and spec labels are already the quiet tier and
                    stay put in both states — no headroom left to drop.
                  */}
                  <span
                    className={cn(
                      "font-mono text-xs tracking-[0.2em] transition-colors duration-500",
                      isOn ? "text-brand-burgundy" : "text-muted-foreground",
                    )}
                  >
                    {s.num}
                  </span>
                  <h3
                    className={cn(
                      styles.stepTitle,
                      "mt-2.5 font-hero-slogan text-xl font-medium uppercase leading-tight text-brand-heading transition-colors duration-500 md:text-2xl",
                    )}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3.5 max-w-[42ch] leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                  <dl className="mt-5 flex flex-wrap gap-x-7 gap-y-3 border-t border-border pt-4">
                    {s.specs.map((sp) => (
                      <div key={sp.label}>
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {sp.label}
                        </dt>
                        <dd
                          className={cn(
                            styles.stepValue,
                            "mt-1 font-mono text-[13px] text-foreground transition-colors duration-500",
                          )}
                        >
                          {sp.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
