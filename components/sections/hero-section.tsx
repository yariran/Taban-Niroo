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

      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end",
          "pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-28",
          "sm:pb-16 md:pb-20 lg:pb-24",
        )}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-col gap-1 md:gap-1.5">
            {heroWords.map((word, index) => {
              return (
                <span
                  key={`${word}-${index}`}
                  className={cn(
                    "font-hero-slogan relative isolate block text-start uppercase",
                    "text-[clamp(2.4rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.02em]",
                    "text-[#F3EEE6] drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]",
                    !staticLayout && "opacity-0",
                  )}
                  style={{
                    animation: staticLayout
                      ? undefined
                      : `hero-word-fade 0.9s cubic-bezier(0.22, 0.98, 0.22, 1) ${index * WORD_STAGGER_S}s both`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>

          <p
            className={cn(
              "mt-8 max-w-sm text-[14px] leading-[1.65] text-white/70 drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)] md:mt-10 md:max-w-md md:text-[15px]",
              !staticLayout && "opacity-0",
            )}
            style={{
              animation: staticLayout
                ? undefined
                : `hero-word-fade 0.9s cubic-bezier(0.22, 0.98, 0.22, 1) ${(heroWords.length + 1) * WORD_STAGGER_S}s both`,
            }}
          >
            {heroBody}
          </p>

          <div
            className={cn(
              "mt-10 flex flex-wrap items-center gap-3 md:mt-12",
              !staticLayout && "opacity-0",
            )}
            style={{
              animation: staticLayout
                ? undefined
                : `hero-word-fade 0.9s cubic-bezier(0.22, 0.98, 0.22, 1) ${(heroWords.length + 2) * WORD_STAGGER_S}s both`,
            }}
          >
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-[11px] font-medium uppercase tracking-[0.18em] text-black transition-colors hover:bg-white/90"
            >
              View products
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/35 bg-transparent px-6 text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 transition-colors hover:border-white/65 hover:bg-white/10"
            >
              Request enquiry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const sceneB = (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background px-6",
        staticLayout
          ? "relative min-h-[min(70dvh,32rem)] py-20 md:py-24"
          : "absolute inset-0",
      )}
      style={
        staticLayout ? undefined : sceneLayerStyle(opacityB, 2)
      }
    >
      <div
        className="mb-8 h-px w-14 md:mb-10"
        style={{
          opacity: staticLayout ? 0.4 : 0.65,
          background:
            "linear-gradient(90deg, transparent, rgb(var(--accent-volt) / 0.75), transparent)",
        }}
        aria-hidden
      />
      <p className="max-w-3xl text-center font-hero-slogan text-brand-heading text-[clamp(1.65rem,4.5vw,3.25rem)] font-semibold uppercase leading-[1.12] tracking-tight">
        {tagline}
      </p>
      <p
        className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-muted-foreground md:mt-8 md:text-base"
        style={
          staticLayout
            ? undefined
            : { opacity: copyB }
        }
      >
        High-voltage composite insulators for power transmission.
      </p>
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
