"use client";

import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsText } from "@/lib/cms-resolve";

/**
 * Vision, Values & Mission — the "why" chapter of the Company page.
 *
 * The three statements below are taken from the Company Profile
 * (2025-2026). Values reuse the five culture principles named in the
 * same document ("Excellence in Innovation, Leadership by Example,
 * Integrity and Transparency, client focus, employee-centred approach")
 * — keep the labels intact unless the brand document changes.
 *
 * Layout mirrors the editorial vocabulary already used by
 * `WhyTabanSection`: eyebrow + display heading, then a hairline-divided
 * list. Vision and Mission read as two long-form statements; Values sit
 * underneath as a numbered grid.
 */

type Value = {
  number: string;
  title: string;
  description: string;
};

const MISSION =
  "To design, test and manufacture composite and hybrid insulators, transformer bushings and line hardware to IEC standards from 6 to 1000 kV, and to support them in the field with engineering judgement rather than a catalogue number.";

const VALUES: readonly Value[] = [
  {
    number: "01",
    title: "Excellence in innovation",
    description:
      "Research, tooling and testing capacity are funded ahead of demand, so new insulator families reach the field proven rather than promised.",
  },
  {
    number: "02",
    title: "Leadership by example",
    description:
      "Engineering discipline and workplace safety are set at management level and practised on the shop floor, not delegated to a policy document.",
  },
  {
    number: "03",
    title: "Integrity & transparency",
    description:
      "Test reports, material data and commercial terms are shared in full. Utilities specify our products on evidence, not assurance.",
  },
  {
    number: "04",
    title: "Client focus",
    description:
      "Bespoke fittings, site audits and pollution studies sit inside the relationship — we solve the network problem, not only the purchase order.",
  },
  {
    number: "05",
    title: "Employee-centred approach",
    description:
      "Skilled specialists and technocrats stay for decades. Continuity of people is what makes continuity of product quality possible.",
  },
];

export function VisionValuesSection({ cms }: { cms?: ContentBlock } = {}) {
  const eyebrow = cmsText(cms, "eyebrow", "Vision, Values & Mission");
  const title = cmsText(
    cms,
    "title",
    "Built to carry the grid, not the quarter.",
  );
  const vision = cmsText(
    cms,
    "body",
    "To be the reference manufacturer of composite insulation for high-voltage networks across the Middle East, Africa, South America and Eastern Europe — the supplier utilities specify when a line has to stay energised for thirty years.",
  );
  /** `ContentBlock` has a single body slot — vision owns it, mission stays fixed. */
  const mission = MISSION;

  const cmsItems = cms?.items?.filter((i) => i.label.trim() && i.body?.trim()) ?? [];
  const values: readonly Value[] =
    cmsItems.length > 0
      ? cmsItems.map((i, idx) => ({
          number: String(idx + 1).padStart(2, "0"),
          title: i.label,
          description: i.body!.trim(),
        }))
      : VALUES;

  return (
    <section
      className="bg-background"
      aria-labelledby="vision-heading"
    >
      <div className="px-6 py-20 md:px-12 md:py-24 lg:px-20 lg:py-28">
        <div className="border-t border-border pt-12 md:pt-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
            {eyebrow}
          </p>

          <h2 id="vision-heading" className="mt-4 max-w-3xl">
            <RevealText
              as="span"
              className="block font-hero-slogan text-brand-heading text-3xl font-bold uppercase leading-[1.05] tracking-tight md:text-4xl lg:text-5xl"
            >
              {title}
            </RevealText>
          </h2>

          <div className="mt-12 grid gap-10 border-t border-border pt-10 md:mt-16 md:grid-cols-2 md:gap-16 md:pt-12">
            <RevealBlock>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-burgundy">
                Vision
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                {vision}
              </p>
            </RevealBlock>
            <RevealBlock delayMs={220}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-burgundy">
                Mission
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                {mission}
              </p>
            </RevealBlock>
          </div>

          <p className="mt-16 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-burgundy md:mt-20">
            Values
          </p>
          <RevealBlock as="ul" className="mt-6">
            {values.map((value) => (
              <li
                key={value.number}
                className="grid gap-2 border-t border-border py-6 md:grid-cols-[4rem_minmax(0,14rem)_minmax(0,1fr)] md:items-baseline md:gap-8 md:py-7"
              >
                <span className="font-mono text-xs text-muted-foreground/70 tabular">
                  {value.number}
                </span>
                <h3 className="text-base font-medium text-brand-heading md:text-lg">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {value.description}
                </p>
              </li>
            ))}
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
