"use client";

import {
  type CSSProperties,
  type ElementType,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven word color reveal — editorial cinematic device.
 *
 * Words start in a muted tone and shift to the foreground tone as the
 * paragraph moves up through the viewport. Reads as a "brushed-in"
 * statement rather than a paragraph that simply faded in once.
 *
 * Design constraints (kept on purpose):
 *   • rAF-coalesced scroll handler — recompute progress at most once per
 *     frame.
 *   • Honours `prefers-reduced-motion`: jumps straight to fully revealed
 *     and skips the listener.
 *   • Theme-safe: words use CSS variable fallbacks (`--foreground` /
 *     `--muted-foreground`) so dark/light mode propagates without per-
 *     consumer wiring.
 *   • No layout thrashing: only the inline `color` of each `<span>`
 *     changes, never anything that triggers reflow.
 *
 * Usage:
 *   <ScrollRevealText as="h2" className="text-3xl font-medium tracking-tight">
 *     {"IEC 61109, 62217, 61466, 60120, 60471. ECR core. HTV silicone."}
 *   </ScrollRevealText>
 */
type ScrollRevealTextProps = {
  /** A plain string. Whitespace is used as the word delimiter. */
  children: string;
  as?: ElementType;
  className?: string;
  /**
   * Progress band, expressed as fractions of the viewport height.
   * `startBand` = top position (in viewport %) where reveal starts.
   * `endBand`  = top position where reveal completes.
   * Defaults give a smooth full-paragraph reveal as the block scrolls
   * from the lower 90% to the upper 10% of the viewport.
   */
  startBand?: number;
  endBand?: number;
  /** Optional override for the pre-reveal colour. */
  preColor?: string;
  /** Optional override for the post-reveal colour. */
  postColor?: string;
  /** Per-word transition duration in ms. */
  transitionMs?: number;
};

export function ScrollRevealText({
  children,
  as: Tag = "p",
  className,
  startBand = 0.92,
  endBand = 0.16,
  preColor = "var(--muted-foreground)",
  postColor = "var(--foreground)",
  transitionMs = 220,
}: ScrollRevealTextProps) {
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
    let raf = 0;

    const tick = () => {
      raf = 0;
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const start = vh * startBand;
      const end = vh * endBand;
      const range = Math.max(1, start - end);
      const p = (start - r.top) / range;
      setProgress(Math.max(0, Math.min(1, p)));
    };
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduceMotion, startBand, endBand]);

  const words = children.trim().split(/\s+/).filter(Boolean);
  const TagName = Tag as ElementType;

  return (
    <TagName ref={ref as never} className={cn(className)}>
      {words.map((word, index) => {
        // Skew the per-word threshold so the *last* word completes when
        // progress reaches 1 — without this the final word never fully
        // lights up because index/length never quite touches 1.
        const wordProgress =
          words.length === 1 ? 0 : index / (words.length - 0.001);
        const revealed = progress >= wordProgress;
        const style: CSSProperties = {
          color: revealed ? postColor : preColor,
          transition: `color ${transitionMs}ms cubic-bezier(0.22,1,0.36,1)`,
        };
        return (
          <span key={`${word}-${index}`} style={style}>
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </TagName>
  );
}
