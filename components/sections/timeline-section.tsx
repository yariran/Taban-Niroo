"use client";

import Image from "next/image";
import { ScrollPan } from "@/components/ui/scroll-pan";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import { cn } from "@/lib/utils";

const TIMELINE_IMAGE = "/images/home/history-timeline-v2.jpg";
const TIMELINE_IMAGE_DARK = "/images/home/history-timeline-v2-dark.jpg";

/**
 * Company history timeline.
 *
 * Desktop: full-bleed illustrated timeline (1024×345).
 * Mobile: same asset inside a horizontal ScrollPan so milestones stay
 * legible without shrinking the artwork.
 */
const MILESTONES = [
  {
    year: "1997",
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
    description: "Silicone outdoor terminations and joints complete the product line.",
  },
] as const;

function TimelineIllustration({
  className,
  sizes,
  priority = false,
}: {
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  const imageClass = className ?? "object-contain";

  return (
    <>
      <Image
        src={TIMELINE_IMAGE}
        alt="Taban Niroo history timeline from 1998 to 2022, showing milestones for DPL insulators, MV and HV insulators, hybrid insulators, cable accessories, post insulators, transformer bushings and hybrid post insulators."
        fill
        sizes={sizes}
        unoptimized
        priority={priority}
        className={cn(imageClass, "dark:hidden")}
      />
      <Image
        src={TIMELINE_IMAGE_DARK}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        unoptimized
        className={cn(imageClass, "hidden dark:block")}
      />
    </>
  );
}

export function TimelineSection() {
  return (
    <section
      id="timeline"
      className="bg-background py-20 md:py-28 lg:py-32"
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
              Every milestone below added a new product family to Taban
              Niroo — from medium-voltage insulators in 1997 to a complete
              cable-accessories range in 2022.
            </p>
          </RevealBlock>
        </div>
      </div>

      {/* Desktop illustration — full viewport width. */}
      <figure
        className="mt-14 hidden w-full bg-white px-4 md:mt-20 md:block md:px-8 lg:px-12 dark:bg-black"
        aria-describedby="timeline-heading"
      >
        <div className="relative mx-auto aspect-[1024/345] w-full max-w-[1400px]">
          <TimelineIllustration sizes="(min-width: 1024px) 1400px, 100vw" />
        </div>
      </figure>

      {/* Mobile — same illustration, horizontal pan for legibility. */}
      <figure
        className="mt-12 bg-white md:hidden dark:bg-black"
        aria-describedby="timeline-heading"
      >
        <ScrollPan
          className="px-0"
          innerClassName="px-6 pb-2"
          ariaLabel="Company history timeline"
          edgeFades
          fadeFrom="from-white dark:from-black"
          passVerticalScroll
        >
          <div className="relative aspect-[1024/345] w-[1024px] max-w-none shrink-0">
            <TimelineIllustration sizes="1024px" />
          </div>
        </ScrollPan>
        <figcaption className="mt-4 flex items-center justify-center gap-2 px-6 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span
            aria-hidden
            className="inline-block h-px w-6 bg-current opacity-60"
          />
          <span>Scroll to explore timeline</span>
          <span
            aria-hidden
            className="inline-block h-px w-6 bg-current opacity-60"
          />
        </figcaption>
      </figure>

      {/* Screen-reader milestone list — indexable content alongside the art. */}
      <ol className="sr-only">
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
