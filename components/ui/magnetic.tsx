"use client";

import {
  type ElementType,
  type MouseEvent,
  type ReactNode,
  useRef,
  useState,
  useEffect,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Magnetic hover wrapper.
 *
 * On `mousemove`, translates the element a fraction of the cursor offset
 * from its centre — the classic "the button is pulled toward you" feel.
 * `intensity = 0.25` is balanced for CTAs; turn it down for chrome-level
 * controls (icons, dots) and up for hero buttons.
 *
 * Honours `prefers-reduced-motion` — when active, the wrapper is a
 * passive pass-through and never translates. On touch devices the
 * effect is silently skipped because there is no `mousemove`.
 */
type MagneticProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** 0–1 multiplier of cursor offset translated to element movement. */
  intensity?: number;
};

export function Magnetic({
  children,
  as: Tag = "span",
  className,
  intensity = 0.25,
}: MagneticProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const TagName = Tag as ElementType;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) * intensity;
    const dy = (e.clientY - r.top - r.height / 2) * intensity;
    e.currentTarget.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  };

  const onMouseLeave = (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <TagName
      ref={ref as never}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "inline-flex transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
        className
      )}
    >
      {children}
    </TagName>
  );
}
