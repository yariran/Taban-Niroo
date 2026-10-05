"use client";

import Image from "next/image";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import { useLocale } from "@/components/locale-link";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsImage, cmsText } from "@/lib/cms-resolve";
import { pageHeadingScale } from "@/lib/i18n/type-scale";
import { cn } from "@/lib/utils";

const TIMELINE_LIGHT = "/images/home/history-timeline-v5.jpg";
const TIMELINE_DARK = "/images/home/history-timeline-v5-dark.jpg";

/**
 * Company history timeline.
 *
 * Full-width illustrated plate (1024×576) that scales to the viewport —
 * no horizontal scroll. Light and dark modes each get a dedicated asset.
 */
const MILESTONES = [
  {
    year: "1998",
    title: "Journey begins",
    description:
      "Our journey started as one of the industry's manufacturing leaders.",
  },
  {
    year: "2002",
    title: "DPL Insulator",
    description: "DPL Insulator brand established.",
  },
  {
    year: "2003",
    title: "MV Insulators",
    description: "Design and production of medium-voltage insulators.",
  },
  {
    year: "2008",
    title: "Hybrid Insulators",
    description: "Design and production of hybrid insulators.",
  },
  {
    year: "2009",
    title: "HV Insulators",
    description: "Design and production of high-voltage insulators.",
  },
  // Cable Accessories (2017) — restored with HIDDEN_FAMILIES when the family is public again.
  {
    year: "2019",
    title: "Post Insulators",
    description: "Design and production of post insulators.",
  },
  {
    year: "2020",
    title: "MV Transformer Bushings",
    description:
      "Design and production of medium-voltage transformer bushings.",
  },
  {
    year: "2022",
    title: "Hybrid Post Insulators",
    description: "Design and production of hybrid post insulators.",
  },
] as const;

const TIMELINE_ALT =
  "Taban Niroo history timeline from 1998 to 2022, showing milestones for DPL insulators, MV and HV insulators, hybrid insulators, cable accessories, post insulators, transformer bushings and hybrid post insulators.";

function TimelineIllustration({
  sizes,
  src,
  priority = false,
}: {
  sizes: string;
  src: string;
  priority?: boolean;
}) {
  if (src.startsWith("http")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={TIMELINE_ALT}
        className="absolute inset-0 h-full w-full object-contain"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={TIMELINE_ALT}
      fill
      sizes={sizes}
      priority={priority}
      decoding="async"
      quality={92}
      className="object-contain"
    />
  );
}

function TimelinePlate({
  lightSrc,
  darkSrc,
  sizes,
  priority = false,
  className,
}: {
  lightSrc: string;
  darkSrc: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative aspect-[1024/576] w-full", className)}>
      <div className="absolute inset-0 dark:hidden">
        <TimelineIllustration src={lightSrc} sizes={sizes} priority={priority} />
      </div>
      <div className="absolute inset-0 hidden dark:block">
        <TimelineIllustration src={darkSrc} sizes={sizes} priority={priority} />
      </div>
    </div>
  );
}

export function TimelineSection({ cms }: { cms?: ContentBlock } = {}) {
  const locale = useLocale();
  const eyebrow = cmsText(cms, "eyebrow", "History timeline");
  const title = cmsText(
    cms,
    "title",
    "Twenty-five years of | incremental engineering.",
  );
  const body = cmsText(
    cms,
    "body",
    "From medium-voltage beginnings in Shiraz to a full high-voltage catalogue shipped across three continents.",
  );
  const lightSrc = cmsImage(cms, TIMELINE_LIGHT) ?? TIMELINE_LIGHT;
  const darkSrc = TIMELINE_DARK;
  const milestones =
    cms?.items?.length && cms.items.some((i) => i.label.trim())
      ? cms.items.map((i) => ({
          year: i.label,
          title: i.value || i.label,
          description: i.body || "",
        }))
      : MILESTONES;

  return (
    <section
      id="timeline"
      className="bg-brand-navy-soft py-20 md:py-28 lg:py-32 dark:bg-brand-navy-soft"
      aria-labelledby="timeline-heading"
    >
      {/* Header — stays inside the normal editorial column. */}
      <div className="px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <RevealBlock delayMs={40} durationMs={650} distance={12}>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
              {eyebrow}
            </p>
          </RevealBlock>
          <span id="timeline-heading" className="sr-only">
            {title.replace(/\s*\|\s*/g, " ")}
          </span>
          <RevealText
            as="h2"
            splitLines
            delayMs={120}
            stepMs={65}
            durationMs={1050}
            className={cn(
              "font-hero-slogan text-brand-heading mt-4 max-w-3xl font-semibold uppercase tracking-tight",
              pageHeadingScale(locale),
            )}
          >
            {title}
          </RevealText>
          <RevealBlock
            delayMs={380}
            durationMs={950}
            distance={22}
            className="mt-6 max-w-2xl"
          >
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {body}
            </p>
          </RevealBlock>
        </div>
      </div>

      {/* Timeline illustration — full width, no horizontal scroll. */}
      <figure
        className="mt-12 w-full bg-[#f2f2f2] px-4 md:mt-14 md:px-8 lg:mt-20 lg:px-12 dark:bg-[#0b111e]"
        aria-describedby="timeline-heading"
      >
        <TimelinePlate
          lightSrc={lightSrc}
          darkSrc={darkSrc}
          sizes="(min-width: 1400px) 1400px, 100vw"
          priority
          className="mx-auto max-w-[1400px]"
        />
      </figure>

      {/* Screen-reader milestone list — indexable content alongside the art. */}
      <ol className="sr-only">
        {milestones.map((m) => (
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
