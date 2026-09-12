"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { useBeat } from "@/components/ui/beat";
import { EVIDENCE } from "@/lib/motion-roles";

const EASE = "var(--ease-standard)";

/** Children past this index share the last delay — see `EVIDENCE` in lib/motion-roles.ts. */
const STAGGER_CAP = EVIDENCE.staggerCap;

type RevealTextProps = {
  children: string;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "h4" | "p";
  className?: string;
  delayMs?: number;
  stepMs?: number;
  durationMs?: number;
  splitLines?: boolean;
};

/**
 * Line / word reveal for headings. Starts after IntersectionObserver
 * (and optional delay) so it can sit under HomeSectionSnap without
 * fighting the envelope — keep delayMs ≥ 120 on home.
 */
export function RevealText({
  children,
  as: Tag = "span",
  className,
  delayMs = 120,
  stepMs = 90,
  durationMs = 900,
  splitLines = false,
}: RevealTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [selfShown, setSelfShown] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  /** See the note on `RevealBlock` — the section clock wins when present. */
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
      { threshold: 0.2, rootMargin: "0px 0px -4% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduceMotion, beat]);

  const parts =
    splitLines && children.includes("|")
      ? children.split(/\s*\|\s*/)
      : children.trim().split(/\s+/).filter(Boolean);

  const useLines = splitLines && children.includes("|");

  return (
    <Tag
      ref={ref as never}
      className={cn(className)}
      data-reveal-text={shown ? "in" : "pre"}
    >
      {parts.map((part, i) => {
        const style: CSSProperties = reduceMotion
          ? {}
          : {
              display: useLines ? "block" : "inline-block",
              transform: shown
                ? "translate3d(0,0,0)"
                : "translate3d(0,1.1em,0)",
              opacity: shown ? 1 : 0,
              transition: `transform ${durationMs}ms ${EASE} ${delayMs + i * stepMs}ms, opacity ${durationMs}ms ${EASE} ${delayMs + i * stepMs}ms`,
              willChange: "transform, opacity",
            };
        return (
          <span
            key={`${part}-${i}`}
            /*
              The word gap lives HERE, on the static wrapper, not in the
              motion style object below.

              Splitting on `\s+` throws the spaces away, and they used to be
              restored as `paddingRight` inside the animated inline style —
              which is `{}` under `prefers-reduced-motion`. Every heading
              rendered through this component therefore ran its words
              together for reduced-motion readers ("Composite&Hybrid.").
              Spacing is layout, not choreography, so it belongs on the
              element that is always painted.
            */
            className={cn(
              useLines
                ? "block overflow-hidden"
                : "inline-block overflow-hidden align-baseline pe-[0.22em]",
            )}
          >
            <span style={style}>{part}</span>
          </span>
        );
      })}
    </Tag>
  );
}

type RevealBlockProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  durationMs?: number;
  distance?: number;
  stagger?: number;
  /**
   * `dl` matters for KPI rows: the staggered children must be the metrics
   * themselves, so this component has to BE the list, not wrap it.
   */
  as?: "div" | "ul" | "ol" | "dl" | "section" | "article" | "header";
};

/**
 * Staggered fade-up for card grids and content groups.
 * Soft by design — pairs with section envelope, does not replace it.
 */
export function RevealBlock({
  children,
  className,
  delayMs = 160,
  durationMs = 820,
  distance = 22,
  stagger = 70,
  as = "div",
}: RevealBlockProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [selfShown, setSelfShown] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  /**
   * Inside a `<Beat>` the section owns the clock and this component must
   * NOT observe itself — that is what let a headline fire hundreds of
   * pixels before the group it belongs to. Outside one (all inner routes)
   * the local observer is still the only trigger available.
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
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduceMotion, beat]);

  const Tag = as as "div";
  const items = Children.toArray(children);

  /**
   * Drop `will-change` once the phrase has landed. Holding a compositing
   * layer per revealed node for the lifetime of the page is the classic
   * silent regression here — see the same teardown in `blur-reveal.tsx`.
   */
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!shown || reduceMotion) return;
    const cap = Math.min(Math.max(items.length - 1, 0), STAGGER_CAP);
    const t = window.setTimeout(
      () => setSettled(true),
      delayMs + cap * stagger + durationMs + 60,
    );
    return () => window.clearTimeout(t);
  }, [shown, reduceMotion, items.length, delayMs, stagger, durationMs]);

  return (
    <Tag
      ref={ref as never}
      className={className}
      data-reveal-block={shown ? "in" : "pre"}
    >
      {items.map((child, i) => {
        /**
         * Cap the stagger index. Uncapped, a nine-item list ran an
         * extra ~500ms of tail past its own duration and drifted out of
         * phase with the rest of the section's beat.
         */
        const step = Math.min(i, STAGGER_CAP) * stagger;
        const style: CSSProperties = reduceMotion
          ? {}
          : {
              transform: shown
                ? "translate3d(0,0,0)"
                : `translate3d(0,${distance}px,0)`,
              opacity: shown ? 1 : 0,
              transition: `transform ${durationMs}ms ${EASE} ${delayMs + step}ms, opacity ${durationMs}ms ${EASE} ${delayMs + step}ms`,
              willChange: settled ? undefined : "transform, opacity",
            };

        // Merge onto element children so grid col-span / layout classes stay put.
        if (isValidElement(child)) {
          const el = child as ReactElement<{ style?: CSSProperties }>;
          return cloneElement(el, {
            key: el.key ?? i,
            style: { ...(el.props.style ?? {}), ...style },
          });
        }

        return (
          <div key={i} style={style}>
            {child}
          </div>
        );
      })}
    </Tag>
  );
}
