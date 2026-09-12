"use client";

import Image from "next/image";
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
import { LocaleLink, useLocale } from "@/components/locale-link";
import { getDictionarySync } from "@/lib/i18n/dictionary-catalog";

const DEFAULT_HERO_WORDS = ["INSPIRE", "INNOVATE", "INTEGRATE"] as const;
const WORD_STAGGER_S = 0.18;
const DEFAULT_TAGLINE = "Shaping Tomorrow's Solution Today";
const DEFAULT_BODY =
  "IEC-tested composite insulation for high-voltage networks.";

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
  const locale = useLocale();
  const dict = getDictionarySync(locale);

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
      {/*
        ONE scrim.

        This was four stacked gradients — a vertical ramp, a radial pool, and
        an lg-only horizontal band — each added to rescue a different patch of
        a photo that the type happened to be sitting on. Centring the stack
        removed the reason for all but one: the copy now lands on the
        vertical centre, where the ramp already measures past AA, instead of
        on the cloud burst that the horizontal band existed to darken.

        The ramp itself lives in `--hig-scrim-*` so the contrast floor is
        stated once and still holds when the photo is swapped through the CMS.
      */}
      <div className="hig-scrim pointer-events-none absolute inset-0" aria-hidden />

      {/*
        Centred stack — the HIG hero posture.

        The stack used to hang bottom-left across columns 1-8, which left the
        top two-thirds of the frame empty and pinned the type against the
        gutter. Centring on both axes is what Apple actually does with a
        full-bleed photograph, and it earns the contrast for free: the middle
        of the frame is the calmest part of almost any image, so the copy
        stops fighting the subject instead of being rescued by extra scrims.
      */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center",
          "px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24 sm:px-6 md:px-8",
        )}
      >
        <div className="flex w-full max-w-3xl flex-col items-center text-center">
          {/*
            One word per line, still — but set light, not bold.

            Large-and-light is the inversion the guidelines are built on:
            weight carries hierarchy so size doesn't have to shout. Oswald
            bold uppercase was doing the opposite, and uppercase is dead
            weight in Persian, which has no case to begin with.
          */}
          <h2 className="flex flex-col">
            {heroWords.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className={cn(
                  "type-hig-display block text-brand-cream",
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
            ))}
          </h2>

          <p
            className={cn(
              /* Full cream, not cream/85 — the scrim under it is now set
                 from a measured contrast floor, so dimming the type here
                 would spend that margin for nothing. */
              "type-hig-lede mt-[var(--hig-6)] max-w-xl text-brand-cream",
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

          {/*
            Filled pill + plain chevron link.

            Both used to be 11px uppercase at 0.18em tracking, which reads as
            a fashion lookbook rather than a control. HIG calls for body-size
            sentence case, and for exactly one button to look pressable —
            two equally weighted outlines make the reader choose twice.
          */}
          <div
            className={cn(
              "mt-[var(--hig-8)] flex flex-wrap items-center justify-center gap-[var(--hig-4)]",
              !staticLayout && "opacity-0",
            )}
            style={{
              animation: staticLayout
                ? undefined
                : `hero-word-fade 0.9s var(--ease-entrance) ${(heroWords.length + 2) * WORD_STAGGER_S}s both`,
            }}
          >
            <LocaleLink
              href="/products"
              className="type-hig-body inline-flex min-h-11 items-center justify-center rounded-full bg-white px-[var(--hig-6)] py-[var(--hig-3)] font-medium transition-colors duration-200 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0D]"
              style={{ color: "#0A0B0D", WebkitTextFillColor: "#0A0B0D" }}
            >
              {dict.home.explore}
            </LocaleLink>
            <LocaleLink
              href="/contact"
              className="type-hig-body group inline-flex min-h-11 items-center justify-center gap-[var(--hig-1)] rounded-full px-[var(--hig-4)] py-[var(--hig-3)] font-medium text-white transition-colors duration-200 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0D]"
              style={{ color: "#FFFFFF", WebkitTextFillColor: "#FFFFFF" }}
            >
              {dict.home.contact}
              {/* Points along the reading direction in both scripts. */}
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M6 3.5 10.5 8 6 12.5" />
              </svg>
            </LocaleLink>
          </div>
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
          <p className="type-hig-title col-span-12 text-brand-heading lg:col-span-8">
            {tagline}
          </p>
          {/* Hardcoded English, same as the proof band's lede — `dir="ltr"`
              so the sentence stops rendering with its full stop on the
              wrong side inside the RTL page. It still needs translating. */}
          <p
            dir="ltr"
            className="type-hig-body col-span-12 text-muted-foreground lg:col-span-3 lg:col-start-10"
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
