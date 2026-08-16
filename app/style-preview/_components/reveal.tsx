"use client";

import { useEffect, useRef, type CSSProperties, type ElementType } from "react";

/**
 * The sandbox's only entrance animation.
 *
 * Terminal uses one reveal — a short rise with a long ease — repeated for
 * every block on the page. Keeping a single primitive here means the demo
 * can't accidentally drift into the "every section animates differently"
 * look that reads as generated.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  style,
  children,
}: {
  as?: ElementType;
  /** Stagger in milliseconds, applied as a CSS transition-delay. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal", "in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={{ ...style, "--tp-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
