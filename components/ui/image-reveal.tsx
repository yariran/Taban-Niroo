"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type ImageRevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay after entering viewport (ms). */
  delayMs?: number;
  /** Reveal duration (ms). */
  durationMs?: number;
  /** Intersection threshold. */
  threshold?: number;
};

/**
 * Signature cinematic image reveal — wipe top → bottom via clip-path.
 * GPU-friendly, respects prefers-reduced-motion, one-shot observer.
 */
export function ImageReveal({
  children,
  className,
  delayMs = 80,
  durationMs = 1100,
  threshold = 0.18,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setShown(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduceMotion, threshold]);

  const style: CSSProperties = reduceMotion
    ? {}
    : {
        // Bottom inset: clipped → open = reveal from top downward.
        clipPath: shown ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transform: shown ? "scale(1)" : "scale(1.04)",
        opacity: shown ? 1 : 0.85,
        transition: [
          `clip-path ${durationMs}ms ${EASE} ${delayMs}ms`,
          `transform ${durationMs}ms ${EASE} ${delayMs}ms`,
          `opacity ${Math.round(durationMs * 0.7)}ms ${EASE} ${delayMs}ms`,
        ].join(", "),
        willChange: "clip-path, transform, opacity",
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
