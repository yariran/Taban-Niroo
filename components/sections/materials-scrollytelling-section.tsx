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

  /** Reduced motion draws every layer lit and skips scroll driving. */
  const staticLayout = reduceMotion;
  const driving = !reduceMotion;

  const update = useCallback(() => {
    const mid = window.innerHeight / 2;
    let best = 0;
    let bestD = Infinity;
    stepRefs.current.forEach((node, i) => {
      if (!node) return;
      const r = node.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    if (!driving) {
      setActive(0);
      return;
    }
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [update, driving]);

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
              !staticLayout &&
                // Stick below the fixed header on phones; full viewport
                // column on desktop. `top` must clear SiteHeader (~3.5–4rem).
                "sticky top-[4.25rem] z-[5] -mx-1 bg-background px-1 pb-3 pt-1 md:top-[4.75rem] lg:order-last lg:top-0 lg:mx-0 lg:flex lg:h-[100dvh] lg:items-center lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0",
            )}
          >
            <div className="cine-grade relative aspect-[16/9] max-h-[min(48vh,22rem)] w-full overflow-hidden rounded-[1.25rem] bg-brand-navy-deep shadow-elevate md:max-h-[min(52vh,26rem)] lg:max-h-none">
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

                The sources were re-registered before import. The raw
                renders were framed slightly differently — content centre
                drifting up to 30px and scale by ~3% — which read as the
                part twitching on every crossfade. The files in
                `public/images/insulator/` are normalised to a common
                2000x640 canvas with the solid content centred, so only the
                highlight changes.

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
                    src={`/images/insulator/${step.id}.webp`}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1024px) 45vw, 92vw"
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
                    className={cn(
                      "object-contain transition-opacity duration-500 motion-reduce:transition-none",
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
