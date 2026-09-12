"use client";

import { IndustrialWorldMap } from "@/components/world-map";
import { RevealBlock } from "@/components/ui/reveal-text";
import { RevealUp } from "@/components/ui/reveal-words";
import { BEAT, EVIDENCE, STATEMENT } from "@/lib/motion-roles";
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
      {/*
        Deliberately NO `<Beat>` here — the one home section without one.

        `IndustrialWorldMap` derives its SVG gradient ids from `useId()`,
        and inserting Beat's context provider inside this `next/dynamic`
        boundary shifts the id React generates on the client relative to
        the server, producing a hydration mismatch (verified: with the
        wrapper the SSR html says `_R_a…` while the client says `_R_2…`,
        and the gradient fills break). The roles below fall back to
        self-observation, which is the documented behaviour outside a
        Beat and costs nothing here: this section is a locked single
        viewport, so there is no long section for a shared clock to hold
        together.
      */}
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-6 pb-5 pt-[max(5.5rem,10svh)] md:px-12 md:pb-6 lg:px-20">
        <header className="shrink-0">
          <RevealBlock
            delayMs={BEAT.first}
            durationMs={EVIDENCE.duration}
            distance={EVIDENCE.distance}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-burgundy md:text-xs">
              {eyebrow}
            </p>
          </RevealBlock>
          <RevealUp
            as="h2"
            delay={BEAT.headline}
            duration={STATEMENT.duration}
            distance={STATEMENT.distance}
            className="font-hero-slogan text-brand-heading mt-1.5 text-2xl font-semibold uppercase tracking-tight md:text-3xl lg:text-[2.35rem] lg:leading-tight"
          >
            {title}
          </RevealUp>
          <RevealBlock
            delayMs={BEAT.lede}
            durationMs={EVIDENCE.duration}
            distance={EVIDENCE.distance}
            className="mt-2 max-w-2xl"
          >
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground md:text-[0.95rem] md:leading-relaxed">
              {body}
            </p>
          </RevealBlock>
        </header>

        {/*
          No `data-parallax` on the map, deliberately. This section is a
          locked 100svh flex column and the map is sized by container
          queries against the remaining space — a drift transform here
          fights that sizing for no depth gain. The map also carries its
          own marker/route animation, so it is not a static plate.
        */}
        <div className="mt-3 flex min-h-0 flex-1 items-center justify-center [container-type:size] md:mt-4">
          <div className="aspect-[2/1] h-auto max-h-full w-[min(100%,calc(100cqh*2))]">
            <IndustrialWorldMap embedded />
          </div>
        </div>
      </div>
    </section>
  );
}
