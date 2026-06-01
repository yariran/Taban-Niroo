"use client";

import { CountUp } from "@/components/ui/count-up";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";

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
 * hairline dividers). No new colour tokens or shadows are introduced.
 *
 * KPI row reproduces the four headline metrics from the 2025-2026
 * Company Profile (Projects, Years active, Rated voltage, Served
 * countries) so the proof points share the same chapter as the
 * narrative. Keep the rendered tokens identical to the catalogue.
 */

type Pillar = {
  number: string;
  title: string;
  description: string;
};

type Kpi = {
  label: string;
  to: number;
  prefix?: string;
  suffix?: string;
  value?: string;
};

const KPIS: readonly Kpi[] = [
  { label: "Projects", to: 80, prefix: "+" },
  { label: "Years active", to: 29, prefix: "+" },
  { label: "RATED VOLTAGE", to: 1000, value: "6-1000 kV" },
  { label: "Served countries", to: 10 },
];

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

export function WhyTabanSection() {
  return (
    <section
      id="why-taban"
      className="bg-background"
      aria-labelledby="why-taban-heading"
    >
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <RevealBlock delayMs={40} durationMs={700} distance={14}>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Why Taban Niroo?
                </p>
              </RevealBlock>
              <span id="why-taban-heading" className="sr-only">
                Five reasons utilities keep coming back.
              </span>
              <RevealText
                as="h2"
                className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl"
              >
                Five reasons utilities keep coming back.
              </RevealText>
            </div>
            <div className="md:col-span-7 md:pt-3">
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                The values below are not a marketing framework. They are the operating principles that have guided the company through twenty-five years of power-sector work across Africa, South America and the Middle East.
              </p>
            </div>
          </div>

          {/* KPI row — merged from the standalone Editorial section.
              Same four numbers from the Company Profile, but now sit
              underneath the "Why Taban Niroo?" header so the proof
              points and the narrative share one chapter. Uses
              `divide-*` so hairlines resolve correctly on both the
              2x2 (mobile) and 1x4 (md+) layouts without per-cell
              math. */}
          <RevealBlock className="mt-12 grid grid-cols-2 divide-x divide-y divide-border border-y border-border md:mt-16 md:grid-cols-4 md:divide-y-0">
            {KPIS.map((kpi) => (
              <div
                key={kpi.label}
                className="px-6 py-8 text-center transition-colors duration-300 hover:bg-muted/35 md:px-8 md:py-10 dark:hover:bg-white/[0.04]"
              >
                <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                  {kpi.label}
                </p>
                <p className="text-4xl font-medium tracking-tight text-foreground md:text-5xl">
                  {kpi.value ?? (
                    <CountUp
                      to={kpi.to}
                      prefix={kpi.prefix}
                      suffix={kpi.suffix}
                      duration={1500}
                    />
                  )}
                </p>
              </div>
            ))}
          </RevealBlock>

          {/* Pillar list */}
          <RevealBlock
            as="ol"
            stagger={100}
            delayMs={220}
            durationMs={900}
            distance={26}
            className="mt-16 border-t border-border md:mt-24"
          >
              {PILLARS.map((pillar) => (
              <li
                key={pillar.number}
                className="group grid grid-cols-1 gap-4 border-b border-border py-10 transition-colors duration-300 hover:bg-muted/25 md:grid-cols-12 md:gap-8 md:px-2 md:py-12 dark:hover:bg-white/[0.03]"
              >
                <div className="md:col-span-2">
                  <p className="font-mono text-xs tracking-widest text-muted-foreground">
                    {pillar.number}
                  </p>
                </div>
                <div className="md:col-span-4">
                  <h3 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">
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
      </div>
    </section>
  );
}
