"use client";

import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import { ScrollRevealText } from "@/components/ui/scroll-reveal-text";

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
      "Every product family is designed and type-tested to IEC 61109, 62217, 61466, 60120 and 60471 in accredited laboratories, up to 1100 kV.",
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
      <div className="px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40">
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
                delayMs={140}
                stepMs={65}
                durationMs={1050}
                className="mt-4 text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl"
              >
                Five reasons utilities keep coming back.
              </RevealText>
            </div>
            <div className="md:col-span-7 md:pt-3">
              <ScrollRevealText
                as="p"
                className="max-w-2xl text-base leading-relaxed md:text-lg"
              >
                The values below are not a marketing framework. They are the operating principles that have guided the company through twenty-five years of power-sector work across Africa, South America and the Middle East.
              </ScrollRevealText>
            </div>
          </div>

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
