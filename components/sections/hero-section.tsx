"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { SITE_IMAGES } from "@/lib/site-images";
import { cn } from "@/lib/utils";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsImage, cmsText } from "@/lib/cms-resolve";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { NewReleaseShowcaseSection } from "@/components/sections/new-release-showcase-section";

const DEFAULT_HERO_WORDS = ["INSPIRE", "INNOVATE", "INTEGRATE"] as const;
const WORD_STAGGER_S = 0.18;
const DEFAULT_TAGLINE = "Shaping Tomorrow's Solution Today";
const DEFAULT_BODY =
  "IEC-tested composite insulation for high-voltage networks.";

/**
 * Above-the-fold nameplate.
 *
 * High-voltage apparatus carries a rating plate — voltage, standard, year,
 * service class — stamped on the body. Borrowing that object is what makes
 * this fold specific to the industry instead of the generic centred
 * hero-stack (kicker / big headline / grey lede) the rest of the web ships.
 * It also does real work: the four hardest credibility facts the company
 * has now land in the first viewport rather than at section two.
 *
 * Every value here already appears elsewhere in `site-content.json`
 * (proof band, standards section) — this restates, it does not invent.
 */
const NAMEPLATE = [
  { label: "Rated voltage", value: "6–1000 kV" },
  { label: "Type-tested", value: "IEC 61109 · 62217 · 60137 · 60099-4" },
  { label: "In service", value: "29 years" },
  { label: "Networks", value: "10 countries" },
] as const;

function HeroNameplate({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-1 lg:gap-y-0",
        className,
      )}
      style={style}
    >
      {NAMEPLATE.map((row, i) => (
        <div
          key={row.label}
          className={cn(
            "min-w-0",
            /* Hairlines only in the stacked desktop column — in the 2×2
               mobile arrangement they would read as table rules, not as a
               plate. */
            "lg:border-t lg:border-white/15 lg:py-3.5",
            i === 0 && "lg:border-t-0 lg:pt-0",
            i === NAMEPLATE.length - 1 && "lg:pb-0",
          )}
        >
          {/* Both at full opacity: at 9-11px the AA floor is 4.5:1, and the
              earlier /85 tint spent contrast this type size cannot afford. */}
          <dt className="font-mono text-[9px] uppercase leading-none tracking-[0.2em] text-brand-orange md:text-[10px]">
            {row.label}
          </dt>
          <dd className="mt-2 font-mono text-[11px] leading-[1.45] text-brand-cream md:text-xs">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function smoothstep01(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/**
 * Three-scene hero — one full viewport slide at a time:
 *   A → brand / slogan   ·   B → catalogue tagline   ·   C → new release
 * Short hard cuts between equal holds so previous/next slides never sit
 * inside the active frame. Sticky runway (~300vh) locks the stage.
 * Only `prefers-reduced-motion` falls back to a stacked static layout.
 */

/** Full-viewport scene layer: opaque, no bleed from neighbors. */
function sceneLayerStyle(
  opacity: number,
  zIndex: number,
): CSSProperties {
  const shown = opacity > 0.02;
  return {
    opacity,
    zIndex,
    visibility: shown ? "visible" : "hidden",
    pointerEvents: opacity > 0.85 ? "auto" : "none",
  };
}
export function HeroSection({
  cms,
  newRelease,
}: {
  cms?: ContentBlock;
  newRelease?: ContentBlock;
} = {}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const reduceMotion = usePrefersReducedMotion();
  const staticLayout = reduceMotion;

  const heroImage = cmsImage(cms, SITE_IMAGES.hero) ?? SITE_IMAGES.hero;
  const heroWords = [
    cmsText(cms, "title", DEFAULT_HERO_WORDS[0]),
    cmsText(cms, "titleLine2", DEFAULT_HERO_WORDS[1]),
    cmsText(cms, "titleLine3", DEFAULT_HERO_WORDS[2]),
  ];
  const heroBody = cmsText(cms, "body", DEFAULT_BODY);
  const tagline = cms?.ctaLabel?.trim() || DEFAULT_TAGLINE;

  const updateProgress = useCallback(() => {
    if (staticLayout) {
      setProgress(0);
      return;
    }
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const scrollable = Math.max(track.offsetHeight - window.innerHeight, 1);
    const scrolled = Math.max(0, Math.min(scrollable, -rect.top));
    // Linear track progress — easing lives only in per-scene bands so
    // the sticky runway doesn't feel slow at the ends and fast mid-way.
    setProgress(scrolled / scrollable);
  }, [staticLayout]);

  useEffect(() => {
    if (staticLayout) return;
    const tick = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateProgress);
    };
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    tick();
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateProgress, staticLayout]);

  const p = progress;

  /** Map scroll progress to a 0–1 band (start/end as fractions of total track). */
  const band = (start: number, end: number) =>
    smoothstep01(Math.max(0, Math.min(1, (p - start) / (end - start))));

  /**
   * Equal thirds with sequential cuts — outgoing slide finishes before
   * the next enters, so previous/next never sit inside the active frame.
   */
  const exitA = band(0.28, 0.34);
  const enterB = band(0.34, 0.4);
  const exitB = band(0.6, 0.66);
  const enterC = band(0.66, 0.72);
  const opacityA = 1 - exitA;
  const opacityB = enterB * (1 - exitB);
  const opacityC = enterC;
  const copyB = band(0.38, 0.48);

  const sceneA = (
    <div
      className={cn(
        "overflow-hidden bg-brand-navy-deep",
        staticLayout
          ? "relative min-h-[100dvh]"
          : "absolute inset-0",
      )}
      style={
        staticLayout ? undefined : sceneLayerStyle(opacityA, 1)
      }
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={
          staticLayout
            ? undefined
            : { transform: `scale(${1 + exitA * 0.04})` }
        }
      >
        {heroImage.startsWith("http") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt="Taban Niroo high-voltage composite insulators and power transmission equipment"
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              !staticLayout && "hero-ken-burns",
            )}
          />
        ) : (
          <Image
            src={heroImage}
            alt="Taban Niroo high-voltage composite insulators and power transmission equipment"
            fill
            className={cn("object-cover", !staticLayout && "hero-ken-burns")}
            priority
            sizes="100vw"
            quality={85}
            decoding="async"
          />
        )}
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_100%,rgb(0,0,0,0.5),transparent_62%)]"
        aria-hidden
      />
      {/*
        Plate scrim (lg+ only — below that the plate sits full-width in the
        bottom gradient, which already measures 6.3:1).

        The default hero photo puts its brightest region — the cloud burst —
        directly behind the rating plate's column. Measured on real painted
        pixels, the gold labels landed at 3.11:1 there, under the 4.5 AA floor
        for text this small. This darkens that band to bring them clear, and
        because it keys off position rather than off this particular image, it
        keeps holding when the photo is swapped through the CMS.
      */}
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block bg-[linear-gradient(90deg,transparent_45%,rgb(0_0_0_/_0.30)_62%,rgb(0_0_0_/_0.38)_100%)]"
        aria-hidden
      />

      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end",
          "pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-28",
          "sm:pb-16 md:pb-20 lg:pb-24",
        )}
      >
        {/*
          Asymmetric 12-column field, not a centred stack.

          The slogan holds columns 1-7 and the rating plate columns 9-12,
          both hung from the same bottom baseline (`items-end`). The empty
          eighth column is the gutter that makes the split read as a
          decision. A single centred axis — the default this fold used to
          share with every generated hero — cannot produce that tension.
        */}
        <div className="mx-auto grid w-full max-w-6xl grid-cols-12 items-end gap-x-6 px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="col-span-12 flex flex-col items-start lg:col-span-7">
          <div className="flex flex-col gap-1 md:gap-1.5">
            {heroWords.map((word, index) => {
              return (
                <span
                  key={`${word}-${index}`}
                  className={cn(
                    "font-hero-slogan relative isolate block text-start uppercase",
                    /* Tighter than the old 0.95: at three stacked words the
                       block should read as one mass, which is what lets the
                       plate opposite it sit as the counterweight. */
                    "text-[clamp(2.4rem,7vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.03em]",
                    "text-brand-cream drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]",
                    !staticLayout && "opacity-0",
                  )}
                  style={{
                    animation: staticLayout
                      ? undefined
                      : `hero-word-fade 0.9s var(--ease-entrance) ${index * WORD_STAGGER_S}s both`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>

          {/*
            Positioning line. The slogan above is the brand; this is the
            sentence that tells a first-time visitor what the company actually
            makes — so it is set at readable cinematic size, not as caption
            text under the headline.
          */}
          <p
            className={cn(
              "type-cinema mt-7 max-w-lg text-[clamp(1.05rem,2vw,1.6rem)] leading-[1.3] text-brand-cream/90 drop-shadow-[0_1px_12px_rgba(0,0,0,0.5)] md:mt-9 md:max-w-2xl",
              !staticLayout && "opacity-0",
            )}
            style={{
              animation: staticLayout
                ? undefined
                : `hero-word-fade 0.9s var(--ease-entrance) ${(heroWords.length + 1) * WORD_STAGGER_S}s both`,
            }}
          >
            {heroBody}
          </p>

          <div
            className={cn(
              "mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 md:mt-10",
              !staticLayout && "opacity-0",
            )}
            style={{
              animation: staticLayout
                ? undefined
                : `hero-word-fade 0.9s var(--ease-entrance) ${(heroWords.length + 2) * WORD_STAGGER_S}s both`,
            }}
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 border-b border-brand-cream/35 pb-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-brand-cream transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              View products
              <span
                aria-hidden
                className="translate-y-px transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center text-[10px] font-medium uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-brand-cream"
            >
              Talk to an engineer
            </Link>
          </div>

          </div>

          {/*
            The rating plate. Replaces the single run-on standards strip that
            used to sit here — same facts, but arranged as label/value pairs
            it can be read as data rather than skimmed as decoration, and
            moved opposite the slogan where it balances the composition.
          */}
          <HeroNameplate
            className={cn(
              "col-span-12 mt-9 border-t border-white/15 pt-6",
              "lg:col-span-4 lg:col-start-9 lg:mt-0 lg:border-t-0 lg:border-l lg:border-white/15 lg:pl-7 lg:pt-0",
              !staticLayout && "opacity-0",
            )}
            style={{
              animation: staticLayout
                ? undefined
                : `hero-word-fade 0.9s var(--ease-entrance) ${(heroWords.length + 3) * WORD_STAGGER_S}s both`,
            }}
          />
        </div>
      </div>
    </div>
  );

  const sceneB = (
    <div
      className={cn(
        /* `items-stretch`, not `items-center`: the inner block owns its own
           max-width and gutters so it lines up with scene A's grid. */
        "flex h-full w-full flex-col items-stretch justify-center overflow-hidden bg-background px-5 sm:px-6 md:px-8 lg:px-10",
        staticLayout
          ? "relative min-h-[min(70dvh,32rem)] py-20 md:py-24"
          : "absolute inset-0",
      )}
      style={
        staticLayout ? undefined : sceneLayerStyle(opacityB, 2)
      }
    >
      {/*
        Same words, off the centre axis.

        This scene used to be a symmetric stack — hairline, centred uppercase
        tagline, centred grey line — which is the exact template the fold is
        trying to escape, and it spent a whole viewport saying nothing
        measurable. The type now hangs off a full-width rule with the tagline
        in columns 1-8 and the support line dropped into 9-12, so the eye
        travels rather than settles.
      */}
      <div className="mx-auto w-full max-w-6xl">
        <div
          className="h-px w-full"
          style={{
            opacity: staticLayout ? 0.35 : 0.55,
            background:
              "linear-gradient(90deg, rgb(var(--accent-volt) / 0.75), transparent 65%)",
          }}
          aria-hidden
        />
        <div className="mt-8 grid grid-cols-12 items-end gap-x-6 gap-y-6 md:mt-10">
          <p className="col-span-12 font-hero-slogan text-brand-heading text-[clamp(1.65rem,4.5vw,3.25rem)] font-semibold uppercase leading-[1.06] tracking-tight lg:col-span-8">
            {tagline}
          </p>
          <p
            className="col-span-12 text-sm leading-relaxed text-muted-foreground lg:col-span-3 lg:col-start-10 md:text-base"
            style={staticLayout ? undefined : { opacity: copyB }}
          >
            High-voltage composite insulators for power transmission.
          </p>
        </div>
      </div>
    </div>
  );

  const sceneC = (
    <div
      className={cn(
        "h-full w-full overflow-hidden bg-background",
        staticLayout ? "relative" : "absolute inset-0",
      )}
      style={
        staticLayout ? undefined : sceneLayerStyle(opacityC, 3)
      }
    >
      <NewReleaseShowcaseSection cms={newRelease} embedded={!staticLayout} />
    </div>
  );

  if (staticLayout) {
    return (
      <section className="relative bg-background">
        <h1 className="sr-only">
          Taban Niroo · High-Voltage Composite Insulators · Inspire, Innovate,
          Integrate
        </h1>
        {sceneA}
        <div className="border-t border-border/40 dark:border-white/[0.06]">
          {sceneB}
        </div>
        <NewReleaseShowcaseSection cms={newRelease} />
      </section>
    );
  }

  return (
    <section className="relative bg-background">
      <h1 className="sr-only">
        Taban Niroo · High-Voltage Composite Insulators · Inspire, Innovate,
        Integrate
      </h1>

      {/* Tall track → sticky stage: one full slide owns the viewport at a time */}
      <div ref={trackRef} className="relative h-[300vh] min-h-[300dvh]">
        <div className="sticky top-0 h-screen min-h-[100dvh] isolate overflow-hidden bg-background">
          {sceneA}
          {sceneB}
          {sceneC}
        </div>
      </div>
    </section>
  );
}
