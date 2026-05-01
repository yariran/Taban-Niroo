"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";

/**
 * Company history timeline.
 *
 * Content is sourced verbatim from the 2025-2026 General Product Range
 * catalogue (p. 8-9) and the Company Profile (p. 3). Each milestone maps
 * 1:1 to the official "HISTORY TIMELINE" section — do not alter year,
 * order, or copy without an updated brand document.
 *
 * Layout:
 *   - The heading / subtitle stay centred within `max-w-6xl` so the
 *     editorial rhythm matches every other homepage section.
 *   - The illustration breaks out of that container and runs full-
 *     viewport-width on desktop. Side edges are softened with a linear
 *     mask so the artwork dissolves into the page background instead
 *     of leaving hard rectangular cuts at the section borders.
 *   - The asset is a transparent monochrome PNG rendered at 2x (2048-
 *     wide) specifically so it remains crisp on HiDPI / widescreen
 *     viewports; `dark:invert` handles the dark palette.
 *   - On small screens the illustration is swapped for a compact
 *     vertical list: the artwork is simply too wide to read sub-768px.
 */
const MILESTONES = [
  {
    year: "1998",
    title: "MV Insulators",
    description: "Design and production of medium-voltage composite insulators begins.",
  },
  {
    year: "2002",
    title: "Hybrid Insulators",
    description: "First patented hybrid silicone–ceramic insulator programme launches.",
  },
  {
    year: "2003",
    title: "HV Insulators",
    description: "Product range extends into high-voltage long rod insulators.",
  },
  {
    year: "2009",
    title: "DPL Insulator brand",
    description: "Dena Power Line Insulators unit formalised as the group's manufacturing arm.",
  },
  {
    year: "2017",
    title: "MV Transformer Bushings",
    description: "Design and production of medium-voltage transformer bushings.",
  },
  {
    year: "2018",
    title: "Post Insulators",
    description: "Line post, station post and railway insulator families added.",
  },
  {
    year: "2020",
    title: "Hybrid Post Insulators",
    description: "Second-generation hybrid platform extended to post applications.",
  },
  {
    year: "2022",
    title: "Cable Accessories",
    description: "Silicone outdoor terminations and joints complete the catalogue.",
  },
] as const;

/**
 * Soft horizontal mask so the full-bleed illustration dissolves into
 * the section background instead of stopping abruptly. A touch of top
 * / bottom feathering keeps the timeline anchored to the page without
 * feeling clipped.
 */
const EDGE_FADE_MASK: CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
  maskImage:
    "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
};

export function TimelineSection() {
  return (
    <section
      id="timeline"
      className="bg-background py-24 md:py-32 lg:py-40"
      aria-labelledby="timeline-heading"
    >
      {/* Header — stays inside the normal editorial column. */}
      <div className="px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <RevealBlock delayMs={40} durationMs={650} distance={12}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              History timeline
            </p>
          </RevealBlock>
          <span id="timeline-heading" className="sr-only">
            Twenty-five years of incremental engineering.
          </span>
          <RevealText
            as="h2"
            splitLines
            delayMs={120}
            stepMs={65}
            durationMs={1050}
            className="mt-4 max-w-3xl text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl"
          >
            {"Twenty-five years of | incremental engineering."}
          </RevealText>
          <RevealBlock
            delayMs={380}
            durationMs={950}
            distance={22}
            className="mt-6 max-w-2xl"
          >
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Every milestone below added a new product family to the Taban
              Niroo catalogue — from medium-voltage insulators in 1998 to a
              complete cable-accessories range in 2022.
            </p>
          </RevealBlock>
        </div>
      </div>

      {/* Desktop illustration — full viewport width, edges softened. */}
      <figure
        className="mt-14 hidden w-full md:mt-20 md:block"
        aria-describedby="timeline-heading"
        style={EDGE_FADE_MASK}
      >
        <div className="relative aspect-[1024/485] w-full">
          <Image
            src="/images/home/history-timeline.png"
            alt="Timeline of Taban Niroo's product milestones from 1998 to 2022, illustrated with each generation of insulator, transformer bushing and cable accessory product."
            fill
            sizes="100vw"
            className="object-cover opacity-95 dark:invert"
            priority={false}
          />
        </div>
      </figure>

      {/* Mobile vertical list — semantic milestones for ≤ md. */}
      <div className="mt-12 px-6 md:hidden">
        <ol
          aria-label="Taban Niroo product history, 1998 to 2022"
          className="relative"
        >
          <span
            aria-hidden
            className="absolute left-[4px] top-2 bottom-2 w-px bg-border"
          />
          <div className="space-y-10">
            {MILESTONES.map((m) => (
              <li key={m.year} className="relative pl-8">
                <span
                  aria-hidden
                  className="absolute left-0 top-[7px] block h-[9px] w-[9px] rounded-full bg-foreground ring-4 ring-background"
                />
                <p className="text-sm font-medium tracking-tight text-foreground">
                  {m.year}
                </p>
                <p className="mt-1 text-base font-medium text-foreground/90">
                  {m.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {m.description}
                </p>
              </li>
            ))}
          </div>
        </ol>
      </div>

      {/* Screen-reader-only milestone list so the desktop illustration
          still ships full, indexable content. */}
      <ol className="sr-only hidden md:block">
        {MILESTONES.map((m) => (
          <li key={`sr-${m.year}`}>
            <span>{m.year}</span>
            <span> — </span>
            <span>{m.title}</span>
            <span>. {m.description}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
