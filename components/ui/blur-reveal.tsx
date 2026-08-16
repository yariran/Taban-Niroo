"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const EASE = "var(--ease-standard)";

type BlurRevealProps = {
  children: string;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "h4" | "p";
  className?: string;
  /**
   * `char` gives the tight focus-pull used on short cinematic headlines.
   * `word` is the default because per-character `filter: blur()` creates one
   * compositing layer per node — fine for a six-word headline, ruinous for a
   * paragraph. Anything longer than a headline must stay on `word`.
   */
  splitBy?: "char" | "word";
  delayMs?: number;
  stepMs?: number;
  durationMs?: number;
  /** Starting blur radius in px. */
  blurPx?: number;
};

/**
 * Focus-pull text reveal — the signature cinematic device.
 *
 * Units start blurred and transparent and resolve to sharp, staggered like a
 * camera finding focus. Adapted from the `on.energy` treatment and mapped onto
 * this site's motion tokens.
 *
 * Accessibility: the wrapper carries `aria-label` with the intact sentence and
 * every animated unit is `aria-hidden`. This is deliberately different from
 * `RevealText`, whose split spans make `textContent` read as
 * "Engineeringthatstarts…" to screen readers and on copy-paste.
 *
 * Under `prefers-reduced-motion: reduce` the text renders as plain, fully
 * visible content with no split nodes and no transition at all.
 */
export function BlurReveal({
  children,
  as: Tag = "span",
  className,
  splitBy = "word",
  delayMs = 80,
  stepMs = 28,
  durationMs = 900,
  blurPx = 10,
}: BlurRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const [settled, setSettled] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  const text = children;

  const units = useMemo(() => {
    if (splitBy === "char") return Array.from(text);
    // Keep the trailing space attached to each word so the label and the
    // rendered line break identically.
    return text.split(/(\s+)/).filter((part) => part.length > 0);
  }, [text, splitBy]);

  useEffect(() => {
    if (reduceMotion) return;
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -4% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduceMotion]);

  /**
   * Drop `will-change` once the last unit has landed — leaving it on holds a
   * compositing layer per node for the life of the page.
   */
  useEffect(() => {
    if (!shown || reduceMotion) return;
    const total = delayMs + units.length * stepMs + durationMs;
    const t = window.setTimeout(() => setSettled(true), total);
    return () => window.clearTimeout(t);
  }, [shown, reduceMotion, delayMs, units.length, stepMs, durationMs]);

  if (reduceMotion) {
    return <Tag className={cn(className)}>{text}</Tag>;
  }

  return (
    <Tag
      ref={ref as never}
      className={cn(className)}
      data-blur-reveal={shown ? "in" : "pre"}
    >
      {/*
        A visually-hidden copy carries the accessible text, rather than
        `aria-label` on the wrapper.

        `aria-label` is prohibited on several implicit roles — notably
        `paragraph`, which is what `as="p"` produces — so labelling the
        wrapper raised a serious `aria-prohibited-attr` violation and, on
        those elements, silently failed to expose the text at all. A
        `sr-only` span works on every tag this component can render.
        The split units stay `aria-hidden` so the string is not doubled.
      */}
      <span className="sr-only">{text}</span>
      {units.map((unit, i) => {
        // Whitespace units need no animation — animating them adds layers and
        // makes the stagger read unevenly.
        if (/^\s+$/.test(unit)) {
          return (
            <span key={`s-${i}`} aria-hidden="true">
              {unit}
            </span>
          );
        }

        const style: CSSProperties = {
          display: "inline-block",
          whiteSpace: "pre",
          filter: shown ? "blur(0px)" : `blur(${blurPx}px)`,
          opacity: shown ? 1 : 0,
          transition: `filter ${durationMs}ms ${EASE} ${delayMs + i * stepMs}ms, opacity ${durationMs}ms ${EASE} ${delayMs + i * stepMs}ms`,
          ...(settled ? {} : { willChange: "filter, opacity" }),
        };

        return (
          <span key={`${unit}-${i}`} aria-hidden="true" style={style}>
            {unit}
          </span>
        );
      })}
    </Tag>
  );
}
