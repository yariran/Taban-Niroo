"use client";

import { RevealBlock } from "@/components/ui/reveal-text";
import { RevealUp } from "@/components/ui/reveal-words";
import { Beat } from "@/components/ui/beat";
import { BEAT, EVIDENCE, STATEMENT } from "@/lib/motion-roles";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsText } from "@/lib/cms-resolve";

/**
 * "Why Taban Niroo?" section.
 *
 * The five axes below are reproduced from the Company Profile (2025-2026,
 * section "Why Taban Niroo?"). Each pillar keeps the exact label used in
 * the source PDF — do not rename or merge them without an updated brand
 * document. The short descriptions paraphrase the two or three supporting
 * sentences under each pillar in the PDF to fit the homepage without
 * straying from the original meaning.
 *
 * Design intent: quiet, tabular, editorial — matches the existing
 * homepage vocabulary (eyebrow + display heading + numbered list with
 * hairline dividers), with navy/burgundy brand accents on proof points.
 *
 * The four headline KPIs that used to render here now open the page as
 * `ProofBandSection`, directly under the hero. Both read the same
 * `home.whyTaban` CMS block through `lib/home-kpis.ts`.
 */

type Pillar = {
  number: string;
  title: string;
  description: string;
};

const PILLARS: readonly Pillar[] = [
  {
    number: "01",
    title: "Foresight",
    description:
      "We anticipate the future needs of the power industry and invest in research, equipment and people long before the market demands them.",
  },
  {
    number: "02",
    title: "Leading innovation",
    description:
      "Three registered patents and a continuously expanding product range mean our customers build their projects on proven, domestically-engineered technology.",
  },
  {
    number: "03",
    title: "Technologies & standards",
    description:
      "Every product family is designed and type-tested to IEC 61109, 62217, 61466, 60120 and 60471 in accredited laboratories, from 6-1000 kV.",
  },
  {
    number: "04",
    title: "Work beyond the project scope",
    description:
      "We actively partner with utilities and EPC contractors to solve field problems — bespoke fittings, site audits, pollution studies — well outside a normal supply contract.",
  },
  {
    number: "05",
    title: "Ethics",
    description:
      "Long-term client relationships are built on transparent commercial terms, honest engineering advice and consistent product quality over decades, not quarters.",
  },
];

export function WhyTabanSection({ cms }: { cms?: ContentBlock } = {}) {
  const eyebrow = cmsText(cms, "eyebrow", "Why Taban Niroo?");
  const title = cmsText(
    cms,
    "title",
    "Five reasons utilities keep coming back.",
  );
  const body = cmsText(
    cms,
    "body",
    "The values below are not a marketing framework. They are the operating principles that have guided the company through twenty-five years of power-sector work across Africa, South America and the Middle East.",
  );

  const cmsItems = cms?.items?.filter((i) => i.label.trim()) ?? [];
  const pillarsFromCms: Pillar[] = cmsItems
    .filter((i) => Boolean(i.body?.trim()))
    .map((i, idx) => ({
      number: String(idx + 1).padStart(2, "0"),
      title: i.label,
      description: i.body!.trim(),
    }));

  const pillars = pillarsFromCms.length > 0 ? pillarsFromCms : PILLARS;

  return (
    <section
      id="why-taban"
      className="bg-background"
      aria-labelledby="why-taban-heading"
    >
      <Beat className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <RevealBlock
                delayMs={BEAT.first}
                durationMs={EVIDENCE.duration}
                distance={EVIDENCE.distance}
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
                  {eyebrow}
                </p>
              </RevealBlock>
              <span id="why-taban-heading" className="sr-only">
                {title}
              </span>
              <RevealUp
                as="h2"
                delay={BEAT.headline}
                duration={STATEMENT.duration}
                distance={STATEMENT.distance}
                className="font-hero-slogan text-brand-heading mt-4 text-balance text-4xl font-semibold uppercase tracking-tight md:text-5xl lg:text-6xl"
              >
                {title}
              </RevealUp>
            </div>
            <div className="md:col-span-7 md:pt-3">
              <RevealBlock
                delayMs={BEAT.lede}
                durationMs={EVIDENCE.duration}
                distance={EVIDENCE.distance}
              >
                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  {body}
                </p>
              </RevealBlock>
            </div>
          </div>

          {/* Pillar list.
              The KPI row that used to sit here now opens the page as
              `ProofBandSection` — see `lib/home-kpis.ts` for the shared
              source. This section keeps the five narrative pillars. */}
          <RevealBlock
            as="ol"
            stagger={EVIDENCE.stagger}
            delayMs={BEAT.group}
            durationMs={EVIDENCE.duration}
            distance={EVIDENCE.distance}
            className="mt-16 border-t border-border md:mt-24"
          >
              {pillars.map((pillar) => (
              <li
                key={pillar.number}
                className="group grid grid-cols-1 gap-4 border-b border-border py-10 transition-colors duration-300 hover:bg-muted/25 md:grid-cols-12 md:gap-8 md:px-2 md:py-12 dark:hover:bg-white/[0.03]"
              >
                <div className="md:col-span-2">
                  {/* `--brand-burgundy`, not `--brand-orange`: this sits on the
                      page background, so it needs the theme-aware gold that
                      darkens for light mode. `--brand-orange` stays bright for
                      dark surfaces only. */}
                  <p className="font-mono text-xs tracking-widest text-brand-burgundy">
                    {pillar.number}
                  </p>
                </div>
                <div className="md:col-span-4">
                  <h3 className="text-xl font-medium tracking-tight text-brand-navy md:text-2xl">
                    {pillar.title}
                  </h3>
                </div>
                <div className="md:col-span-6">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              </li>
            ))}
          </RevealBlock>
        </div>
      </Beat>
    </section>
  );
}
