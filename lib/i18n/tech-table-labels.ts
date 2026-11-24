/**
 * Column headers for the product technical tables (detail page + modal).
 *
 * **These stay Latin in both locales, deliberately.**
 *
 * The table is a 1:1 transcription of the printed datasheet. A procurement
 * engineer reads it with the IEC clause and the paper catalogue open beside
 * it, and every one of these headers is the wording used there — translating
 * "Specified mechanical load (kN)" makes the cross-check harder, not easier.
 * A half-Persian header row would also be the worst of both: the Latin units
 * and designations cannot move, so the row would break script mid-cell and
 * wrap unpredictably in RTL.
 *
 * Kept as a locale-keyed function anyway, so the decision lives in one place
 * and a future change needs one edit rather than thirty call sites.
 */
export type TechHeaderKey =
  | "type"
  | "catalogNo"
  | "ratedVoltage"
  | "sml"
  | "couplingSize"
  | "sectionLength"
  | "arcingDistance"
  | "shedDiameter"
  | "shedSpacing"
  | "creepageDistance"
  | "weight"
  | "notes"
  | "positive"
  | "negative"
  | "dry"
  | "wet"
  | "lightningImpulse"
  | "powerFrequency"
  | "switchingImpulse"
  | "wetPowerFrequency"
  | "ratedCurrent"
  | "breaking"
  | "leakageToGround"
  | "impulseBil"
  | "powerFreqWithstand"
  | "mechanicalDurability"
  | "up"
  | "down";

/** Datasheet wording — not translated; see the note above. */
const TECH_HEADERS: Record<TechHeaderKey, string> = {
  type: "Type",
  catalogNo: "Catalog No.",
  ratedVoltage: "Rated System Voltage (kV)",
  sml: "Specified mechanical load (kN)",
  couplingSize: "Coupling Size",
  sectionLength: "Section length (mm)",
  arcingDistance: "Arcing distance (mm)",
  shedDiameter: "Diameter of shed (mm)",
  shedSpacing: "Shed Spacing B (mm)",
  creepageDistance: "Creepage distance (mm)",
  weight: "Weight",
  notes: "Notes",
  positive: "Positive",
  negative: "Negative",
  dry: "Dry",
  wet: "Wet",
  lightningImpulse: "Lightning impulse flashover voltage (kV)",
  powerFrequency: "Power frequency flashover voltage (kV)",
  switchingImpulse: "Switching Impulse withstand Voltage (kV)",
  wetPowerFrequency: "Wet Power frequency flashover voltage (kV)",
  ratedCurrent: "Rated Current (A)",
  breaking: "Breaking (A)",
  leakageToGround: "Leakage To Ground Metal To Metal",
  impulseBil: "Impulse Voltage (BIL) (kV)",
  powerFreqWithstand: "Power Frequency Withstand Voltage (kV)",
  mechanicalDurability: "Mechanical Durability items",
  up: "Up (mm)",
  down: "Down (mm)",
};

/**
 * Technical-table headers — one set for both locales.
 *
 * Takes no locale on purpose: a parameter that is accepted and ignored reads
 * as an oversight. If a per-locale set is ever wanted, add it here and the
 * three call sites follow.
 */
export function techHeaders(): Record<TechHeaderKey, string> {
  return TECH_HEADERS;
}
