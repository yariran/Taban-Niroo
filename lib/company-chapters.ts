/**
 * The five chapters of the Company page (`/about`).
 *
 * Kept in a plain module — not in the `"use client"` chapter-index
 * component — because the server-rendered page also reads this list to
 * feed `ChapterRail`. Exporting it from a client module hands the server
 * a client reference proxy instead of the array.
 */

export type CompanyChapter = {
  /** Anchor id on the section, also the `data-chapter-id` sentinel. */
  id: string;
  label: string;
};

export const COMPANY_CHAPTERS: readonly CompanyChapter[] = [
  { id: "about-us", label: "About Us" },
  { id: "ceo", label: "Message from CEO" },
  { id: "vision", label: "Vision, Values & Mission" },
  { id: "history", label: "History" },
  { id: "sustainability", label: "Sustainability" },
] as const;
