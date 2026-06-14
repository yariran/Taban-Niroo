"use client";

import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";
import { cn } from "@/lib/utils";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import { ScrollRevealText } from "@/components/ui/scroll-reveal-text";

/**
 * Technology section — two-act composition.
 *
 *   Act I  – cinematic full-bleed image with the brand statement
 *            ("IEC. Standard. Industrial.") burned over a controlled
 *            dim. Sets the editorial tone of the chapter.
 *
 *   Act II – quiet, theme-consistent statement block. Uses the same
 *            eyebrow / display-heading / muted-body vocabulary as the
 *            rest of the homepage so the section never reads as a
 *            visual outlier. The descriptive sentence is delivered with
 *            a scroll-driven word colour reveal — the same device the
 *            client approved for the IEC standards line — so the
 *            paragraph "writes itself" as the reader passes through.
 *
 * Background and typography were tuned to match the global theme:
 *   • bg-background (no muted-grey gradient that read as flat / generic)
 *   • Editorial scale: text-3xl→text-5xl, font-medium tracking-tight
 *   • Eyebrow caption above the statement, mirroring every other
 *     section on the page.
 */

const TITLE_WORDS = ["IEC.", "Standard.", "Industrial."] as const;

const STATEMENT =
  "IEC 61109, 62217, 61466, 60120, 60471. ECR core. HTV silicone. Galvanized fittings. Accredited laboratories. 6-1000 kV.";

export function TechnologySection() {
  return (
    <section
      id="technology"
      className="relative bg-background"
      aria-label="IEC standards and industrial insulator technology"
    >
      {/* Act I — full-bleed cinematic image with overlay statement */}
      <div className="relative min-h-screen w-full bg-foreground">
        <Image
          src={SITE_IMAGES.technology}
          alt="Taban Niroo composite insulators and power transmission"
          fill
          className="object-cover"
          sizes="100vw"
          quality={80}
          decoding="async"
        />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="absolute inset-0 flex flex-col justify-end overflow-hidden pb-8 md:pb-14 lg:pb-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-0.5 px-5 sm:px-6 md:gap-1.5 md:px-8 lg:px-10">
            {TITLE_WORDS.map((word, index) => (
              <RevealText
                key={word}
                as="span"
                delayMs={index * 140}
                stepMs={60}
                durationMs={1100}
                className={cn(
                  "block w-full text-start leading-[1.02] text-white",
                  index === 0
                    ? "text-5xl font-semibold tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-8xl"
                    : "text-sm font-medium uppercase tracking-[0.18em] text-white/88 sm:text-base md:text-lg"
                )}
              >
                {word}
              </RevealText>
            ))}
          </div>
        </div>
      </div>

      {/* Act II — editorial statement block, theme-consistent */}
      <div className="relative border-t border-border/60 bg-background dark:border-white/[0.07]">
        <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
          <div className="mx-auto max-w-5xl">
            <RevealBlock delayMs={40} durationMs={700} distance={14}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Standards · 2025 — 2026
              </p>
            </RevealBlock>

            <RevealText
              as="h2"
              delayMs={120}
              stepMs={60}
              durationMs={1000}
              className="mt-4 text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl"
            >
              Type-tested. Field-proven.
            </RevealText>

            <ScrollRevealText
              as="p"
              className="mt-10 text-2xl font-medium leading-snug tracking-tight text-foreground md:mt-12 md:text-3xl lg:text-4xl"
            >
              {STATEMENT}
            </ScrollRevealText>
          </div>
        </div>
      </div>
    </section>
  );
}
