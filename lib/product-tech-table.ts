import type { ProductTechnicalRow, ProductVariant } from "@/lib/products";

export type TechBodyKey = keyof ProductTechnicalRow;

/**
 * Only these two MV datasheets keep Positive / Negative / Dry / Wet
 * sub-headers. Every other product shows Lightning + Power group titles
 * only (Positive + Wet values, no sub-header labels, no Neg/Dry columns).
 */
export const FULL_ELECTRICAL_SUBHEADER_PRODUCT_IDS = new Set([
  "line-post-24-36",
  "suspension-tension-24-36",
]);

export function usesFullElectricalSubheaders(productId: string): boolean {
  return FULL_ELECTRICAL_SUBHEADER_PRODUCT_IDS.has(productId);
}

/** Full Pos/Neg/Dry/Wet electrical columns (MV 24/36 only). */
export const FULL_ELECTRICAL_BODY_KEYS = [
  "impulseWithstand",
  "impulseNegative",
  "dryWithstand",
  "wetWithstand",
] as const satisfies readonly TechBodyKey[];

/** Simplified: Lightning (Positive value) + Power (Wet value). */
export const SIMPLE_ELECTRICAL_BODY_KEYS = [
  "impulseWithstand",
  "wetWithstand",
] as const satisfies readonly TechBodyKey[];

/** 330 / 400 / 500 kV — include empty Switching Impulse column. */
export const HV_ELECTRICAL_BODY_KEYS = [
  "impulseWithstand",
  "switchingWithstand",
  "wetWithstand",
] as const satisfies readonly TechBodyKey[];

export const SWITCHING_COLUMN_PRODUCT_IDS = new Set([
  "suspension-tension-330",
  "suspension-tension-400",
  "suspension-tension-500",
]);

export function getElectricalBodyKeys(
  productId: string,
): readonly TechBodyKey[] {
  if (usesFullElectricalSubheaders(productId)) return FULL_ELECTRICAL_BODY_KEYS;
  if (SWITCHING_COLUMN_PRODUCT_IDS.has(productId)) return HV_ELECTRICAL_BODY_KEYS;
  return SIMPLE_ELECTRICAL_BODY_KEYS;
}

/** @deprecated Use FULL_ELECTRICAL_BODY_KEYS / getElectricalBodyKeys */
export const ELECTRICAL_BODY_KEYS = FULL_ELECTRICAL_BODY_KEYS;

/** Row-span header labels — shared with the first two MV products. */
export const TECH_TABLE_HEADER_LABELS: Partial<Record<TechBodyKey, string>> = {
  ratedVoltage: "Rated System Voltage (kV)",
  sml: "Specified mechanical load (kN)",
  couplingSize: "Coupling Size",
  sectionLength: "Section length (mm)",
  arcingDistance: "Arcing distance (mm)",
  shedDiameter: "Diameter of shed (mm)",
  shedSpacing: "Shed Spacing B (mm)",
  minimumCreepage: "Creepage distance (mm)",
  weight: "Weight",
};

function hasField(
  variants: readonly ProductVariant[],
  key: TechBodyKey,
): boolean {
  return variants.some((v) => Boolean(v.technical?.[key]?.trim()));
}

/** Ordered body keys for one product's technical table. */
export function getTechTableBodyKeys(
  variants: readonly ProductVariant[] | undefined,
  productId = "",
): TechBodyKey[] {
  const rows = variants ?? [];
  const keys: TechBodyKey[] = ["ratedVoltage", "sml"];

  if (hasField(rows, "couplingSize")) keys.push("couplingSize");

  keys.push("sectionLength", "arcingDistance", "shedDiameter");

  if (hasField(rows, "shedSpacing")) keys.push("shedSpacing");

  keys.push("minimumCreepage", ...getElectricalBodyKeys(productId));

  keys.push("weight");

  return keys;
}

export function techTableUsesWideLayout(
  bodyKeys: readonly TechBodyKey[],
): boolean {
  return bodyKeys.some(
    (key) => key === "couplingSize" || key === "shedSpacing" || key === "weight",
  );
}

export function techTableSingleHeaderKeys(
  bodyKeys: readonly TechBodyKey[],
): TechBodyKey[] {
  const electrical = new Set<string>([
    ...FULL_ELECTRICAL_BODY_KEYS,
    ...SIMPLE_ELECTRICAL_BODY_KEYS,
    ...HV_ELECTRICAL_BODY_KEYS,
  ]);
  return bodyKeys.filter(
    (key) => !electrical.has(key) && key !== "weight",
  );
}

export function techTableHasWeightColumn(
  bodyKeys: readonly TechBodyKey[],
): boolean {
  return bodyKeys.includes("weight");
}
