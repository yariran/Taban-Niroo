"use client";

import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsText } from "@/lib/cms-resolve";

/**
 * R&D overview — the opening chapter of the Blog – R&D route.
 *
 * Frames the two engineering efforts the rest of the page documents:
 * IEC 60815-3 shed profile calculation (`PollutionPerformanceSection`)
 * and hybrid insulator development (`HybridDevelopmentSection`). Copy is
 * from the R&D page draft; keep the "calculation, not a guess" framing —
 * it is the claim the following two sections exist to evidence.
 *
 * `ContentBlock` has a single body slot, so the CMS owns the lead
 * paragraph and the second stays fixed here — same split
 * `VisionValuesSection` uses for vision vs mission.
 */

const CLOSING =
  "This approach has driven two of our most significant engineering efforts: rigorous, standards-based shed profile design for our composite insulator range, and the development of our hybrid insulator technology — a product line we've been refining since 2009.";

export function RnDOverviewSection({ cms }: { cms?: ContentBlock } = {}) {
  const eyebrow = cmsText(cms, "eyebrow", "R&D overview");
  const title = cmsText(cms, "title", "Engineering that starts");
  const titleLine2 = cmsText(cms, "titleLine2", "before the product does");
  const lead = cmsText(
    cms,
    "body",
    "Every Taban Niroo product begins as a calculation, not a guess. Our R&D team works from IEC standards, electrical field simulations, and years of accumulated field data to engineer insulators that perform reliably in the specific conditions they'll actually face — not just in laboratory ideal conditions.",
  );

  return (
    <section className="bg-background" aria-labelledby="rnd-overview-heading">
      <div className="px-6 py-20 md:px-12 md:py-24 lg:px-20 lg:py-28">
        <div className="border-t border-border pt-12 md:pt-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
            {eyebrow}
          </p>

          <h2 id="rnd-overview-heading" className="mt-4 max-w-3xl">
            <RevealText
              as="span"
              className="block font-hero-slogan text-brand-heading text-3xl font-bold uppercase leading-[1.05] tracking-tight md:text-4xl lg:text-5xl"
            >
              {title}
            </RevealText>
            <RevealText
              as="span"
              delayMs={140}
              className="block font-hero-slogan text-brand-heading text-3xl font-bold uppercase leading-[1.05] tracking-tight md:text-4xl lg:text-5xl"
            >
              {titleLine2}
            </RevealText>
          </h2>

          <div className="mt-12 grid gap-10 border-t border-border pt-10 md:mt-16 md:grid-cols-2 md:gap-16 md:pt-12">
            <RevealBlock>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {lead}
              </p>
            </RevealBlock>
            <RevealBlock delayMs={220}>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {CLOSING}
              </p>
            </RevealBlock>
          </div>
        </div>
      </div>
    </section>
  );
}
