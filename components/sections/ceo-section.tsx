"use client";

import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";
import { RevealBlock } from "@/components/ui/reveal-text";
import { RevealUp } from "@/components/ui/reveal-words";
import { ImageReveal } from "@/components/ui/image-reveal";
import { Beat } from "@/components/ui/beat";
import { BEAT, EVIDENCE, STATEMENT } from "@/lib/motion-roles";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsImage, cmsText } from "@/lib/cms-resolve";

/**
 * CEO message — the closing chapter, and the page's only human plate.
 *
 * Also absorbs what used to ship as a separate "Testimonials" section one
 * chapter above. That quote was the CEO's own voice, unattributed and
 * mislabelled as a client testimonial; as the letter's closing pull-quote
 * it finally has an author. The `home.testimonials` CMS block still feeds
 * it, unchanged, so nothing the client has already written is lost.
 */
export function CEOSection({
  cms,
  closing,
  withClosing = false,
}: {
  cms?: ContentBlock;
  /** `home.testimonials` — the closing pull-quote and final plate. */
  closing?: ContentBlock;
  /**
   * Render the closing pull-quote and final plate. Off by default because
   * `/about` renders this same component with the same `home.ceo` block
   * and must not grow a factory image it never had — the merge is a
   * home-page composition decision, not a change to the letter itself.
   */
  withClosing?: boolean;
} = {}) {
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

  const closingQuote = cmsText(
    closing,
    "body",
    "At Taban Niroo we will continue to supply products our clients can use without any concerns — and keep improving the quality of our products and craftsmanship, as well as production efficiency, to increase our credibility.",
  );
  const closingImage =
    cmsImage(closing, SITE_IMAGES.testimonials) ?? SITE_IMAGES.testimonials;

  return (
    <section id="ceo" className="bg-background">
      <Beat className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28 lg:px-16 lg:py-32">
        {/* Masthead — shared width with the letter below */}
        <header className="max-w-3xl">
          <RevealBlock
            delayMs={BEAT.first}
            durationMs={EVIDENCE.duration}
            distance={EVIDENCE.distance}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-brand-burgundy font-semibold">
              {eyebrow}
            </p>
          </RevealBlock>
          <RevealUp
            as="h2"
            delay={BEAT.headline}
            duration={STATEMENT.duration}
            distance={STATEMENT.distance}
            className="font-hero-slogan text-brand-heading mt-3 text-3xl font-semibold uppercase tracking-tight md:text-4xl lg:text-[2.85rem] lg:leading-[1.05]"
          >
            {title}
          </RevealUp>
          <div
            className="mt-7 h-px w-16 bg-gradient-to-r from-[rgb(var(--accent-volt))] to-transparent opacity-80"
            aria-hidden
          />
        </header>

        <div className="mt-14 grid items-start gap-12 md:mt-16 lg:mt-20 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
          {/* Portrait + attribution — one identity block */}
          <div className="mx-auto w-full max-w-[260px] lg:mx-0 lg:max-w-none">
            <figure>
              {/* The only human plate on the site. */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary ring-1 ring-border/50 dark:ring-white/10">
                <ImageReveal className="absolute inset-0" delayMs={BEAT.lede}>
                  <Image
                    src={image}
                    alt="Asadollah Zamani, CEO of Taban Niroo"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 260px, 280px"
                    unoptimized={image.startsWith("http")}
                  />
                </ImageReveal>
              </div>
              <figcaption className="mt-5 border-t border-border/50 pt-4 dark:border-white/[0.08]">
                <p className="font-hero-slogan text-sm font-semibold uppercase tracking-[0.14em] text-brand-navy">
                  Asadollah Zamani
                </p>
                <p className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Chief Executive Officer
                </p>
                {/* `/80` measured 3.75:1 light on 10px — under 4.5. */}
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  October 2024
                </p>
              </figcaption>
            </figure>
          </div>

          {/* Letter body */}
          <RevealBlock
            stagger={EVIDENCE.stagger}
            delayMs={BEAT.group}
            durationMs={EVIDENCE.duration}
            distance={EVIDENCE.distance}
            className="min-w-0 lg:border-s lg:border-border/40 lg:ps-14 xl:ps-16 dark:lg:border-white/[0.07]"
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
      </Beat>

      {/*
        The closing commitment. Previously shipped one chapter above as an
        unattributed "testimonial"; it is the CEO's own voice, so it closes
        his letter. Given the left burgundy rule rather than a second
        quotation mark — the letter's opening `"` already owns that device.
      */}
      {withClosing && (
      <Beat className="px-6 pb-16 md:px-12 md:pb-20 lg:px-20">
        <RevealUp
          delay={BEAT.first}
          duration={STATEMENT.duration}
          distance={STATEMENT.distance}
          className="mx-auto block max-w-5xl"
        >
          <p className="relative ps-5 text-2xl leading-relaxed text-brand-navy before:absolute before:start-0 before:top-[0.35em] before:h-[1.15em] before:w-0.5 before:rounded-full before:bg-gradient-to-b before:from-brand-burgundy before:to-brand-navy before:content-[''] md:ps-6 md:text-3xl lg:text-[2.5rem] lg:leading-snug dark:text-brand-cream dark:before:from-brand-burgundy/80 dark:before:to-brand-orange/80">
            {closingQuote}
          </p>
        </RevealUp>
      </Beat>
      )}

      {withClosing && (
      <Beat>
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <div
            data-parallax="0.92"
            data-parallax-max="24"
            className="absolute inset-x-0 -inset-y-[5%]"
          >
            <ImageReveal className="absolute inset-0">
              {/* `.cine-grade` sets `position: relative`, so it nests inside
                  the absolute wrapper rather than sharing it — same shape
                  the R&D plates use. `--muted` because this is the only
                  full-colour frame on the home feed. */}
              <div className="cine-grade cine-grade--muted h-full w-full">
                {closingImage.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={closingImage}
                    alt="Taban Niroo manufacturing, Shiraz Special Economic Zone"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={closingImage}
                    alt="Taban Niroo manufacturing, Shiraz Special Economic Zone"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                )}
              </div>
            </ImageReveal>
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"
            aria-hidden
          />
          {/* Same 35mm finish the other full-bleed plates carry. */}
          <div className="grain-layer" aria-hidden />
        </div>
      </Beat>
      )}
    </section>
  );
}
