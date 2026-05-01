"use client";

import { FadeImage } from "@/components/fade-image";
import { SITE_IMAGES } from "@/lib/site-images";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";

const features = [
  {
    title: "Long Rod Insulators",
    description: "Distribution & Transmission",
    image: SITE_IMAGES.featured.longRod,
  },
  {
    title: "Post Insulators",
    description: "Line Post, Station Post, Railway",
    image: SITE_IMAGES.featured.post,
  },
  {
    title: "Hybrid Insulators",
    description: "Silicone Ceramic",
    image: SITE_IMAGES.featured.hybrid,
  },
  {
    title: "Transformer Bushings",
    description: "Polymer & Hybrid",
    image: SITE_IMAGES.featured.transformerBushings,
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
        <RevealText
          as="h2"
          splitLines
          stepMs={70}
          durationMs={1000}
          className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl"
        >
          {"IEC-tested. | Accredited laboratories."}
        </RevealText>
        <span id="featured-products-heading" className="sr-only">
          IEC-tested. Accredited laboratories.
        </span>
        <RevealBlock delayMs={260} durationMs={800} distance={18}>
          <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
            Standards
          </p>
        </RevealBlock>
      </div>

      {/* Features Grid */}
      <RevealBlock
        stagger={110}
        delayMs={120}
        durationMs={900}
        distance={36}
        className="grid grid-cols-1 gap-4 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20"
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group interactive-lift rounded-2xl border border-border/40 bg-card/90 shadow-elevate dark:border-white/[0.08] dark:bg-card/50"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
              <FadeImage
                src={feature.image || "/placeholder.svg"}
                alt={feature.title}
                fill
                className="object-cover group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="border-t border-border/30 px-1 py-6 dark:border-white/[0.06]">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                {feature.description}
              </p>
              <h3 className="text-foreground text-xl font-semibold">
                {feature.title}
              </h3>
            </div>
          </div>
        ))}
      </RevealBlock>

      {/* CTA Link */}
      <div className="flex justify-center px-6 pb-28 md:px-12 lg:px-20">
        
      </div>
    </section>
  );
}
