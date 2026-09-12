"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Beat } from "@/components/ui/beat";
import { RevealBlock } from "@/components/ui/reveal-text";
import { RevealUp } from "@/components/ui/reveal-words";
import { BEAT, EVIDENCE, STATEMENT } from "@/lib/motion-roles";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import type { ContentBlock } from "@/lib/cms-content-types";
import { cmsText } from "@/lib/cms-resolve";
import { useLocale } from "@/components/locale-link";
import {
  MATERIALS_STEPS_COPY,
  pickLocale,
} from "@/lib/i18n/section-copy";
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
 * 2. The narrow fallback is CSS, not state. Every layout swap is a `lg:`
 *    class and the "all layers lit" styling lives in the module's
 *    `max-width: 1023.98px` block, so a phone is correct on the first paint
 *    instead of collapsing ~3 viewports of step height after hydration.
 *    `prefers-reduced-motion` is the one switch still driven from React —
 *    same as `philosophy-section.tsx`, and rare enough that a settle costs
 *    nothing.
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
/* ---------------------------------------------------------------------------
   Geometry, computed once at module scope — deterministic, so SSR and client
   render byte-identical. (No Date/random anywhere near this.)
   --------------------------------------------------------------------------- */

const X0 = 200;
const X1 = 600;
const PITCH = 34;
const SHEATH_T = 8;
/** Sheds reach well past the 12px core radius — under-reaching them makes the
 *  housing read as ripples on a bar instead of an insulator. Large / small
 *  alternating is the standard anti-pollution profile. */
const REACH = [52, 30] as const;

/**
 * One continuous profile line per side. Drawing each shed as its own closed
 * fin makes adjacent fins overlap and the housing reads as a sine wave; a
 * single tip-valley-tip outline is how the part is actually drawn.
 */
function housingProfile(sign: -1 | 1): string {
  const base = sign < 0 ? 288 - SHEATH_T : 312 + SHEATH_T;
  let p = `M${X0} ${base} `;
  let i = 0;
  for (let cx = X0 + PITCH / 2; cx <= X1 - PITCH / 2; cx += PITCH, i++) {
    const tip = base + sign * REACH[i % 2];
    p += `L${cx - 13} ${base} Q${cx} ${tip} ${cx + 13} ${base} `;
  }
  return `${p}L${X1} ${base} `;
}

const HOUSING_TOP = housingProfile(-1);
const HOUSING_BOTTOM = housingProfile(1);

/** Fibre hatching inside the rod — reads as FRP rather than a plain bar. */
const FIBRES = (() => {
  let f = "";
  for (let x = 204; x <= 596; x += 11) f += `M${x} 290 L${x + 6} 310 `;
  return f;
})();

/** Matches Tailwind's `lg` breakpoint — see invariant 2. */
const NARROW_QUERY = "(max-width: 1023.98px)";

export function MaterialsScrollytellingSection({
  cms,
}: { cms?: ContentBlock } = {}) {
  const STEPS = useMaterialsSteps();
  const locale = useLocale();
  const eyebrow = cmsText(cms, "eyebrow", "Materials science");
  const title = cmsText(cms, "title", "Three layers. Thirty years on the line.");
  const body = cmsText(
    cms,
    "body",
    "A composite insulator is not one material — it is three, bonded so that air and water never reach the interface.",
  );

  const reduceMotion = usePrefersReducedMotion();
  const [narrow, setNarrow] = useState(false);
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  /**
   * Reduced motion is the ONLY layout switch driven from React. `narrow`
   * gates behaviour only — never appearance — so its false-on-first-render
   * value cannot flash. See invariant 2.
   */
  const staticLayout = reduceMotion;
  const driving = !reduceMotion && !narrow;

  useEffect(() => {
    const mq = window.matchMedia(NARROW_QUERY);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
            "grid gap-12",
            !staticLayout &&
              "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start",
          )}
        >
          {/* ---------------- the stage that holds ---------------- */}
          <div
            className={cn(
              "order-first",
              !staticLayout &&
                "lg:order-last lg:sticky lg:top-0 lg:flex lg:h-[100dvh] lg:items-center",
            )}
          >
            <div className="cine-grade relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] bg-brand-navy-deep shadow-elevate">
              {/* technical grid, masked to centre — house vocabulary, not a gradient */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-[18%] [background-image:linear-gradient(rgb(154_160_168/7%)_1px,transparent_1px),linear-gradient(90deg,rgb(154_160_168/7%)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(circle_at_50%_45%,black,transparent_78%)]"
              />
              <div aria-hidden className="grain-layer" />

              {/* viewBox crops to the drawn extent incl. callouts, so the part
                  fills the frame instead of floating. Keeps 4:3. */}
              <svg
                viewBox="80 60 640 480"
                className="absolute inset-0 h-full w-full"
                role="img"
                aria-label="Cutaway of a composite insulator: ECR core rod, HTV silicone housing, and hot-dip galvanized forged end fittings."
              >
                <line
                  x1="40"
                  y1="300"
                  x2="760"
                  y2="300"
                  className={styles.axis}
                  strokeDasharray="6 6"
                />

                {/* housing */}
                <LayerGroup on={on("housing")}>
                  <path d={HOUSING_TOP} className={styles.line} />
                  <path d={HOUSING_BOTTOM} className={styles.line} />
                  <path
                    d={`M${X0} ${288 - SHEATH_T} L${X0} ${312 + SHEATH_T}`}
                    className={styles.line}
                  />
                  <path
                    d={`M${X1} ${288 - SHEATH_T} L${X1} ${312 + SHEATH_T}`}
                    className={styles.line}
                  />
                </LayerGroup>

                {/* core */}
                <LayerGroup on={on("core")}>
                  <rect x="196" y="288" width="408" height="24" rx="3" className={styles.fill} />
                  <rect x="196" y="288" width="408" height="24" rx="3" className={styles.line} />
                  <path d={FIBRES} className={styles.line} opacity="0.55" />
                </LayerGroup>

                {/* end fittings */}
                <LayerGroup on={on("fittings")}>
                  <path d="M96 262 h60 v18 h44 v40 h-44 v18 h-60 z" className={styles.fill} />
                  <path d="M96 262 h60 v18 h44 v40 h-44 v18 h-60 z" className={styles.line} />
                  <circle cx="122" cy="300" r="15" className={styles.fill} />
                  <circle cx="122" cy="300" r="15" className={styles.line} />
                  <path d="M704 262 h-60 v18 h-44 v40 h44 v18 h60 z" className={styles.fill} />
                  <path d="M704 262 h-60 v18 h-44 v40 h44 v18 h60 z" className={styles.line} />
                  <circle cx="678" cy="300" r="15" className={styles.fill} />
                  <circle cx="678" cy="300" r="15" className={styles.line} />
                </LayerGroup>

                {/* junction rings */}
                <LayerGroup on={on("junction")}>
                  <circle cx="200" cy="300" r="34" className={styles.line} strokeDasharray="4 4" />
                  <circle cx="600" cy="300" r="34" className={styles.line} strokeDasharray="4 4" />
                </LayerGroup>

                {/* callouts — hidden under reduced motion; four sets at once is noise */}
                <Callout on={!staticLayout && live.id === "core"}>
                  <line x1="400" y1="288" x2="400" y2="196" />
                  <text x="400" y="184" textAnchor="middle">ECR CORE — LOAD PATH</text>
                </Callout>
                <Callout on={!staticLayout && live.id === "housing"}>
                  <line x1="330" y1="240" x2="330" y2="170" />
                  <text x="330" y="158" textAnchor="middle">HTV SILICONE — HYDROPHOBIC</text>
                </Callout>
                {/* anchored start/end: centred on their leaders these overrun
                    the cropped viewBox and clip at both edges. */}
                <Callout on={!staticLayout && live.id === "fittings"}>
                  <line x1="122" y1="336" x2="122" y2="410" />
                  <text x="96" y="426" textAnchor="start">FORGED / GALVANISED</text>
                  <line x1="678" y1="336" x2="678" y2="410" />
                  <text x="704" y="426" textAnchor="end">Ø ROUNDED — FIELD CONTROL</text>
                </Callout>
                <Callout on={!staticLayout && live.id === "junction"}>
                  <line x1="200" y1="266" x2="200" y2="176" />
                  <text x="200" y="164" textAnchor="middle">TRIPLE JUNCTION</text>
                  <line x1="600" y1="266" x2="600" y2="176" />
                  <text x="600" y="164" textAnchor="middle">SEALED — NO INGRESS</text>
                </Callout>
              </svg>

              {/* Absolutely positioned, so hiding it below `lg` costs no shift.
                  It reports which step is driving — a claim only true when one
                  actually is. */}
              {!staticLayout && (
                <div className="absolute inset-x-6 bottom-5 z-[3] hidden items-end justify-between gap-4 font-mono text-[11px] tracking-[0.1em] text-[#8A9099] lg:flex">
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
                      "lg:min-h-[78vh] lg:border-0 lg:py-2 lg:first:pt-2",
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
                      isOn
                        ? "text-brand-burgundy"
                        : "text-brand-burgundy lg:text-muted-foreground",
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

function LayerGroup({
  on,
  children,
}: {
  on: boolean;
  children: React.ReactNode;
}) {
  return (
    <g data-lyr-on={String(on)} className={styles.layer}>
      {children}
    </g>
  );
}

function Callout({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <g className={styles.callout} data-on={String(on)} aria-hidden>
      {children}
    </g>
  );
}
