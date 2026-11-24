import type { Locale } from "@/lib/i18n/config";
import type { ProductFamilyId } from "@/lib/products";

/**
 * Display labels for product families.
 *
 * `ProductFamilyId` is the English label used as its own key, so FA surfaces
 * rendered the raw id. Technical family terms that the Iranian power sector
 * writes in Latin (Long Rod, DPL codes, IEC refs) stay Latin inside product
 * names — only the family heading is localized here.
 */
const FAMILY_LABELS: Record<Locale, Record<ProductFamilyId, string>> = {
  en: {
    "Silicone Composite Insulators": "Silicone Composite Insulators",
    "Hybrid Insulators": "Hybrid Insulators",
    "Transformer Bushings": "Transformer Bushings",
    "Cable Accessories": "Cable Accessories",
    "Overhead Feeder Line Composite": "Overhead Feeder Line Composite",
    "Creepage Extenders & Covers": "Creepage Extenders & Covers",
  },
  fa: {
    "Silicone Composite Insulators": "مقرهٔ کامپوزیتی سیلیکونی",
    "Hybrid Insulators": "مقرهٔ هیبریدی",
    "Transformer Bushings": "بوشینگ ترانسفورماتور",
    "Cable Accessories": "سرکابل و مفصل",
    "Overhead Feeder Line Composite": "کامپوزیت خط فیدر هوایی",
    "Creepage Extenders & Covers": "افزایندهٔ فاصلهٔ خزشی و پوشش",
  },
};

/** Localized family heading; unknown ids fall through unchanged. */
export function familyLabel(
  family: ProductFamilyId | string,
  locale: Locale,
): string {
  return FAMILY_LABELS[locale][family as ProductFamilyId] ?? family;
}

/** Short chip labels for the mobile family filter. */
const FAMILY_SHORT_LABELS: Record<Locale, Record<ProductFamilyId, string>> = {
  en: {
    "Silicone Composite Insulators": "Composite",
    "Hybrid Insulators": "Hybrid",
    "Transformer Bushings": "Bushings",
    "Cable Accessories": "Cable",
    "Overhead Feeder Line Composite": "Feeder line",
    "Creepage Extenders & Covers": "Creepage",
  },
  fa: {
    "Silicone Composite Insulators": "کامپوزیتی",
    "Hybrid Insulators": "هیبریدی",
    "Transformer Bushings": "بوشینگ",
    "Cable Accessories": "سرکابل",
    "Overhead Feeder Line Composite": "خط فیدر",
    "Creepage Extenders & Covers": "خزشی",
  },
};

/** Localized short chip label; unknown ids fall through unchanged. */
export function familyShortLabel(
  family: ProductFamilyId | string,
  locale: Locale,
): string {
  return FAMILY_SHORT_LABELS[locale][family as ProductFamilyId] ?? family;
}
