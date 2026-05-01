"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type InterludeSectionProps = {
  quote: string;
  attribution: string;
  /** Optional eyebrow, e.g. "Interlude — chapter 09". */
  eyebrow?: string;
  /** Visual mode — "dark" paints a black panel, "light" inverts. */
  tone?: "dark" | "light";
};

/**
 * Punctuation interlude — a full-bleed quote panel.
 *
 * Inserted between heavy sections to give the reader a visual breath.
 * The quote scrubs in as the panel approaches the viewport centre and
 * scrubs back out as it leaves, so the moment is brief and intentional
 * rather than another permanent block. The black background is the
 * cinematic equivalent of a cut-to-black — it resets the eye before
 * the next chapter arrives.
 *
 * Visual language:
 *  - Background: pure black (or pure white in `tone="light"`),
 *    ignoring the surrounding theme so the contrast is absolute.
 *  - Type: `font-hero-slogan` for the attribution + Fraunces-flavour
 *    italic via `font-serif` Tailwind utility for the quote.
 *  - No new colour tokens.
 */
export function InterludeSection({
  quote,
  attribution,
  eyebrow,
  tone = "dark",
}: InterludeSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(1);
      return;
    }
    const node = ref.current;
    if (!node) return;
    let raf: number | null = null;
    const apply = () => {
      raf = null;
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = r.top + r.height / 2;
      const distance = Math.abs(center - vh / 2);
      const max = vh / 2 + r.height / 2;
      const ratio = 1 - Math.min(1, distance / Math.max(1, max));
      // Smoothstep for a velvety entrance + exit.
      const t = Math.max(0, Math.min(1, ratio));
      const eased = t * t * (3 - 2 * t);
      setProgress(eased);
    };
    const schedule = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  const isDark = tone === "dark";
  const quoteStyle: CSSProperties = reduceMotion
    ? { opacity: 1, transform: "translate3d(0,0,0)" }
    : {
        opacity: progress,
        transform: `translate3d(0, ${(1 - progress) * 18}px, 0)`,
        transition: "opacity 240ms linear, transform 240ms linear",
      };
  const attrStyle: CSSProperties = reduceMotion
    ? { opacity: 1 }
    : {
        opacity: Math.max(0, (progress - 0.2) / 0.8),
        transition: "opacity 320ms linear",
      };

  return (
    <section
      ref={ref as never}
      className={cn(
        "relative overflow-hidden",
        isDark ? "bg-black text-white" : "bg-white text-black"
      )}
      aria-label="Interlude"
    >
      <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="w-full">
          {eyebrow && (
            <p
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.28em]",
                isDark ? "text-white/55" : "text-black/55"
              )}
            >
              {eyebrow}
            </p>
          )}
          <p
            className={cn(
              "mt-6 font-medium leading-[1.1] tracking-tight md:mt-8",
              "text-3xl md:text-5xl lg:text-6xl",
              isDark ? "text-white" : "text-black"
            )}
            style={quoteStyle}
          >
            <span aria-hidden className={isDark ? "text-white/40" : "text-black/40"}>
              “
            </span>
            {quote}
            <span aria-hidden className={isDark ? "text-white/40" : "text-black/40"}>
              ”
            </span>
          </p>
          <p
            className={cn(
              "mt-10 font-mono text-[11px] uppercase tracking-[0.28em]",
              isDark ? "text-white/65" : "text-black/65"
            )}
            style={attrStyle}
          >
            — {attribution}
          </p>
        </div>
      </div>
    </section>
  );
}
