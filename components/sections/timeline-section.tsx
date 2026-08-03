"use client";

import Image from "next/image";
import { ScrollPan } from "@/components/ui/scroll-pan";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsImage, cmsText } from "@/lib/cms-resolve";

const TIMELINE_IMAGE = "/images/home/history-timeline-v4.jpg";

/**
 * Company history timeline.
 *
 * Desktop: full-bleed illustrated timeline (1024×345).
 * Mobile: same asset inside a horizontal ScrollPan so milestones stay
 * legible without shrinking the artwork.
 * Light and dark mode share the same illustrated asset.
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
  {
    year: "2017",
    title: "Cable Accessories",
    description: "Design and production of cable accessories.",
  },
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
        alt="Taban Niroo history timeline"
        className="absolute inset-0 h-full w-full object-contain"
      />
    );
  }
  return (
    <Image
      src={src}
      alt="Taban Niroo history timeline from 1998 to 2022, showing milestones for DPL insulators, MV and HV insulators, hybrid insulators, cable accessories, post insulators, transformer bushings and hybrid post insulators."
      fill
      sizes={sizes}
      priority={priority}
      decoding="async"
      quality={80}
      className="object-contain"
    />
  );
}

export function TimelineSection({ cms }: { cms?: ContentBlock } = {}) {
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
  const image = cmsImage(cms, TIMELINE_IMAGE) ?? TIMELINE_IMAGE;
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
            className="font-hero-slogan text-brand-heading mt-4 max-w-3xl text-3xl font-semibold uppercase tracking-tight md:text-4xl lg:text-5xl"
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

      {/* Wide desktop illustration — only when milestones stay legible. */}
      <figure
        className="mt-14 hidden w-full bg-white px-4 lg:mt-20 lg:block lg:px-12 dark:bg-white"
        aria-describedby="timeline-heading"
      >
        <div className="relative mx-auto aspect-[1024/345] w-full max-w-[1400px]">
          <TimelineIllustration src={image} sizes="(min-width: 1024px) 1400px, 100vw" />
        </div>
      </figure>

      {/* Tablet & mobile — same illustration, horizontal pan for legibility. */}
      <figure
        className="mt-12 bg-white lg:hidden dark:bg-white"
        aria-describedby="timeline-heading"
      >
        <ScrollPan
          className="px-0"
          innerClassName="px-6 pb-2"
          ariaLabel="Company history timeline"
          edgeFades
          fadeFrom="from-white"
          passVerticalScroll
        >
          <div className="relative aspect-[1024/345] w-[1024px] max-w-none shrink-0">
            <TimelineIllustration src={image} sizes="1024px" />
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
