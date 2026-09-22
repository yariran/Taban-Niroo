import type { ContentBlock, ContentItem } from "@/lib/cms-content-types";

import {
  COUNTRY_DATA,
  INTERACTIVE_COUNTRY_KEYS,
  type CountryDetails,
  type InteractiveCountryKey,
} from "./country-data";

export type MarketData = Record<InteractiveCountryKey, CountryDetails>;

export type MarketTotals = {
  markets: number;
  projects: number;
  since: number;
};

/**
 * Market figures, with the CMS layered over the built-in table.
 *
 * `COUNTRY_DATA` has always carried a note saying its numbers are
 * illustrative and should be replaced through the CMS — but nothing read
 * the CMS, so the only way to correct a project count was a deploy. The
 * `home.collection` block already declares an `items` list, and the
 * admin editor already renders label/value/body for each item; this is
 * the reader that was missing.
 *
 * Every field falls back independently. An item that names a market but
 * leaves `value` empty keeps the built-in counts and only replaces its
 * products; an item naming nothing recognisable is ignored rather than
 * dropping a market off the map.
 */

const KEY_BY_LOWERCASE = new Map<string, InteractiveCountryKey>(
  INTERACTIVE_COUNTRY_KEYS.map((key) => [key.toLowerCase(), key]),
);

/** Spellings an editor is likely to type that are not the canonical key. */
const EDITOR_ALIASES: Readonly<Record<string, InteractiveCountryKey>> = {
  türkiye: "Turkey",
  turkiye: "Turkey",
  "iran (hq)": "Iran",
  "islamic republic of iran": "Iran",
};

function matchMarket(label: string): InteractiveCountryKey | undefined {
  const normalised = label.trim().toLowerCase();
  return KEY_BY_LOWERCASE.get(normalised) ?? EDITOR_ALIASES[normalised];
}

/**
 * Folds Persian and Arabic-Indic digits onto ASCII.
 *
 * The content admin is a Persian-language interface, so "۱۴" is at least
 * as likely as "14" in these fields — and `\d` does not match either of
 * those ranges, so without this the number would be silently dropped and
 * the built-in default would stand with nothing to say why.
 */
function toAsciiDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const code = digit.charCodeAt(0);
    const base = code >= 0x06f0 ? 0x06f0 : 0x0660;
    return String(code - base);
  });
}

/**
 * Pulls a project count and a start year out of one free-text field.
 *
 * `ContentItem` is a fixed `{ label, value?, body? }`, so the two numbers
 * share `value`. A four-digit number in a plausible range is read as the
 * year and whatever other integer appears is the project count, which
 * makes "14", "14 · 2011" and "since 2011, 14 projects" all resolve.
 */
function parseFigures(value: string | undefined): {
  projects?: number;
  since?: number;
} {
  if (!value) return {};

  const numbers = [...toAsciiDigits(value).matchAll(/\d+/g)].map((match) =>
    Number(match[0]),
  );
  if (numbers.length === 0) return {};

  const yearIndex = numbers.findIndex(
    (candidate) => candidate >= 1900 && candidate <= 2100,
  );
  const since = yearIndex === -1 ? undefined : numbers[yearIndex];
  const projects = numbers.find((_, index) => index !== yearIndex);

  return { projects, since };
}

function parseProducts(body: string | undefined): string[] | undefined {
  if (!body) return undefined;

  // Latin and Arabic commas, plus newlines — editors use all three.
  const parts = body
    .split(/[,،\n]/)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts : undefined;
}

function applyItem(base: CountryDetails, item: ContentItem): CountryDetails {
  const { projects, since } = parseFigures(item.value);
  const products = parseProducts(item.body);

  return {
    name: base.name,
    projects: projects ?? base.projects,
    firstCooperation: since ?? base.firstCooperation,
    products: products ?? base.products,
  };
}

export function resolveMarkets(cms?: ContentBlock): {
  data: MarketData;
  totals: MarketTotals;
} {
  const data = { ...COUNTRY_DATA } as MarketData;

  for (const item of cms?.items ?? []) {
    const key = matchMarket(item.label ?? "");
    if (!key) continue;
    data[key] = applyItem(data[key], item);
  }

  const entries = Object.values(data);

  return {
    data,
    totals: {
      markets: entries.length,
      projects: entries.reduce((total, entry) => total + entry.projects, 0),
      since: Math.min(...entries.map((entry) => entry.firstCooperation)),
    },
  };
}
