import type { ContentBlock } from "@/lib/cms-content";

/**
 * Headline proof metrics from the 2025-2026 Company Profile (Projects,
 * Years active, Rated voltage, Served countries).
 *
 * These live in their own module because two sections now read them: the
 * `ProofBandSection` directly under the hero, which is where a first-time
 * visitor needs them, and — historically — "Why Taban Niroo?". Keeping the
 * parsing here means the client still edits one CMS block and both surfaces
 * agree. Keep the rendered tokens identical to the catalogue.
 */
export type Kpi = {
  label: string;
  to: number;
  prefix?: string;
  suffix?: string;
  /** Set when the metric is a range or otherwise not countable (e.g. "6-1000 kV"). */
  value?: string;
};

export const DEFAULT_KPIS: readonly Kpi[] = [
  { label: "Projects", to: 500, prefix: "+" },
  { label: "Years active", to: 24, prefix: "+" },
  { label: "Rated voltage", to: 1000, value: "6-1000 kV" },
  { label: "Countries served", to: 15, prefix: "+" },
];

/**
 * Reads KPI items out of a CMS block, falling back to `DEFAULT_KPIS`.
 *
 * A CMS item counts as a KPI when it has a `value`. Plain integers (with an
 * optional leading `+`) render as static editorial figures (e.g. `500+`);
 * anything else — ranges like `6-1000 kV` — renders as a figure with the
 * unit moved into the label context by the proof band.
 *
 * `legacy` exists for the `home.whyTaban` → `home.proof` split. The two
 * consumers read disjoint subsets of the same `items[]` — KPIs are the
 * entries with a `value`, pillars are the entries with a `body` — so a
 * payload saved before the split still resolves correctly here while
 * `WhyTabanSection` keeps reading the pillars from the same block. That
 * makes the split lossless with no migration. Once the client saves
 * `home.proof` once, the fallback can be dropped.
 */
export function resolveKpis(
  cms?: ContentBlock,
  legacy?: ContentBlock,
): readonly Kpi[] {
  const pick = (block?: ContentBlock) => {
    const items = block?.items?.filter((i) => i.label.trim()) ?? [];
    return items.filter((i) => Boolean(i.value?.trim()));
  };

  const primary = pick(cms);
  const source = primary.length > 0 ? primary : pick(legacy);

  const fromCms: Kpi[] = source
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

  return fromCms.length > 0 ? fromCms : DEFAULT_KPIS;
}
