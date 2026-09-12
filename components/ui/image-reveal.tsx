"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { useBeat } from "@/components/ui/beat";
import { PLATE } from "@/lib/motion-roles";

const EASE = "var(--ease-entrance)";

type ImageRevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay after the clock fires (ms). */
  delayMs?: number;
  /** Reveal duration (ms). */
  durationMs?: number;
  /** Intersection threshold — ignored inside a `<Beat>`. */
  threshold?: number;
  /**
   * How much of the frame is closed at rest.
   *
   * `"settle"` (default) opens from `inset(0 0 14% 0)` — the `plate` role
   * from `lib/motion-roles.ts`: a frame relaxing open. `"wipe"` keeps the
   * original full `inset(0 0 100% 0)` sweep, which is a showier device;
   * reserve it for call sites that were built around it.
   */
  from?: "settle" | "wipe";
};

/**
 * The `plate` role — APERTURE.
 *
 * The only reveal in the system with **zero translation**. Vertical
 * translate is the gesture every other role is built from, so dropping it
 * is the strongest separator available: `scale 1.06 → 1` produces radial,
 * inward edge motion — a different vector field from any slide — and the
 * clip opening adds an event no other role has.
 *
 * Note for parallax call sites: this component writes inline `transform`.
 * `useElementParallax` also writes `el.style.transform`, and last writer
 * wins. Never put `data-parallax` on the same node — always wrap:
 * `<div data-parallax="0.92"><ImageReveal>…</ImageReveal></div>`.
 */
export function ImageReveal({
  children,
  className,
  delayMs = 0,
  durationMs = PLATE.duration,
  threshold = PLATE.threshold,
  from = "settle",
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [selfShown, setSelfShown] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [settled, setSettled] = useState(false);

  /** Section clock wins when present; otherwise observe ourselves. */
  const beat = useBeat();
  const shown = beat ? beat.entered : selfShown;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (beat) return;
    if (reduceMotion) {
      setSelfShown(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSelfShown(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduceMotion, threshold, beat]);

  /** A plate is the slowest thing on the page — release its layer after. */
  useEffect(() => {
    if (!shown || reduceMotion) return;
    const t = window.setTimeout(
      () => setSettled(true),
      delayMs + durationMs + 60,
    );
    return () => window.clearTimeout(t);
  }, [shown, reduceMotion, delayMs, durationMs]);

  const closed = from === "wipe" ? "inset(0 0 100% 0)" : PLATE.clipFrom;

  const style: CSSProperties = reduceMotion
    ? {}
    : {
        clipPath: shown ? "inset(0 0 0 0)" : closed,
        transform: shown ? "scale(1)" : `scale(${PLATE.scaleFrom})`,
        opacity: shown ? 1 : PLATE.opacityFrom,
        transition: [
          `clip-path ${durationMs}ms ${EASE} ${delayMs}ms`,
          // Scale trails the clip slightly so the frame reads as opening
          // first and the image as relaxing into it, not one blunt move.
          `transform ${durationMs}ms ${EASE} ${delayMs + 120}ms`,
          `opacity ${Math.round(durationMs * 0.65)}ms ${EASE} ${delayMs}ms`,
        ].join(", "),
        willChange: settled ? undefined : "clip-path, transform, opacity",
      };

  return (
    <div
      ref={ref}
      className={cn("h-full w-full overflow-hidden", className)}
      data-image-reveal={shown ? "in" : "pre"}
      style={style}
    >
      {children}
    </div>
  );
}
