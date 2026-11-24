import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Digit convention for Persian copy.
 *
 * Persian digits for prose quantities (years, counts, ordinals, addresses);
 * LATIN digits for anything a reader cross-checks against a datasheet, a
 * standard or a keypad — voltages, loads, dimensions, DPL codes, IEC clause
 * numbers and phone numbers.
 *
 * Only the mechanical half of that is testable: a number carrying a unit is
 * a technical value, so it must not be written in Persian digits. The prose
 * half stays an editorial judgement.
 */
const FA_DIGIT = "۰-۹";
const LATIN_UNIT = /[۰-۹][۰-۹\s–\-/,،]*\s*(?:kV|kN|mm|kA|N·m)\b/;
const PERSIAN_UNIT = new RegExp(
  `[${FA_DIGIT}]+\\s*(?:کیلوولت|کیلونیوتن|میلی‌متر|کیلوآمپر)`,
);

type Entry = { where: string; text: string };

function walk(value: unknown, path = ""): Entry[] {
  if (typeof value === "string") return [{ where: path, text: value }];
  if (Array.isArray(value))
    return value.flatMap((v, i) => walk(v, `${path}[${i}]`));
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) =>
      walk(v, path ? `${path}.${k}` : k),
    );
  return [];
}

function offenders(entries: Entry[]): string[] {
  return entries
    .filter((e) => LATIN_UNIT.test(e.text) || PERSIAN_UNIT.test(e.text))
    .map((e) => `${e.where}: ${e.text.slice(0, 80)}`);
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

describe("Persian digit convention", () => {
  it("writes unit-bearing values in Latin digits in site content", () => {
    expect(offenders(walk(readJson("data/site-content.fa.json")))).toEqual([]);
  });

  it("writes unit-bearing values in Latin digits in product copy", () => {
    const data = readJson("data/products.json") as {
      products: Record<string, unknown>[];
    };
    const fa: Entry[] = [];
    for (const p of data.products) {
      for (const key of ["subFamily", "summary", "applications"]) {
        const field = p[key] as { fa?: string } | string | undefined;
        if (field && typeof field === "object" && field.fa) {
          fa.push({ where: `${String(p.id)}.${key}`, text: field.fa });
        }
      }
    }
    expect(offenders(fa)).toEqual([]);
  });

  it("writes unit-bearing values in Latin digits in the FA dictionary", () => {
    const sources = [
      "lib/i18n/dictionaries/fa.ts",
      "lib/i18n/section-copy.ts",
    ].map((path) => ({ where: path, text: readFileSync(path, "utf8") }));
    expect(offenders(sources)).toEqual([]);
  });
});
