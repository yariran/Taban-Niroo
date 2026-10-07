"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE_IMAGES } from "@/lib/site-images";
import { RevealBlock } from "@/components/ui/reveal-text";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { Beat } from "@/components/ui/beat";
import { BEAT, EVIDENCE } from "@/lib/motion-roles";
import type { ContentBlock } from "@/lib/cms-content-types";
import { cmsText } from "@/lib/cms-resolve";

type Feature = {
  title: string;
  description: string;
  image: string;
  /** Native pixel size — box aspect follows the photo. */
  width: number;
  height: number;
  /** Spans two columns — one per row band, never two adjacent. */
  wide?: boolean;
};

/**
 * Catalogue order. Each card’s media frame uses the photo’s own
 * width/height so the product is never cropped or letterboxed into a
 * mismatched slot.
 *
 * Two wide cards open and close the grid — 2+1 / 1+1+1 / 2+1 fills
 * three rows exactly.
 */
const features: readonly Feature[] = [
  {
    title: "Long Rod Insulators",
    description: "Distribution & Transmission",
    image: SITE_IMAGES.featured.longRod,
    width: 1024,
    height: 895,
    wide: true,
  },
  {
    title: "Post Insulators",
    description: "Line Post, Station Post, Railway",
    image: SITE_IMAGES.featured.post,
    width: 1024,
    height: 768,
  },
  {
    title: "Hybrid Post Insulators",
    description: "Silicone & porcelain",
    image: SITE_IMAGES.featured.hybrid,
    width: 1024,
    height: 768,
  },
  {
    title: "Transformer Bushings",
    description: "Polymer housed",
    image: SITE_IMAGES.featured.transformerBushings,
    width: 1024,
    height: 853,
  },
  {
    title: "Creepage Extenders & Covers",
    description: "Patented product",
    image: SITE_IMAGES.featured.creepageExtenders,
    width: 1024,
    height: 1024,
  },
];

export function FeaturedProductsSection({ cms }: { cms?: ContentBlock } = {}) {
  const eyebrow = cmsText(cms, "eyebrow", "Standards");
  const title = cmsText(cms, "title", "IEC-tested. | Accredited laboratories.");
  const titleForReveal = title.includes("|")
    ? title
    : title.replace(/\.\s+/, ". | ");
  const body = cmsText(cms, "body", "");

  return (
    <section
      id="featured-products"
      className="border-y border-brand-navy/10 bg-brand-navy-soft dark:border-white/[0.06] dark:bg-brand-navy-soft"
      aria-labelledby="featured-products-heading"
    >
      <Beat className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        {/* The claim leans toward the reader — the only foreground
            parallax in Act II. Wrapper carries no other transform. */}
        <div data-parallax="1.06">
          <RevealBlock
            delayMs={BEAT.first}
            stagger={0}
            distance={EVIDENCE.distance}
            durationMs={EVIDENCE.duration}
          >
            <p className="type-hig-label mb-[var(--hig-4)] text-brand-burgundy md:mb-[var(--hig-6)]">
              {eyebrow}
            </p>
          </RevealBlock>
          {/*
            The page's ONE character-level blur reveal. It is the signature
            device precisely because it appears once — using it on every
            headline is what turns a signature into a tic.
          */}
          {/*
            `|` is the CMS author's line-break marker. It is converted to a
            newline and rendered with `whitespace-pre-line` rather than
            stripped, so the deliberate break after the first sentence
            survives the move from RevealText's line splitter to this one.
          */}
          <BlurReveal
            as="h2"
            splitBy="char"
            delayMs={BEAT.headline}
            /* Sentence case, not uppercase: Persian has no case, so
               `uppercase` only ever affected the Latin product names here
               while widening the line for everyone. */
            className="type-hig-title text-brand-heading block whitespace-pre-line"
          >
            {titleForReveal.replace(/\s*\|\s*/g, "\n")}
          </BlurReveal>
          <span id="featured-products-heading" className="sr-only">
            {title.replace(/\s*\|\s*/g, " ")}
          </span>
          {body ? (
            <p className="type-hig-body mx-auto mt-[var(--hig-6)] max-w-2xl text-muted-foreground">
              {body}
            </p>
          ) : null}
        </div>
      </Beat>

      <Beat>
      <RevealBlock
        className="grid grid-cols-1 items-start gap-4 px-6 pb-24 sm:grid-cols-2 md:gap-5 md:px-12 lg:grid-cols-3 lg:px-20 lg:pb-32"
        delayMs={BEAT.first}
        stagger={EVIDENCE.stagger}
        distance={EVIDENCE.distance}
        durationMs={EVIDENCE.duration}
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className={cn(
              /* Card height follows the photo — grid uses items-start so
                 a taller neighbour never stretches a shorter product plate. */
              "group interactive-lift flex flex-col overflow-hidden rounded-[var(--hig-radius-card)] border border-brand-navy/10 bg-white shadow-card-rest transition-shadow duration-300 hover:shadow-card-hover dark:border-white/[0.08] dark:bg-card/60",
              feature.wide && "sm:col-span-2 lg:col-span-2",
            )}
          >
            <div className="product-plate relative w-full overflow-hidden">
              <Image
                src={feature.image || "/placeholder.svg"}
                alt={feature.title}
                width={feature.width}
                height={feature.height}
                className="h-auto w-full"
                sizes={
                  feature.wide
                    ? "(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 100vw"
                    : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                }
                quality={92}
              />
            </div>

            <div className="border-t border-border/30 px-[var(--hig-4)] py-[var(--hig-4)] dark:border-white/[0.06] md:px-[var(--hig-5)] md:py-[var(--hig-5)]">
              <p className="type-hig-label mb-[var(--hig-2)] text-brand-burgundy">
                {feature.description}
              </p>
              <h3
                className={cn(
                  "type-hig-title text-brand-navy",
                  feature.wide
                    ? "text-[1.375rem] md:text-[1.5rem]"
                    : "text-[1.1875rem] md:text-[1.375rem]",
                )}
              >
                {feature.title}
              </h3>
            </div>
          </div>
        ))}

        {/*
          Closing tile — fills the last cell beside Creepage on lg
          (2+1 / 1+1+1 / 1+1).
        */}
        <Link
          href="/products"
          className="group interactive-lift flex flex-col justify-between self-start rounded-[var(--hig-radius-card)] border border-brand-navy/10 bg-white p-6 shadow-card-rest transition-shadow duration-300 hover:shadow-card-hover dark:border-white/[0.08] dark:bg-card/60 sm:col-span-2 md:p-7 lg:col-span-1"
        >
          <p className="type-hig-label text-brand-burgundy">Full catalogue</p>
          <span className="type-hig-title mt-[var(--hig-10)] inline-flex items-baseline gap-[var(--hig-2)] text-[1.375rem] text-brand-navy md:mt-[var(--hig-12)] md:text-[1.5rem]">
            All product categories
            <span
              aria-hidden
              className="text-brand-burgundy transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            >
              →
            </span>
          </span>
        </Link>
      </RevealBlock>
      </Beat>
    </section>
  );
}
