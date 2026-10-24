"use client";

import type { CSSProperties } from "react";
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
  width: number;
  height: number;
};

/**
 * Three composed bands — neighbours share one media height so the
 * plate pair reads as one unit, not two mismatched aspect ratios.
 *
 * 1. Line products — Long Rod (wide) + Post
 * 2. Station products — Hybrid + Transformer, equal weight
 * 3. Patented close — Creepage (wide) + catalogue CTA
 */
const longRod: Feature = {
  title: "Long Rod Insulators",
  description: "Distribution & Transmission",
  image: SITE_IMAGES.featured.longRod,
  width: 1024,
  height: 895,
};

const post: Feature = {
  title: "Post Insulators",
  description: "Line Post, Station Post, Railway",
  image: SITE_IMAGES.featured.post,
  width: 1024,
  height: 768,
};

const hybrid: Feature = {
  title: "Hybrid Post Insulators",
  description: "Silicone & porcelain",
  image: SITE_IMAGES.featured.hybrid,
  width: 1024,
  height: 768,
};

const bushings: Feature = {
  title: "Transformer Bushings",
  description: "Polymer housed",
  image: SITE_IMAGES.featured.transformerBushings,
  width: 1024,
  height: 853,
};

const creepage: Feature = {
  title: "Creepage Extenders & Covers",
  description: "Patented product",
  image: SITE_IMAGES.featured.creepageExtenders,
  width: 1024,
  height: 1024,
};

function ProductCard({
  feature,
  className,
  mediaClassName,
  wide,
  style,
  cover,
}: {
  feature: Feature;
  className?: string;
  /** Shared media frame for the band — keeps neighbours flush. */
  mediaClassName: string;
  wide?: boolean;
  /** Forwarded from RevealBlock stagger. */
  style?: CSSProperties;
  /** Fill the plate (landscape companions); default contains the product. */
  cover?: boolean;
}) {
  return (
    <div
      style={style}
      className={cn(
        "group interactive-lift flex h-full min-h-0 flex-col overflow-hidden rounded-[var(--hig-radius-card)] border border-brand-navy/10 bg-white shadow-card-rest transition-shadow duration-300 hover:shadow-card-hover dark:border-white/[0.08] dark:bg-card/60",
        className,
      )}
    >
      <div
        className={cn(
          "product-plate relative w-full min-h-[12rem] overflow-hidden",
          mediaClassName,
        )}
      >
        {/*
          Inset wrapper — never put padding on a Next `fill` <img>.
          Safari ignores/zeros the painted content when absolute fill
          images also carry padding.
        */}
        <div
          data-product-media
          className={
            cover
              ? "absolute inset-0"
              : "absolute inset-3 sm:inset-4 md:inset-5"
          }
        >
          <Image
            src={feature.image || "/placeholder.svg"}
            alt={feature.title}
            fill
            className={
              cover ? "object-cover object-center" : "object-contain object-center"
            }
            sizes={
              wide
                ? "(min-width: 768px) 66vw, 100vw"
                : "(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            }
            quality={92}
          />
        </div>
      </div>

      <div className="border-t border-border/30 px-[var(--hig-4)] py-[var(--hig-4)] dark:border-white/[0.06] md:px-[var(--hig-5)] md:py-[var(--hig-5)]">
        <p className="type-hig-label mb-[var(--hig-2)] text-brand-burgundy">
          {feature.description}
        </p>
        <h3
          className={cn(
            "type-hig-title text-brand-navy",
            wide
              ? "text-[1.375rem] md:text-[1.5rem]"
              : "text-[1.1875rem] md:text-[1.375rem]",
          )}
        >
          {feature.title}
        </h3>
      </div>
    </div>
  );
}

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
          <BlurReveal
            as="h2"
            splitBy="char"
            delayMs={BEAT.headline}
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
          className="flex flex-col gap-4 px-6 pb-24 md:gap-5 md:px-12 lg:px-20 lg:pb-32"
          delayMs={BEAT.first}
          stagger={EVIDENCE.stagger}
          distance={EVIDENCE.distance}
          durationMs={EVIDENCE.duration}
        >
          {/* Band 1 — line products: wide flagship + companion */}
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 md:gap-5">
            <ProductCard
              feature={longRod}
              wide
              className="md:col-span-2"
              mediaClassName="aspect-[16/10]"
            />
            <ProductCard
              feature={post}
              cover
              className="md:col-span-1"
              /* Keep a real aspect on Safari — `flex-1` + `aspect-auto`
                 collapses the absolute fill plate to 0 height in WebKit. */
              mediaClassName="aspect-[16/10]"
            />
          </div>

          {/* Band 2 — station products: equal pair */}
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:gap-5">
            <ProductCard
              feature={hybrid}
              mediaClassName="aspect-[4/3]"
            />
            <ProductCard
              feature={bushings}
              mediaClassName="aspect-[4/3]"
            />
          </div>

          {/* Band 3 — patented close + catalogue CTA */}
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 md:gap-5">
            <ProductCard
              feature={creepage}
              wide
              className="md:col-span-2"
              mediaClassName="aspect-[16/10]"
            />
            <Link
              href="/products"
              className="group interactive-lift flex h-full min-h-[14rem] flex-col justify-between rounded-[var(--hig-radius-card)] border border-brand-navy/10 bg-white p-6 shadow-card-rest transition-shadow duration-300 hover:shadow-card-hover dark:border-white/[0.08] dark:bg-card/60 md:col-span-1 md:min-h-0 md:p-8 lg:p-10"
            >
              <p className="type-hig-label text-brand-burgundy">Full catalogue</p>
              <span className="type-hig-title mt-[var(--hig-10)] inline-flex items-baseline gap-[var(--hig-2)] text-[1.5rem] text-brand-navy md:mt-auto md:text-[1.75rem] lg:text-[1.875rem]">
                All product categories
                <span
                  aria-hidden
                  className="text-brand-burgundy transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </div>
        </RevealBlock>
      </Beat>
    </section>
  );
}
