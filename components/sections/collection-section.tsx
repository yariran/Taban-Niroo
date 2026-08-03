"use client";

import { IndustrialWorldMap } from "@/components/world-map";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsText } from "@/lib/cms-resolve";

export function CollectionSection({ cms }: { cms?: ContentBlock } = {}) {
  const eyebrow = cmsText(cms, "eyebrow", "Projects & Partners");
  const title = cmsText(cms, "title", "Global Partner Footprint");
  const body = cmsText(
    cms,
    "body",
    "International installations and partner collaborations across strategic markets in the Middle East, Africa, Europe, and South America.",
  );

  return (
    <section
      id="installations"
      className="flex h-[100svh] min-h-[100svh] max-h-[100svh] flex-col overflow-hidden bg-background"
    >
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-6 pb-5 pt-[max(5.5rem,10svh)] md:px-12 md:pb-6 lg:px-20">
        <header className="shrink-0">
          <RevealBlock delayMs={40} durationMs={550} distance={10}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-burgundy md:text-xs">
              {eyebrow}
            </p>
          </RevealBlock>
          <RevealText
            as="h2"
            delayMs={100}
            stepMs={55}
            durationMs={900}
            className="font-hero-slogan text-brand-heading mt-1.5 text-2xl font-semibold uppercase tracking-tight md:text-3xl lg:text-[2.35rem] lg:leading-tight"
          >
            {title}
          </RevealText>
          <RevealBlock
            delayMs={280}
            durationMs={700}
            distance={12}
            className="mt-2 max-w-2xl"
          >
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground md:text-[0.95rem] md:leading-relaxed">
              {body}
            </p>
          </RevealBlock>
        </header>

        <div className="mt-3 flex min-h-0 flex-1 items-center justify-center [container-type:size] md:mt-4">
          <div className="aspect-[2/1] h-auto max-h-full w-[min(100%,calc(100cqh*2))]">
            <IndustrialWorldMap embedded />
          </div>
        </div>
      </div>
    </section>
  );
}
