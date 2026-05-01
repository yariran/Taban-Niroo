"use client";

import { RevealBlock } from "@/components/ui/reveal-text";
import { CountUp } from "@/components/ui/count-up";

/**
 * KPI numbers — sourced verbatim from the 2025-2026 Company Profile.
 * Keep the rendered tokens exactly as they appear in the official
 * document; the count-up is a presentation flourish, the final string
 * still matches the catalogue ("+80", "1100 kV", "+3M", "9").
 */
type Spec = {
  label: string;
  to: number;
  prefix?: string;
  suffix?: string;
};

const specs: readonly Spec[] = [
  { label: "Projects", to: 80, prefix: "+" },
  { label: "Years active", to: 20, prefix: "+" },
  { label: "Rated voltage", to: 1100, suffix: " kV" },
  { label: "Units installed", to: 3, prefix: "+", suffix: "M" },
  { label: "Served countries", to: 9 },
];

export function EditorialSection() {
  return (
    <section className="bg-background">
      {/* Newsletter Banner */}
      

      {/* Decorative Icons */}
      <div className="flex items-center justify-center gap-6 pb-20">
        
        
      </div>

      {/* Specs Grid */}
      <RevealBlock
        stagger={120}
        durationMs={950}
        distance={30}
        className="grid grid-cols-2 border-t border-border md:grid-cols-5"
      >
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="border-b border-r border-border p-8 text-center transition-colors duration-300 last:border-r-0 hover:bg-muted/35 md:border-b-0 dark:hover:bg-white/[0.04]"
          >
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              {spec.label}
            </p>
            <p className="font-medium text-foreground text-4xl tabular">
              <CountUp
                to={spec.to}
                prefix={spec.prefix}
                suffix={spec.suffix}
                duration={1500}
              />
            </p>
          </div>
        ))}
      </RevealBlock>

      {/* Full-width Video */}
      <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/industrial.mp4"
        />
      </div>
    </section>
  );
}
