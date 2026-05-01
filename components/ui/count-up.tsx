"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count-up number — animates from 0 to `to` once the element enters the
 * viewport. Honours `prefers-reduced-motion` (renders the final value
 * immediately). Uses tabular-nums so the digits don't shift width during
 * the count and the heading doesn't visually jitter.
 *
 * Designed for KPI tiles ("+80 projects", "1100 kV"). The `prefix`,
 * `suffix` and optional `format` keep the rendered token identical to
 * the static catalogue value once the count finishes.
 */
type CountUpProps = {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  /** Optional digit formatter, e.g. (n) => n.toLocaleString("en-US"). */
  format?: (value: number) => string;
};

export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1600,
  className,
  format,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setValue(to);
      setDone(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // ease-out cubic — soft cinematic deceleration
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(to * eased));
          if (t < 1) {
            requestAnimationFrame(tick);
          } else {
            setDone(true);
          }
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      },
      { threshold: 0.5 }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [to, duration]);

  const rendered = format ? format(value) : String(value);

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
      data-count-up={done ? "done" : "running"}
    >
      {prefix}
      {rendered}
      {suffix}
    </span>
  );
}
