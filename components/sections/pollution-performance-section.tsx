"use client";

import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import { useLocale } from "@/components/locale-link";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsText } from "@/lib/cms-resolve";
import { pageHeadingScale } from "@/lib/i18n/type-scale";
import { cn } from "@/lib/utils";

/**
 * Pollution performance engineering — the IEC/TS 60815-3 chapter.
 *
 * The six criteria below are the profile checks every long rod design is
 * verified against before production. They are standard parameters, not
 * marketing copy — do not reword the parameter names (`s/p ratio`,
 * `l/d ratio`, `CF`) without checking the standard, since utilities read
 * this page against their own specifications.
 *
 * Layout reuses the numbered hairline list from `VisionValuesSection` so
 * the two technical chapters of the site speak with one voice.
 */

type Criterion = {
  number: string;
  title: string;
  description: string;
};

const CRITERIA: readonly Criterion[] = [
  {
    number: "01",
    title: "Alternating shed classification",
    description:
      "Verifying shed overhang differences meet the standard's thresholds for effective self-cleaning.",
  },
  {
    number: "02",
    title: "Spacing versus shed overhang (s/p ratio)",
    description:
      "Ensuring shed geometry avoids the risk of shed-to-shed arcing.",
  },
  {
    number: "03",
    title: "Minimum distance between sheds",
    description:
      "One of the most critical checks in profile evaluation, since insufficient shed spacing can negate the benefit of added creepage distance entirely.",
  },
  {
    number: "04",
    title: "Creepage distance versus clearance (l/d ratio)",
    description:
      "A localized check against arc bridging in deep, narrow sections of the profile.",
  },
  {
    number: "05",
    title: "Shed angle",
    description:
      "Balanced to allow effective natural washing without compromising creepage performance.",
  },
  {
    number: "06",
    title: "Creepage factor (CF)",
    description:
      "A global density check confirming the overall design meets pollution severity class requirements across SPS Class a through e.",
  },
];

const CLOSING =
  "Each of our long rod insulator designs is verified against every one of these parameters before production — not just tested after the fact. This calculation-first approach is what allows us to confidently specify our products for the heavy pollution, coastal, and desert environments common across our served markets.";

export function PollutionPerformanceSection({
  cms,
}: { cms?: ContentBlock } = {}) {
  const locale = useLocale();
  const eyebrow = cmsText(cms, "eyebrow", "Pollution performance engineering");
  const title = cmsText(cms, "title", "Every shed profile,");
  const titleLine2 = cmsText(
    cms,
    "titleLine2",
    "calculated against IEC 60815-3",
  );
  const lead = cmsText(
    cms,
    "body",
    "Shed profile design isn't a matter of aesthetics — it's a set of precise engineering parameters that determine how an insulator performs under real-world pollution and moisture conditions. Our R&D team calculates every long rod insulator design against the full set of IEC/TS 60815-3 criteria, including:",
  );

  const cmsItems =
    cms?.items?.filter((i) => i.label.trim() && i.body?.trim()) ?? [];
  const criteria: readonly Criterion[] =
    cmsItems.length > 0
      ? cmsItems.map((i, idx) => ({
          number: String(idx + 1).padStart(2, "0"),
          title: i.label,
          description: i.body!.trim(),
        }))
      : CRITERIA;

  return (
    <section className="bg-background" aria-labelledby="pollution-heading">
      <div className="px-6 py-20 md:px-12 md:py-24 lg:px-20 lg:py-28">
        <div className="border-t border-border pt-12 md:pt-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
            {eyebrow}
          </p>

          <h2 id="pollution-heading" className="mt-4 max-w-3xl">
            <RevealText
              as="span"
              className={cn(
                "block font-hero-slogan text-brand-heading font-bold uppercase leading-[1.05] tracking-tight",
                pageHeadingScale(locale),
              )}
            >
              {title}
            </RevealText>
            <RevealText
              as="span"
              delayMs={140}
              className={cn(
                "block font-hero-slogan text-brand-heading font-bold uppercase leading-[1.05] tracking-tight",
                pageHeadingScale(locale),
              )}
            >
              {titleLine2}
            </RevealText>
          </h2>

          <RevealBlock>
            <p className="mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:mt-10 md:text-lg">
              {lead}
            </p>
          </RevealBlock>

          <p className="mt-14 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-burgundy md:mt-16">
            Profile criteria
          </p>
          <RevealBlock as="ul" className="mt-6">
            {criteria.map((criterion) => (
              <li
                key={criterion.number}
                className="grid gap-2 border-t border-border py-6 md:grid-cols-[4rem_minmax(0,18rem)_minmax(0,1fr)] md:items-baseline md:gap-8 md:py-7"
              >
                <span className="font-mono text-xs text-muted-foreground/70 tabular">
                  {criterion.number}
                </span>
                <h3 className="text-base font-medium text-brand-heading md:text-lg">
                  {criterion.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {criterion.description}
                </p>
              </li>
            ))}
          </RevealBlock>

          <RevealBlock>
            <p className="mt-12 max-w-3xl border-t border-border pt-10 text-base leading-relaxed text-muted-foreground md:mt-14 md:pt-12 md:text-lg">
              {CLOSING}
            </p>
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
