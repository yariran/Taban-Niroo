"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

/**
 * Pinned-runway scroll choreography.
 *
 * The device: a tall `track` element wraps a `sticky top-0 h-screen` stage.
 * As the track scrolls past, `progress` runs 0 → 1, and each scene claims a
 * band of that range. One scene owns the viewport at a time; the stage stays
 * pinned until the runway is spent.
 *
 * `components/sections/hero-section.tsx` implements this same loop inline for
 * the home hero. It is intentionally left alone for now — collapsing it onto
 * this hook is a follow-up, since it drives the home page.
 */

/** Hermite ease — flat at both ends, so scene cuts don't snap. */
export function smoothstep01(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/**
 * Full-viewport scene layer: opaque, no bleed from neighbours.
 * `visibility` is what actually removes a faded-out scene from hit-testing
 * and from the accessibility tree — opacity alone would leave it there.
 */
export function sceneLayerStyle(
  opacity: number,
  zIndex: number,
): CSSProperties {
  const shown = opacity > 0.02;
  return {
    opacity,
    zIndex,
    visibility: shown ? "visible" : "hidden",
    pointerEvents: opacity > 0.85 ? "auto" : "none",
  };
}

/**
 * Height of the pinned stage — deliberately NOT `window.innerHeight`.
 *
 * Those two are the same number on a desktop browser and different on
 * every phone, which is why a runway measured from `innerHeight` looks
 * correct until it ships. A stage sized in `vh` is laid out against the
 * LARGE viewport (toolbar hidden); `innerHeight` reports the CURRENT one,
 * which shrinks the moment the toolbar slides back in. Divide the real
 * travel — `trackHeight - stageHeight` — by the larger `trackHeight -
 * innerHeight` and `progress` tops out somewhere around 0.85 instead of 1.
 * Everything keyed to the end of the runway then never arrives: the last
 * scene of a sequence holds at partial opacity, and anything gated on a
 * high progress value (a CTA's `pointer-events`, say) never switches on.
 *
 * Measuring the element we actually pin makes the denominator the real
 * travel whatever unit the stylesheet reached for, so the loop stays
 * correct under `vh`, `svh`, `dvh` and a mid-scroll toolbar alike.
 */
function pinnedStageHeight(track: HTMLElement): number {
  const stage = track.firstElementChild;
  if (
    stage instanceof HTMLElement &&
    getComputedStyle(stage).position === "sticky"
  ) {
    return stage.offsetHeight;
  }
  return window.innerHeight;
}

export type ScrollScene = {
  /** 0 → 1 across the whole runway. Always 0 when `disabled`. */
  progress: number;
  /**
   * Map runway progress onto a 0 → 1 band, eased.
   * `band(0.2, 0.3)` is fully 0 before 20%, fully 1 after 30%.
   */
  band: (start: number, end: number) => number;
};

/**
 * Track scroll progress through a pinned runway.
 *
 * Pass `disabled` (typically `usePrefersReducedMotion()`) to freeze progress
 * at 0 and skip the listener entirely — callers render a static layout then.
 */
export function useScrollScene(
  trackRef: RefObject<HTMLElement | null>,
  { disabled = false }: { disabled?: boolean } = {},
): ScrollScene {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    if (disabled) {
      setProgress(0);
      return;
    }
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const scrollable = Math.max(
      track.offsetHeight - pinnedStageHeight(track),
      1,
    );
    const scrolled = Math.max(0, Math.min(scrollable, -rect.top));
    // Linear track progress — easing lives in the per-scene bands, so the
    // runway doesn't feel slow at the ends and fast in the middle.
    setProgress(scrolled / scrollable);
  }, [disabled, trackRef]);

  useEffect(() => {
    if (disabled) return;
    const tick = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateProgress);
    };
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    tick();
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateProgress, disabled]);

  const band = useCallback(
    (start: number, end: number) =>
      smoothstep01(
        Math.max(0, Math.min(1, (progress - start) / (end - start))),
      ),
    [progress],
  );

  return { progress, band };
}
