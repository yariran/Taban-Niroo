"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Chapter = {
  /** Sentinel id to look for in the DOM (a `[data-chapter-id]` element). */
  id: string;
  title: string;
  /**
   * Optional act number. When present, the rail inserts extra space at
   * each act boundary, so it communicates a three-part structure instead
   * of listing N equally-weighted things. Omit it (as `/about` does) and
   * the rail renders as an even comb.
   */
  act?: number;
};

/**
 * Right-side chapter rail — persistent scroll companion.
 *
 * Renders a vertical column of hairlines on desktop. The hairline whose
 * sentinel `data-chapter-id` element is currently closest to the
 * viewport centre grows wider and lights up; the others stay quiet.
 * Hovering or focusing a hairline reveals a small uppercase chapter label
 * without shifting layout (the label sits absolute to the left of the
 * rail, on its own scrim — see the note at the call site for why it is
 * never shown unprompted).
 * Clicking a hairline scrolls the corresponding section to the top of
 * the viewport via native `scrollIntoView`. (It does not route through
 * Lenis — unlike the delegated anchor handler in `lenis-provider.tsx` —
 * so a rail jump is native-smooth while ordinary scrolling is
 * Lenis-smooth. Minor inconsistency, pre-existing, worth unifying later.)
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
      className="pointer-events-none fixed end-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col gap-3">
        {chapters.map((c, i) => {
          const isActive = i === active;
          // Extra breath at each act boundary — the rail then reads as
          // three movements rather than an undifferentiated list.
          const startsAct =
            i > 0 && c.act !== undefined && c.act !== chapters[i - 1]?.act;
          return (
            <li
              key={c.id}
              className={cn(
                "group relative flex items-center justify-end",
                startsAct && "mt-5",
              )}
            >
              {/*
                Names appear on demand, not permanently.

                A chapter label runs ~175px to the left of the rail. Every
                content container on the home feed reaches further right
                than that — the `px-20` sections by 143px — so an always-on
                active label was landing on top of cards and body copy at
                every desktop width. The hairlines themselves clear all of
                it, so the rail keeps its job as a progress indicator and
                the naming is revealed by hover or keyboard focus, where a
                brief overlap is the reader's own doing and reads as chrome.

                (`group` also had to move here from the button: it sat on a
                sibling that follows this span, so the hover reveal the
                original was reaching for never fired at all.)

                The scrim is what makes an overlap legible wherever it
                lands — over a photograph, a white product plate, or the
                page ground.
              */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute end-7 top-1/2 -translate-y-1/2 whitespace-nowrap",
                  "rounded-full border border-border/40 bg-background/85 px-2.5 py-1 backdrop-blur-md dark:border-white/10",
                  "font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/85",
                  "opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-standard)]",
                  "translate-x-1 group-hover:translate-x-0 group-hover:opacity-100",
                  "group-focus-within:translate-x-0 group-focus-within:opacity-100",
                )}
              >
                <span className="tabular text-brand-burgundy">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="ms-2">{c.title}</span>
              </span>
              <button
                type="button"
                onClick={() => handleJump(c.id)}
                aria-label={`Jump to ${c.title}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "pointer-events-auto block h-[1.5px] rounded-full",
                  "transition-[width,background-color,opacity] duration-500 ease-[var(--ease-standard)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
