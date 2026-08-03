"use client";

import { CountUp } from "@/components/ui/count-up";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
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
  { label: "Rated voltage", to: 1000, value: "6-1000 kV" },
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
  const kpiFromCms: Kpi[] = cmsItems
    .filter((i) => Boolean(i.value?.trim()))
    .map((i) => {
      const raw = i.value!.trim();
      const numeric = raw.replace(/^[+\s]+/, "");
      if (/^\d+$/.test(numeric) && !raw.includes("-")) {
        return {
          label: i.label,
          to: Number(numeric),
          prefix: raw.startsWith("+") ? "+" : undefined,
        };
      }
      return { label: i.label, to: 0, value: raw };
    });
  const pillarsFromCms: Pillar[] = cmsItems
    .filter((i) => Boolean(i.body?.trim()))
    .map((i, idx) => ({
      number: String(idx + 1).padStart(2, "0"),
      title: i.label,
      description: i.body!.trim(),
    }));

  const kpis = kpiFromCms.length > 0 ? kpiFromCms : KPIS;
  const pillars = pillarsFromCms.length > 0 ? pillarsFromCms : PILLARS;

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
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
                  {eyebrow}
                </p>
              </RevealBlock>
              <span id="why-taban-heading" className="sr-only">
                {title}
              </span>
              <RevealText
                as="h2"
                className="font-hero-slogan text-brand-heading mt-4 text-balance text-4xl font-semibold uppercase tracking-tight md:text-5xl lg:text-6xl"
              >
                {title}
              </RevealText>
            </div>
            <div className="md:col-span-7 md:pt-3">
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {body}
              </p>
            </div>
          </div>

          {/* KPI row — white elevated band (matches Safari / desktop reference).
              Four centered metrics in one panel so Chromium and WebKit share
              the same composition. */}
          <RevealBlock className="mt-12 md:mt-16">
            <div className="rounded-2xl bg-white px-5 py-8 shadow-elevate ring-1 ring-brand-navy/8 dark:bg-card dark:ring-white/[0.08] sm:px-8 sm:py-10 md:px-10">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6 md:gap-y-0">
                {kpis.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="flex flex-col items-center text-center"
                  >
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-burgundy">
                      {kpi.label}
                    </dt>
                    <dd className="mt-2.5 whitespace-nowrap text-[clamp(1.6rem,3.6vw,2.5rem)] font-medium leading-none tracking-tight text-brand-navy tabular-nums">
                      {kpi.value ?? (
                        <CountUp
                          to={kpi.to}
                          prefix={kpi.prefix}
                          suffix={kpi.suffix}
                          duration={1500}
                        />
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
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
              {pillars.map((pillar) => (
              <li
                key={pillar.number}
                className="group grid grid-cols-1 gap-4 border-b border-border py-10 transition-colors duration-300 hover:bg-muted/25 md:grid-cols-12 md:gap-8 md:px-2 md:py-12 dark:hover:bg-white/[0.03]"
              >
                <div className="md:col-span-2">
                  <p className="font-mono text-xs tracking-widest text-brand-orange">
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
      </div>
    </section>
  );
}
