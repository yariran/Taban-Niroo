"use client";

import { RevealBlock } from "@/components/ui/reveal-text";
import { RevealUp } from "@/components/ui/reveal-words";
import { Beat } from "@/components/ui/beat";
import { BEAT, EVIDENCE, STATEMENT } from "@/lib/motion-roles";
import type { ContentBlock } from "@/lib/cms-content-types";
import { cmsText } from "@/lib/cms-resolve";
import { cn } from "@/lib/utils";

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

export function EngineeringDetailSection({
  cms,
}: { cms?: ContentBlock } = {}) {
  const eyebrow = cmsText(cms, "eyebrow", "Engineering DNA");
  const title = cmsText(
    cms,
    "title",
    "The magical features | of silicone rubber.",
  );
  const titleForReveal = title.includes("|")
    ? title
    : title.replace(/\.\s+/, ". | ");
  const body = cmsText(
    cms,
    "body",
    "Two material-level advantages set silicone composite insulators apart from porcelain and glass — and drive every line of our product specification.",
  );

  return (
    <section
      id="engineering"
      className="bg-background"
      aria-labelledby="engineering-heading"
    >
      {/*
        Three beats, not one. This section is roughly three viewports tall
        and carries three separate sub-arguments (silicone properties /
        raw materials / patents). On a single clock the lower two groups
        finish animating far off screen. Repeating the same
        statement+evidence pair three times is also where the grammar
        becomes audible as a grammar rather than a one-off.
      */}
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <Beat>
          <div className="max-w-3xl">
            <RevealBlock
              delayMs={BEAT.first}
              durationMs={EVIDENCE.duration}
              distance={EVIDENCE.distance}
            >
              <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                {eyebrow}
              </p>
            </RevealBlock>
            <span id="engineering-heading" className="sr-only">
              {title.replace(/\s*\|\s*/g, " ")}
            </span>
            {/* `|` is the CMS author's line-break marker — kept as real
                block lines so the intended break survives. */}
            <RevealUp
              as="h2"
              delay={BEAT.headline}
              duration={STATEMENT.duration}
              distance={STATEMENT.distance}
              className="font-hero-slogan text-brand-heading mt-4 text-3xl font-semibold uppercase tracking-tight md:text-4xl lg:text-5xl"
            >
              {titleForReveal.split(/\s*\|\s*/).map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </RevealUp>
            <RevealBlock
              delayMs={BEAT.lede}
              durationMs={EVIDENCE.duration}
              distance={EVIDENCE.distance}
            >
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {body}
              </p>
            </RevealBlock>
          </div>

          <RevealBlock
            stagger={EVIDENCE.stagger}
            delayMs={BEAT.group}
            durationMs={EVIDENCE.duration}
            distance={EVIDENCE.distance}
            className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-5 md:gap-6"
          >
            {MAGICAL_FEATURES.map((feature, i) => (
              <article
                key={feature.title}
                className={cn(
                  "rounded-2xl border p-8 transition-shadow duration-300 md:p-10",
                  /* Dimensional Layering: elevation encodes rank instead of
                     every card sharing one shadow. The lead claim sits a step
                     higher; the second reads as supporting evidence. */
                  i === 0
                    ? "md:col-span-3 border-border/60 bg-card shadow-elevate"
                    : "md:col-span-2 border-border/50 bg-card/70 shadow-card-rest",
                  "hover:shadow-card-hover dark:border-white/[0.08] dark:bg-card/50",
                )}
              >
                <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                  {feature.eyebrow}
                </p>
                <h3
                  className={cn(
                    "mt-4 font-medium tracking-tight text-brand-navy",
                    i === 0 ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
                  )}
                >
                  {feature.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </RevealBlock>
          </Beat>

          <Beat className="mt-24 md:mt-32">
            <div className="flex items-end justify-between gap-6 border-b border-border pb-6">
              <div>
                <RevealBlock
                  delayMs={BEAT.first}
                  durationMs={EVIDENCE.duration}
                  distance={EVIDENCE.distance}
                >
                  <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                    Raw material
                  </p>
                </RevealBlock>
                <RevealUp
                  as="h3"
                  delay={BEAT.headline}
                  duration={STATEMENT.duration}
                  distance={STATEMENT.distance}
                  className="mt-3 text-2xl font-medium tracking-tight text-brand-navy md:text-3xl"
                >
                  Three components. One product.
                </RevealUp>
              </div>
              <p className="hidden max-w-xs text-sm leading-relaxed text-muted-foreground md:block">
                Every Taban Niroo insulator is built from the same three
                rigorously-specified ingredients.
              </p>
            </div>

            <RevealBlock
              stagger={EVIDENCE.stagger}
              delayMs={BEAT.group}
              durationMs={EVIDENCE.duration}
              distance={EVIDENCE.distance}
              /**
               * Bento Box Grid — ui-ux-pro-max › styles.csv, followed to spec.
               *
               * Database values, verbatim from the record:
               *   grid-template-columns: repeat(4, 1fr)   → md:grid-cols-4
               *   grid-auto-rows: 200px                   → md:auto-rows-[200px]
               *   gap: 16px                               → gap-4
               *   border-radius: 24px                     → rounded-3xl
               *   hover scale (1.02)                      → on the inner card
               *   responsive 4→2→1                        → 1 / sm:2 / md:4
               *
               * Spans are 2×2 + 2×1 + 2×1, which tiles a 4-column field with
               * no holes. The ECR rod takes the 2×2: it is the mechanical load
               * path the whole insulator hangs from, so equal thirds asserted
               * a parity the product does not have.
               *
               * Palette is left on the project tokens because they already ARE
               * the database's: it specifies --page-bg #F5F5F7 / --card-bg
               * #FFFFFF, and the project ships #F4F5F6 / #FFFFFF.
               */
              className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-12 md:grid-cols-4 md:auto-rows-[200px]"
            >
              {RAW_MATERIALS.map((item, i) => {
                const anchor = i === 0;
                return (
                  /*
                   * Wrapper exists so the database's `hover: scale(1.02)` can
                   * actually run. RevealBlock sets `transform` as an INLINE
                   * style on each direct child, and inline beats a class — a
                   * hover scale on the card itself would silently do nothing.
                   * The wrapper absorbs the reveal transform; the card scales.
                   */
                  <div
                    key={item.label}
                    className={cn(
                      "sm:col-span-2",
                      anchor && "md:row-span-2",
                    )}
                  >
                  <article
                    className={cn(
                      "flex h-full flex-col rounded-3xl border border-border/50 bg-card/80 p-7 shadow-card-rest md:p-8",
                      "transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-card-hover",
                      "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100",
                      "dark:border-white/[0.08] dark:bg-card/40",
                      anchor && "md:p-10",
                    )}
                  >
                    <p className="font-mono text-xs tracking-widest text-muted-foreground">
                      {item.label}
                    </p>
                    {/* The anchor tile is two rows tall. Its copy is centred
                        in the space below the index rather than hung from the
                        bottom edge: bottom-hanging put the whole 220px of
                        slack above the title, which reads as an unfinished
                        tile, where splitting it reads as the extra room a
                        featured tile is entitled to. */}
                    <div className={cn(anchor && "md:my-auto")}>
                      <p
                        className={cn(
                          /*
                            Rank is carried by size, span and elevation — the
                            same three levers the feature cards above this
                            block already use. It used to be carried by
                            TYPEFACE too: the anchor was Oswald uppercase at
                            5xl while its two siblings were Inter sentence
                            case at lg, so a set of three ingredients read as
                            one headline plus two footnotes from a different
                            design. Same voice now, three sizes apart.
                          */
                          "font-medium tracking-tight text-brand-navy",
                          anchor
                            ? "mt-5 text-3xl md:mt-0 md:text-4xl"
                            : "mt-4 text-lg md:text-xl",
                        )}
                      >
                        {item.title}
                      </p>
                      <p
                        className={cn(
                          "leading-relaxed text-muted-foreground",
                          anchor
                            ? "mt-5 max-w-md text-base md:text-lg"
                            : "mt-3 text-sm",
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  </article>
                  </div>
                );
              })}
            </RevealBlock>
          </Beat>

          <Beat className="mt-24 md:mt-32">
            <div id="patents" className="flex flex-col gap-3 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <RevealBlock
                  delayMs={BEAT.first}
                  durationMs={EVIDENCE.duration}
                  distance={EVIDENCE.distance}
                >
                  <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                    Patents &amp; Innovation
                  </p>
                </RevealBlock>
                <RevealUp
                  as="h3"
                  delay={BEAT.headline}
                  duration={STATEMENT.duration}
                  distance={STATEMENT.distance}
                  className="mt-3 text-2xl font-medium tracking-tight text-brand-navy md:text-3xl"
                >
                  Three patents. One engineering culture.
                </RevealUp>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Innovations developed in-house, registered, and already deployed
                on live transmission and distribution networks.
              </p>
            </div>

            <RevealBlock
              stagger={EVIDENCE.stagger}
              delayMs={BEAT.group}
              durationMs={EVIDENCE.duration}
              distance={EVIDENCE.distance}
              /**
               * Swiss Modernism 2.0 — ui-ux-pro-max › styles.csv, to spec.
               *
               * Database values, verbatim:
               *   grid-template-columns: repeat(12, 1fr)  → grid-cols-12
               *   gap: 1rem (8px base unit)               → gap-4, 8px multiples
               *   --border-radius: 0px, "no decorations"  → no cards, rules only
               *   single accent only                      → the one gold
               *   font-family: Inter/Helvetica            → project body font
               *
               * This is the record's own "Best For: corporate sites,
               * professional services, documentation", and it is what the
               * --design-system generator picked for this product in the first
               * place. Editorial Grid / Magazine was the wrong call here: its
               * checklist wants pull quotes, drop caps, multi-column text and
               * large imagery — none of which a three-line patent register
               * has — and its record explicitly lists "short-form content"
               * under Do Not Use For.
               *
               * Column assignment (of 12): index 1-2 · title 3-8 · class 9-12.
               */
              className="mt-4 flex flex-col"
            >
              {PATENTS_BRIEF.map((patent) => (
                <article
                  key={patent.id}
                  className="group grid grid-cols-12 items-baseline gap-4 border-b border-border py-6 transition-colors duration-300 hover:border-brand-burgundy md:py-8 dark:border-white/[0.08]"
                >
                  {/* This numeral replaced the old "Patent 01" caption, so it
                      is now the only thing carrying the register index — it
                      cannot be a ghost. A tint faint enough to look decorative
                      measured 1.1:1 against the page; these tones hold 5.8:1
                      in light and 6.3:1 in dark. */}
                  <span className="col-span-2 font-mono text-2xl tabular-nums text-muted-foreground transition-colors duration-300 group-hover:text-brand-burgundy md:text-4xl dark:text-white/55">
                    {patent.id}
                  </span>
                  <h4 className="col-span-10 text-lg font-medium tracking-tight text-brand-navy md:col-span-6 md:text-2xl">
                    {patent.title}
                  </h4>
                  <p className="col-span-10 col-start-3 text-xs uppercase tracking-widest text-brand-burgundy md:col-span-4 md:col-start-9 md:text-right">
                    {patent.subtitle}
                  </p>
                </article>
              ))}
            </RevealBlock>
          </Beat>
        </div>
      </div>
    </section>
  );
}
