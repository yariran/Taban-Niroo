/**
 * The five chapters of the Company page (`/about`).
 *
 * Kept in a plain module — not in the `"use client"` chapter-index
 * component — because the server-rendered page also reads this list to
 * feed `ChapterRail`. Exporting it from a client module hands the server
 * a client reference proxy instead of the array.
 */

import type { Locale } from "@/lib/i18n/config";

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

/** Chapter labels per locale, keyed by chapter id. */
const CHAPTER_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    "about-us": "About Us",
    ceo: "Message from CEO",
    vision: "Vision, Values & Mission",
    history: "History",
    sustainability: "Sustainability",
  },
  fa: {
    "about-us": "دربارهٔ ما",
    ceo: "پیام مدیرعامل",
    vision: "چشم‌انداز، ارزش‌ها و مأموریت",
    history: "تاریخچه",
    sustainability: "پایداری",
  },
};

/** Company chapters with locale-appropriate labels. */
export function companyChapters(locale: Locale): CompanyChapter[] {
  return COMPANY_CHAPTERS.map((chapter) => ({
    ...chapter,
    label: CHAPTER_LABELS[locale][chapter.id] ?? chapter.label,
  }));
}
