"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Home-page cinematic reveal wrapper — final tuning.
 *
 * Design pillars:
 *   1. GPU-only choreography. Every variant animates `transform`,
 *      `opacity`, and `scale` only. No `clip-path`, no `filter: blur()`,
 *      no layout-thrashing properties — jank-free on mid-range laptops
 *      and low-end phones.
 *   2. Three-stage stagger. Each section reveals in three beats:
 *      (a) the outer envelope slides/scales into place, (b) the inner
 *      content follows with a slight delay, (c) a blueprint-style
 *      boundary line + corner tick draws in. This "staged" cadence is
 *      what separates a cinematic industrial site from a flat one.
 *   3. Distinct cinematic voices. Eleven variants, each with its own
 *      character (rise, veil, curtain, zoom, iris, slide-right,
 *      slide-left, tilt-top, focus-pull, dolly, fade-up). Adjacent
 *      sections never share the same voice, so scroll feels composed
 *      rather than repetitive.
 *   4. Uniform motion budget. Translate / opacity floors are identical
 *      on every viewport so resizing the browser never swaps “mobile”
 *      vs “desktop” entrance feel.
 *   5. Scroll-linked parallax on eligible sections. When `parallax`
 *      is enabled (and the section has no sticky descendants), the
 *      inner wrapper drifts by up to ±10px as the viewport moves
 *      through it. This breaks the "flat" impression without
 *      drawing attention to itself.
 *   6. After-settle strip. Once the entrance finishes, all inline
 *      styles are removed so sticky children behave against the
 *      true viewport, not against a transform-generated containing
 *      block. The node becomes zero-cost during normal scrolling.
 */

export type SectionVariant =
  | "rise"
  | "veil"
  | "curtain"
  | "zoom"
  | "iris"
  | "slide-right"
  | "slide-left"
  | "tilt-top"
  | "focus-pull"
  | "dolly"
  | "fade-up";

type HomeSectionSnapProps = {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  isFirst?: boolean;
  variant?: SectionVariant;
  /**
   * Enable a subtle scroll-linked parallax on the inner content after
   * the entrance settles. Do NOT turn this on for sections that contain
   * `position: sticky` descendants — the transform creates a new
   * containing block and breaks the sticky child.
   */
  parallax?: boolean;
  /**
   * Hide the blueprint boundary decoration for this section (e.g. the
   * hero does not need one above it, and the footer blurs into its own
   * brand lockup).
   */
  hideBoundary?: boolean;
  /**
   * Mark this wrapper as hosting a `position: sticky` descendant. CSS
   * transforms on an ancestor create a new containing block and break
   * sticky positioning entirely. When this flag is on, the entrance
   * animation restricts itself to `opacity` only (no transform, no
   * scale) — sticky children keep working from the very first frame,
   * while the blueprint boundary still draws in for cinematic feel.
   *
   * Use this for the Gallery (horizontal pin-and-pan) and Philosophy
   * (internal sticky parallax) sections. Implies `parallax: false`.
   */
  stickyChild?: boolean;
  /**
   * Optional chapter index for the blueprint corner. When set, a small
   * `01 / 12 — Philosophy` slug appears in the top-right of the section
   * boundary. The index draws in slightly after the boundary line so it
   * reads as a label being stamped onto the page rather than appearing
   * in the same beat. Hidden when `hideBoundary` is true.
   */
  index?: number;
  total?: number;
  chapter?: string;
};

/** expo-out: heavy cinematic deceleration, no bounce. */
const EASE_EXPO = "cubic-bezier(0.22, 1, 0.36, 1)";
/** quart-out: slightly softer entry for text-heavy sections. */
const EASE_QUART = "cubic-bezier(0.25, 1, 0.35, 1)";
/** sine-out: velvet finish for wide cinematic dollies. */
const EASE_SINE = "cubic-bezier(0.33, 1, 0.68, 1)";

type VariantSpec = {
  outerPre: CSSProperties;
  outerIn: CSSProperties;
  duration: number;
  ease: string;
};

/**
 * Variants — one clean envelope move per section.
 * Distances are identical on every viewport.
 */
const VARIANTS: Record<SectionVariant, VariantSpec> = {
  rise: {
    outerPre: { transform: "translate3d(0, 16px, 0)", opacity: 0 },
    outerIn: { transform: "translate3d(0, 0, 0)", opacity: 1 },
    duration: 880,
    ease: EASE_EXPO,
  },
  veil: {
    outerPre: { transform: "translate3d(0, 12px, 0) scale(1.01)", opacity: 0 },
    outerIn: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
    duration: 900,
    ease: EASE_EXPO,
  },
  curtain: {
    outerPre: {
      transform: "translate3d(0, 14px, 0) scale(0.99)",
      opacity: 0,
    },
    outerIn: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
    duration: 920,
    ease: EASE_EXPO,
  },
  zoom: {
    outerPre: {
      transform: "translate3d(0, 10px, 0) scale(1.02)",
      opacity: 0,
    },
    outerIn: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
    duration: 900,
    ease: EASE_EXPO,
  },
  iris: {
    outerPre: { transform: "translate3d(0, 8px, 0) scale(0.98)", opacity: 0 },
    outerIn: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
    duration: 940,
    ease: EASE_EXPO,
  },
  "slide-right": {
    outerPre: { transform: "translate3d(-16px, 8px, 0)", opacity: 0 },
    outerIn: { transform: "translate3d(0, 0, 0)", opacity: 1 },
    duration: 880,
    ease: EASE_QUART,
  },
  "slide-left": {
    outerPre: { transform: "translate3d(16px, 8px, 0)", opacity: 0 },
    outerIn: { transform: "translate3d(0, 0, 0)", opacity: 1 },
    duration: 880,
    ease: EASE_QUART,
  },
  "tilt-top": {
    outerPre: {
      transform: "translate3d(0, 14px, 0) scale(0.99)",
      opacity: 0,
    },
    outerIn: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
    duration: 900,
    ease: EASE_EXPO,
  },
  "focus-pull": {
    outerPre: {
      transform: "translate3d(0, 10px, 0) scale(0.985)",
      opacity: 0,
    },
    outerIn: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
    duration: 960,
    ease: EASE_EXPO,
  },
  dolly: {
    outerPre: {
      transform: "translate3d(0, 12px, 0) scale(0.99)",
      opacity: 0,
    },
    outerIn: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
    duration: 980,
    ease: EASE_SINE,
  },
  "fade-up": {
    outerPre: { transform: "translate3d(0, 12px, 0)", opacity: 0 },
    outerIn: { transform: "translate3d(0, 0, 0)", opacity: 1 },
    duration: 860,
    ease: EASE_EXPO,
  },
};

/**
 * Reveal threshold for IntersectionObserver. Keep it modest so fast
 * scrolls never land past a section with it still invisible (`scroll-
 * past fallback` handles the catastrophic case).
 */
/** Maximum parallax drift in pixels (applied symmetrically around center). */
const PARALLAX_RANGE_PX = 10;

export function HomeSectionSnap({
  children,
  className,
  compact = false,
  isFirst,
  variant = "rise",
  parallax = false,
  hideBoundary = false,
  stickyChild = false,
  index,
  total,
  chapter,
}: HomeSectionSnapProps) {
  // Safe cinematic mode: lightweight reveal + optional mild parallax.
  const parallaxEnabled = parallax && !stickyChild;
  const rootRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [swappedIn, setSwappedIn] = useState(!!isFirst);
  const [motionArmed] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [settled, setSettled] = useState(!!isFirst);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const spec = VARIANTS[variant];
  const durationMs = spec.duration;
  const ease = spec.ease;

  useEffect(() => {
    if (isFirst || prefersReducedMotion) {
      setSwappedIn(true);
      setSettled(true);
      return;
    }
    const node = rootRef.current;
    if (!node) return;

    let raf: number | null = null;
    const revealNow = () => {
      if (swappedIn) return;
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (r.top < vh * 0.92) {
        setSwappedIn(true);
      }
    };
    const scheduleReveal = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        revealNow();
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) scheduleReveal();
      },
      {
        threshold: [0, compact ? 0.02 : 0.04],
        // Same trigger band on every viewport — resize must not change feel.
        rootMargin: "0px 0px -6% 0px",
      },
    );
    observer.observe(node);
    scheduleReveal();
    window.addEventListener("scroll", scheduleReveal, { passive: true });
    window.addEventListener("resize", scheduleReveal, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleReveal);
      window.removeEventListener("resize", scheduleReveal);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [isFirst, prefersReducedMotion, compact, swappedIn]);

  useEffect(() => {
    if (!swappedIn) return;
    if (prefersReducedMotion) {
      setSettled(true);
      return;
    }
    const id = window.setTimeout(() => setSettled(true), durationMs + 90);
    return () => window.clearTimeout(id);
  }, [swappedIn, durationMs, prefersReducedMotion]);

  /**
   * Scroll-linked parallax: once the entrance has settled, drift the
   * inner wrapper by up to ±PARALLAX_RANGE_PX as the section passes
   * through the viewport. Disabled for reduced-motion and for sections
   * that contain `position: sticky` descendants (see `parallax` prop).
   */
  useEffect(() => {
    if (!parallaxEnabled || prefersReducedMotion || !settled) return;
    const node = parallaxRef.current;
    const root = rootRef.current;
    if (!node || !root) return;

    let raf: number | null = null;

    const apply = () => {
      raf = null;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = vh / 2;
      const distance = sectionCenter - viewportCenter;
      const maxDistance = vh / 2 + rect.height / 2;
      const normalized = Math.max(
        -1,
        Math.min(1, distance / Math.max(1, maxDistance))
      );
      const offset = -normalized * PARALLAX_RANGE_PX;
      node.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
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
      if (node) node.style.transform = "";
    };
  }, [parallaxEnabled, prefersReducedMotion, settled]);

  const useMotion = !prefersReducedMotion && !isFirst && motionArmed;

  const outerTransition = useMotion
    ? `transform ${durationMs}ms ${ease}, opacity ${durationMs}ms ${ease}`
    : "none";

  // Sticky-safe mode: only opacity animates. Transforms on any
  // ancestor would break the sticky child, so we strip them entirely.
  const stickyOuterPre: CSSProperties = { opacity: 0.9 };
  const stickyOuterIn: CSSProperties = { opacity: 1 };

  /**
   * Faint pre-opacity floor avoids white flash on fast scroll, but stays
   * low enough that the dissolve still reads as cinematic.
   * Same floor on every viewport so resize does not change the dissolve.
   */
  const safePreState = (style: CSSProperties | undefined): CSSProperties => {
    const pre = { ...(style ?? {}) };
    const floor = 0.12;
    const preOpacity =
      typeof pre.opacity === "number"
        ? Math.max(floor, pre.opacity)
        : floor;
    return { ...pre, opacity: preOpacity };
  };

  // Footer / compact wrappers: opacity-only entrance so the page tail
  // fades in without a late translate that can feel like a layout bump.
  const opacityOnlyEntrance = stickyChild || (compact && !isFirst);

  const outerState = opacityOnlyEntrance
    ? swappedIn
      ? stickyOuterIn
      : stickyOuterPre
    : swappedIn
      ? spec.outerIn
      : safePreState(spec.outerPre);

  const outerStyle: CSSProperties = settled
    ? {}
    : opacityOnlyEntrance
      ? {
          ...outerState,
          transition: useMotion
            ? `opacity ${durationMs}ms ${ease}`
            : "none",
          willChange: "opacity",
        }
      : {
          ...outerState,
          transition: outerTransition,
          willChange: "transform, opacity",
        };

  // Soft brand voltage divider between chapters.
  const showBoundary =
    !isFirst &&
    !hideBoundary &&
    typeof index === "number" &&
    typeof total === "number";

  return (
    <div
      ref={rootRef}
      data-entered={swappedIn ? "true" : "false"}
      data-settled={settled ? "true" : "false"}
      data-variant={variant}
      className={cn(
        "relative",
        /**
         * `overflow-x: clip` contains the horizontal `translate3d` used by
         * slide-left / slide-right variants. Without it, the off-screen
         * pre-state pushes the <body> past the viewport edge on initial
         * paint. Skip it when hosting sticky children — paired overflow
         * axes can create a scrollport and break `position: sticky`.
         * Root/body already clip gutters for those sections.
         */
        !stickyChild && "overflow-x-clip overflow-y-clip",
        // Hero keeps viewport height so the first fold feels cinematic.
        // All other sections flow at their own natural content height —
        // no more forced 100dvh gaps that create huge empty voids.
        isFirst && "min-h-[100dvh]",
        className
      )}
    >
      {showBoundary && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 z-[1] md:inset-x-12 lg:inset-x-20"
        >
          <span
            className={cn(
              "voltage-flow mx-auto block max-w-5xl transition-opacity duration-700",
              swappedIn ? "opacity-80" : "opacity-0",
            )}
          />
        </div>
      )}

      <div className="w-full" style={outerStyle}>
        <div ref={parallaxRef} className="w-full will-change-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
