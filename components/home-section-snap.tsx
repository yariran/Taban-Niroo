"use client";

import {
  useEffect,
  useLayoutEffect,
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
 *   4. Responsive translate budgets. Mobile viewports use roughly
 *      two-thirds of the desktop translate distance so the entrance
 *      never feels thrashy on a small screen.
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
const EASE_EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
/** quart-out: slightly softer entry for text-heavy sections. */
const EASE_QUART = "cubic-bezier(0.25, 1, 0.35, 1)";
/** sine-out: velvet finish for wide cinematic dollies. */
const EASE_SINE = "cubic-bezier(0.33, 1, 0.68, 1)";

type VariantSpec = {
  outerPre: CSSProperties;
  outerIn: CSSProperties;
  duration: number;
  ease: string;
  /** Multiplier applied to `translate` distances on narrow viewports. */
  mobileScale?: number;
};

/**
 * Variants are deliberately single-stage now: one `transform + opacity`
 * transition on the outer envelope. Earlier revisions paired that with a
 * second inner-wrapper animation (offset by ~200 ms) to produce a staged
 * cadence, but in practice readers perceived that as the section
 * "arriving twice" — especially in combination with per-element reveals
 * inside each section. One clean move per section reads as more refined.
 */
const VARIANTS: Record<SectionVariant, VariantSpec> = {
  rise: {
    outerPre: { transform: "translate3d(0, 64px, 0)", opacity: 0 },
    outerIn: { transform: "translate3d(0, 0, 0)", opacity: 1 },
    duration: 1100,
    ease: EASE_EXPO,
  },
  veil: {
    outerPre: { transform: "translate3d(0, 36px, 0) scale(1.015)", opacity: 0 },
    outerIn: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
    duration: 1050,
    ease: EASE_EXPO,
  },
  curtain: {
    outerPre: {
      transform: "translate3d(0, 56px, 0) scale(0.975)",
      opacity: 0,
    },
    outerIn: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
    duration: 1150,
    ease: EASE_EXPO,
  },
  zoom: {
    outerPre: {
      transform: "translate3d(0, 20px, 0) scale(1.05)",
      opacity: 0,
    },
    outerIn: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
    duration: 1100,
    ease: EASE_EXPO,
  },
  iris: {
    outerPre: { transform: "translate3d(0, 0, 0) scale(0.94)", opacity: 0 },
    outerIn: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
    duration: 1150,
    ease: EASE_EXPO,
  },
  "slide-right": {
    outerPre: { transform: "translate3d(-72px, 20px, 0)", opacity: 0 },
    outerIn: { transform: "translate3d(0, 0, 0)", opacity: 1 },
    duration: 1100,
    ease: EASE_QUART,
    mobileScale: 0.55,
  },
  "slide-left": {
    outerPre: { transform: "translate3d(72px, 20px, 0)", opacity: 0 },
    outerIn: { transform: "translate3d(0, 0, 0)", opacity: 1 },
    duration: 1100,
    ease: EASE_QUART,
    mobileScale: 0.55,
  },
  "tilt-top": {
    outerPre: {
      transform: "translate3d(0, 58px, 0) scale(0.985)",
      opacity: 0,
    },
    outerIn: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
    duration: 1150,
    ease: EASE_EXPO,
  },
  "focus-pull": {
    outerPre: {
      transform: "translate3d(0, 28px, 0) scale(0.95)",
      opacity: 0,
    },
    outerIn: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
    duration: 1200,
    ease: EASE_EXPO,
  },
  dolly: {
    outerPre: {
      transform: "translate3d(0, 48px, 0) scale(0.96)",
      opacity: 0,
    },
    outerIn: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
    duration: 1250,
    ease: EASE_SINE,
  },
  "fade-up": {
    outerPre: { transform: "translate3d(0, 34px, 0)", opacity: 0 },
    outerIn: { transform: "translate3d(0, 0, 0)", opacity: 1 },
    duration: 950,
    ease: EASE_QUART,
  },
};

/**
 * Reveal threshold for IntersectionObserver. Keep it modest so fast
 * scrolls never land past a section with it still invisible (`scroll-
 * past fallback` handles the catastrophic case).
 */
const REVEAL_RATIO = 0.1;
const REVEAL_RATIO_COMPACT = 0.06;

/** Maximum parallax drift in pixels (applied symmetrically around center). */
const PARALLAX_RANGE_PX = 10;

function isSectionEnteredView(el: HTMLElement, compact: boolean | undefined) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  if (r.height <= 0) return false;

  // Already scrolled past — force settled state, no pre-dim flicker.
  if (r.top < vh * 0.35) return true;

  const overlapTop = Math.max(r.top, 0);
  const overlapBottom = Math.min(r.bottom, vh);
  const overlap = Math.max(0, overlapBottom - overlapTop);
  const visibleRatio = overlap / Math.min(r.height, vh);

  const minRatio = compact ? REVEAL_RATIO_COMPACT : REVEAL_RATIO;
  return visibleRatio >= minRatio;
}

export function HomeSectionSnap({
  children,
  className,
  compact,
  isFirst,
  variant = "rise",
  parallax = false,
  hideBoundary = false,
  stickyChild = false,
  index,
  total,
  chapter,
}: HomeSectionSnapProps) {
  // A sticky descendant cannot tolerate any transform on an ancestor,
  // so transform-based parallax is silently disabled in that mode.
  const parallaxEnabled = parallax && !stickyChild;
  const rootRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [swappedIn, setSwappedIn] = useState(!!isFirst);
  const [motionArmed, setMotionArmed] = useState(!!isFirst);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [settled, setSettled] = useState(!!isFirst);
  const [isNarrow, setIsNarrow] = useState(false);
  const scrollRaf = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (isFirst) return;
    setMotionArmed(true);
  }, [isFirst]);

  useEffect(() => {
    if (isFirst) return;

    if (prefersReducedMotion) {
      setSwappedIn(true);
      setSettled(true);
      return;
    }

    const el = rootRef.current;
    if (!el) return;

    let done = false;

    const tryReveal = () => {
      if (done) return;
      if (isSectionEnteredView(el, compact)) {
        done = true;
        setSwappedIn(true);
      }
    };

    const scheduleTryReveal = () => {
      if (done) return;
      if (scrollRaf.current != null) return;
      scrollRaf.current = requestAnimationFrame(() => {
        scrollRaf.current = null;
        tryReveal();
      });
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) scheduleTryReveal();
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: compact
          ? [0, REVEAL_RATIO_COMPACT, 0.35, 0.7]
          : [0, REVEAL_RATIO, 0.45, 0.8],
      }
    );
    obs.observe(el);

    window.addEventListener("scroll", scheduleTryReveal, { passive: true });
    window.addEventListener("scrollend", scheduleTryReveal, { passive: true });
    window.addEventListener("resize", tryReveal, { passive: true });

    scheduleTryReveal();

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", scheduleTryReveal);
      window.removeEventListener("scrollend", scheduleTryReveal);
      window.removeEventListener("resize", tryReveal);
      if (scrollRaf.current != null) cancelAnimationFrame(scrollRaf.current);
    };
  }, [isFirst, compact, prefersReducedMotion]);

  const spec = VARIANTS[variant];
  const durationMs = spec.duration;
  const ease = spec.ease;

  useEffect(() => {
    if (!swappedIn || settled) return;
    const id = window.setTimeout(
      () => setSettled(true),
      durationMs + 120
    );
    return () => window.clearTimeout(id);
  }, [swappedIn, settled, durationMs]);

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
      // Center of the section relative to viewport center, normalized.
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = vh / 2;
      const distance = sectionCenter - viewportCenter;
      const maxDistance = vh / 2 + rect.height / 2;
      const normalized = Math.max(
        -1,
        Math.min(1, distance / Math.max(1, maxDistance))
      );
      const offset = isNarrow
        ? -normalized * (PARALLAX_RANGE_PX * 0.55)
        : -normalized * PARALLAX_RANGE_PX;
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
  }, [parallaxEnabled, prefersReducedMotion, settled, isNarrow]);

  const useMotion = !prefersReducedMotion && !isFirst && motionArmed;

  const outerTransition = useMotion
    ? `transform ${durationMs}ms ${ease}, opacity ${durationMs}ms ${ease}`
    : "none";

  const mobileScale = spec.mobileScale ?? 0.72;
  const narrowAdjust = (css: CSSProperties | undefined): CSSProperties | undefined => {
    if (!css || !isNarrow) return css;
    const t = css.transform;
    if (typeof t !== "string") return css;
    // Scale down horizontal and vertical translate distances on mobile
    // so the reveal feels tight on narrow screens.
    const scaled = t.replace(
      /translate3d\(\s*(-?\d*\.?\d+)px,\s*(-?\d*\.?\d+)px,\s*0\s*\)/g,
      (_, x: string, y: string) => {
        const nx = (parseFloat(x) * mobileScale).toFixed(2);
        const ny = (parseFloat(y) * mobileScale).toFixed(2);
        return `translate3d(${nx}px, ${ny}px, 0)`;
      }
    );
    return { ...css, transform: scaled };
  };

  // Sticky-safe mode: only opacity animates. Transforms on any
  // ancestor would break the sticky child, so we strip them entirely.
  const stickyOuterPre: CSSProperties = { opacity: 0 };
  const stickyOuterIn: CSSProperties = { opacity: 1 };

  const outerState = stickyChild
    ? swappedIn
      ? stickyOuterIn
      : stickyOuterPre
    : swappedIn
      ? spec.outerIn
      : narrowAdjust(spec.outerPre);

  const outerStyle: CSSProperties = settled
    ? {}
    : stickyChild
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

  const showBoundary = !isFirst && !hideBoundary;

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
         * paint, which shows up as a black gutter to the right of the
         * hero until every variant settles. Vertical overflow is still
         * visible so the subtle rise / tilt transforms are not clipped.
         */
        "overflow-x-clip",
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
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-0"
        >
          {/* Scene-cut sweep — a soft luminous hairline travels across the
              full section break before the blueprint divider settles.
              Reads as a film cut between scenes. Plays once on entry,
              and is skipped entirely for reduced-motion visitors. */}
          <span
            className={cn(
              "absolute left-0 top-0 block h-px w-full",
              "bg-gradient-to-r from-transparent via-foreground/65 to-transparent",
              "dark:via-white/75"
            )}
            style={{
              opacity: 0,
              animation:
                swappedIn && useMotion
                  ? "section-sweep 1300ms cubic-bezier(0.16,1,0.3,1) both"
                  : undefined,
            }}
          />
          {/* Primary hairline — blueprint divider that draws in from center. */}
          <span
            className={cn(
              "absolute left-1/2 top-0 block h-px -translate-x-1/2",
              "bg-gradient-to-r from-transparent via-foreground/25 to-transparent",
              "transition-[width,opacity] duration-[1100ms]",
              "dark:via-white/25"
            )}
            style={{
              width: swappedIn ? "62%" : "0%",
              opacity: swappedIn ? 0.8 : 0,
              transitionTimingFunction: ease,
              transitionDelay: "260ms",
            }}
          />
          {/* Secondary accent — small darker segment for industrial cue. */}
          <span
            className={cn(
              "absolute left-1/2 top-0 block h-[2px] -translate-x-1/2",
              "bg-foreground/55 transition-[width,opacity] duration-[1100ms]",
              "dark:bg-white/60"
            )}
            style={{
              width: swappedIn ? "48px" : "0px",
              opacity: swappedIn ? 1 : 0,
              transitionTimingFunction: ease,
              transitionDelay: "320ms",
            }}
          />
          {/* Outer tick marks — evokes engineering drawings without clutter. */}
          <span
            className={cn(
              "absolute top-0 block h-[7px] w-px bg-foreground/40",
              "transition-[transform,opacity] duration-[900ms]",
              "dark:bg-white/40"
            )}
            style={{
              left: "calc(50% - 44px)",
              transform: swappedIn
                ? "translate3d(0, 0, 0)"
                : "translate3d(0, -4px, 0)",
              opacity: swappedIn ? 0.75 : 0,
              transitionTimingFunction: ease,
              transitionDelay: "440ms",
            }}
          />
          <span
            className={cn(
              "absolute top-0 block h-[7px] w-px bg-foreground/40",
              "transition-[transform,opacity] duration-[900ms]",
              "dark:bg-white/40"
            )}
            style={{
              left: "calc(50% + 44px)",
              transform: swappedIn
                ? "translate3d(0, 0, 0)"
                : "translate3d(0, -4px, 0)",
              opacity: swappedIn ? 0.75 : 0,
              transitionTimingFunction: ease,
              transitionDelay: "440ms",
            }}
          />
          {/* Corner index — tiny numeric / square marker in the top-right,
              a quiet blueprint signature that appears with each section. */}
          <span
            className={cn(
              "absolute top-3 right-4 hidden h-1.5 w-1.5 rotate-45 md:block",
              "border border-foreground/40 bg-transparent",
              "transition-[transform,opacity] duration-[900ms]",
              "dark:border-white/45"
            )}
            style={{
              transform: swappedIn
                ? "rotate(45deg) scale(1)"
                : "rotate(45deg) scale(0.5)",
              opacity: swappedIn ? 0.9 : 0,
              transitionTimingFunction: ease,
              transitionDelay: "520ms",
            }}
          />
          {/* Chapter slug — the blueprint corner caption. Rendered on
              every breakpoint so each section reads as a numbered scene
              ("04 / 12 — Technology") on phones too. The slug fades and
              lifts in slightly after the boundary marker settles. */}
          {typeof index === "number" && typeof total === "number" && chapter && (
            <span
              className={cn(
                "absolute right-3 top-3 block md:right-4 md:top-6",
                "font-mono text-[9px] uppercase tracking-[0.22em] text-foreground/55 md:text-[10px]",
                "transition-[opacity,transform] duration-[900ms]",
                "dark:text-white/55"
              )}
              style={{
                opacity: swappedIn ? 1 : 0,
                transform: swappedIn
                  ? "translate3d(0, 0, 0)"
                  : "translate3d(0, -3px, 0)",
                transitionTimingFunction: ease,
                transitionDelay: "640ms",
              }}
            >
              <span className="tabular">
                {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <span className="mx-2 text-foreground/30 dark:text-white/30">—</span>
              <span>{chapter}</span>
            </span>
          )}
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
