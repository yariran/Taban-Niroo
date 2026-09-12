"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Rolling-digit counter.
 *
 * Terminal spins each digit on its own reel rather than counting a number
 * up — visually it is a mechanical totaliser, not a JS tween, and the
 * per-digit stagger is the whole effect. Non-numeric characters (the `+`
 * in "+80", the en dash and unit in "6–1000 kV") pass through as static
 * glyphs so a range and a count can share one component.
 */
export function Odometer({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [rolled, setRolled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setRolled(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setRolled(true);
        io.disconnect();
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const chars = [...value];
  /* Stagger runs right-to-left so the units digit settles first, the way a
     real totaliser carries. */
  const digitCount = chars.filter((c) => /\d/.test(c)).length;
  let digitIndex = -1;

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="inline-flex items-baseline">
        {chars.map((char, i) => {
          if (!/\d/.test(char)) {
            return (
              <span key={i} className={char === " " ? "w-[0.28em]" : undefined}>
                {char === " " ? " " : char}
              </span>
            );
          }

          digitIndex += 1;
          const delay = (digitCount - 1 - digitIndex) * 90;

          return (
            <span
              key={i}
              className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-baseline"
            >
              <span
                className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[1100ms]"
                style={
                  {
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    transitionDelay: `${delay}ms`,
                    transform: rolled
                      ? `translateY(-${Number(char)}em)`
                      : "translateY(-9em)",
                  } as CSSProperties
                }
              >
                {DIGITS.map((d) => (
                  <span key={d} className="block h-[1em] leading-[1em]">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
