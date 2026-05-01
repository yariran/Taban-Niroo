"use client";

import {
  type CSSProperties,
  type ElementType,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type ScrollFillHeadingProps = {
  children: string;
  as?: ElementType;
  className?: string;
  /** When the section center reaches this fraction of viewport, fill = 1. */
  endRatio?: number;
  /** When the section center is this fraction below the viewport, fill = 0. */
  startRatio?: number;
};

/**
 * Outline-to-fill headline — scroll-driven "ink wash".
 *
 * Renders the same string twice. The bottom layer uses `-webkit-text-stroke`
 * to draw an outline glyph; the top layer paints the same glyph solid
 * but is clipped from the right by `clip-path: inset()`, with the inset
 * driven by the element's distance from the viewport centre. As the
 * reader scrolls past the headline, the outline fills in left-to-right
 * — a classic Awwwards-grade flourish that is GPU-cheap (`clip-path` is
 * compositor-friendly) and tolerant of any background.
 *
 * Honours `prefers-reduced-motion` (renders the filled state immediately).
 */
export function ScrollFillHeading({
  children,
  as: Tag = "h2",
  className,
  endRatio = 0.45,
  startRatio = 0.85,
}: ScrollFillHeadingProps) {
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
      const elCenter = (r.top + r.height / 2) / vh; // 1 = below screen, 0 = top
      // Map elCenter from [startRatio, endRatio] → [0, 1] (clamped).
      const span = startRatio - endRatio;
      const t = (startRatio - elCenter) / Math.max(0.001, span);
      const eased = Math.max(0, Math.min(1, t));
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
  }, [reduceMotion, startRatio, endRatio]);

  const TagName = Tag as ElementType;
  const fillStyle: CSSProperties = reduceMotion
    ? { clipPath: "inset(0 0% 0 0)" }
    : {
        clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
        transition: "clip-path 80ms linear",
        willChange: "clip-path",
      };

  return (
    <TagName
      ref={ref as never}
      className={cn("relative inline-block", className)}
      data-fill-progress={progress.toFixed(3)}
    >
      <span aria-hidden className="block h-outline">
        {children}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 block text-foreground"
        style={fillStyle}
      >
        {children}
      </span>
      <span className="sr-only">{children}</span>
    </TagName>
  );
}
