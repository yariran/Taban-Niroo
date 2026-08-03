"use client";

import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsImage, cmsText } from "@/lib/cms-resolve";

/**
 * CEO message — one editorial letter: portrait + prose as a single piece.
 */
export function CEOSection({ cms }: { cms?: ContentBlock } = {}) {
  const eyebrow = cmsText(cms, "eyebrow", "Leadership");
  const title = cmsText(cms, "title", "A Message from the CEO");
  const defaultBody = [
    "It gives me immense pleasure to present this message from Taban Niroo — an innovative, modern, forward-thinking organization I have had the honor of leading for the past quarter of a century. Having dedicated more than forty years of my life to the Power & Electricity industry, I share our achievements with apt pride.",
    "Since our inception, our products have been engineered to excel — sometimes beyond world standards — through research, perseverance, and an unwavering desire for perfection. Innovation and creative solutions have allowed us to meet the diverse challenges of our clients.",
    "Over the last quarter of a century we have doubled our workforce, fostered a culture of diversity, and established ourselves as a prominent manufacturer in the power and electricity sector in Iran, rivalling many multinational companies. Today, we proudly serve major clients across Africa, South America, and the Middle East.",
  ].join("\n\n");
  const paragraphs = cmsText(cms, "body", defaultBody)
    .split(/\n\n+/)
    .filter(Boolean);
  const [lead, ...rest] = paragraphs;
  const image = cmsImage(cms, SITE_IMAGES.ceoPortrait) ?? SITE_IMAGES.ceoPortrait;

  return (
    <section id="ceo" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28 lg:px-16 lg:py-32">
        {/* Masthead — shared width with the letter below */}
        <header className="max-w-3xl">
          <RevealBlock delayMs={40} durationMs={650} distance={10}>
            <p className="text-xs uppercase tracking-[0.22em] text-brand-burgundy font-semibold">
              {eyebrow}
            </p>
          </RevealBlock>
          <RevealText
            as="h2"
            delayMs={90}
            stepMs={55}
            durationMs={1000}
            className="font-hero-slogan text-brand-heading mt-3 text-3xl font-semibold uppercase tracking-tight md:text-4xl lg:text-[2.85rem] lg:leading-[1.05]"
          >
            {title}
          </RevealText>
          <div
            className="mt-7 h-px w-16 bg-gradient-to-r from-[rgb(var(--accent-volt))] to-transparent opacity-80"
            aria-hidden
          />
        </header>

        <div className="mt-14 grid items-start gap-12 md:mt-16 lg:mt-20 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
          {/* Portrait + attribution — one identity block */}
          <RevealBlock
            delayMs={120}
            durationMs={1000}
            distance={24}
            className="mx-auto w-full max-w-[260px] lg:mx-0 lg:max-w-none"
          >
            <figure>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary ring-1 ring-border/50 dark:ring-white/10">
                <Image
                  src={image}
                  alt="Asadollah Zamani, CEO of Taban Niroo"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 260px, 280px"
                  unoptimized={image.startsWith("http")}
                />
              </div>
              <figcaption className="mt-5 border-t border-border/50 pt-4 dark:border-white/[0.08]">
                <p className="font-hero-slogan text-sm font-semibold uppercase tracking-[0.14em] text-brand-navy">
                  Asadollah Zamani
                </p>
                <p className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Chief Executive Officer
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                  October 2024
                </p>
              </figcaption>
            </figure>
          </RevealBlock>

          {/* Letter body */}
          <RevealBlock
            stagger={110}
            delayMs={200}
            durationMs={900}
            distance={18}
            className="min-w-0 lg:border-l lg:border-border/40 lg:pl-14 xl:pl-16 dark:lg:border-white/[0.07]"
          >
            {lead && (
              <p className="relative text-lg leading-[1.7] text-foreground/90 md:text-xl md:leading-[1.65]">
                <span
                  className="absolute -left-0.5 -top-1 select-none font-hero-slogan text-5xl leading-none text-brand-burgundy/40 md:-left-1 md:text-6xl"
                  aria-hidden
                >
                  “
                </span>
                <span className="relative">{lead}</span>
              </p>
            )}
            {rest.map((para, i) => (
              <p
                key={i}
                className="mt-7 text-base leading-[1.75] text-muted-foreground md:text-[1.0625rem] md:leading-[1.75]"
              >
                {para}
              </p>
            ))}

            <footer className="mt-12 flex items-end gap-4 pt-2 md:mt-14">
              <span
                className="mb-2 hidden h-px w-10 shrink-0 bg-foreground/25 sm:block"
                aria-hidden
              />
              <div>
                <p className="font-hero-slogan text-base italic tracking-tight text-brand-navy md:text-lg">
                  Asadollah Zamani
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  CEO, Taban Niroo
                </p>
              </div>
            </footer>
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
