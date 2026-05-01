"use client";

import {
  type ElementType,
  type MouseEvent,
  type ReactNode,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Cursor-tracking spotlight wrapper.
 *
 * Wraps any positioned card. While the cursor is inside, a soft sky-tinted
 * radial gradient follows it, anchored via two CSS custom properties
 * (`--mx`, `--my`) that the wrapper writes on each `mousemove`. The
 * gradient itself lives in `app/globals.css` under `.card-spotlight`,
 * so the visual stays in one place and theming updates apply globally.
 *
 * Why a wrapper (not just a class on the card):
 *  - Some cards already have `interactive-lift` and `shadow-elevate`
 *    on a deep child. Putting the cursor handler on the outermost
 *    element keeps the geometry calculation accurate regardless of
 *    inner padding.
 *  - The wrapper renders a polymorphic `as` element, so existing
 *    `<article>` / `<div>` semantics are preserved.
 *
 * On touch devices the spotlight never shows (no hover), and on
 * `prefers-reduced-motion` the gradient transition is suppressed by
 * the global `motion-reduce` rule.
 */
type SpotlightProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Spotlight radius in pixels (default 280). */
  size?: number;
  /** CSS color for the spotlight (default sky-400 @ 12% in light, 18% in dark — handled in CSS). */
  style?: CSSProperties;
};

export function Spotlight({
  children,
  as: Tag = "div",
  className,
  size = 280,
  style,
}: SpotlightProps) {
  const TagName = Tag as ElementType;
  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const styleWithSize: CSSProperties = {
    ...style,
    "--spot-size": `${size}px`,
  } as CSSProperties;

  return (
    <TagName
      onMouseMove={onMouseMove}
      className={cn("card-spotlight relative", className)}
      style={styleWithSize}
    >
      {children}
    </TagName>
  );
}
