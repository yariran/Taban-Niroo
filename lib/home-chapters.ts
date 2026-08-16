/**
 * The ten chapters of the home page, in three acts.
 *
 * Kept in a plain module — not in a `"use client"` component — because
 * the server-rendered page reads this list to feed `ChapterRail`.
 * Exporting it from a client module hands the server a client reference
 * proxy instead of the array (symptom: `chapters.forEach is not a
 * function`). Same reasoning as `lib/company-chapters.ts`.
 *
 * Array order IS page order IS the rail numbering. That is deliberate:
 * the previous design passed `index` / `total` / `chapter` by hand to
 * eleven wrappers, which drifted into `index={3}` being skipped and
 * `total={12}` claimed while thirteen sections rendered. Nothing read
 * those props, so nothing caught it. Deriving all three from one array
 * makes that class of bug unrepresentable.
 */

export type HomeChapter = {
  /** Anchor id on the section, and the `data-chapter-id` sentinel value. */
  id: string;
  label: string;
  /** 1 = who we are · 2 = what we make and why it matters · 3 = proof. */
  act: 1 | 2 | 3;
};

export const HOME_CHAPTERS: readonly HomeChapter[] = [
  { id: "hero", label: "Opening", act: 1 },
  { id: "proof", label: "By the numbers", act: 1 },

  { id: "philosophy", label: "Composite & Hybrid", act: 2 },
  { id: "featured-products", label: "Product range", act: 2 },
  { id: "engineering", label: "Engineering DNA", act: 2 },
  { id: "technology", label: "Standards", act: 2 },

  { id: "plant", label: "On the factory floor", act: 3 },
  { id: "installations", label: "Global footprint", act: 3 },
  { id: "why-taban", label: "Why Taban Niroo", act: 3 },
  { id: "ceo", label: "From the CEO", act: 3 },
] as const;
