"use client";

import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";
import { ScrollPan } from "@/components/ui/scroll-pan";
import { RevealBlock } from "@/components/ui/reveal-text";
import { RevealUp } from "@/components/ui/reveal-words";
import { Beat } from "@/components/ui/beat";
import { BEAT, EVIDENCE, STATEMENT } from "@/lib/motion-roles";
import { useLocale } from "@/components/locale-link";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsText } from "@/lib/cms-resolve";
import { pageHeadingScale } from "@/lib/i18n/type-scale";
import { cn } from "@/lib/utils";

/**
 * Manufacturing chapter — header + horizontal product rail.
 * The full-bleed plant video/plate was removed by request.
 */

const GALLERY_ALTS = [
  "Composite long rod insulator",
  "Post insulator installation",
  "Hybrid insulator",
  "Transformer bushing",
  "Interphase spacer",
  "DPL insulator product",
] as const;

export function PlantSection({ cms }: { cms?: ContentBlock } = {}) {
  const locale = useLocale();

  const eyebrow = cmsText(cms, "eyebrow", "Manufacturing");
  const title = cmsText(cms, "title", "On the factory floor.");
  const body = cmsText(
    cms,
    "body",
    "Moulding, assembly and routine test — Shiraz Especial Economic Zone.",
  );

  const images = SITE_IMAGES.gallery.map((src, i) => ({
    src,
    alt: GALLERY_ALTS[i] ?? "Taban Niroo product",
  }));

  return (
    <section id="plant" className="bg-background" aria-label="On the factory floor">
      <Beat className="px-6 pb-10 pt-16 md:px-12 md:pb-12 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <RevealBlock delayMs={BEAT.first} distance={EVIDENCE.distance}>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
              {eyebrow}
            </p>
          </RevealBlock>

          <RevealUp
            as="h2"
            delay={BEAT.headline}
            duration={STATEMENT.duration}
            distance={STATEMENT.distance}
            className={cn(
              "font-hero-slogan text-brand-heading mt-5 text-balance font-semibold uppercase tracking-tight",
              pageHeadingScale(locale),
            )}
          >
            {title}
          </RevealUp>

          <RevealBlock
            delayMs={BEAT.lede}
            distance={EVIDENCE.distance}
            className="mt-5 max-w-2xl md:mt-6"
          >
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {body}
            </p>
          </RevealBlock>
        </div>
      </Beat>

      <Beat className="py-12 md:py-16">
        <div className="relative">
          <ScrollPan
            className="px-0"
            innerClassName="px-6 pb-3 md:px-8 lg:px-10"
            ariaLabel="Scrollable product gallery"
            edgeFades
            fadeFrom="from-background"
            passVerticalScroll
          >
            <RevealBlock
              className="flex gap-4 md:gap-6"
              delayMs={BEAT.first}
              distance={EVIDENCE.distance}
              durationMs={EVIDENCE.duration}
              stagger={EVIDENCE.stagger}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative h-[min(58vh,22rem)] w-[min(80vw,22rem)] flex-shrink-0 overflow-hidden rounded-2xl ring-1 ring-border/50 dark:ring-white/[0.06] md:h-[min(64vh,26rem)] md:w-[min(56vw,28rem)] lg:h-[min(68vh,30rem)] lg:w-[min(42vw,32rem)]"
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover transition-none"
                    sizes="(min-width: 1024px) 28rem, (min-width: 768px) 56vw, 80vw"
                    quality={70}
                    decoding="async"
                  />
                </div>
              ))}
            </RevealBlock>
          </ScrollPan>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:text-xs">
          <span aria-hidden className="inline-block h-px w-6 bg-current opacity-60" />
          <span>Scroll or drag to pan</span>
          <span aria-hidden className="inline-block h-px w-6 bg-current opacity-60" />
        </div>
      </Beat>
    </section>
  );
}
