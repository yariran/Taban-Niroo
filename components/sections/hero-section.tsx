"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SITE_IMAGES } from "@/lib/site-images";
import { cn } from "@/lib/utils";

const HERO_WORDS = ["INSPIRE", "INNOVATE", "INTEGRATE"] as const;

const HERO_PUNCT = [",", ",", ";"] as const;

const WORD_STAGGER_S = 0.22;

/**
 * Main slogan — one word per line (“page” after hero).
 *
 * Copy is pulled verbatim from the official 2025-2026 catalogue and company
 * profile ("Shaping Tomorrow's Solution Today"). Note the singular "Solution"
 * and title-case — both intentional per brand guidelines, do not change.
 */
const TAGLINE_WORDS = [
  "Shaping",
  "Tomorrow's",
  "Solution",
  "Today",
] as const;

/** Smoothstep for scroll-driven easing */
function smoothstep01(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function HeroSection() {
  const taglineRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  /** 0 = hero-only feel, 1 = tagline fully settled */
  const [taglineEntrance, setTaglineEntrance] = useState(0);

  const updateTaglineProgress = useCallback(() => {
    const el = taglineRef.current;
    if (!el) return;

    const vh = window.innerHeight || 1;
    const top = el.getBoundingClientRect().top;

    // Wider band = longer scroll “scrub” between hero and tagline
    const rangeStart = vh * 0.98;
    const rangeEnd = vh * 0.12;
    const raw =
      (rangeStart - top) / Math.max(1, rangeStart - rangeEnd);
    setTaglineEntrance(smoothstep01(raw));
  }, []);

  useEffect(() => {
    const tick = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateTaglineProgress);
    };

    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    tick();

    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateTaglineProgress]);

  const p = taglineEntrance;
  const panelLift = 42 * (1 - p);
  const panelScale = 0.965 + 0.035 * p;
  const panelBlur = 14 * (1 - p);

  return (
    <section className="relative bg-background">
      <h1 className="sr-only">
        Taban Niroo · High-Voltage Composite Insulators · Inspire, Innovate,
        Integrate
      </h1>
      <div className="relative min-h-screen w-full">
        <Image
          src={SITE_IMAGES.hero}
          alt="Taban Niroo high-voltage composite insulators and power transmission equipment"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
          decoding="async"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/[0.22] to-black/[0.62]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_100%,rgb(0,0,0,0.55),transparent_58%)]"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col justify-end overflow-hidden pb-14 md:pb-20 lg:pb-24">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start px-5 sm:px-6 md:px-8 lg:px-10">
            <div className="-space-y-[0.16em] max-w-[11.5ch]">
              {HERO_WORDS.map((word, index) => {
                const isMiddle = index === 1;
                return (
                  <span
                    key={word}
                    className={cn(
                      "font-hero-slogan relative isolate block text-start uppercase will-change-[opacity,transform,filter] opacity-0",
                      "text-[clamp(3rem,8.8vw,6.85rem)] font-bold leading-[0.86] tracking-[-0.005em]",
                      isMiddle
                        ? "text-transparent [text-shadow:0_0_24px_rgba(191,219,254,0.18)] [-webkit-text-stroke:1.45px_rgba(186,230,253,0.95)]"
                        : "text-sky-100/90",
                      "drop-shadow-[0_3px_22px_rgba(0,0,0,0.45)]"
                    )}
                    style={{
                      animation: `hero-word-fade 1s cubic-bezier(0.22, 0.98, 0.22, 1) ${index * WORD_STAGGER_S}s both`,
                    }}
                  >
                    <span className="relative z-[1] inline-flex items-baseline whitespace-nowrap">
                      <span>{word}</span>
                      <span
                        className={cn(
                          "ms-[0.045em] translate-y-[-0.04em] font-sans text-[0.38em] font-semibold leading-none tracking-normal",
                          isMiddle ? "text-sky-100/90" : "text-sky-100/70"
                        )}
                      >
                        {HERO_PUNCT[index]}
                      </span>
                    </span>
                  </span>
                );
              })}
            </div>
            <p
              className="mt-5 max-w-lg text-xs leading-relaxed text-white/76 drop-shadow-[0_1px_14px_rgba(0,0,0,0.48)] opacity-0 md:mt-6 md:text-sm"
              style={{
                animation: `hero-word-fade 1s cubic-bezier(0.22, 0.98, 0.22, 1) ${(HERO_WORDS.length + 1) * WORD_STAGGER_S}s both`,
              }}
            >
              Advanced high-voltage composite insulators engineered for resilient power transmission.
            </p>
          </div>
        </div>
      </div>

      {/* Tagline “page” — transform driven by scroll between hero and this block */}
      <div
        ref={taglineRef}
        className={cn(
          "relative flex min-h-screen flex-col justify-center border-t border-border/40 bg-gradient-to-b from-muted/25 via-background to-background px-6 py-24 dark:border-white/[0.06] dark:from-white/[0.03] dark:via-background dark:to-background md:px-12 md:py-32 lg:px-20",
          "will-change-[transform,opacity,filter]"
        )}
        style={{
          opacity: p,
          transform: `translate3d(0, ${panelLift}px, 0) scale(${panelScale})`,
          filter: `blur(${panelBlur}px)`,
        }}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <div className="w-full space-y-1 md:space-y-2">
            {TAGLINE_WORDS.map((word, index) => {
              const stagger = index * 0.1;
              const w = Math.max(
                0,
                Math.min(1, (p - stagger) / (0.52 - stagger * 0.35))
              );
              const wo = smoothstep01(w);
              return (
                <span
                  key={`${word}-${index}`}
                  className={cn(
                    "block font-medium leading-[1.15] tracking-tight text-muted-foreground will-change-[transform,opacity]",
                    "text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-[1.1]"
                  )}
                  style={{
                    opacity: wo,
                    transform: `translate3d(0, ${22 * (1 - wo)}px, 0)`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>

          <p
            className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-muted-foreground/90 will-change-[transform,opacity] md:text-lg"
            style={(() => {
              const u = smoothstep01(Math.max(0, Math.min(1, (p - 0.42) / 0.38)));
              return {
                opacity: u,
                transform: `translate3d(0, ${18 * (1 - u)}px, 0)`,
              };
            })()}
          >
            High-voltage composite insulators. Power transmission. 6-1000 kV.
            IEC.
          </p>
          <p
            className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground/85 will-change-[transform,opacity] md:text-lg"
            style={(() => {
              const u = smoothstep01(Math.max(0, Math.min(1, (p - 0.52) / 0.32)));
              return {
                opacity: u,
                transform: `translate3d(0, ${14 * (1 - u)}px, 0)`,
              };
            })()}
          >
            Shiraz, Iran.
          </p>
        </div>
      </div>
    </section>
  );
}
