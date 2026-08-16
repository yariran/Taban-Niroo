"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Home-page section wrapper — structure only, no choreography.
 *
 * This file used to own an eleven-variant entrance "envelope". That was
 * removed deliberately: every variant resolved to the same gesture
 * (translate 8-16px + optional scale 0.98-1.02 + fade, 860-980ms), so
 * the page had the vocabulary of cinema and none of the motion. Worse,
 * a `stickyChild` flag silently replaced the declared variant with an
 * invisible `opacity: 0.9 -> 1` for five of the fourteen sections, and
 * the pre-opacity floor of 0.12 meant nothing ever truly faded in.
 *
 * Entrance motion now lives *inside* each section, applied to leaf
 * content blocks via the three roles in `lib/motion-roles.ts`. Keeping
 * it off the wrapper is what makes sticky descendants work without a
 * flag — see the overflow note below.
 *
 * What remains here: the chapter sentinel the rail reads, the voltage
 * hairline between chapters, and the hero's viewport floor.
 */

type HomeSectionSnapProps = {
  children: React.ReactNode;
  className?: string;
  /** Hero only — keeps the first fold a full viewport tall. */
  isFirst?: boolean;
  /** Suppress the voltage hairline (hero has nothing above it; footer blurs into its own lockup). */
  hideBoundary?: boolean;
  /**
   * Chapter id read by `ChapterRail` via `[data-chapter-id]`. Must match
   * an entry in `lib/home-chapters.ts` — the e2e smoke test asserts the
   * two sets are identical, which is what stops this going stale the way
   * the old `chapter` prop did (passed by eleven call sites, read by none).
   */
  chapterId?: string;
};

export function HomeSectionSnap({
  children,
  className,
  isFirst,
  hideBoundary,
  chapterId,
}: HomeSectionSnapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [boundaryIn, setBoundaryIn] = useState(false);

  /**
   * The hairline is decoration, so it gets its own trivial observer
   * rather than participating in the section's content clock (`<Beat>`).
   * One-shot; disconnects immediately.
   */
  useEffect(() => {
    if (hideBoundary || isFirst) return;
    const node = rootRef.current;
    if (!node) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setBoundaryIn(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBoundaryIn(true);
          obs.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [hideBoundary, isFirst]);

  const showBoundary = !isFirst && !hideBoundary;

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative",
        /**
         * `overflow-x: clip` alone — never paired with `overflow-y`.
         *
         * `overflow-x: clip` + `overflow-y: visible` is the one
         * combination where `visible` is NOT coerced to `auto`, so no
         * scrollport is created and `position: sticky` descendants keep
         * sticking to the real viewport. Pairing the axes (the previous
         * behaviour) established a clipping box that ate a sticky child's
         * travel — which is the actual reason the old `stickyChild` flag
         * existed. Do not add `overflow-y-*` here.
         */
        "overflow-x-clip",
        isFirst && "min-h-[100dvh]",
        className,
      )}
    >
      {/*
        Chapter sentinel. Capped at one viewport from the section top
        because `ChapterRail` activates whichever marker's CENTRE is
        nearest the viewport centre — an uncapped marker on the 300vh
        hero would put its centre 150vh down and lag the rail by half a
        section on every tall section.
      */}
      {chapterId && (
        <span
          aria-hidden
          data-chapter-id={chapterId}
          className="pointer-events-none absolute inset-x-0 top-0 h-[min(100%,100vh)]"
        />
      )}

      {showBoundary && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 z-[1] md:inset-x-12 lg:inset-x-20"
        >
          <span
            className={cn(
              "voltage-flow mx-auto block max-w-5xl transition-opacity duration-700",
              boundaryIn ? "opacity-80" : "opacity-0",
            )}
          />
        </div>
      )}

      {children}
    </div>
  );
}
