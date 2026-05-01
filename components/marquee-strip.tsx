"use client";

import { cn } from "@/lib/utils";

type MarqueeStripProps = {
  items: readonly string[];
  /** Seconds per full loop. Larger = slower, more cinematic. */
  duration?: number;
  /** Reverse direction (right-to-left by default). */
  reverse?: boolean;
  className?: string;
  /** Eyebrow label shown to the left, e.g. "Voltage classes". */
  label?: string;
};

/**
 * Continuous spec ticker — pacing punctuation between sections.
 *
 * A horizontal band that loops a fixed list of tokens (voltage classes,
 * standards, certifications). Two copies of the list are rendered so
 * the translate animation can wrap seamlessly at -50%.
 *
 * Visual language:
 *  - Hairline border top + bottom (matches blueprint divider).
 *  - `font-hero-slogan` uppercase, weight 700, slightly translucent.
 *  - No new colour tokens — uses `foreground/60` and reads correctly in
 *    both light and dark mode.
 *  - Pauses on hover so a curious reader can stop and read a token.
 *  - Honours `prefers-reduced-motion`: animation freezes statically.
 *
 * Use sparingly — drop one between two heavy sections to break the
 * "section, section, section" cadence.
 */
export function MarqueeStrip({
  items,
  duration = 42,
  reverse = false,
  className,
  label,
}: MarqueeStripProps) {
  const sequence = [...items, ...items];

  return (
    <div
      className={cn(
        "relative flex items-center overflow-hidden border-y border-border/60 bg-background py-6 md:py-8",
        "dark:border-white/[0.06]",
        className
      )}
      role="presentation"
    >
      {label && (
        <div className="absolute left-0 top-1/2 z-[2] hidden h-full -translate-y-1/2 items-center bg-gradient-to-r from-background via-background to-transparent pl-6 pr-12 md:flex md:pl-12 lg:pl-20">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {label}
          </span>
        </div>
      )}
      <div
        className="flex min-w-max gap-12 will-change-transform motion-reduce:!animate-none md:gap-16"
        style={{
          animation: `marquee-strip ${duration}s linear infinite ${reverse ? "reverse" : ""}`,
        }}
      >
        {sequence.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-hero-slogan flex shrink-0 items-center gap-12 text-2xl font-bold uppercase tracking-[-0.005em] text-foreground/55 md:gap-16 md:text-4xl lg:text-5xl"
          >
            <span>{item}</span>
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full bg-foreground/35 dark:bg-white/35"
            />
          </span>
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-24 bg-gradient-to-r from-background via-background to-transparent md:w-32 lg:w-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-[3] w-24 bg-gradient-to-l from-background via-background to-transparent md:w-32 lg:w-40"
      />
    </div>
  );
}
