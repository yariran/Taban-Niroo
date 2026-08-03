import type { ProductTechnicalRow, ProductVariant } from "@/lib/products";

export type TechBodyKey = keyof ProductTechnicalRow;

/** Electrical columns always use Positive / Negative / Dry / Wet sub-headers. */
export const ELECTRICAL_BODY_KEYS = [
  "impulseWithstand",
  "impulseNegative",
  "dryWithstand",
  "wetWithstand",
] as const satisfies readonly TechBodyKey[];

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
  weight: "Weight (kg)",
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
): TechBodyKey[] {
  const rows = variants ?? [];
  const keys: TechBodyKey[] = ["ratedVoltage", "sml"];

  if (hasField(rows, "couplingSize")) keys.push("couplingSize");

  keys.push(
    "sectionLength",
    "arcingDistance",
    "shedDiameter",
  );

  if (hasField(rows, "shedSpacing")) keys.push("shedSpacing");

  keys.push("minimumCreepage", ...ELECTRICAL_BODY_KEYS);

  if (hasField(rows, "weight")) keys.push("weight");

  return keys;
}

export function techTableUsesWideLayout(bodyKeys: readonly TechBodyKey[]): boolean {
  return bodyKeys.some(
    (key) => key === "couplingSize" || key === "shedSpacing" || key === "weight",
  );
}

export function techTableSingleHeaderKeys(
  bodyKeys: readonly TechBodyKey[],
): TechBodyKey[] {
  return bodyKeys.filter(
    (key) =>
      !ELECTRICAL_BODY_KEYS.includes(key as (typeof ELECTRICAL_BODY_KEYS)[number]) &&
      key !== "weight",
  );
}

export function techTableHasWeightColumn(
  bodyKeys: readonly TechBodyKey[],
): boolean {
  return bodyKeys.includes("weight");
}
