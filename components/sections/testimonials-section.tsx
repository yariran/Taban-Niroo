"use client";

import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";
import { RevealBlock } from "@/components/ui/reveal-text";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-background">
      {/* Large Text Statement */}
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
        <RevealBlock
          durationMs={1100}
          distance={36}
          delayMs={80}
          className="mx-auto max-w-5xl"
        >
          <p className="relative pl-5 text-2xl leading-relaxed text-foreground before:absolute before:left-0 before:top-[0.35em] before:h-[1.15em] before:w-0.5 before:rounded-full before:bg-sky-500/55 before:content-[''] md:pl-6 md:text-3xl lg:text-[2.5rem] lg:leading-snug dark:before:bg-sky-400/45">
            At Taban Niroo we will continue to supply products our clients can use without any concerns — and keep improving the quality of our products and craftsmanship, as well as production efficiency, to increase our credibility.
          </p>
        </RevealBlock>
      </div>

      {/* About Image */}
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={SITE_IMAGES.testimonials}
          alt="Taban Niroo manufacturing, Shiraz Special Economic Zone"
          fill
          className="object-cover"
        />
        {/* Fade gradient overlay - white at bottom fading to transparent at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
    </section>
  );
}
