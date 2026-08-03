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

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

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
      { threshold: 0.2, rootMargin: "0px 0px -4% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduceMotion]);

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
              ...(useLines ? {} : { paddingRight: "0.22em" }),
            };
        return (
          <span
            key={`${part}-${i}`}
            className={cn(useLines ? "block overflow-hidden" : "inline-block overflow-hidden align-baseline")}
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
  as?: "div" | "ul" | "ol" | "section" | "article" | "header";
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
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduceMotion]);

  const Tag = as as "div";
  const items = Children.toArray(children);

  return (
    <Tag
      ref={ref as never}
      className={className}
      data-reveal-block={shown ? "in" : "pre"}
    >
      {items.map((child, i) => {
        const style: CSSProperties = reduceMotion
          ? {}
          : {
              transform: shown
                ? "translate3d(0,0,0)"
                : `translate3d(0,${distance}px,0)`,
              opacity: shown ? 1 : 0,
              transition: `transform ${durationMs}ms ${EASE} ${delayMs + i * stagger}ms, opacity ${durationMs}ms ${EASE} ${delayMs + i * stagger}ms`,
              willChange: "transform, opacity",
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
