"use client";

import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";

/**
 * A message from the CEO.
 *
 * This section used to carry its own IntersectionObserver-driven fade —
 * but it is wrapped in `HomeSectionSnap` on the homepage which already
 * orchestrates the entrance animation. The double wrapper made the
 * section read as permanently dim whenever the inner observer missed
 * on a fast scroll. The wrapper is authoritative; we just render.
 */
export function CEOSection() {
  return (
    <section id="ceo" className="bg-background">
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
        <RevealBlock delayMs={40} durationMs={650} distance={12}>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Leadership
          </p>
        </RevealBlock>
        <RevealText
          as="h2"
          delayMs={120}
          stepMs={70}
          durationMs={1050}
          className="mt-2 text-3xl font-medium tracking-tight text-foreground md:text-4xl"
        >
          A Message from the CEO
        </RevealText>

        <div className="mt-16 grid gap-16 lg:grid-cols-5 lg:gap-20 lg:items-start">
          <RevealBlock
            stagger={140}
            delayMs={260}
            durationMs={900}
            distance={24}
            className="lg:col-span-3"
          >
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              It gives me immense pleasure to present this message from Taban Niroo — an innovative, modern, forward-thinking organization I have had the honor of leading for the past quarter of a century. Having dedicated more than forty years of my life to the Power &amp; Electricity industry, I share our achievements with apt pride.
            </p>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground md:text-xl">
              Since our inception, our products have been engineered to excel — sometimes beyond world standards — through research, perseverance, and an unwavering desire for perfection. Innovation and creative solutions have allowed us to meet the diverse challenges of our clients.
            </p>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground md:text-xl">
              Over the last quarter of a century we have doubled our workforce, fostered a culture of diversity, and established ourselves as a prominent manufacturer in the power and electricity sector in Iran, rivalling many multinational companies. Today, we proudly serve major clients across Africa, South America, and the Middle East.
            </p>
          </RevealBlock>

          <RevealBlock
            delayMs={380}
            durationMs={1050}
            distance={32}
            className="lg:col-span-2 flex flex-col items-start"
          >
            <div className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-2xl bg-secondary shadow-elevate ring-1 ring-border/70 dark:shadow-black/50 dark:ring-white/10">
              <Image
                src={SITE_IMAGES.ceoPortrait}
                alt="Asadollah Zamani, CEO, Taban Niroo"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 280px, 320px"
              />
            </div>
            <p className="mt-8 font-serif text-xl italic tracking-tight text-foreground">
              Asadollah Zamani
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Chief Executive Officer
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              October 2024
            </p>
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
