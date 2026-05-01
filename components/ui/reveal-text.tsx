"use client";

import {
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal primitives — DISABLED pass-through mode.
 *
 * Earlier revisions of these components ran their own IntersectionObserver-
 * driven reveal (word-by-word mask for text, staggered fade-up for blocks).
 * Combined with `<HomeSectionSnap>`'s outer + inner + boundary choreography,
 * that produced a visible "double reveal" — each section animated in, then
 * its headings/paragraphs animated in again a fraction of a second later.
 *
 * The section-level reveal is the single source of truth for entrance
 * animation now. These components stay as lightweight pass-through wrappers
 * so the call sites across nine sections don't have to be rewritten; they
 * simply render their children (and honour the semantic `as` prop where
 * useful). Text remains cinematic because it rides in on the parent
 * section's reveal.
 *
 * If a future design calls for per-element text animation again, reinstate
 * the observer logic here — but coordinate it with the section-snap timing
 * to avoid stacking two reveals on the same content.
 */

type RevealTextProps = {
  children: string;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "h4" | "p";
  className?: string;
  /** @deprecated Ignored in pass-through mode. */
  delayMs?: number;
  /** @deprecated Ignored in pass-through mode. */
  stepMs?: number;
  /** @deprecated Ignored in pass-through mode. */
  durationMs?: number;
  /** @deprecated Ignored in pass-through mode. */
  splitLines?: boolean;
};

export function RevealText({
  children,
  as: Tag = "span",
  className,
  splitLines = false,
}: RevealTextProps) {
  if (splitLines && typeof children === "string" && children.includes("|")) {
    const lines = children.split(/\s*\|\s*/);
    return (
      <Tag className={cn(className)}>
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }
  return <Tag className={className}>{children}</Tag>;
}

type RevealBlockProps = {
  children: ReactNode;
  className?: string;
  /** @deprecated Ignored in pass-through mode. */
  delayMs?: number;
  /** @deprecated Ignored in pass-through mode. */
  durationMs?: number;
  /** @deprecated Ignored in pass-through mode. */
  distance?: number;
  /** @deprecated Ignored in pass-through mode. */
  stagger?: number;
  as?: "div" | "ul" | "ol" | "section" | "article" | "header";
};

export function RevealBlock({
  children,
  className,
  as = "div",
}: RevealBlockProps) {
  const Tag = as as "div";
  return <Tag className={className}>{children}</Tag>;
}
