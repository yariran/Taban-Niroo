import type { Locale } from "@/lib/i18n";
import { DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * Locale-aware string: plain string = English (legacy CMS + code defaults).
 * Object form keeps one product/content record without forking catalogues.
 */
export type LocalizedString =
  | string
  | {
      en: string;
      fa?: string;
    };

export function isLocalizedObject(
  value: unknown,
): value is { en: string; fa?: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "en" in value &&
    typeof (value as { en: unknown }).en === "string"
  );
}

/**
 * Resolve a localized field for the active locale.
 * Missing/empty `fa` falls back to `en` (never returns empty when en exists).
 */
export function t(
  value: LocalizedString | null | undefined,
  locale: Locale,
  fallback = "",
): string {
  if (value == null) return fallback;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  if (!isLocalizedObject(value)) return fallback;

  const en = value.en?.trim() ?? "";
  if (locale === "fa") {
    const fa = value.fa?.trim() ?? "";
    if (fa) return fa;
    return en || fallback;
  }

  return en || fallback;
}

/** Prefer English for locale-neutral matching (image heuristics, search keys). */
export function tEn(
  value: LocalizedString | null | undefined,
  fallback = "",
): string {
  return t(value, DEFAULT_LOCALE, fallback);
}

/** Split a stored field into editable EN / FA drafts. */
export function splitLocalized(
  value: LocalizedString | null | undefined,
): { en: string; fa: string } {
  if (value == null) return { en: "", fa: "" };
  if (typeof value === "string") return { en: value, fa: "" };
  if (!isLocalizedObject(value)) return { en: "", fa: "" };
  return {
    en: value.en ?? "",
    fa: value.fa ?? "",
  };
}

/**
 * Persist drafts as a plain English string when FA is empty,
 * otherwise `{ en, fa }` so one catalogue record stays bilingual.
 */
export function joinLocalized(en: string, fa: string): LocalizedString {
  const e = en.trim();
  const f = fa.trim();
  if (!f) return e;
  return { en: e, fa: f };
}
