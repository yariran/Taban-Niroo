"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type WatermarkNumberProps = {
  children: string;
  className?: string;
  /** Position the watermark within its parent. Default "bottom-left". */
  position?: "bottom-left" | "bottom-right" | "top-right" | "top-left" | "center";
  /** Font size as viewport-width vw. Default 24 — very large, very faint. */
  vw?: number;
};

/**
 * Massive translucent year/number anchored to the parent section.
 *
 * Used as a section-watermark: while the parent is on screen, the digits
 * scrub vertically with scroll, giving each chapter a "year stamp"
 * without competing with the foreground content. Opacity is held at
 * ~4–6% so the digits read as a watermark rather than copy.
 *
 * Requirements:
 *  - The parent section must be `position: relative; overflow: hidden`
 *    (or otherwise clip overflowing children).
 *  - Pair with a sensible `position` so the watermark anchors in a
 *    margin where it never overlaps a primary heading.
 *
 * Honours `prefers-reduced-motion` (no scrub, just static placement).
 */
export function WatermarkNumber({
  children,
  className,
  position = "bottom-right",
  vw = 24,
}: WatermarkNumberProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const node = ref.current;
    if (!node) return;
    const parent = node.parentElement;
    if (!parent) return;
    let raf: number | null = null;
    const apply = () => {
      raf = null;
      const r = parent.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = r.top + r.height / 2;
      const distance = (center - vh / 2) / vh;
      // Map [-1, 1] of viewport offset → [-40, 40] px drift.
      const drift = Math.max(-1, Math.min(1, distance)) * -40;
      setOffset(drift);
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

  const positionClass: Record<NonNullable<WatermarkNumberProps["position"]>, string> = {
    "bottom-left": "left-2 bottom-0 md:left-6",
    "bottom-right": "right-2 bottom-0 md:right-6",
    "top-left": "left-2 top-0 md:left-6",
    "top-right": "right-2 top-0 md:right-6",
    center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  const style: CSSProperties = {
    fontSize: `${vw}vw`,
    transform: `translate3d(0, ${offset.toFixed(2)}px, 0)`,
    willChange: "transform",
  };

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-0 select-none",
        "font-hero-slogan font-bold leading-[0.85] tracking-[-0.02em]",
        "text-foreground/[0.045] dark:text-white/[0.06]",
        positionClass[position],
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
