"use client";

import { cn } from "@/lib/utils";
import { FadeImage } from "@/components/fade-image";
import { SITE_IMAGES } from "@/lib/site-images";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import { ImageReveal } from "@/components/ui/image-reveal";
import type { ContentBlock } from "@/lib/cms-content-types";
import { cmsText } from "@/lib/cms-resolve";

type Feature = {
  title: string;
  description: string;
  image: string;
  feature?: boolean;
  showFullImage?: boolean;
  imageAspect?: string;
  imagePadding?: string;
  imageBackground?: string;
};

const features: readonly Feature[] = [
  {
    title: "Long Rod Insulators",
    description: "Distribution & Transmission",
    image: SITE_IMAGES.featured.longRod,
    feature: true,
  },
  {
    title: "Post Insulators",
    description: "Line Post, Station Post, Railway",
    image: SITE_IMAGES.featured.post,
    showFullImage: true,
    imageAspect: "aspect-[1024/779]",
    imagePadding: "p-0",
    imageBackground: "bg-white dark:bg-white",
  },
  {
    title: "Hybrid Post Insulators",
    description: "Silicone & porcelain",
    image: SITE_IMAGES.featured.hybrid,
    showFullImage: true,
    imageAspect: "aspect-[1024/768]",
    imagePadding: "p-2 md:p-3",
    imageBackground: "bg-white dark:bg-white",
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
    showFullImage: true,
    imageAspect: "aspect-[1024/909]",
    imagePadding: "p-0",
    imageBackground: "bg-[#ececee]",
  },
  {
    title: "Creepage Extenders & Covers",
    description: "Patented product",
    image: SITE_IMAGES.featured.creepageExtenders,
    showFullImage: true,
    imageAspect: "aspect-[4/5]",
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
      <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        <RevealBlock delayMs={80} stagger={0} distance={16}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-burgundy md:mb-6">
            {eyebrow}
          </p>
        </RevealBlock>
        <RevealText
          as="h2"
          splitLines
          delayMs={140}
          stepMs={110}
          className="font-hero-slogan text-brand-heading text-balance text-4xl font-semibold uppercase tracking-tight md:text-5xl lg:text-6xl"
        >
          {titleForReveal}
        </RevealText>
        <span id="featured-products-heading" className="sr-only">
          {title.replace(/\s*\|\s*/g, " ")}
        </span>
        {body ? (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {body}
          </p>
        ) : null}
      </div>

      <RevealBlock
        className="grid grid-cols-1 gap-4 px-6 pb-24 sm:grid-cols-2 md:gap-5 md:px-12 lg:grid-cols-3 lg:px-20 lg:pb-32"
        delayMs={180}
        stagger={85}
        distance={28}
        durationMs={900}
      >
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={cn(
              "group interactive-lift overflow-hidden rounded-2xl border border-brand-navy/10 bg-white shadow-card-rest transition-shadow duration-300 hover:shadow-card-hover dark:border-white/[0.08] dark:bg-card/60",
              feature.feature && "sm:col-span-2 lg:col-span-2",
            )}
          >
            <div
              className={cn(
                "relative overflow-hidden",
                feature.imageAspect ??
                  (feature.feature ? "aspect-[16/9]" : "aspect-[4/3]"),
                feature.showFullImage &&
                  (feature.imageBackground ?? "bg-white dark:bg-zinc-950/40"),
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
                    feature.showFullImage
                      ? cn(
                          "object-contain",
                          feature.imagePadding ?? "p-3 md:p-4",
                        )
                      : "object-cover",
                  )}
                  sizes={
                    feature.feature
                      ? "(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 100vw"
                      : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  }
                />
              </ImageReveal>
            </div>

            <div className="border-t border-border/30 px-5 py-6 dark:border-white/[0.06] md:px-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
                {feature.description}
              </p>
              <h3
                className={cn(
                  "font-medium tracking-tight text-brand-navy",
                  feature.feature
                    ? "text-2xl md:text-3xl"
                    : "text-xl md:text-2xl",
                )}
              >
                {feature.title}
              </h3>
            </div>
          </div>
        ))}
      </RevealBlock>
    </section>
  );
}
