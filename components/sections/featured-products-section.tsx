"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { FadeImage } from "@/components/fade-image";
import { SITE_IMAGES } from "@/lib/site-images";
import { RevealBlock } from "@/components/ui/reveal-text";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { ImageReveal } from "@/components/ui/image-reveal";
import { Beat } from "@/components/ui/beat";
import { BEAT, EVIDENCE } from "@/lib/motion-roles";
import type { ContentBlock } from "@/lib/cms-content-types";
import { cmsText } from "@/lib/cms-resolve";

type Feature = {
  title: string;
  description: string;
  image: string;
  /** Spans two columns — one per row band, never two adjacent. */
  wide?: boolean;
  /** Fill the frame instead of standing the product inside it. */
  cover?: boolean;
};

/**
 * Catalogue order, and the grid geometry that follows from it.
 *
 * This list used to carry a per-item `imageAspect`, `imagePadding` and
 * `imageBackground` — six different ratios (16/9, 1024/779, 1024/768, 4/3,
 * 1024/909, 4/5) and three different whites across six cards. Grid rows
 * size to their tallest cell, so six ratios meant no two titles in a row
 * ever shared a baseline, and the mismatched whites read as six unrelated
 * plates. Both are gone: the aspect is now a property of the SLOT
 * (wide vs. standard), not of the photograph, and the surface is the
 * shared `.product-plate`.
 *
 * Two wide cards open and close the grid, which also fixes the ragged
 * tail — 2+1 / 1+1+1 / 2+1 fills three rows exactly, where the old
 * 2+1 / 1+1+1 / 1 left a lone card hanging in row three.
 */
const features: readonly Feature[] = [
  {
    title: "Long Rod Insulators",
    description: "Distribution & Transmission",
    image: SITE_IMAGES.featured.longRod,
    wide: true,
    cover: true,
  },
  {
    title: "Post Insulators",
    description: "Line Post, Station Post, Railway",
    image: SITE_IMAGES.featured.post,
  },
  {
    title: "Hybrid Post Insulators",
    description: "Silicone & porcelain",
    image: SITE_IMAGES.featured.hybrid,
  },
  {
    title: "Hollow Core Bushing",
    description: "Polymer housed",
    image: SITE_IMAGES.featured.hollowCoreBushing,
  },
  {
    title: "Cable Accessories",
    description: "Terminations & Joints",
    image: SITE_IMAGES.featured.cableAccessories,
  },
  {
    title: "Creepage Extenders & Covers",
    description: "Patented product",
    image: SITE_IMAGES.featured.creepageExtenders,
    wide: true,
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
        className="grid grid-cols-1 gap-4 px-6 pb-24 sm:grid-cols-2 md:gap-5 md:px-12 lg:grid-cols-3 lg:px-20 lg:pb-32"
        delayMs={BEAT.first}
        stagger={EVIDENCE.stagger}
        distance={EVIDENCE.distance}
        durationMs={EVIDENCE.duration}
      >
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={cn(
              /* `flex flex-col` + `mt-auto` on the caption is what makes a
                 row's titles share a baseline: grid stretches every card to
                 the tallest in its row, and without this the caption floats
                 wherever its own image happens to end. */
              "group interactive-lift flex flex-col overflow-hidden rounded-[var(--hig-radius-card)] border border-brand-navy/10 bg-white shadow-card-rest transition-shadow duration-300 hover:shadow-card-hover dark:border-white/[0.08] dark:bg-card/60",
              feature.wide && "sm:col-span-2 lg:col-span-2",
            )}
          >
            <div
              className={cn(
                /* `grow`, not `flex-1`: flex-basis stays `auto` so the
                   aspect ratio still sets the plate's natural height, and
                   growth only kicks in when the grid has stretched this
                   card to match a taller neighbour. Without it, a standard
                   card sharing a row with a wide one pushed its caption to
                   the bottom and left a dark void where the photo stopped. */
                "relative grow overflow-hidden",
                feature.wide ? "aspect-[16/9]" : "aspect-[4/3]",
                /* A cover image fills the frame, so there is no sweep left
                   to match — the plate would only multiply the photograph
                   against a surface nobody can see. */
                !feature.cover && "product-plate",
              )}
            >
              <ImageReveal
                className="absolute inset-0"
                delayMs={120 + index * 40}
                durationMs={1050}
              >
                <FadeImage
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  fill
                  className={cn(
                    feature.cover
                      ? "object-cover"
                      : /* One padding for every standing product, so the
                           silhouettes share a scale across the grid. */
                        "object-contain p-5 md:p-7",
                  )}
                  sizes={
                    feature.wide
                      ? "(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 100vw"
                      : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  }
                />
              </ImageReveal>
            </div>

            {/* 16px horizontal / 16px vertical — the guidelines' card
                internal padding, replacing the 20-24 / 24 pair. */}
            <div className="mt-auto border-t border-border/30 px-[var(--hig-4)] py-[var(--hig-4)] dark:border-white/[0.06] md:px-[var(--hig-5)] md:py-[var(--hig-5)]">
              <p className="type-hig-label mb-[var(--hig-2)] text-brand-burgundy">
                {feature.description}
              </p>
              <h3
                className={cn(
                  "type-hig-title text-brand-navy",
                  /* The card title is a card title, not a section heading —
                     the wide tile used to jump to 3xl and made two cards in
                     the same row disagree about their own hierarchy. */
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
          Closing tile — the ninth cell.

          Two wide cards leave exactly one slot open at the end of row three.
          Filling it with the catalogue link turns what was a ragged tail into
          the grid's resolution, and gives the section the exit it never had:
          a reader who has just looked at six product families previously had
          nowhere to go from here.
        */}
        <Link
          href="/products"
          /* Spans the full width at `sm`, where the two-column arrangement
             would otherwise leave it as a half-empty box beside nothing.
             At `lg` it is the ninth cell and takes a single column. */
          className="group interactive-lift flex flex-col justify-between rounded-[var(--hig-radius-card)] border border-brand-navy/10 bg-white p-6 shadow-card-rest transition-shadow duration-300 hover:shadow-card-hover dark:border-white/[0.08] dark:bg-card/60 sm:col-span-2 md:p-7 lg:col-span-1"
        >
          <p className="type-hig-label text-brand-burgundy">Full catalogue</p>
          <span className="type-hig-title mt-[var(--hig-10)] inline-flex items-baseline gap-[var(--hig-2)] text-[1.375rem] text-brand-navy md:mt-[var(--hig-12)] md:text-[1.5rem]">
            All product families
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
