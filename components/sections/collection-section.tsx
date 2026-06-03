"use client";

import { FadeImage } from "@/components/fade-image";
import { SITE_IMAGES } from "@/lib/site-images";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";

const INSTALLATION_COUNTRIES = [
  "Afghanistan",
  "Iraq",
  "Turkey",
  "Somalia",
  "Ghana",
  "Liberia",
  "Morocco",
  "Greece",
  "Colombia",
  "Peru",
] as const;

export function CollectionSection() {
  return (
    <section id="installations" className="bg-background">
      <div className="px-6 pt-20 md:px-12 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <RevealBlock delayMs={40} durationMs={650} distance={12}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Projects & Partners
            </p>
          </RevealBlock>
          <RevealText
            as="h2"
            delayMs={120}
            stepMs={70}
            durationMs={1050}
            className="mt-3 text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl"
          >
            Global Partner Footprint
          </RevealText>
          <RevealBlock
            delayMs={360}
            durationMs={900}
            distance={22}
            className="mt-4 max-w-3xl"
          >
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              International installations and partner collaborations across
              strategic markets in the Middle East, Africa, Europe, and South
              America.
            </p>
          </RevealBlock>
        </div>
      </div>

      <div className="px-6 pb-24 pt-10 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12">
          <article className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-[#121820] shadow-elevate ring-1 ring-black/[0.04] dark:border-white/[0.08] dark:bg-[#f2ede2] dark:ring-white/[0.08]">
              <div className="relative aspect-[16/10] md:aspect-[16/9]">
                <div className="absolute inset-0 dark:hidden">
                  <FadeImage
                    src={SITE_IMAGES.projectMap}
                    alt="Taban Niroo global project and partner map"
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 1024px) 66vw, 100vw"
                  />
                </div>
                <div className="absolute inset-0 hidden dark:block">
                  <FadeImage
                    src={SITE_IMAGES.projectMapDark}
                    alt="Taban Niroo global project and partner map"
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 1024px) 66vw, 100vw"
                  />
                </div>
              </div>
            </div>
          </article>

          <aside className="lg:col-span-4">
            <div className="rounded-3xl border border-border/80 bg-card/95 p-6 shadow-md ring-1 ring-border/50 backdrop-blur-[2px] dark:border-white/[0.08] dark:bg-card/90 dark:ring-white/[0.06] md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Active countries
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Ongoing and completed projects with utility and industrial
                partners.
              </p>
              <RevealBlock
                stagger={55}
                delayMs={120}
                durationMs={650}
                distance={14}
                className="mt-6 flex flex-wrap gap-2"
              >
                {INSTALLATION_COUNTRIES.map((country) => (
                  <span
                    key={country}
                    className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] text-secondary-foreground"
                  >
                    {country}
                  </span>
                ))}
              </RevealBlock>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Export references and regional project details are available upon
              request.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
