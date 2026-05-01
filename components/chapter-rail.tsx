"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Chapter = {
  /** Sentinel id to look for in the DOM (a `[data-chapter-id]` element). */
  id: string;
  title: string;
};

/**
 * Right-side chapter rail — persistent scroll companion.
 *
 * Renders a vertical column of hairlines on desktop. The hairline whose
 * sentinel `data-chapter-id` element is currently closest to the
 * viewport centre grows wider and lights up; the others stay quiet.
 * Hovering a hairline reveals a small uppercase chapter label without
 * shifting layout (the label sits absolute to the right of the rail).
 * Clicking a hairline scrolls the corresponding section to the top of
 * the viewport — through Lenis if it is active, native otherwise.
 *
 * Why hairlines instead of dots: the rest of the site speaks in
 * blueprint hairlines (section boundary, scroll rail at the top,
 * standard cards). A row of dots would look like a different design
 * system bolted on. Hairlines feel like the same hand drew them.
 *
 * Hidden on viewports below `lg` so the mobile reading column is never
 * interrupted, and hidden when the user prefers reduced motion (the
 * companion only earns its place if it animates).
 */
export function ChapterRail({ chapters }: { chapters: readonly Chapter[] }) {
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const apply = () => {
      rafRef.current = null;
      const vc = window.innerHeight / 2;
      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      chapters.forEach((c, i) => {
        const node = document.querySelector<HTMLElement>(`[data-chapter-id="${c.id}"]`);
        if (!node) return;
        const r = node.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const dist = Math.abs(center - vc);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });
      setActive(bestIdx);
    };

    const schedule = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion, chapters]);

  if (reduceMotion) return null;

  const handleJump = (id: string) => {
    const node = document.querySelector<HTMLElement>(`[data-chapter-id="${id}"]`);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside
      aria-label="Chapter navigation"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col gap-3">
        {chapters.map((c, i) => {
          const isActive = i === active;
          return (
            <li key={c.id} className="relative flex items-center justify-end">
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute right-7 top-1/2 -translate-y-1/2 whitespace-nowrap",
                  "font-mono text-[10px] uppercase tracking-[0.22em]",
                  "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isActive
                    ? "translate-x-0 text-foreground/80 opacity-100"
                    : "translate-x-1 text-foreground/55 opacity-0 group-hover:opacity-100"
                )}
              >
                <span className="tabular text-foreground/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="ml-2">{c.title}</span>
              </span>
              <button
                type="button"
                onClick={() => handleJump(c.id)}
                aria-label={`Jump to ${c.title}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group pointer-events-auto block h-[1.5px] rounded-full",
                  "transition-[width,background-color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isActive
                    ? "w-7 bg-foreground/90 dark:bg-white/95"
                    : "w-3 bg-foreground/30 hover:w-5 hover:bg-foreground/65 dark:bg-white/30 dark:hover:bg-white/70"
                )}
              />
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
