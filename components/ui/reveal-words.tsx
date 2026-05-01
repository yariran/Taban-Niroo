"use client";

import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Word-by-word cinematic reveal — filmic title card.
 *
 * Splits a string into words, wraps each in an `overflow: hidden` slot, and
 * pushes them up with opacity + translate when the wrapper enters the
 * viewport. Honours `prefers-reduced-motion` and disconnects the observer
 * after the first reveal so the cost is bounded.
 *
 * Important: do NOT use this inside `<HomeSectionSnap>` content — the
 * home page already runs an outer envelope reveal, and a second per-word
 * reveal stacked on top reads as "the section arrived twice". Use this on
 * inner-route pages (about, products, projects, contact, blog, 404).
 */
type RevealWordsProps = {
  children: string;
  as?: ElementType;
  className?: string;
  /** Initial pause before the first word starts moving (ms). */
  delay?: number;
  /** Per-word stagger (ms). Lower = tighter cadence. */
  stagger?: number;
  /** Animation duration per word (ms). */
  duration?: number;
  /** Intersection threshold to start the reveal. */
  threshold?: number;
};

export function RevealWords({
  children,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 60,
  duration = 900,
  threshold = 0.25,
}: RevealWordsProps) {
  const ref = useRef<HTMLElement | null>(null);
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
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduceMotion, threshold]);

  const words = children.trim().split(/\s+/).filter(Boolean);
  const TagName = Tag as ElementType;

  return (
    <TagName
      ref={ref as never}
      className={cn("inline-block", className)}
      data-reveal-words={shown ? "in" : "pre"}
    >
      {words.map((word, i) => {
        const slotStyle: CSSProperties = {
          paddingRight: "0.22em",
        };
        const innerStyle: CSSProperties = reduceMotion
          ? { transform: "translateY(0)", opacity: 1 }
          : {
              transform: shown ? "translateY(0)" : "translateY(110%)",
              opacity: shown ? 1 : 0,
              transition: `transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay + i * stagger}ms, opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay + i * stagger}ms`,
              willChange: "transform, opacity",
            };
        return (
          <span
            key={`${word}-${i}`}
            style={slotStyle}
            className="inline-block overflow-hidden align-baseline"
          >
            <span className="inline-block" style={innerStyle}>
              {word}
            </span>
          </span>
        );
      })}
    </TagName>
  );
}

/**
 * Lighter-weight variant — fades a single block of children up from a
 * small offset on first viewport entry. Use for paragraphs / images that
 * sit beside a `RevealWords` heading on inner pages.
 */
type RevealUpProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  as?: ElementType;
  threshold?: number;
};

export function RevealUp({
  children,
  className,
  delay = 0,
  duration = 950,
  distance = 22,
  as: Tag = "div",
  threshold = 0.2,
}: RevealUpProps) {
  const ref = useRef<HTMLElement | null>(null);
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
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduceMotion, threshold]);

  const TagName = Tag as ElementType;
  const style: CSSProperties = reduceMotion
    ? {}
    : {
        transform: shown ? "translate3d(0,0,0)" : `translate3d(0,${distance}px,0)`,
        opacity: shown ? 1 : 0,
        transition: `transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "transform, opacity",
      };

  return (
    <TagName ref={ref as never} className={className} style={style}>
      {children}
    </TagName>
  );
}
