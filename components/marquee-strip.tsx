"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "@/components/locale-link";

type MarqueeStripProps = {
  items: readonly string[];
  /** Seconds per full loop. Larger = slower, more cinematic. */
  duration?: number;
  /** Reverse direction (left-to-right in LTR; mirrored automatically in RTL). */
  reverse?: boolean;
  className?: string;
  /** Eyebrow label shown at the inline-start edge, e.g. "Voltage classes". */
  label?: string;
};

/**
 * Continuous spec ticker — pacing punctuation between sections.
 *
 * Scroll direction flips under `dir=rtl` so the band still reads
 * "outgoing" relative to the reading direction.
 */
export function MarqueeStrip({
  items,
  duration = 42,
  reverse = false,
  className,
  label,
}: MarqueeStripProps) {
  const locale = useLocale();
  const isRtl = locale === "fa";
  /** RTL mirrors the default direction; an explicit `reverse` flips again. */
  const playReverse = isRtl ? !reverse : reverse;
  const sequence = [...items, ...items];
  const fadeStart = isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r";
  const fadeEnd = isRtl ? "bg-gradient-to-r" : "bg-gradient-to-l";

  return (
    <div
      className={cn(
        "relative flex items-center overflow-hidden border-y border-border/60 bg-background py-6 md:py-8",
        "dark:border-white/[0.06]",
        className,
      )}
      role="presentation"
    >
      {label && (
        <div
          className={cn(
            "absolute start-0 top-1/2 z-[2] hidden h-full -translate-y-1/2 items-center ps-6 pe-12 md:flex md:ps-12 lg:ps-20",
            fadeStart,
            "from-background via-background to-transparent",
          )}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {label}
          </span>
        </div>
      )}
      <div
        className="flex min-w-max gap-12 will-change-transform motion-reduce:!animate-none md:gap-16"
        style={{
          animation: `marquee-strip ${duration}s linear infinite${
            playReverse ? " reverse" : ""
          }`,
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
        className={cn(
          "pointer-events-none absolute inset-y-0 start-0 z-[3] w-24 md:w-32 lg:w-40",
          fadeStart,
          "from-background via-background to-transparent",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 end-0 z-[3] w-24 md:w-32 lg:w-40",
          fadeEnd,
          "from-background via-background to-transparent",
        )}
      />
    </div>
  );
}
