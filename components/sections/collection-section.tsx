"use client";

import { useMemo } from "react";

import { IndustrialWorldMap, resolveMarkets } from "@/components/world-map";
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
  /*
    Literals, not `cmsText`: `ContentBlock` is a fixed schema (eyebrow,
    title, body, cta…) with no slot for these, and widening it would mean
    a migration plus admin fields for six words. They match the map's own
    labels, which are literals for the same reason.
  */
  const legendHome = "Headquarters";
  const legendMarket = "Active market";

  /*
    The figures come from the CMS where an editor has filled the block's
    item list, and from the built-in table everywhere else. Both the rail
    and the map read the same resolved object, so a corrected project
    count moves the country card and the total together.
  */
  const { data: markets, totals } = useMemo(() => resolveMarkets(cms), [cms]);

  const stats = [
    { value: totals.markets, label: "Markets" },
    { value: totals.projects, label: "Projects" },
    { value: totals.since, label: "Since" },
  ];

  return (
    <section
      id="installations"
      className="flex h-[100svh] min-h-[100svh] max-h-[100svh] flex-col overflow-hidden bg-background"
    >
      {/*
        No `<Beat>` here — the one home section without one.

        The original reason was a hydration mismatch: `IndustrialWorldMap`
        derived its SVG gradient ids from `useId()`, and any change to the
        tree inside this `next/dynamic` boundary — Beat's context provider
        included — shifted the id React generated on the client relative
        to the server, breaking the gradient fills. That constraint is
        gone: the map now uses fixed gradient ids, so a wrapper here is
        safe if one is ever wanted.

        It stays absent for the reason that still holds. The roles below
        fall back to self-observation, which is the documented behaviour
        outside a Beat and costs nothing here: this section is a locked
        single viewport, so there is no long section for a shared clock to
        hold together.
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
            <IndustrialWorldMap embedded markets={markets} />
          </div>
        </div>

        {/*
          The map is the only thing in a locked 100svh section, and until
          someone clicks a market it reports no figures at all. These are
          derived from the same table the cards read, so the rail and the
          cards cannot disagree.
        */}
        <RevealBlock
          delayMs={BEAT.lede + 120}
          durationMs={EVIDENCE.duration}
          distance={EVIDENCE.distance}
          className="mt-3 shrink-0 border-t border-border/60 pt-3 md:mt-4 md:pt-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            <ul className="flex items-center gap-5">
              <li className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:text-[11px]">
                <span
                  aria-hidden="true"
                  className="grid h-3 w-3 place-items-center rounded-full border border-brand-orange"
                >
                  <span className="h-1 w-1 rounded-full bg-foreground" />
                </span>
                {legendHome}
              </li>
              <li className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:text-[11px]">
                <span
                  aria-hidden="true"
                  className="grid h-3 w-3 place-items-center rounded-full border border-brand-orange/70"
                >
                  <span className="h-1 w-1 rounded-full bg-brand-orange" />
                </span>
                {legendMarket}
              </li>
            </ul>

            <dl className="flex items-center gap-6 md:gap-9">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <dd className="text-brand-heading text-lg font-semibold tabular-nums leading-none md:text-xl">
                    {stat.value}
                  </dd>
                  <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
