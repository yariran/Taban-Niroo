"use client";

import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";
import { RevealBlock } from "@/components/ui/reveal-text";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsImage, cmsText } from "@/lib/cms-resolve";

export function TestimonialsSection({ cms }: { cms?: ContentBlock } = {}) {
  const quote = cmsText(
    cms,
    "body",
    "At Taban Niroo we will continue to supply products our clients can use without any concerns — and keep improving the quality of our products and craftsmanship, as well as production efficiency, to increase our credibility.",
  );
  const image =
    cmsImage(cms, SITE_IMAGES.testimonials) ?? SITE_IMAGES.testimonials;

  return (
    <section id="testimonials" className="bg-background">
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
        <RevealBlock
          durationMs={900}
          distance={24}
          delayMs={60}
          className="mx-auto max-w-5xl"
        >
          <p className="relative pl-5 text-2xl leading-relaxed text-brand-navy before:absolute before:left-0 before:top-[0.35em] before:h-[1.15em] before:w-0.5 before:rounded-full before:bg-gradient-to-b before:from-brand-burgundy before:to-brand-navy before:content-[''] md:pl-6 md:text-3xl lg:text-[2.5rem] lg:leading-snug dark:text-brand-cream dark:before:from-brand-burgundy/80 dark:before:to-brand-orange/80">
            {quote}
          </p>
        </RevealBlock>
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {image.startsWith("http") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt="Taban Niroo manufacturing, Shiraz Special Economic Zone"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={image}
            alt="Taban Niroo manufacturing, Shiraz Special Economic Zone"
            fill
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
    </section>
  );
}
