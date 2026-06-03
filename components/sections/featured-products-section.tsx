"use client";

import { cn } from "@/lib/utils";
import { FadeImage } from "@/components/fade-image";
import { SITE_IMAGES } from "@/lib/site-images";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";

type Feature = {
  title: string;
  description: string;
  image: string;
  /** When true, the card spans two columns on `md+` for a subtle bento. */
  feature?: boolean;
  /** Show the full product without cropping (object-contain). */
  showFullImage?: boolean;
  /** Image area aspect ratio — defaults to 4/3 (16/9 when featured). */
  imageAspect?: string;
  /** Extra padding when showFullImage is true. */
  imagePadding?: string;
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
  },
  {
    title: "Hybrid Post Insulators",
    description: "Silicone & porcelain",
    image: SITE_IMAGES.featured.hybrid,
    showFullImage: true,
    imageAspect: "aspect-[6/5]",
    imagePadding: "p-4 md:p-5",
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
    showFullImage: true,
    imageAspect: "aspect-[4/5]",
  },
];

export function FeaturedProductsSection() {
  return (
    <section
      id="featured-products"
      className="border-y border-border/50 bg-muted/20 dark:border-white/[0.06] dark:bg-white/[0.02]"
      aria-labelledby="featured-products-heading"
    >
      {/* Section Title */}
      <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        <RevealBlock>
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-muted-foreground md:mb-6">
            Standards
          </p>
        </RevealBlock>
        <RevealText
          as="h2"
          splitLines
          className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl"
        >
          {"IEC-tested. | Accredited laboratories."}
        </RevealText>
        <span id="featured-products-heading" className="sr-only">
          IEC-tested. Accredited laboratories.
        </span>
      </div>

      {/* Features Grid — subtle bento: the first card spans two columns
          on md+ to give the flagship product visual priority without
          breaking the editorial grid. */}
      <RevealBlock
        className="grid grid-cols-1 gap-4 px-6 pb-24 md:grid-cols-3 md:gap-5 md:px-12 lg:px-20 lg:pb-32"
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className={cn(
              "group interactive-lift overflow-hidden rounded-2xl border border-border/40 bg-card/90 shadow-elevate dark:border-white/[0.08] dark:bg-card/50",
              feature.feature && "md:col-span-2 md:row-span-1"
            )}
          >
            {/* Image */}
            <div
              className={cn(
                "relative overflow-hidden",
                feature.imageAspect ??
                  (feature.feature ? "aspect-[16/9]" : "aspect-[4/3]"),
                feature.showFullImage && "bg-white dark:bg-zinc-950/40",
              )}
            >
              <FadeImage
                src={feature.image || "/placeholder.svg"}
                alt={feature.title}
                fill
                className={cn(
                  feature.showFullImage
                    ? cn("object-contain", feature.imagePadding ?? "p-3 md:p-4")
                    : "object-cover",
                )}
                sizes={
                  feature.feature
                    ? "(min-width: 768px) 66vw, 100vw"
                    : "(min-width: 768px) 33vw, 100vw"
                }
              />
            </div>

            {/* Content */}
            <div className="border-t border-border/30 px-5 py-6 dark:border-white/[0.06] md:px-6">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                {feature.description}
              </p>
              <h3
                className={cn(
                  "font-medium tracking-tight text-foreground",
                  feature.feature
                    ? "text-2xl md:text-3xl"
                    : "text-xl md:text-2xl"
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
