"use client";

import {
  Fragment,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { useBeat } from "@/components/ui/beat";

/**
 * Word-by-word cinematic reveal — filmic title card.
 *
 * Splits a string into words, wraps each in an `overflow: hidden` slot, and
 * pushes them up with opacity + translate when the wrapper enters the
 * viewport. Honours `prefers-reduced-motion` and disconnects the observer
 * after the first reveal so the cost is bounded.
 *
 * Safe inside `<HomeSectionSnap>` since the wrapper's entrance envelope
 * was removed — there is no outer reveal left to stack against, so the
 * old "the section arrived twice" hazard is gone. On the home page put it
 * inside a `<Beat>` so it shares the section clock rather than observing
 * itself; see `components/ui/beat.tsx`.
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
  const [selfShown, setSelfShown] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

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
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduceMotion, threshold, beat]);

  const words = children.trim().split(/\s+/).filter(Boolean);
  const TagName = Tag as ElementType;

  return (
    <TagName
      ref={ref as never}
      className={cn("inline-block", className)}
      data-reveal-words={shown ? "in" : "pre"}
    >
      {/*
        Word gaps are a real space character, not padding, and that is two
        fixes in one line.

        `paddingRight` is a PHYSICAL side: in an RTL heading it put every
        word's gap on the word's own start edge, so the spacing sat on the
        wrong side of each word and the line picked up a stray 0.22em at
        its trailing end — visible on every Persian headline, and at a
        different place in the wrap at every breakpoint.

        Padding is also invisible to anything reading text rather than
        pixels. With no whitespace between the slots, `textContent` came
        out as `سبدعایق‌بندی` — one run-on token for a screen reader, for
        the accessible name, and for a crawler. (The cinematic hero's
        `Built for ` carries a note about the same trap.) A space fixes
        both at once, wraps the way the reader's language expects, and
        costs the exact word-space the font was designed with.
      */}
      {words.map((word, i) => {
        const innerStyle: CSSProperties = reduceMotion
          ? { transform: "translateY(0)", opacity: 1 }
          : {
              transform: shown ? "translateY(0)" : "translateY(110%)",
              opacity: shown ? 1 : 0,
              transition: `transform ${duration}ms var(--ease-reveal) ${delay + i * stagger}ms, opacity ${duration}ms var(--ease-reveal) ${delay + i * stagger}ms`,
              willChange: "transform, opacity",
            };
        return (
          <Fragment key={`${word}-${i}`}>
            {i > 0 ? " " : null}
            <span className="inline-block overflow-hidden align-baseline">
              <span className="inline-block" style={innerStyle}>
                {word}
              </span>
            </span>
          </Fragment>
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
  const [selfShown, setSelfShown] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [settled, setSettled] = useState(false);

  /**
   * Inside a `<Beat>` the section owns the clock; outside one (inner
   * routes) this keeps observing itself. See `components/ui/beat.tsx`.
   */
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
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduceMotion, threshold, beat]);

  /** Release the compositing layer once the lift has landed. */
  useEffect(() => {
    if (!shown || reduceMotion) return;
    const t = window.setTimeout(() => setSettled(true), delay + duration + 60);
    return () => window.clearTimeout(t);
  }, [shown, reduceMotion, delay, duration]);

  const TagName = Tag as ElementType;
  const style: CSSProperties = reduceMotion
    ? {}
    : {
        transform: shown ? "translate3d(0,0,0)" : `translate3d(0,${distance}px,0)`,
        opacity: shown ? 1 : 0,
        transition: `transform ${duration}ms var(--ease-reveal) ${delay}ms, opacity ${duration}ms var(--ease-reveal) ${delay}ms`,
        willChange: settled ? undefined : "transform, opacity",
      };

  return (
    <TagName
      ref={ref as never}
      className={className}
      style={style}
      data-reveal-up={shown ? "in" : "pre"}
    >
      {children}
    </TagName>
  );
}
