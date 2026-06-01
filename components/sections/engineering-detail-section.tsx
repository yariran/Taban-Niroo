"use client";

import { RevealBlock, RevealText } from "@/components/ui/reveal-text";

/**
 * Engineering DNA section.
 *
 * Combines two strictly-factual blocks from the 2025-2026 catalogue:
 *   1. "The Magical Features of Silicone Rubber"
 *      - No Moisture Infiltrate (Triple Junction Point)
 *      - Minimized Electrical Field Strength
 *   2. "Raw Material" (three components)
 *      - ECR rod
 *      - HTV Silicone Rubber
 *      - Hot-dip Galvanized Forged Steel
 *
 * All copy is lifted verbatim / near-verbatim from the PDFs. The goal of
 * this section is purely informational: it explains WHY Taban Niroo's
 * composite insulators perform the way they do, without adding any
 * marketing copy not present in the source documents.
 *
 * Visual language matches the rest of the homepage — eyebrow, display
 * heading, muted descriptions, subtle border-based cards, no new tokens.
 */

type MagicalFeature = {
  eyebrow: string;
  title: string;
  description: string;
};

const MAGICAL_FEATURES: readonly MagicalFeature[] = [
  {
    eyebrow: "Triple junction point",
    title: "No moisture infiltrate.",
    description:
      "Silicone rubber is directly moulded onto the ECR rod and permanently bonded to each fitting. Air and water cannot reach the triple junction point, eliminating the partial-discharge pathway that causes ageing in conventional insulators.",
  },
  {
    eyebrow: "Up to 420 kV",
    title: "Minimized electrical field.",
    description:
      "Rounded end-fitting geometry, validated by in-house field simulation, suppresses electrical-field concentration at the live end. The result is controlled corona behaviour and longer service life on transmission-class voltages.",
  },
];

type RawMaterial = {
  label: string;
  title: string;
  description: string;
};

const RAW_MATERIALS: readonly RawMaterial[] = [
  {
    label: "01",
    title: "ECR rod",
    description:
      "Electrical-grade, corrosion-resistant fibre-reinforced plastic core. Mechanical load path of the insulator.",
  },
  {
    label: "02",
    title: "HTV silicone rubber",
    description:
      "High-temperature vulcanised silicone housing. Hydrophobic, UV-stable, and fully recoverable under pollution.",
  },
  {
    label: "03",
    title: "Hot-dip galvanized forged steel",
    description:
      "Forged end-fittings protected by hot-dip galvanising for decades of atmospheric corrosion resistance.",
  },
];

/**
 * Patents are surfaced inline at the end of this section. They share
 * the same engineering subject and (previously) the same visual
 * container, so listing them as a quiet sub-block here keeps the
 * homepage cadence tight without losing the patent narrative.
 */
type Patent = {
  id: string;
  title: string;
  subtitle: string;
};

const PATENTS_BRIEF: readonly Patent[] = [
  {
    id: "01",
    title: "Hybrid Insulators",
    subtitle: "Silicone × Ceramic",
  },
  {
    id: "02",
    title: "Creepage Extenders & Covers",
    subtitle: "Pollution-zone retrofit",
  },
  {
    id: "03",
    title: "Hybrid Transformer Bushings",
    subtitle: "MV–HV transformers",
  },
];

export function EngineeringDetailSection() {
  return (
    <section
      id="engineering"
      className="border-y border-border/50 bg-muted/10 dark:border-white/[0.06] dark:bg-white/[0.015]"
      aria-labelledby="engineering-heading"
    >
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="max-w-3xl">
            <RevealBlock delayMs={40} durationMs={700} distance={14}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Engineering DNA
              </p>
            </RevealBlock>
            <span id="engineering-heading" className="sr-only">
              The magical features of silicone rubber.
            </span>
            <RevealText
              as="h2"
              splitLines
              delayMs={120}
              stepMs={65}
              durationMs={1050}
              className="mt-4 text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl"
            >
              {"The magical features | of silicone rubber."}
            </RevealText>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Two material-level advantages set silicone composite insulators apart from porcelain and glass — and drive every line of our product specification.
            </p>
          </div>

          {/* Magical feature cards */}
          <RevealBlock
            stagger={140}
            delayMs={200}
            durationMs={950}
            distance={34}
            className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-6"
          >
            {MAGICAL_FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-border/50 bg-card/90 p-8 shadow-elevate transition-colors duration-300 hover:border-border md:p-10 dark:border-white/[0.08] dark:bg-card/50 dark:hover:border-white/[0.14]"
              >
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {feature.eyebrow}
                </p>
                <h3 className="mt-4 text-xl font-medium tracking-tight text-foreground md:text-2xl">
                  {feature.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </RevealBlock>

          {/* Raw material divider */}
          <div className="mt-24 md:mt-32">
            <div className="flex items-end justify-between gap-6 border-b border-border pb-6">
              <div>
                <RevealBlock delayMs={40} durationMs={650} distance={12}>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Raw material
                  </p>
                </RevealBlock>
                <RevealText
                  as="h3"
                  delayMs={110}
                  stepMs={55}
                  durationMs={950}
                  className="mt-3 text-2xl font-medium tracking-tight text-foreground md:text-3xl"
                >
                  Three components. One product.
                </RevealText>
              </div>
              <p className="hidden max-w-xs text-sm leading-relaxed text-muted-foreground md:block">
                Every Taban Niroo insulator is built from the same three rigorously-specified ingredients.
              </p>
            </div>

            <RevealBlock
              stagger={130}
              delayMs={180}
              durationMs={900}
              distance={28}
              className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0"
            >
              {RAW_MATERIALS.map((item) => (
                <div
                  key={item.label}
                  className="py-8 md:px-8 md:py-10 md:first:pl-0 md:last:pr-0"
                >
                  <p className="font-mono text-xs tracking-widest text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-4 text-lg font-medium text-foreground md:text-xl">
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </RevealBlock>
          </div>

          {/* Patents — inline sub-block. Was a standalone section that
              shared the same container; merging it here removes one
              redundant homepage chapter while preserving the patent
              narrative as the natural conclusion of the engineering
              story. */}
          <div id="patents" className="mt-24 md:mt-32">
            <div className="flex flex-col gap-3 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Patents &amp; Innovation
                </p>
                <h3 className="mt-3 text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                  Three patents. One engineering culture.
                </h3>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Innovations developed in-house, registered, and already
                deployed on live transmission and distribution networks.
              </p>
            </div>

            <RevealBlock className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
              {PATENTS_BRIEF.map((patent) => (
                <div
                  key={patent.id}
                  className="py-8 md:px-8 md:py-10 md:first:pl-0 md:last:pr-0"
                >
                  <p className="font-mono text-xs tracking-widest text-muted-foreground">
                    Patent {patent.id}
                  </p>
                  <p className="mt-4 text-lg font-medium text-foreground md:text-xl">
                    {patent.title}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                    {patent.subtitle}
                  </p>
                </div>
              ))}
            </RevealBlock>
          </div>
        </div>
      </div>
    </section>
  );
}
